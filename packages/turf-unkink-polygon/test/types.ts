import * as path from 'path'
import * as load from 'load-json-file'
import * as unkink from '../'

const geojson: GeoJSON.FeatureCollection<GeoJSON.MultiPolygon> = load.sync(path.join(__dirname, 'in', 'hourglassMultiPolygon.geojson'));
const unkinked: GeoJSON.FeatureCollection<GeoJSON.Polygon> = unkink(geojson);
