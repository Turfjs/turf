const fs = require("fs");
const path = require("path");
const test = require("tape");
const { loadJsonFileSync } = require("load-json-file");
const { writeJsonFileSync } = require("write-json-file");
const { point } = require("@turf/helpers");
const rhumbBearing = require("./index").default;

const directories = {
  in: path.join(__dirname, "test", "in") + path.sep,
  out: path.join(__dirname, "test", "out") + path.sep,
};

let fixtures = fs.readdirSync(directories.in).map((filename) => {
  return {
    filename,
    name: path.parse(filename).name,
    geojson: loadJsonFileSync(directories.in + filename),
  };
});

test("bearing", (t) => {
  fixtures.forEach((fixture) => {
    const name = fixture.name;
    const geojson = fixture.geojson;

    const start = geojson.features[0];
    const end = geojson.features[1];

    const initialBearing = rhumbBearing(start, end);
    const finalBearing = rhumbBearing(start, end, { final: true });

    const result = {
      initialBearing: initialBearing,
      finalBearing: finalBearing,
    };
    if (process.env.REGEN)
      writeJsonFileSync(directories.out + name + ".json", result);
    t.deepEqual(
      loadJsonFileSync(directories.out + name + ".json"),
      result,
      name
    );
  });

  t.throws(() => {
    rhumbBearing(point([12, -54]), "point");
  }, "invalid point");
  t.end();
});
