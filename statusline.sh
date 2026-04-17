#!/usr/bin/env bash
# Claude Code status line script
# Reads JSON from stdin and outputs a status line

# ANSI colors
CYAN='\033[36m'
MAGENTA='\033[35m'
YELLOW='\033[33m'
GREEN='\033[32m'
BLUE='\033[34m'
RESET='\033[0m'

# Read stdin
input=$(cat)

# --- Extract fields ---
IFS=$'\t' read -r used_pct model current_dir branch_json < <(echo "$input" | jq -r '[
  .context_window.used_percentage // "",
  .model.display_name // "",
  .workspace.current_dir // "",
  .git_state.branch // ""
] | @tsv')

# --- Effort level from settings ---
effort=$(jq -r '.effortLevel // empty' ~/.claude/settings.local.json 2>/dev/null)
[ -z "$effort" ] && effort=$(jq -r '.effortLevel // empty' ~/.claude/settings.json 2>/dev/null)

# --- Project folder (last path component) ---
if [ -n "$current_dir" ]; then
  project=$(basename "$current_dir")
else
  project=""
fi

# --- Git branch ---
branch="$branch_json"
if [ -z "$branch" ]; then
  branch=$(git -C "$current_dir" branch --show-current 2>/dev/null || true)
fi

# --- Build line 1 ---
# Context % · Model · Project · Branch
line1=""
sep=" · "

if [ -n "$used_pct" ]; then
  line1="${CYAN}◈ ${used_pct}%${RESET}"
fi

if [ -n "$model" ]; then
  [ -n "$line1" ] && line1="${line1}${sep}"
  model_str="$model"
  [ -n "$effort" ] && model_str="${model} (${effort})"
  line1="${line1}${MAGENTA}◆ ${model_str}${RESET}"
fi

if [ -n "$project" ]; then
  [ -n "$line1" ] && line1="${line1}${sep}"
  line1="${line1}${YELLOW}⌂ ${project}${RESET}"
fi

if [ -n "$branch" ]; then
  [ -n "$line1" ] && line1="${line1}${sep}"
  line1="${line1}${GREEN}⎇ ${branch}${RESET}"
fi

# --- Output ---
printf "%b\n" "$line1"
