const glob = require('glob');
const path = require('path');
const test = require('tape');
const load = require('load-json-file');
const {point, lineString, polygon} = require('@turf/helpers');
const parallel = require('./');

test('turf-boolean-parallel', t => {
    // True Fixtures
    glob.sync(path.join(__dirname, 'test', 'true', '**', '*.geojson')).forEach(filepath => {
        const {name} = path.parse(filepath);
        const geojson = load.sync(filepath);
        const [line1, line2] = geojson.features;
        const result = parallel(line1, line2);

        if (process.env.SHAPELY) shapely.contains(line1, line2).then(result => t.true(result, '[true] shapely - ' + name));
        t.true(result, '[true] ' + name);
    });
    // // False Fixtures
    // glob.sync(path.join(__dirname, 'test', 'false', '**', '*.geojson')).forEach(filepath => {
    //     const {name} = path.parse(filepath);
    //     const geojson = load.sync(filepath);
    //     const [line1, line2] = geojson.features;
    //     const result = parallel(line1, line2);
    //
    //     if (process.env.SHAPELY) shapely.contains(line1, line2).then(result => t.false(result, '[false] shapely - ' + name));
    //     t.false(result, '[false] ' + name);
    // });
    t.end();
});


// test('turf-boolean-parallel -- throws', t => {
//     t.throws(() => overlap(null, line1), /feature1 is required/, 'missing feature1');
//     t.throws(() => overlap(line1, null), /feature2 is required/, 'missing feature2');
//     t.throws(() => overlap(pt, line1), /features must be of the same type/, 'different types');
//     t.throws(() => overlap(pt, pt), /Point geometry not supported/, 'geometry not supported');
//
//     t.end();
// });
