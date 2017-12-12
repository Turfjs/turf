import { Units, BBox, Polygon, MultiPolygon, Feature, FeatureCollection, Point, Properties } from '@turf/helpers';

/**
 * http://turfjs.org/docs/#pointgrid
 */
export default function pointGrid<P = Properties>(
    bbox: BBox,
    cellSide: number,
    options?: {
        units?: Units,
        properties?: P,
        mask?: Feature<Polygon | MultiPolygon> | Polygon | MultiPolygon;
    }
): FeatureCollection<Point, P>;
