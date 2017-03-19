import * as path from 'path'
import * as flatten from '../'
const load = require('load-json-file')

const multiPolygon: GeoJSON.Feature<GeoJSON.MultiPolygon> = load.sync(path.join(__dirname, 'in', 'MultiPolygon.geojson'))
flatten(multiPolygon);

const geometryCollection: GeoJSON.GeometryCollection = load.sync(path.join(__dirname, 'in', 'GeometryCollection.geojson'))
flatten(geometryCollection);
