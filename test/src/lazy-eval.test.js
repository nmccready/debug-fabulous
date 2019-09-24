var hook = require('hook-std');
var memwatch = require('node-memwatch');
var debugFact = require('../../src/debugFabFactory')();

memwatch.on('leak', function(info) {
  console.log("LEAK");
  console.log(info);
  throw new Error("there is a LEAK");
  process.exit(500);
});

var heapDiff = new memwatch.HeapDiff();

describe('lazy-eval', function () {

  var debug, unhook, date;

  beforeEach(function(){
    date = Date.now();
  })

  afterAll(function(){
    var hde = heapDiff.end();
    var change = hde.change;
    change.details = null;

    console.log(JSON.stringify({
      before: hde.before,
      after: hde.after,
      change: change
    }, null, 2));
    console.log("lazy-eval-test.js Total time: " + (Date.now() - date));
  })

  describe('enabled', function () {
    beforeEach(function () {
      debugFact.save('enabled');
      debugFact.enable(debugFact.load())
      debug = debugFact('enabled');
      // console.log(debug);
    })

    it('handles functions', function (done) {
      unhook = hook.stderr(function (str) {
        expect(str.match(/crap/)).toBeTruthy;
        expect(str.match(/enabled/)).toBeTruthy;
        done()
      });
      debug(function () {return 'crap';});
      unhook();
    });


    it('leak', function () {
      // memory leak attempt
      for(var i = 0; i < 1000;i++){
        debug = debugFact('enabled');
        leakTest("leak" + i);
      }

      function leakTest(name){
        debug(function () {return name;});
      }
    });


    it('normal', function (done) {
      unhook = hook.stderr(function (str) {
        expect(str.match(/crap/)).toBeTruthy;
        expect(str.match(/enabled/)).toBeTruthy;
        done()
      });
      debug('crap');
      unhook();
    });
  });

  describe('disabled', function () {
    beforeEach(function () {
      debugFact.save(null);
      debugFact.enable(debugFact.load())
      debug = debugFact('disabled');
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
      expect(called).toBeFalse();
    });

    it('normal', function () {
      var called = false;

      unhook = hook.stderr(function () {
        called = true;
      });

      debug('crap');
      unhook();
      expect(called).toBeFalse();
    });
  });

});
