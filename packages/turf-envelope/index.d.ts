import { Feature, Polygon } from "geojson";
import { AllGeoJSON } from "@turf/helpers";

/**
 * http://turfjs.org/docs/#envelope
 */
export default function envelope(features: AllGeoJSON): Feature<Polygon>;
