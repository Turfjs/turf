import { BBox, Feature, Id, Polygon, Properties } from "@turf/helpers";
/**
 * Takes a bbox and returns an equivalent {@link Polygon|polygon}.
 *
 * @name bboxPolygon
 * @param {BBox} bbox extent in [minX, minY, maxX, maxY] order
 * @param {Object} [options={}] Optional parameters
 * @param {Properties} [options.properties={}] Translate properties to Polygon
 * @param {string|number} [options.id={}] Translate Id to Polygon
 * @returns {Feature<Polygon>} a Polygon representation of the bounding box
 * @example
 * var bbox = [0, 0, 10, 10];
 *
 * var poly = turf.bboxPolygon(bbox);
 *
 * //addToMap
 * var addToMap = [poly]
 */
export default function bboxPolygon<P = Properties>(bbox: BBox, options?: {
    properties?: P;
    id?: Id;
}): Feature<Polygon, P>;
