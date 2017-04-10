/// <reference types="geojson" />

import {
    Units,
    Feature, Features,
    Point, Points, MultiPoint, MultiPoints,
    LineString, LineStrings, MultiLineString, MultiLineStrings,
    Polygon, Polygons, MultiPolygon, MultiPolygons} from '@turf/helpers';

interface Buffer {
    /**
     * http://turfjs.org/docs/#buffer
     */
    (feature: Point | LineString | Polygon, radius?: number, unit?: Units): Polygon;
    (feature: Points | LineStrings | Polygons, radius?: number, unit?: Units): Polygons;
    (feature: MultiPoint | MultiLineString | MultiPolygon, radius?: number, unit?: Units): MultiPolygon;
    (feature: MultiPoints | MultiLineStrings | MultiPolygons, radius?: number, unit?: Units): MultiPolygons;
    (feature: Feature, radius?: number, unit?: Units): Polygon | MultiPolygon;
    (feature: Features, radius?: number, unit?: Units): Polygons | MultiPolygons;
    (feature: GeoJSON.GeometryObject, radius?: number, unit?: Units): Polygon | MultiPolygon;
    (feature: GeoJSON.GeometryCollection, radius?: number, unit?: Units): Polygons | MultiPolygons;
}
declare const buffer: Buffer;
declare namespace buffer { }
export = buffer;
