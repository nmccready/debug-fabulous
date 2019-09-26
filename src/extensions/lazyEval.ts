import { Debug, Debugger } from 'debug';
import memoize from 'memoizee';
import { LazyDebugFunc } from '../internals';

const extend = (_debugger: Debugger) => {
  const wrapped = (formatter: any, ...args: any[]) => {
    if (typeof formatter === 'function') {
      const ret = (formatter as LazyDebugFunc)();
      const toApply: any[] = Array.isArray(ret) ? ret : [ret];
      // @ts-ignore
      return _debugger(...toApply);
    }
    return _debugger(formatter, ...args);
  };

  return Object.assign(wrapped, _debugger);
};

const lazyEval = (debugInst: Debug) => {
  function debug(namespace) {
    function noop() {}
    const instance = debugInst(namespace);
    if (!instance.enabled) {
      return Object.assign(noop, instance);
    }
    return extend(instance);
  }

  const debugMemoized = memoize(debug);

  return Object.assign(debugMemoized, debugInst);
};

export default lazyEval;
