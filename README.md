# 网易云音乐 NCM 格式转换器

一款简洁美观的 Windows 桌面应用程序，用于将网易云音乐加密的 NCM 格式转换为标准的 MP3/FLAC 格式。

## 功能特点

- 🎵 **格式转换**: 支持 NCM 转 MP3/FLAC
- 🎨 **美观界面**: 现代化 UI 设计，网易云音乐风格配色
- 📁 **批量处理**: 支持添加多个文件或整个文件夹
- 💾 **灵活保存**: 可选择保存在源文件目录或自定义目录
- 🖼️ **保留元信息**: 自动保留歌曲名称、歌手、专辑及专辑封面
- 🌙 **主题支持**: 支持浅色/深色主题自动切换
- 🖱️ **拖拽支持**: 支持拖拽 NCM 文件到窗口

注：本仓库不提供编译后的程序，如需使用需clone本仓库后按照构建方法编译后出现exe程序，方可运行。

## 技术栈

- **后端**: Go + Wails v2
- **前端**: React + TypeScript + FluentUI + Tailwind CSS
- **解密核心**: 基于 ncmdump-go

## 环境要求

- Windows 10/11
- WebView2 运行时（大多数 Windows 已自带）

## 构建方法

```bash
# 克隆项目
git clone https://github.com/your-username/NetEase_Cloud_Music_Audio_Format_Converter.git
cd NetEase_Cloud_Music_Audio_Format_Converter

# 安装前端依赖
cd frontend
pnpm install
cd ..

# 构建应用
wails build
```

## 使用方法

1. 运行 `ncm-converter.exe`
2. 点击"添加文件"或"添加文件夹"选择 NCM 文件
3. 选择保存位置（源目录或自定义目录）
4. 点击"开始转换"
5. 转换完成后，文件保存在指定目录

## 许可证

MIT License
