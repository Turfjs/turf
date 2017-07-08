/// <reference types="geojson" />

import {Units, FeatureGeometryCollection} from '@turf/helpers';

type LineString = GeoJSON.LineString;
type Polygon = GeoJSON.Polygon;
type MultiLineString = GeoJSON.MultiLineString;
type MultiPolygon = GeoJSON.MultiPolygon;
type GeometryObject = GeoJSON.GeometryObject;
type GeometryCollection = GeoJSON.GeometryCollection;
type Feature<Geom extends GeometryObject> = GeoJSON.Feature<Geom>;
type FeatureCollection<Geom extends GeometryObject> = GeoJSON.FeatureCollection<Geom>;
type Geoms = LineString|Polygon|MultiLineString|MultiPolygon;
type Input = FeatureCollection<Geoms> | Feature<Geoms> | Geoms | FeatureGeometryCollection;

/**
 * http://turfjs.org/docs/#rewind
 */
declare function rewind<T extends Input>(geojson: T, reversed?: boolean, mutate?: boolean): T;
declare namespace rewind { }
export = rewind;
