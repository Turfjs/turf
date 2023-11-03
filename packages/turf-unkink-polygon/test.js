import fs from "fs";
import path from "path";
import test from "tape";
import load from "load-json-file";
import write from "write-json-file";
import { featureEach } from "@turf/meta";
import { featureCollection } from "@turf/helpers";
import kinks from "@turf/kinks";
import unkinkPolygon from "./index";

const directories = {
  in: path.join(__dirname, "test", "in") + path.sep,
  out: path.join(__dirname, "test", "out") + path.sep,
};

const fixtures = fs.readdirSync(directories.in).map((filename) => {
  return { filename, geojson: load.sync(directories.in + filename) };
});

test("unkink-polygon", (t) => {
  for (const { filename, geojson } of fixtures) {
    const unkinked = unkinkPolygon(geojson);

    // Detect if kinks exists
    featureEach(unkinked, (feature) => {
      // Throw Error when Issue #1094 is fixed
      if (kinks(feature).features.length) t.skip(filename + " has kinks");
    });

    colorize(unkinked);
    if (process.env.REGEN) write.sync(directories.out + filename, unkinked);

    const expected = load.sync(directories.out + filename);
    t.deepEquals(unkinked, expected, path.parse(filename).name);
  }
  t.end();
});

test("issue #2504", (t) => {
  // fill coords with a circle with an arbitrary number of points
  const coords = [];
  const points = 1000000;
  for (let i = 0; i < points; i++) {
    const theta = (i / points) * (2 * Math.PI);
    coords.push([Math.sin(theta), Math.cos(theta)]);
  }
  coords.push(coords[0]);

  try {
    unkinkPolygon({ type: "Polygon", coordinates: [coords] });
    t.pass(
      "large number of coordinates in a single ring should not cause an error"
    );
  } catch (e) {
    t.fail(e);
  }

  t.end();
});

test("unkink-polygon -- throws", (t) => {
  var array = [1, 2, 3, 4, 5];
  for (const value in array) {
    t.true(value !== "isUnique", "isUnique");
    t.true(value !== "getUnique", "getUnique");
  }
  t.throws(() => Array.isUnique(), "isUnique()");
  t.throws(() => Array.getUnique(), "getUnique()");
  t.end();
});

function colorize(
  features,
  colors = ["#F00", "#00F", "#0F0", "#F0F", "#FFF"],
  width = 6
) {
  const results = [];
  featureEach(features, (feature, index) => {
    const color = colors[index % colors.length];
    feature.properties = Object.assign(
      {
        stroke: color,
        fill: color,
        "stroke-width": width,
        "fill-opacity": 0.5,
      },
      feature.properties
    );
    results.push(feature);
  });
  return featureCollection(results);
}
