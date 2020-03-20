import { BBox } from "@turf/helpers";
import { coordEach } from "@turf/meta";

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
export default function bbox(geojson: any): BBox {
    const result: BBox = [Infinity, Infinity, -Infinity, -Infinity];
    coordEach(geojson, (coord) => {
        if (result[0] > coord[0]) { result[0] = coord[0]; }
        if (result[1] > coord[1]) { result[1] = coord[1]; }
        if (result[2] < coord[0]) { result[2] = coord[0]; }
        if (result[3] < coord[1]) { result[3] = coord[1]; }
    });
    return result;
}
