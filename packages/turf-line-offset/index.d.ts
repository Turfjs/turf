/// <reference types="geojson" />

import { Units } from '@turf/helpers';

export type GeometryObject = GeoJSON.GeometryObject;
export type Feature<Geom extends GeometryObject> = GeoJSON.Feature<Geom>;
export type Geoms = GeoJSON.LineString | GeoJSON.MultiLineString;

/**
 * http://turfjs.org/docs/#lineoffset
 */
export default function lineOffset<Geom extends Geoms>(line: Feature<Geom> | Geom, distance: number, units?: Units): Feature<Geom>;
