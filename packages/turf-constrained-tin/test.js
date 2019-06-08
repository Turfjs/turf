const fs = require('fs');
const path = require('path');
const test = require('tape');
const constrainedTin = require('./');

const points = require(path.join(__dirname,  'test', 'Points.json'));
const points_grid = require(path.join(__dirname,  'test', 'Points_grid.json'));
const mercator = require(path.join(__dirname,  'test', 'mercator.json'));

test('tin - z property', t => {
    const expected = require(path.join(__dirname,  'test', 'Tin.json'));
    const tinned = constrainedTin(points, [[2, 12]], 'elevation');
    t.equal(tinned.features[0].geometry.type, 'Polygon');
    t.equal(tinned.features.length, 24);
    t.deepEqual(tinned, expected, 'tinned polygons match');
    //fs.writeFileSync(path.join(__dirname, 'test', 'Tin.json'), JSON.stringify(tinned, null, 2));
    t.end();
});

test('tin - z coordinate', t => {
    const expected = require(path.join(__dirname,  'test', 'Tin-z.json'));
    const tinned = constrainedTin(points, [[1, 11]]);
    t.equal(tinned.features[0].geometry.type, 'Polygon');
    t.equal(tinned.features.length, 24);
    t.deepEqual(tinned, expected, 'tinned polygons match');
    //fs.writeFileSync(path.join(__dirname, 'test', 'Tin-z.json'), JSON.stringify(tinned, null, 2));
    t.end();
});

test('Mercator case', t => {
    const expected = require(path.join(__dirname,  'test', 'TinMercator.json'));
    const tinned = constrainedTin(mercator, [[2, 12]]);
    t.equal(tinned.features[0].geometry.type, 'Polygon');
    t.equal(tinned.features.length, 542);
    t.deepEqual(tinned, expected, 'tinned polygons match');
    //fs.writeFileSync(path.join(__dirname, 'test', 'TinMercator.json'), JSON.stringify(tinned, null, 2));
    t.end();
});

test('tin - grid without edges', t => {
    const expected = require(path.join(__dirname,  'test', 'Tin-Grid_1.json'));
    const tinned = constrainedTin(points_grid, []);
    t.equal(tinned.features[0].geometry.type, 'Polygon');
    t.equal(tinned.features.length, 8);
    t.deepEqual(tinned, expected, 'tinned polygons match');
    //fs.writeFileSync(path.join(__dirname, 'test', 'Tin-Grid_1.json'), JSON.stringify(tinned, null, 2));
    t.end();
});

test('tin - grid with 1 edge', t => {
    const expected = require(path.join(__dirname,  'test', 'Tin-Grid_2.json'));
    const tinned = constrainedTin(points_grid, [[0, 5]]);
    t.equal(tinned.features[0].geometry.type, 'Polygon');
    t.equal(tinned.features.length, 8);
    t.deepEqual(tinned, expected, 'tinned polygons match');
    //fs.writeFileSync(path.join(__dirname, 'test', 'Tin-Grid_2.json'), JSON.stringify(tinned, null, 2));
    t.end();
});

test('tin - grid with 2 edges', t => {
    const expected = require(path.join(__dirname,  'test', 'Tin-Grid_3.json'));
    const tinned = constrainedTin(points_grid, [[0, 5], [5, 6]]);
    t.equal(tinned.features[0].geometry.type, 'Polygon');
    t.equal(tinned.features.length, 8);
    t.deepEqual(tinned, expected, 'tinned polygons match');
    //fs.writeFileSync(path.join(__dirname, 'test', 'Tin-Grid_3.json'), JSON.stringify(tinned, null, 2));
    t.end();
});

test('tin - error case', t => {
    t.throws(() => constrainedTin(points_grid, [[0, 100],[5, 6]]), /Vertex indices of edge 0/, 'Too big edge index');
    t.throws(() => constrainedTin(points_grid, [[0, 5],[1, 4]]), /Edge 1 already exists or intersects/, 'Edge intersecting');
    t.throws(() => constrainedTin(points_grid, [[1, 1]]), /Edge 0 is degenerate/, 'Same vertex edge');
    t.end();
});
