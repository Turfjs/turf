import path from "path";
import { fileURLToPath } from "url";
import test from "tape";
import { writeJsonFileSync } from "write-json-file";
import { destination } from "@turf/destination";
import { point, lineString, featureCollection } from "@turf/helpers";
import { bearing } from "./index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const out = path.join(__dirname, "test", "out") + path.sep;

test("bearing", (t) => {
  const start = point([-75, 45], { "marker-color": "#F00" });
  const end = point([20, 60], { "marker-color": "#00F" });

  const initialBearing = bearing(start, end);
  t.equal(initialBearing.toFixed(2), "37.75", "initial bearing");

  const finalBearing = bearing(start, end, { final: true });
  t.equal(finalBearing.toFixed(2), "120.01", "final bearing");
  t.end();

  if (process.env.REGEN) {
    const initialDestination = destination(start, 1000, initialBearing);
    const initialLine = lineString(
      [start.geometry.coordinates, initialDestination.geometry.coordinates],
      {
        stroke: "#F00",
        "stroke-width": 6,
      }
    );

    const finalDestination = destination(end, 1000, finalBearing - 180);
    const finalLine = lineString(
      [end.geometry.coordinates, finalDestination.geometry.coordinates],
      {
        stroke: "#00F",
        "stroke-width": 6,
      }
    );

    const results = featureCollection([start, end, initialLine, finalLine]);
    writeJsonFileSync(out + "results.geojson", results);
  }
});
test("bearing - final bearing is in [-180, 180] range", (t) => {
  // Traveling due west along the equator: start=(10,0), end=(0,0)
  // The final bearing at the destination should be -90 (west), not 270.
  const west_start = point([10, 0]);
  const west_end = point([0, 0]);
  const finalWest = bearing(west_start, west_end, { final: true });
  t.ok(
    finalWest >= -180 && finalWest <= 180,
    "final bearing is within [-180, 180]: got " + finalWest
  );
  t.equal(finalWest.toFixed(2), "-90.00", "final bearing westward is -90");
  t.end();
});
