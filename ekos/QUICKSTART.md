# Quick Start - Get Search Bar Working

## Step 1: Start the Backend

In the root directory (where `app/` is):

```bash
# Activate virtual environment (if not already)
# Windows:
venv\Scripts\activate

# Linux/Mac:
source venv/bin/activate

# Start the FastAPI server
uvicorn app.main:app --reload --port 8000
```

The backend will be available at: http://localhost:8000

## Step 2: Start the Frontend

In the `web/` directory:

```bash
# Install dependencies (if not already done)
npm install

# Start the development server
npm run dev
```

The frontend will be available at: http://localhost:5173

## Step 3: Test the Search

1. Open http://localhost:5173 in your browser
2. Navigate to the Search page
3. Type a query in the search bar and press Enter
4. The search should now connect to the backend API!

## Configuration

### Backend (app/.env)
Make sure you have a `.env` file in the root directory with at least:
```
GEMINI_API_KEY=your-key-here  # Optional for prototype (will use mock)
```

### Frontend (web/.env)
Create a `.env` file in the `web/` directory:
```
VITE_API_BASE_URL=http://localhost:8000
VITE_MOCK_MODE=false
```

## Troubleshooting

### Search bar not working?

1. **Check if backend is running**: Visit http://localhost:8000/health
   - Should return `{"status": "healthy"}`

2. **Check browser console**: Open DevTools (F12) and look for errors
   - Network errors mean backend isn't running
   - CORS errors mean CORS isn't configured (it should be)

3. **Check API response**: In DevTools Network tab, look for the `/query` request
   - Should return 200 OK with a QueryResponse

4. **Fallback to mock mode**: If backend isn't available, the frontend will automatically fall back to mock responses for the prototype

### CORS Errors?

The backend already has CORS configured for:
- `http://localhost:3000`
- `http://localhost:5173`

If you're using a different port, add it to `CORS_ORIGINS` in `app/.env`:
```
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Backend not found?

If you see `ERR_NETWORK` or connection errors:
1. Make sure the backend is running on port 8000
2. Check the `VITE_API_BASE_URL` in `web/.env`
3. The frontend will automatically use mock data as a fallback for the prototype

## What Was Fixed

1. ✅ **SearchBar component**: Added state management to track input value
2. ✅ **API Client**: Fixed mock mode detection logic
3. ✅ **Query API**: Added proper error handling with fallback to mock
4. ✅ **Vite Proxy**: Added proxy configuration for seamless dev experience
5. ✅ **CORS**: Backend already configured for frontend origins

The search bar now:
- Captures user input properly
- Calls the backend `/query` endpoint
- Falls back to mock data if backend is unavailable (for prototype)
- Displays results in the UI

## Next Steps

Once the search is working:
1. Add some test documents via `/ingest/url` or `/ingest/upload`
2. The mock vector store will work without configuration
3. For production, configure Pinecone, Neo4j, and Gemini API keys

