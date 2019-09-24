import { Debug, Debugger } from 'debug';
import memoize from 'memoizee';

const lazyExtend = (_debugger: Debugger) => {
  const wrapped = (formatter: any, ...args: any[]) => {
    // lazy function eval to keep output memory pressure down, if not used
    if (typeof formatter === 'function') {
      formatter = formatter();
    }
    return _debugger(formatter, ...args);
  };

  return Object.assign(wrapped, _debugger);
};

const lazy = (debugInst: Debug) => {
  function debug(namespace) {
    function noop() {}
    const instance = debugInst(namespace);
    /*
      If we're not enabled then don't attempt to log anything.
      Therefore when a  debug namespace wraps its debug in a
      closure then it never allocates anything but the function itself
    */
    if (!instance.enabled) {
      return Object.assign(noop, instance);
    }
    return lazyExtend(instance);
  }

  const debugMemoized = memoize(debug);

  return Object.assign(debugMemoized, debugInst);
};

export default lazy;
