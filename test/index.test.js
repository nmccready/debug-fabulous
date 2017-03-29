var expect = require('chai').expect;
hook = require('hook-std')

describe('index / spawn', function () {

  var rootDbg;

  describe('namespacing', function () {
    before(function () {
      var origDebug = require('..')();
      origDebug.save('root*');
      origDebug.enable(origDebug.load())

      rootDbg = require('../').spawnable('root', origDebug);
      // console.log(rootDbg);
    })

    it('handles functions', function (done) {
      unhook = hook.stderr(function (str) {
        expect(str).to.be.ok;
        expect(str.match(/crap/)).to.be.ok;
        expect(str.match(/root/)).to.be.ok;
        done()
      });
      rootDbg(function () {return 'crap';});
      unhook();
    });

    it('normal', function (done) {
      unhook = hook.stderr(function (str) {
        expect(str).to.be.ok;
        expect(str.match(/crap/)).to.be.ok;
        expect(str.match(/root/)).to.be.ok;
        done()
      });
      rootDbg('crap');
      unhook();
    });

    describe('child1', function(){
      var child1Dbg;

      before(function () {
        child1Dbg = rootDbg.spawn('child1')
      })

      it('handles functions', function (done) {
        unhook = hook.stderr(function (str) {
          expect(str).to.be.ok;
          expect(str.match(/crap/)).to.be.ok;
          expect(str.match(/root:child1/)).to.be.ok;
          done()
        });
        child1Dbg(function () {return 'crap';});
        unhook();
      });

      it('normal', function (done) {
        unhook = hook.stderr(function (str) {
          expect(str).to.be.ok;
          expect(str.match(/crap/)).to.be.ok;
          expect(str.match(/root:child1/)).to.be.ok;
          done()
        });
        child1Dbg('crap');
        unhook();
      });

      describe('grandChild1', function(){
        var grandChild1;

        before(function () {
          grandChild1 = child1Dbg.spawn('grandChild1')
        })

        it('handles functions', function (done) {
          unhook = hook.stderr(function (str) {
            expect(str).to.be.ok;
            expect(str.match(/crap/)).to.be.ok;
            expect(str.match(/root:child1:grandChild1/)).to.be.ok;
            done()
          });
          grandChild1(function () {return 'crap';});
          unhook();
        });

        it('normal', function (done) {
          unhook = hook.stderr(function (str) {
            expect(str).to.be.ok;
            expect(str.match(/crap/)).to.be.ok;
            expect(str.match(/root:child1:grandChild1/)).to.be.ok;
            done()
          });
          grandChild1('crap');
          unhook();
        });

        describe('greatGrandChild1', function(){
          var greatGrandChild1;

          before(function () {
            greatGrandChild1 = grandChild1.spawn('greatGrandChild1')
            // console.log(greatGrandChild1)
          })

          it('handles functions', function (done) {
            unhook = hook.stderr(function (str) {
              expect(str).to.be.ok;
              expect(str.match(/crap/)).to.be.ok;
              expect(str.match(/root:child1:grandChild1:greatGrandChild1/)).to.be.ok;
              done()
            });
            greatGrandChild1(function () {return 'crap';});
            unhook();
          });

          it('normal', function (done) {
            unhook = hook.stderr(function (str) {
              expect(str).to.be.ok;
              expect(str.match(/crap/)).to.be.ok;
              expect(str.match(/root:child1:grandChild1:greatGrandChild1/)).to.be.ok;
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
