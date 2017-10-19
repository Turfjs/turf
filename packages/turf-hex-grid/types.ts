import {BBox} from '@turf/helpers'
import hexGrid from './'

const bbox: BBox = [
    -96.6357421875,
    31.12819929911196,
    -84.9462890625,
    40.58058466412764
]

hexGrid(bbox, 50)
hexGrid(bbox, 50, {units: 'miles'})
hexGrid(bbox, 50, {units: 'miles', triangles: true})
hexGrid(bbox, 50, {units: 'miles', triangles: true, properties: {foo: 'bar'}})
