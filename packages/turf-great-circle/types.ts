import { point } from "@turf/helpers";
import greatCircle from "./";

const pt1 = point([0, 0]);
const pt2 = point([60, 0]);
greatCircle(pt1, pt2);
greatCircle(pt1.geometry, pt2.geometry);
greatCircle(pt1.geometry.coordinates, pt2.geometry.coordinates);
greatCircle(pt1, pt2, { properties: { name: "Seattle to DC" } });
greatCircle(pt1, pt2, { npoints: 10 });
greatCircle(pt1, pt2, { offset: 100, npoints: 10 });
