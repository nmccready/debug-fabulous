const hook = require('hook-std');
const memwatch = require('node-memwatch');
const debugFact = require('../../src/debugFabFactory')();

memwatch.on('leak', (info) => {
  console.log('LEAK');
  console.log(info);
  throw new Error('there is a LEAK');
  process.exit(500);
});

const heapDiff = new memwatch.HeapDiff();

describe('lazyEval', () => {
  let debug, unhook, date;

  beforeEach(() => {
    date = Date.now();
  });

  afterAll(() => {
    const hde = heapDiff.end();
    const change = hde.change;
    change.details = null;

    console.log(
      JSON.stringify(
        {
          before: hde.before,
          after: hde.after,
          change: change,
        },
        null,
        2
      )
    );
    console.log('lazyEval.test.js Total time: ' + (Date.now() - date));
  });

  describe('enabled', () => {
    beforeEach(() => {
      debugFact.save('enabled');
      debugFact.enable(debugFact.load());
      debug = debugFact('enabled');
      // console.log(debug);
    });

    it('handles functions', (done) => {
      unhook = hook.stderr((str) => {
        expect(str.match(/crap/)).toBeTruthy();
        expect(str.match(/enabled/)).toBeTruthy();
        done();
      });
      debug(() => {
        return 'crap';
      });
      unhook();
    });

    it('leak', () => {
      // memory leak attempt
      for (let i = 0; i < 1000; i++) {
        debug = debugFact('enabled');
        leakTest('leak' + i);
      }

      function leakTest(name) {
        debug(() => {
          return name;
        });
      }
    });

    describe('normal', () => {
      it('basic', (done) => {
        unhook = hook.stderr((str) => {
          expect(str).toMatch(/crap/);
          expect(str).toMatch(/enabled/);
          done();
        });
        debug('crap');
        unhook();
      });

      it('formatter / multi arg', (done) => {
        unhook = hook.stderr((str) => {
          expect(str).toMatch(/test hi/);
          expect(str).toMatch(/enabled/);
          done();
        });
        debug('test %s', 'hi');
        unhook();
      });
    });

    describe('lazy', () => {
      it('basic', (done) => {
        unhook = hook.stderr((str) => {
          expect(str).toMatch(/crap/);
          expect(str).toMatch(/enabled/);
          done();
        });
        debug(() => 'crap');
        unhook();
      });

      it('formatter / multi arg', (done) => {
        unhook = hook.stderr((str) => {
          expect(str).toMatch(/test hi/);
          expect(str).toMatch(/enabled/);
          done();
        });
        debug(() => ['test %s', 'hi']);
        unhook();
      });
    });
  });

  describe('disabled', () => {
    beforeEach(() => {
      debugFact.save(null);
      debugFact.enable(debugFact.load());
      debug = debugFact('disabled');
    });

    it('handles functions', () => {
      let called = false;

      unhook = hook.stderr(() => {
        called = true;
      });

      debug(() => {
        called = true;
        return 'crap';
      });
      unhook();
      expect(called).toBeFalse();
    });

    it('normal', () => {
      let called = false;

      unhook = hook.stderr(() => {
        called = true;
      });

      debug('crap');
      unhook();
      expect(called).toBeFalse();
    });
  });
});
