import { glob } from "glob";
import path from "path";
import { fileURLToPath } from "url";
import test from "tape";
import { loadJsonFileSync } from "load-json-file";
import shapely from "boolean-shapely";
import { booleanIntersects as intersects } from "./index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test("turf-boolean-intersects", (t) => {
  // True Fixtures
  glob
    .sync(path.join(__dirname, "test", "true", "**", "*.geojson"))
    .forEach((filepath) => {
      const name = path.parse(filepath).name;
      const geojson = loadJsonFileSync(filepath);
      const feature1 = geojson.features[0];
      const feature2 = geojson.features[1];
      const result = intersects(feature1, feature2);

      if (process.env.SHAPELY)
        shapely
          .intersects(feature1, feature2)
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
      const result = intersects(feature1, feature2);

      if (process.env.SHAPELY)
        shapely
          .intersects(feature1, feature2)
          .then((result) => t.false(result, "[false] shapely - " + name));
      t.false(result, "[false] " + name);
    });
  t.end();
});

test("turf-boolean-intersects with ignoreSelfIntersections option", (t) => {
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
  let result = intersects(
    selfIntersectingLineString,
    nonIntersectingLineString
  );
  t.false(
    result,
    "[false] " +
      "selfIntersectingLineString-LineString (ignoreSelfIntersections=true)"
  );
  result = intersects(selfIntersectingLineString, intersectingLineString);
  t.true(
    result,
    "[true] " +
      "selfIntersectingLineString-LineString (ignoreSelfIntersections=true)"
  );
  result = intersects(selfIntersectingLineString, intersectingPolygon);
  t.true(
    result,
    "[true] " +
      "selfIntersectingLineString-Polygon (ignoreSelfIntersections=true)"
  );
  result = intersects(selfIntersectingLineString, nonIntersectingPolygon);
  t.false(
    result,
    "[false] " +
      "selfIntersectingLineString-Polygon (ignoreSelfIntersections=true)"
  );

  // Test with ignoringSelfIntersections option
  result = intersects(selfIntersectingLineString, nonIntersectingLineString, {
    ignoreSelfIntersections: false,
  });
  t.true(
    result,
    "[true] " +
      "selfIntersectingLineString-LineString (ignoreSelfIntersections=false)"
  );
  result = intersects(selfIntersectingLineString, intersectingLineString, {
    ignoreSelfIntersections: false,
  });
  t.true(
    result,
    "[true] " +
      "selfIntersectingLineString-LineString (ignoreSelfIntersections=false)"
  );
  result = intersects(selfIntersectingLineString, intersectingPolygon, {
    ignoreSelfIntersections: false,
  });
  t.true(
    result,
    "[true] " +
      "selfIntersectingLineString-Polygon (ignoreSelfIntersections=false)"
  );
  result = intersects(selfIntersectingLineString, nonIntersectingPolygon, {
    ignoreSelfIntersections: false,
  });
  t.true(
    result,
    "[true] " +
      "selfIntersectingLineString-Polygon (ignoreSelfIntersections=false)"
  );

  t.end();
});
