import * as arc from '../'

const point: GeoJSON.Feature<GeoJSON.Point> = undefined
const line: GeoJSON.Feature<GeoJSON.LineString> = arc(point, point)
