const fs = require('fs');
const path = require('path');
const test = require('tape');
const load = require('load-json-file');
const write = require('write-json-file');
const constrainedTin = require('./');

const directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep,
    out: path.join(__dirname, 'test', 'out') + path.sep
};

const fixtures = fs.readdirSync(directories.in).map(filename => {
    return {
        filename: filename,
        name: path.parse(filename).name,
        geojson: load.sync(directories.in + filename)
    };
});
let grid_case;
test('turf-constrained-tin', t => {
    fixtures.forEach(fixture => {
        const filename = fixture.filename;
        const name = fixture.name;
        const geojson = fixture.geojson;
        if (filename === 'Grid_no_edges.json') grid_case = geojson;
        const properties = geojson.properties || {};
        const edges = properties.edges;
        const z = properties.z;

        const results = constrainedTin(geojson, edges, z);

        if (process.env.REGEN) write.sync(directories.out + filename, results);
        t.deepEquals(results, load.sync(directories.out + filename), name);
    });
    t.end();
});

test('tin - error case', t => {
    t.throws(() => constrainedTin([]), /Argument points must be/, 'Points type check');
    t.throws(() => constrainedTin(grid_case, "edges"), /Argument points must be/, 'Edges type check');
    t.throws(() => constrainedTin(grid_case, [[1, 2]], []), /Argument z must be/, 'Z type check');
    t.throws(() => constrainedTin(grid_case, [[0, 100],[5, 6]]), /Vertex indices of edge 0/, 'Too big edge index');
    t.throws(() => constrainedTin(grid_case, [[0, 5],[1, 4]]), /Edge 1 already exists or intersects/, 'Edge intersecting');
    t.throws(() => constrainedTin(grid_case, [[1, 1]]), /Edge 0 is degenerate/, 'Same vertex edge');
    t.end();
});
