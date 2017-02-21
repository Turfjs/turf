import {BBox, Polygons} from '@turf/helpers'
import * as squareGrid from '../'

const bbox: BBox = [
    -96.6357421875,
    31.12819929911196,
    -84.9462890625,
    40.58058466412764
]
const grid: Polygons = squareGrid(bbox, 50, 'miles')
