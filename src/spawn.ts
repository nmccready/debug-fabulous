import { Debug } from 'debug';
import { DebuggerExt, DebugFabulous } from './internals';

export default function spawnFactory(
  namespace: string = '',
  debugFabFactory: DebugFabulous = require('./debugFabFactory')()
): DebuggerExt {
  function spawn(ns: string) {
    // this is this.debug (from Debugger)
    var dbg = new Debugger(this.namespace, ns);

    return dbg.debug;
  }

  function Debugger(base: string = '', ns: string = '') {
    const newNs = ns ? [base, ns].join(':') : base;
    const debug = debugFabFactory(newNs);

    this.debug = debug;
    this.debug.spawn = spawn;
  }

  const rootDebug = new Debugger(namespace).debug as DebuggerExt;

  return rootDebug;
}
