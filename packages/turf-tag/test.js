import path from 'path';
import test from 'tape';
import load from 'load-json-file';
import tag from '.';

test('tag', t => {
    const points = load.sync(path.join(__dirname, 'test', 'tagPoints.geojson'));
    const polygons = load.sync(path.join(__dirname, 'test', 'tagPolygons.geojson'));

    const taggedPoints = tag(points, polygons, 'polyID', 'containingPolyID');

    t.ok(taggedPoints.features, 'features should be ok');
    t.equal(taggedPoints.features.length, points.features.length,
        'tagged points should have the same length as the input points');

    const count = taggedPoints.features.filter(pt => pt.properties.containingPolyID === 4).length;
    t.equal(count, 6, 'polygon 4 should have tagged 6 points');
    t.end();
});
