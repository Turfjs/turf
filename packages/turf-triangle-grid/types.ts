import { BBox } from "geojson";
import triangleGrid from "./dist/js/index";

// prettier-ignore
const bbox: BBox = [
  -96.6357421875,
  31.12819929911196,
  -84.9462890625,
  40.58058466412764,
];
const grid = triangleGrid(bbox, 50, {
  units: "miles",
  properties: { foo: "bar" },
});
grid.features[0].properties.foo;
// grid.features[0].properties.bar // [ts] Property 'bar' does not exist on type '{ 'foo': string; }'.
