var clockwise = require('turf-is-clockwise');

function doLinesIntersect(line1, line2) {
  var p1 = line1[0],
    p2 = line1[1],
    p3 = line2[0],
    p4 = line2[1];

  return (clockwise([p1, p3, p4, p1]) != clockwise([p2, p3, p4, p2]))
    && (clockwise([p1, p2, p3, p1]) != clockwise([p1, p2, p4, p1]));
}

function testLines(ring1, ring2) {
  for (var p1_ind = 0; p1_ind < (ring1.length - 1); p1_ind++) {
    var p1_line = [ring1[p1_ind], ring1[p1_ind + 1]];
    for (var p2_ind = 0; p2_ind < (ring2.length - 1); p2_ind++) {
      var p2_line = [ring2[p2_ind], ring2[p2_ind + 1]];

      if (doLinesIntersect(p1_line, p2_line)) {
        return true;
      }
    }
  }
  return false;
}

function getCoordinates(polygon) {
  var coords = [[[]]];

  switch (polygon.geometry.type) {
    case 'LineString':
      coords = [[polygon.geometry.coordinates]];
      break;
    case 'Polygon':
      coords = [polygon.geometry.coordinates];
      break;
    case 'MultiPolygon':
      coords = polygon.geometry.coordinates;
      break;
  }
  return coords;
}

/**
 * Since we don't care about the overlap amount,
 * or it's geometry, but rather just whether overlap
 * occurs, polygon overlap can most simply be expressed
 * by testing whether any pair of edges on the two polygons
 * intersect. If there are any edge intersections, the
 * polygons overlap.
 *
 * @param  {[type]} poly1 [description]
 * @param  {[type]} poly2 [description]
 * @return {[type]}       [description]
 */
module.exports = function (poly1, poly2) {
  var coords1 = getCoordinates(poly1),
    coords2 = getCoordinates(poly2);

  // This looks completely stupid ridiculous to
  // have so many nested loops, but it supports
  // multipolygons nicely. In the case of polygons
  // or linestrings, the outer loops are only one
  // iteration.
  return coords1.some(function (rings1) {
    return coords2.some(function (rings2) {
      return rings1.some(function(ring1) {
        return rings2.some(function(ring2) {
          return testLines(ring1, ring2);
        });
      });
    });
  });
};
