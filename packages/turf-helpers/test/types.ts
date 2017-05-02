import {
  Feature, Points, Polygons, LineStrings,
  point, lineString, polygon,
  multiPoint, multiLineString, multiPolygon,
  feature, featureCollection, geometryCollection,
  radiansToDistance, distanceToDegrees, distanceToRadians} from '../'

const pt = point([0, 1])
const line = lineString([[0, 1], [2, 3]])
const poly = polygon([[[0, 1], [2, 3], [0, 1]]])
feature({coordinates: [1, 0], type: 'point'})
multiLineString([[[0, 1], [2, 3], [0, 1]]])
multiPoint([[0, 1], [2, 3], [0, 1]])
multiPolygon([[[[0, 1], [2, 3], [0, 1]]]])
geometryCollection([{coordinates: [1, 0], type: 'point'}])
radiansToDistance(5)
distanceToRadians(10)
distanceToDegrees(45)

/**
 * Feature Collection
 */
// Mixed collection is defiend as FeatureCollection<any>
const mixed = featureCollection([pt, poly])
mixed.features.push(pt)
mixed.features.push(line)
mixed.features.push(poly)

// Blank collection is defined as FeatureCollection<any>
const blank = featureCollection([])
blank.features.push(pt)
blank.features.push(line)
blank.features.push(poly)

// Collection with only Points
const points = featureCollection<GeoJSON.Point>([])
points.features.push(pt)

// Collection with only LineStrings
const lines = featureCollection([line])
lines.features.push(line)

// Collection with only Polygons
const polygons = featureCollection<GeoJSON.Polygon>([])
polygons.features.push(poly)