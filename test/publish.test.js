const os = require('os');

const { exec } = require('child_process');
const { rm } = require('fs/promises');

const isWindows = os.platform() === 'win32';

const cleanUp = async () => {
  return rm('./tmp', { recursive: true, force: true });
};

function makeTestPackage(cb) {
  if (isWindows) {
    this.skip();
  }

  exec('./scripts/mockPublish', cb);
}

describe('mock publish', () => {
  beforeEach(makeTestPackage);
  afterEach(cleanUp);

  // with regards to averting npm publishing disasters https://github.com/gulp-sourcemaps/gulp-sourcemaps/issues/246
  it('can load a published version', (done) => {
    if (isWindows) {
      this.skip();
    }

    try {
      // attempt to load a packed / unpacked potential deployed version
      // eslint-disable-next-line import/no-unresolved
      require('../tmp/package/lib/index');
    } catch (error) {
      done(error);
      return;
    }

    done();
  });
});
