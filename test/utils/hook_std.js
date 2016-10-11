
module.exports = function (stream) {
  stream = stream || process.stdout;

  return {
    setup: function(callback) {
      var write = stream.write;

      stream.write = (function(stub) {
        return function (string, encoding, fd) {
          stub.apply(stream, arguments);
          callback(string, encoding, fd);
        };
      })(stream.write);

      return function() {
        stream.write = write;
      };
    }
  }
}
