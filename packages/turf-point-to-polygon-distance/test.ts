import fs from "fs";
import test from "tape";
import path from "path";
import { fileURLToPath } from "url";
import { loadJsonFileSync } from "load-json-file";
import { point } from "@turf/helpers";
import { polygon } from "@turf/helpers";
import { pointToPolygonDistance } from "./index.js";
import { featureCollection } from "@turf/helpers";
import {
  Feature,
  GeoJsonProperties,
  MultiPolygon,
  Point,
  Polygon,
} from "geojson";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const fixturesPath = path.join(__dirname, "test_fixtures") + path.sep;

const fixtures = fs.readdirSync(fixturesPath).map((filename) => {
  return {
    filename,
    name: path.parse(filename).name,
    geojson: loadJsonFileSync(fixturesPath + filename),
  };
});

test("turf-point-to-polygon-distance", (t) => {
  for (const { name, geojson } of fixtures) {
    // @ts-expect-error geojson
    const fc = featureCollection(geojson?.features || []);
    const points: Feature<Point, GeoJsonProperties>[] = fc.features.filter(
      (f): f is Feature<Point, GeoJsonProperties> => f.geometry.type === "Point"
    );
    const polygon = fc.features.find((f) =>
      ["Polygon", "MultiPolygon"].includes(f.geometry.type)
    ) as Feature<Polygon | MultiPolygon, GeoJsonProperties>;
    if (!polygon)
      throw new Error(`No polygon found in the feature collection in ${name}`);
    for (const point of points) {
      const expectedDistance = point.properties?.expected_distance;
      const units = point.properties?.units;
      const distance = pointToPolygonDistance(point, polygon, { units });
      t.equal(distance, expectedDistance, name, {
        message: `${name} - ${point.properties?.name}`,
      });
    }
  }
  // Handle Errors
  t.throws(
    // @ts-expect-error invalid geometry
    () => pointToPolygonDistance(polygon([]), polygon([])),
    "throws - invalid geometry"
  );
  t.throws(
    () => pointToPolygonDistance(point([0, 0]), polygon([])),
    "throws - empty coordinates"
  );
  t.end();
});
