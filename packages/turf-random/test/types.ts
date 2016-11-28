import * as random from '../index'

const equals_1: GeoJSON.FeatureCollection<GeoJSON.Point> = random('points', 3, {bbox: [1, 2, 3, 4]})
const equals_2: GeoJSON.FeatureCollection<GeoJSON.Point> = random('point')
const equals_3: GeoJSON.FeatureCollection<GeoJSON.Point> = random()
const equals_4: GeoJSON.FeatureCollection<GeoJSON.Point> = random(undefined)
const equals_5: GeoJSON.FeatureCollection<GeoJSON.Polygon> = random('polygon')
const equals_6: GeoJSON.FeatureCollection<GeoJSON.Polygon> = random('polygon')
