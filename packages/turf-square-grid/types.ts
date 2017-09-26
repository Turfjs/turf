import { BBox, Polygon, FeatureCollection } from '@turf/helpers'
import squareGrid from './'

const bbox: BBox = [-95, 30, -85, 40]
const grid: FeatureCollection<Polygon> = squareGrid(bbox, 50, 'miles')
