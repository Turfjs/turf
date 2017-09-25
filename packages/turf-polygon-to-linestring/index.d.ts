/// <reference types="geojson" />

import {
    Polygon,
    MultiPolygon,
    Feature,
    FeatureCollection,
    LineString,
    MultiLineString,
    GeometryCollection,
    FeatureGeometryCollection
} from '@turf/helpers';

/**
 * http://turfjs.org/docs/#polygontolinestring
 *
 * Feature => LineString
 */
declare function polygonToLineString<T extends Polygon | MultiPolygon>(
    polygon: Feature<T> | T
): Feature<LineString>;

/**
 * http://turfjs.org/docs/#polygontolinestring
 *
 * FeatureCollection => MultiLineString
 */
declare function polygonToLineString<T extends Polygon | MultiPolygon>(
    polygon: FeatureCollection<T> | GeometryCollection | FeatureGeometryCollection
): Feature<MultiLineString>;

export default polygonToLineString;
