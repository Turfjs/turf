import { coordEach } from '@turf/meta';

/**
 * Takes a set of features, calculates the bbox of all input features, and returns a bounding box.
 *
 * @name bbox
 * @param {GeoJSON} geojson any GeoJSON object
 * @returns {BBox} bbox extent in [minX, minY, maxX, maxY] order
 * @example
 * var line = turf.lineString([[-74, 40], [-78, 42], [-82, 35]]);
 * var bbox = turf.bbox(line);
 * var bboxPolygon = turf.bboxPolygon(bbox);
 *
 * //addToMap
 * var addToMap = [line, bboxPolygon]
 */
function bbox(geojson) {
    var BBox = [Infinity, Infinity, -Infinity, -Infinity];
    coordEach(geojson, function (coord) {
        if (BBox[0] > coord[0]) BBox[0] = coord[0];
        if (BBox[1] > coord[1]) BBox[1] = coord[1];
        if (BBox[2] < coord[0]) BBox[2] = coord[0];
        if (BBox[3] < coord[1]) BBox[3] = coord[1];
    });
    return BBox;
}

export default bbox;
