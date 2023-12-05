import fs from "fs";
import test from "tape";
import path from "path";
import { loadJsonFileSync } from "load-json-file";
import { writeJsonFileSync } from "write-json-file";
import { point, featureCollection } from "@turf/helpers";
import { featureEach } from "@turf/meta";
import { concave } from "./index";

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

test("turf-concave", (t) => {
  fixtures.forEach((fixture) => {
    const filename = fixture.filename;
    const name = fixture.name;
    const geojson = fixture.geojson;
    const properties = geojson.properties || {};
    const maxEdge = properties.maxEdge || 1;
    const units = properties.units;

    const hull = concave(geojson, { units, maxEdge });
    featureEach(geojson, stylePt);
    const results = featureCollection(geojson.features.concat(hull));

    if (process.env.REGEN)
      writeJsonFileSync(directories.out + filename, results);
    t.deepEquals(results, loadJsonFileSync(directories.out + filename), name);
  });
  t.end();
});

const onePoint = featureCollection([point([0, 0])]);

test("concave -- throw", (t) => {
  t.equal(
    concave(onePoint, { maxEdge: 5.5, units: "miles" }),
    null,
    "too few polygons found to compute concave hull"
  );
  t.equal(
    concave(onePoint),
    null,
    "too few polygons found to compute concave hull -- maxEdge too small"
  );

  t.end();
});

function stylePt(pt) {
  pt.properties["marker-color"] = "#f0f";
  pt.properties["marker-size"] = "small";
}
