import { Debug, Debugger } from 'debug';

export interface DebugLazy extends Debug {
  (namespace: string): DebuggerExt;
}

export interface DebugFabulous extends DebugLazy {
  (namespace: string): DebuggerExt;
  spawnable: (_namespace: string, _debugFabFactory?: Debug) => DebuggerExtSpawn;
}

export type LazyDebugFunc = () => string | any[];
// where any[] is really... formatter: any, ...args: any[]

export interface DebuggerExt extends Debugger {
  (lazyFunc: LazyDebugFunc): void;
  (...args: any[]): void;
  spawn: (ns: string) => DebuggerExt;
}

export interface DebuggerExtSpawn extends DebuggerExt {
  spawn: (ns: string) => DebuggerExt;
}
