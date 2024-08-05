import { BBox } from "geojson";
import test from "tape";
import { square } from "./index.js";

test("square", function (t) {
  const bbox1: BBox = [0, 0, 5, 10];
  const bbox2: BBox = [0, 0, 10, 5];

  const sq1 = square(bbox1);
  const sq2 = square(bbox2);

  t.deepEqual(sq1, [-2.5, 0, 7.5, 10]);
  t.deepEqual(sq2, [0, -2.5, 10, 7.5]);
  t.end();
});
