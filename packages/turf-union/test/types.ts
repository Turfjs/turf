import * as path from 'path'
import * as fs from 'fs'
import * as union from '../'

const featureCollection = JSON.parse(fs.readFileSync(path.join(__dirname, 'in', 'Intersect1.geojson'), 'utf8'))
const feature1: GeoJSON.Feature<GeoJSON.Polygon> = featureCollection[0].features[0]
const feature2: GeoJSON.Feature<GeoJSON.Polygon> = featureCollection[1].features[0]
union(feature1, feature2)

