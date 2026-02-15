#!/bin/bash

echo "🚀 Starting KHNS OnTime with Quiz System..."
echo ""

# Check if .env exists in gemini-server
if [ ! -f "gemini-server/.env" ]; then
    echo "⚠️  Warning: gemini-server/.env not found!"
    echo "Creating from .env.example..."
    if [ -f "gemini-server/.env.example" ]; then
        cp gemini-server/.env.example gemini-server/.env
        echo "✅ Created gemini-server/.env"
        echo "⚡ Please edit gemini-server/.env and add your GEMINI_API_KEY"
        echo ""
    else
        echo "❌ gemini-server/.env.example not found!"
        exit 1
    fi
fi

# Check if node_modules exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing main app dependencies..."
    npm install
fi

if [ ! -d "gemini-server/node_modules" ]; then
    echo "📦 Installing server dependencies..."
    cd gemini-server && npm install && cd ..
fi

echo ""
echo "✨ Starting servers..."
echo "📡 API Server: http://localhost:3001"
echo "🌐 Main App: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Start both servers
# Use trap to kill both processes on Ctrl+C
trap 'kill $SERVER_PID $APP_PID; exit' INT TERM

# Start API server in background
cd gemini-server
npm run dev &
SERVER_PID=$!
cd ..

# Wait a bit for server to start
sleep 2

# Start main app
npm run dev &
APP_PID=$!

# Wait for both processes
wait
