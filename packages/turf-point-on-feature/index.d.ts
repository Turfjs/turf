import { Feature, Point } from "geojson";
import { AllGeoJSON } from "@turf/helpers";

/**
 * http://turfjs.org/docs/#pointonfeature
 */
export default function pointOnFeature(geojson: AllGeoJSON): Feature<Point>;
