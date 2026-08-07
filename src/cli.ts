import { readConfig } from './config';
import { readInput } from './input';
import { buildLine1, buildLine2 } from './statusline';
import { maybeTriggerUpdate } from './update/trigger';

const input = readInput();
const config = readConfig();

// Print first so render latency is never affected by anything below.
console.log(buildLine1(input, config));
const line2 = buildLine2(input, config);
if (line2) console.log(line2);

// Fire-and-forget, throttled background update check.
maybeTriggerUpdate();
