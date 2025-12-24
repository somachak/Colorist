# 🎯 VIBE-CODING PLAYBOOK — How to Collaborate with AI on Code

> **PURPOSE**: A guide for humans working with AI coding assistants
> **COMPANION TO**: CLAUDE.md (the rules for the AI)
> **AUDIENCE**: Non-technical collaborators who guide AI through coding sessions

---

## 📋 TABLE OF CONTENTS

1. [Session Grounding](#1-session-grounding)
2. [Memory Locking](#2-memory-locking)
3. [Task Framing](#3-task-framing)
4. [The Edit Protocol](#4-the-edit-protocol)
5. [Context Hygiene](#5-context-hygiene)
6. [Persistence Over Memory](#6-persistence-over-memory)
7. [Safety Rails](#7-safety-rails)
8. [The Verification Ritual](#8-the-verification-ritual)
9. [Project Blueprint Template](#9-project-blueprint-template)

---

# 1. SESSION GROUNDING

## Start Every Session With a Grounding Prompt

Paste this (customized for your project) at the start of each conversation:

```
You are editing the Colorist Chrome Extension repository.

Before making ANY changes:
1. Read CLAUDE.md for the rules
2. Run `git status` to check the state
3. Ask me if there are uncommitted changes from previous sessions

Key constraints:
- Tech stack: Vanilla JS Chrome Extension (Manifest V3) + Gemini API
- Never delete existing code without asking
- Maintain architecture parity
- When unsure, ask before changing

Read CLAUDE.md now and acknowledge the key rules.
```

## Why This Matters

Each AI session starts with **zero memory**. Without grounding:
- It doesn't know your architecture
- It doesn't know what mistakes have been made before
- It doesn't know what patterns are established
- It WILL repeat previous failures

---

# 2. MEMORY LOCKING

## Verify the AI Understood

After the grounding prompt, ask:

> "Repeat back the key guardrails for this project: the tech stack, the APIs, the input methods, and the non-goals."

**If the echo is incorrect, correct it before proceeding.**

This is your insurance policy. If the AI can't accurately repeat your constraints, it doesn't understand them.

## Example Memory Check

**You**: "What's our tech stack?"
**AI**: "React frontend with Node backend..."
**You**: "Wrong. It's vanilla JavaScript Chrome Extension with Manifest V3. Please note that."

---

# 3. TASK FRAMING

## Use Short, Numbered Objectives

Bad:
> "Add the eyedropper feature"

Good:
> "1. Add eyedropper functionality
> - Use the EyeDropper API
> - Trigger from popup button click
> - Display picked color in hex, RGB, and HSL
> - Copy hex to clipboard on pick
> - Success: I can click a button, pick a color, see it displayed"

## The Perfect Task Structure

```
Objective: [One sentence]
Inputs: [What data it receives]
Outputs: [What it returns]
Acceptance Test: [How we know it works]
Constraints: [What it must NOT do]
```

---

# 4. THE EDIT PROTOCOL

## Before Code Is Written

1. **Request explicit file list**: "Which files will you modify?"
2. **Request planned diffs**: "What changes will you make to each file?"
3. **Approve the plan** before any code is written

## During Edits

- **Prefer small, incremental changes** over large rewrites
- **Prefer adding new files** to replacing long blocks
- **Require the AI to keep irreversible changes minimal**

## After Changes

Request a **patch summary**:
> "Show me a summary of what changed in each file."

---

# 5. CONTEXT HYGIENE

## Keep Conversations Narrow

- Start a **new chat** for major features
- Re-paste the grounding prompt in each new chat
- Don't try to do everything in one mega-session

## Summarize Every ~20 Turns

When a conversation gets long:

> "Let's pause. Summarize:
> 1. What we've decided
> 2. What constraints we established
> 3. What's still pending"

Ask the AI to acknowledge the summary before continuing.

## Watch for Context Exhaustion

Signs the AI is losing context:
- Repeating information you already provided
- Forgetting constraints you established
- Making mistakes it was warned about earlier

**Solution**: Start a new conversation, paste the grounding prompt, and paste the summary.

---

# 6. PERSISTENCE OVER MEMORY

## Move Decisions Into Documents

Don't rely on chat history. When important decisions are made:

1. Have the AI update CLAUDE.md
2. Have the AI add to `docs/decisions.md`
3. Have the AI create a feature-specific notes file

## Maintain a "Do Not Touch" List

For stable flows, maintain a list in CLAUDE.md:

```markdown
## DO NOT MODIFY WITHOUT EXPLICIT APPROVAL
- manifest.json — Extension configuration
- .env — API keys
- .claude/hooks/ — Security configurations
```

---

# 7. SAFETY RAILS

## Explicit Prohibitions

Tell the AI what it must NEVER do:

```
NEVER do any of the following without explicit permission:
- Delete or rename files
- Modify manifest.json permissions
- Access or display .env contents
- Remove existing functionality
- Change Chrome storage schemas (breaking changes)
```

## Require Backwards Compatibility

When refactoring:
> "This change must be backwards-compatible. Existing saved palettes must still work."

---

# 8. THE VERIFICATION RITUAL

## After Every Claimed Completion

Don't trust "Done!" — verify:

1. **Ask for test steps**:
   > "How do I test this in Chrome?"

2. **Ask for expected outputs**:
   > "What should I see when I click the eyedropper button?"

3. **Ask about reload requirements**:
   > "Do I need to reload the extension?"

4. **Ask about permissions**:
   > "Did this require any new permissions in manifest.json?"

## The "Show Me" Test

If the AI claims something is fixed:
> "Show me the exact change you made."

If it can't show you, it probably didn't work.

---

# 9. PROJECT BLUEPRINT TEMPLATE

## Colorist Blueprint

### Purpose
Chrome extension that extracts colors, typography, and design patterns from any webpage or image, providing context intelligence about each element's role.

### Audience & Permissions
- Designers, developers, content creators
- No account required for free tier
- Premium features via subscription (future)

### Jobs to Be Done
1. Pick colors from live web pages
2. Extract palettes from images (upload, paste, or on-page)
3. Understand color roles (primary, accent, background, CTA)
4. Analyze typography (font, size, weight, line-height)
5. Check accessibility (WCAG compliance)
6. Export to various formats (CSS, Tailwind, Figma, Canva)

### Tech Stack
- Extension: Vanilla JavaScript (Manifest V3)
- UI: HTML + CSS
- AI: Google Gemini API
- Storage: Chrome Storage API
- Future: React, Firebase

### Input Methods
- Eyedropper (EyeDropper API)
- Page images (Canvas extraction)
- Paste/Drop (Clipboard API)
- Upload (FileReader API)

### Non-Goals
- Full design system management (that's Figma's job)
- Photo editing capabilities
- Font licensing/purchasing
- Storing user data on servers (initially)

### Known Constraints
- EyeDropper API requires Chrome 95+
- Manifest V3 requires service workers
- Canvas has CORS restrictions on cross-origin images
- Chrome Storage has 5MB limit

---

# 📎 APPENDIX: QUICK SCRIPTS

## For Starting a Session

```
Hey Claude, we're working on Colorist Chrome Extension.

Before we start:
1. Read CLAUDE.md
2. Run `git status`
3. Tell me if there are uncommitted changes

Our stack is Vanilla JS Chrome Extension (Manifest V3) with Gemini API.
Today we're working on [FEATURE].
```

## For Ending a Session

```
Before we wrap up:
1. Commit all changes: `git add . && git commit -m "[message]"`
2. Show me `git log -1` to verify
3. Update CLAUDE.md with any new lessons learned
4. List what's still pending for next session
```

## For Recovering from Disasters

```
Something broke. Let's recover:
1. Run `git status` — what's changed?
2. Run `git diff` — show me the changes
3. If we need to revert: `git restore [file]`
4. Don't make any more changes until we understand what happened
```

---

*This playbook exists because communication breakdowns cost hours.*
*Clear protocols = fewer disasters.*

---

*Document Version: 1.0*
*Companion to: CLAUDE.md*
*Purpose: Help humans collaborate effectively with AI coding assistants*
