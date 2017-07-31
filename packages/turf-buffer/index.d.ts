/// <reference types="geojson" />

import {Units} from '@turf/helpers';

type GeometryObject = GeoJSON.GeometryObject;
type Feature<Geom extends GeometryObject> = GeoJSON.Feature<Geom>;
type Geoms = GeoJSON.LineString | GeoJSON.MultiLineString;

/**
 * http://turfjs.org/docs/#lineoffset
 */
declare function lineOffset<Geom extends Geoms>(line: Feature<Geom> | Geom, distance: number, units?: Units): Feature<Geom>;
declare namespace lineOffset { }
export = lineOffset;
