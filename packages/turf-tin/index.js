//http://en.wikipedia.org/wiki/Delaunay_triangulation
//https://github.com/ironwallaby/delaunay
var helpers = require('@turf/helpers');
var polygon = helpers.polygon;
var featurecollection = helpers.featureCollection;

/**
 * Takes a set of {@link Point|points} and creates a
 * [Triangulated Irregular Network](http://en.wikipedia.org/wiki/Triangulated_irregular_network),
 * or a TIN for short, returned as a collection of Polygons. These are often used
 * for developing elevation contour maps or stepped heat visualizations.
 *
 * If an optional z-value property is provided then it is added as properties called `a`, `b`,
 * and `c` representing its value at each of the points that represent the corners of the
 * triangle.
 *
 * @name tin
 * @param {FeatureCollection<Point>} points input points
 * @param {String} [z] name of the property from which to pull z values
 * This is optional: if not given, then there will be no extra data added to the derived triangles.
 * @returns {FeatureCollection<Polygon>} TIN output
 * @example
 * // generate some random point data
 * var points = turf.random('points', 30, {
 *   bbox: [50, 30, 70, 50]
 * });
 * // add a random property to each point between 0 and 9
 * for (var i = 0; i < points.features.length; i++) {
 *   points.features[i].properties.z = ~~(Math.random() * 9);
 * }
 * var tin = turf.tin(points, 'z');
 *
 * //addToMap
 * var addToMap = [tin, points]
 * for (var i = 0; i < tin.features.length; i++) {
 *   var properties  = tin.features[i].properties;
 *   properties.fill = '#' + properties.a + properties.b + properties.c;
 * }
 */
module.exports = function (points, z) {
    if (points.type !== 'FeatureCollection') throw new Error('points must be a FeatureCollection');
    //break down points
    var isPointZ = false;
    return featurecollection(triangulate(points.features.map(function (p) {
        var point = {
            x: p.geometry.coordinates[0],
            y: p.geometry.coordinates[1]
        };
        if (z) {
            point.z = p.properties[z];
        } else if (p.geometry.coordinates.length === 3) {
            isPointZ = true;
            point.z = p.geometry.coordinates[2];
        }
        return point;
    })).map(function (triangle) {

        var a = [triangle.a.x, triangle.a.y];
        var b = [triangle.b.x, triangle.b.y];
        var c = [triangle.c.x, triangle.c.y];
        var properties = {};

        // Add z coordinates to triangle points if user passed
        // them in that way otherwise add it as a property.
        if (isPointZ) {
            a.push(triangle.a.z);
            b.push(triangle.b.z);
            c.push(triangle.c.z);
        } else {
            properties = {
                a: triangle.a.z,
                b: triangle.b.z,
                c: triangle.c.z
            };
        }

        return polygon([[a, b, c, a]], properties);

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
        dx, dy;

    // If the points of the triangle are collinear, then just find the
    // extremes and use the midpoint as the center of the circumcircle.
    this.x = (D * E - B * F) / G;
    this.y = (A * F - C * E) / G;
    dx = this.x - a.x;
    dy = this.y - a.y;
    this.r = dx * dx + dy * dy;
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
        ymax = ymin,
        epsilon = 1e-12;

    var a,
        b,
        c,
        A,
        B,
        G;

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
        j;

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
            c = vertices[i];
            // Avoid adding colinear triangles (which have error-prone
            // circumcircles)
            A = b.x - a.x;
            B = b.y - a.y;
            G = 2 * (A * (c.y - b.y) - B * (c.x - b.x));
            if (Math.abs(G) > epsilon) {
                open.push(new Triangle(a, b, c));
            }
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
