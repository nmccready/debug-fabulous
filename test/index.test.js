const hook = require('hook-std');
const config = require('config');
const watchLeaks = require('./helpers/watchLeaks');

/* eslint-disable no-console */
const heapDiff = watchLeaks();

describe('index / spawn', () => {
  let rootDbg, unhook, date;

  beforeEach(() => {
    date = Date.now();
  });

  afterAll(() => {
    const hde = heapDiff.end();
    const { change } = hde;
    change.details = null;

    console.log(
      JSON.stringify(
        {
          before: hde.before,
          after: hde.after,
          change,
        },
        null,
        2
      )
    );
    console.log(`index.test.js Total time: ${Date.now() - date}`);
  });

  describe('namespacing', () => {
    beforeEach(() => {
      const origDebug = require('../lib')();
      origDebug.save('root*');
      origDebug.enable(origDebug.load());

      rootDbg = require('../lib').spawnable('root', origDebug);
      // console.log(rootDbg);
    });

    it('handles functions', (done) => {
      unhook = hook.stderr((str) => {
        expect(str).toBeDefined();
        expect(str.match(/crap/)).toBeTruthy();
        expect(str.match(/root/)).toBeTruthy();
        done();
      });
      rootDbg(() => {
        return 'crap';
      });
      unhook();
    });

    it('normal', (done) => {
      unhook = hook.stderr((str) => {
        expect(str).toBeTruthy();
        expect(str.match(/crap/)).toBeTruthy();
        expect(str.match(/root/)).toBeTruthy();
        done();
      });
      rootDbg('crap');
      unhook();
    });

    describe('child1', () => {
      let child1Dbg;

      beforeEach(() => {
        child1Dbg = rootDbg.spawn('child1');
      });

      it('handles functions', (done) => {
        unhook = hook.stderr((str) => {
          expect(str).toBeTruthy();
          expect(str.match(/crap/)).toBeTruthy();
          expect(str.match(/root:child1/)).toBeTruthy();
          done();
        });
        child1Dbg(() => {
          return 'crap';
        });
        unhook();
      });

      it('normal', (done) => {
        unhook = hook.stderr((str) => {
          expect(str).toBeTruthy();
          expect(str.match(/crap/)).toBeTruthy();
          expect(str.match(/root:child1/)).toBeTruthy();
          done();
        });
        child1Dbg('crap');
        unhook();
      });

      it('leak', () => {
        // memory leak attempt
        for (let i = 0; i < config.get('tests.leak.iterations'); i++) {
          child1Dbg = rootDbg.spawn('child1');
          leakTest(`leakTest${i}`);
        }
      });

      function leakTest(testName) {
        child1Dbg(() => {
          return testName;
        });
      }

      describe('grandChild1', () => {
        let grandChild1;

        beforeEach(() => {
          grandChild1 = child1Dbg.spawn('grandChild1');
        });

        it('handles functions', (done) => {
          unhook = hook.stderr((str) => {
            expect(str).toBeTruthy();
            expect(str.match(/crap/)).toBeTruthy();
            expect(str.match(/root:child1:grandChild1/)).toBeTruthy();
            done();
          });
          grandChild1(() => {
            return 'crap';
          });
          unhook();
        });

        it('normal', (done) => {
          unhook = hook.stderr((str) => {
            expect(str).toBeTruthy();
            expect(str.match(/crap/)).toBeTruthy();
            expect(str.match(/root:child1:grandChild1/)).toBeTruthy();
            done();
          });
          grandChild1('crap');
          unhook();
        });

        describe('greatGrandChild1', () => {
          let greatGrandChild1;

          beforeEach(() => {
            greatGrandChild1 = grandChild1.spawn('greatGrandChild1');
            // console.log(greatGrandChild1)
          });

          it('handles functions', (done) => {
            unhook = hook.stderr((str) => {
              expect(str).toBeTruthy();
              expect(str.match(/crap/)).toBeTruthy();
              expect(str.match(/root:child1:grandChild1:greatGrandChild1/)).toBeTruthy();
              done();
            });
            greatGrandChild1(() => {
              return 'crap';
            });
            unhook();
          });

          it('normal', (done) => {
            unhook = hook.stderr((str) => {
              expect(str).toBeTruthy();
              expect(str.match(/crap/)).toBeTruthy();
              expect(str.match(/root:child1:grandChild1:greatGrandChild1/)).toBeTruthy();
              done();
            });
            greatGrandChild1('crap');
            unhook();
          });
        });
      });
    });
  });
});
