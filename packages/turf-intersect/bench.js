import fs from 'fs';
import path from 'path';
import Benchmark from 'benchmark';
import intersect from './';

const armenia = JSON.parse(fs.readFileSync(path.join(__dirname, 'test', 'fixtures', 'in', 'armenia.json')));
const simple = JSON.parse(fs.readFileSync(path.join(__dirname, 'test', 'fixtures', 'in', 'Intersect1.json')));
const suite = new Benchmark.Suite('turf-intersect');
suite
    .add('turf-intersect#simple', () => intersect(simple[0], simple[1]))
    .add('turf-intersect#armenia', () => intersect(armenia[0], armenia[1]))
    .on('cycle', event => console.log(String(event.target)))
    .on('complete', () => {})
    .run();
