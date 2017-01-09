import * as fs from 'fs'
import * as path from 'path'
import * as simplify from '..'

const polygon: GeoJSON.FeatureCollection<GeoJSON.Polygon> = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'in', 'simple.geojson'), 'utf8'))

simplify(polygon)