import * as turf from '../'

turf.point([0, 1])
turf.lineString([[0, 1], [2, 3]])
turf.polygon([[[0, 1], [2, 3], [0, 1]]])
turf.feature({coordinates: [1, 0], type: 'point'})
turf.multiLineString([[[0, 1], [2, 3], [0, 1]]])
turf.multiPoint([[0, 1], [2, 3], [0, 1]])
turf.multiPolygon([[[[0, 1], [2, 3], [0, 1]]]])
turf.geometryCollection([{coordinates: [1, 0], type: 'point'}])
turf.radiansToDistance(5)
turf.distanceToRadians(10)
turf.distanceToDegrees(45)
