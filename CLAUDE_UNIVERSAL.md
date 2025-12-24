# 🛡️ CLAUDE.md — The Universal AI Coding Assistant Rulebook

> **VERSION**: 1.0 | **PURPOSE**: Prevent AI coding assistants from making costly, recurring mistakes
> **ORIGIN**: Distilled from 100+ hours of real failures, regressions, and hard-won lessons
> **AUDIENCE**: Any AI assistant (Claude, etc.) working on codebases with human collaborators

---

## 📋 TABLE OF CONTENTS

1. [The Prime Directive](#1-the-prime-directive)
2. [The Twelve Deadly Sins](#2-the-twelve-deadly-sins)
3. [The Pre-Flight Protocol](#3-the-pre-flight-protocol)
4. [The Git Commandments](#4-the-git-commandments)
5. [The Deployment Axioms](#5-the-deployment-axioms)
6. [The Session Continuity Protocol](#6-the-session-continuity-protocol)
7. [The Error Interpretation Guide](#7-the-error-interpretation-guide)
8. [The Architecture-First Mindset](#8-the-architecture-first-mindset)
9. [The Universal Quick Reference](#9-universal-quick-reference)

---

# 1. THE PRIME DIRECTIVE

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

**You have no memory of previous sessions.** Every conversation starts fresh. This means:
- You don't know what was built yesterday
- You don't know what patterns are already established
- You don't know what mistakes were already made
- You don't know what features exist or how they work

**The antidote**: Documentation. This file. Reading the codebase. Asking questions.

---

# 2. THE TWELVE DEADLY SINS

These mistakes have historically cost hours—sometimes entire days—to fix. Each sin is born from real failures.

## The Original Seven

| # | Sin | What It Looks Like | The Disaster | The Antidote |
|---|-----|-------------------|--------------|--------------|
| 1 | **Blind Deletion** | Deleting/recreating files instead of fixing them | Lost functionality, lost CSS, lost history | Use `git restore`, ask permission first |
| 2 | **Import Overwriting** | Replacing `import { A }` with `import { B }` | Missing functionality, broken features | ADD to imports: `import { A, B }` |
| 3 | **Premature Deployment** | Deploying without testing locally | Production failures, user-facing bugs | Always test locally first |
| 4 | **Feature Flag Blindness** | Adding code when a feature flag already exists | Code duplication, architectural rot | Check config files first |
| 5 | **URL/Config Hardcoding** | Hardcoding URLs, secrets, or environment-specific values | Works locally, breaks in production | Use environment variables |
| 6 | **Background Process Hiding** | Running servers with `&` or in background | Can't see crash logs, silent failures | Run in foreground for visibility |
| 7 | **Assumption Without Reading** | Guessing file structure or API signatures | Wrong implementations, wasted time | Read the code first |

## The Expanded Five (From Extended Battle-Testing)

| # | Sin | What It Looks Like | The Disaster | The Antidote |
|---|-----|-------------------|--------------|--------------|
| 8 | **Session Regression** | Overwriting changes from previous sessions | Lost features, frustrated users | Read files and ASK before editing |
| 9 | **Error Silencing** | Removing code to fix build errors | Features disappear, root cause hidden | Understand the error, fix properly |
| 10 | **Deploy Without Commit** | Deploying code that isn't committed to git | Next session overwrites everything | ALWAYS commit before deploy |
| 11 | **Unverified Fix Claims** | Saying "done" without testing | Bug still exists, trust erodes | Wait for user confirmation |
| 12 | **Strict String Matching** | Not handling variations, special chars, case | Phase assignments fail, lookups break | Use normalized/fuzzy matching |

---

# 3. THE PRE-FLIGHT PROTOCOL

## Before ANY Code Change

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    PRE-FLIGHT CHECKLIST                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  □ 1. Read CLAUDE.md (or equivalent project rules file)                 │
│  □ 2. Run `git status` — check for uncommitted changes                  │
│  □ 3. ASK: "Are there changes from previous sessions not committed?"    │
│  □ 4. READ the file(s) you're about to edit                             │
│  □ 5. Check config files for existing feature flags                     │
│  □ 6. SEARCH for similar existing code (grep/find before writing)       │
│  □ 7. FIND working examples before writing new code                     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## Before Adding UI Elements

```bash
# Search for existing similar elements before adding duplicates
grep -r "loading" src/components/
grep -r "status" src/
grep -r "indicator" src/
```

**Rule**: If similar UI already exists, understand why before adding more.

## Before Fixing Build/TypeScript Errors

```
□ Read the FULL error message
□ Understand WHY the error occurred
□ Check if the referenced code exists elsewhere
□ NEVER just remove code to silence errors
□ If removing unused imports, verify they're truly unused
```

---

# 4. THE GIT COMMANDMENTS

## The Commit-Deploy Axiom

```
✅ CORRECT:   Changes → Test → User Confirms → COMMIT → Deploy
❌ WRONG:     Changes → Test → Deploy → (forget commit) → DISASTER
```

**Deployment ≠ Version Control**. Deploying code does NOT save it. If you deploy without committing:
- Changes exist ONLY in production
- The next session will overwrite your uncommitted changes
- **Work will be lost. This has happened. It will happen again if you forget.**

## Before ANY Deployment Command

```bash
# 1. See all changes
git status

# 2. Stage all changes  
git add -A

# 3. Commit with clear description
git commit -m "feat: [describe what changed]"

# 4. Verify commit succeeded
git log -1

# 5. ONLY NOW proceed with deployment
```

## Git Recovery Commands

```bash
# See what changed
git diff

# Restore a specific file
git restore path/to/file

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Nuclear option — discard all uncommitted changes
git checkout -- .
```

---

# 5. THE DEPLOYMENT AXIOMS

## The URL Coupling Problem

Many deployment platforms (Cloud Run, Vercel, Netlify, etc.) generate **NEW URLs on every deployment**. This creates a coupling problem:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    THE URL COUPLING PROBLEM                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   BEFORE DEPLOY:                                                        │
│   Frontend → Backend at: service-OLD-URL.app ✓                          │
│                                                                         │
│   AFTER BACKEND DEPLOY:                                                 │
│   Backend URL changes to: service-NEW-URL.app                           │
│   Frontend still points to: service-OLD-URL.app ✗                       │
│                                                                         │
│   RESULT: All API calls fail (404 or CORS errors)                       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## The Correct Deployment Sequence

```
1. Deploy backend → Get new URL
2. Update frontend environment with new URL
3. Build frontend (with new URL baked in)
4. Deploy frontend
5. Hard refresh browser
6. Check logs for errors
```

**Solution**: Create a `deploy-all.sh` script that automates this sequence. Always use it.

## Environment Variables Are Sacred

| What | Rule |
|------|------|
| Secrets | NEVER in code or git history |
| URLs | NEVER hardcoded |
| Config | Use environment variables or config files |
| Local vs Prod | Different .env files for different environments |

## The CORS Deception

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    CORS ERRORS ARE LIARS                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  What you see in browser console:                                       │
│  ❌ "Access-Control-Allow-Origin header is not present"                 │
│                                                                         │
│  What's often actually happening:                                       │
│  ❌ Backend threw a 500 error                                           │
│  ❌ Server doesn't add CORS headers to error responses                  │
│  ❌ Browser interprets missing headers as CORS error                    │
│                                                                         │
│  ALWAYS CHECK SERVER LOGS FIRST                                         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

# 6. THE SESSION CONTINUITY PROTOCOL

## When Context Gets Long (>50% used)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                   SESSION CONTINUITY PROTOCOL                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   1. COMMIT all changes immediately:                                    │
│      git add . && git commit -m "WIP: [describe current state]"        │
│                                                                         │
│   2. CREATE session checkpoint:                                         │
│      ## Session Checkpoint - [Date] [Time]                              │
│      - Completed: [list]                                                │
│      - In Progress: [list]                                              │
│      - Pending: [list]                                                  │
│      - Known Issues: [list]                                             │
│                                                                         │
│   3. WARN the user:                                                     │
│      "Context is getting long. Let me commit changes and create a       │
│       checkpoint before we continue."                                   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## After EVERY Working Feature

```
□ Test the feature locally
□ Get user confirmation it works  
□ Commit to git: git add . && git commit -m "feat: description"
□ ONLY THEN deploy if requested
```

---

# 7. THE ERROR INTERPRETATION GUIDE

## Quick Diagnosis Table

| Symptom | Likely Cause | First Action |
|---------|-------------|--------------|
| CORS error | Backend 500 error hiding as CORS | Check server logs |
| 404 on API | Backend not deployed / wrong URL | Verify deployment & URL |
| 403 Forbidden | Auth token invalid/missing | Check auth configuration |
| 500 Internal | Missing env var or data issue | Check server logs |
| 503 Service | Cold start or service crashed | Retry, then check logs |
| Works locally, fails prod | Missing env vars in production | Compare configs |
| Old data showing | Browser cache | Hard refresh (Cmd+Shift+R) |
| AI response truncated | Safety filters or parsing | Check response handling |

## The Golden Rule

**When something fails, CHECK THE LOGS FIRST.**

90% of answers are in the logs. Don't guess. Don't assume. Read the logs.

---

# 8. THE ARCHITECTURE-FIRST MINDSET

## Before Making ANY Change, Answer These Questions

### A. Configuration & Feature Flags
- Does a config file exist? Read it first.
- Is there already a feature flag for this? Don't add duplicate code.
- If a flag is `false` but related code exists, **STOP and investigate**—there's a reason.

### B. Duplicate Logic Detection (RED FLAG)
If you see the same logic in multiple places, **STOP immediately**:
- Same function in multiple files? → Should be centralized
- Same prompt in backend AND frontend? → Architectural issue
- Intent handling in multiple locations? → Single source of truth needed

**Question**: "Why does this exist in two places? Which is the source of truth?"

**Rule**: NEVER add to duplicates—consolidate or remove instead.

### C. Single Source of Truth
Before adding logic, find if a centralized system exists:
- Prompts: Check for prompt manager, template system
- Configuration: Check config files before hardcoding
- API calls: Check for existing API client/service

**If centralized system exists, USE IT—don't duplicate.**

### D. When to Ask the User

When you see these patterns, **STOP and ask**:
- "I see X exists, but also Y. Which is the source of truth?"
- "This feature flag is disabled. Should I enable it or work around it?"
- "There's duplicate logic in these files. Which should I modify?"
- "This looks like it might break existing functionality. Want me to proceed?"

---

# 9. UNIVERSAL QUICK REFERENCE

## The 7 Golden Rules

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        THE 7 GOLDEN RULES                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   1. Check the logs FIRST when anything fails                           │
│   2. Use deployment scripts (deploy-all.sh) not manual steps            │
│   3. Test locally BEFORE deploying                                      │
│   4. Never assume—always verify                                         │
│   5. Commit after every working feature                                 │
│   6. Read files before editing them                                     │
│   7. Understand errors, don't just silence them                         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## Things Claude MUST NEVER Do

| Never | Why | Instead |
|-------|-----|---------|
| Delete files without permission | Irreversible, loses history | Ask first, use git restore |
| Remove imports (only replace) | Breaks functionality silently | Add to existing imports |
| Hardcode URLs or secrets | Breaks across environments | Use environment variables |
| Deploy without committing | Next session loses work | Always commit first |
| Remove code to fix errors | Hides root cause, loses features | Understand and fix properly |
| Claim fix works without testing | Erodes trust, wastes time | Wait for user confirmation |
| Run servers in background | Can't see errors | Run in foreground |
| Skip reading files first | Causes regression, duplication | Always read before edit |

## The Verification Ritual

After claiming any task is complete:
1. Show the command to run tests/linters
2. Provide a checklist of expected outputs
3. Wait for user confirmation
4. If database/config migrations, restate them explicitly
5. Only then is it truly "done"

---

# 📎 APPENDIX: CUSTOMIZING THIS DOCUMENT

## Project-Specific Sections to Add

When adapting this for a specific project, add:

```markdown
## Project Architecture
- Tech stack (frontend, backend, database)
- Critical file locations
- Data flow diagram

## Environment Configuration
- Required environment variables
- Secrets management
- Local vs production differences

## Deployment Commands
- Local development commands
- Build commands
- Deploy commands
- Log checking commands

## Known Failure Patterns
- Project-specific gotchas
- Platform limitations (e.g., Firestore 1MB limit)
- Common misconfigurations

## Lessons Learned
- Date-stamped entries of real failures
- Root causes and fixes
- Time lost and prevention strategies
```

---

*This document exists because real hours were lost. Every rule comes from a real failure.*

**When in doubt:**
1. Read the logs
2. Read the code
3. Ask the user
4. Don't assume

---

*Document Version: 1.0*  
*Purpose: Prevent AI coding assistants from repeating costly mistakes*  
*Principle: Every rule here was paid for in lost time*
