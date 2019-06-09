const fs = require('fs');
const path = require('path');
const test = require('tape');
const constrainedTin = require('./');

const points = require(path.join(__dirname,  'test', 'in', 'Points.json'));
const points_grid = require(path.join(__dirname,  'test', 'in', 'Points_grid.json'));
const mercator1 = require(path.join(__dirname,  'test', 'in', 'mercator_1.json'));
const mercator2 = require(path.join(__dirname,  'test', 'in', 'mercator_2.json'));

test('tin - z property', t => {
    const expected = require(path.join(__dirname,  'test', 'out', 'Tin.json'));
    const tinned = constrainedTin(points, [[2, 12]], 'elevation');
    t.deepEqual(tinned, expected, 'tinned polygons match');
    //fs.writeFileSync(path.join(__dirname, 'test', 'out', 'Tin_tmp.json'), JSON.stringify(tinned, null, 2));
    t.end();
});

test('tin - z coordinate', t => {
    const expected = require(path.join(__dirname,  'test', 'out', 'Tin-z.json'));
    const tinned = constrainedTin(points, [[1, 11]]);
    t.deepEqual(tinned, expected, 'tinned polygons match');
    //fs.writeFileSync(path.join(__dirname, 'test', 'out', 'Tin-z_tmp.json'), JSON.stringify(tinned, null, 2));
    t.end();
});

test('Mercator case 1', t => {
    const expected = require(path.join(__dirname,  'test', 'out', 'TinMercator1.json'));
    const tinned = constrainedTin(mercator1, [[2, 12]]);
    t.deepEqual(tinned, expected, 'tinned polygons match');
    //fs.writeFileSync(path.join(__dirname, 'test', 'out', 'TinMercator1_tmp.json'), JSON.stringify(tinned, null, 2));
    t.end();
});

test('Mercator case 2', t => {
    const expected = require(path.join(__dirname,  'test', 'out', 'TinMercator2.json'));
    const tinned = constrainedTin(mercator2, [[2, 12]]);
    t.deepEqual(tinned, expected, 'tinned polygons match');
    //fs.writeFileSync(path.join(__dirname, 'test', 'out', 'TinMercator2_tmp.json'), JSON.stringify(tinned, null, 2));
    t.end();
});

test('tin - grid without edges', t => {
    const expected = require(path.join(__dirname,  'test', 'out', 'Tin-Grid_1.json'));
    const tinned = constrainedTin(points_grid, []);
    t.deepEqual(tinned, expected, 'tinned polygons match');
    //fs.writeFileSync(path.join(__dirname, 'test', 'out', 'Tin-Grid_1_tmp.json'), JSON.stringify(tinned, null, 2));
    t.end();
});

test('tin - grid with 1 edge', t => {
    const expected = require(path.join(__dirname,  'test', 'out', 'Tin-Grid_2.json'));
    const tinned = constrainedTin(points_grid, [[0, 5]]);
    t.deepEqual(tinned, expected, 'tinned polygons match');
    //fs.writeFileSync(path.join(__dirname, 'test', 'out', 'Tin-Grid_2_tmp.json'), JSON.stringify(tinned, null, 2));
    t.end();
});

test('tin - grid with 2 edges', t => {
    const expected = require(path.join(__dirname,  'test', 'out', 'Tin-Grid_3.json'));
    const tinned = constrainedTin(points_grid, [[0, 5], [5, 6]]);
    t.deepEqual(tinned, expected, 'tinned polygons match');
    //fs.writeFileSync(path.join(__dirname, 'test', 'out', 'Tin-Grid_3_tmp.json'), JSON.stringify(tinned, null, 2));
    t.end();
});

test('tin - error case', t => {
    t.throws(() => constrainedTin(points_grid, [[0, 100],[5, 6]]), /Vertex indices of edge 0/, 'Too big edge index');
    t.throws(() => constrainedTin(points_grid, [[0, 5],[1, 4]]), /Edge 1 already exists or intersects/, 'Edge intersecting');
    t.throws(() => constrainedTin(points_grid, [[1, 1]]), /Edge 0 is degenerate/, 'Same vertex edge');
    t.end();
});
