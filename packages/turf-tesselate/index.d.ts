import { Feature, FeatureCollection, Polygon } from "@turf/helpers";

/**
 * http://turfjs.org/docs/#tesselate
 */
export default function (polygon: Feature<Polygon>): FeatureCollection<Polygon>;
