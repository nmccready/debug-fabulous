module.exports = function debugFactory(debugApi, options) {
  var wrapLazyEval = require('./lazy-eval');
  var formatArgs = require('./formatArgs');

  options = options || {
    formatArgs: true
  };

  debugApi = debugApi ? debugApi : require('debug');
  debugApi = wrapLazyEval(debugApi);
  debugApi = formatArgs({
    debugApi: debugApi,
    options: options
  });

  return debugApi;
}
