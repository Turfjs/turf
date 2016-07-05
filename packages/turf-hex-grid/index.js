var point = require('turf-helpers').point;
var polygon = require('turf-helpers').polygon;
var distance = require('turf-distance');
var featurecollection = require('turf-helpers').featureCollection;

//Precompute cosines and sines of angles used in hexagon creation
// for performance gain
var cosines = [];
var sines = [];
for (var i = 0; i < 6; i++) {
    var angle = 2 * Math.PI / 6 * i;
    cosines.push(Math.cos(angle));
    sines.push(Math.sin(angle));
}

/**
 * Takes a bounding box and a cell size in degrees and returns a {@link FeatureCollection} of flat-topped
 * hexagons ({@link Polygon} features) aligned in an "odd-q" vertical grid as
 * described in [Hexagonal Grids](http://www.redblobgames.com/grids/hexagons/).
 *
 * @name hexGrid
 * @param {Array<number>} bbox bounding box in [minX, minY, maxX, maxY] order
 * @param {number} cellSize dimension of cell in specified units
 * @param {string} units used in calculating cellWidth ('miles' or 'kilometers')
 * @param {boolean} triangles whether to return as triangles instead of hexagons
 * @return {FeatureCollection<Polygon>} a hexagonal grid
 * @example
 * var bbox = [-96,31,-84,40];
 * var cellWidth = 50;
 * var units = 'miles';
 *
 * var hexgrid = turf.hexGrid(bbox, cellWidth, units);
 *
 * //=hexgrid
 */
module.exports = function hexGrid(bbox, cellSize, units, triangles) {
    var xFraction = cellSize / (distance(point([bbox[0], bbox[1]]), point([bbox[2], bbox[1]]), units));
    var cellWidth = xFraction * (bbox[2] - bbox[0]);
    var yFraction = cellSize / (distance(point([bbox[0], bbox[1]]), point([bbox[0], bbox[3]]), units));
    var cellHeight = yFraction * (bbox[3] - bbox[1]);
    var radius = cellWidth / 2;

    var hex_width = radius * 2;
    var hex_height = Math.sqrt(3) / 2 * cellHeight;

    var box_width = bbox[2] - bbox[0];
    var box_height = bbox[3] - bbox[1];

    var x_interval = 3 / 4 * hex_width;
    var y_interval = hex_height;

    var x_span = box_width / (hex_width - radius / 2);
    var x_count = Math.ceil(x_span);
    if (Math.round(x_span) === x_count) {
        x_count++;
    }

    var x_adjust = ((x_count * x_interval - radius / 2) - box_width) / 2 - radius / 2;

    var y_count = Math.ceil(box_height / hex_height);

    var y_adjust = (box_height - y_count * hex_height) / 2;

    var hasOffsetY = y_count * hex_height - box_height > hex_height / 2;
    if (hasOffsetY) {
        y_adjust -= hex_height / 4;
    }

    var fc = featurecollection([]);
    for (var x = 0; x < x_count; x++) {
        for (var y = 0; y <= y_count; y++) {

            var isOdd = x % 2 === 1;
            if (y === 0 && isOdd) {
                continue;
            }

            if (y === 0 && hasOffsetY) {
                continue;
            }

            var center_x = x * x_interval + bbox[0] - x_adjust;
            var center_y = y * y_interval + bbox[1] + y_adjust;

            if (isOdd) {
                center_y -= hex_height / 2;
            }
            if (triangles) {
                fc.features.push.apply(fc.features, hexTriangles([center_x, center_y], cellWidth / 2, cellHeight / 2));
            } else {
                fc.features.push(hexagon([center_x, center_y], cellWidth / 2, cellHeight / 2));
            }
        }
    }

    return fc;
};

//Center should be [x, y]
function hexagon(center, rx, ry) {
    var vertices = [];
    for (var i = 0; i < 6; i++) {
        var x = center[0] + rx * cosines[i];
        var y = center[1] + ry * sines[i];
        vertices.push([x, y]);
    }
    //first and last vertex must be the same
    vertices.push(vertices[0]);
    return polygon([vertices]);
}

//Center should be [x, y]
function hexTriangles(center, rx, ry) {
    var triangles = [];
    for (var i = 0; i < 6; i++) {
        var vertices = [];
        vertices.push(center);
        vertices.push([
            center[0] + rx * cosines[i],
            center[1] + ry * sines[i]
        ]);
        vertices.push([
            center[0] + rx * cosines[(i + 1) % 6],
            center[1] + ry * sines[(i + 1) % 6]
        ]);
        vertices.push(center);
        triangles.push(polygon([vertices]));
    }
    return triangles;
}
