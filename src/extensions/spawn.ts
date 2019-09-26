import { Debugger } from 'debug';
import { DebuggerExtSpawn, DebugFabulous } from '../internals';

export default function spawnFactory(
  namespace: string = '',
  debugFabFactory: DebugFabulous = require('../debugFabFactory')()
): DebuggerExtSpawn {
  function createDebugger(base: string = '', ns: string = ''): DebuggerExtSpawn {
    const newNs = ns ? [base, ns].join(':') : base;
    const debug = debugFabFactory(newNs) as DebuggerExtSpawn;

    debug.spawn = spawn;
    return debug;
  }

  function spawn(this: Debugger, ns: string) {
    return createDebugger(this.namespace, ns);
  }

  return createDebugger(namespace);
}
