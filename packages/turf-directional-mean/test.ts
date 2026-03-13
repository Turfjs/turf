import test from "tape";
import path from "path";
import { fileURLToPath } from "url";
import { loadJsonFileSync } from "load-json-file";
import { writeJsonFileSync } from "write-json-file";
import { directionalMean } from "./index.js";
import { truncate } from "@turf/truncate";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
  const utmGeojson = loadJsonFileSync(utmFilepath);

  const gpsFilepath = path.join(__dirname, "test", "in", "bus_route_gps.json");
  const gpsGeojson = loadJsonFileSync(gpsFilepath);

  // utm
  let utmResult1 = directionalMean(utmGeojson, {
    planar: true,
    segment: false,
  });
  truncate(utmResult1, { mutate: true, precision: 8 });
  t.deepEqual(utmResult1, loadJsonFileSync(outUtmJsonPath1), "utm");
  // utm segment
  let utmResult2 = directionalMean(utmGeojson, {
    planar: true,
    segment: true,
  });
  truncate(utmResult2, { mutate: true, precision: 8 });
  t.deepEqual(utmResult2, loadJsonFileSync(outUtmJsonPath2), "utm segment");

  // gps
  let gpsResult1 = directionalMean(gpsGeojson, {
    planar: false,
  });
  truncate(gpsResult1, { mutate: true, precision: 8 });
  t.deepEqual(gpsResult1, loadJsonFileSync(outGpsJsonPath1), "gps");
  // gps segment
  let gpsResult2 = directionalMean(gpsGeojson, {
    planar: false,
    segment: true,
  });
  truncate(gpsResult2, { mutate: true, precision: 8 });
  t.deepEqual(gpsResult2, loadJsonFileSync(outGpsJsonPath2), "gps segment");

  if (process.env.REGEN) {
    writeJsonFileSync(outGpsJsonPath1, gpsResult1);
    writeJsonFileSync(outGpsJsonPath2, gpsResult2);
    writeJsonFileSync(outUtmJsonPath1, utmResult1);
    writeJsonFileSync(outUtmJsonPath2, utmResult2);
  }

  t.end();
});
