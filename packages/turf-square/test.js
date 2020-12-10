import test from "tape";
import square from "./index";

test("square", function (t) {
  var bbox1 = [0, 0, 5, 10];
  var bbox2 = [0, 0, 10, 5];

  var sq1 = square(bbox1);
  var sq2 = square(bbox2);

  t.deepEqual(sq1, [-2.5, 0, 7.5, 10]);
  t.deepEqual(sq2, [0, -2.5, 10, 7.5]);
  t.end();
});
