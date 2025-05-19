import fs from "fs";
import test from "tape";
import path from "path";
import { fileURLToPath } from "url";
import { loadJsonFileSync } from "load-json-file";
import { writeJsonFileSync } from "write-json-file";
import { polygon, point, featureCollection } from "@turf/helpers";
import { dissolve } from "./index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SKIP = [];

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

test("turf-dissolve", (t) => {
  for (const { filename, name, geojson } of fixtures) {
    if (-1 !== SKIP.indexOf(filename)) {
      continue;
    }
    const propertyName = geojson.propertyName;
    const results = dissolve(geojson, { propertyName });

    if (process.env.REGEN)
      writeJsonFileSync(directories.out + filename, results);
    t.deepEquals(results, loadJsonFileSync(directories.out + filename), name);
  }
  t.end();
});

test("dissolve -- throw", (t) => {
  const poly = polygon([
    [
      [-61, 27],
      [-59, 27],
      [-59, 29],
      [-61, 29],
      [-61, 27],
    ],
  ]);
  const pt = point([-62, 29]);

  t.throws(
    () => dissolve(null),
    /No featureCollection passed/,
    "missing featureCollection"
  );
  t.throws(
    () => dissolve(poly),
    /Invalid input to dissolve, FeatureCollection required/,
    "invalid featureCollection"
  );
  t.throws(
    () => dissolve(featureCollection([poly, pt])),
    /Invalid input to dissolve: must be a Polygon, given Point/,
    "invalid collection type"
  );
  t.end();
});

test("dissolve -- properties", (t) => {
  var features = featureCollection([
    polygon(
      [
        [
          [0, 0],
          [0, 1],
          [1, 1],
          [1, 0],
          [0, 0],
        ],
      ],
      { combine: "yes" }
    ),
    polygon(
      [
        [
          [0, -1],
          [0, 0],
          [1, 0],
          [1, -1],
          [0, -1],
        ],
      ],
      { combine: "yes" }
    ),
    polygon(
      [
        [
          [1, -1],
          [1, 0],
          [2, 0],
          [2, -1],
          [1, -1],
        ],
      ],
      { combine: "no" }
    ),
  ]);

  var results = dissolve(features, { propertyName: "combine" });
  t.equals(results.features[0].properties.combine, "yes");
  t.equals(results.features[1].properties.combine, "no");

  t.end();
});

test("dissolve - unable to complete output ring - issue 2420", (t) => {
  // Test example copied from https://github.com/Turfjs/turf/issues/2420

  const poly1 = polygon([
    [
      [54.674471560746106, -2.669669459403366],
      [54.66827243056676, -2.590808846502601],
      [54.61818656347785, -2.5731465650016876],
      [54.59479733372542, -2.5582148982951005],
      [54.52907798654607, -2.5983186383573154],
      [54.533564730328536, -2.68329182348515],
      [54.58040270977906, -2.713147336590615],
      [54.60545643615633, -2.7220126907386035],
      [54.674471560746106, -2.669669459403366],
    ],
  ]);

  const poly2 = polygon([
    [
      [54.59029423717366, -2.4733591205361],
      [54.59479733372542, -2.5582148982951005],
      [54.61818656347788, -2.573146565001703],
      [54.66827243056676, -2.590808846502601],
      [54.73723247700517, -2.538498282632361],
      [54.730995571183335, -2.4597687064449976],
      [54.655899262660675, -2.433377660227877],
      [54.59029423717366, -2.4733591205361],
    ],
  ]);

  // This used to fail with "Unable to complete output ring ..."
  t.doesNotThrow(
    () => dissolve(featureCollection([poly1, poly2])),
    "does not throw"
  );

  t.end();
});
