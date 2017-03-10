import * as greatCircle from '../'

const point: GeoJSON.Feature<GeoJSON.Point> = undefined
const line: GeoJSON.Feature<GeoJSON.LineString> = greatCircle(point, point)
