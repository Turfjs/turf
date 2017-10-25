import {
    featureCollection,
    lineString,
    multiLineString,
    // Typescript Definitions
    Polygon,
    LineString,
    MultiLineString,
    MultiPolygon,
    Feature,
    FeatureCollection
} from '@turf/helpers'
import lineStringToPolygon from './'

// Fixtures
const coords = [[125, -30], [145, -30], [145, -20], [125, -20], [125, -30]];
const line = lineString(coords);
const multiLine = multiLineString([coords, coords]);
const fc = featureCollection([line, multiLine]);

// Assert results with types
const poly1: Feature<Polygon> = lineStringToPolygon(line);
const poly2: Feature<Polygon> = lineStringToPolygon(multiLine);
const poly3: Feature<MultiPolygon> = lineStringToPolygon(fc);
