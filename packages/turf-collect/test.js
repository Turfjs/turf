const test = require("tape");
const { featureCollection, point, polygon } = require("@turf/helpers");
const collect = require("./index").default;

test("turf collect module", (t) => {
  const poly1 = polygon([
    [
      [0, 0],
      [10, 0],
      [10, 10],
      [0, 10],
      [0, 0],
    ],
  ]);
  const poly2 = polygon([
    [
      [10, 0],
      [20, 10],
      [20, 20],
      [20, 0],
      [10, 0],
    ],
  ]);
  const poly3 = polygon([
    [
      [100, 0],
      [110, -10],
      [110, -20],
      [100, 0],
    ],
  ]);
  const polyFC = featureCollection([poly1, poly2, poly3]);
  const pt1 = point([5, 5], { population: 200 });
  const pt2 = point([1, 3], { population: 600 });
  const pt3 = point([14, 2], { population: 100 });
  const pt4 = point([13, 1], { population: 200 });
  const pt5 = point([19, 7], { population: 300 });
  const ptFC = featureCollection([pt1, pt2, pt3, pt4, pt5]);
  const aggregated = collect(polyFC, ptFC, "population", "values");
  // Check the same number of input and output polys are the same
  t.equal(polyFC.features.length, aggregated.features.length);
  // Check the right values have been assigned
  t.deepEqual(aggregated.features[0].properties.values, [200, 600]);
  t.deepEqual(aggregated.features[1].properties.values, [100, 200, 300]);

  // Check the property has been created even if no values have been assigned
  t.deepEqual(aggregated.features[2].properties.values, []);
  t.end();
});
