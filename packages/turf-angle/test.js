const test = require("tape");
const path = require("path");
const glob = require("glob");
const load = require("load-json-file");
const write = require("write-json-file");
const sector = require("@turf/sector");
const bearing = require("@turf/bearing").default;
const truncate = require("@turf/truncate").default;
const distance = require("@turf/distance").default;
const {
  point,
  round,
  lineString,
  featureCollection,
} = require("@turf/helpers");
const angle = require("./index").default;

test("turf-angle", (t) => {
  glob
    .sync(path.join(__dirname, "test", "in", "*.json"))
    .forEach((filepath) => {
      // Input
      const { name } = path.parse(filepath);
      const geojson = load.sync(filepath);
      const [start, mid, end] = geojson.features;

      // Results
      const angleProperties = {
        interiorAngle: round(angle(start, mid, end), 6),
        interiorMercatorAngle: round(
          angle(start, mid, end, { mercator: true }),
          6
        ),
        explementary: false,
        fill: "#F00",
        stroke: "#F00",
        "fill-opacity": 0.3,
      };
      const angleExplementaryProperties = {
        explementaryAngle: round(
          angle(start, mid, end, { explementary: true }),
          6
        ),
        explementaryMercatorAngle: round(
          angle(start, mid, end, { explementary: true, mercator: true }),
          6
        ),
        explementary: true,
        fill: "#00F",
        stroke: "#00F",
        "fill-opacity": 0.3,
      };
      const results = featureCollection([
        truncate(
          sector(
            mid,
            distance(mid, start) / 3,
            bearing(mid, start),
            bearing(mid, end),
            { properties: angleProperties }
          )
        ),
        truncate(
          sector(
            mid,
            distance(mid, start) / 2,
            bearing(mid, end),
            bearing(mid, start),
            { properties: angleExplementaryProperties }
          )
        ),
        lineString(
          [
            start.geometry.coordinates,
            mid.geometry.coordinates,
            end.geometry.coordinates,
          ],
          { "stroke-width": 4, stroke: "#222" }
        ),
        start,
        mid,
        end,
      ]);

      // Save results
      const expected = filepath.replace(
        path.join("test", "in"),
        path.join("test", "out")
      );
      if (process.env.REGEN) write.sync(expected, results);
      t.deepEqual(results, load.sync(expected), name);
    });
  t.end();
});

test("turf-angle -- simple", (t) => {
  t.equal(round(angle([5, 5], [5, 6], [3, 4])), 45, "45 degrees");
  t.equal(round(angle([3, 4], [5, 6], [5, 5])), 45, "45 degrees -- inverse");
  t.equal(
    round(angle([3, 4], [5, 6], [5, 5], { explementary: true })),
    360 - 45,
    "explementary angle"
  );
  t.end();
});

test("turf-angle -- issues", (t) => {
  const start = [167.72709868848324, -45.56543836343071];
  const mid = [167.7269698586315, -45.56691059720167];
  const end = [167.72687866352499, -45.566989345276355];
  const a = angle(start, mid, end);

  t.false(isNaN(a), "result is not NaN");
  t.end();
});

test("turf-angle -- throws", (t) => {
  const pt1 = point([-10, -30]);
  const pt2 = point([-11, -33]);
  const pt3 = point([-12, -36]);
  t.throws(
    () => angle(null, pt2, pt3),
    /startPoint is required/,
    "startPoint is required"
  );
  t.throws(
    () => angle(pt1, undefined, pt3),
    /midPoint is required/,
    "midPoint is required"
  );
  t.throws(
    () => angle(pt1, pt2),
    /endPoint is required/,
    "endPoint is required"
  );
  t.throws(
    () => angle(pt1, pt2, pt3, "string"),
    /options is invalid/,
    "invalid options"
  );

  t.end();
});
