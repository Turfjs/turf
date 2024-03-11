import { points } from "@turf/helpers";
import { standardDeviationalEllipse } from "./index.js";

const pts = points([
  [10, 10],
  [0, 5],
]);
const stdEllipse = standardDeviationalEllipse(pts);

// Access custom properties
stdEllipse.properties.standardDeviationalEllipse.meanCenterCoordinates;
