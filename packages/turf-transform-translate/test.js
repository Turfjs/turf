import fs from "fs";
import test from "tape";
import path from "path";
import load from "load-json-file";
import write from "write-json-file";
import truncate from "@turf/truncate";
import {
  point,
  lineString,
  geometryCollection,
  featureCollection,
} from "@turf/helpers";
import translate from "./index";

const directories = {
  in: path.join(__dirname, "test", "in") + path.sep,
  out: path.join(__dirname, "test", "out") + path.sep,
};

const fixtures = fs.readdirSync(directories.in).map((filename) => {
  return {
    filename,
    name: path.parse(filename).name,
    geojson: load.sync(directories.in + filename),
  };
});

test("translate", (t) => {
  for (const { filename, name, geojson } of fixtures) {
    let { distance, direction, units, zTranslation } = geojson.properties || {};

    const translated = translate(geojson, distance, direction, {
      units,
      zTranslation,
    });
    const result = featureCollection([
      colorize(truncate(translated, { precision: 6, coordiantes: 3 })),
      geojson,
    ]);

    if (process.env.REGEN) write.sync(directories.out + filename, result);
    t.deepEqual(result, load.sync(directories.out + filename), name);
  }

  t.end();
});

test("translate -- throws", (t) => {
  const pt = point([-70.823364, -33.553984]);

  t.throws(() => translate(null, 100, -29), "missing geojson");
  t.throws(() => translate(pt, null, 98), "missing distance");
  t.throws(() => translate(pt, 23, null), "missing direction");
  t.throws(() => translate(pt, 56, 57, { units: "foo" }), "invalid units");
  t.throws(
    () => translate(pt, 56, 57, { zTranslation: "foo" }),
    "invalid zTranslation"
  );

  t.end();
});

test("negative distance handling", (t) => {
  const result = translate(point([0, 0]), 10, 0);
  const result2 = translate(point([0, 0]), -10, 0);
  t.deepEqual(result, {
    type: "Feature",
    properties: {},
    geometry: { type: "Point", coordinates: [0, 0.08993203637245381] },
  });
  t.deepEqual(result2, {
    type: "Feature",
    properties: {},
    geometry: { type: "Point", coordinates: [0, -0.08993203637245381] },
  });
  t.end();
});

test("rotate -- mutated input", (t) => {
  const line = lineString([
    [10, 10],
    [12, 15],
  ]);
  const lineBefore = JSON.parse(JSON.stringify(line));

  translate(line, 100, 50);
  t.deepEqual(line, lineBefore, "input should NOT be mutated");

  translate(line, 100, 50, { units: "kilometers", mutate: true });
  t.deepEqual(
    truncate(line, { precision: 1 }),
    lineString([
      [10.7, 10.6],
      [12.7, 15.6],
    ]),
    "input should be mutated"
  );
  t.end();
});

test("rotate -- geometry support", (t) => {
  const line = lineString([
    [10, 10],
    [12, 15],
  ]);
  t.assert(
    translate(geometryCollection([line.geometry]), 100, 50),
    "geometryCollection support"
  );
  t.assert(
    translate(geometryCollection([line.geometry]).geometry, 100, 50),
    "geometryCollection support"
  );
  t.assert(
    translate(featureCollection([line]), 100, 50),
    "featureCollection support"
  );
  t.assert(translate(line.geometry, 100, 50), "geometry line support");
  t.assert(translate(line.geometry, 100, 50), "geometry pt support");
  t.assert(translate(line, 0, 100), "shortcut no-motion");
  t.end();
});

// style result
function colorize(geojson) {
  if (
    geojson.geometry.type === "Point" ||
    geojson.geometry.type === "MultiPoint"
  ) {
    geojson.properties["marker-color"] = "#F00";
    geojson.properties["marker-symbol"] = "star";
  } else {
    geojson.properties["stroke"] = "#F00";
    geojson.properties["stroke-width"] = 4;
  }
  return geojson;
}
