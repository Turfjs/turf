import fs from 'fs';
import test from 'tape';
import path from 'path';
import load from 'load-json-file';
import write from 'write-json-file';
import centroid from '@turf/centroid';
import * as chromatism from 'chromatism';
import concaveman from 'concaveman';
import { point, polygon, featureCollection } from '@turf/helpers';
import { clusterReduce, clusterEach } from '@turf/clusters';
import { coordAll, featureEach } from '@turf/meta';
import clustersDbscan from '.';

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
    fixtures.forEach(fixture => {
        const name = fixture.name;
        const filename = fixture.filename;
        const geojson = fixture.geojson;
        const properties = geojson.properties || {};
        const distance = properties.distance || 100;
        const minPoints = properties.minPoints;
        const units = properties.units;

        // console.log(geojson.features.length);
        const clustered = clustersDbscan(geojson, distance, {units: units, minPoints: minPoints});
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
    t.throws(() => clustersDbscan(poly, 1), /points must consist of a FeatureCollection of only Points/);
    t.throws(() => clustersDbscan(points), /maxDistance is required/);
    t.throws(() => clustersDbscan(points, -4), /maxDistance is invalid/);
    t.throws(() => clustersDbscan(points, 'foo'), /maxDistance is invalid/);
    t.throws(() => clustersDbscan(points, 1, {units: 'nanometers'}), /units is invalid/);
    t.throws(() => clustersDbscan(points, 1, {units: null, minPoints: 0}), /minPoints is invalid/);
    t.throws(() => clustersDbscan(points, 1, {units: 'miles', minPoints: 'baz'}), /minPoints is invalid/);
    t.end();
});

test('clusters-dbscan -- prevent input mutation', t => {
    clustersDbscan(points, 2, {units: 'kilometers', minPoints: 1});
    t.true(points.features[0].properties.cluster === undefined, 'cluster properties should be undefined');
    t.end();
});

test('clusters-dbscan -- translate properties', t => {
    t.equal(clustersDbscan(points, 2, {units: 'kilometers', minPoints: 1}).features[0].properties.foo, 'bar');
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

test('clusters-dbscan -- allow input mutation', t => {
    const oldPoints = featureCollection([
        point([0, 0], {foo: 'bar'}),
        point([2, 4], {foo: 'bar'}),
        point([3, 6], {foo: 'bar'})
    ]);
    // No mutation
    const newPoints = clustersDbscan(points, 2, {minPoints: 1});
    t.equal(newPoints.features[1].properties.cluster, 1, 'cluster is 1')
    t.equal(oldPoints.features[1].properties.cluster, undefined, 'cluster is undefined')

    // Allow mutation
    clustersDbscan(oldPoints, 2, {minPoints: 1, mutate: true});
    t.equal(oldPoints.features[1].properties.cluster, 1, 'cluster is 1')
    t.end()
})