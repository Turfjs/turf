const test = require("tape");
const path = require("path");
const load = require("load-json-file");
const write = require("write-json-file");
const directionalMean = require("./index").default;

test("turf-directional-mean", (t) => {
  const outGpsJsonPath1 = path.join(
    __dirname,
    "test",
    "out",
    "bus_route_gps1.json"
  );
  const outGpsJsonPath2 = path.join(
    __dirname,
    "test",
    "out",
    "bus_route_gps2.json"
  );
  const outUtmJsonPath1 = path.join(
    __dirname,
    "test",
    "out",
    "bus_route_utm1.json"
  );
  const outUtmJsonPath2 = path.join(
    __dirname,
    "test",
    "out",
    "bus_route_utm2.json"
  );

  const utmFilepath = path.join(__dirname, "test", "in", "bus_route_utm.json");
  const utmGeojson = load.sync(utmFilepath);

  const gpsFilepath = path.join(__dirname, "test", "in", "bus_route_gps.json");
  const gpsGeojson = load.sync(gpsFilepath);

  // utm
  let utmResult1 = directionalMean(utmGeojson, {
    planar: true,
    segment: false,
  });
  t.deepEqual(utmResult1, load.sync(outUtmJsonPath1), "utm");
  // utm segment
  let utmResult2 = directionalMean(utmGeojson, {
    planar: true,
    segment: true,
  });
  t.deepEqual(utmResult2, load.sync(outUtmJsonPath2), "utm segment");

  // gps
  let gpsResult1 = directionalMean(gpsGeojson, {
    planar: false,
  });
  t.deepEqual(gpsResult1, load.sync(outGpsJsonPath1), "gps");
  // gps segment
  let gpsResult2 = directionalMean(gpsGeojson, {
    planar: false,
    segment: true,
  });
  t.deepEqual(gpsResult2, load.sync(outGpsJsonPath2), "gps segment");

  if (process.env.REGEN) {
    write.sync(outGpsJsonPath1, gpsResult1);
    write.sync(outGpsJsonPath2, gpsResult2);
    write.sync(outUtmJsonPath1, utmResult1);
    write.sync(outUtmJsonPath2, utmResult2);
  }

  t.end();
});
