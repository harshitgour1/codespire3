# EKOS - Enterprise Knowledge OS

Production-ready FastAPI backend for enterprise knowledge management with multimodal AI capabilities.

## Features

- 🔍 **RAG (Retrieval Augmented Generation)** with vector embeddings
- 🖼️ **Multimodal AI** via Gemini (text, vision, audio)
- 📊 **Knowledge Graph** integration (Neo4j)
- 🔄 **Background Processing** with Redis/Celery workers
- 🔗 **n8n Integration** for workflow automation
- 📁 **Document Ingestion** (URLs, uploads, spreadsheets)
- 🔐 **Authentication & Authorization** (JWT)

## Quick Start

### 1. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env and add your API keys:
# - GEMINI_API_KEY (required)
# - PINECONE_API_KEY (optional, for vector DB)
# - NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD (optional, for KG)
# - REDIS_URL (optional, for background workers)
```

### 2. Install Dependencies

```bash
# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Linux/Mac)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Run Locally

```bash
# Start the FastAPI server
uvicorn app.main:app --reload --port 8000

# In another terminal, start the worker (optional)
celery -A workers.worker_ingest worker --loglevel=info
```

### 4. Run with Docker

```bash
# Build and start all services
docker-compose up --build

# API will be available at http://localhost:8000
# API docs at http://localhost:8000/docs
```

## Project Structure

```
ekos/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application entry point
│   ├── config.py            # Configuration management
│   ├── dependencies.py      # Shared dependencies (auth, db)
│   ├── models/              # Pydantic schemas
│   │   ├── __init__.py
│   │   ├── ingest.py
│   │   ├── query.py
│   │   └── common.py
│   └── routers/             # API route handlers
│       ├── __init__.py
│       ├── ingest.py        # Document ingestion endpoints
│       ├── preprocess.py    # OCR/STT preprocessing
│       ├── query.py         # RAG query endpoint
│       ├── screenshot.py    # Screenshot matching
│       ├── automation.py    # Automation stubs (Jira, etc.)
│       ├── webhook.py       # n8n webhook handlers
│       └── health.py        # Health checks
├── services/
│   ├── __init__.py
│   ├── gemini_client.py     # Gemini API wrapper (text/vision/audio)
│   ├── embeddings.py        # Embedding generation
│   ├── vector_store.py      # Pinecone/Weaviate adapter
│   ├── preprocess.py        # OCR/STT processing
│   ├── kg_service.py        # Neo4j knowledge graph service
│   └── auth.py              # JWT/OAuth utilities
├── workers/
│   ├── __init__.py
│   └── worker_ingest.py     # Background ingestion worker
├── tests/
│   ├── __init__.py
│   ├── test_health.py
│   └── test_ingest.py
├── infra/
│   └── n8n_workflows.json   # Example n8n workflow definitions
├── .env.example             # Environment variables template
├── requirements.txt         # Python dependencies
├── pyproject.toml           # Project config (ruff/black)
├── Dockerfile               # Container definition
├── docker-compose.yml       # Multi-service orchestration
└── .github/
    └── workflows/
        └── ci.yml           # GitHub Actions CI/CD

```

## API Endpoints

- `POST /ingest/url` - Ingest document from URL
- `POST /ingest/upload` - Upload file (multipart/form-data)
- `POST /preprocess/{doc_id}` - Trigger OCR/STT + chunking
- `POST /vectors/upsert` - Upsert chunk embeddings
- `POST /query` - Main RAG query endpoint
- `POST /screenshot-match` - Match screenshot to knowledge base
- `POST /automation/create-jira` - Create Jira ticket (stub)
- `POST /webhook/n8n/connector-callback` - n8n webhook handler
- `GET /health` - Health check

See `/docs` for interactive API documentation.

## Development

### Run Tests

```bash
pytest tests/ -v
```

### Linting & Formatting

```bash
# Format code
black app/ services/ workers/

# Lint code
ruff check app/ services/ workers/

# Type checking (optional)
mypy app/ services/ workers/
```

## Configuration

All configuration is managed via environment variables (see `.env.example`). For production, consider using:
- Google Secret Manager
- AWS Secrets Manager
- HashiCorp Vault

## TODO

- [ ] Replace mock services with real implementations:
  - [ ] Gemini API client (add `GEMINI_API_KEY` to `.env`)
  - [ ] Pinecone vector store (add `PINECONE_API_KEY`)
  - [ ] Neo4j knowledge graph (add `NEO4J_URI`, `NEO4J_USER`, `NEO4J_PASSWORD`)
  - [ ] Redis for Celery broker (add `REDIS_URL`)
- [ ] Implement authentication middleware
- [ ] Add database models (SQLAlchemy) for documents/metadata
- [ ] Implement rate limiting
- [ ] Add monitoring/logging (Prometheus, Sentry)
- [ ] Set up production deployment (Kubernetes/GKE)

## License

Proprietary - Enterprise Knowledge OS

