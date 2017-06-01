import {BBox, Points} from '@turf/helpers'
import * as pointGrid from './'

const bbox: BBox = [-95, 30, -85, 40]
const grid: Points = pointGrid(bbox, 50, 'miles')
