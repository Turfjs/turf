const Benchmark = require('benchmark');
const moranIndex = require('.');
const glob = require('glob');
const path = require('path');
const load = require('load-json-file');

/**
 * Benchmark Results
 *
 * <Place results here>
 */
const suite = new Benchmark.Suite('turf-moran-index');

const pointPath = path.join(__dirname, 'test', 'in', 'point.json');
const pointJson = load.sync(pointPath);


const { name } = path.parse(pointPath);

console.time(name);
moranIndex(pointJson, {
    inputField: 'CRIME',
});
console.timeEnd(name);
suite.add(name, () => moranIndex(pointJson, {
    inputField: 'CRIME',
}));


suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => { })
    .run();
