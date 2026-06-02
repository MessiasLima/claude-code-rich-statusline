import { renderBranch } from './segments/branch';
import { renderContext } from './segments/context';
import { renderModel } from './segments/model';
import { renderProject } from './segments/project';
import { renderUpdateIndicator } from './segments/update-indicator';
import { renderUsage } from './segments/usage';
import type { StatusLineInput } from './types';

const SEPARATOR = ' · ';

/** Line 1: context · model · project · branch · update-indicator. */
export function buildLine1(input: StatusLineInput): string {
  return [
    renderContext(input),
    renderModel(input),
    renderProject(input),
    renderBranch(input),
    renderUpdateIndicator(),
  ]
    .filter(Boolean)
    .join(SEPARATOR);
}

/** Line 2: plan rate-limit usage bars (empty when unavailable). */
export function buildLine2(input: StatusLineInput): string {
  return renderUsage(input);
}
