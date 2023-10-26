const fs = require('fs');
const test = require('tape');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const bboxPolygon = require('@turf/bbox-polygon').default;
const { polygon, featureCollection, polygons } = require('@turf/helpers');
const geojsonRbush = require('./').default;

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

test('geojson-rbush', t => {
    for (const fixture of fixtures) {
        const name = fixture.name;
        const filename = fixture.filename;
        const geojson = fixture.geojson;
        const tree = geojsonRbush();
        tree.load(geojson);

        // Retrive all features inside the RBush index
        const all = tree.all();

        // Search using the first item in the FeatureCollection
        const search = tree.search(geojson.features[0]);

        if (process.env.REGEN) {
            write.sync(directories.out + 'all.' + filename, all);
            write.sync(directories.out + 'search.' + filename, search);
        }

        t.deepEqual(all, load.sync(directories.out + 'all.' + filename), 'all.' + name);
        t.deepEqual(search, load.sync(directories.out + 'search.' + filename), 'search.' + name);
    }
    t.end();
});

test('geojson-rbush -- bbox', t => {
    const tree = geojsonRbush();
    tree.insert(bboxPolygon([-150, -60, 150, 60]));

    t.equal(tree.collides([-140, -50, 140, 50]), true);
    t.equal(tree.search([-140, -50, 140, 50]).features.length, 1);
    t.equal(tree.search(bboxPolygon([-150, -60, 150, 60])).features.length, 1);
    t.equal(tree.search(featureCollection([bboxPolygon([-150, -60, 150, 60])])).features.length, 1);
    t.equal(tree.collides([-180, -80, -170, -60]), false);

    // Errors
    t.throws(() => tree.search('foo'));
    t.end();
});

test('geojson-rbush -- fromJSON', t => {
    const tree = geojsonRbush();
    const poly = bboxPolygon([-150, -60, 150, 60])
    tree.insert(poly);

    const newTree = geojsonRbush()
    newTree.fromJSON(tree.toJSON())
    t.equal(newTree.all().features.length, 1)
    newTree.remove(poly)
    t.equal(newTree.all().features.length, 0)
    t.end();
});



test('geojson-rbush -- Array of Features -- Issue #5', t => {
    // https://github.com/DenisCarriere/geojson-rbush/issues/5
    const tree = geojsonRbush();
    const polys = polygons([
        [[[-78, 41], [-67, 41], [-67, 48], [-78, 48], [-78, 41]]],
        [[[-93, 32], [-83, 32], [-83, 39], [-93, 39], [-93, 32]]]
    ]);
    // Load Feature Collection
    tree.load(polys);
    t.equal(tree.all().features.length, 2);

    // Load Array of Features
    tree.load(polys.features);
    t.equal(tree.all().features.length, 4);
    t.end();
});
