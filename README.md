# 🎨 Colorist

**Intelligent Design Extraction Chrome Extension**

Extract colors, typography, and design patterns from any webpage or image. Unlike other color pickers, Colorist understands the *role* each color plays—is it the primary brand color? An accent? A background?

---

## ✨ Features

### Phase 1 (Current)
- 💧 **Eyedropper Tool** — Pick any color from live web pages
- 📋 **Paste Support** — Paste screenshots or images
- 📁 **Upload Support** — Upload images for palette extraction
- 🎨 **Smart Palette Generation** — Automatically generate harmonious colors
- 💾 **Save & Export** — Save palettes and export as CSS variables

### Coming Soon
- 🏷️ **Context Intelligence** — Understand what role each color plays
- 📝 **Typography Analysis** — Capture fonts, sizes, and hierarchy
- ♿ **Accessibility Scoring** — WCAG compliance checking
- 📤 **Multi-format Export** — Tailwind, Figma, Canva, Sass

---

## 🚀 Getting Started

### Installation (Developer Mode)

1. Clone or download this repository
2. Open Chrome and go to `chrome://extensions`
3. Enable **Developer mode** (toggle in top-right)
4. Click **Load unpacked**
5. Select the `extension` folder

### Usage

1. Click the Colorist icon in your toolbar
2. Click **Pick Color** to use the eyedropper
3. Or paste/upload an image
4. View your generated palette
5. Click any color to copy it
6. Save palettes for later

---

## 📁 Project Structure

```
Colorist/
├── extension/           # Chrome Extension
│   ├── manifest.json    # Extension config
│   ├── popup/           # Popup UI
│   ├── background/      # Service worker
│   ├── content-scripts/ # Page injection
│   ├── styles/          # CSS files
│   └── icons/           # Extension icons
│
├── .claude/             # Claude Code config
│   ├── skills/          # AI expertise
│   ├── hooks/           # Automation
│   └── agents/          # Specialists
│
├── docs/                # Documentation
├── CLAUDE.md            # AI assistant rules
└── .env                 # API keys (not committed)
```

---

## 🛠️ Development

### Prerequisites
- Chrome 95+ (for EyeDropper API)
- Git

### Local Development

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/colorist.git
cd colorist

# Make changes to files in /extension

# Reload extension in Chrome
# (Click refresh icon on extension card)
```

### Using Claude Code

```bash
# Open project in Claude Code
cd ~/Desktop/Coding/Colorist
claude

# Claude will read CLAUDE.md automatically
```

---

## 🔑 Environment Variables

Create a `.env` file in the root (never commit this):

```
GEMINI_API_KEY=your_key_here
```

---

## 📝 License

MIT License — Use freely, attribution appreciated.

---

## 🙏 Acknowledgments

- Built with [Claude Code](https://claude.ai)
- Inspired by the pain of using Coolors for live pages
- Color theory from centuries of artistic tradition

---

*Made with 🎨 by a color enthusiast*
