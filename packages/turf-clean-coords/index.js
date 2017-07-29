/**
 * Removes redundant coordinates from a (Multi)LineString or (Multi)Polygon; ignores (Multi)Point.
 *
 * @name cleanCoords
 * @param {Geometry|Feature<any>} geojson Feature or Geometry
 * @param {boolean} [mutate=false] allows GeoJSON input to be mutated
 * @returns {Geometry|Feature<any>} the cleaned input Feature/Geometry
 * @example
 * var line = trf.lineString([[0, 0], [0, 2], [0, 5], [0, 8], [0, 8], [0, 10]]);
 *
 * var cleaned = turf.cleanCoords(line).geometry.coordinates;
 * //= [[0, 0], [0, 10]]
 */
module.exports = function (geojson, mutate) {


    var prevPoint = points[0],
        newPoints = [prevPoint],
        point;

    for (var i = 1, len = points.length; i < len; i++) {
        point = points[i];

        if (getSqDist(point, prevPoint) > sqTolerance) {
            newPoints.push(point);
            prevPoint = point;
        }
    }

    if (prevPoint !== point) newPoints.push(point);

    return newPoints;


    return cleaned;
};
