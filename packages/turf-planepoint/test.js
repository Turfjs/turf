// http://math.stackexchange.com/questions/28043/finding-the-z-value-on-a-plane-with-x-y-values
// http://stackoverflow.com/a/13916669/461015
import test from "tape";

import { polygon } from "@turf/helpers";
import planepoint from "./index";

test("turf-planepoint", (t) => {
  const point = [1, 1];
  const triangleProps = polygon(
    [
      [
        [0, 0],
        [2, 0],
        [1, 2],
        [0, 0],
      ],
    ],
    { a: 0, b: 0, c: 2 }
  );
  const triangleZ = polygon([
    [
      [0, 0, 0],
      [2, 0, 0],
      [1, 2, 2],
      [0, 0, 0],
    ],
  ]);

  t.equal(planepoint(point, triangleProps), 1, "properties");
  t.equal(planepoint(point, triangleZ), 1, "z coordinates");
  t.end();
});
