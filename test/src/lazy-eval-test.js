var expect = require('chai').expect;
var hook = require('hook-std');
var memwatch = require('memwatch-next');

memwatch.on('leak', function(info) {
  console.log("LEAK");
  console.log(info);
  throw new Error("there is a LEAK");
  process.exit(500);
});

describe('lazy-eval', function () {

  var debug, unhook;

  describe('enabled', function () {
    before(function () {

      debug = require('../../src/debugFabFactory')();
      debug.save('enabled');
      debug.enable(debug.load())
      debug = debug('enabled');
      // console.log(debug);
    })

    function leakTest(testNum){
      it('handles functions' + testNum, function (done) {
        unhook = hook.stderr(function (str) {
          expect(str.match(/crap/)).to.be.ok;
          expect(str.match(/enabled/)).to.be.ok;
          done()
        });
        debug(function () {return 'crap';});
        unhook();
      });
    }

    // memory leak attempt
    for(var i = 0; i < 100;i++){
      leakTest(i);
    }

    it('normal', function (done) {
      unhook = hook.stderr(function (str) {
        expect(str.match(/crap/)).to.be.ok;
        expect(str.match(/enabled/)).to.be.ok;
        done()
      });
      debug('crap');
      unhook();
    });
  });

  describe('disabled', function () {
    before(function () {

      debug = require('../../src/debugFabFactory')();
      debug.save(null);
      debug.enable(debug.load())
      debug = debug('disabled');
    })

    it('handles functions', function () {
      var called = false;

      unhook = hook.stderr(function () {
        called = true;
      });

      debug(function () {
        called = true;
        return 'crap';
      });
      unhook();
      expect(called).to.not.be.ok;
    });

    it('normal', function () {
      var called = false;

      unhook = hook.stderr(function () {
        called = true;
      });

      debug('crap');
      unhook();
      expect(called).to.not.be.ok;
    });
  });

});
