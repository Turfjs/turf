import { point } from "@turf/helpers";
import linearc from "./index";

const center = point([-75.343, 39.984]);
const bearing1 = 10;
const bearing2 = -30;
const radius = 5;
const steps = 10;
const units = "miles";

linearc(center, radius, bearing1, bearing2);
linearc(center, radius, bearing1, bearing2, { steps });
linearc(center, radius, bearing1, bearing2, { steps, units });
