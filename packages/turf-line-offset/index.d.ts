/// <reference types="geojson" />

type LineString = GeoJSON.Feature<GeoJSON.LineString>;
import {Units} from '@turf/helpers';

/**
 * http://turfjs.org/docs/#lineOffset
 */
declare function lineOffset(line: LineString | GeoJSON.LineString, distance: number, units?: Units): LineString;
declare namespace lineOffset { }
export = lineOffset;
