const fs = require('fs');
const test = require('tape');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const chromatism = require('chromatism');
const concaveman = require('concaveman');
const centerOfMass = require('@turf/center-of-mass');
const {featureEach, propEach, coordEach} = require('@turf/meta');
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

test('clusters-dbscan -- handle Array of Points', t => {
    t.assert(clustersDbscan(points.features, 2), 'Support Array of Features input');
    t.end();
});

// style result
function colorize(clustered) {
    const clusters = new Set();
    propEach(clustered, ({cluster}) => clusters.add(cluster));
    const count = clusters.size;
    const colours = chromatism.adjacent(360 / count, count, '#0000FF').hex;
    const features = [];

    featureEach(clustered, function (point) {
        switch (point.properties.dbscan) {
        case 'core':
        case 'edge': {
            const coreColor = colours[point.properties.cluster];
            const edgeColor = chromatism.brightness(-20, colours[point.properties.cluster]).hex;
            point.properties['marker-color'] = (point.properties.dbscan === 'core') ? coreColor : edgeColor;
            point.properties['marker-size'] = 'small';
            features.push(point);
            break;
        }
        case 'noise': {
            point.properties['marker-color'] = '#AEAEAE';
            point.properties['marker-symbol'] = 'circle-stroked';
            point.properties['marker-size'] = 'medium';
            features.push(point);
        }
        }
    });
    // Create Centroid from cluster property
    const properties = {
        'marker-symbol': 'star',
        'marker-size': 'large'
    };
    const centroids = centroidFromProperty(features, 'cluster', properties);
    featureEach(centroids, point => {
        const color = chromatism.brightness(-15, colours[point.properties.cluster]).hex;
        point.properties['marker-color'] = color;
        features.push(point);
    });

    // Create Concave Polygons from cluster
    const polys = concaveFromProperty(features, 'cluster');
    featureEach(polys, poly => {
        const color = chromatism.brightness(-15, colours[poly.properties.cluster]).hex;
        poly.properties['fill'] = color;
        poly.properties['stroke'] = color;
        poly.properties['fill-opacity'] = 0.3;
        features.push(poly);
    });

    return featureCollection(features);
}

/**
 * Basic implementation of creating centroids based on a single Property
 * Can be expanded with very complex property combination
 *
 * @private
 * @param {FeatureCollection|Feature[]} geojson GeoJSON
 * @param {string} property Name of property of GeoJSON Properties to bin each feature - This property will be translated to each centroid's properties
 * @param {*} [properties={}] Properties to translate down to each centroid (2nd priority)
 * @returns {FeatureCollection<Point>} centroids
 * @example
 * var centroids = centroidFromProperty(geojson, 'cluster');
 */
function centroidFromProperty(geojson, property, properties = {}) {
    if (Array.isArray(geojson)) geojson = featureCollection(geojson);

    const centroids = [];
    const bins = new Map();
    featureEach(geojson, feature => {
        const prop = feature.properties[property];
        if (prop === undefined) return;
        if (bins.has(prop)) bins.get(prop).push(feature);
        else bins.set(prop, [feature]);
    });
    bins.forEach((features, value) => {
        // Retrieve property of first feature (only the defined property tags, nothing else)
        const props = JSON.parse(JSON.stringify(properties));
        props[property] = value;
        const centroid = centerOfMass(featureCollection(features), props);
        centroids.push(centroid);
    });
    return featureCollection(centroids);
}

/**
 * Basic implementation of creating concave polygons based on a single Property
 * https://github.com/mapbox/concaveman
 *
 * @private
 * @param {FeatureCollection|Feature[]} geojson GeoJSON
 * @param {string} property Name of property of GeoJSON Properties to bin each feature - This property will be translated to each centroid's properties
 * @param {*} [properties={}] Properties to translate down to each polygons (2nd priority)
 * @returns {FeatureCollection<Polygon>} concave Polygons
 * @example
 * var centroids = concaveFromProperty(geojson, 'cluster');
 */
function concaveFromProperty(geojson, property, properties = {}) {
    if (Array.isArray(geojson)) geojson = featureCollection(geojson);

    const container = [];
    const bins = new Map();
    featureEach(geojson, feature => {
        const prop = feature.properties[property];
        if (prop === undefined) return;
        coordEach(feature, coord => {
            if (bins.has(prop)) bins.get(prop).push(coord);
            else bins.set(prop, [coord]);
        });
    });
    bins.forEach((coords, value) => {
        // Retrieve property of first feature (only the defined property tags, nothing else)
        const props = JSON.parse(JSON.stringify(properties));
        props[property] = value;
        const poly = polygon([concaveman(coords)], props);
        container.push(poly);
    });
    return featureCollection(container);
}
