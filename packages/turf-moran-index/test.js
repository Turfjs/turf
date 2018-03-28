const test = require('tape');
const glob = require('glob');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const moranIndex = require('.').default;

test('turf-moran-index', t => {

  const pointPath = path.join(__dirname, 'test', 'in', 'point.json');
  const pointJson = load.sync(pointPath);

  const result = moranIndex(pointJson, {
    inputField: 'CRIME',
  });

  t.deepEqual(result, {
    moranI: 0.15665417693293948,
    expectMoranI: -0.020833333333333332,
    stdNorm: 0.022208244679327364,
    zNorm: 7.991964823383264,
  });





  // console.log(result[0]);

  t.end();
});
