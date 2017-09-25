import {
    featureCollection,
    lineString,
    multiLineString,
    // Typescript Definitions
    Polygon,
    MultiPolygon,
    Feature
} from '@turf/helpers'
import polygonToLineString from './'

// Fixtures
const coords = [[125, -30], [145, -30], [145, -20], [125, -20], [125, -30]];
const line = lineString(coords);
const multiLine = multiLineString([coords, coords]);

// Assert results with types
const poly1: Feature<Polygon> = polygonToLineString(line);
const poly2: Feature<Polygon> = polygonToLineString(multiLine);
const multiPoly: Feature<MultiPolygon> = polygonToLineString(featureCollection([line, multiLine]));
