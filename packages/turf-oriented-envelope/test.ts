import path from "path";
import { fileURLToPath } from "url";
import test from "tape";
import { loadJsonFileSync } from "load-json-file";
import { orientedEnvelope } from "./index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Fixtures
const fc = loadJsonFileSync(
  path.join(__dirname, "test", "in", "feature-collection.geojson")
);

test("envelope", (t) => {
  const enveloped = orientedEnvelope(fc);
  t.ok(
    enveloped,
    "should return a polygon that represents the bbox around a feature or feature collection"
  );
  t.equal(enveloped.geometry.type, "Polygon");
  t.deepEqual(
    enveloped.geometry.coordinates,
    [
      [
        [130, 4.000000000000015],
        [111.6032944788385, 46.43169359929018],
        [20, 3.737151750719632e-14],
        [36.12291669822969, -40.470374533102486],
        [130, 4.000000000000015],
      ],
    ],
    "positions are correct"
  );
  t.end();
});
