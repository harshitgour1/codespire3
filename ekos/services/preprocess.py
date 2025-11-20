"""Preprocessing service for OCR/STT and chunking."""

import logging
import os
from typing import Any, Dict, List, Optional

import pandas as pd

from app.config import Settings, get_settings

logger = logging.getLogger(__name__)


class PreprocessService:
    """Service for document preprocessing (OCR, STT, chunking)."""

    def __init__(self, settings: Settings | None = None):
        """Initialize preprocessing service."""
        self.settings = settings or get_settings()

    async def process_document(
        self, doc_id: str, file_path: Optional[str] = None, options: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Process document with OCR/STT and chunking.

        Args:
            doc_id: Document ID
            file_path: Path to document file
            options: Processing options (ocr, stt, chunking)

        Returns:
            Processing result with chunks
        """
        options = options or {}
        enable_ocr = options.get("ocr", False)
        enable_stt = options.get("stt", False)
        chunk_size = options.get("chunk_size", 1000)
        chunk_overlap = options.get("chunk_overlap", 200)

        chunks = []

        if file_path and os.path.exists(file_path):
            # Detect file type
            ext = os.path.splitext(file_path)[1].lower()

            if ext in [".xlsx", ".xls", ".csv"]:
                # Process spreadsheet
                chunks = await self._process_spreadsheet(file_path, chunk_size, chunk_overlap)
            elif ext in [".txt", ".md"]:
                # Process text file
                with open(file_path, "r", encoding="utf-8") as f:
                    text = f.read()
                chunks = await self._chunk_text(text, chunk_size, chunk_overlap)
            elif ext in [".pdf"]:
                # Process PDF
                # TODO: Implement PDF extraction
                logger.warning("PDF processing not yet implemented")
                chunks = []
            elif ext in [".jpg", ".jpeg", ".png", ".gif", ".webp"]:
                # Process image with OCR
                if enable_ocr:
                    chunks = await self._process_image_ocr(file_path)
                else:
                    chunks = []
            elif ext in [".mp3", ".wav", ".m4a", ".ogg"]:
                # Process audio with STT
                if enable_stt:
                    chunks = await self._process_audio_stt(file_path)
                else:
                    chunks = []
            else:
                logger.warning(f"Unsupported file type: {ext}")

        result = {
            "doc_id": doc_id,
            "chunks": chunks,
            "chunk_count": len(chunks),
            "status": "success" if chunks else "no_chunks",
        }

        return result

    async def _process_spreadsheet(
        self, file_path: str, chunk_size: int = 1000, chunk_overlap: int = 200
    ) -> List[Dict[str, Any]]:
        """
        Process spreadsheet and convert rows to synthetic docs/chunks.

        Args:
            file_path: Path to spreadsheet file
            chunk_size: Size of each chunk
            chunk_overlap: Overlap between chunks

        Returns:
            List of chunks with metadata
        """
        chunks = []

        try:
            # Read spreadsheet
            if file_path.endswith(".csv"):
                df = pd.read_csv(file_path)
            else:
                df = pd.read_excel(file_path)

            # Convert each row to a synthetic document
            for idx, row in df.iterrows():
                # Create synthetic document text from row data
                row_text = " | ".join([f"{col}: {row[col]}" for col in df.columns if pd.notna(row[col])])
                row_metadata = {
                    "row_index": int(idx),
                    "columns": list(df.columns),
                    "row_data": {col: str(row[col]) for col in df.columns if pd.notna(row[col])},
                }

                # Chunk the row text
                row_chunks = await self._chunk_text(row_text, chunk_size, chunk_overlap)

                # Add row metadata to each chunk
                for chunk_idx, chunk in enumerate(row_chunks):
                    chunk["metadata"]["row_index"] = int(idx)
                    chunk["metadata"]["chunk_index"] = chunk_idx
                    chunk["metadata"]["row_data"] = row_metadata["row_data"]

                chunks.extend(row_chunks)

            logger.info(f"Processed spreadsheet: {len(df)} rows -> {len(chunks)} chunks")

        except Exception as e:
            logger.error(f"Error processing spreadsheet: {e}")
            raise

        return chunks

    async def _chunk_text(
        self, text: str, chunk_size: int = 1000, chunk_overlap: int = 200
    ) -> List[Dict[str, Any]]:
        """
        Chunk text into smaller pieces.

        Args:
            text: Input text
            chunk_size: Size of each chunk
            chunk_overlap: Overlap between chunks

        Returns:
            List of chunks with metadata
        """
        chunks = []
        start = 0

        while start < len(text):
            end = start + chunk_size
            chunk_text = text[start:end]

            # Try to end at sentence boundary
            if end < len(text):
                last_period = chunk_text.rfind(".")
                last_newline = chunk_text.rfind("\n")
                boundary = max(last_period, last_newline)
                if boundary > chunk_size * 0.5:  # Only adjust if reasonable
                    end = start + boundary + 1
                    chunk_text = text[start:end]

            chunk = {
                "text": chunk_text.strip(),
                "metadata": {
                    "chunk_start": start,
                    "chunk_end": end,
                    "chunk_length": len(chunk_text),
                },
            }
            chunks.append(chunk)

            # Move start position with overlap
            start = end - chunk_overlap
            if start >= len(text):
                break

        return chunks

    async def _process_image_ocr(self, file_path: str) -> List[Dict[str, Any]]:
        """
        Process image with OCR.

        Args:
            file_path: Path to image file

        Returns:
            List of chunks with OCR text
        """
        # TODO: Implement Google Cloud Vision OCR
        # from google.cloud import vision
        # client = vision.ImageAnnotatorClient()
        # with open(file_path, "rb") as image_file:
        #     content = image_file.read()
        # image = vision.Image(content=content)
        # response = client.text_detection(image=image)
        # texts = response.text_annotations
        # if texts:
        #     return [{"text": texts[0].description, "metadata": {"ocr": True}}]

        # Mock OCR
        logger.warning("OCR not yet implemented. Using mock response.")
        return [
            {
                "text": f"[MOCK OCR] Extracted text from image: {os.path.basename(file_path)}",
                "metadata": {"ocr": True, "file_path": file_path},
            }
        ]

    async def _process_audio_stt(self, file_path: str) -> List[Dict[str, Any]]:
        """
        Process audio with Speech-to-Text.

        Args:
            file_path: Path to audio file

        Returns:
            List of chunks with transcript
        """
        # TODO: Implement Whisper or Google Cloud Speech-to-Text
        # import whisper
        # model = whisper.load_model("base")
        # result = model.transcribe(file_path)
        # transcript = result["text"]
        # return [{"text": transcript, "metadata": {"stt": True, "language": result.get("language")}}]

        # Mock STT
        logger.warning("STT not yet implemented. Using mock response.")
        return [
            {
                "text": f"[MOCK STT] Transcribed audio from: {os.path.basename(file_path)}",
                "metadata": {"stt": True, "file_path": file_path},
            }
        ]


# Singleton instance
_preprocess_service: Optional[PreprocessService] = None


def get_preprocess_service() -> PreprocessService:
    """Get singleton preprocessing service instance."""
    global _preprocess_service
    if _preprocess_service is None:
        _preprocess_service = PreprocessService()
    return _preprocess_service

