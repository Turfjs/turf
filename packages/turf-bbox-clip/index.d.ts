import { BBox, Feature, LineString, MultiLineString, MultiPolygon, Polygon, Properties } from "@turf/helpers";
/**
 * Takes a {@link Feature} and a bbox and clips the feature to the bbox using
 * [lineclip](https://github.com/mapbox/lineclip).
 * May result in degenerate edges when clipping Polygons.
 *
 * @name bboxClip
 * @param {Feature<LineString|MultiLineString|Polygon|MultiPolygon>} feature feature to clip to the bbox
 * @param {BBox} bbox extent in [minX, minY, maxX, maxY] order
 * @returns {Feature<LineString|MultiLineString|Polygon|MultiPolygon>} clipped Feature
 * @example
 * var bbox = [0, 0, 10, 10];
 * var poly = turf.polygon([[[2, 2], [8, 4], [12, 8], [3, 7], [2, 2]]]);
 *
 * var clipped = turf.bboxClip(poly, bbox);
 *
 * //addToMap
 * var addToMap = [bbox, poly, clipped]
 */
export default function bboxClip<G extends Polygon | MultiPolygon | LineString | MultiLineString, P = Properties>(feature: Feature<G, P> | G, bbox: BBox): Feature<LineString, {}> | Feature<MultiLineString, {}> | Feature<Polygon, {}> | Feature<MultiPolygon, {}>;
