var polygon = require('@turf/helpers').polygon;
var earcut = require('earcut');


/**
 * Tesselates a {@link Feature<Polygon>} into a {@link FeatureCollection<Polygon>} of triangles
 * using [earcut](https://github.com/mapbox/earcut).
 *
 * @name tesselate
 * @param {Feature<Polygon>} poly the polygon to tesselate
 * @returns {FeatureCollection<Polygon>} a geometrycollection feature
 * @example
 * var poly = turf.polygon([[[11, 0], [22, 4], [31, 0], [31, 11], [21, 15], [11, 11], [11, 0]]]);
 * var triangles = turf.tesselate(poly);
 *
 * //addToMap
 * var addToMap = [poly, triangles]
 */
module.exports = function (poly) {
    if (!poly.geometry || (poly.geometry.type !== 'Polygon' && poly.geometry.type !== 'MultiPolygon')) {
        throw new Error('input must be a Polygon or MultiPolygon');
    }

    var fc = {type: 'FeatureCollection', features: []};

    if (poly.geometry.type === 'Polygon') {
        fc.features = processPolygon(poly.geometry.coordinates);
    } else {
        poly.geometry.coordinates.forEach(function (coordinates) {
            fc.features = fc.features.concat(processPolygon(coordinates));
        });
    }

    return fc;
};

function processPolygon(coordinates) {
    var data = flattenCoords(coordinates);
    var dim = 2;
    var result = earcut(data.vertices, data.holes, dim);

    var features = [];
    var vertices = [];

    result.forEach(function (vert, i) {
        var index = result[i];
        vertices.push([data.vertices[index * dim], data.vertices[index * dim + 1]]);
    });

    for (var i = 0; i < vertices.length; i += 3) {
        var coords = vertices.slice(i, i + 3);
        coords.push(vertices[i]);
        features.push(polygon([coords]));
    }

    return features;
}

function flattenCoords(data) {
    var dim = data[0][0].length,
        result = {vertices: [], holes: [], dimensions: dim},
        holeIndex = 0;

    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].length; j++) {
            for (var d = 0; d < dim; d++) result.vertices.push(data[i][j][d]);
        }
        if (i > 0) {
            holeIndex += data[i - 1].length;
            result.holes.push(holeIndex);
        }
    }

    return result;
}
