import * as fs from 'fs'
import * as path from 'path'
import * as idw from '../'

const testPoints: GeoJSON.FeatureCollection<GeoJSON.Point> = JSON.parse(fs.readFileSync(path.join(__dirname, 'in', 'data.geojson'), 'utf-8'))
idw(testPoints, 'value' , 0.5 , 1, 'kilometers')