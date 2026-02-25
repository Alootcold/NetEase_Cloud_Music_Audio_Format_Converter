@echo off
cd /d "%~dp0"

echo Initializing git...
git init

echo Adding files...
git add .

echo Creating commit...
git commit -m "Initial commit: 网易云音乐NCM转换器"

echo Setting remote...
git remote add origin https://github.com/Alootcold/NetEase_Cloud_Music_Audio_Format_Converter.git

echo Pushing to GitHub...
git push -u origin main

echo Done!
pause
