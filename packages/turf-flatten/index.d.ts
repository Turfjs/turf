/// <reference types="geojson" />

import {
    Point, Points, MultiPoint, MultiPoints,
    LineString, LineStrings, MultiLineString, MultiLineStrings,
    Polygon, Polygons, MultiPolygon, MultiPolygons,
    Feature, Features} from '@turf/helpers'

/**
 * http://turfjs.org/docs/#flatten
 */
declare function flatten(geojson: Point | Points | MultiPoint | MultiPoints): Points;
declare function flatten(geojson: LineString | LineStrings | MultiLineString | MultiLineStrings): LineStrings;
declare function flatten(geojson: Polygons | Polygons | MultiPolygons | MultiPolygons): Polygons;
declare function flatten(geojson: Feature<any> | Features<any>): Features<any>;
declare function flatten(geojson: GeoJSON.GeometryCollection | GeoJSON.GeometryObject): Features<any>;

export default flatten;
