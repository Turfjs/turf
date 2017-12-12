import {
    point,
    lineString,
    polygon,
    featureCollection,
    isObject,
    isNumber
} from '@turf/helpers';

/**
 * Returns a random position within a {@link bounding box}.
 *
 * @name randomPosition
 * @param {Array<number>} [bbox=[-180, -90, 180, 90]] a bounding box inside of which positions are placed.
 * @returns {Array<number>} Position [longitude, latitude]
 * @example
 * var position = turf.randomPosition([-180, -90, 180, 90])
 * //=position
 */
export function randomPosition(bbox) {
    if (isObject(bbox)) bbox = bbox.bbox;
    if (bbox && !Array.isArray(bbox)) throw new Error('bbox is invalid');
    if (bbox) return coordInBBox(bbox);
    else return [lon(), lat()];
}

/**
 * Returns a random {@link point}.
 *
 * @name randomPoint
 * @param {number} [count=1] how many geometries will be generated
 * @param {Object} [options={}] Optional parameters
 * @param {Array<number>} [options.bbox=[-180, -90, 180, 90]] a bounding box inside of which geometries are placed.
 * @returns {FeatureCollection<Point>} GeoJSON FeatureCollection of points
 * @example
 * var points = turf.randomPoint(25, {bbox: [-180, -90, 180, 90]})
 * //=points
 */
export function randomPoint(count, options) {
    // Optional parameters
    options = options || {};
    if (!isObject(options)) throw new Error('options is invalid');
    var bbox = options.bbox;
    if (count === undefined || count === null) count = 1;

    var features = [];
    for (var i = 0; i < count; i++) {
        features.push(point(randomPosition(bbox)));
    }
    return featureCollection(features);
}

/**
 * Returns a random {@link polygon}.
 *
 * @name randomPolygon
 * @param {number} [count=1] how many geometries will be generated
 * @param {Object} [options={}] Optional parameters
 * @param {Array<number>} [options.bbox=[-180, -90, 180, 90]] a bounding box inside of which geometries are placed.
 * @param {number} [options.num_vertices=10] is how many coordinates each LineString will contain.
 * @param {number} [options.max_radial_length=10] is the maximum number of decimal degrees latitude or longitude that a vertex can reach out of the center of the Polygon.
 * @returns {FeatureCollection<Point>} GeoJSON FeatureCollection of points
 * @example
 * var polygons = turf.randomPolygon(25, {bbox: [-180, -90, 180, 90]})
 * //=polygons
 */
export function randomPolygon(count, options) {
    // Optional parameters
    options = options || {};
    if (!isObject(options)) throw new Error('options is invalid');
    var bbox = options.bbox;
    var num_vertices = options.num_vertices;
    var max_radial_length = options.max_radial_length;
    if (count === undefined || count === null) count = 1;

    // Validation
    if (!isNumber(num_vertices)) num_vertices = 10;
    if (!isNumber(max_radial_length)) max_radial_length = 10;

    var features = [];
    for (var i = 0; i < count; i++) {
        var vertices = [],
            circle_offsets = Array.apply(null,
                new Array(num_vertices + 1)).map(Math.random);

        circle_offsets.forEach(sumOffsets);
        circle_offsets.forEach(scaleOffsets);
        vertices[vertices.length - 1] = vertices[0]; // close the ring

        // center the polygon around something
        vertices = vertices.map(vertexToCoordinate(randomPosition(bbox)));
        features.push(polygon([vertices]));
    }

    function sumOffsets(cur, index, arr) {
        arr[index] = (index > 0) ? cur + arr[index - 1] : cur;
    }

    function scaleOffsets(cur) {
        cur = cur * 2 * Math.PI / circle_offsets[circle_offsets.length - 1];
        var radial_scaler = Math.random();
        vertices.push([
            radial_scaler * max_radial_length * Math.sin(cur),
            radial_scaler * max_radial_length * Math.cos(cur)
        ]);
    }

    return featureCollection(features);
}

/**
 * Returns a random {@link linestring}.
 *
 * @name randomLineString
 * @param {number} [count=1] how many geometries will be generated
 * @param {Object} [options={}] Optional parameters
 * @param {Array<number>} [options.bbox=[-180, -90, 180, 90]] a bounding box inside of which geometries are placed.
 * @param {number} [options.num_vertices=10] is how many coordinates each LineString will contain.
 * @param {number} [options.max_length=0.0001] is the maximum number of decimal degrees that a vertex can be from its predecessor
 * @param {number} [options.max_rotation=Math.PI / 8] is the maximum number of radians that a line segment can turn from the previous segment.
 * @returns {FeatureCollection<Point>} GeoJSON FeatureCollection of points
 * @example
 * var lineStrings = turf.randomLineString(25, {bbox: [-180, -90, 180, 90]})
 * //=lineStrings
 */
export function randomLineString(count, options) {
    // Optional parameters
    options = options || {};
    if (!isObject(options)) throw new Error('options is invalid');
    var bbox = options.bbox;
    var num_vertices = options.num_vertices;
    var max_length = options.max_length;
    var max_rotation = options.max_rotation;
    if (count === undefined || count === null) count = 1;

    // Default parameters
    if (!isNumber(num_vertices) || num_vertices < 2) num_vertices = 10;
    if (!isNumber(max_length)) max_length = 0.0001;
    if (!isNumber(max_rotation)) max_rotation = Math.PI / 8;

    var features = [];
    for (var i = 0; i < count; i++) {
        var startingPoint = randomPosition(bbox);
        var vertices = [startingPoint];
        for (var j = 0; j < num_vertices - 1; j++) {
            var priorAngle = (j === 0) ?
                Math.random() * 2 * Math.PI :
                Math.tan(
                    (vertices[j][1] - vertices[j - 1][1]) /
              (vertices[j][0] - vertices[j - 1][0])
                );
            var angle = priorAngle + (Math.random() - 0.5) * max_rotation * 2;
            var distance = Math.random() * max_length;
            vertices.push([
                vertices[j][0] + distance * Math.cos(angle),
                vertices[j][1] + distance * Math.sin(angle)
            ]);
        }
        features.push(lineString(vertices));
    }

    return featureCollection(features);
}

function vertexToCoordinate(hub) {
    return function (cur) { return [cur[0] + hub[0], cur[1] + hub[1]]; };
}

function rnd() { return Math.random() - 0.5; }
function lon() { return rnd() * 360; }
function lat() { return rnd() * 180; }

function coordInBBox(bbox) {
    return [
        (Math.random() * (bbox[2] - bbox[0])) + bbox[0],
        (Math.random() * (bbox[3] - bbox[1])) + bbox[1]];
}
