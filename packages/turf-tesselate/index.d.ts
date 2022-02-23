import { Feature, FeatureCollection, Polygon } from "geojson";

/**
 * http://turfjs.org/docs/#tesselate
 */
export default function (polygon: Feature<Polygon>): FeatureCollection<Polygon>;
