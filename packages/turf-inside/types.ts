import {point, polygon} from '@turf/helpers'
import * as inside from './'

const poly = polygon([[[0, 0], [0, 100], [100, 100], [100, 0], [0, 0]]]);
const pt = point([50, 50]);
inside(pt, poly);