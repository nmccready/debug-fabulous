import { Debug } from 'debug';
import { DebugLazy } from './internals';
import lazyEval from './extensions/lazyEval';

function debugFactory(debugApi: Debug = require('debug')): DebugLazy {
  debugApi = lazyEval(debugApi);
  return debugApi as DebugLazy;
}

module.exports = debugFactory;

export default debugFactory;
