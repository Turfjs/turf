import path from "path";
import test from "tape";
import load from "load-json-file";
import tag from "./index";

test("tag", (t) => {
  const points = load.sync(path.join(__dirname, "test", "tagPoints.geojson"));
  const polygons = load.sync(
    path.join(__dirname, "test", "tagPolygons.geojson")
  );

  const taggedPoints = tag(points, polygons, "polyID", "containingPolyID");

  t.ok(taggedPoints.features, "features should be ok");
  t.equal(
    taggedPoints.features.length,
    points.features.length,
    "tagged points should have the same length as the input points"
  );

  const count = taggedPoints.features.filter(
    (pt) => pt.properties.containingPolyID === 4
  ).length;
  t.equal(count, 6, "polygon 4 should have tagged 6 points");
  t.end();
});

test("tag -- multipolygon support", (t) => {
  const points = load.sync(
    path.join(__dirname, "test", "tagMultiPolygonsPoints.geojson")
  );
  const polygons = load.sync(
    path.join(__dirname, "test", "tagMultiPolygons.geojson")
  );

  const taggedPoints = tag(points, polygons, "polyID", "containingPolyID");
  t.ok(taggedPoints.features, "features should be ok");

  t.equal(
    taggedPoints.features.length,
    points.features.length,
    "tagged points should have the same length as the input points"
  );

  const count1 = taggedPoints.features.filter(
    (pt) => pt.properties.containingPolyID === 1
  ).length;
  t.equal(count1, 2, "polygon 1 should have 2 points");

  const countUndefined = taggedPoints.features.filter(
    (pt) =>
      !Object.prototype.hasOwnProperty.call(pt.properties, "containingPolyID")
  ).length;
  t.equal(countUndefined, 1, "1 point should have no containingPolyID");

  t.end();
});
