import * as index from '../'

const collection: GeoJSON.FeatureCollection<any> = undefined
const tree = index(collection, 16, ['0', '1', '0', '1'])
tree.all().map(bbox => {
  bbox.index
})
const search = tree.search({
  minX: 100,
  minY: 30,
  maxX: 120,
  maxY: 40
})