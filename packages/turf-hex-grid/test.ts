import fs from "fs";
import test from "tape";
import path from "path";
import { loadJsonFileSync } from "load-json-file";
import { writeJsonFileSync } from "write-json-file";
import { truncate } from "@turf/truncate";
import { bboxPolygon as bboxPoly } from "@turf/bbox-polygon";
import { hexGrid } from "./index";

const directories = {
  in: path.join(__dirname, "test", "in") + path.sep,
  out: path.join(__dirname, "test", "out") + path.sep,
};

const fixtures = fs.readdirSync(directories.in).map((filename) => {
  return {
    filename,
    name: path.parse(filename).name,
    json: loadJsonFileSync(directories.in + filename),
  };
});

test("hex-grid", (t) => {
  fixtures.forEach(({ name, json }) => {
    const { bbox, cellSide } = json;
    const options = json;

    const result = truncate(hexGrid(bbox, cellSide, options));
    const poly = bboxPoly(bbox);
    t.assert(poly.bbox);
    poly.properties = {
      stroke: "#F00",
      "stroke-width": 6,
      "fill-opacity": 0,
    };
    result.features.push(poly);
    if (options.mask) {
      options.mask.properties = {
        stroke: "#00F",
        "stroke-width": 6,
        "fill-opacity": 0,
      };
      result.features.push(options.mask);
    }

    if (process.env.REGEN)
      writeJsonFileSync(directories.out + name + ".geojson", result);
    t.deepEqual(
      result,
      loadJsonFileSync(directories.out + name + ".geojson"),
      name
    );
  });
  t.end();
});

test("grid tiles count", (t) => {
  const bbox1 = require(directories.in + "bbox1.json").bbox;
  t.equal(hexGrid(bbox1, 50, { units: "miles" }).features.length, 52);
  t.equal(
    hexGrid(bbox1, 50, { units: "miles", triangles: true }).features.length,
    312
  );

  t.end();
});

test("Property mutation", (t) => {
  const bbox1 = require(directories.in + "bbox1.json").bbox;
  const grid = hexGrid(bbox1, 50, {
    units: "miles",
    properties: { foo: "bar" },
  });
  t.equal(grid.features[0].properties.foo, "bar");
  t.equal(grid.features[1].properties.foo, "bar");

  grid.features[0].properties.foo = "baz";
  t.equal(grid.features[0].properties.foo, "baz");
  t.equal(grid.features[1].properties.foo, "bar");
  t.end();
});

test("longitude (13141439571036224) - issue #758", (t) => {
  const bbox = [-179, -90, 179, 90];
  const grid = hexGrid(bbox, 250, { units: "kilometers" });

  const coords = [];
  grid.features.forEach((feature) =>
    feature.geometry.coordinates[0].forEach((coord) => coords.push(coord))
  );

  for (const coord of coords) {
    const lng = coord[0];
    const lat = coord[1];
    if (lng > 1000 || lng < -1000) {
      t.fail(`longitude is +- 1000 [${lng},${lat}]`);
      break;
    }
  }
  t.end();
});
