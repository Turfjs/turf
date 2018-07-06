import { Polygon, MultiPolygon, Feature, FeatureCollection } from '../helpers';

/**
 * http://turfjs.org/docs/#unkink-polygon
 */
export default function unkinkPolygon<T extends Polygon | MultiPolygon>(
    geojson: Feature<T> | FeatureCollection<T> | T
): FeatureCollection<Polygon>;
