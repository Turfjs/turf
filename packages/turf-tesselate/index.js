var polygon = require('turf-helpers').polygon;
var earcut = require('earcut');

/**
 * Tesselates a {@link Feature<Polygon>} into a {@link FeatureCollection<Polygon>} of triangles
 * using [earcut](https://github.com/mapbox/earcut).
 *
 * @name tesselate
 * @param {Feature<Polygon>} polygon the polygon to tesselate
 * @returns {FeatureCollection<Polygon>} a geometrycollection feature
 * @example
 * var polygon = {"type":"Feature","id":"USA-CA","properties":{"name":"California"},"geometry":{"type":"Polygon","coordinates":[[[-123.233256,42.006186],[-122.378853,42.011663],[-121.037003,41.995232],[-120.001861,41.995232],[-119.996384,40.264519],[-120.001861,38.999346],[-118.71478,38.101128],[-117.498899,37.21934],[-116.540435,36.501861],[-115.85034,35.970598],[-114.634459,35.00118],[-114.634459,34.87521],[-114.470151,34.710902],[-114.333228,34.448009],[-114.136058,34.305608],[-114.256551,34.174162],[-114.415382,34.108438],[-114.535874,33.933176],[-114.497536,33.697668],[-114.524921,33.54979],[-114.727567,33.40739],[-114.661844,33.034958],[-114.524921,33.029481],[-114.470151,32.843265],[-114.524921,32.755634],[-114.72209,32.717295],[-116.04751,32.624187],[-117.126467,32.536556],[-117.24696,32.668003],[-117.252437,32.876127],[-117.329114,33.122589],[-117.471515,33.297851],[-117.7837,33.538836],[-118.183517,33.763391],[-118.260194,33.703145],[-118.413548,33.741483],[-118.391641,33.840068],[-118.566903,34.042715],[-118.802411,33.998899],[-119.218659,34.146777],[-119.278905,34.26727],[-119.558229,34.415147],[-119.875891,34.40967],[-120.138784,34.475393],[-120.472878,34.448009],[-120.64814,34.579455],[-120.609801,34.858779],[-120.670048,34.902595],[-120.631709,35.099764],[-120.894602,35.247642],[-120.905556,35.450289],[-121.004141,35.461243],[-121.168449,35.636505],[-121.283465,35.674843],[-121.332757,35.784382],[-121.716143,36.195153],[-121.896882,36.315645],[-121.935221,36.638785],[-121.858544,36.6114],[-121.787344,36.803093],[-121.929744,36.978355],[-122.105006,36.956447],[-122.335038,37.115279],[-122.417192,37.241248],[-122.400761,37.361741],[-122.515777,37.520572],[-122.515777,37.783465],[-122.329561,37.783465],[-122.406238,38.15042],[-122.488392,38.112082],[-122.504823,37.931343],[-122.701993,37.893004],[-122.937501,38.029928],[-122.97584,38.265436],[-123.129194,38.451652],[-123.331841,38.566668],[-123.44138,38.698114],[-123.737134,38.95553],[-123.687842,39.032208],[-123.824765,39.366301],[-123.764519,39.552517],[-123.85215,39.831841],[-124.109566,40.105688],[-124.361506,40.259042],[-124.410798,40.439781],[-124.158859,40.877937],[-124.109566,41.025814],[-124.158859,41.14083],[-124.065751,41.442061],[-124.147905,41.715908],[-124.257444,41.781632],[-124.213628,42.000709],[-123.233256,42.006186]]]}};
 *
 * var triangles = turf.tesselate(polygon);
 *
 * //=triangles
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
