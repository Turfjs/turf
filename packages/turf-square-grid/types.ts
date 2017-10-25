import { BBox } from '@turf/helpers'
import squareGrid from './'

const bbox: BBox = [-95, 30, -85, 40]

squareGrid(bbox, 50)
squareGrid(bbox, 50, {units: 'miles'})
squareGrid(bbox, 50, {units: 'miles', properties: {foo: 'bar'}})
