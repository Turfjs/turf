//http://en.wikipedia.org/wiki/Delaunay_triangulation
//https://github.com/ironwallaby/delaunay
var polygon = require('turf-helpers').polygon;
var featurecollection = require('turf-helpers').featureCollection;

/**
 * Takes a set of {@link Point|points} and the name of a z-value property and
 * creates a [Triangulated Irregular Network](http://en.wikipedia.org/wiki/Triangulated_irregular_network),
 * or a TIN for short, returned as a collection of Polygons. These are often used
 * for developing elevation contour maps or stepped heat visualizations.
 *
 * This triangulates the points, as well as adds properties called `a`, `b`,
 * and `c` representing the value of the given `propertyName` at each of
 * the points that represent the corners of the triangle.
 *
 * @name tin
 * @param {FeatureCollection<Point>} points input points
 * @param {String=} z name of the property from which to pull z values
 * This is optional: if not given, then there will be no extra data added to the derived triangles.
 * @return {FeatureCollection<Polygon>} TIN output
 * @example
 * // generate some random point data
 * var points = turf.random('points', 30, {
 *   bbox: [50, 30, 70, 50]
 * });
 * //=points
 * // add a random property to each point between 0 and 9
 * for (var i = 0; i < points.features.length; i++) {
 *   points.features[i].properties.z = ~~(Math.random() * 9);
 * }
 * var tin = turf.tin(points, 'z')
 * for (var i = 0; i < tin.features.length; i++) {
 *   var properties  = tin.features[i].properties;
 *   // roughly turn the properties of each
 *   // triangle into a fill color
 *   // so we can visualize the result
 *   properties.fill = '#' + properties.a +
 *     properties.b + properties.c;
 * }
 * //=tin
 */
module.exports = function (points, z) {
    //break down points
    return featurecollection(triangulate(points.features.map(function (p) {
        var point = {
            x: p.geometry.coordinates[0],
            y: p.geometry.coordinates[1]
        };
        if (z) point.z = p.properties[z];
        return point;
    })).map(function (triangle) {
        return polygon([[
        [triangle.a.x, triangle.a.y],
        [triangle.b.x, triangle.b.y],
        [triangle.c.x, triangle.c.y],
        [triangle.a.x, triangle.a.y]
        ]], {
            a: triangle.a.z,
            b: triangle.b.z,
            c: triangle.c.z
        });
    }));
};

function Triangle(a, b, c) {
    this.a = a;
    this.b = b;
    this.c = c;

    var A = b.x - a.x,
        B = b.y - a.y,
        C = c.x - a.x,
        D = c.y - a.y,
        E = A * (a.x + b.x) + B * (a.y + b.y),
        F = C * (a.x + c.x) + D * (a.y + c.y),
        G = 2 * (A * (c.y - b.y) - B * (c.x - b.x)),
        minx, miny, dx, dy;

    // If the points of the triangle are collinear, then just find the
    // extremes and use the midpoint as the center of the circumcircle.
    if (Math.abs(G) < 0.000001) {
        minx = Math.min(a.x, b.x, c.x);
        miny = Math.min(a.y, b.y, c.y);
        dx = (Math.max(a.x, b.x, c.x) - minx) * 0.5;
        dy = (Math.max(a.y, b.y, c.y) - miny) * 0.5;

        this.x = minx + dx;
        this.y = miny + dy;
        this.r = dx * dx + dy * dy;
    } else {
        this.x = (D * E - B * F) / G;
        this.y = (A * F - C * E) / G;
        dx = this.x - a.x;
        dy = this.y - a.y;
        this.r = dx * dx + dy * dy;
    }
}

function byX(a, b) {
    return b.x - a.x;
}

function dedup(edges) {
    var j = edges.length,
        a, b, i, m, n;

    outer:
  while (j) {
      b = edges[--j];
      a = edges[--j];
      i = j;
      while (i) {
          n = edges[--i];
          m = edges[--i];
          if ((a === m && b === n) || (a === n && b === m)) {
              edges.splice(j, 2);
              edges.splice(i, 2);
              j -= 2;
              continue outer;
          }
      }
  }
}

function triangulate(vertices) {
    // Bail if there aren't enough vertices to form any triangles.
    if (vertices.length < 3)
        return [];

    // Ensure the vertex array is in order of descending X coordinate
    // (which is needed to ensure a subquadratic runtime), and then find
    // the bounding box around the points.
    vertices.sort(byX);

    var i = vertices.length - 1,
        xmin = vertices[i].x,
        xmax = vertices[0].x,
        ymin = vertices[i].y,
        ymax = ymin;

    while (i--) {
        if (vertices[i].y < ymin)
            ymin = vertices[i].y;
        if (vertices[i].y > ymax)
            ymax = vertices[i].y;
    }

    //Find a supertriangle, which is a triangle that surrounds all the
    //vertices. This is used like something of a sentinel value to remove
    //cases in the main algorithm, and is removed before we return any
    // results.

    // Once found, put it in the "open" list. (The "open" list is for
    // triangles who may still need to be considered; the "closed" list is
    // for triangles which do not.)
    var dx = xmax - xmin,
        dy = ymax - ymin,
        dmax = (dx > dy) ? dx : dy,
        xmid = (xmax + xmin) * 0.5,
        ymid = (ymax + ymin) * 0.5,
        open = [
            new Triangle({
                x: xmid - 20 * dmax,
                y: ymid - dmax,
                __sentinel: true
            }, {
                x: xmid,
                y: ymid + 20 * dmax,
                __sentinel: true
            }, {
                x: xmid + 20 * dmax,
                y: ymid - dmax,
                __sentinel: true
            }
        )],
        closed = [],
        edges = [],
        j, a, b;

    // Incrementally add each vertex to the mesh.
    i = vertices.length;
    while (i--) {
        // For each open triangle, check to see if the current point is
        // inside it's circumcircle. If it is, remove the triangle and add
        // it's edges to an edge list.
        edges.length = 0;
        j = open.length;
        while (j--) {
            // If this point is to the right of this triangle's circumcircle,
            // then this triangle should never get checked again. Remove it
            // from the open list, add it to the closed list, and skip.
            dx = vertices[i].x - open[j].x;
            if (dx > 0 && dx * dx > open[j].r) {
                closed.push(open[j]);
                open.splice(j, 1);
                continue;
            }

            // If not, skip this triangle.
            dy = vertices[i].y - open[j].y;
            if (dx * dx + dy * dy > open[j].r)
                continue;

            // Remove the triangle and add it's edges to the edge list.
            edges.push(
        open[j].a, open[j].b,
        open[j].b, open[j].c,
        open[j].c, open[j].a
      );
            open.splice(j, 1);
        }

        // Remove any doubled edges.
        dedup(edges);

        // Add a new triangle for each edge.
        j = edges.length;
        while (j) {
            b = edges[--j];
            a = edges[--j];
            open.push(new Triangle(a, b, vertices[i]));
        }
    }

    // Copy any remaining open triangles to the closed list, and then
    // remove any triangles that share a vertex with the supertriangle.
    Array.prototype.push.apply(closed, open);

    i = closed.length;
    while (i--)
        if (closed[i].a.__sentinel ||
      closed[i].b.__sentinel ||
      closed[i].c.__sentinel)
            closed.splice(i, 1);

    return closed;
}
