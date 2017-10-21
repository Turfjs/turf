import { Units, BBox, Polygon, MultiPolygon, Feature, FeatureCollection, Point, Properties } from '@turf/helpers';

/**
 * http://turfjs.org/docs/#pointgrid
 */
export default function pointGrid(
    bbox: BBox,
    cellSide: number,
    options?: {
        units?: Units,
        properties?: Properties,
        mask?: Feature<Polygon | MultiPolygon> | Polygon | MultiPolygon;
    }
): FeatureCollection<Point>;
