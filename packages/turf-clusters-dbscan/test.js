const fs = require('fs');
const test = require('tape');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const centroid = require('@turf/centroid');
const chromatism = require('chromatism');
const concaveman = require('concaveman');
const {clusterEach, clusterReduce} = require('@turf/clusters');
const {featureEach, coordAll} = require('@turf/meta');
const {featureCollection, point, polygon} = require('@turf/helpers');
const clustersDbscan = require('./');

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

test('clusters-dbscan', t => {
    fixtures.forEach(({name, filename, geojson}) => {
        let {distance, minPoints, units} = geojson.properties || {};
        distance = distance || 100;

        // console.log(geojson.features.length);
        const clustered = clustersDbscan(geojson, distance, units, minPoints);
        // console.log(clustered.points.features.length);
        const result = styleResult(clustered);

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

test('clusters-dbscan -- throws', t => {
    const poly = polygon([[[0, 0], [10, 10], [0, 10], [0, 0]]]);
    t.throws(() => clustersDbscan(poly, 1), /Input must contain Points/);
    t.throws(() => clustersDbscan(points), /maxDistance is required/);
    t.throws(() => clustersDbscan(points, -4), /Invalid maxDistance/);
    t.throws(() => clustersDbscan(points, 'foo'), /Invalid maxDistance/);
    t.throws(() => clustersDbscan(points, 1, 'nanometers'), /units is invalid/);
    t.throws(() => clustersDbscan(points, 1, null, 0), /Invalid minPoints/);
    t.throws(() => clustersDbscan(points, 1, 'miles', 'baz'), /Invalid minPoints/);
    t.end();
});

test('clusters-dbscan -- prevent input mutation', t => {
    clustersDbscan(points, 2, 'kilometers', 1);
    t.true(points.features[0].properties.cluster === undefined, 'cluster properties should be undefined');
    t.end();
});

test('clusters-dbscan -- translate properties', t => {
    t.equal(clustersDbscan(points, 2, 'kilometers', 1).features[0].properties.foo, 'bar');
    t.end();
});

// style result
function styleResult(clustered) {
    const count = clusterReduce(clustered, 'cluster', i => i + 1, 0);
    const colours = chromatism.adjacent(360 / count, count, '#0000FF').hex;
    const features = [];

    // Add all clusterd points
    featureEach(clustered, function (pt) {
        const dbscan = pt.properties.dbscan;
        const clusterId = pt.properties.cluster;

        switch (dbscan) {
        case 'core':
        case 'edge': {
            const coreColor = colours[clusterId];
            const edgeColor = chromatism.brightness(-20, colours[clusterId]).hex;
            pt.properties['marker-color'] = (dbscan === 'core') ? coreColor : edgeColor;
            pt.properties['marker-size'] = 'small';
            break;
        }
        case 'noise': {
            pt.properties['marker-color'] = '#AEAEAE';
            pt.properties['marker-symbol'] = 'circle-stroked';
            pt.properties['marker-size'] = 'medium';
            break;
        }
        }
        features.push(pt);
    });

    // Iterate over each Cluster
    clusterEach(clustered, 'cluster', (cluster, clusterValue, clusterId) => {
        const color = chromatism.brightness(-25, colours[clusterId]).hex;

        // Add Centroid
        features.push(centroid(cluster, {
            'marker-color': colours[clusterId],
            'marker-symbol': 'star-stroked',
            'marker-size': 'large'
        }));

        // Add concave polygon
        features.push(polygon([concaveman(coordAll(cluster))], {
            fill: color,
            stroke: color,
            'fill-opacity': 0.3
        }));
    });
    return featureCollection(features);
}
