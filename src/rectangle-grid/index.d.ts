import { BBox, Feature, FeatureCollection, MultiPolygon, Polygon, Properties, Units } from "../helpers";

/**
 * http://turfjs.org/docs/#rectanglegrid
 */

export default function rectangleGrid<P = Properties>(bbox: BBox, cellWidth: number, cellHeight: number, options?: {
    units?: Units;
    properties?: P;
    mask?: Feature<Polygon | MultiPolygon> | Polygon | MultiPolygon;
}): FeatureCollection<Polygon, P>;
