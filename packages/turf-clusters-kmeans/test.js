const fs = require('fs');
const test = require('tape');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const chromatism = require('chromatism');
const {featureEach} = require('@turf/meta');
const {featureCollection, point, polygon} = require('@turf/helpers');
const clustersKmeans = require('./');

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

test('clusters-kmeans', t => {
    fixtures.forEach(({name, geojson}) => {
        const {numberOfCentroids} = geojson.properties || {};

        const clustered = clustersKmeans(geojson, numberOfCentroids);
        const result = featureCollection(colorize(clustered));

        if (process.env.REGEN) write.sync(directories.out + name + '.geojson', result);
        t.deepEqual(result, load.sync(directories.out + name + '.geojson'), name);
    });

    t.end();
});

const points = featureCollection([
    point([0, 0], {foo: 'bar'}),
    point([2, 4], {foo: 'bar'}),
    point([3, 6], {foo: 'bar'})
]);

test('clusters-kmeans -- throws', t => {
    const poly = polygon([[[0, 0], [10, 10], [0, 10], [0, 0]]]);
    t.throws(() => clustersKmeans(poly, 1), /Input must contain Points/);
    t.throws(() => clustersKmeans(points, 5), /numberOfClusters can't be grated than the number of points/);
    t.end();
});

test('clusters-kmeans -- translate properties', t => {
    t.equal(clustersKmeans(points, 2).points.features[0].properties.foo, 'bar');
    t.end();
});

// style result
function colorize(clustered) {
    const count = clustered.centroids.features.length;
    const colours = chromatism.adjacent(360 / count, count, '#0000FF').hex;
    const points = [];
    featureEach(clustered.points, function (point) {
        point.properties['marker-color'] = colours[point.properties.cluster];
        point.properties['marker-size'] = 'small';
        points.push(point);
    });
    featureEach(clustered.centroids, function (centroid) {
        const color = chromatism.brightness(-25, colours[centroid.properties.cluster]).hex;
        centroid.properties['marker-color'] = color;
        centroid.properties['marker-symbol'] = 'star-stroked';
        centroid.properties['marker-size'] = 'large';
        centroid.properties['marker-size'] = 'large';
        points.push(centroid);
    });
    return points;
}
