#!/bin/bash
# Hook: Remind Claude to read documentation before making changes
# Triggers on: Edit, Write tools

# Read hook input from stdin
read -t 1 hook_input 2>/dev/null || true

# Project root from environment
PROJECT_ROOT="${CLAUDE_PROJECT_DIR:-.}"

# Documentation files that should be read before editing
DOCS=(
  "CLAUDE.md"
  "CLAUDE_UNIVERSAL.md"
  "VIBE_CODING_PLAYBOOK.md"
)

# Build list of existing docs
existing_docs=""
for doc in "${DOCS[@]}"; do
  if [ -f "$PROJECT_ROOT/$doc" ]; then
    existing_docs="$existing_docs\n- $doc"
  fi
done

# Output JSON with system message reminder
cat <<EOF
{
  "continue": true,
  "systemMessage": "REMINDER: Before making changes, ensure you have read the following project documentation files:${existing_docs}\n\nThese files contain critical rules and guidelines for this project."
}
EOF

exit 0
