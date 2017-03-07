import * as lineChunk from '../'

const lines: GeoJSON.Feature<GeoJSON.LineString> = undefined

lineChunk(lines, 2)
lineChunk(lines, 2, 'kilometers')