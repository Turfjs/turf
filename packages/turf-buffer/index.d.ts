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
    (feature: Point | LineString | Polygon, radius?: number, unit?: Units, steps?: number): Polygon;
    (feature: Points | LineStrings | Polygons | MultiPoint | MultiPoints, radius?: number, unit?: Units, steps?: number): Polygons;
    (feature: MultiLineString | MultiPolygon, radius?: number, unit?: Units, steps?: number): MultiPolygon;
    (feature: MultiLineStrings | MultiPolygons, radius?: number, unit?: Units, steps?: number): MultiPolygons;
    (feature: Feature, radius?: number, unit?: Units, steps?: number): Polygon | Polygons | MultiPolygon;
    (feature: Features, radius?: number, unit?: Units, steps?: number): Polygons | MultiPolygons;
    (feature: GeoJSON.GeometryObject, radius?: number, unit?: Units, steps?: number): Polygon | Polygons | MultiPolygon;
    (feature: GeoJSON.GeometryCollection, radius?: number, unit?: Units, steps?: number): Polygons | MultiPolygons;
}
declare const buffer: Buffer;
declare namespace buffer {}
export = buffer;
