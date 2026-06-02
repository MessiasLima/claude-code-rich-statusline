/** Shape of the JSON Claude Code pipes to a status line command on stdin. */
export interface StatusLineInput {
  model?: { display_name?: string };
  workspace?: { current_dir?: string };
  context_window?: { used_percentage?: number | null };
  effort?: { level?: string };
  session_name?: string;
  rate_limits?: {
    five_hour?: RateLimitWindow;
    seven_day?: RateLimitWindow;
  };
}

export interface RateLimitWindow {
  used_percentage?: number | null;
  /** Unix epoch seconds when the window resets. */
  resets_at?: number | null;
}
