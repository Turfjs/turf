import fs from "fs";
import test from "tape";
import path from "path";
import { loadJsonFileSync } from "load-json-file";
import { writeJsonFileSync } from "write-json-file";
import { point, feature, featureCollection } from "@turf/helpers";
import { bbox as turfBBox } from "@turf/bbox";
import { bboxClip } from "./index";

const directories = {
  in: path.join(__dirname, "test", "in") + path.sep,
  out: path.join(__dirname, "test", "out") + path.sep,
};

const fixtures = fs.readdirSync(directories.in).map((filename) => {
  return {
    filename,
    name: path.parse(filename).name,
    geojson: loadJsonFileSync(directories.in + filename),
  };
});

test("turf-bbox-clip", (t) => {
  for (const fixture of fixtures) {
    const filename = fixture.filename;
    const name = fixture.name;
    const geojson = fixture.geojson;
    const feature = geojson.features[0];
    const bbox = turfBBox(geojson.features[1]);
    const clipped = bboxClip(feature, bbox);
    const results = featureCollection([
      colorize(feature, "#080"),
      colorize(clipped, "#F00"),
      colorize(geojson.features[1], "#00F", 3),
    ]);

    if (process.env.REGEN)
      writeJsonFileSync(directories.out + filename, results);
    t.deepEquals(results, loadJsonFileSync(directories.out + filename), name);
  }
  t.end();
});

test("turf-bbox-clip -- throws", (t) => {
  t.throws(
    () => bboxClip(point([5, 10]), [-180, -90, 180, 90]),
    /geometry Point not supported/
  );
  t.end();
});

function colorize(feature, color, width) {
  color = color || "#F00";
  width = width || 6;
  feature.properties = {
    stroke: color,
    fill: color,
    "stroke-width": width,
    "fill-opacity": 0.1,
  };
  return feature;
}

test("turf-bbox-clip -- null geometries", (t) => {
  t.throws(
    () => bboxClip(feature(null), [-180, -90, 180, 90]),
    "coords must be GeoJSON Feature, Geometry Object or an Array"
  );
  t.end();
});
