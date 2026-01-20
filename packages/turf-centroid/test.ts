import path from "path";
import { fileURLToPath } from "url";
import test from "tape";
import { glob } from "glob";
import { loadJsonFileSync } from "load-json-file";
import { writeJsonFileSync } from "write-json-file";
import { featureEach } from "@turf/meta";
import { featureCollection, lineString } from "@turf/helpers";
import { centroid } from "./index.js";
import { circle } from "@turf/circle";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const directories = {
  in: path.join(__dirname, "test", "in") + path.sep,
  out: path.join(__dirname, "test", "out") + path.sep,
};

const fixtures = glob.sync(directories.in + "*.geojson").map((input) => {
  const name = path.parse(input).name;
  const base = path.parse(input).base;
  return {
    name,
    filename: base,
    geojson: loadJsonFileSync(input),
    out: directories.out + base,
  };
});

test("centroid", (t) => {
  fixtures.forEach((fixture) => {
    const name = fixture.name;
    const geojson = fixture.geojson;
    const out = fixture.out;
    const centered = centroid(geojson, {
      properties: { "marker-symbol": "circle" },
    });
    const result = featureCollection([centered]);
    featureEach(geojson, (feature) => result.features.push(feature));

    if (process.env.REGEN) writeJsonFileSync(out, result);
    t.deepEqual(result, loadJsonFileSync(out), name);
  });
  t.end();
});

test("centroid -- circle consistency", (t) => {
  const circ = circle([4.832, 45.7578], 4000);
  const center = centroid(circ);
  t.true(
    Math.abs(center.geometry.coordinates[0] - 4.832) < 0.0000001,
    "lon equality"
  );
  t.true(
    Math.abs(center.geometry.coordinates[1] - 45.7578) < 0.0000001,
    "lat equality"
  );
  t.end();
});

test("centroid -- properties", (t) => {
  const line = lineString([
    [0, 0],
    [1, 1],
  ]);
  const pt = centroid(line, { properties: { foo: "bar" } });
  t.equal(pt.properties.foo, "bar", "translate properties");
  t.end();
});
