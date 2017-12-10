import distance from '@turf/distance';
import intersect from '@turf/intersect';
import {getType} from '@turf/invariant';
import {polygon, featureCollection, isObject, isNumber} from '@turf/helpers';

/**
 * Takes a bounding box and the diameter of the cell and returns a {@link FeatureCollection} of flat-topped
 * hexagons or triangles ({@link Polygon} features) aligned in an "odd-q" vertical grid as
 * described in [Hexagonal Grids](http://www.redblobgames.com/grids/hexagons/).
 *
 * @name hexGrid
 * @param {BBox} bbox extent in [minX, minY, maxX, maxY] order
 * @param {number} cellSide length of the side of the the hexagons or triangles, in units. It will also coincide with the
 * radius of the circumcircle of the hexagons.
 * @param {Object} [options={}] Optional parameters
 * @param {string} [options.units='kilometers'] used in calculating cell size, can be degrees, radians, miles, or kilometers
 * @param {Object} [options.properties={}] passed to each hexagon or triangle of the grid
 * @param {Feature<Polygon|MultiPolygon>} [options.mask] if passed a Polygon or MultiPolygon, the grid Points will be created only inside it
 * @param {boolean} [options.triangles=false] whether to return as triangles instead of hexagons
 * @returns {FeatureCollection<Polygon>} a hexagonal grid
 * @example
 * var bbox = [-96,31,-84,40];
 * var cellSide = 50;
 * var options = {units: 'miles'};
 *
 * var hexgrid = turf.hexGrid(bbox, cellSide, options);
 *
 * //addToMap
 * var addToMap = [hexgrid];
 */
function hexGrid(bbox, cellSide, options) {
    // Optional parameters
    options = options || {};
    if (!isObject(options)) throw new Error('options is invalid');
    // var units = options.units;
    var properties = options.properties || {};
    var triangles = options.triangles;
    var mask = options.mask;

    // validation
    if (cellSide === null || cellSide === undefined) throw new Error('cellSide is required');
    if (!isNumber(cellSide)) throw new Error('cellSide is invalid');
    if (!bbox) throw new Error('bbox is required');
    if (!Array.isArray(bbox)) throw new Error('bbox must be array');
    if (bbox.length !== 4) throw new Error('bbox must contain 4 numbers');
    if (mask && ['Polygon', 'MultiPolygon'].indexOf(getType(mask)) === -1) throw new Error('options.mask must be a (Multi)Polygon');

    var west = bbox[0];
    var south = bbox[1];
    var east = bbox[2];
    var north = bbox[3];
    var centerY = (south + north) / 2;
    var centerX = (west + east) / 2;

    // https://github.com/Turfjs/turf/issues/758
    var xFraction = cellSide * 2 / (distance([west, centerY], [east, centerY], options));
    var cellWidth = xFraction * (east - west);
    var yFraction = cellSide * 2 / (distance([centerX, south], [centerX, north], options));
    var cellHeight = yFraction * (north - south);
    var radius = cellWidth / 2;

    var hex_width = radius * 2;
    var hex_height = Math.sqrt(3) / 2 * cellHeight;

    var box_width = east - west;
    var box_height = north - south;

    var x_interval = 3 / 4 * hex_width;
    var y_interval = hex_height;

    // adjust box_width so all hexagons will be inside the bbox
    var x_span = (box_width - hex_width) / (hex_width - radius / 2);
    var x_count = Math.floor(x_span);

    var x_adjust = ((x_count * x_interval - radius / 2) - box_width) / 2 - radius / 2 + x_interval / 2;

    // adjust box_height so all hexagons will be inside the bbox
    var y_count = Math.floor((box_height - hex_height) / hex_height);

    var y_adjust = (box_height - y_count * hex_height) / 2;

    var hasOffsetY = y_count * hex_height - box_height > hex_height / 2;
    if (hasOffsetY) {
        y_adjust -= hex_height / 4;
    }

    // Precompute cosines and sines of angles used in hexagon creation for performance gain
    var cosines = [];
    var sines = [];
    for (var i = 0; i < 6; i++) {
        var angle = 2 * Math.PI / 6 * i;
        cosines.push(Math.cos(angle));
        sines.push(Math.sin(angle));
    }

    var results = [];
    for (var x = 0; x <= x_count; x++) {
        for (var y = 0; y <= y_count; y++) {

            var isOdd = x % 2 === 1;
            if (y === 0 && isOdd) continue;
            if (y === 0 && hasOffsetY) continue;

            var center_x = x * x_interval + west - x_adjust;
            var center_y = y * y_interval + south + y_adjust;

            if (isOdd) {
                center_y -= hex_height / 2;
            }

            if (triangles === true) {
                hexTriangles(
                    [center_x, center_y],
                    cellWidth / 2,
                    cellHeight / 2,
                    properties,
                    cosines,
                    sines).forEach(function (triangle) {
                    if (mask) {
                        if (intersect(mask, triangle)) results.push(triangle);
                    } else {
                        results.push(triangle);
                    }
                });
            } else {
                var hex = hexagon(
                    [center_x, center_y],
                    cellWidth / 2,
                    cellHeight / 2,
                    properties,
                    cosines,
                    sines
                );
                if (mask) {
                    if (intersect(mask, hex)) results.push(hex);
                } else {
                    results.push(hex);
                }
            }
        }
    }

    return featureCollection(results);
}

/**
 * Creates hexagon
 *
 * @private
 * @param {Array<number>} center of the hexagon
 * @param {number} rx half hexagon width
 * @param {number} ry half hexagon height
 * @param {Object} properties passed to each hexagon
 * @param {Array<number>} cosines precomputed
 * @param {Array<number>} sines precomputed
 * @returns {Feature<Polygon>} hexagon
 */
function hexagon(center, rx, ry, properties, cosines, sines) {
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

/**
 * Creates triangles composing an hexagon
 *
 * @private
 * @param {Array<number>} center of the hexagon
 * @param {number} rx half triangle width
 * @param {number} ry half triangle height
 * @param {Object} properties passed to each triangle
 * @param {Array<number>} cosines precomputed
 * @param {Array<number>} sines precomputed
 * @returns {Array<Feature<Polygon>>} triangles
 */
function hexTriangles(center, rx, ry, properties, cosines, sines) {
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
