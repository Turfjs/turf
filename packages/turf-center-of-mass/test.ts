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

test("center of mass -- polygon with a hole", (t) => {
  // Outer ring is a 10x10 square, the hole a 2x2 square sitting off-centre at
  // x in [6, 8], y in [2, 4]. Subtracting the hole's area and moments from the
  // square's gives an exact answer of [59/12, 61/12].
  const outer = [
    [0, 0],
    [10, 0],
    [10, 10],
    [0, 10],
    [0, 0],
  ];
  // Counter-clockwise hole, the winding the report in #3173 used.
  const holeCCW = [
    [6, 2],
    [8, 2],
    [8, 4],
    [6, 4],
    [6, 2],
  ];
  // Clockwise hole, the winding RFC 7946 prescribes for interior rings.
  const holeCW = [
    [6, 2],
    [6, 4],
    [8, 4],
    [8, 2],
    [6, 2],
  ];
  // Exact values are 59/12 and 61/12; 9 decimal places is well inside double
  // precision for them and still an order of magnitude finer than the error
  // this test guards against.
  const expected = ["4.916666667", "5.083333333"];
  const rounded = (coords: number[]) => coords.map((n: number) => n.toFixed(9));

  const withCCWHole = centerOfMass(polygon([outer, holeCCW]));
  t.deepEqual(
    rounded(withCCWHole.geometry.coordinates),
    expected,
    "counter-clockwise hole centroid"
  );

  const withCWHole = centerOfMass(polygon([outer, holeCW]));
  t.deepEqual(
    rounded(withCWHole.geometry.coordinates),
    expected,
    "hole winding must not change the centroid"
  );
  t.end();
});

test("center of mass -- hole centred in the polygon", (t) => {
  // A centred hole removes mass symmetrically, so the centroid stays at the
  // square's centre no matter which way the hole is wound.
  const outer = [
    [0, 0],
    [10, 0],
    [10, 10],
    [0, 10],
    [0, 0],
  ];
  const hole = [
    [4, 4],
    [6, 4],
    [6, 6],
    [4, 6],
    [4, 4],
  ];
  t.deepEqual(
    centerOfMass(polygon([outer, hole])),
    point([5, 5]),
    "centred hole keeps the centroid at the centre"
  );
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
