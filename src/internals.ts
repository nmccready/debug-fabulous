import { Debug, Debugger } from 'debug';

export interface DebugLazy extends Debug {
  (namespace: string): DebuggerExt;
}

export interface DebugFabulous extends DebugLazy {
  (namespace: string): DebuggerExt;
  spawnable: (_namespace: string, _debugFabFactory: Debug) => DebuggerExtSpawn;
}

export interface DebuggerExt extends Debugger {
  (lazyFunc: () => string, formatter: any, ...args: any[]): void;
}

export interface DebuggerExtSpawn extends DebuggerExt {
  spawn: (ns: string) => DebuggerExt;
}
