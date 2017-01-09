import * as meta from '../index'

const pointGeometry: GeoJSON.Point = {
    type: 'Point',
    coordinates: [0, 0]
};

const lineStringGeometry: GeoJSON.LineString = {
    type: 'LineString',
    coordinates: [[0, 0], [1, 1]]
};

const polygonGeometry: GeoJSON.Polygon = {
    type: 'Polygon',
    coordinates: [[[0, 0], [1, 1], [0, 1], [0, 0]]]
};

const multiPolygonGeometry: GeoJSON.MultiPolygon = {
    type: 'MultiPolygon',
    coordinates: [[[[0, 0], [1, 1], [0, 1], [0, 0]]]]
};

const geometryCollection: GeoJSON.GeometryCollection = {
    type: 'GeometryCollection',
    geometries: [pointGeometry, lineStringGeometry]
};

const pointFeature: GeoJSON.Feature<GeoJSON.Point> = {
    type: 'Feature',
    properties: { a: 1},
    geometry: pointGeometry
};

// pointGeometry
meta.coordEach(pointGeometry, coords => {
    const equal: Array<number> = coords
})

// lineStringGeometry
meta.coordEach(lineStringGeometry, coords => {
    const equal: Array<Array<number>> = coords
})

// polygonGeometry
meta.coordEach(polygonGeometry, coords => {
    const equal: Array<Array<Array<number>>> = coords
})

// multiPolygonGeometry
meta.coordEach(multiPolygonGeometry, coords => {
    const equal: Array<Array<Array<number>>> = coords
})

// geometryCollection
meta.coordEach(geometryCollection, coords => {
    const equal: Array<Array<Array<number>>> = coords
})

// pointFeature
meta.coordEach(pointFeature, coords => {
    const equal: Array<number> = coords
})

// coordReduce
meta.coordReduce(pointFeature, (memo, coords) => {
    const equal: Array<number> = coords
}, 'foo')

// propEach
meta.propEach(pointFeature, properties => {
    const equal: any = properties
})

// coordAll
const coords: Array<Array<number>> = meta.coordAll(polygonGeometry)

// geomEach
meta.geomEach(polygonGeometry, geom => {
    const equal: GeoJSON.Polygon = geom
})