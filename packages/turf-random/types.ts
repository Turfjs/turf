import {
    randomPoint,
    randomLineString,
    randomPolygon,
    randomPosition
} from './'

// Random Point
randomPoint()
randomPoint(3)
randomPoint(3, {bbox: [1, 2, 3, 4]})

// Random Polygon
randomPolygon()
randomPolygon(3)
randomPolygon(3, {bbox: [1, 2, 3, 4]})

// Random LineString
randomLineString()
randomLineString(3)
randomLineString(3, {bbox: [1, 2, 3, 4]})

// Random Position
randomPosition()
randomPosition([1, 2, 3, 4])
randomPosition({bbox: [1, 2, 3, 4]})
