const fs = require('fs');
const test = require('tape');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const chromatism = require('chromatism');
const {featureEach} = require('@turf/meta');
const {featureCollection, point, polygon} = require('@turf/helpers');
const clustersDistance = require('./');

const directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep,
    out: path.join(__dirname, 'test', 'out') + path.sep
};

const fixtures = fs.readdirSync(directories.in).map(filename => {
    return {
        filename,
        name: path.parse(filename).name,
        geojson: load.sync(directories.in + filename)
    };
});

test('clusters-distance', t => {
    fixtures.forEach(({name, filename, geojson}) => {
        let {distance, minPoints} = geojson.properties || {};
        distance = distance || 100;
        minPoints = minPoints || 1;

        const clustered = clustersDistance(geojson, distance, minPoints);
        const result = featureCollection(colorize(clustered));

        if (process.env.REGEN) write.sync(directories.out + filename, result);
        t.deepEqual(result, load.sync(directories.out + filename), name);
    });

    t.end();
});

const points = featureCollection([
    point([0, 0], {foo: 'bar'}),
    point([2, 4], {foo: 'bar'}),
    point([3, 6], {foo: 'bar'})
]);

test('clusters -- throws', t => {
    const poly = polygon([[[0, 0], [10, 10], [0, 10], [0, 0]]]);
    t.throws(() => clustersDistance(poly, 1), /Input must contain Points/);
    t.end();
});

test('clusters -- translate properties', t => {
    t.equal(clustersDistance(points, 2, 1).features[0].properties.foo, 'bar');
    t.end();
});

// style result
function colorize(clustered) {
    const maxCluster = Math.max(...clustered.features.map(feature => feature.properties.cluster)) + 1;

    const colours = chromatism.adjacent(360 / maxCluster, maxCluster, '#0000FF').hex;
    const points = [];
    featureEach(clustered, function (point) {
        point.properties['marker-color'] = colours[point.properties.cluster];
        point.properties['marker-size'] = 'small';
        points.push(point);
    });
    return points;
}
