import { BBox, Polygons } from '@turf/helpers'
import squareGrid from './'

const bbox: BBox = [-95, 30, -85, 40]
const grid: Polygons = squareGrid(bbox, 50, 'miles')
