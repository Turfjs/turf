import fs from 'fs';
import test from 'tape';
import glob from 'glob';
import path from 'path';
import load from 'load-json-file';
import write from 'write-json-file';
import { point, featureCollection } from '../helpers';
import voronoi from '.';

const directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep,
    out: path.join(__dirname, 'test', 'out') + path.sep
};

const fixtures = fs.readdirSync(directories.in).map(filename => {
    return {filename, geojson: load.sync(directories.in + filename)};
});

test('turf-voronoi', t => {
    for (const {filename, geojson} of fixtures) {
        const results = voronoi(geojson, {bbox: geojson.bbox});

        if (process.env.REGEN) write.sync(directories.out + filename, results);

        const expected = load.sync(directories.out + filename);
        t.deepEquals(results, expected, path.parse(filename).name);
    };
    t.end();
});

test('turf-voronoi - test properties', t => {
  
    const result = voronoi(featureCollection([point([145, -37], {foo: 'bar'})]), {
      bbox: [140, -40, 160, -30],
      addPropertiesToPolygons: true
    });
    t.equal(result.features[0].properties.foo, 'bar')

    const result2 = voronoi(featureCollection([point([145, -37], {foo: 'bar'})]), {
      bbox: [140, -40, 160, -30],
      addPropertiesToPolygons: false
    });
    t.equal(Object.keys(result2.features[0].properties).length, 0)

    t.end();
});