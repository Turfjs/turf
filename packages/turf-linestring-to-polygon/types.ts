import {featureCollection, lineString, multiLineString, Polygon, MultiPolygon} from '@turf/helpers'
import * as polygonToLineString from './'

// Fixtures
const coords = [[125, -30], [145, -30], [145, -20], [125, -20], [125, -30]];
const line = lineString(coords);
const multiLine = multiLineString([coords, coords]);

// Assert results with types
const poly1: Polygon = polygonToLineString(line);
const poly2: Polygon = polygonToLineString(multiLine);
const multiPoly: MultiPolygon = polygonToLineString(featureCollection([line, multiLine]));
