import { points } from "@turf/helpers";
import standardDeviatationalEllipse from "./";

const pts = points([
  [10, 10],
  [0, 5],
]);
const stdEllipse = standardDeviatationalEllipse(pts);

// Access custom properties
stdEllipse.properties.standardDeviationalEllipse.meanCenterCoordinates;
