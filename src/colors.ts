/** ANSI escape codes used across the status line. */
export const CYAN = '\x1b[36m';
export const MAGENTA = '\x1b[35m';
export const YELLOW = '\x1b[33m';
export const GREEN = '\x1b[32m';
export const ORANGE = '\x1b[38;5;208m';
export const RED = '\x1b[31m';
export const DIM = '\x1b[2m';
export const RESET = '\x1b[0m';

/** Wrap `text` in a color, resetting afterwards. */
export function paint(color: string, text: string): string {
  return `${color}${text}${RESET}`;
}
