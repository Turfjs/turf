import { point } from "@turf/helpers";
import { lineArc } from "./index";

const center = point([-75.343, 39.984]);
const bearing1 = 10;
const bearing2 = -30;
const radius = 5;
const steps = 10;
const units = "miles";

lineArc(center, radius, bearing1, bearing2);
lineArc(center, radius, bearing1, bearing2, { steps });
lineArc(center, radius, bearing1, bearing2, { steps, units });
