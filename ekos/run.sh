#!/bin/bash
# Quick start script for EKOS backend

echo "Starting EKOS Backend..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Check for .env file
if [ ! -f ".env" ]; then
    echo "Warning: .env file not found. Copying from .env.example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "Please edit .env and add your API keys."
    else
        echo "Error: .env.example not found. Please create .env manually."
        exit 1
    fi
fi

# Create uploads directory
mkdir -p uploads

# Start the server
echo "Starting FastAPI server..."
uvicorn app.main:app --reload --port 8000

