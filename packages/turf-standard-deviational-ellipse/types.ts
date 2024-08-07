import { points } from "@turf/helpers";
import { standardDeviationalEllipse } from "./index.js";

const pts = points([
  [10, 10],
  [0, 5],
]);
const stdEllipse = standardDeviationalEllipse(pts);

// Access custom properties
// It's correct to use optional chaining here ?. as even though the function
// *always* adds properties, that does not change the overall optional nature of
// the containing properties attribute.
stdEllipse.properties?.standardDeviationalEllipse.meanCenterCoordinates;
