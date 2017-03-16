import * as kinks from '../'
import * as path from 'path'
const load = require('load-json-file')

const hourglass: GeoJSON.Feature<GeoJSON.LineString> = load.sync(path.join(__dirname, 'in', 'hourglass.geojson'));

// Test Types
kinks(hourglass)
