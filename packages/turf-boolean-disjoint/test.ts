import { glob } from "glob";
import path from "path";
import { fileURLToPath } from "url";
import test from "tape";
import { loadJsonFileSync } from "load-json-file";
import shapely from "boolean-shapely";
import { booleanDisjoint as disjoint } from "./index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test("turf-boolean-disjoint", (t) => {
  // True Fixtures
  glob
    .sync(path.join(__dirname, "test", "true", "**", "*.geojson"))
    .forEach((filepath) => {
      const name = path.parse(filepath).name;
      const geojson = loadJsonFileSync(filepath);
      const feature1 = geojson.features[0];
      const feature2 = geojson.features[1];
      const result = disjoint(feature1, feature2);

      if (process.env.SHAPELY)
        shapely
          .disjoint(feature1, feature2)
          .then((result) => t.true(result, "[true] shapely - " + name));
      t.true(result, "[true] " + name);
    });
  // False Fixtures
  glob
    .sync(path.join(__dirname, "test", "false", "**", "*.geojson"))
    .forEach((filepath) => {
      const name = path.parse(filepath).name;
      const geojson = loadJsonFileSync(filepath);
      const feature1 = geojson.features[0];
      const feature2 = geojson.features[1];
      const result = disjoint(feature1, feature2);

      if (process.env.SHAPELY)
        shapely
          .disjoint(feature1, feature2)
          .then((result) => t.false(result, "[false] shapely - " + name));
      t.false(result, "[false] " + name);
    });
  t.end();
});

test("turf-boolean-disjoin with ignoreSelfIntersections option", (t) => {
  const selfIntersectingLineString: GeoJSON.Feature<GeoJSON.LineString> = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: [
        [1, 1],
        [2, 2],
        [1, 2],
        [2, 1],
      ],
    },
  };

  const nonIntersectingLineString: GeoJSON.Feature<GeoJSON.LineString> = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: [
        [0, 1],
        [0, 0],
      ],
    },
  };

  const intersectingLineString: GeoJSON.Feature<GeoJSON.LineString> = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: [
        [0, 1],
        [4, 2],
      ],
    },
  };

  const intersectingPolygon: GeoJSON.Feature<GeoJSON.Polygon> = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [1.5, 1],
          [2, 1.5],

          [3, 0.5],
          [1.5, 1],
        ],
      ],
    },
  };

  const nonIntersectingPolygon: GeoJSON.Feature<GeoJSON.Polygon> = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [0.5, 0],
          [1, 0.5],

          [2, -0.5],
          [0.5, 0],
        ],
      ],
    },
  };

  // Test without ignoringSelfIntersections option (default behavior)
  let result = disjoint(selfIntersectingLineString, nonIntersectingLineString);
  t.false(
    result,
    "[false] " +
      "selfIntersectingLineString-LineString (ignoreSelfIntersections=false)"
  );
  result = disjoint(selfIntersectingLineString, intersectingLineString);
  t.false(
    result,
    "[false] " +
      "selfIntersectingLineString-LineString (ignoreSelfIntersections=false)"
  );
  result = disjoint(selfIntersectingLineString, intersectingPolygon);
  t.false(
    result,
    "[false] " +
      "selfIntersectingLineString-Polygon (ignoreSelfIntersections=false)"
  );
  result = disjoint(selfIntersectingLineString, nonIntersectingPolygon);
  t.false(
    result,
    "[false] " +
      "selfIntersectingLineString-Polygon (ignoreSelfIntersections=false)"
  );

  // Test with ignoringSelfIntersections option
  result = disjoint(selfIntersectingLineString, nonIntersectingLineString, {
    ignoreSelfIntersections: true,
  });
  t.true(
    result,
    "[true] " +
      "selfIntersectingLineString-LineString (ignoreSelfIntersections=true)"
  );
  result = disjoint(selfIntersectingLineString, intersectingLineString, {
    ignoreSelfIntersections: true,
  });
  t.false(
    result,
    "[false] " +
      "selfIntersectingLineString-LineString (ignoreSelfIntersections=true)"
  );
  result = disjoint(selfIntersectingLineString, intersectingPolygon, {
    ignoreSelfIntersections: true,
  });
  t.false(
    result,
    "[false] " +
      "selfIntersectingLineString-Polygon (ignoreSelfIntersections=true)"
  );
  result = disjoint(selfIntersectingLineString, nonIntersectingPolygon, {
    ignoreSelfIntersections: true,
  });
  t.true(
    result,
    "[true] " +
      "selfIntersectingLineString-Polygon (ignoreSelfIntersections=true)"
  );

  t.end();
});
