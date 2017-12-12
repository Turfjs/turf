// Find self-intersections in geojson polygon (possibly with interior rings)
import rbush from 'rbush';

export default function (feature, filterFn, useSpatialIndex) {
    if (feature.geometry.type !== 'Polygon') throw new Error('The input feature must be a Polygon');
    if (useSpatialIndex === undefined) useSpatialIndex = 1;

    var coord = feature.geometry.coordinates;

    var output = [];
    var seen = {};

    if (useSpatialIndex) {
        var allEdgesAsRbushTreeItems = [];
        for (var ring0 = 0; ring0 < coord.length; ring0++) {
            for (var edge0 = 0; edge0 < coord[ring0].length - 1; edge0++) {
                allEdgesAsRbushTreeItems.push(rbushTreeItem(ring0, edge0));
            }
        }
        var tree = rbush();
        tree.load(allEdgesAsRbushTreeItems);
    }

    for (var ringA = 0; ringA < coord.length; ringA++) {
        for (var edgeA = 0; edgeA < coord[ringA].length - 1; edgeA++) {
            if (useSpatialIndex) {
                var bboxOverlaps = tree.search(rbushTreeItem(ringA, edgeA));
                bboxOverlaps.forEach(function (bboxIsect) {
                    var ring1 = bboxIsect.ring;
                    var edge1 = bboxIsect.edge;
                    ifIsectAddToOutput(ringA, edgeA, ring1, edge1);
                });
            } else {
                for (var ring1 = 0; ring1 < coord.length; ring1++) {
                    for (var edge1 = 0; edge1 < coord[ring1].length - 1; edge1++) {
                        // TODO: speedup possible if only interested in unique: start last two loops at ringA and edgeA+1
                        ifIsectAddToOutput(ringA, edgeA, ring1, edge1);
                    }
                }
            }
        }
    }

    if (!filterFn) output = {type: 'Feature', geometry: {type: 'MultiPoint', coordinates: output}};
    return output;

    // Function to check if two edges intersect and add the intersection to the output
    function ifIsectAddToOutput(ring0, edge0, ring1, edge1) {
        var start0 = coord[ring0][edge0];
        var end0 = coord[ring0][edge0 + 1];
        var start1 = coord[ring1][edge1];
        var end1 = coord[ring1][edge1 + 1];

        var isect = intersect(start0, end0, start1, end1);

        if (isect === null) return; // discard parallels and coincidence
        var frac0;
        var frac1;
        if (end0[0] !== start0[0]) {
            frac0 = (isect[0] - start0[0]) / (end0[0] - start0[0]);
        } else {
            frac0 = (isect[1] - start0[1]) / (end0[1] - start0[1]);
        }
        if (end1[0] !== start1[0]) {
            frac1 = (isect[0] - start1[0]) / (end1[0] - start1[0]);
        } else {
            frac1 = (isect[1] - start1[1]) / (end1[1] - start1[1]);
        }
        if (frac0 >= 1 || frac0 <= 0 || frac1 >= 1 || frac1 <= 0) return; // require segment intersection

        var key = isect;
        var unique = !seen[key];
        if (unique) {
            seen[key] = true;
        }

        if (filterFn) {
            output.push(filterFn(isect, ring0, edge0, start0, end0, frac0, ring1, edge1, start1, end1, frac1, unique));
        } else {
            output.push(isect);
        }
    }

    // Function to return a rbush tree item given an ring and edge number
    function rbushTreeItem(ring, edge) {

        var start = coord[ring][edge];
        var end = coord[ring][edge + 1];
        var minX;
        var maxX;
        var minY;
        var maxY;
        if (start[0] < end[0]) {
            minX = start[0];
            maxX = end[0];
        } else {
            minX = end[0];
            maxX = start[0];
        }
        if (start[1] < end[1]) {
            minY = start[1];
            maxY = end[1];
        } else {
            minY = end[1];
            maxY = start[1];
        }
        return {minX: minX, minY: minY, maxX: maxX, maxY: maxY, ring: ring, edge: edge};
    }
}

// Function to compute where two lines (not segments) intersect. From https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
function intersect(start0, end0, start1, end1) {
    if (equalArrays(start0, start1) || equalArrays(start0, end1) || equalArrays(end0, start1) || equalArrays(end1, start1)) return null;
    var x0 = start0[0],
        y0 = start0[1],
        x1 = end0[0],
        y1 = end0[1],
        x2 = start1[0],
        y2 = start1[1],
        x3 = end1[0],
        y3 = end1[1];
    var denom = (x0 - x1) * (y2 - y3) - (y0 - y1) * (x2 - x3);
    if (denom === 0) return null;
    var x4 = ((x0 * y1 - y0 * x1) * (x2 - x3) - (x0 - x1) * (x2 * y3 - y2 * x3)) / denom;
    var y4 = ((x0 * y1 - y0 * x1) * (y2 - y3) - (y0 - y1) * (x2 * y3 - y2 * x3)) / denom;
    return [x4, y4];
}

// Function to compare Arrays of numbers. From http://stackoverflow.com/questions/7837456/how-to-compare-arrays-in-javascript
function equalArrays(array1, array2) {
    // if the other array is a falsy value, return
    if (!array1 || !array2)
        return false;

    // compare lengths - can save a lot of time
    if (array1.length !== array2.length)
        return false;

    for (var i = 0, l = array1.length; i < l; i++) {
        // Check if we have nested arrays
        if (array1[i] instanceof Array && array2[i] instanceof Array) {
            // recurse into the nested arrays
            if (!equalArrays(array1[i], array2[i]))
                return false;
        } else if (array1[i] !== array2[i]) {
            // Warning - two different object instances will never be equal: {x:20} !== {x:20}
            return false;
        }
    }
    return true;
}
