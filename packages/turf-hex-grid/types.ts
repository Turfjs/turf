import { BBox } from "geojson";
import hexGrid from "./index";

// prettier-ignore
const bbox: BBox = [
  -96.6357421875,
  31.12819929911196,
  -84.9462890625,
  40.58058466412764,
];

hexGrid(bbox, 50);
hexGrid(bbox, 50, { units: "miles" });
hexGrid(bbox, 50, { units: "miles", triangles: true });

// Access Custom Properties
const foo = hexGrid(bbox, 50, {
  units: "miles",
  triangles: true,
  properties: { foo: "bar" },
});
foo.features[0].properties.foo;
// foo.features[0].properties.bar // => [ts] Property 'bar' does not exist on type '{ foo: string; }'.
