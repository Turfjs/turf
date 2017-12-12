import {point, polygon} from '@turf/helpers'
import booleanPointInPolygon from './'

const poly = polygon([[[0, 0], [0, 100], [100, 100], [100, 0], [0, 0]]]);
const pt = point([50, 50]);
booleanPointInPolygon(pt, poly);
booleanPointInPolygon(pt, poly, {ignoreBoundary: true});