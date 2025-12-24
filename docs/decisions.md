# Colorist - Architectural Decisions

> Track important decisions made during development

---

## Decision Log

### DEC-001: Vanilla JavaScript for Phase 1
**Date**: Project Start  
**Decision**: Use vanilla JavaScript instead of React  
**Rationale**: 
- Simpler setup for learning Claude Code
- Smaller bundle size for extension
- Can migrate to React in Phase 4 if needed
- Faster iteration in early stages

**Trade-offs**:
- Manual DOM manipulation
- No component reusability (initially)
- State management is simple but not scalable

---

### DEC-002: Manifest V3
**Date**: Project Start  
**Decision**: Use Chrome Extension Manifest V3  
**Rationale**:
- Manifest V2 is deprecated
- Required for Chrome Web Store submission
- Better security model
- Service workers are the future

**Trade-offs**:
- More complex background script lifecycle
- Some APIs work differently
- Less community examples (yet)

---

### DEC-003: Chrome Storage API over localStorage
**Date**: Project Start  
**Decision**: Use `chrome.storage.local` instead of `localStorage`  
**Rationale**:
- Works in service workers
- Syncs across devices (if using `storage.sync`)
- Higher quota limits
- Proper async API

**Trade-offs**:
- Async only (no synchronous access)
- Slightly more verbose

---

### DEC-004: EyeDropper API as Primary Input
**Date**: Project Start  
**Decision**: Use native EyeDropper API  
**Rationale**:
- Native browser support (Chrome 95+)
- Clean user experience
- Works outside the extension popup
- No permissions headaches

**Trade-offs**:
- Chrome 95+ only
- Can't customize the eyedropper UI
- User must grant permission each time

---

## Pending Decisions

### PENDING-001: React Migration Timeline
**Status**: Deferred to Phase 4  
**Question**: When should we migrate popup to React?  
**Considerations**:
- Only if complexity justifies it
- Will need bundler setup (Vite?)
- Consider Preact for smaller size

### PENDING-002: Premium Feature Implementation
**Status**: Planning Phase  
**Question**: How to implement premium tier?  
**Options**:
- Chrome Web Store subscription
- External authentication (Firebase)
- Feature flags in storage

---

*Update this document when significant architectural decisions are made.*
