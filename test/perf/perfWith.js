const fs = require('fs');
const JSONStream = require('JSONStream');
const memwatch = require('@znemz/node-memwatch');
const debug = require('../../')
  .spawnable(require('../../package.json').name)
  .spawn('perf');

/* eslint-disable no-console */
const heapDiff = new memwatch.HeapDiff();

const start = process.hrtime();

function elapsedTime() {
  const precision = 3; // 3 decimal places
  const timed = process.hrtime(start);
  let ms = timed[1] / 1000000; // divide by a million to get nano to milli
  ms = Number(timed[0] * 1000) + Number(ms.toFixed(precision));
  return `${ms} ms`;
}

function endTest() {
  const hde = heapDiff.end();
  const { change } = hde;
  change.details = null;

  console.log(`change.size: ${change.size}`);
  console.log(`perfWithout.js Total time: ${elapsedTime()}`);
}

fs.createReadStream(`${__dirname}/crashes.json'`, { encoding: 'utf8' })
  .pipe(JSONStream.stringify())
  .on('data', (json) => {
    debug(() => json.length);
    debug(() => json);
  })
  .on('end', () => endTest());
