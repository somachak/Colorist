# 🎨 CLAUDE.md — Colorist Chrome Extension

> **PROJECT**: Colorist - Intelligent Design Extraction Extension
> **VERSION**: 0.1.0 | **STATUS**: Initial Development
> **BASED ON**: Universal AI Coding Assistant Rulebook v1.0

---

## 📋 PROJECT OVERVIEW

**Colorist** is a Chrome extension that extracts colors, typography, and design patterns from any webpage or image. Unlike Coolors, it works directly on live pages and provides context intelligence (understanding *what role* each color plays).

### Core Features (Phased)
1. **Phase 1**: Eyedropper + Smart Palette Generation
2. **Phase 2**: Context Intelligence (Primary, Background, Accent, CTA)
3. **Phase 3**: Typography Analysis
4. **Phase 4**: Accessibility Scoring (WCAG)
5. **Phase 5**: Export Powerhouse (CSS, Tailwind, Figma, Canva)

---

## 🏗️ PROJECT ARCHITECTURE

```
Colorist/
├── extension/                    # Chrome Extension (Manifest V3)
│   ├── manifest.json             # Extension configuration
│   ├── popup/                    # Popup UI (HTML/CSS/JS)
│   ├── content-scripts/          # Injected into pages
│   ├── background/               # Service worker
│   └── styles/                   # Shared CSS
│
├── .claude/                      # Claude Code Configuration
│   ├── skills/                   # Auto-triggered expertise
│   ├── hooks/                    # Protection & automation
│   └── agents/                   # Specialized sub-agents
│
├── docs/                         # Documentation
├── .env                          # API keys (NEVER COMMIT)
├── .gitignore                    # Git exclusions
└── CLAUDE.md                     # This file
```

### Tech Stack
- **Extension**: Vanilla JavaScript (Manifest V3)
- **UI**: HTML + CSS (no framework initially)
- **AI**: Google Gemini API (for color insights)
- **Storage**: Chrome Storage API
- **Future**: React for popup, Firebase for sync

---

## 🛡️ THE PRIME DIRECTIVE

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         THE PRIME DIRECTIVE                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   READ before you write.                                                │
│   UNDERSTAND before you fix.                                            │
│   VERIFY before you claim.                                              │
│   COMMIT before you deploy.                                             │
│   ASK before you delete.                                                │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**You have no memory of previous sessions.** Every conversation starts fresh.

---

## ⚠️ CRITICAL CONSTRAINTS

### Files You Must NEVER Modify Without Permission
- `.env` — Contains API keys
- `manifest.json` — After initial setup, changes break the extension
- Any file in `.claude/hooks/` — Security configurations

### Environment Variables
| Variable | Purpose | Location |
|----------|---------|----------|
| `GEMINI_API_KEY` | AI color insights | `.env` |

### Chrome Extension Specifics
- **Manifest V3** is required (V2 is deprecated)
- Content scripts run in isolated worlds
- Service workers replace background pages
- Use `chrome.storage` not `localStorage`

---

## 📝 PRE-FLIGHT CHECKLIST

Before ANY code change:

```
□ 1. Read this CLAUDE.md file
□ 2. Run `git status` — check for uncommitted changes
□ 3. ASK: "Are there changes from previous sessions?"
□ 4. READ the file(s) you're about to edit
□ 5. Check manifest.json for existing permissions
□ 6. SEARCH for similar existing code before adding new
□ 7. Test in Chrome after every change
```

---

## 🔧 DEVELOPMENT COMMANDS

### Local Development
```bash
# Navigate to project
cd ~/Desktop/Coding/Colorist

# Check git status
git status

# Load extension in Chrome:
# 1. Go to chrome://extensions
# 2. Enable "Developer mode"
# 3. Click "Load unpacked"
# 4. Select the /extension folder
```

### After Changes
```bash
# Reload extension in Chrome:
# Click the refresh icon on your extension card

# Or use keyboard shortcut (if configured)
```

### Git Workflow
```bash
# Stage all changes
git add -A

# Commit with clear message
git commit -m "feat: description of change"

# Push to GitHub
git push origin main
```

---

## 🎯 INPUT METHODS (Phase 1)

Colorist accepts colors through four channels:

| Method | Implementation | Status |
|--------|---------------|--------|
| **Eyedropper** | EyeDropper API (Chrome 95+) | 🔲 To Build |
| **Page Images** | Canvas API extraction | 🔲 To Build |
| **Paste/Drop** | Clipboard + Drag events | 🔲 To Build |
| **Upload** | FileReader → Canvas | 🔲 To Build |

---

## 🎨 COLOR EXTRACTION ALGORITHM

For images, use **dominant color extraction** (not random sampling):

1. Draw image to hidden canvas
2. Get pixel data via `getImageData()`
3. Apply K-Means or Median Cut algorithm
4. Return top 5-8 colors ranked by visual weight
5. Label each color's percentage of total pixels

---

## 📚 LESSONS LEARNED

*(Add entries as we discover issues)*

| Date | Issue | Root Cause | Prevention |
|------|-------|------------|------------|
| — | — | — | — |

---

## ✅ SESSION CHECKPOINT TEMPLATE

When context gets long, create a checkpoint:

```markdown
## Session Checkpoint - [Date] [Time]

### Completed
- [ ] List completed items

### In Progress
- [ ] Current work

### Pending
- [ ] Next steps

### Known Issues
- [ ] Any bugs or blockers

### Files Modified
- path/to/file.js
```

---

## 🚫 THE TWELVE DEADLY SINS

| # | Sin | Antidote |
|---|-----|----------|
| 1 | Blind Deletion | Ask permission first |
| 2 | Import Overwriting | ADD to imports, don't replace |
| 3 | Premature Deployment | Test locally first |
| 4 | Feature Flag Blindness | Check config files first |
| 5 | URL/Config Hardcoding | Use environment variables |
| 6 | Background Process Hiding | Run in foreground |
| 7 | Assumption Without Reading | Read the code first |
| 8 | Session Regression | Read files and ASK before editing |
| 9 | Error Silencing | Understand, don't just remove |
| 10 | Deploy Without Commit | ALWAYS commit first |
| 11 | Unverified Fix Claims | Wait for user confirmation |
| 12 | Strict String Matching | Use normalized matching |

---

*Every rule here was paid for in lost time.*

**When in doubt:**
1. Read the logs
2. Read the code
3. Ask the user
4. Don't assume

---

*Document Version: 1.0*
*Project: Colorist Chrome Extension*
