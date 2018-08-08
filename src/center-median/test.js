const test = require('tape');
const fs = require('fs');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const center = require('../center').default;
const truncate = require('../truncate').default;
const centerMean = require('../center-mean').default;
const centerOfMass = require('../center-of-mass').default;
const { featureCollection, round } = require('../helpers');
const centerMedian = require('./').default;

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

test('turf-center-median', t => {
    for (const fixture of fixtures) {
        // Define params
        const name = fixture.name;
        const geojson = fixture.geojson;
        const options = geojson.properties;

        // Calculate Centers
        const meanCenter = centerMean(geojson, options);
        const medianCenter = centerMedian(geojson, options);
        const extentCenter = center(geojson);
        const massCenter = centerOfMass(geojson);

        // Truncate median properties
        medianCenter.properties.medianCandidates.forEach((candidate, index) => {
            medianCenter.properties.medianCandidates[index] = [round(candidate[0], 6), round(candidate[1], 6)];
        });
        const results = featureCollection([
            ...geojson.features,
            colorize(meanCenter, '#a00'),
            colorize(medianCenter, '#0a0'),
            colorize(extentCenter, '#00a'),
            colorize(massCenter, '#aaa')
        ]);

        if (process.env.REGEN) write.sync(directories.out + name + '.json', results);
        t.deepEqual(results, load.sync(directories.out + name + '.json'), name);
    }
    t.end();
});

function colorize(point, color) {
    point.properties['marker-color'] = color;
    point.properties['marker-symbol'] = 'cross';
    return truncate(point);
}
