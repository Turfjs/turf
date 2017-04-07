const test = require('tape');
const fs = require('fs');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const featureEach = require('@turf/meta').featureEach;
const featureCollection = require('@turf/helpers').featureCollection;
const lineSplit = require('./');

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

test('turf-line-split', t => {
    for (const {filename, name, geojson}  of fixtures) {
        const source = geojson.features[0];
        const target = geojson.features[1];
        const results = colorize(lineSplit(source, target));
        featureEach(geojson, feature => results.features.push(feature));

        if (process.env.REGEN) write.sync(directories.out + filename, results);
        t.deepEquals(results, load.sync(directories.out + filename), name);
    }
    t.end();
});

/**
 * Colorize FeatureCollection
 *
 * @param {FeatureCollection|Feature<any>} geojson Feature or FeatureCollection
 * @returns {FeatureCollection<any>} colorized FeatureCollection
 */
function colorize(geojson) {
    const results = [];
    featureEach(geojson, (feature, index) => {
        const r = (index % 2 === 0) ? 'F' : '0';
        const g = (index % 2 === 0) ? '0' : '0';
        const b = (index % 2 === 0) ? '0' : 'F';
        feature.properties = Object.assign({
            stroke: '#' + r + g + b,
            'stroke-width': 10
        }, feature.properties);
        results.push(feature);
    });
    return featureCollection(results);
}
