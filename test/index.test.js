var hook = require('hook-std');
var memwatch = require('node-memwatch');

memwatch.on('leak', function(info) {
  console.log("LEAK");
  console.log(info);
  throw new Error("there is a LEAK");
  process.exit(500);
});

var heapDiff = new memwatch.HeapDiff();

describe('index / spawn', function () {

  var rootDbg, unhook, date;

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
    console.log("index.test.js Total time: " + (Date.now() - date));
  })

  describe('namespacing', function () {
    beforeEach(function () {
      var origDebug = require('../src')();
      origDebug.save('root*');
      origDebug.enable(origDebug.load())

      rootDbg = require('../src').spawnable('root', origDebug);
      // console.log(rootDbg);
    })

    it('handles functions', function (done) {
      unhook = hook.stderr(function (str) {
        expect(str).toBeDefined();
        expect(str.match(/crap/)).toBeTruthy();
        expect(str.match(/root/)).toBeTruthy();
        done()
      });
      rootDbg(function () {return 'crap';});
      unhook();
    });

    it('normal', function (done) {
      unhook = hook.stderr(function (str) {
        expect(str).toBeTruthy;
        expect(str.match(/crap/)).toBeTruthy;
        expect(str.match(/root/)).toBeTruthy;
        done()
      });
      rootDbg('crap');
      unhook();
    });

    describe('child1', function(){
      var child1Dbg;

      beforeEach(function () {
        child1Dbg = rootDbg.spawn('child1');
      })

      it('handles functions', function (done) {
        unhook = hook.stderr(function (str) {
          expect(str).toBeTruthy;
          expect(str.match(/crap/)).toBeTruthy;
          expect(str.match(/root:child1/)).toBeTruthy;
          done()
        });
        child1Dbg(function () {return 'crap';});
        unhook();
      });

      it('normal', function (done) {
        unhook = hook.stderr(function (str) {
          expect(str).toBeTruthy;
          expect(str.match(/crap/)).toBeTruthy;
          expect(str.match(/root:child1/)).toBeTruthy;
          done()
        });
        child1Dbg('crap');
        unhook();
      });

      it('leak', function () {
        // memory leak attempt
        for(var i = 0; i < 1000;i++){
          child1Dbg = rootDbg.spawn('child1');
          leakTest('leakTest' + i);
        }
      });

      function leakTest(testName) {
        child1Dbg(function () {return testName;});
      }

      describe('grandChild1', function(){
        var grandChild1;

        beforeEach(function () {
          grandChild1 = child1Dbg.spawn('grandChild1')
        })

        it('handles functions', function (done) {
          unhook = hook.stderr(function (str) {
            expect(str).toBeTruthy;
            expect(str.match(/crap/)).toBeTruthy;
            expect(str.match(/root:child1:grandChild1/)).toBeTruthy;
            done()
          });
          grandChild1(function () {return 'crap';});
          unhook();
        });

        it('normal', function (done) {
          unhook = hook.stderr(function (str) {
            expect(str).toBeTruthy;
            expect(str.match(/crap/)).toBeTruthy;
            expect(str.match(/root:child1:grandChild1/)).toBeTruthy;
            done()
          });
          grandChild1('crap');
          unhook();
        });

        describe('greatGrandChild1', function(){
          var greatGrandChild1;

          beforeEach(function () {
            greatGrandChild1 = grandChild1.spawn('greatGrandChild1')
            // console.log(greatGrandChild1)
          })

          it('handles functions', function (done) {
            unhook = hook.stderr(function (str) {
              expect(str).toBeTruthy;
              expect(str.match(/crap/)).toBeTruthy;
              expect(str.match(/root:child1:grandChild1:greatGrandChild1/)).toBeTruthy;
              done()
            });
            greatGrandChild1(function () {return 'crap';});
            unhook();
          });

          it('normal', function (done) {
            unhook = hook.stderr(function (str) {
              expect(str).toBeTruthy;
              expect(str.match(/crap/)).toBeTruthy;
              expect(str.match(/root:child1:grandChild1:greatGrandChild1/)).toBeTruthy;
              done()
            });
            greatGrandChild1('crap');
            unhook();
          });
        });
      });
    });
  });
});
