var expect = require('chai').expect;
hook = require('hook-std')

describe('lazy-eval', () => {

  var debug;

  describe('enabled', () => {
    before(() => {

      debug = require('../../')();
      debug.save('enabled');
      debug.enable(debug.load())
      debug = debug('enabled');
    })

    it('handles functions', () => {
      unhook = hook.stderr(str => {
        expect(str.match(/crap/)).to.be.ok;
        expect(str.match(/enabled/)).to.be.ok;
      });
      debug(() => {return 'crap';});
      unhook();
    });

    it('normal', () => {
      unhook = hook.stderr(str => {
        expect(str.match(/crap/)).to.be.ok;
        expect(str.match(/enabled/)).to.be.ok;
      });
      debug('crap');
      unhook();
    });
  });

  describe('disabled', () => {
    before(() => {

      debug = require('../../')();
      debug.save(null);
      debug.enable(debug.load())
      debug = debug('disabled');
    })

    it('handles functions', () => {
      var called = false;

      unhook = hook.stderr(() => {
        called = true;
      });

      debug(() => {
        called = true;
        return 'crap';
      });
      unhook();
      expect(called).to.not.be.ok;
    });

    it('normal', () => {
      var called = false;

      unhook = hook.stderr(() => {
        called = true;
      });

      debug('crap');
      unhook();
      expect(called).to.not.be.ok;
    });
  });

});
