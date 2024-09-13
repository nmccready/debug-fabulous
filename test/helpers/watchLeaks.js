const memwatch = require('@biiaidt/node-memwatch');
/* eslint-disable no-console */

const watchLeaks = () => {
  memwatch.on('leak', (info) => {
    console.log('LEAK');
    console.log(info);
    console.error(new Error('there is a LEAK'));
    process.exit(500);
  });

  return new memwatch.HeapDiff();
};

module.exports = watchLeaks;
