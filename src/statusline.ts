import type { StatuslineConfig } from './config';
import { renderBranch } from './segments/branch';
import { renderContext } from './segments/context';
import { renderDirectory } from './segments/directory';
import { renderModel } from './segments/model';
import { renderUpdateIndicator } from './segments/update-indicator';
import { renderUsage } from './segments/usage';
import type { StatusLineInput } from './types';

/** Line 1: context · model · directory · branch · update-indicator. */
export function buildLine1(input: StatusLineInput, config: StatuslineConfig): string {
  return [
    renderContext(input, config.icons),
    renderModel(input, config.icons),
    renderDirectory(input, config.icons),
    renderBranch(input, config.icons),
    renderUpdateIndicator(config.icons),
  ]
    .filter(Boolean)
    .join(config.separator);
}

/** Line 2: plan rate-limit usage bars (empty when unavailable). */
export function buildLine2(input: StatusLineInput, config: StatuslineConfig): string {
  return renderUsage(input, config);
}
