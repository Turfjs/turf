import test from "tape";
import { point } from "@turf/helpers";
import { featureCollection } from "@turf/helpers";
import sample from "./index";

test("remove", function (t) {
  var points = featureCollection([
    point([1, 2], { team: "Red Sox" }),
    point([2, 1], { team: "Yankees" }),
    point([3, 1], { team: "Nationals" }),
    point([2, 2], { team: "Yankees" }),
    point([2, 3], { team: "Red Sox" }),
    point([4, 2], { team: "Yankees" }),
  ]);

  const results = sample(points, 4);

  t.equal(results.features.length, 4, "should sample 4 features");
  t.end();
});
