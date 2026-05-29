#!/usr/bin/env bash
# Claude Code status line script
# Reads JSON from stdin and outputs a status line

# ANSI colors
CYAN='\033[36m'
MAGENTA='\033[35m'
YELLOW='\033[33m'
GREEN='\033[32m'
BLUE='\033[34m'
RED='\033[31m'
RESET='\033[0m'

# Progress bar helper: $1 = percentage (may be float, e.g. 23.5)
# Outputs a 10-char [█░] bar, color-coded by threshold
bar() {
  local pct=${1%.*}; [ -z "$pct" ] && pct=0
  local filled=$(( (pct * 10 + 50) / 100 )); [ "$filled" -gt 10 ] && filled=10
  local color="$GREEN"; [ "$pct" -ge 50 ] && color="$YELLOW"; [ "$pct" -ge 80 ] && color="$RED"
  local b='' i
  for ((i=0; i<filled; i++)); do b="${b}█"; done
  for ((i=filled; i<10; i++)); do b="${b}░"; done
  printf '%b[%s]%b %s%%' "$color" "$b" "$RESET" "$pct"
}

# Read stdin
input=$(cat)

# --- Extract fields ---
used_pct=$(echo "$input" | jq -r '.context_window.used_percentage // empty')
model=$(echo "$input" | jq -r '.model.display_name // empty')
current_dir=$(echo "$input" | jq -r '.workspace.current_dir // empty')
session_name=$(echo "$input" | jq -r '.session_name // empty')

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

# --- Line 2: Claude Code usage (rate limits, Pro/Max only) ---
# Only present after the first API response; absent entirely for non-Pro/Max users
IFS=$'\t' read -r five_pct five_reset seven_pct seven_reset <<<"$(
  echo "$input" | jq -r '[
    .rate_limits.five_hour.used_percentage // "",
    .rate_limits.five_hour.resets_at       // "",
    .rate_limits.seven_day.used_percentage // "",
    .rate_limits.seven_day.resets_at       // ""
  ] | @tsv')"

line2=""
if [ -n "$five_pct" ]; then
  seg="⏱ $(bar "$five_pct")"
  [ -n "$five_reset" ] && seg="$seg (resets $(date -r "$five_reset" "+%H:%M"))"
  line2="$seg"
fi
if [ -n "$seven_pct" ]; then
  seg="📅 $(bar "$seven_pct")"
  [ -n "$seven_reset" ] && seg="$seg (resets $(date -r "$seven_reset" "+%a"))"
  line2="${line2:+$line2$sep}$seg"
fi

[ -n "$line2" ] && printf "%b\n" "$line2"
