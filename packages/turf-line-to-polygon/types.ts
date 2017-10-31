import {
    featureCollection,
    lineString,
    multiLineString,
    Polygon,
    LineString,
    MultiLineString,
    MultiPolygon,
    Feature,
    FeatureCollection
} from '@turf/helpers'
import lineToPolygon from './'

// Fixtures
const coords = [[125, -30], [145, -30], [145, -20], [125, -20], [125, -30]];
const line = lineString(coords);
const multiLine = multiLineString([coords, coords]);
const fc = featureCollection([line, multiLine]);

// Assert results with types
const poly1: Feature<Polygon> = lineToPolygon(line);
const poly2: Feature<Polygon> = lineToPolygon(multiLine);
const poly3: Feature<MultiPolygon> = lineToPolygon(fc);
