const fs = require("fs");
const test = require("tape");
const path = require("path");
const load = require("load-json-file");
const write = require("write-json-file");
const area = require("./index").default;

const directories = {
  in: path.join(__dirname, "test", "in") + path.sep,
  out: path.join(__dirname, "test", "out") + path.sep,
};

const fixtures = fs.readdirSync(directories.in).map((filename) => {
  return {
    filename,
    name: path.parse(filename).name,
    geojson: load.sync(directories.in + filename),
  };
});

test("turf-area", (t) => {
  for (const fixture of fixtures) {
    const name = fixture.name;
    const geojson = fixture.geojson;
    const results = Math.round(area(geojson));
    if (process.env.REGEN)
      write.sync(directories.out + name + ".json", results);
    t.equal(results, load.sync(directories.out + name + ".json"), name);
  }
  t.end();
});
