import test from "tape";
import { glob } from "glob";
import path from "path";
import { fileURLToPath } from "url";
import { writeJsonFileSync } from "write-json-file";
import { loadJsonFileSync } from "load-json-file";
import { featureCollection } from "@turf/helpers";
import { convex } from "./index.js";
import { type FeatureCollection } from "geojson";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const directories = {
  in: path.join(__dirname, "test", "in") + path.sep,
  out: path.join(__dirname, "test", "out") + path.sep,
};

test("convex hull", (t) => {
  glob.sync(directories.in + "*.geojson").forEach((filepath) => {
    const fileout = filepath.replace("/in/", "/out/");
    const geojson = loadJsonFileSync(filepath);

    const convexHull = convex(geojson);
    geojson.features.push(convexHull);

    if (process.env.REGEN) writeJsonFileSync(fileout, geojson);
    t.deepEqual(geojson, loadJsonFileSync(fileout), path.parse(filepath).name);
  });
  t.end();
});

test("turf-convex -- empty", (t) => {
  t.deepEqual(convex(featureCollection([])), null, "corner case: null hull");
  t.end();
});

test("turf-convex -- properties are transferred to result polygon", (t) => {
  const geoJson = loadJsonFileSync<FeatureCollection>(
    "./test/in/elevation2.geojson"
  );
  const expectedProperties = { cadastralData: [1220, 1290, 1440, 1943] };
  const actualPolygon = convex(geoJson, { properties: expectedProperties });
  t.deepEqual(
    actualPolygon?.properties,
    expectedProperties,
    "properties do not match"
  );
  t.end();
});
