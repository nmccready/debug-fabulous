import _fabulous from './debugFabFactory';
import spawnable from './extensions/spawn';
import { DebugFabulous } from './internals';

export * from './internals';

const fabulous = (Object.assign(_fabulous, { spawnable }) as unknown) as DebugFabulous;

module.exports = fabulous;
export default fabulous;
