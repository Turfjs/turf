import test from 'tape';
import { point, points } from '@turf/helpers';
import { polygon } from '@turf/helpers';
import { featureCollection } from '@turf/helpers';
import pointsWithinPolygon from '.';

test('turf-points-within-polygon', t => {
    t.plan(4);

    // test with a single point
    var poly = polygon([[[0, 0], [0, 100], [100, 100], [100, 0], [0, 0]]]);
    var pt = point([50, 50]);
    var polyFC = featureCollection([poly]);
    var ptFC = featureCollection([pt]);

    var counted = pointsWithinPolygon(ptFC, polyFC);

    t.ok(counted, 'returns a featurecollection');
    t.equal(counted.features.length, 1, '1 point in 1 polygon');

    // test with multiple points and multiple polygons
    var poly1 = polygon([[[0, 0], [10, 0], [10, 10], [0, 10], [0, 0]]]);
    var poly2 = polygon([[[10, 0], [20, 10], [20, 20], [20, 0], [10, 0]]]);
    var polyFC = featureCollection([poly1, poly2]);
    var pt1 = point([1, 1], {population: 500});
    var pt2 = point([1, 3], {population: 400});
    var pt3 = point([14, 2], {population: 600});
    var pt4 = point([13, 1], {population: 500});
    var pt5 = point([19, 7], {population: 200});
    var pt6 = point([100, 7], {population: 200});
    var ptFC = featureCollection([pt1, pt2, pt3, pt4, pt5, pt6]);

    var counted = pointsWithinPolygon(ptFC, polyFC);
    t.ok(counted, 'returns a featurecollection');
    t.equal(counted.features.length, 5, 'multiple points in multiple polygons');
});

test('turf-points-within-polygon -- support extra geometry', t => {
    const pts = points([
        [-46.6318, -23.5523],
        [-46.6246, -23.5325],
        [-46.6062, -23.5513],
        [-46.663, -23.554],
        [-46.643, -23.557]
    ]);
    const searchWithin = polygon([[
        [-46.653,-23.543],
        [-46.634,-23.5346],
        [-46.613,-23.543],
        [-46.614,-23.559],
        [-46.631,-23.567],
        [-46.653,-23.560],
        [-46.653,-23.543]
    ]]);
    t.assert(pointsWithinPolygon(pts, searchWithin));
    t.assert(pointsWithinPolygon(pts.features[0], searchWithin));
    t.assert(pointsWithinPolygon(pts, searchWithin.geometry));
    t.end()    
});

test('turf-points-within-polygon -- no duplicates when multiple geometry contain a point', t => {
    const poly1 = polygon([[[0, 0], [10, 0], [10, 10], [0, 10], [0, 0]]]);
    const poly2 = polygon([[[0, 0], [10, 0], [10, 10], [0, 10], [0, 0]]]);
    const polyFC = featureCollection([poly1, poly2]);
    const pt1 = point([5, 5]);
    const ptFC = featureCollection([pt1]);

    const counted = pointsWithinPolygon(ptFC, polyFC);
    t.equal(counted.features.length, 1, 'although point is contained by two polygons it is only counted once');
    t.end();
});
