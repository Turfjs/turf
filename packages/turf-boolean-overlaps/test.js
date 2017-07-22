const glob = require('glob');
const path = require('path');
const test = require('tape');
const load = require('load-json-file');
const {point, lineString} = require('@turf/helpers');
const overlaps = require('./');

test('turf-boolean-overlaps', t => {
    // True Fixtures
    glob.sync(path.join(__dirname, 'test', 'true', '**', '*.geojson')).forEach(filepath => {
        const {name} = path.parse(filepath);
        const geojson = load.sync(filepath);
        const [feature1, feature2] = geojson.features;
        const result = overlaps(feature1, feature2);

        if (process.env.SHAPELY) shapely.contains(feature1, feature2).then(result => t.true(result, '[true] shapely - ' + name));
        t.true(result, '[true] ' + name);
    });
    // False Fixtures
    glob.sync(path.join(__dirname, 'test', 'false', '**', '*.geojson')).forEach(filepath => {
        const {name} = path.parse(filepath);
        const geojson = load.sync(filepath);
        const [feature1, feature2] = geojson.features;
        const result = overlaps(feature1, feature2);

        if (process.env.SHAPELY) shapely.contains(feature1, feature2).then(result => t.false(result, '[false] shapely - ' + name));
        t.false(result, '[false] ' + name);
    });
    t.end();
});

test('turf-boolean-overlaps -- throws', t => {
    const pt = point([9, 50]);
    const line = lineString([[7, 50], [8, 50], [9, 50]]);

    t.throws(() => overlaps(null, line), '<geojson> is required');
    t.throws(() => overlaps(line, null), '<geojson> is required');
    t.throws(() => overlaps(pt, line), 'feature1 Point geometry not supported');
    t.throws(() => overlaps(line, pt), 'feature2 Point geometry not supported');
    t.throws(() => overlaps({"feature": "non GeoJSON"}, line), '<geojson> must be a Feature or Geometry Object');
    t.throws(() => overlaps(line, {"feature": "non GeoJSON"}), '<geojson> must be a Feature or Geometry Object');

    t.end();
});
