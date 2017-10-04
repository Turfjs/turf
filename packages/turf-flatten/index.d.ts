import {
    Point,
    MultiPoint,
    LineString,
    MultiLineString,
    Polygon,
    MultiPolygon,
    Feature,
    GeometryObject,
    FeatureCollection,
    GeometryCollection,
    FeatureGeometryCollection
} from '@turf/helpers'

/**
 * http://turfjs.org/docs/#flatten
 */
declare function flatten<T extends Point | MultiPoint>(geojson: Feature<T> | FeatureCollection<T> | T): FeatureCollection<Point>;
declare function flatten<T extends LineString | MultiLineString>(geojson: Feature<T> | FeatureCollection<T> | T): FeatureCollection<LineString>;
declare function flatten<T extends Polygon | MultiPolygon>(geojson: Feature<T> | FeatureCollection<T> | T): FeatureCollection<Polygon>;
declare function flatten(geojson: FeatureCollection<any> | Feature<any> | FeatureGeometryCollection | GeometryCollection | GeometryObject): FeatureCollection<any>;

export default flatten;
