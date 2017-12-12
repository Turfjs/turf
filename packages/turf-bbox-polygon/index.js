import { polygon, validateBBox } from '@turf/helpers';

/**
 * Takes a bbox and returns an equivalent {@link Polygon|polygon}.
 *
 * @name bboxPolygon
 * @param {BBox} bbox extent in [minX, minY, maxX, maxY] order
 * @returns {Feature<Polygon>} a Polygon representation of the bounding box
 * @example
 * var bbox = [0, 0, 10, 10];
 *
 * var poly = turf.bboxPolygon(bbox);
 *
 * //addToMap
 * var addToMap = [poly]
 */
function bboxPolygon(bbox) {
    validateBBox(bbox);
    // Convert BBox positions to Numbers
    // No performance loss for including Number()
    // https://github.com/Turfjs/turf/issues/1119
    var west = Number(bbox[0]);
    var south = Number(bbox[1]);
    var east = Number(bbox[2]);
    var north = Number(bbox[3]);

    if (bbox.length === 6) throw new Error('@turf/bbox-polygon does not support BBox with 6 positions');

    var lowLeft = [west, south];
    var topLeft = [west, north];
    var topRight = [east, north];
    var lowRight = [east, south];

    return polygon([[
        lowLeft,
        lowRight,
        topRight,
        topLeft,
        lowLeft
    ]]);
}

export default bboxPolygon;
