"""Gemini API client wrapper for multimodal calls (text, vision, audio)."""

import base64
import json
import logging
from typing import Any, Dict, List, Optional

import google.generativeai as genai

from app.config import Settings, get_settings

logger = logging.getLogger(__name__)


class GeminiClient:
    """Client wrapper for Google Gemini API."""

    def __init__(self, settings: Settings | None = None):
        """Initialize Gemini client with API key."""
        self.settings = settings or get_settings()
        self.api_key = self.settings.get_gemini_api_key()

        if not self.api_key:
            logger.warning("GEMINI_API_KEY not found. Gemini features will be mocked.")
            self.model = None
        else:
            genai.configure(api_key=self.api_key)
            # Use gemini-pro-vision for multimodal support
            self.model = genai.GenerativeModel("gemini-pro-vision")

    async def generate_text(
        self,
        prompt: str,
        system_instruction: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 2048,
    ) -> str:
        """
        Generate text using Gemini.

        Args:
            prompt: Input prompt
            system_instruction: System instruction (if supported)
            temperature: Sampling temperature
            max_tokens: Maximum tokens to generate

        Returns:
            Generated text
        """
        if not self.model:
            # Mock response
            return f"[MOCK] Generated response for: {prompt[:50]}..."

        try:
            # Build prompt with system instruction if provided
            full_prompt = prompt
            if system_instruction:
                full_prompt = f"{system_instruction}\n\n{prompt}"

            response = self.model.generate_content(
                full_prompt,
                generation_config={
                    "temperature": temperature,
                    "max_output_tokens": max_tokens,
                },
            )

            return response.text
        except Exception as e:
            logger.error(f"Error generating text: {e}")
            raise

    async def generate_with_image(
        self,
        prompt: str,
        image_base64: str,
        mime_type: str = "image/jpeg",
    ) -> str:
        """
        Generate text with image input (vision).

        Args:
            prompt: Text prompt
            image_base64: Base64 encoded image
            mime_type: MIME type of the image

        Returns:
            Generated text with image understanding
        """
        if not self.model:
            # Mock response
            return f"[MOCK] Generated vision response for image with prompt: {prompt[:50]}..."

        try:
            # Decode base64 image
            image_data = base64.b64decode(image_base64)
            import PIL.Image
            from io import BytesIO

            image = PIL.Image.open(BytesIO(image_data))

            response = self.model.generate_content([prompt, image])
            return response.text
        except Exception as e:
            logger.error(f"Error generating with image: {e}")
            raise

    async def generate_with_audio(
        self,
        prompt: str,
        audio_base64: str,
        mime_type: str = "audio/mpeg",
    ) -> str:
        """
        Generate text with audio input.

        Args:
            prompt: Text prompt
            audio_base64: Base64 encoded audio
            mime_type: MIME type of the audio

        Returns:
            Generated text with audio understanding
        """
        if not self.model:
            # Mock response
            return f"[MOCK] Generated audio response for audio with prompt: {prompt[:50]}..."

        # TODO: Implement audio processing when Gemini audio API is available
        # For now, return mock response
        logger.warning("Audio processing not yet implemented in Gemini client")
        return f"[MOCK] Audio processing response for: {prompt[:50]}..."

    async def synthesize_rag_response(
        self,
        query: str,
        context_chunks: List[Dict[str, Any]],
        include_citations: bool = True,
    ) -> Dict[str, Any]:
        """
        Synthesize RAG response from query and context chunks.

        Args:
            query: User query
            context_chunks: List of relevant chunks with metadata
            include_citations: Whether to include citations

        Returns:
            Structured response with summary, timeline, citations, actions
        """
        # Build context from chunks
        context_text = "\n\n".join(
            [
                f"Chunk {i+1} (doc_id: {chunk.get('doc_id', 'unknown')}):\n{chunk.get('text', '')}"
                for i, chunk in enumerate(context_chunks)
            ]
        )

        # Prompt template requesting structured JSON output
        prompt = f"""You are a helpful AI assistant answering questions based on the provided context.

Query: {query}

Context:
{context_text}

Please provide a comprehensive answer in JSON format with the following structure:
{{
    "answer": "Direct answer to the query",
    "summary": "Brief summary (2-3 sentences)",
    "timeline": [
        {{
            "date": "ISO date string or null",
            "title": "Event title",
            "description": "Event description",
            "source": "Source identifier"
        }}
    ],
    "citations": [
        {{
            "doc_id": "document ID",
            "chunk_id": "chunk ID",
            "text": "relevant text snippet",
            "score": 0.95
        }}
    ],
    "actions": [
        {{
            "action": "action type (e.g., 'create_jira', 'send_email')",
            "title": "Action title",
            "description": "Action description",
            "priority": "high|medium|low"
        }}
    ]
}}

Ensure all citations reference the provided chunks accurately. Return ONLY valid JSON."""

        try:
            response_text = await self.generate_text(
                prompt,
                temperature=0.3,  # Lower temperature for more factual responses
                max_tokens=2048,
            )

            # Parse JSON response
            # Remove markdown code blocks if present
            response_text = response_text.strip()
            if response_text.startswith("```json"):
                response_text = response_text[7:]
            if response_text.startswith("```"):
                response_text = response_text[3:]
            if response_text.endswith("```"):
                response_text = response_text[:-3]
            response_text = response_text.strip()

            response_data = json.loads(response_text)

            # Map citations to actual chunk IDs if provided
            if include_citations and "citations" in response_data:
                for citation in response_data["citations"]:
                    # Match citation to actual chunks
                    for i, chunk in enumerate(context_chunks):
                        if chunk.get("text", "").startswith(citation.get("text", "")[:50]):
                            citation["doc_id"] = chunk.get("doc_id", "unknown")
                            citation["chunk_id"] = chunk.get("chunk_id", f"chunk_{i}")
                            citation["score"] = chunk.get("score", 0.0)
                            break

            return response_data
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse JSON response: {e}")
            # Fallback response
            return {
                "answer": response_text if "response_text" in locals() else "Error parsing response",
                "summary": "Unable to generate structured response",
                "timeline": [],
                "citations": [
                    {
                        "doc_id": chunk.get("doc_id", "unknown"),
                        "chunk_id": chunk.get("chunk_id", "unknown"),
                        "text": chunk.get("text", "")[:200],
                        "score": chunk.get("score", 0.0),
                    }
                    for chunk in context_chunks[:3]
                ],
                "actions": [],
            }
        except Exception as e:
            logger.error(f"Error synthesizing RAG response: {e}")
            raise

    async def screenshot_match_prompt(
        self,
        image_base64: str,
        existing_screenshots: List[Dict[str, Any]],
    ) -> List[Dict[str, Any]]:
        """
        Match screenshot to existing screenshots or content.

        Args:
            image_base64: Base64 encoded screenshot
            existing_screenshots: List of existing screenshots with metadata

        Returns:
            List of matches with scores
        """
        if not self.model:
            # Mock matches
            return [
                {
                    "doc_id": "doc_1",
                    "chunk_id": "chunk_1",
                    "score": 0.85,
                    "text": "Mock matched content",
                    "metadata": {},
                }
            ]

        # Build prompt for screenshot matching
        screenshot_descriptions = "\n".join(
            [
                f"Screenshot {i+1} (doc_id: {s.get('doc_id', 'unknown')}): {s.get('description', 'No description')}"
                for i, s in enumerate(existing_screenshots[:10])  # Limit to top 10
            ]
        )

        prompt = f"""Analyze this screenshot and match it to the following existing screenshots or content:

{screenshot_descriptions}

Return a JSON array of matches with the following structure:
[
    {{
        "doc_id": "document ID",
        "chunk_id": "chunk ID",
        "score": 0.95,
        "description": "Why this matches",
        "similarity": "high|medium|low"
    }}
]

Return ONLY valid JSON array."""

        try:
            response_text = await self.generate_with_image(prompt, image_base64)
            # Parse JSON
            response_text = response_text.strip()
            if response_text.startswith("```json"):
                response_text = response_text[7:]
            if response_text.startswith("```"):
                response_text = response_text[3:]
            if response_text.endswith("```"):
                response_text = response_text[:-3]
            response_text = response_text.strip()

            matches = json.loads(response_text)
            return matches
        except Exception as e:
            logger.error(f"Error matching screenshot: {e}")
            # Return mock matches
            return [
                {
                    "doc_id": "doc_1",
                    "chunk_id": "chunk_1",
                    "score": 0.75,
                    "text": "Mock match",
                    "metadata": {},
                }
            ]

    async def meeting_triage_prompt(
        self,
        transcript: str,
        image_base64: Optional[str] = None,
        audio_base64: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Analyze meeting transcript and generate structured output (triage).

        Args:
            transcript: Meeting transcript text
            image_base64: Optional screenshot from meeting
            audio_base64: Optional audio recording

        Returns:
            Structured meeting analysis
        """
        # Build multimodal input
        inputs = [transcript]

        prompt = f"""Analyze this meeting transcript and extract key information:

Transcript:
{transcript[:5000]}  # Limit transcript length

Return a JSON object with the following structure:
{{
    "summary": "Meeting summary (2-3 sentences)",
    "key_points": ["point1", "point2", ...],
    "action_items": [
        {{
            "action": "action type",
            "title": "Action title",
            "assignee": "name or null",
            "priority": "high|medium|low",
            "due_date": "ISO date or null"
        }}
    ],
    "decisions": ["decision1", "decision2", ...],
    "participants": ["name1", "name2", ...],
    "next_steps": ["step1", "step2", ...]
}}

Return ONLY valid JSON."""

        if image_base64:
            response_text = await self.generate_with_image(prompt, image_base64)
        elif audio_base64:
            response_text = await self.generate_with_audio(prompt, audio_base64)
        else:
            response_text = await self.generate_text(prompt, temperature=0.3)

        try:
            # Parse JSON
            response_text = response_text.strip()
            if response_text.startswith("```json"):
                response_text = response_text[7:]
            if response_text.startswith("```"):
                response_text = response_text[3:]
            if response_text.endswith("```"):
                response_text = response_text[:-3]
            response_text = response_text.strip()

            return json.loads(response_text)
        except Exception as e:
            logger.error(f"Error parsing meeting triage response: {e}")
            return {
                "summary": "Unable to analyze meeting",
                "key_points": [],
                "action_items": [],
                "decisions": [],
                "participants": [],
                "next_steps": [],
            }


# Singleton instance
_gemini_client: Optional[GeminiClient] = None


def get_gemini_client() -> GeminiClient:
    """Get singleton Gemini client instance."""
    global _gemini_client
    if _gemini_client is None:
        _gemini_client = GeminiClient()
    return _gemini_client

