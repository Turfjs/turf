const write = require('write-json-file');
const load = require('load-json-file');
const fs = require('fs');
const path = require('path');
const test = require('tape');
const distance = require('./');

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

test('distance', t => {
    for (const {name, geojson}  of fixtures) {
        const pt1 = geojson.features[0];
        const pt2 = geojson.features[1];
        const miles = distance(pt1, pt2, 'miles');
        const nauticalmiles = distance(pt1, pt2, 'nauticalmiles');
        const kilometers = distance(pt1, pt2, 'kilometers');
        const radians = distance(pt1, pt2, 'radians');
        const degrees = distance(pt1, pt2, 'degrees');

        if (process.env.REGEN) {
            write.sync(directories.out + name + '-miles.json', miles);
            write.sync(directories.out + name + '-nauticalmiles.json', nauticalmiles);
            write.sync(directories.out + name + '-kilometers.json', kilometers);
            write.sync(directories.out + name + '-radians.json', radians);
            write.sync(directories.out + name + '-degrees.json', degrees);
        }
        t.deepEqual(miles, load.sync(directories.out + name + '-miles.json'), name + '-miles');
        t.deepEqual(nauticalmiles, load.sync(directories.out + name + '-nauticalmiles.json'), name + '-nauticalmiles');
        t.deepEqual(kilometers, load.sync(directories.out + name + '-kilometers.json'), name + '-kilometers');
        t.deepEqual(radians, load.sync(directories.out + name + '-radians.json'), name + '-radians');
        t.deepEqual(degrees, load.sync(directories.out + name + '-degrees.json'), name + '-degrees');
        t.throws(() => {
            distance(pt1, pt2, 'blah');
        }, 'unknown option given to units');
    }
    t.end();
});
