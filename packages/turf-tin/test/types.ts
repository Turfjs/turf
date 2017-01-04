import * as tin from '..'

const points: GeoJSON.FeatureCollection<GeoJSON.Point> = require('./Points')
tin(points)
tin(points, 'elevation')
