import path from "path";
import { fileURLToPath } from "url";
import test from "tape";
import { glob } from "glob";
import { loadJsonFileSync } from "load-json-file";
import { writeJsonFileSync } from "write-json-file";
import { featureEach } from "@turf/meta";
import { point, lineString, polygon, featureCollection } from "@turf/helpers";
import { centerOfMass } from "./index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const directories = {
  in: path.join(__dirname, "test", "in") + path.sep,
  out: path.join(__dirname, "test", "out") + path.sep,
};

const fixtures = glob.sync(directories.in + "*.geojson").map((input) => {
  const base = path.parse(input).base;
  return {
    name: path.parse(input).name,
    filename: base,
    geojson: loadJsonFileSync(input),
    out: directories.out + base,
  };
});

test("center of mass", (t) => {
  fixtures.forEach((fixture) => {
    const name = fixture.name;
    const out = fixture.out;
    const geojson = fixture.geojson;
    const centered = centerOfMass(geojson, { "marker-symbol": "circle" });
    const result = featureCollection([centered]);
    featureEach(geojson, (feature) => result.features.push(feature));

    if (process.env.REGEN) writeJsonFileSync(out, result);
    t.deepEqual(result, loadJsonFileSync(out), name);
  });
  t.end();
});

test("center of mass -- Geometry Support", (t) => {
  const line = lineString([
    [0, 0],
    [1, 1],
  ]);
  const poly = polygon([
    [
      [0, 0],
      [3, 3],
      [-5, -5],
      [0, 0],
    ],
  ]);

  t.deepEqual(
    centerOfMass(poly.geometry),
    centerOfMass(poly),
    "polygon geometry/feature should be equal"
  );
  t.deepEqual(
    centerOfMass(line.geometry),
    centerOfMass(line),
    "lineString geometry/feature should be equal"
  );
  t.end();
});

test("center of mass -- no area", (t) => {
  const poly = polygon([
    [
      [0, 0],
      [0, 0],
      [0, 0],
      [0, 0],
    ],
  ]);
  const pt = centerOfMass(poly);
  t.deepEqual(pt, point([0, 0]), "polygon has no area");
  t.end();
});

test("center of mass -- polygon with a hole", (t) => {
  const outer = [
    [0, 0],
    [10, 0],
    [10, 10],
    [0, 10],
    [0, 0],
  ];
  const hole = [
    [6, 2],
    [6, 4],
    [8, 4],
    [8, 2],
    [6, 2],
  ];
  const expected = point([59 / 12, 61 / 12]);

  for (const reverseOuter of [false, true]) {
    for (const reverseHole of [false, true]) {
      const poly = polygon([
        reverseOuter ? outer.slice().reverse() : outer,
        reverseHole ? hole.slice().reverse() : hole,
      ]);
      const winding = `outer reversed: ${reverseOuter}, hole reversed: ${reverseHole}`;
      t.deepEqual(centerOfMass(poly), expected, `feature, ${winding}`);
      t.deepEqual(
        centerOfMass(poly.geometry),
        expected,
        `geometry, ${winding}`
      );
    }
  }
  t.end();
});

test("center of mass -- point", (t) => {
  const p = point([0, 0]);
  const pt = centerOfMass(p);
  t.deepEqual(pt, point([0, 0]), "point returns pt");
  t.end();
});

test("center of mass -- point geom", (t) => {
  const geomPoint = { type: "Point", coordinates: [0, 0] };
  const pt = centerOfMass(geomPoint);
  t.deepEqual(pt, point([0, 0]), "point geom returns pt");
  t.end();
});

test("center of mass -- properties", (t) => {
  const line = lineString([
    [0, 0],
    [1, 1],
  ]);
  const pt = centerOfMass(line, { properties: { foo: "bar" } });
  t.equal(pt.properties.foo, "bar", "translate properties");
  t.end();
});
