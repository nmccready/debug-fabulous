var lazyDebug = require('lazy-debug');

function wrapLazy(debug){
  debug.get = lazyDebug.get;
  debug.getModuleDebugName = lazyDebug.getModuleDebugName;
  debug.configure = lazyDebug.configure;
}

module.exports = wrapLazy;
