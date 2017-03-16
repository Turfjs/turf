const test = require('tape');
const path = require('path');
const fs = require('fs');
const load = require('load-json-file');
const isobands = require('./');

const directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep,
    out: path.join(__dirname, 'test', 'out') + path.sep
};

const inputs = fs.readdirSync(directories.in).map(filename => {
        return {
            filename,
            name: path.parse(filename).name,
            geojson: load.sync(directories.in + filename)
        };
});

test('union', function (t) {
    inputs.forEach((input) => {
        const idx = input.filename.split('points')[1];
        const isobanded = isobands(input.geojson, 'elevation', [0, 3, 5, 7, 10]);

        t.ok(isobanded.features, 'should take a set of points with z values and output a set of filled contour MultiPolygons');
        t.equal(isobanded.features[0].geometry.type, 'MultiPolygon');

        t.deepEqual(isobanded, load.sync(directories.out + 'isobands' + idx), input.name);
    });
    t.end();
});
