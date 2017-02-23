import * as path from 'path'
import * as fs from 'fs'
import * as unkink from '../'

type MultiPolygons = GeoJSON.FeatureCollection<GeoJSON.MultiPolygon>
type Polygons = GeoJSON.FeatureCollection<GeoJSON.Polygon>

const geojson: MultiPolygons = JSON.parse(fs.readFileSync(path.join(__dirname, 'in', 'hourglassMultiPolygon.geojson'), 'utf8'))
const unkinked: Polygons = unkink(geojson)