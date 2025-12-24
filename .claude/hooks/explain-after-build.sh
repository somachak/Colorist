#!/bin/bash
# ============================================================================
# HOOK: Explain After Build
# ============================================================================
# PURPOSE: After creating/editing skills, agents, or hooks, remind Claude
#          to explain what was built in simple, educational terms.
#
# TRIGGERS: PostToolUse (after Edit or Write completes)
#
# HOW IT WORKS:
#   1. Receives JSON info about what tool just ran
#   2. Extracts the file path that was just modified
#   3. Checks if it's a skill, agent, or hook file
#   4. If yes, returns a JSON message reminding Claude to explain
# ============================================================================

# Read the input from Claude (comes as JSON through stdin)
# The "timeout 1" means: wait up to 1 second for input
input=$(timeout 1 cat 2>/dev/null || true)

# Try to extract the file path from the JSON input
# This uses 'grep' and 'sed' to find the file_path value
file_path=$(echo "$input" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/.*: *"//;s/"$//' | head -1)

# If we couldn't find a file path, exit silently (nothing to check)
if [ -z "$file_path" ]; then
    exit 0
fi

# ============================================================================
# CHECK: Is this a skill, agent, or hook file?
# ============================================================================
# We look for these patterns in the file path:
#   - .claude/skills/    → It's a skill file
#   - .claude/agents/    → It's an agent file
#   - .claude/hooks/     → It's a hook file
# ============================================================================

is_learning_file=false
file_type=""

if [[ "$file_path" == *".claude/skills/"* ]]; then
    is_learning_file=true
    file_type="SKILL"
elif [[ "$file_path" == *".claude/agents/"* ]]; then
    is_learning_file=true
    file_type="AGENT"
elif [[ "$file_path" == *".claude/hooks/"* ]]; then
    is_learning_file=true
    file_type="HOOK"
fi

# If it's not a learning-related file, exit silently
if [ "$is_learning_file" = false ]; then
    exit 0
fi

# ============================================================================
# OUTPUT: Send reminder message back to Claude
# ============================================================================
# The JSON format tells Claude:
#   - "continue": true  → Don't block anything, just add info
#   - "systemMessage"   → A message Claude will see and act on
# ============================================================================

cat <<EOF
{
  "continue": true,
  "systemMessage": "LEARNING MOMENT: You just created or modified a ${file_type} file (${file_path}). Please now explain to the user:\\n\\n1. WHAT: What does this ${file_type} do in simple terms?\\n2. WHY: Why is it useful for this project?\\n3. HOW: How does it work (high-level, non-technical)?\\n4. EXAMPLE: Give a real-world analogy if possible.\\n\\nRemember: Explain like you're teaching someone who has never coded before."
}
EOF

exit 0
