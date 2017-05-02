/// <reference types="geojson" />

import {
    Point, Points, MultiPoint, MultiPoints,
    LineString, LineStrings, MultiLineString, MultiLineStrings,
    Polygon, Polygons, MultiPolygon, MultiPolygons,
    Feature, Features} from '@turf/helpers'

interface Flatten {
    /**
     * http://turfjs.org/docs/#flatten
     */
    (geojson: Point | Points | MultiPoint | MultiPoints): Points;
    (geojson: LineString | LineStrings | MultiLineString | MultiLineStrings): LineStrings;
    (geojson: Polygons | Polygons | MultiPolygons | MultiPolygons): Polygons;
    (geojson: Feature<any> | Features<any>): Features<any>;
    (geojson: GeoJSON.GeometryCollection | GeoJSON.GeometryObject): Features<any>;
}

declare const flatten: Flatten;
declare namespace flatten { }
export = flatten;
