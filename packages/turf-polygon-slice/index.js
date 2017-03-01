var helpers = require('@turf/helpers');
var coordEach = require('@turf/meta').coordEach;
var pointOnLine = require('@turf/point-on-line');
// var lineSlice = require('@turf/line-slice');
var inside = require('@turf/inside');

/**
 * Takes a {@link Polygon} and cuts it with a {@link Linestring}. Note the linestring must be a straight line (eg made of only two points).
 * Properties from the input polygon will be retained on output polygons. Internally uses [polyK](http://polyk.ivank.net/) to perform slice.
 *
 * @name polygonSlice
 * @param {Feature<Polygon>} polygon single Polygon Feature
 * @param {Feature<LineString>} linestring single LineString Feature
 * @param {boolean} [debug=false] Debug setting
 * @returns {FeatureCollection<Polygon>} FeatureCollection of Polygons
 * @example
 * var polygon = {
 *   "geometry": {
 *     "type": "Polygon",
 *     "coordinates": [[
 *         [0, 0],
 *         [0, 10],
 *         [10, 10],
 *         [10, 0],
 *         [0, 0]
 *     ]]
 *   }
 * };
 *
 * var linestring =  {
 *     "type": "Feature",
 *     "properties": {},
 *     "geometry": {
 *       "type": "LineString",
 *       "coordinates": [
 *         [5, 15],
 *         [5, -15]
 *       ]
 *     }
 *   }
 *
 * var sliced = turf.slice(polygon, linestring);
 *
 * //=sliced
*/
module.exports = function polygonSlice(polygon, linestring, debug) {
    polygon = JSON.parse(JSON.stringify(polygon));
    linestring = JSON.parse(JSON.stringify(linestring));

    var outer = polygonToLineString(polygon, 0);
    // var inner = polygonToLineString(polygon, 1);

    var startLineSegment = lineInsidePolygonSegment(linestring, polygon);
    var endLineSegment = lineInsidePolygonSegment(linestring, polygon, true);

    // Line not inside polygon
    if (startLineSegment === undefined || endLineSegment === undefined) {
        if (debug) {
            return helpers.featureCollection([
                outer,
                linestring
            ]);
        }
        return helpers.featureCollection([polygon]);
    }

    // Find Polygon Segements
    var startPolySegment = closestSegment(outer, startLineSegment);
    var endPolySegment = closestSegment(outer, endLineSegment);

    // Find interseting points
    var startIntersect = intersects(startPolySegment, startLineSegment);
    var endIntersect = intersects(endPolySegment, endLineSegment);

    // Linestring could not split polygon - Start or End are the same
    // Linestring must overlap completely polygon
    if (JSON.stringify(startIntersect.geometry.coordinates) === JSON.stringify(endIntersect.geometry.coordinates)) {
        if (debug) {
            return helpers.featureCollection([
                outer,
                linestring,
                startLineSegment,
                endLineSegment,
                startPolySegment,
                endPolySegment,
                startIntersect,
                endIntersect,
            ]);
        }
        return helpers.featureCollection([polygon]);
    }

    // Line Slice
    var outer1 = lineSlice(startIntersect, endIntersect, outer);
    var outer2 = lineSlice(startIntersect, endIntersect, outer, true);
    var outerIntersect = lineSlice(startIntersect, endIntersect, linestring);

    // Merge outers
    var merged1 = convertLinestoPolygon(outer1, outerIntersect);
    var merged2 = convertLinestoPolygon(outer2, outerIntersect);

    if (debug) {
        outer2.properties['stroke'] = '#f00';
        merged1.properties['fill'] = '#ff0';
        merged1.properties['fill-opacity'] = 0.3;
        merged2.properties['fill'] = '#f00';
        merged2.properties['fill-opacity'] = 0.3;
        outerIntersect.properties['stroke'] = '#008000';
        outerIntersect.properties['stroke-width'] = 14;
        return helpers.featureCollection([
            merged1,
            merged2,
            outer,
            outer1,
            outer2,
            outerIntersect,
            linestring,
            startLineSegment,
            endLineSegment,
            startPolySegment,
            endPolySegment,
            startIntersect,
            endIntersect,
        ]);
    }
    return helpers.featureCollection([merged1, merged2]);
};

/**
 * Merge Linestrings into Polygon - Lines must touch
 *
 * @param {Feature<LineString>} line1 GeoJSON LineString
 * @param {Feature<LineString>} line2 GeoJSON LineString
 * @returns {Feature<Polygon>} GeoJSON Polygon
 */
function convertLinestoPolygon(line1, line2) {
    // Reverse lines
    if (line1.geometry.coordinates[0] === line2.geometry.coordinates[0]) {
        line1.geometry.coordinates = line1.geometry.coordinates.reverse();
    }
    var coords = [];
    line1.geometry.coordinates.forEach(function (coord) { coords.push(coord); });
    line2.geometry.coordinates.slice(1).forEach(function (coord) { coords.push(coord); });
    return helpers.polygon([coords]);
}

/**
 * Finds the closest 2 coordinate segement from two linestrings
 *
 * @param {Feature<LineString>} source GeoJSON LineString
 * @param {Feature<LineString>} target GeoJSON LineString
 * @returns {Feature<LineString>} LineString with 2 coordinates
 */
function closestSegment(source, target) {
    // Remove last coordinate since it should be the same as the first
    var coordinates = source.geometry.coordinates.slice(0, -1);
    var index = {};
    var closest;
    var closestDistance;
    var closestIndex = 0;
    for (var i = 0; i < coordinates.length; i++) {
        var coords = coordinates[i];
        var point = helpers.point(coords);
        var onLine = pointOnLine(target, point);
        index[i] = onLine;
        if (i === 0) {
            closestDistance = onLine.properties.dist;
            closest = point.geometry.coordinates;
        } else if (onLine.properties.dist < closestDistance) {
            closestDistance = onLine.properties.dist;
            closest = point.geometry.coordinates;
            closestIndex = i;
        }
    }
    // Find the second closest by calculating the distance of before & after
    var before = (closestIndex - 1 < 0) ? coordinates.length - 1 : closestIndex - 1;
    var after = (closestIndex + 1 > coordinates.length) ? 0 : closestIndex + 1;
    var closestSecond = (index[before].properties.dist < index[after].properties.dist) ? coordinates[before] : coordinates[after];

    var linestring = helpers.lineString([closestSecond, closest]);
    linestring.properties['stroke'] = '#000';
    linestring.properties['stroke-width'] = 6;
    return linestring;
}

/**
 * Finds the first 2 coordinate segment that is inside the polygon
 *
* @param {Feature<LineString>} linestring GeoJSON LineString
 * @param {Feature<Polygon>} polygon GeoJSON Polygon
 * @param {boolean} [reverse=false] Reverse linestring coordinates
 * @returns {Feature<LineString>} 2 coordinate LineString
 */
function lineInsidePolygonSegment(linestring, polygon, reverse) {
    var coordinates = linestring.geometry.coordinates;
    if (reverse) { coordinates.reverse(); }

    var polygonIndex = coordinateIndex(polygon);
    var isOutside;
    var outsideIndex;
    var isInside;
    var insideIndex;

    for (var i = 0; i < coordinates.length; i++) {
        var coords = coordinates[i];
        var point = helpers.point(coords);
        if (!inside(point, polygon) || polygonIndex[coords]) {
            isOutside = true;
            outsideIndex = i;
        } else {
            isInside = true;
            insideIndex = i;
        }
        if (isOutside === true && isInside === true) {
            linestring = helpers.lineString([coordinates[outsideIndex], coordinates[insideIndex]]);
            linestring.properties['stroke'] = '#00f';
            linestring.properties['stroke-width'] = 6;
            return linestring;
        }
    }
}

/**
 * Builds a unique index of the GeoJSON coordinates, used to detect if point is a touching line
 *
 * @param {GeoJSON<any>} geojson GeoJSON Feature/FeatureCollection
 * @returns {Object} Pairs of coordinates in a dictionary
 * @example
 * {
 *   '130.341796875,-10.40137755454354': true,
 *   '120.05859375,-13.496472765758952': true,
 *   '110.21484375,-21.043491216803528': true,
 *   ...
 * }
 */
function coordinateIndex(geojson) {
    var index = {};
    coordEach(geojson, function (coords) { index[coords] = true; });
    return index;
}

/**
 * Convert Polygon to LineString
 *
 * @param {Feature<Polygon>} polygon GeoJSON Polygon
 * @param {number} [position=0] Used to get outer & inner coordinate position
 * @returns {Feature<LineString>} GeoJSON linestring
 */
function polygonToLineString(polygon, position) {
    position = position || 0;
    var coords = polygon.geometry.coordinates;
    var linestring = coords.length > position ? helpers.lineString(coords[position], polygon.properties) : undefined;
    return linestring;
}


/**
 * Find a point that intersects two linestring
 *
 * @param {Feature<LineString>} line1 GeoJSON LineString - Point must be on this line (Must only have 2 segments)
 * @param {Feature<LineString>} line2 GeoJSON LineString (Must only have 2 segments)
 * @returns {Feature<Point>} intersecting GeoJSON Point
 */
function intersects(line1, line2) {
    var x1 = line1.geometry.coordinates[0][0];
    var y1 = line1.geometry.coordinates[0][1];
    var x2 = line1.geometry.coordinates[1][0];
    var y2 = line1.geometry.coordinates[1][1];
    var x3 = line2.geometry.coordinates[0][0];
    var y3 = line2.geometry.coordinates[0][1];
    var x4 = line2.geometry.coordinates[1][0];
    var y4 = line2.geometry.coordinates[1][1];
    var denom = ((y4 - y3) * (x2 - x1)) - ((x4 - x3) * (y2 - y1));
    var numeA = ((x4 - x3) * (y1 - y3)) - ((y4 - y3) * (x1 - x3));
    var numeB = ((x2 - x1) * (y1 - y3)) - ((y2 - y1) * (x1 - x3));

    if (denom === 0) {
        if (numeA === 0 && numeB === 0) {
            return null;
        }
        return null;
    }

    var uA = numeA / denom;
    var uB = numeB / denom;

    if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
        var x = x1 + (uA * (x2 - x1));
        var y = y1 + (uA * (y2 - y1));
        var point = helpers.point([x, y]);
        return point;
    }
    return null;
}

function lineSlice(startPt, stopPt, line, reverse) {
    var coords;
    if (line.type === 'Feature') {
        coords = line.geometry.coordinates;
    } else if (line.type === 'LineString') {
        coords = line.coordinates;
    } else {
        throw new Error('input must be a LineString Feature or Geometry');
    }
    //** Extra - allows reverse
    if (reverse) {
        coords = coords.reverse();
    }
    var startVertex = pointOnLine(line, startPt);
    var stopVertex = pointOnLine(line, stopPt);
    var ends;
    if (startVertex.properties.index <= stopVertex.properties.index) {
        ends = [startVertex, stopVertex];
    } else {
        ends = [stopVertex, startVertex];
    }
    if (reverse) {
        coords = coords.reverse();
    }

    if (reverse) {
        ends[0].properties.index = ends[0].properties.index - 1;
        ends[1].properties.index = ends[1].properties.index - 1;
    }

    var clipLine = helpers.lineString([ends[0].geometry.coordinates], {});
    for (var i = ends[0].properties.index + 1; i < ends[1].properties.index + 1; i++) {
        clipLine.geometry.coordinates.push(coords[i]);
    }
    clipLine.geometry.coordinates.push(ends[1].geometry.coordinates);

    // ** Extras for "exact" match
    if (reverse) {
        clipLine.geometry.coordinates[0] = startPt.geometry.coordinates;
        clipLine.geometry.coordinates[clipLine.geometry.coordinates.length - 1] = stopPt.geometry.coordinates;
    } else {
        clipLine.geometry.coordinates[0] = stopPt.geometry.coordinates;
        clipLine.geometry.coordinates[clipLine.geometry.coordinates.length - 1] = startPt.geometry.coordinates;
    }
    clipLine.properties['stroke'] = '#ff0';
    clipLine.properties['stroke-width'] = 13;
    return clipLine;
}
