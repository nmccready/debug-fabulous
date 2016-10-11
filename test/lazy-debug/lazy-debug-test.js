var expect = require('chai').expect;
var packageName = require('../../package.json').name;
var path = require('path');
var fileNamespace = path.basename(__filename).replace(path.extname(__filename), '')

describe('lazy-debug', function () {

  var lazyDebug = require('../../index.js')()

  describe('#get(filename, submoduleName)', function () {
    it('returns named debug instance', function () {
      lazyDebug.get(__filename)('it works, I hope');
    });
  });
  describe('#getModuleDebugName(filename, submoduleName)', function () {
    it('gives debug name for file', function () {
      var name = lazyDebug.getModuleDebugName(__filename);
      expect(name).to.equal(packageName + ':test:' + 'lazy-debug:' + fileNamespace);
    });
    it('attaches submodule name if given', function () {
      var name = lazyDebug.getModuleDebugName(__filename, 'test2');
      expect(name).to.equal(packageName + ':test:' + 'lazy-debug:' + fileNamespace + ':test2');
    });
  });
  describe('#configure', function () {
    it('can set filter function', function () {
      lazyDebug.configure({
        filter: function (pathArr) {
          if ( pathArr && pathArr.length > 0 ) {
            if ( pathArr[0] === 'test' )
              pathArr.shift();
          }
          return pathArr;
        }
      });
      var name = lazyDebug.getModuleDebugName(__filename);
      expect(name).to.equal(packageName + ':' + 'lazy-debug:' + fileNamespace);
    });
  });
});
