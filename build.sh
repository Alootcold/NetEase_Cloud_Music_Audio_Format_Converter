#!/bin/bash

echo "Building NCM Converter..."

cd "$(dirname "$0")"

if [ ! -d "frontend/node_modules" ]; then
    echo "Installing frontend dependencies..."
    cd frontend
    pnpm install
    cd ..
fi

echo "Building frontend..."
cd frontend
pnpm build
cd ..

echo "Building application with Wails..."
wails build -platform=windows/amd64

echo "Build complete!"
