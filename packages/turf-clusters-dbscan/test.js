const fs = require('fs');
const test = require('tape');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const chromatism = require('chromatism');
const centerOfMass = require('@turf/center-of-mass');
const {featureEach, propEach} = require('@turf/meta');
const {featureCollection, point, polygon} = require('@turf/helpers');
const clusters = require('./');

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
        const clustered = clusters(geojson, distance, units, minPoints);
        // console.log(clustered.points.features.length);
        const result = colorize(clustered);

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
    t.throws(() => clusters(poly, 1), /Input must contain Points/);
    t.throws(() => clusters(points), /maxDistance is required/);
    t.throws(() => clusters(points, -4), /Invalid maxDistance/);
    t.throws(() => clusters(points, 'foo'), /Invalid maxDistance/);
    t.throws(() => clusters(points, 1, 'nanometers'), /units is invalid/);
    t.throws(() => clusters(points, 1, null, 0), /Invalid minPoints/);
    t.throws(() => clusters(points, 1, 'miles', 'baz'), /Invalid minPoints/);
    t.end();
});

test('clusters -- prevent input mutation', t => {
    clusters(points, 2, 'kilometers', 1);
    t.true(points.features[0].properties.cluster === undefined, 'cluster properties should be undefined');
    t.end();
});

test('clusters -- translate properties', t => {
    t.equal(clusters(points, 2, 'kilometers', 1).features[0].properties.foo, 'bar');
    t.end();
});

test('clusters -- handle Array of Points', t => {
    t.assert(clusters(points.features, 2), 'Support Array of Features input');
    t.end();
});

// style result
function colorize(clustered) {
    const clusters = new Set();
    propEach(clustered, ({cluster}) => clusters.add(cluster));
    const count = clusters.size;
    const colours = chromatism.adjacent(360 / count, count, '#0000FF').hex;
    const points = [];

    featureEach(clustered, function (point) {
        switch (point.properties.dbscan) {
        case 'core':
        case 'edge': {
            const coreColor = colours[point.properties.cluster];
            const edgeColor = chromatism.brightness(-20, colours[point.properties.cluster]).hex;
            point.properties['marker-color'] = (point.properties.dbscan === 'core') ? coreColor : edgeColor;
            point.properties['marker-size'] = 'small';
            points.push(point);
            break;
        }
        case 'noise': {
            point.properties['marker-color'] = '#AEAEAE';
            point.properties['marker-symbol'] = 'circle-stroked';
            point.properties['marker-size'] = 'medium';
            points.push(point);
        }
        }
    });
    // Create Centroid from cluster property
    const properties = {
        'marker-symbol': 'star',
        'marker-size': 'large'
    };
    const centroids = centroidFromProperty(points, 'cluster', properties);
    featureEach(centroids, point => {
        const color = chromatism.brightness(-15, colours[point.properties.cluster]).hex;
        point.properties['marker-color'] = color;
        points.push(point);
    });

    return featureCollection(points);
}

/**
 * Basic implementation of creating centroids based on a single Property
 * Can be expanded with very complex property combination
 *
 * @private
 * @param {FeatureCollection|Feature[]} geojson GeoJSON
 * @param {string} property Name of property of GeoJSON Properties to bin each feature - This property will be translated to each centroid's properties
 * @param {*} properties Properties to translate down to each centroid (2nd priority)
 * @returns {FeatureCollection<Point>} centroids
 * @example
 * var centroids = centroidFromProperty(points, 'cluster');
 */
function centroidFromProperty(geojson, property, properties) {
    if (Array.isArray(geojson)) geojson = featureCollection(geojson);

    const centroids = [];
    const bins = new Map();
    featureEach(geojson, feature => {
        const prop = feature.properties[property];
        if (prop === undefined) return;
        if (bins.has(prop)) bins.get(prop).push(feature);
        else bins.set(prop, [feature]);
    });
    bins.forEach(features => {
        // Retrieve property of first feature (only the defined property tags, nothing else)
        const props = JSON.parse(JSON.stringify(properties));
        props[property] = features[0].properties[property];
        const centroid = centerOfMass(featureCollection(features), props);
        centroids.push(centroid);
    });
    return featureCollection(centroids);
}
