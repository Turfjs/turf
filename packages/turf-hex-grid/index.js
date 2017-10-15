import distance from '@turf/distance';
import turfBBox from '@turf/bbox';
import { point, polygon, featureCollection, isObject, isNumber } from '@turf/helpers';

// Precompute cosines and sines of angles used in hexagon creation
// for performance gain
var cosines = [];
var sines = [];
for (var i = 0; i < 6; i++) {
    var angle = 2 * Math.PI / 6 * i;
    cosines.push(Math.cos(angle));
    sines.push(Math.sin(angle));
}

/**
 * Takes a bounding box and the diameter of the cell and returns a {@link FeatureCollection} of flat-topped
 * hexagons or triangles ({@link Polygon} features) aligned in an "odd-q" vertical grid as
 * described in [Hexagonal Grids](http://www.redblobgames.com/grids/hexagons/).
 *
 * @name hexGrid
 * @param {Array<number>|FeatureCollection|Feature<any>} bbox extent in [minX, minY, maxX, maxY] order
 * @param {number} cellSide length of the side of the the hexagons or triangles, in units. It will also coincide with the radius of the circumcircle of the hexagons.
 * @param {Object} [options={}] Optional parameters
 * @param {string} [options.units='kilometers'] used in calculating cell size, can be degrees, radians, miles, or kilometers
 * @param {Object} [options.properties={}] passed to each hexagon or triangle of the grid
 * @param {boolean} [options.triangles=false] whether to return as triangles instead of hexagons
 * @returns {FeatureCollection<Polygon>} a hexagonal grid
 * @example
 * var bbox = [-96,31,-84,40];
 * var cellSide = 50;
 *
 * var hexgrid = turf.hexGrid(bbox, cellSide, {units: 'miles'});
 *
 * //addToMap
 * var addToMap = [hexgrid];
 */
function hexGrid(bbox, cellSide, options) {
    // Optional parameters
    options = options || {};
    if (!isObject(options)) throw new Error('options is invalid');
    var units = options.units;
    var properties = options.properties || {};
    var triangles = options.triangles;

    // validation
    if (cellSide === null || cellSide === undefined) throw new Error('cellSide is required');
    if (!isNumber(cellSide)) throw new Error('cellSide is invalid');
    if (!bbox) throw new Error('bbox is required');
    if (!Array.isArray(bbox)) bbox = turfBBox(bbox); // Convert GeoJSON to bbox
    if (bbox.length !== 4) throw new Error('bbox must contain 4 numbers');

    var west = bbox[0];
    var south = bbox[1];
    var east = bbox[2];
    var north = bbox[3];
    var centerY = (south + north) / 2;
    var centerX = (west + east) / 2;

    // https://github.com/Turfjs/turf/issues/758
    var xFraction = cellSide * 2 / (distance(point([west, centerY]), point([east, centerY]), units));
    var cellWidth = xFraction * (east - west);
    var yFraction = cellSide * 2 / (distance(point([centerX, south]), point([centerX, north]), units));
    var cellHeight = yFraction * (north - south);
    var radius = cellWidth / 2;

    var hex_width = radius * 2;
    var hex_height = Math.sqrt(3) / 2 * cellHeight;

    var box_width = east - west;
    var box_height = north - south;

    var x_interval = 3 / 4 * hex_width;
    var y_interval = hex_height;

    var x_span = box_width / (hex_width - radius / 2);
    var x_count = Math.floor(x_span);
    if (Math.round(x_span) === x_count) {
        x_count++;
    }

    var x_adjust = ((x_count * x_interval - radius / 2) - box_width) / 2 - radius / 2;

    var y_count = Math.floor(box_height / hex_height);

    var y_adjust = (box_height - y_count * hex_height) / 2;

    var hasOffsetY = y_count * hex_height - box_height > hex_height / 2;
    if (hasOffsetY) {
        y_adjust -= hex_height / 4;
    }

    var fc = featureCollection([]);
    for (var x = 0; x < x_count; x++) {
        for (var y = 0; y <= y_count; y++) {

            var isOdd = x % 2 === 1;
            if (y === 0 && isOdd) continue;
            if (y === 0 && hasOffsetY) continue;

            var center_x = x * x_interval + west - x_adjust;
            var center_y = y * y_interval + south + y_adjust;

            if (isOdd) {
                center_y -= hex_height / 2;
            }
            if (triangles) {
                fc.features.push.apply(fc.features, hexTriangles([center_x, center_y], cellWidth / 2, cellHeight / 2, properties));
            } else {
                fc.features.push(hexagon([center_x, center_y], cellWidth / 2, cellHeight / 2, properties));
            }
        }
    }

    return fc;
}

//Center should be [x, y]
function hexagon(center, rx, ry, properties) {
    var vertices = [];
    for (var i = 0; i < 6; i++) {
        var x = center[0] + rx * cosines[i];
        var y = center[1] + ry * sines[i];
        vertices.push([x, y]);
    }
    //first and last vertex must be the same
    vertices.push(vertices[0].slice());
    return polygon([vertices], properties);
}

//Center should be [x, y]
function hexTriangles(center, rx, ry, properties) {
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
        triangles.push(polygon([vertices], properties));
    }
    return triangles;
}

export default hexGrid;
