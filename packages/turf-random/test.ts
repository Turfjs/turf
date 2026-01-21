import test from "tape";
import distance from "@turf/distance";
import bearing from "@turf/bearing";
import { radiansToDegrees } from "@turf/helpers";
import {
  randomPoint,
  randomPolygon,
  randomLineString,
  randomPosition,
} from "./index.js";

test("random(points)", (t) => {
  var points = randomPoint();
  t.equal(points.type, "FeatureCollection", "is a featurecollection");
  t.equal(points.features.length, 1, "right number of features");
  t.equal(points.features[0].geometry.type, "Point", "feature type correct");
  t.end();
});

test("random(polygons)", (t) => {
  var points = randomPolygon();
  t.equal(points.type, "FeatureCollection", "is a featurecollection");
  t.equal(points.features.length, 1, "right number of features");
  t.equal(points.features[0].geometry.type, "Polygon", "feature type correct");
  t.end();
});

test("random(polygons, 10)", (t) => {
  var points = randomPolygon(10);
  t.equal(points.type, "FeatureCollection", "is a featurecollection");
  t.equal(points.features.length, 10, "right number of features");
  t.equal(points.features[0].geometry.type, "Polygon", "feature type correct");
  t.end();
});

test("random(polygons, 10, {num_vertices})", (t) => {
  var points = randomPolygon(10, { num_vertices: 23 });
  t.equal(points.type, "FeatureCollection", "is a featurecollection");
  t.equal(points.features.length, 10, "right number of features");
  t.equal(
    points.features[0].geometry.coordinates[0].length,
    24,
    "num vertices"
  );
  t.end();
});

test("random(polygons, 10, {numVertices})", (t) => {
  var points = randomPolygon(10, { numVertices: 23 });
  t.equal(points.type, "FeatureCollection", "is a featurecollection");
  t.equal(points.features.length, 10, "right number of features");
  t.equal(
    points.features[0].geometry.coordinates[0].length,
    24,
    "num vertices"
  );
  t.end();
});

test("random(points, 10, {bbox})", (t) => {
  var points = randomPoint(10, { bbox: [0, 0, 0, 0] });
  t.equal(points.type, "FeatureCollection", "is a featurecollection");
  t.equal(points.features.length, 10, "right number of features");
  t.equal(points.features[0].geometry.type, "Point", "feature type correct");
  t.deepEqual(
    points.features[0].geometry.coordinates,
    [0, 0],
    "feature type correct"
  );
  t.end();
});

test("bbox input gets validated", (t) => {
  const bbox = [
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
  ]; // this is invalid

  t.throws(() => {
    randomPoint(1, { bbox });
  }, "randomPoint checks bbox validity");
  t.throws(() => {
    randomPolygon(1, { bbox });
  }, "randomPolygon checks bbox validity");
  t.throws(() => {
    randomLineString(1, { bbox });
  }, "randomLineString checks bbox validity");
  t.throws(() => {
    randomPosition(bbox);
  }, "randomPosition checks bbox validity");
  t.end();
});

test("random(lines)", (t) => {
  var lines = randomLineString();
  t.equal(lines.type, "FeatureCollection", "is a featurecollection");
  t.equal(lines.features.length, 1, "right number of features");
  t.equal(
    lines.features[0].geometry.type,
    "LineString",
    "feature type correct"
  );
  t.end();
});

test("random(lines, 10)", (t) => {
  var lines = randomLineString(10);
  t.equal(lines.type, "FeatureCollection", "is a featurecollection");
  t.equal(lines.features.length, 10, "right number of features");
  t.equal(
    lines.features[0].geometry.type,
    "LineString",
    "feature type correct"
  );
  t.end();
});

test("random(lines, 10, {num_vertices})", (t) => {
  var lines = randomLineString(10, { num_vertices: 10 });
  t.equal(lines.type, "FeatureCollection", "is a featurecollection");
  t.equal(lines.features.length, 10, "right number of features");
  t.equal(lines.features[0].geometry.coordinates.length, 10, "num vertices");
  t.end();
});

test("random(lines, 10, {numVertices})", (t) => {
  var lines = randomLineString(10, { numVertices: 10 });
  t.equal(lines.type, "FeatureCollection", "is a featurecollection");
  t.equal(lines.features.length, 10, "right number of features");
  t.equal(lines.features[0].geometry.coordinates.length, 10, "num vertices");
  t.end();
});

test("random(lines, 10, {bbox})", (t) => {
  var lines = randomLineString(10, { bbox: [0, 0, 0, 0] });
  t.equal(lines.type, "FeatureCollection", "is a featurecollection");
  t.equal(lines.features.length, 10, "right number of features");
  t.equal(
    lines.features[0].geometry.type,
    "LineString",
    "feature type correct"
  );
  t.deepEqual(
    lines.features[0].geometry.coordinates[0],
    [0, 0],
    "feature type correct"
  );
  t.end();
});

test("random(lines, 10, {max_length})", (t) => {
  var lines = randomLineString(10, { max_length: 0.1 });
  t.equal(lines.type, "FeatureCollection", "is a featurecollection");
  t.equal(lines.features.length, 10, "right number of features");
  t.equal(
    lines.features[0].geometry.type,
    "LineString",
    "feature type correct"
  );
  let ok = true;
  for (let i = 1; i < lines.features[0].geometry.coordinates.length; i++) {
    const length = distance(
      lines.features[0].geometry.coordinates[i - 1],
      lines.features[0].geometry.coordinates[i],
      { units: "degrees" }
    );
    if (length > 0.1) ok = false;
  }
  t.ok(ok, "randomLineString ensures max_length");
  t.end();
});

test("random(lines, 10, {maxDistance})", (t) => {
  var lines = randomLineString(10, { maxDistance: 0.1 });
  t.equal(lines.type, "FeatureCollection", "is a featurecollection");
  t.equal(lines.features.length, 10, "right number of features");
  t.equal(
    lines.features[0].geometry.type,
    "LineString",
    "feature type correct"
  );
  let ok = true;
  for (let i = 1; i < lines.features[0].geometry.coordinates.length; i++) {
    const length = distance(
      lines.features[0].geometry.coordinates[i - 1],
      lines.features[0].geometry.coordinates[i],
      { units: "degrees" }
    );
    if (length > 0.1) ok = false;
  }
  t.ok(ok, "randomLineString ensures maxDistance");
  t.end();
});

test("random(lines, 10, {maxDistance})", (t) => {
  var lines = randomLineString(10, {
    maxDistance: 10,
    distanceUnits: "kilometers",
  });
  t.equal(lines.type, "FeatureCollection", "is a featurecollection");
  t.equal(lines.features.length, 10, "right number of features");
  t.equal(
    lines.features[0].geometry.type,
    "LineString",
    "feature type correct"
  );
  let ok = true;
  for (let i = 1; i < lines.features[0].geometry.coordinates.length; i++) {
    const length = distance(
      lines.features[0].geometry.coordinates[i - 1],
      lines.features[0].geometry.coordinates[i],
      { units: "kilometers" }
    );
    if (length > 10) ok = false;
  }
  t.ok(ok, "randomLineString ensures maxDistance in another unit");
  t.end();
});

test("random(lines, 10, {max_rotation})", (t) => {
  var lines = randomLineString(10, { max_rotation: Math.PI / 10 });
  t.equal(lines.type, "FeatureCollection", "is a featurecollection");
  t.equal(lines.features.length, 10, "right number of features");
  t.equal(
    lines.features[0].geometry.type,
    "LineString",
    "feature type correct"
  );
  let ok = true;
  for (let i = 2; i < lines.features[0].geometry.coordinates.length; i++) {
    // Compute the differential angle with the previous segment
    let bearing1 = bearing(
      lines.features[0].geometry.coordinates[i - 2],
      lines.features[0].geometry.coordinates[i - 1]
    );
    //if (bearing1 < 0) bearing1 += 360;
    let bearing2 = bearing(
      lines.features[0].geometry.coordinates[i - 1],
      lines.features[0].geometry.coordinates[i]
    );
    //if (bearing2 < 0) bearing2 += 360;
    const difference =
      bearing1 * bearing2 < 0
        ? bearing2 + bearing1
        : Math.abs(bearing2 - bearing1);
    if (difference > 18) ok = false;
  }
  t.ok(ok, "randomLineString ensures max_rotation");
  t.end();
});

test("random(lines, 10, {maxAngle})", (t) => {
  var lines = randomLineString(10, { maxAngle: Math.PI / 10 });
  t.equal(lines.type, "FeatureCollection", "is a featurecollection");
  t.equal(lines.features.length, 10, "right number of features");
  t.equal(
    lines.features[0].geometry.type,
    "LineString",
    "feature type correct"
  );
  let ok = true;
  for (let i = 2; i < lines.features[0].geometry.coordinates.length; i++) {
    // Compute the differential angle with the previous segment
    let bearing1 = bearing(
      lines.features[0].geometry.coordinates[i - 2],
      lines.features[0].geometry.coordinates[i - 1]
    );
    //if (bearing1 < 0) bearing1 += 360;
    let bearing2 = bearing(
      lines.features[0].geometry.coordinates[i - 1],
      lines.features[0].geometry.coordinates[i]
    );
    //if (bearing2 < 0) bearing2 += 360;
    const difference =
      bearing1 * bearing2 < 0
        ? bearing2 + bearing1
        : Math.abs(bearing2 - bearing1);
    if (difference > 18) ok = false;
  }
  t.ok(ok, "randomLineString ensures maxAngle");
  t.end();
});

test("random(lines, 10, {maxAngle})", (t) => {
  var lines = randomLineString(10, {
    maxAngle: radiansToDegrees(Math.PI / 10),
    angleUnits: "degrees",
  });
  t.equal(lines.type, "FeatureCollection", "is a featurecollection");
  t.equal(lines.features.length, 10, "right number of features");
  t.equal(
    lines.features[0].geometry.type,
    "LineString",
    "feature type correct"
  );
  let ok = true;
  for (let i = 2; i < lines.features[0].geometry.coordinates.length; i++) {
    // Compute the differential angle with the previous segment
    let bearing1 = bearing(
      lines.features[0].geometry.coordinates[i - 2],
      lines.features[0].geometry.coordinates[i - 1]
    );
    //if (bearing1 < 0) bearing1 += 360;
    let bearing2 = bearing(
      lines.features[0].geometry.coordinates[i - 1],
      lines.features[0].geometry.coordinates[i]
    );
    //if (bearing2 < 0) bearing2 += 360;
    const difference =
      bearing1 * bearing2 < 0
        ? bearing2 + bearing1
        : Math.abs(bearing2 - bearing1);
    if (difference > 18) ok = false;
  }
  t.ok(ok, "randomLineString ensures maxAngle in another unit");
  t.end();
});
