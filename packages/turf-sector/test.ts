import test from "tape";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { loadJsonFileSync } from "load-json-file";
import { writeJsonFileSync } from "write-json-file";
import { truncate } from "@turf/truncate";
import { featureCollection } from "@turf/helpers";
import { lineArc } from "@turf/line-arc";
import { sector } from "./index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

test("turf-sector", (t) => {
  for (const { filename, name, geojson } of fixtures) {
    const { radius, bearing1, bearing2 } = geojson.properties;
    const sectored = colorize(
      truncate(sector(geojson, radius, bearing1, bearing2))
    );
    const results = featureCollection([geojson, sectored]);

    if (process.env.REGEN)
      writeJsonFileSync(directories.out + filename, results);
    t.deepEquals(results, loadJsonFileSync(directories.out + filename), name);
  }
  t.end();
});

test("turf-sector -- method parameter", (t) => {
  const center = [-75, 40];
  const radius = 5;
  const bearing1 = 25;
  const bearing2 = 45;
  const steps = 8;

  t.notDeepEqual(
    sector(center, radius, bearing1, bearing2, { steps, method: "inscribed" })
      .geometry.coordinates,
    sector(center, radius, bearing1, bearing2, {
      steps,
      method: "circumscribed",
    }).geometry.coordinates,
    "inscribed and circumscribed sectors differ"
  );

  t.deepEquals(
    sector(center, radius, bearing1, bearing2, { steps }),
    sector(center, radius, bearing1, bearing2, { steps, method: "equalarea" }),
    "equalarea is the default method"
  );

  t.throws(
    () =>
      sector(center, radius, bearing1, bearing2, {
        steps,
        method: "bogus" as any,
      }),
    /method must be one of/,
    "throws for an unknown method"
  );

  t.end();
});

test("turf-sector -- method with arcTolerance", (t) => {
  const center = [-75, 40];
  const radius = 5;
  const arcTolerance = 0.01;
  const bearing1 = 25;
  const bearing2 = 45;

  (["inscribed", "circumscribed", "equalarea"] as const).forEach((method) => {
    const expectedArc = lineArc(center, radius, bearing1, bearing2, {
      arcTolerance,
      method,
    }).geometry.coordinates;
    const ring = sector(center, radius, bearing1, bearing2, {
      arcTolerance,
      method,
    }).geometry.coordinates[0];
    t.deepEquals(
      ring.slice(1, -1),
      expectedArc,
      `${method}: sector arc matches lineArc with the same arcTolerance and method`
    );
  });

  t.end();
});

function colorize(feature, color = "#FF0", width = 10) {
  feature.properties = {
    stroke: "#000000",
    "stroke-width": width,
    "stroke-opacity": 1,
    fill: color,
    "fill-opacity": 0.8,
  };
  return feature;
}
