import { MAGENTA, paint } from '../colors';
import { readEffort } from '../settings';
import type { StatusLineInput } from '../types';

/** `◆ Opus (high)` — model name with reasoning effort. Empty when no model. */
export function renderModel(input: StatusLineInput): string {
  const model = input.model?.display_name;
  if (!model) return '';
  const effort = input.effort?.level ?? readEffort();
  const label = effort ? `${model} (${effort})` : model;
  return paint(MAGENTA, `◆ ${label}`);
}
