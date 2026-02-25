#!/bin/bash
cd "$(dirname "$0")"

echo "Initializing git repository..."
git init

echo "Adding files..."
git add .

echo "Creating initial commit..."
git commit -m "Initial commit: 网易云音乐NCM转换器"

echo "Setting remote..."
git remote add origin https://github.com/your-username/NetEase_Cloud_Music_Audio_Format_Converter.git

echo "Done! Please run:"
echo "  git push -u origin main"
