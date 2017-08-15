import {polygon} from '@turf/helpers'
import * as simplify from './'

const poly = polygon([[[0, 0], [10, 10], [20, 20], [0, 0]]]);

// Output type is the same as Input type
const simple: GeoJSON.Feature<GeoJSON.Polygon> = simplify(poly);

// Extra params
simplify(poly, 1);
simplify(poly, 1, true);