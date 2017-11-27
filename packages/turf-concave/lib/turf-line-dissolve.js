import clone from '@turf/clone';
import { getType } from '@turf/invariant';
import { lineReduce } from '@turf/meta';
import { isObject, multiLineString, lineString } from '@turf/helpers';

/**
 * Merges all connected (non-forking, non-junctioning) line strings into single lineStrings.
 * [LineString] -> LineString|MultiLineString
 *
 * @param {FeatureCollection<LineString|MultiLineString>} geojson Lines to dissolve
 * @param {Object} [options={}] Optional parameters
 * @param {boolean} [options.mutate=false] Prevent input mutation
 * @returns {Feature<LineString|MultiLineString>} Dissolved lines
 */
function lineDissolve(geojson, options) {
    // Optional parameters
    options = options || {};
    if (!isObject(options)) throw new Error('options is invalid');
    var mutate = options.mutate;

    // Validation
    if (getType(geojson) !== 'FeatureCollection') throw new Error('geojson must be a FeatureCollection');
    if (!geojson.features.length) throw new Error('geojson is empty');

    // Clone geojson to avoid side effects
    if (mutate === false || mutate === undefined) geojson = clone(geojson);

    var result = [];
    var lastLine = lineReduce(geojson, function (previousLine, currentLine) {
        // Attempt to merge this LineString with the other LineStrings, updating
        // the reference as it is merged with others and grows.
        var merged = mergeLineStrings(previousLine, currentLine);

        // Accumulate the merged LineString
        if (merged) return merged;

        // Put the unmerged LineString back into the list
        else {
            result.push(previousLine);
            return currentLine;
        }
    });
    // Append the last line
    if (lastLine) result.push(lastLine);

    // Return null if no lines were dissolved
    if (!result.length) return null;
    // Return LineString if only 1 line was dissolved
    else if (result.length === 1) return result[0];
    // Return MultiLineString if multiple lines were dissolved with gaps
    else return multiLineString(result.map(function (line) { return line.coordinates; }));
}

// [Number, Number] -> String
function coordId(coord) {
    return coord[0].toString() + ',' + coord[1].toString();
}

/**
 * LineString, LineString -> LineString
 *
 * @private
 * @param {Feature<LineString>} a line1
 * @param {Feature<LineString>} b line2
 * @returns {Feature<LineString>|null} Merged LineString
 */
function mergeLineStrings(a, b) {
    var coords1 = a.geometry.coordinates;
    var coords2 = b.geometry.coordinates;

    var s1 = coordId(coords1[0]);
    var e1 = coordId(coords1[coords1.length - 1]);
    var s2 = coordId(coords2[0]);
    var e2 = coordId(coords2[coords2.length - 1]);

    // TODO: handle case where more than one of these is true!
    var coords;
    if (s1 === e2) coords = coords2.concat(coords1.slice(1));
    else if (s2 === e1) coords = coords1.concat(coords2.slice(1));
    else if (s1 === s2) coords = coords1.slice(1).reverse().concat(coords2);
    else if (e1 === e2) coords = coords1.concat(coords2.reverse().slice(1));
    else return null;

    return lineString(coords);
}

export default lineDissolve;
