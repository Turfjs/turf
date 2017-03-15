import * as lineSegment from '../'
import * as path from 'path'
const load = require('load-json-file')

const polygon: GeoJSON.Feature<GeoJSON.Polygon> = load.sync(path.join(__dirname, 'in', 'polygon.geojson'));

// Test Types
lineSegment(polygon)
