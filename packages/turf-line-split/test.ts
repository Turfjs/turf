import fs from "fs";
import test from "tape";
import path from "path";
import { fileURLToPath } from "url";
import { loadJsonFileSync } from "load-json-file";
import { writeJsonFileSync } from "write-json-file";
import { featureEach } from "@turf/meta";
import {
  point,
  lineString,
  multiPoint,
  polygon,
  featureCollection,
  round,
} from "@turf/helpers";
import { getCoords } from "@turf/invariant";
import { lineSplit } from "./index.js";
import type {
  Feature,
  FeatureCollection,
  LineString,
  MultiLineString,
  MultiPoint,
  MultiPolygon,
  Point,
  Polygon,
} from "geojson";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const directories = {
  in: path.join(__dirname, "test", "in") + path.sep,
  out: path.join(__dirname, "test", "out") + path.sep,
};

let fixtures = fs.readdirSync(directories.in).map((filename) => {
  return {
    filename,
    name: path.parse(filename).name,
    geojson: loadJsonFileSync(directories.in + filename) as FeatureCollection,
  };
});
// fixtures = fixtures.filter(({ name }) => name === "issue-#1075");

test("turf-line-split", (t) => {
  for (const { filename, name, geojson } of fixtures) {
    const line = geojson.features[0] as Feature<LineString>;
    const splitter = geojson.features[1] as Feature<
      Point | MultiPoint | LineString | MultiLineString | Polygon | MultiPolygon
    >;
    const results = colorize(lineSplit(line, splitter));
    featureEach(geojson, (feature) => results.features.push(feature));

    if (process.env.REGEN)
      writeJsonFileSync(directories.out + filename, results);
    t.deepEquals(results, loadJsonFileSync(directories.out + filename), name);
  }
  t.end();
});

test("turf-line-split -- lines should split the same feature 1 with 2 as 2 with 1", (t) => {
  const featureOne = lineString([
    [114.58215786065353825, -14.82470576519326144],
    [137.21678649707752129, -16.71692980416107588],
  ]);
  const featureTwo = lineString([
    [119.1412061636556956, -19.83670052919270788],
    [133.06640625, -12.64033830684678961],
  ]);

  const resultsOne = lineSplit(featureOne, featureTwo);
  const resultsTwo = lineSplit(featureTwo, featureOne);

  const midCoordOne = getCoords(resultsOne.features[0])[1];
  const midCoordTwo = getCoords(resultsTwo.features[1])[0];

  // Round precision to 6 decimals
  midCoordOne[0] = round(midCoordOne[0], 6);
  midCoordOne[1] = round(midCoordOne[1], 6);
  midCoordTwo[0] = round(midCoordTwo[0], 6);
  midCoordTwo[1] = round(midCoordTwo[1], 6);
  t.deepEquals(
    midCoordOne,
    midCoordTwo,
    "Splits were made in different locations"
  );
  t.end();
});

test("turf-line-split -- throws", (t) => {
  const pt = point([9, 50]);
  const line = lineString([
    [7, 50],
    [8, 50],
    [9, 50],
  ]);

  // @ts-expect-error passing null for line
  t.throws(() => lineSplit(null, pt), "<geojson> is required");
  // @ts-expect-error passing null for splitter
  t.throws(() => lineSplit(line, null), "<geojson> is required");
  // @ts-expect-error passing wrong type for line
  t.throws(() => lineSplit(pt, pt), "<line> must be LineString");
  t.throws(
    // @ts-expect-error passing wrong type for splitter
    () => lineSplit(line, featureCollection([pt, line])),
    "<splitter> cannot be a FeatureCollection"
  );
  t.end();
});

test("turf-line-split -- splitter exactly on end of line", (t) => {
  const pt = point([9, 50]);
  const line = lineString([
    [7, 50],
    [8, 50],
    [9, 50],
  ]);
  const features = lineSplit(line, pt).features;

  t.deepEqual(features, [line], "should only contain 1 line of 3 vertices");
  t.end();
});

test("turf-line-split -- lines should only contain 2 vertices #688", (t) => {
  const middlePoint = point([8, 50]);
  const line = lineString([
    [7, 50],
    [8, 50],
    [9, 50],
  ]);
  const [line1, line2] = lineSplit(line, middlePoint).features;

  t.deepEqual(
    line1,
    lineString([
      [7, 50],
      [8, 50],
    ]),
    "line1 should have 2 vertices"
  );
  t.deepEqual(
    line2,
    lineString([
      [8, 50],
      [9, 50],
    ]),
    "line2 should have 2 vertices"
  );
  t.end();
});

test("turf-line-split -- precision issue #852", (t) => {
  const line = lineString([
    [9.2202022, 49.1438226],
    [9.2199531, 49.1439048],
    [9.2196177, 49.1440264],
  ]);
  const startPoint = point([9.2202022, 49.1438226]);
  const middlePoint = point([9.2199531, 49.1439048]);
  const endPoint = point([9.2196177, 49.1440264]);
  const [line1, line2] = lineSplit(line, middlePoint).features;

  t.deepEqual(
    line1,
    lineString([
      [9.2202022, 49.1438226],
      [9.2199531, 49.1439048],
    ]),
    "middlePoint: line1 should have 2 vertices"
  );
  t.deepEqual(
    line2,
    lineString([
      [9.2199531, 49.1439048],
      [9.2196177, 49.1440264],
    ]),
    "middlePoint: line2 should have 2 vertices"
  );
  t.deepEqual(
    lineSplit(line, startPoint).features,
    [line],
    "startPoint: should only contain 1 line of 3 vertices"
  );
  t.deepEqual(
    lineSplit(line, endPoint).features,
    [line],
    "endPoint: should only contain 1 line of 3 vertices"
  );
  t.end();
});

test("turf-line-split -- prevent input mutation", (t) => {
  const line = lineString([
    [9.2202022, 49.1438226],
    [9.2199531, 49.1439048],
    [9.2196177, 49.1440264],
  ]);
  const lineBefore = JSON.parse(JSON.stringify(line));
  lineSplit(line, point([9.2196177, 49.1440264]));

  t.deepEqual(line, lineBefore, "line should be the same");
  t.end();
});

test("turf-line-split -- issue #1075", (t) => {
  const line = lineString([
    [-87.168433, 37.946093],
    [-87.16851, 37.960085],
  ]);
  const splitter = multiPoint([
    [-87.168446, 37.947929],
    [-87.168445, 37.948301],
  ]);
  const split = lineSplit(line, splitter);
  t.assert(split);
  t.end();
});

test("lineSplit - incorrect split - issue #1075", (t) => {
  let line, splitter, split;

  // Example sourced from https://github.com/Turfjs/turf/issues/1232#issue-290515769
  line = lineString([
    [13.8716, 56.2783],
    [13.8715, 56.2785],
    [13.8743, 56.2794],
    [13.8796, 56.2746],
  ]);

  splitter = polygon([
    [
      [13.8726, 56.2786],
      [13.8716, 56.2786],
      [13.8713, 56.2784],
      [13.8726, 56.2786],
    ],
  ]);

  split = lineSplit(line, splitter);
  t.equal(split.features.length, 3, "Line split into 3 pieces example 1");

  // Example sourced from https://github.com/Turfjs/turf/issues/1232#issuecomment-361970429
  line = lineString([
    [10.424716, 50.024888],
    [10.417643, 50.029512],
  ]);

  splitter = polygon([
    [
      [10.41993839, 50.0301184],
      [10.42587086, 50.02630702],
      [10.41993839, 50.02249594],
      [10.41400592, 50.02630702],
      [10.41993839, 50.0301184],
    ],
  ]);

  split = lineSplit(line, splitter);
  t.equal(split.features.length, 3, "Line split into 3 pieces example 2");

  // Example sourced from https://github.com/Turfjs/turf/issues/1232#issuecomment-2033181347
  line = lineString([
    [-111.570323, 49.587462],
    [-111.570824, 49.587462],
    [-111.571218, 49.587212],
    [-111.571075, 49.587212],
    [-111.566432, 49.584359],
  ]);

  splitter = lineString([
    [-111.57071881384209, 49.58746705929172],
    [-111.57072743959235, 49.587462],
    [-111.57106608768505, 49.58726337153985],
    [-111.57109709453526, 49.587212],
    [-111.5711022620136, 49.58720343862349],
  ]);

  split = lineSplit(line, splitter);
  t.equal(split.features.length, 3, "Line split into 3 pieces example 3");

  // Example sourced from https://github.com/Turfjs/turf/issues/1232#issuecomment-2231554080
  line = lineString([
    [0, 44],
    [25, 38],
    [27, 40],
    [0, 62],
  ]);

  splitter = polygon([
    [
      [0, 20],
      [42, 20],
      [42, 39],
      [28, 39],
      [0, 52],
      [0, 20],
    ],
  ]);

  split = lineSplit(line, splitter);

  t.equal(split.features.length, 2, "Line split into 2 pieces example 4");
  t.end();
});

test("lineSplit - wavy lines - issue #2288", (t) => {
  // Example sourced from https://github.com/Turfjs/turf/issues/2288#issuecomment-1125555752
  const line = lineString([
    [-122.7779211637529, 38.46929673131614],
    [-122.78647173567292, 38.46208580491829],
  ]);

  const splitter = polygon([
    [
      [-122.784210824, 38.46577859000006, 0],
      [-122.783497375, 38.46577665500005, 0],
      [-122.78349775899989, 38.46574340700003, 0],
      [-122.78337219700002, 38.46574404700004, 0],
      [-122.7833724819999, 38.46570876200008, 0],
      [-122.783186362, 38.46571185100002, 0],
      [-122.78318417300001, 38.46569283300004, 0],
      [-122.782172859, 38.46568571000005, 0],
      [-122.7821622549999, 38.46587288700003, 0],
      [-122.783391339, 38.465877436, 0],
      [-122.78339171499998, 38.46589273900003, 0],
      [-122.78420487999992, 38.46590174800005, 0],
      [-122.784210824, 38.46577859000006, 0],
    ],
  ]);

  const split = lineSplit(line, splitter);

  t.equal(split.features.length, 3, "Line split into 3 pieces");
  t.end();
});

/**
 * Colorize FeatureCollection
 *
 * @param {FeatureCollection|Feature<any>} geojson Feature or FeatureCollection
 * @returns {FeatureCollection<any>} colorized FeatureCollection
 */
function colorize(geojson: FeatureCollection) {
  const results: Feature[] = [];
  featureEach(geojson, (feature, index) => {
    const r = index % 2 === 0 ? "F" : "0";
    const g = "0";
    const b = index % 2 === 0 ? "0" : "F";
    feature.properties = Object.assign(
      {
        stroke: "#" + r + g + b,
        "stroke-width": 10,
      },
      feature.properties
    );
    results.push(feature);
  });
  return featureCollection(results);
}
