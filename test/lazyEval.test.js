const hook = require('hook-std');
const config = require('config');
const debugFact = require('../lib')();

describe('lazyEval', () => {
  let debug, unhook;

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
      for (let i = 0; i < config.get('tests.leak.iterations'); i++) {
        debug = debugFact('enabled');
        leakTest(`leak${i}`);
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
      expect(called).toEqual(false);
    });

    it('normal', () => {
      let called = false;

      unhook = hook.stderr(() => {
        called = true;
      });

      debug('crap');
      unhook();
      expect(called).toEqual(false);
    });
  });
});
