import test from "tape";
import { multiPoint, point, points } from "@turf/helpers";
import { polygon } from "@turf/helpers";
import { featureCollection } from "@turf/helpers";
import pointsWithinPolygon from "./index";

test("turf-points-within-polygon -- point", (t) => {
  t.plan(4);

  // test with a single point
  var poly = polygon([
    [
      [0, 0],
      [0, 100],
      [100, 100],
      [100, 0],
      [0, 0],
    ],
  ]);
  var pt = point([50, 50]);
  var polyFC = featureCollection([poly]);
  var ptFC = featureCollection([pt]);

  var counted = pointsWithinPolygon(ptFC, polyFC);

  t.ok(counted, "returns a featurecollection");
  t.equal(counted.features.length, 1, "1 point in 1 polygon");

  // test with multiple points and multiple polygons
  var poly1 = polygon([
    [
      [0, 0],
      [10, 0],
      [10, 10],
      [0, 10],
      [0, 0],
    ],
  ]);
  var poly2 = polygon([
    [
      [10, 0],
      [20, 10],
      [20, 20],
      [20, 0],
      [10, 0],
    ],
  ]);
  var polyFC = featureCollection([poly1, poly2]);
  var pt1 = point([1, 1], { population: 500 });
  var pt2 = point([1, 3], { population: 400 });
  var pt3 = point([14, 2], { population: 600 });
  var pt4 = point([13, 1], { population: 500 });
  var pt5 = point([19, 7], { population: 200 });
  var pt6 = point([100, 7], { population: 200 });
  var ptFC = featureCollection([pt1, pt2, pt3, pt4, pt5, pt6]);

  var counted = pointsWithinPolygon(ptFC, polyFC);
  t.ok(counted, "returns a featurecollection");
  t.equal(counted.features.length, 5, "multiple points in multiple polygons");
});

test("turf-points-within-polygon -- multipoint", (t) => {
  t.plan(12);

  var poly1 = polygon([
    [
      [0, 0],
      [0, 100],
      [100, 100],
      [100, 0],
      [0, 0],
    ],
  ]);

  var mpt1 = multiPoint([[50, 50]]); // inside poly1
  var mpt2 = multiPoint([[150, 150]]); // outside poly1
  var mpt3 = multiPoint([
    [50, 50],
    [150, 150],
  ]); // inside and outside poly1
  var mpt1FC = featureCollection([mpt1]);
  var polyFC = featureCollection([poly1]);

  // multipoint within
  var mpWithin = pointsWithinPolygon(mpt1, polyFC);
  t.ok(
    mpWithin && mpWithin.type === "FeatureCollection",
    "returns a featurecollection"
  );
  t.equal(mpWithin.features.length, 1, "1 multipoint in 1 polygon");
  t.equal(
    mpWithin.features[0].geometry.type,
    "MultiPoint",
    "1 multipoint with correct type"
  );

  // multipoint fc within
  var fcWithin = pointsWithinPolygon(mpt1FC, polyFC);
  t.ok(
    fcWithin && fcWithin.type === "FeatureCollection",
    "returns a featurecollection"
  );
  t.equal(fcWithin.features.length, 1, "1 multipoint in 1 polygon");

  // multipoint not within
  var mpNotWithin = pointsWithinPolygon(mpt2, polyFC);
  t.ok(
    mpNotWithin && mpNotWithin.type === "FeatureCollection",
    "returns an empty featurecollection"
  );
  t.equal(mpNotWithin.features.length, 0, "0 multipoint in 1 polygon");

  // multipoint with point coords both within and not within
  var mpPartWithin = pointsWithinPolygon(mpt3, polyFC);
  t.ok(mpPartWithin, "returns a featurecollection");
  var partCoords = mpPartWithin.features[0].geometry.coordinates;
  t.equal(
    partCoords.length,
    1,
    "multipoint result should have 1 remaining coord that was within polygon"
  );
  t.equal(
    partCoords[0][0] === mpt3.geometry.coordinates[0][0] &&
      partCoords[0][1] === mpt3.geometry.coordinates[0][1],
    true,
    "remaining coord should have expected values"
  );

  // multiple multipoints and multiple polygons

  var poly2 = polygon([
    [
      [10, 0],
      [20, 10],
      [20, 20],
      [20, 0],
      [10, 0],
    ],
  ]);
  var mptFC = featureCollection([mpt1, mpt2, mpt3]);
  var poly2FC = featureCollection([poly1, poly2]);

  var fcMultiWithin = pointsWithinPolygon(mptFC, poly2FC);
  t.ok(fcMultiWithin, "returns a featurecollection");
  t.equal(
    fcMultiWithin.features.length,
    2,
    "multiple points in multiple polygons"
  );
});

test("turf-points-within-polygon -- point and multipoint", (t) => {
  t.plan(4);

  var poly = polygon([
    [
      [0, 0],
      [0, 100],
      [100, 100],
      [100, 0],
      [0, 0],
    ],
  ]);
  var polyFC = featureCollection([poly]);

  var pt = point([50, 50]);
  var mpt1 = multiPoint([[50, 50]]); // inside poly1
  var mpt2 = multiPoint([[150, 150]]); // outside poly1
  var mixedFC = featureCollection([pt, mpt1, mpt2]);

  var counted = pointsWithinPolygon(mixedFC, polyFC);

  t.ok(counted, "returns a featurecollection");
  t.equal(counted.features.length, 2, "1 point and 1 multipoint in 1 polygon");
  t.equal(counted.features[0].geometry.type, "Point");
  t.equal(counted.features[1].geometry.type, "MultiPoint");
});

test("turf-points-within-polygon -- support extra point geometry", (t) => {
  const pts = points([
    [-46.6318, -23.5523],
    [-46.6246, -23.5325],
    [-46.6062, -23.5513],
    [-46.663, -23.554],
    [-46.643, -23.557],
  ]);
  const searchWithin = polygon([
    [
      [-46.653, -23.543],
      [-46.634, -23.5346],
      [-46.613, -23.543],
      [-46.614, -23.559],
      [-46.631, -23.567],
      [-46.653, -23.56],
      [-46.653, -23.543],
    ],
  ]);
  t.assert(pointsWithinPolygon(pts, searchWithin));
  t.assert(pointsWithinPolygon(pts.features[0], searchWithin));
  t.assert(pointsWithinPolygon(pts, searchWithin.geometry));
  t.end();
});

test("turf-points-within-polygon -- no duplicates when multiple geometry contain a point", (t) => {
  const poly1 = polygon([
    [
      [0, 0],
      [10, 0],
      [10, 10],
      [0, 10],
      [0, 0],
    ],
  ]);
  const poly2 = polygon([
    [
      [0, 0],
      [10, 0],
      [10, 10],
      [0, 10],
      [0, 0],
    ],
  ]);
  const polyFC = featureCollection([poly1, poly2]);
  const pt1 = point([5, 5]);
  const ptFC = featureCollection([pt1]);

  const counted = pointsWithinPolygon(ptFC, polyFC);
  t.equal(
    counted.features.length,
    1,
    "although point is contained by two polygons it is only counted once"
  );
  t.end();
});

test("turf-points-within-polygon -- multipoint with properties", (t) => {
  t.plan(5);

  var poly1 = polygon([
    [
      [0, 0],
      [0, 100],
      [100, 100],
      [100, 0],
      [0, 0],
    ],
  ]);

  var mpt1 = multiPoint(
    [
      [50, 50],
      [150, 150],
    ],
    { prop: "yes" }
  ); // inside and outside poly1
  var polyFC = featureCollection([poly1]);

  // multipoint within
  var mpWithin = pointsWithinPolygon(mpt1, polyFC);
  t.ok(mpWithin, "returns a featurecollection");
  t.equal(mpWithin.features.length, 1, "1 multipoint in 1 polygon");
  t.equal(
    mpWithin.features[0].properties.constructor,
    Object,
    "properties found"
  );
  t.ok("prop" in mpWithin.features[0].properties, "1 property key found");
  t.equal(
    mpWithin.features[0].properties.prop,
    "yes",
    "1 property value found"
  );
});
