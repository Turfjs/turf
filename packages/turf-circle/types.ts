import { point } from "@turf/helpers";
import circle from "./index";

const center = point([-75.343, 39.984]);
const units = "kilometers";
const radius = 5;
const steps = 10;

circle(center, radius);
circle(center, radius, { steps });
circle(center, radius, { steps, units });
circle([-75, 39], radius, { steps, units, properties: { foo: "bar" } });
