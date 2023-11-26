import fs from "fs";
import test from "tape";
import path from "path";
import { loadJsonFileSync } from "load-json-file";
import { writeJsonFileSync } from "write-json-file";
import { bboxPolygon as bboxPoly } from "@turf/bbox-polygon";
import { truncate } from "@turf/truncate";
import { pointGrid } from "./index";

const directories = {
  in: path.join(__dirname, "test", "in") + path.sep,
  out: path.join(__dirname, "test", "out") + path.sep,
};

let fixtures = fs.readdirSync(directories.in).map((filename) => {
  return {
    filename,
    name: path.parse(filename).name,
    json: loadJsonFileSync(directories.in + filename),
  };
});

test("turf-point-grid", (t) => {
  for (const { name, json } of fixtures) {
    const { bbox, cellSide } = json;
    const options = json;
    const result = truncate(pointGrid(bbox, cellSide, options));

    // Add styled GeoJSON to the result
    const poly = bboxPoly(bbox);
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
  }
  t.end();
});

test("point-grid -- #1177", (t) => {
  const bbox = [0, 0, 1, 1];
  const mask = bboxPoly([0.2, 0.2, 0.8, 0.8]);
  let options = { mask: mask };
  t.doesNotThrow(() => pointGrid(bbox, 1, options));
  t.equal(options.units, "kilometers");

  let options2 = { mask: mask, units: "miles" };
  t.doesNotThrow(() => pointGrid(bbox, 1, options2));
  t.equal(options2.units, "miles");

  t.end();
});
