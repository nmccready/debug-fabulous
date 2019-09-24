import { Debug } from 'debug';
import { DebugLazy } from './internals';
import lazy from './lazy-eval';

function debugFactory(debugApi: Debug = require('debug')): DebugLazy {
  debugApi = lazy(debugApi);
  return debugApi as DebugLazy;
}

module.exports = debugFactory;

export default debugFactory;
