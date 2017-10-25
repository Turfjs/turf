import { Units, BBox, Polygon, Feature, MultiPolygon, Properties, FeatureCollection } from '@turf/helpers'

/**
 * http://turfjs.org/docs/#squaregrid
 */
export default function squareGrid(
    bbox: BBox,
    cellSide: number,
    options?: {
        units?: Units,
        properties?: Properties,
        mask?: Feature<Polygon | MultiPolygon> | Polygon | MultiPolygon
    }
): FeatureCollection<Polygon>;
