import * as lineOverlap from '../'

const line: GeoJSON.Feature<GeoJSON.LineString> = undefined;
const multiLine: GeoJSON.Feature<GeoJSON.MultiLineString> = undefined;
const poly: GeoJSON.Feature<GeoJSON.Polygon> = undefined;
const multiPoly: GeoJSON.Feature<GeoJSON.MultiPolygon> = undefined;

lineOverlap(line, poly)
lineOverlap(line, line)
lineOverlap(multiPoly, line)
lineOverlap(multiPoly, multiLine)
