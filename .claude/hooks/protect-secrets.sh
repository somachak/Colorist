#!/bin/bash

# Colorist Security Hook: Protect Secrets
# Runs before Claude accesses any file
# Exit code 2 = Block the action

FILE_PATH="$1"

# Block access to sensitive files
if [[ "$FILE_PATH" == *".env"* ]] || \
   [[ "$FILE_PATH" == *".env.local"* ]] || \
   [[ "$FILE_PATH" == *"service-account"* ]] || \
   [[ "$FILE_PATH" == *".pem"* ]] || \
   [[ "$FILE_PATH" == *".key"* ]]; then
  
  echo "🛑 BLOCKED: Access to sensitive file denied"
  echo "   File: $FILE_PATH"
  echo "   Reason: This file may contain API keys or secrets"
  exit 2
fi

# Allow all other files
exit 0
