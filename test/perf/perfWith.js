'use strict';

const fs = require('fs');
const JSONStream = require('JSONStream');
const debug = require('../../')
  .spawnable(require('../../package.json').name)
  .spawn('perf');

var memwatch = require('memwatch-next');
var heapDiff = new memwatch.HeapDiff();

let start = process.hrtime();

function elapsedTime() {
  var precision = 3; // 3 decimal places
  var timed = process.hrtime(start);
  var ms = timed[1] / 1000000;// divide by a million to get nano to milli
  ms = Number(timed[0] * 1000) + Number(ms.toFixed(precision));
  return ms + ' ms';
}

function endTest() {
  var hde = heapDiff.end();
  var change = hde.change;
  change.details = null;

  console.log('change.size: ' + change.size);
  console.log("perfWithout.js Total time: " + elapsedTime());
}

fs.createReadStream(__dirname + '/crashes.json', { encoding: 'utf8' })
  .pipe(JSONStream.stringify())
  .on('data', (json) => {
    debug(() => json.length);
    debug(() => json)
  })
  .on('end', () => endTest());