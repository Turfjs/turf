(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.turf = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*eslint global-require: 0*/

/**
 * Turf is a modular geospatial analysis engine written in JavaScript. It performs geospatial
 * processing tasks with GeoJSON data and can be run on a server or in a browser.
 *
 * @module turf
 * @summary Geospatial analysis for JavaScript
 */
module.exports = {
    isolines: require('turf-isolines'),
    convex: require('turf-convex'),
    within: require('turf-within'),
    concave: require('turf-concave'),
    difference: require('turf-difference'),
    collect: require('turf-collect'),
    flip: require('turf-flip'),
    simplify: require('turf-simplify'),
    bezier: require('turf-bezier'),
    tag: require('turf-tag'),
    sample: require('turf-sample'),
    envelope: require('turf-envelope'),
    square: require('turf-square'),
    midpoint: require('turf-midpoint'),
    buffer: require('turf-buffer'),
    center: require('turf-center'),
    centroid: require('turf-centroid'),
    combine: require('turf-combine'),
    distance: require('turf-distance'),
    explode: require('turf-explode'),
    bbox: require('turf-bbox'),
    tesselate: require('turf-tesselate'),
    bboxPolygon: require('turf-bbox-polygon'),
    inside: require('turf-inside'),
    intersect: require('turf-intersect'),
    nearest: require('turf-nearest'),
    planepoint: require('turf-planepoint'),
    random: require('turf-random'),
    tin: require('turf-tin'),
    union: require('turf-union'),
    bearing: require('turf-bearing'),
    destination: require('turf-destination'),
    kinks: require('turf-kinks'),
    pointOnSurface: require('turf-point-on-surface'),
    area: require('turf-area'),
    along: require('turf-along'),
    lineDistance: require('turf-line-distance'),
    lineSlice: require('turf-line-slice'),
    pointOnLine: require('turf-point-on-line'),
    pointGrid: require('turf-point-grid'),
    squareGrid: require('turf-square-grid'),
    triangleGrid: require('turf-triangle-grid'),
    hexGrid: require('turf-hex-grid')
};

var helpers = require('turf-helpers');

module.exports.point = helpers.point;
module.exports.polygon = helpers.polygon;
module.exports.lineString = helpers.lineString;
module.exports.multiPoint = helpers.multiPoint;
module.exports.multiPolygon = helpers.multiPolygon;
module.exports.multiLineString = helpers.multiLineString;
module.exports.feature = helpers.feature;
module.exports.featureCollection = helpers.featureCollection;
module.exports.geometryCollection = helpers.geometryCollection;

},{"turf-along":21,"turf-area":22,"turf-bbox":24,"turf-bbox-polygon":23,"turf-bearing":25,"turf-bezier":26,"turf-buffer":28,"turf-center":29,"turf-centroid":30,"turf-collect":31,"turf-combine":32,"turf-concave":33,"turf-convex":34,"turf-destination":35,"turf-difference":36,"turf-distance":37,"turf-envelope":38,"turf-explode":39,"turf-flip":40,"turf-helpers":42,"turf-hex-grid":43,"turf-inside":44,"turf-intersect":45,"turf-isolines":48,"turf-kinks":49,"turf-line-distance":50,"turf-line-slice":51,"turf-midpoint":53,"turf-nearest":54,"turf-planepoint":55,"turf-point-grid":56,"turf-point-on-line":57,"turf-point-on-surface":58,"turf-random":60,"turf-sample":61,"turf-simplify":62,"turf-square":64,"turf-square-grid":63,"turf-tag":65,"turf-tesselate":66,"turf-tin":67,"turf-triangle-grid":68,"turf-union":69,"turf-within":70}],2:[function(require,module,exports){
'use strict'

module.exports = affineHull

var orient = require('robust-orientation')

function linearlyIndependent(points, d) {
  var nhull = new Array(d+1)
  for(var i=0; i<points.length; ++i) {
    nhull[i] = points[i]
  }
  for(var i=0; i<=points.length; ++i) {
    for(var j=points.length; j<=d; ++j) {
      var x = new Array(d)
      for(var k=0; k<d; ++k) {
        x[k] = Math.pow(j+1-i, k)
      }
      nhull[j] = x
    }
    var o = orient.apply(void 0, nhull)
    if(o) {
      return true
    }
  }
  return false
}

function affineHull(points) {
  var n = points.length
  if(n === 0) {
    return []
  }
  if(n === 1) {
    return [0]
  }
  var d = points[0].length
  var frame = [ points[0] ]
  var index = [ 0 ]
  for(var i=1; i<n; ++i) {
    frame.push(points[i])
    if(!linearlyIndependent(frame, d)) {
      frame.pop()
      continue
    }
    index.push(i)
    if(index.length === d+1) {
      return index
    }
  }
  return index
}
},{"robust-orientation":15}],3:[function(require,module,exports){
/**
 * Bit twiddling hacks for JavaScript.
 *
 * Author: Mikola Lysenko
 *
 * Ported from Stanford bit twiddling hack library:
 *    http://graphics.stanford.edu/~seander/bithacks.html
 */

"use strict"; "use restrict";

//Number of bits in an integer
var INT_BITS = 32;

//Constants
exports.INT_BITS  = INT_BITS;
exports.INT_MAX   =  0x7fffffff;
exports.INT_MIN   = -1<<(INT_BITS-1);

//Returns -1, 0, +1 depending on sign of x
exports.sign = function(v) {
  return (v > 0) - (v < 0);
}

//Computes absolute value of integer
exports.abs = function(v) {
  var mask = v >> (INT_BITS-1);
  return (v ^ mask) - mask;
}

//Computes minimum of integers x and y
exports.min = function(x, y) {
  return y ^ ((x ^ y) & -(x < y));
}

//Computes maximum of integers x and y
exports.max = function(x, y) {
  return x ^ ((x ^ y) & -(x < y));
}

//Checks if a number is a power of two
exports.isPow2 = function(v) {
  return !(v & (v-1)) && (!!v);
}

//Computes log base 2 of v
exports.log2 = function(v) {
  var r, shift;
  r =     (v > 0xFFFF) << 4; v >>>= r;
  shift = (v > 0xFF  ) << 3; v >>>= shift; r |= shift;
  shift = (v > 0xF   ) << 2; v >>>= shift; r |= shift;
  shift = (v > 0x3   ) << 1; v >>>= shift; r |= shift;
  return r | (v >> 1);
}

//Computes log base 10 of v
exports.log10 = function(v) {
  return  (v >= 1000000000) ? 9 : (v >= 100000000) ? 8 : (v >= 10000000) ? 7 :
          (v >= 1000000) ? 6 : (v >= 100000) ? 5 : (v >= 10000) ? 4 :
          (v >= 1000) ? 3 : (v >= 100) ? 2 : (v >= 10) ? 1 : 0;
}

//Counts number of bits
exports.popCount = function(v) {
  v = v - ((v >>> 1) & 0x55555555);
  v = (v & 0x33333333) + ((v >>> 2) & 0x33333333);
  return ((v + (v >>> 4) & 0xF0F0F0F) * 0x1010101) >>> 24;
}

//Counts number of trailing zeros
function countTrailingZeros(v) {
  var c = 32;
  v &= -v;
  if (v) c--;
  if (v & 0x0000FFFF) c -= 16;
  if (v & 0x00FF00FF) c -= 8;
  if (v & 0x0F0F0F0F) c -= 4;
  if (v & 0x33333333) c -= 2;
  if (v & 0x55555555) c -= 1;
  return c;
}
exports.countTrailingZeros = countTrailingZeros;

//Rounds to next power of 2
exports.nextPow2 = function(v) {
  v += v === 0;
  --v;
  v |= v >>> 1;
  v |= v >>> 2;
  v |= v >>> 4;
  v |= v >>> 8;
  v |= v >>> 16;
  return v + 1;
}

//Rounds down to previous power of 2
exports.prevPow2 = function(v) {
  v |= v >>> 1;
  v |= v >>> 2;
  v |= v >>> 4;
  v |= v >>> 8;
  v |= v >>> 16;
  return v - (v>>>1);
}

//Computes parity of word
exports.parity = function(v) {
  v ^= v >>> 16;
  v ^= v >>> 8;
  v ^= v >>> 4;
  v &= 0xf;
  return (0x6996 >>> v) & 1;
}

var REVERSE_TABLE = new Array(256);

(function(tab) {
  for(var i=0; i<256; ++i) {
    var v = i, r = i, s = 7;
    for (v >>>= 1; v; v >>>= 1) {
      r <<= 1;
      r |= v & 1;
      --s;
    }
    tab[i] = (r << s) & 0xff;
  }
})(REVERSE_TABLE);

//Reverse bits in a 32 bit word
exports.reverse = function(v) {
  return  (REVERSE_TABLE[ v         & 0xff] << 24) |
          (REVERSE_TABLE[(v >>> 8)  & 0xff] << 16) |
          (REVERSE_TABLE[(v >>> 16) & 0xff] << 8)  |
           REVERSE_TABLE[(v >>> 24) & 0xff];
}

//Interleave bits of 2 coordinates with 16 bits.  Useful for fast quadtree codes
exports.interleave2 = function(x, y) {
  x &= 0xFFFF;
  x = (x | (x << 8)) & 0x00FF00FF;
  x = (x | (x << 4)) & 0x0F0F0F0F;
  x = (x | (x << 2)) & 0x33333333;
  x = (x | (x << 1)) & 0x55555555;

  y &= 0xFFFF;
  y = (y | (y << 8)) & 0x00FF00FF;
  y = (y | (y << 4)) & 0x0F0F0F0F;
  y = (y | (y << 2)) & 0x33333333;
  y = (y | (y << 1)) & 0x55555555;

  return x | (y << 1);
}

//Extracts the nth interleaved component
exports.deinterleave2 = function(v, n) {
  v = (v >>> n) & 0x55555555;
  v = (v | (v >>> 1))  & 0x33333333;
  v = (v | (v >>> 2))  & 0x0F0F0F0F;
  v = (v | (v >>> 4))  & 0x00FF00FF;
  v = (v | (v >>> 16)) & 0x000FFFF;
  return (v << 16) >> 16;
}


//Interleave bits of 3 coordinates, each with 10 bits.  Useful for fast octree codes
exports.interleave3 = function(x, y, z) {
  x &= 0x3FF;
  x  = (x | (x<<16)) & 4278190335;
  x  = (x | (x<<8))  & 251719695;
  x  = (x | (x<<4))  & 3272356035;
  x  = (x | (x<<2))  & 1227133513;

  y &= 0x3FF;
  y  = (y | (y<<16)) & 4278190335;
  y  = (y | (y<<8))  & 251719695;
  y  = (y | (y<<4))  & 3272356035;
  y  = (y | (y<<2))  & 1227133513;
  x |= (y << 1);
  
  z &= 0x3FF;
  z  = (z | (z<<16)) & 4278190335;
  z  = (z | (z<<8))  & 251719695;
  z  = (z | (z<<4))  & 3272356035;
  z  = (z | (z<<2))  & 1227133513;
  
  return x | (z << 2);
}

//Extracts nth interleaved component of a 3-tuple
exports.deinterleave3 = function(v, n) {
  v = (v >>> n)       & 1227133513;
  v = (v | (v>>>2))   & 3272356035;
  v = (v | (v>>>4))   & 251719695;
  v = (v | (v>>>8))   & 4278190335;
  v = (v | (v>>>16))  & 0x3FF;
  return (v<<22)>>22;
}

//Computes next combination in colexicographic order (this is mistakenly called nextPermutation on the bit twiddling hacks page)
exports.nextCombination = function(v) {
  var t = v | (v - 1);
  return (t + 1) | (((~t & -~t) - 1) >>> (countTrailingZeros(v) + 1));
}


},{}],4:[function(require,module,exports){
"use strict"

var convexHull1d = require('./lib/ch1d')
var convexHull2d = require('./lib/ch2d')
var convexHullnd = require('./lib/chnd')

module.exports = convexHull

function convexHull(points) {
  var n = points.length
  if(n === 0) {
    return []
  } else if(n === 1) {
    return [[0]]
  }
  var d = points[0].length
  if(d === 0) {
    return []
  } else if(d === 1) {
    return convexHull1d(points)
  } else if(d === 2) {
    return convexHull2d(points)
  }
  return convexHullnd(points, d)
}
},{"./lib/ch1d":5,"./lib/ch2d":6,"./lib/chnd":7}],5:[function(require,module,exports){
"use strict"

module.exports = convexHull1d

function convexHull1d(points) {
  var lo = 0
  var hi = 0
  for(var i=1; i<points.length; ++i) {
    if(points[i][0] < points[lo][0]) {
      lo = i
    }
    if(points[i][0] > points[hi][0]) {
      hi = i
    }
  }
  if(lo < hi) {
    return [[lo], [hi]]
  } else if(lo > hi) {
    return [[hi], [lo]]
  } else {
    return [[lo]]
  }
}
},{}],6:[function(require,module,exports){
'use strict'

module.exports = convexHull2D

var monotoneHull = require('monotone-convex-hull-2d')

function convexHull2D(points) {
  var hull = monotoneHull(points)
  var h = hull.length
  if(h <= 2) {
    return []
  }
  var edges = new Array(h)
  var a = hull[h-1]
  for(var i=0; i<h; ++i) {
    var b = hull[i]
    edges[i] = [a,b]
    a = b
  }
  return edges
}

},{"monotone-convex-hull-2d":14}],7:[function(require,module,exports){
'use strict'

module.exports = convexHullnD

var ich = require('incremental-convex-hull')
var aff = require('affine-hull')

function permute(points, front) {
  var n = points.length
  var npoints = new Array(n)
  for(var i=0; i<front.length; ++i) {
    npoints[i] = points[front[i]]
  }
  var ptr = front.length
  for(var i=0; i<n; ++i) {
    if(front.indexOf(i) < 0) {
      npoints[ptr++] = points[i]
    }
  }
  return npoints
}

function invPermute(cells, front) {
  var nc = cells.length
  var nf = front.length
  for(var i=0; i<nc; ++i) {
    var c = cells[i]
    for(var j=0; j<c.length; ++j) {
      var x = c[j]
      if(x < nf) {
        c[j] = front[x]
      } else {
        x = x - nf
        for(var k=0; k<nf; ++k) {
          if(x >= front[k]) {
            x += 1
          }
        }
        c[j] = x
      }
    }
  }
  return cells
}

function convexHullnD(points, d) {
  try {
    return ich(points, true)
  } catch(e) {
    //If point set is degenerate, try to find a basis and rerun it
    var ah = aff(points)
    if(ah.length <= d) {
      //No basis, no try
      return []
    }
    var npoints = permute(points, ah)
    var nhull   = ich(npoints, true)
    return invPermute(nhull, ah)
  }
}
},{"affine-hull":2,"incremental-convex-hull":12}],8:[function(require,module,exports){
'use strict';

module.exports = earcut;

function earcut(data, holeIndices, dim) {

    dim = dim || 2;

    var hasHoles = holeIndices && holeIndices.length,
        outerLen = hasHoles ? holeIndices[0] * dim : data.length,
        outerNode = linkedList(data, 0, outerLen, dim, true),
        triangles = [];

    if (!outerNode) return triangles;

    var minX, minY, maxX, maxY, x, y, size;

    if (hasHoles) outerNode = eliminateHoles(data, holeIndices, outerNode, dim);

    // if the shape is not too simple, we'll use z-order curve hash later; calculate polygon bbox
    if (data.length > 80 * dim) {
        minX = maxX = data[0];
        minY = maxY = data[1];

        for (var i = dim; i < outerLen; i += dim) {
            x = data[i];
            y = data[i + 1];
            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
        }

        // minX, minY and size are later used to transform coords into integers for z-order calculation
        size = Math.max(maxX - minX, maxY - minY);
    }

    earcutLinked(outerNode, triangles, dim, minX, minY, size);

    return triangles;
}

// create a circular doubly linked list from polygon points in the specified winding order
function linkedList(data, start, end, dim, clockwise) {
    var i, last;

    if (clockwise === (signedArea(data, start, end, dim) > 0)) {
        for (i = start; i < end; i += dim) last = insertNode(i, data[i], data[i + 1], last);
    } else {
        for (i = end - dim; i >= start; i -= dim) last = insertNode(i, data[i], data[i + 1], last);
    }

    if (last && equals(last, last.next)) {
        removeNode(last);
        last = last.next;
    }

    return last;
}

// eliminate colinear or duplicate points
function filterPoints(start, end) {
    if (!start) return start;
    if (!end) end = start;

    var p = start,
        again;
    do {
        again = false;

        if (!p.steiner && (equals(p, p.next) || area(p.prev, p, p.next) === 0)) {
            removeNode(p);
            p = end = p.prev;
            if (p === p.next) return null;
            again = true;

        } else {
            p = p.next;
        }
    } while (again || p !== end);

    return end;
}

// main ear slicing loop which triangulates a polygon (given as a linked list)
function earcutLinked(ear, triangles, dim, minX, minY, size, pass) {
    if (!ear) return;

    // interlink polygon nodes in z-order
    if (!pass && size) indexCurve(ear, minX, minY, size);

    var stop = ear,
        prev, next;

    // iterate through ears, slicing them one by one
    while (ear.prev !== ear.next) {
        prev = ear.prev;
        next = ear.next;

        if (size ? isEarHashed(ear, minX, minY, size) : isEar(ear)) {
            // cut off the triangle
            triangles.push(prev.i / dim);
            triangles.push(ear.i / dim);
            triangles.push(next.i / dim);

            removeNode(ear);

            // skipping the next vertice leads to less sliver triangles
            ear = next.next;
            stop = next.next;

            continue;
        }

        ear = next;

        // if we looped through the whole remaining polygon and can't find any more ears
        if (ear === stop) {
            // try filtering points and slicing again
            if (!pass) {
                earcutLinked(filterPoints(ear), triangles, dim, minX, minY, size, 1);

            // if this didn't work, try curing all small self-intersections locally
            } else if (pass === 1) {
                ear = cureLocalIntersections(ear, triangles, dim);
                earcutLinked(ear, triangles, dim, minX, minY, size, 2);

            // as a last resort, try splitting the remaining polygon into two
            } else if (pass === 2) {
                splitEarcut(ear, triangles, dim, minX, minY, size);
            }

            break;
        }
    }
}

// check whether a polygon node forms a valid ear with adjacent nodes
function isEar(ear) {
    var a = ear.prev,
        b = ear,
        c = ear.next;

    if (area(a, b, c) >= 0) return false; // reflex, can't be an ear

    // now make sure we don't have other points inside the potential ear
    var p = ear.next.next;

    while (p !== ear.prev) {
        if (pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
            area(p.prev, p, p.next) >= 0) return false;
        p = p.next;
    }

    return true;
}

function isEarHashed(ear, minX, minY, size) {
    var a = ear.prev,
        b = ear,
        c = ear.next;

    if (area(a, b, c) >= 0) return false; // reflex, can't be an ear

    // triangle bbox; min & max are calculated like this for speed
    var minTX = a.x < b.x ? (a.x < c.x ? a.x : c.x) : (b.x < c.x ? b.x : c.x),
        minTY = a.y < b.y ? (a.y < c.y ? a.y : c.y) : (b.y < c.y ? b.y : c.y),
        maxTX = a.x > b.x ? (a.x > c.x ? a.x : c.x) : (b.x > c.x ? b.x : c.x),
        maxTY = a.y > b.y ? (a.y > c.y ? a.y : c.y) : (b.y > c.y ? b.y : c.y);

    // z-order range for the current triangle bbox;
    var minZ = zOrder(minTX, minTY, minX, minY, size),
        maxZ = zOrder(maxTX, maxTY, minX, minY, size);

    // first look for points inside the triangle in increasing z-order
    var p = ear.nextZ;

    while (p && p.z <= maxZ) {
        if (p !== ear.prev && p !== ear.next &&
            pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
            area(p.prev, p, p.next) >= 0) return false;
        p = p.nextZ;
    }

    // then look for points in decreasing z-order
    p = ear.prevZ;

    while (p && p.z >= minZ) {
        if (p !== ear.prev && p !== ear.next &&
            pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
            area(p.prev, p, p.next) >= 0) return false;
        p = p.prevZ;
    }

    return true;
}

// go through all polygon nodes and cure small local self-intersections
function cureLocalIntersections(start, triangles, dim) {
    var p = start;
    do {
        var a = p.prev,
            b = p.next.next;

        if (!equals(a, b) && intersects(a, p, p.next, b) && locallyInside(a, b) && locallyInside(b, a)) {

            triangles.push(a.i / dim);
            triangles.push(p.i / dim);
            triangles.push(b.i / dim);

            // remove two nodes involved
            removeNode(p);
            removeNode(p.next);

            p = start = b;
        }
        p = p.next;
    } while (p !== start);

    return p;
}

// try splitting polygon into two and triangulate them independently
function splitEarcut(start, triangles, dim, minX, minY, size) {
    // look for a valid diagonal that divides the polygon into two
    var a = start;
    do {
        var b = a.next.next;
        while (b !== a.prev) {
            if (a.i !== b.i && isValidDiagonal(a, b)) {
                // split the polygon in two by the diagonal
                var c = splitPolygon(a, b);

                // filter colinear points around the cuts
                a = filterPoints(a, a.next);
                c = filterPoints(c, c.next);

                // run earcut on each half
                earcutLinked(a, triangles, dim, minX, minY, size);
                earcutLinked(c, triangles, dim, minX, minY, size);
                return;
            }
            b = b.next;
        }
        a = a.next;
    } while (a !== start);
}

// link every hole into the outer loop, producing a single-ring polygon without holes
function eliminateHoles(data, holeIndices, outerNode, dim) {
    var queue = [],
        i, len, start, end, list;

    for (i = 0, len = holeIndices.length; i < len; i++) {
        start = holeIndices[i] * dim;
        end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
        list = linkedList(data, start, end, dim, false);
        if (list === list.next) list.steiner = true;
        queue.push(getLeftmost(list));
    }

    queue.sort(compareX);

    // process holes from left to right
    for (i = 0; i < queue.length; i++) {
        eliminateHole(queue[i], outerNode);
        outerNode = filterPoints(outerNode, outerNode.next);
    }

    return outerNode;
}

function compareX(a, b) {
    return a.x - b.x;
}

// find a bridge between vertices that connects hole with an outer ring and and link it
function eliminateHole(hole, outerNode) {
    outerNode = findHoleBridge(hole, outerNode);
    if (outerNode) {
        var b = splitPolygon(outerNode, hole);
        filterPoints(b, b.next);
    }
}

// David Eberly's algorithm for finding a bridge between hole and outer polygon
function findHoleBridge(hole, outerNode) {
    var p = outerNode,
        hx = hole.x,
        hy = hole.y,
        qx = -Infinity,
        m;

    // find a segment intersected by a ray from the hole's leftmost point to the left;
    // segment's endpoint with lesser x will be potential connection point
    do {
        if (hy <= p.y && hy >= p.next.y) {
            var x = p.x + (hy - p.y) * (p.next.x - p.x) / (p.next.y - p.y);
            if (x <= hx && x > qx) {
                qx = x;
                if (x === hx) {
                    if (hy === p.y) return p;
                    if (hy === p.next.y) return p.next;
                }
                m = p.x < p.next.x ? p : p.next;
            }
        }
        p = p.next;
    } while (p !== outerNode);

    if (!m) return null;

    if (hx === qx) return m.prev; // hole touches outer segment; pick lower endpoint

    // look for points inside the triangle of hole point, segment intersection and endpoint;
    // if there are no points found, we have a valid connection;
    // otherwise choose the point of the minimum angle with the ray as connection point

    var stop = m,
        mx = m.x,
        my = m.y,
        tanMin = Infinity,
        tan;

    p = m.next;

    while (p !== stop) {
        if (hx >= p.x && p.x >= mx &&
                pointInTriangle(hy < my ? hx : qx, hy, mx, my, hy < my ? qx : hx, hy, p.x, p.y)) {

            tan = Math.abs(hy - p.y) / (hx - p.x); // tangential

            if ((tan < tanMin || (tan === tanMin && p.x > m.x)) && locallyInside(p, hole)) {
                m = p;
                tanMin = tan;
            }
        }

        p = p.next;
    }

    return m;
}

// interlink polygon nodes in z-order
function indexCurve(start, minX, minY, size) {
    var p = start;
    do {
        if (p.z === null) p.z = zOrder(p.x, p.y, minX, minY, size);
        p.prevZ = p.prev;
        p.nextZ = p.next;
        p = p.next;
    } while (p !== start);

    p.prevZ.nextZ = null;
    p.prevZ = null;

    sortLinked(p);
}

// Simon Tatham's linked list merge sort algorithm
// http://www.chiark.greenend.org.uk/~sgtatham/algorithms/listsort.html
function sortLinked(list) {
    var i, p, q, e, tail, numMerges, pSize, qSize,
        inSize = 1;

    do {
        p = list;
        list = null;
        tail = null;
        numMerges = 0;

        while (p) {
            numMerges++;
            q = p;
            pSize = 0;
            for (i = 0; i < inSize; i++) {
                pSize++;
                q = q.nextZ;
                if (!q) break;
            }

            qSize = inSize;

            while (pSize > 0 || (qSize > 0 && q)) {

                if (pSize === 0) {
                    e = q;
                    q = q.nextZ;
                    qSize--;
                } else if (qSize === 0 || !q) {
                    e = p;
                    p = p.nextZ;
                    pSize--;
                } else if (p.z <= q.z) {
                    e = p;
                    p = p.nextZ;
                    pSize--;
                } else {
                    e = q;
                    q = q.nextZ;
                    qSize--;
                }

                if (tail) tail.nextZ = e;
                else list = e;

                e.prevZ = tail;
                tail = e;
            }

            p = q;
        }

        tail.nextZ = null;
        inSize *= 2;

    } while (numMerges > 1);

    return list;
}

// z-order of a point given coords and size of the data bounding box
function zOrder(x, y, minX, minY, size) {
    // coords are transformed into non-negative 15-bit integer range
    x = 32767 * (x - minX) / size;
    y = 32767 * (y - minY) / size;

    x = (x | (x << 8)) & 0x00FF00FF;
    x = (x | (x << 4)) & 0x0F0F0F0F;
    x = (x | (x << 2)) & 0x33333333;
    x = (x | (x << 1)) & 0x55555555;

    y = (y | (y << 8)) & 0x00FF00FF;
    y = (y | (y << 4)) & 0x0F0F0F0F;
    y = (y | (y << 2)) & 0x33333333;
    y = (y | (y << 1)) & 0x55555555;

    return x | (y << 1);
}

// find the leftmost node of a polygon ring
function getLeftmost(start) {
    var p = start,
        leftmost = start;
    do {
        if (p.x < leftmost.x) leftmost = p;
        p = p.next;
    } while (p !== start);

    return leftmost;
}

// check if a point lies within a convex triangle
function pointInTriangle(ax, ay, bx, by, cx, cy, px, py) {
    return (cx - px) * (ay - py) - (ax - px) * (cy - py) >= 0 &&
           (ax - px) * (by - py) - (bx - px) * (ay - py) >= 0 &&
           (bx - px) * (cy - py) - (cx - px) * (by - py) >= 0;
}

// check if a diagonal between two polygon nodes is valid (lies in polygon interior)
function isValidDiagonal(a, b) {
    return a.next.i !== b.i && a.prev.i !== b.i && !intersectsPolygon(a, b) &&
           locallyInside(a, b) && locallyInside(b, a) && middleInside(a, b);
}

// signed area of a triangle
function area(p, q, r) {
    return (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
}

// check if two points are equal
function equals(p1, p2) {
    return p1.x === p2.x && p1.y === p2.y;
}

// check if two segments intersect
function intersects(p1, q1, p2, q2) {
    if ((equals(p1, q1) && equals(p2, q2)) ||
        (equals(p1, q2) && equals(p2, q1))) return true;
    return area(p1, q1, p2) > 0 !== area(p1, q1, q2) > 0 &&
           area(p2, q2, p1) > 0 !== area(p2, q2, q1) > 0;
}

// check if a polygon diagonal intersects any polygon segments
function intersectsPolygon(a, b) {
    var p = a;
    do {
        if (p.i !== a.i && p.next.i !== a.i && p.i !== b.i && p.next.i !== b.i &&
                intersects(p, p.next, a, b)) return true;
        p = p.next;
    } while (p !== a);

    return false;
}

// check if a polygon diagonal is locally inside the polygon
function locallyInside(a, b) {
    return area(a.prev, a, a.next) < 0 ?
        area(a, b, a.next) >= 0 && area(a, a.prev, b) >= 0 :
        area(a, b, a.prev) < 0 || area(a, a.next, b) < 0;
}

// check if the middle point of a polygon diagonal is inside the polygon
function middleInside(a, b) {
    var p = a,
        inside = false,
        px = (a.x + b.x) / 2,
        py = (a.y + b.y) / 2;
    do {
        if (((p.y > py) !== (p.next.y > py)) && (px < (p.next.x - p.x) * (py - p.y) / (p.next.y - p.y) + p.x))
            inside = !inside;
        p = p.next;
    } while (p !== a);

    return inside;
}

// link two polygon vertices with a bridge; if the vertices belong to the same ring, it splits polygon into two;
// if one belongs to the outer ring and another to a hole, it merges it into a single ring
function splitPolygon(a, b) {
    var a2 = new Node(a.i, a.x, a.y),
        b2 = new Node(b.i, b.x, b.y),
        an = a.next,
        bp = b.prev;

    a.next = b;
    b.prev = a;

    a2.next = an;
    an.prev = a2;

    b2.next = a2;
    a2.prev = b2;

    bp.next = b2;
    b2.prev = bp;

    return b2;
}

// create a node and optionally link it with previous one (in a circular doubly linked list)
function insertNode(i, x, y, last) {
    var p = new Node(i, x, y);

    if (!last) {
        p.prev = p;
        p.next = p;

    } else {
        p.next = last.next;
        p.prev = last;
        last.next.prev = p;
        last.next = p;
    }
    return p;
}

function removeNode(p) {
    p.next.prev = p.prev;
    p.prev.next = p.next;

    if (p.prevZ) p.prevZ.nextZ = p.nextZ;
    if (p.nextZ) p.nextZ.prevZ = p.prevZ;
}

function Node(i, x, y) {
    // vertice index in coordinates array
    this.i = i;

    // vertex coordinates
    this.x = x;
    this.y = y;

    // previous and next vertice nodes in a polygon ring
    this.prev = null;
    this.next = null;

    // z-order curve value
    this.z = null;

    // previous and next nodes in z-order
    this.prevZ = null;
    this.nextZ = null;

    // indicates whether this is a steiner point
    this.steiner = false;
}

// return a percentage difference between the polygon area and its triangulation area;
// used to verify correctness of triangulation
earcut.deviation = function (data, holeIndices, dim, triangles) {
    var hasHoles = holeIndices && holeIndices.length;
    var outerLen = hasHoles ? holeIndices[0] * dim : data.length;

    var polygonArea = Math.abs(signedArea(data, 0, outerLen, dim));
    if (hasHoles) {
        for (var i = 0, len = holeIndices.length; i < len; i++) {
            var start = holeIndices[i] * dim;
            var end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
            polygonArea -= Math.abs(signedArea(data, start, end, dim));
        }
    }

    var trianglesArea = 0;
    for (i = 0; i < triangles.length; i += 3) {
        var a = triangles[i] * dim;
        var b = triangles[i + 1] * dim;
        var c = triangles[i + 2] * dim;
        trianglesArea += Math.abs(
            (data[a] - data[c]) * (data[b + 1] - data[a + 1]) -
            (data[a] - data[b]) * (data[c + 1] - data[a + 1]));
    }

    return polygonArea === 0 && trianglesArea === 0 ? 0 :
        Math.abs((trianglesArea - polygonArea) / polygonArea);
};

function signedArea(data, start, end, dim) {
    var sum = 0;
    for (var i = start, j = end - dim; i < end; i += dim) {
        sum += (data[j] - data[i]) * (data[i + 1] + data[j + 1]);
        j = i;
    }
    return sum;
}

// turn a polygon in a multi-dimensional array form (e.g. as in GeoJSON) into a form Earcut accepts
earcut.flatten = function (data) {
    var dim = data[0][0].length,
        result = {vertices: [], holes: [], dimensions: dim},
        holeIndex = 0;

    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].length; j++) {
            for (var d = 0; d < dim; d++) result.vertices.push(data[i][j][d]);
        }
        if (i > 0) {
            holeIndex += data[i - 1].length;
            result.holes.push(holeIndex);
        }
    }
    return result;
};

},{}],9:[function(require,module,exports){
var wgs84 = require('wgs84');

module.exports.geometry = geometry;
module.exports.ring = ringArea;

function geometry(_) {
    var area = 0, i;
    switch (_.type) {
        case 'Polygon':
            return polygonArea(_.coordinates);
        case 'MultiPolygon':
            for (i = 0; i < _.coordinates.length; i++) {
                area += polygonArea(_.coordinates[i]);
            }
            return area;
        case 'Point':
        case 'MultiPoint':
        case 'LineString':
        case 'MultiLineString':
            return 0;
        case 'GeometryCollection':
            for (i = 0; i < _.geometries.length; i++) {
                area += geometry(_.geometries[i]);
            }
            return area;
    }
}

function polygonArea(coords) {
    var area = 0;
    if (coords && coords.length > 0) {
        area += Math.abs(ringArea(coords[0]));
        for (var i = 1; i < coords.length; i++) {
            area -= Math.abs(ringArea(coords[i]));
        }
    }
    return area;
}

/**
 * Calculate the approximate area of the polygon were it projected onto
 *     the earth.  Note that this area will be positive if ring is oriented
 *     clockwise, otherwise it will be negative.
 *
 * Reference:
 * Robert. G. Chamberlain and William H. Duquette, "Some Algorithms for
 *     Polygons on a Sphere", JPL Publication 07-03, Jet Propulsion
 *     Laboratory, Pasadena, CA, June 2007 http://trs-new.jpl.nasa.gov/dspace/handle/2014/40409
 *
 * Returns:
 * {float} The approximate signed geodesic area of the polygon in square
 *     meters.
 */

function ringArea(coords) {
    var p1, p2, p3, lowerIndex, middleIndex, upperIndex,
    area = 0,
    coordsLength = coords.length;

    if (coordsLength > 2) {
        for (i = 0; i < coordsLength; i++) {
            if (i === coordsLength - 2) {// i = N-2
                lowerIndex = coordsLength - 2;
                middleIndex = coordsLength -1;
                upperIndex = 0;
            } else if (i === coordsLength - 1) {// i = N-1
                lowerIndex = coordsLength - 1;
                middleIndex = 0;
                upperIndex = 1;
            } else { // i = 0 to N-3
                lowerIndex = i;
                middleIndex = i+1;
                upperIndex = i+2;
            }
            p1 = coords[lowerIndex];
            p2 = coords[middleIndex];
            p3 = coords[upperIndex];
            area += ( rad(p3[0]) - rad(p1[0]) ) * Math.sin( rad(p2[1]));
        }

        area = area * wgs84.RADIUS * wgs84.RADIUS / 2;
    }

    return area;
}

function rad(_) {
    return _ * Math.PI / 180;
}
},{"wgs84":74}],10:[function(require,module,exports){
module.exports = normalize;

var types = {
    Point: 'geometry',
    MultiPoint: 'geometry',
    LineString: 'geometry',
    MultiLineString: 'geometry',
    Polygon: 'geometry',
    MultiPolygon: 'geometry',
    GeometryCollection: 'geometry',
    Feature: 'feature',
    FeatureCollection: 'featurecollection'
};

/**
 * Normalize a GeoJSON feature into a FeatureCollection.
 *
 * @param {object} gj geojson data
 * @returns {object} normalized geojson data
 */
function normalize(gj) {
    if (!gj || !gj.type) return null;
    var type = types[gj.type];
    if (!type) return null;

    if (type === 'geometry') {
        return {
            type: 'FeatureCollection',
            features: [{
                type: 'Feature',
                properties: {},
                geometry: gj
            }]
        };
    } else if (type === 'feature') {
        return {
            type: 'FeatureCollection',
            features: [gj]
        };
    } else if (type === 'featurecollection') {
        return gj;
    }
}

},{}],11:[function(require,module,exports){
module.exports = function() {
    throw new Error('call .point() or .polygon() instead');
};

function position(bbox) {
    if (bbox) return coordInBBBOX(bbox);
    else return [lon(), lat()];
}

module.exports.position = position;

module.exports.point = function(count, bbox) {
    var features = [];
    for (i = 0; i < count; i++) {
        features.push(feature(bbox ? point(position(bbox)) : point()));
    }
    return collection(features);
};

module.exports.polygon = function(count, num_vertices, max_radial_length, bbox) {
    if (typeof num_vertices !== 'number') num_vertices = 10;
    if (typeof max_radial_length !== 'number') max_radial_length = 10;
    var features = [];
    for (i = 0; i < count; i++) {
        var vertices = [],
            circle_offsets = Array.apply(null,
                new Array(num_vertices + 1)).map(Math.random);

        circle_offsets.forEach(sumOffsets);
        circle_offsets.forEach(scaleOffsets);
        vertices[vertices.length - 1] = vertices[0]; // close the ring

        // center the polygon around something
        vertices = vertices.map(vertexToCoordinate(position(bbox)));
        features.push(feature(polygon([vertices])));
    }

    function sumOffsets(cur, index, arr) {
        arr[index] = (index > 0) ? cur + arr[index - 1] : cur;
    }

    function scaleOffsets(cur, index) {
        cur = cur * 2 * Math.PI / circle_offsets[circle_offsets.length - 1];
        var radial_scaler = Math.random();
        vertices.push([
            radial_scaler * max_radial_length * Math.sin(cur),
            radial_scaler * max_radial_length * Math.cos(cur)
        ]);
    }

    return collection(features);
};


function vertexToCoordinate(hub) {
    return function(cur, index) { return [cur[0] + hub[0], cur[1] + hub[1]]; };
}

function rnd() { return Math.random() - 0.5; }
function lon() { return rnd() * 360; }
function lat() { return rnd() * 180; }

function point(coordinates) {
    return {
        type: 'Point',
        coordinates: coordinates || [lon(), lat()]
    };
}

function coordInBBBOX(bbox) {
    return [
        (Math.random() * (bbox[2] - bbox[0])) + bbox[0],
        (Math.random() * (bbox[3] - bbox[1])) + bbox[1]];
}

function pointInBBBOX() {
    return {
        type: 'Point',
        coordinates: [lon(), lat()]
    };
}

function polygon(coordinates) {
    return {
        type: 'Polygon',
        coordinates: coordinates
    };
}

function feature(geom) {
    return {
        type: 'Feature',
        geometry: geom,
        properties: {}
    };
}

function collection(f) {
    return {
        type: 'FeatureCollection',
        features: f
    };
}

},{}],12:[function(require,module,exports){
"use strict"

//High level idea:
// 1. Use Clarkson's incremental construction to find convex hull
// 2. Point location in triangulation by jump and walk

module.exports = incrementalConvexHull

var orient = require("robust-orientation")
var compareCell = require("simplicial-complex").compareCells

function compareInt(a, b) {
  return a - b
}

function Simplex(vertices, adjacent, boundary) {
  this.vertices = vertices
  this.adjacent = adjacent
  this.boundary = boundary
  this.lastVisited = -1
}

Simplex.prototype.flip = function() {
  var t = this.vertices[0]
  this.vertices[0] = this.vertices[1]
  this.vertices[1] = t
  var u = this.adjacent[0]
  this.adjacent[0] = this.adjacent[1]
  this.adjacent[1] = u
}

function GlueFacet(vertices, cell, index) {
  this.vertices = vertices
  this.cell = cell
  this.index = index
}

function compareGlue(a, b) {
  return compareCell(a.vertices, b.vertices)
}

function bakeOrient(d) {
  var code = ["function orient(){var tuple=this.tuple;return test("]
  for(var i=0; i<=d; ++i) {
    if(i > 0) {
      code.push(",")
    }
    code.push("tuple[", i, "]")
  }
  code.push(")}return orient")
  var proc = new Function("test", code.join(""))
  var test = orient[d+1]
  if(!test) {
    test = orient
  }
  return proc(test)
}

var BAKED = []

function Triangulation(dimension, vertices, simplices) {
  this.dimension = dimension
  this.vertices = vertices
  this.simplices = simplices
  this.interior = simplices.filter(function(c) {
    return !c.boundary
  })

  this.tuple = new Array(dimension+1)
  for(var i=0; i<=dimension; ++i) {
    this.tuple[i] = this.vertices[i]
  }

  var o = BAKED[dimension]
  if(!o) {
    o = BAKED[dimension] = bakeOrient(dimension)
  }
  this.orient = o
}

var proto = Triangulation.prototype

//Degenerate situation where we are on boundary, but coplanar to face
proto.handleBoundaryDegeneracy = function(cell, point) {
  var d = this.dimension
  var n = this.vertices.length - 1
  var tuple = this.tuple
  var verts = this.vertices

  //Dumb solution: Just do dfs from boundary cell until we find any peak, or terminate
  var toVisit = [ cell ]
  cell.lastVisited = -n
  while(toVisit.length > 0) {
    cell = toVisit.pop()
    var cellVerts = cell.vertices
    var cellAdj = cell.adjacent
    for(var i=0; i<=d; ++i) {
      var neighbor = cellAdj[i]
      if(!neighbor.boundary || neighbor.lastVisited <= -n) {
        continue
      }
      var nv = neighbor.vertices
      for(var j=0; j<=d; ++j) {
        var vv = nv[j]
        if(vv < 0) {
          tuple[j] = point
        } else {
          tuple[j] = verts[vv]
        }
      }
      var o = this.orient()
      if(o > 0) {
        return neighbor
      }
      neighbor.lastVisited = -n
      if(o === 0) {
        toVisit.push(neighbor)
      }
    }
  }
  return null
}

proto.walk = function(point, random) {
  //Alias local properties
  var n = this.vertices.length - 1
  var d = this.dimension
  var verts = this.vertices
  var tuple = this.tuple

  //Compute initial jump cell
  var initIndex = random ? (this.interior.length * Math.random())|0 : (this.interior.length-1)
  var cell = this.interior[ initIndex ]

  //Start walking
outerLoop:
  while(!cell.boundary) {
    var cellVerts = cell.vertices
    var cellAdj = cell.adjacent

    for(var i=0; i<=d; ++i) {
      tuple[i] = verts[cellVerts[i]]
    }
    cell.lastVisited = n

    //Find farthest adjacent cell
    for(var i=0; i<=d; ++i) {
      var neighbor = cellAdj[i]
      if(neighbor.lastVisited >= n) {
        continue
      }
      var prev = tuple[i]
      tuple[i] = point
      var o = this.orient()
      tuple[i] = prev
      if(o < 0) {
        cell = neighbor
        continue outerLoop
      } else {
        if(!neighbor.boundary) {
          neighbor.lastVisited = n
        } else {
          neighbor.lastVisited = -n
        }
      }
    }
    return
  }

  return cell
}

proto.addPeaks = function(point, cell) {
  var n = this.vertices.length - 1
  var d = this.dimension
  var verts = this.vertices
  var tuple = this.tuple
  var interior = this.interior
  var simplices = this.simplices

  //Walking finished at boundary, time to add peaks
  var tovisit = [ cell ]

  //Stretch initial boundary cell into a peak
  cell.lastVisited = n
  cell.vertices[cell.vertices.indexOf(-1)] = n
  cell.boundary = false
  interior.push(cell)

  //Record a list of all new boundaries created by added peaks so we can glue them together when we are all done
  var glueFacets = []

  //Do a traversal of the boundary walking outward from starting peak
  while(tovisit.length > 0) {
    //Pop off peak and walk over adjacent cells
    var cell = tovisit.pop()
    var cellVerts = cell.vertices
    var cellAdj = cell.adjacent
    var indexOfN = cellVerts.indexOf(n)
    if(indexOfN < 0) {
      continue
    }

    for(var i=0; i<=d; ++i) {
      if(i === indexOfN) {
        continue
      }

      //For each boundary neighbor of the cell
      var neighbor = cellAdj[i]
      if(!neighbor.boundary || neighbor.lastVisited >= n) {
        continue
      }

      var nv = neighbor.vertices

      //Test if neighbor is a peak
      if(neighbor.lastVisited !== -n) {      
        //Compute orientation of p relative to each boundary peak
        var indexOfNeg1 = 0
        for(var j=0; j<=d; ++j) {
          if(nv[j] < 0) {
            indexOfNeg1 = j
            tuple[j] = point
          } else {
            tuple[j] = verts[nv[j]]
          }
        }
        var o = this.orient()

        //Test if neighbor cell is also a peak
        if(o > 0) {
          nv[indexOfNeg1] = n
          neighbor.boundary = false
          interior.push(neighbor)
          tovisit.push(neighbor)
          neighbor.lastVisited = n
          continue
        } else {
          neighbor.lastVisited = -n
        }
      }

      var na = neighbor.adjacent

      //Otherwise, replace neighbor with new face
      var vverts = cellVerts.slice()
      var vadj = cellAdj.slice()
      var ncell = new Simplex(vverts, vadj, true)
      simplices.push(ncell)

      //Connect to neighbor
      var opposite = na.indexOf(cell)
      if(opposite < 0) {
        continue
      }
      na[opposite] = ncell
      vadj[indexOfN] = neighbor

      //Connect to cell
      vverts[i] = -1
      vadj[i] = cell
      cellAdj[i] = ncell

      //Flip facet
      ncell.flip()

      //Add to glue list
      for(var j=0; j<=d; ++j) {
        var uu = vverts[j]
        if(uu < 0 || uu === n) {
          continue
        }
        var nface = new Array(d-1)
        var nptr = 0
        for(var k=0; k<=d; ++k) {
          var vv = vverts[k]
          if(vv < 0 || k === j) {
            continue
          }
          nface[nptr++] = vv
        }
        glueFacets.push(new GlueFacet(nface, ncell, j))
      }
    }
  }

  //Glue boundary facets together
  glueFacets.sort(compareGlue)

  for(var i=0; i+1<glueFacets.length; i+=2) {
    var a = glueFacets[i]
    var b = glueFacets[i+1]
    var ai = a.index
    var bi = b.index
    if(ai < 0 || bi < 0) {
      continue
    }
    a.cell.adjacent[a.index] = b.cell
    b.cell.adjacent[b.index] = a.cell
  }
}

proto.insert = function(point, random) {
  //Add point
  var verts = this.vertices
  verts.push(point)

  var cell = this.walk(point, random)
  if(!cell) {
    return
  }

  //Alias local properties
  var d = this.dimension
  var tuple = this.tuple

  //Degenerate case: If point is coplanar to cell, then walk until we find a non-degenerate boundary
  for(var i=0; i<=d; ++i) {
    var vv = cell.vertices[i]
    if(vv < 0) {
      tuple[i] = point
    } else {
      tuple[i] = verts[vv]
    }
  }
  var o = this.orient(tuple)
  if(o < 0) {
    return
  } else if(o === 0) {
    cell = this.handleBoundaryDegeneracy(cell, point)
    if(!cell) {
      return
    }
  }

  //Add peaks
  this.addPeaks(point, cell)
}

//Extract all boundary cells
proto.boundary = function() {
  var d = this.dimension
  var boundary = []
  var cells = this.simplices
  var nc = cells.length
  for(var i=0; i<nc; ++i) {
    var c = cells[i]
    if(c.boundary) {
      var bcell = new Array(d)
      var cv = c.vertices
      var ptr = 0
      var parity = 0
      for(var j=0; j<=d; ++j) {
        if(cv[j] >= 0) {
          bcell[ptr++] = cv[j]
        } else {
          parity = j&1
        }
      }
      if(parity === (d&1)) {
        var t = bcell[0]
        bcell[0] = bcell[1]
        bcell[1] = t
      }
      boundary.push(bcell)
    }
  }
  return boundary
}

function incrementalConvexHull(points, randomSearch) {
  var n = points.length
  if(n === 0) {
    throw new Error("Must have at least d+1 points")
  }
  var d = points[0].length
  if(n <= d) {
    throw new Error("Must input at least d+1 points")
  }

  //FIXME: This could be degenerate, but need to select d+1 non-coplanar points to bootstrap process
  var initialSimplex = points.slice(0, d+1)

  //Make sure initial simplex is positively oriented
  var o = orient.apply(void 0, initialSimplex)
  if(o === 0) {
    throw new Error("Input not in general position")
  }
  var initialCoords = new Array(d+1)
  for(var i=0; i<=d; ++i) {
    initialCoords[i] = i
  }
  if(o < 0) {
    initialCoords[0] = 1
    initialCoords[1] = 0
  }

  //Create initial topological index, glue pointers together (kind of messy)
  var initialCell = new Simplex(initialCoords, new Array(d+1), false)
  var boundary = initialCell.adjacent
  var list = new Array(d+2)
  for(var i=0; i<=d; ++i) {
    var verts = initialCoords.slice()
    for(var j=0; j<=d; ++j) {
      if(j === i) {
        verts[j] = -1
      }
    }
    var t = verts[0]
    verts[0] = verts[1]
    verts[1] = t
    var cell = new Simplex(verts, new Array(d+1), true)
    boundary[i] = cell
    list[i] = cell
  }
  list[d+1] = initialCell
  for(var i=0; i<=d; ++i) {
    var verts = boundary[i].vertices
    var adj = boundary[i].adjacent
    for(var j=0; j<=d; ++j) {
      var v = verts[j]
      if(v < 0) {
        adj[j] = initialCell
        continue
      }
      for(var k=0; k<=d; ++k) {
        if(boundary[k].vertices.indexOf(v) < 0) {
          adj[j] = boundary[k]
        }
      }
    }
  }

  //Initialize triangles
  var triangles = new Triangulation(d, initialSimplex, list)

  //Insert remaining points
  var useRandom = !!randomSearch
  for(var i=d+1; i<n; ++i) {
    triangles.insert(points[i], useRandom)
  }
  
  //Extract boundary cells
  return triangles.boundary()
}
},{"robust-orientation":15,"simplicial-complex":19}],13:[function(require,module,exports){
// JSTS. See https://github.com/bjornharrtell/jsts
// Licenses:
// https://github.com/bjornharrtell/jsts/blob/master/LICENSE_EDLv1.txt
// https://github.com/bjornharrtell/jsts/blob/master/LICENSE_EPLv1.txt
// https://github.com/bjornharrtell/jsts/blob/master/LICENSE_LICENSE_ES6_COLLECTIONS.txt
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e(t.jsts=t.jsts||{})}(this,function(t){"use strict";function e(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])}function n(){}function i(){}function r(){}function s(){}function o(){}function a(){}function u(){}function l(t){this.message=t}function h(t,e){t.prototype=Object.create(e.prototype),t.prototype.constructor=t}function c(){if(0===arguments.length)l.call(this);else if(1===arguments.length){var t=arguments[0];l.call(this,t)}}function f(){}function g(){if(this.x=null,this.y=null,this.z=null,0===arguments.length)g.call(this,0,0);else if(1===arguments.length){var t=arguments[0];g.call(this,t.x,t.y,t.z)}else if(2===arguments.length){var e=arguments[0],n=arguments[1];g.call(this,e,n,g.NULL_ORDINATE)}else if(3===arguments.length){var i=arguments[0],r=arguments[1],s=arguments[2];this.x=i,this.y=r,this.z=s}}function d(){if(this.dimensionsToTest=2,0===arguments.length)d.call(this,2);else if(1===arguments.length){var t=arguments[0];if(2!==t&&3!==t)throw new i("only 2 or 3 dimensions may be specified");this.dimensionsToTest=t}}function p(){}function v(){}function m(t){this.message=t||""}function y(){}function x(t){this.message=t||""}function E(t){this.message=t||""}function I(){this.array_=[],arguments[0]instanceof v&&this.addAll(arguments[0])}function N(){if(I.apply(this),0===arguments.length);else if(1===arguments.length){var t=arguments[0];this.ensureCapacity(t.length),this.add(t,!0)}else if(2===arguments.length){var e=arguments[0],n=arguments[1];this.ensureCapacity(e.length),this.add(e,n)}}function C(){if(this.minx=null,this.maxx=null,this.miny=null,this.maxy=null,0===arguments.length)this.init();else if(1===arguments.length){if(arguments[0]instanceof g){var t=arguments[0];this.init(t.x,t.x,t.y,t.y)}else if(arguments[0]instanceof C){var e=arguments[0];this.init(e)}}else if(2===arguments.length){var n=arguments[0],i=arguments[1];this.init(n.x,i.x,n.y,i.y)}else if(4===arguments.length){var r=arguments[0],s=arguments[1],o=arguments[2],a=arguments[3];this.init(r,s,o,a)}}function S(){}function w(){S.call(this,"Projective point not representable on the Cartesian plane.")}function L(){}function R(t,e){return t.interfaces_&&t.interfaces_().indexOf(e)>-1}function T(){}function P(t){this.str=t}function b(t){this.value=t}function O(){}function _(){if(this.hi=0,this.lo=0,0===arguments.length)this.init(0);else if(1===arguments.length){if("number"==typeof arguments[0]){var t=arguments[0];this.init(t)}else if(arguments[0]instanceof _){var e=arguments[0];this.init(e)}else if("string"==typeof arguments[0]){var n=arguments[0];_.call(this,_.parse(n))}}else if(2===arguments.length){var i=arguments[0],r=arguments[1];this.init(i,r)}}function M(){}function D(){}function A(){}function F(){if(this.x=null,this.y=null,this.w=null,0===arguments.length)this.x=0,this.y=0,this.w=1;else if(1===arguments.length){var t=arguments[0];this.x=t.x,this.y=t.y,this.w=1}else if(2===arguments.length){if("number"==typeof arguments[0]&&"number"==typeof arguments[1]){var e=arguments[0],n=arguments[1];this.x=e,this.y=n,this.w=1}else if(arguments[0]instanceof F&&arguments[1]instanceof F){var i=arguments[0],r=arguments[1];this.x=i.y*r.w-r.y*i.w,this.y=r.x*i.w-i.x*r.w,this.w=i.x*r.y-r.x*i.y}else if(arguments[0]instanceof g&&arguments[1]instanceof g){var s=arguments[0],o=arguments[1];this.x=s.y-o.y,this.y=o.x-s.x,this.w=s.x*o.y-o.x*s.y}}else if(3===arguments.length){var a=arguments[0],u=arguments[1],l=arguments[2];this.x=a,this.y=u,this.w=l}else if(4===arguments.length){var h=arguments[0],c=arguments[1],f=arguments[2],d=arguments[3],p=h.y-c.y,v=c.x-h.x,m=h.x*c.y-c.x*h.y,y=f.y-d.y,x=d.x-f.x,E=f.x*d.y-d.x*f.y;this.x=v*E-x*m,this.y=y*m-p*E,this.w=p*x-y*v}}function G(){}function q(){}function B(){this.envelope=null,this.factory=null,this.SRID=null,this.userData=null;var t=arguments[0];this.factory=t,this.SRID=t.getSRID()}function z(){}function V(){}function k(){}function Y(){}function U(){}function X(){}function H(){}function W(){}function j(){}function K(){}function Z(){}function Q(){}function J(){this.array_=[],arguments[0]instanceof v&&this.addAll(arguments[0])}function $(t){return null==t?$s:t.color}function tt(t){return null==t?null:t.parent}function et(t,e){null!==t&&(t.color=e)}function nt(t){return null==t?null:t.left}function it(t){return null==t?null:t.right}function rt(){this.root_=null,this.size_=0}function st(){}function ot(){}function at(){this.array_=[],arguments[0]instanceof v&&this.addAll(arguments[0])}function ut(){}function lt(){}function ht(){}function ct(){}function ft(){this.geometries=null;var t=arguments[0],e=arguments[1];if(B.call(this,e),null===t&&(t=[]),B.hasNullElements(t))throw new i("geometries must not contain null elements");this.geometries=t}function gt(){var t=arguments[0],e=arguments[1];ft.call(this,t,e)}function dt(){if(this.geom=null,this.geomFact=null,this.bnRule=null,this.endpointMap=null,1===arguments.length){var t=arguments[0];dt.call(this,t,V.MOD2_BOUNDARY_RULE)}else if(2===arguments.length){var e=arguments[0],n=arguments[1];this.geom=e,this.geomFact=e.getFactory(),this.bnRule=n}}function pt(){this.count=null}function vt(){}function mt(){}function yt(){}function xt(){}function Et(){}function It(){}function Nt(){}function Ct(){}function St(){this.points=null;var t=arguments[0],e=arguments[1];B.call(this,e),this.init(t)}function wt(){}function Lt(){this.coordinates=null;var t=arguments[0],e=arguments[1];B.call(this,e),this.init(t)}function Rt(){}function Tt(){this.shell=null,this.holes=null;var t=arguments[0],e=arguments[1],n=arguments[2];if(B.call(this,n),null===t&&(t=this.getFactory().createLinearRing()),null===e&&(e=[]),B.hasNullElements(e))throw new i("holes must not contain null elements");if(t.isEmpty()&&B.hasNonEmptyElements(e))throw new i("shell is empty but holes are not");this.shell=t,this.holes=e}function Pt(){var t=arguments[0],e=arguments[1];ft.call(this,t,e)}function bt(){if(arguments[0]instanceof g&&arguments[1]instanceof ie){var t=arguments[0],e=arguments[1];bt.call(this,e.getCoordinateSequenceFactory().create(t),e)}else if(R(arguments[0],D)&&arguments[1]instanceof ie){var n=arguments[0],i=arguments[1];St.call(this,n,i),this.validateConstruction()}}function Ot(){var t=arguments[0],e=arguments[1];ft.call(this,t,e)}function _t(){if(this.factory=null,this.isUserDataCopied=!1,0===arguments.length);else if(1===arguments.length){var t=arguments[0];this.factory=t}}function Mt(){}function Dt(){}function At(){}function Ft(){}function Gt(){if(this.dimension=3,this.coordinates=null,1===arguments.length){if(arguments[0]instanceof Array){var t=arguments[0];Gt.call(this,t,3)}else if(Number.isInteger(arguments[0])){var e=arguments[0];this.coordinates=new Array(e).fill(null);for(var n=0;e>n;n++)this.coordinates[n]=new g}else if(R(arguments[0],D)){var i=arguments[0];if(null===i)return this.coordinates=new Array(0).fill(null),null;this.dimension=i.getDimension(),this.coordinates=new Array(i.size()).fill(null);for(var n=0;n<this.coordinates.length;n++)this.coordinates[n]=i.getCoordinateCopy(n)}}else if(2===arguments.length)if(arguments[0]instanceof Array&&Number.isInteger(arguments[1])){var r=arguments[0],s=arguments[1];this.coordinates=r,this.dimension=s,null===r&&(this.coordinates=new Array(0).fill(null))}else if(Number.isInteger(arguments[0])&&Number.isInteger(arguments[1])){var o=arguments[0],a=arguments[1];this.coordinates=new Array(o).fill(null),this.dimension=a;for(var n=0;o>n;n++)this.coordinates[n]=new g}}function qt(){}function Bt(t,e){return t===e||t!==t&&e!==e}function zt(t,e){function n(t){return this&&this.constructor===n?(this._keys=[],this._values=[],this._itp=[],this.objectOnly=e,void(t&&Vt.call(this,t))):new n(t)}return e||io(t,"size",{get:Jt}),t.constructor=n,n.prototype=t,n}function Vt(t){this.add?t.forEach(this.add,this):t.forEach(function(t){this.set(t[0],t[1])},this)}function kt(t){return this.has(t)&&(this._keys.splice(no,1),this._values.splice(no,1),this._itp.forEach(function(t){no<t[0]&&t[0]--})),no>-1}function Yt(t){return this.has(t)?this._values[no]:void 0}function Ut(t,e){if(this.objectOnly&&e!==Object(e))throw new TypeError("Invalid value used as weak collection key");if(e!==e||0===e)for(no=t.length;no--&&!Bt(t[no],e););else no=t.indexOf(e);return no>-1}function Xt(t){return Ut.call(this,this._keys,t)}function Ht(t,e){return this.has(t)?this._values[no]=e:this._values[this._keys.push(t)-1]=e,this}function Wt(){(this._keys||0).length=this._values.length=0}function jt(){return Qt(this._itp,this._keys)}function Kt(){return Qt(this._itp,this._values)}function Zt(){return Qt(this._itp,this._keys,this._values)}function Qt(t,e,n){var i=[0],r=!1;return t.push(i),{next:function(){var s,o=i[0];return!r&&o<e.length?(s=n?[e[o],n[o]]:e[o],i[0]++):(r=!0,t.splice(t.indexOf(i),1)),{done:r,value:s}}}}function Jt(){return this._values.length}function $t(t,e){for(var n=this.entries();;){var i=n.next();if(i.done)break;t.call(e,i.value[1],i.value[0],this)}}function te(){this.map_=new so}function ee(){if(this.modelType=null,this.scale=null,0===arguments.length)this.modelType=ee.FLOATING;else if(1===arguments.length)if(arguments[0]instanceof ne){var t=arguments[0];this.modelType=t,t===ee.FIXED&&this.setScale(1)}else if("number"==typeof arguments[0]){var e=arguments[0];this.modelType=ee.FIXED,this.setScale(e)}else if(arguments[0]instanceof ee){var n=arguments[0];this.modelType=n.modelType,this.scale=n.scale}}function ne(){this.name=null;var t=arguments[0];this.name=t,ne.nameToTypeMap.put(t,this)}function ie(){if(this.precisionModel=null,this.coordinateSequenceFactory=null,this.SRID=null,0===arguments.length)ie.call(this,new ee,0);else if(1===arguments.length){if(R(arguments[0],G)){var t=arguments[0];ie.call(this,new ee,0,t)}else if(arguments[0]instanceof ee){var e=arguments[0];ie.call(this,e,0,ie.getDefaultCoordinateSequenceFactory())}}else if(2===arguments.length){var n=arguments[0],i=arguments[1];ie.call(this,n,i,ie.getDefaultCoordinateSequenceFactory())}else if(3===arguments.length){var r=arguments[0],s=arguments[1],o=arguments[2];this.precisionModel=r,this.coordinateSequenceFactory=o,this.SRID=s}}function re(t){this.geometryFactory=t||new ie}function se(t){this.parser=new re(t)}function oe(){this.result=null,this.inputLines=Array(2).fill().map(function(){return Array(2)}),this.intPt=new Array(2).fill(null),this.intLineIndex=null,this._isProper=null,this.pa=null,this.pb=null,this.precisionModel=null,this.intPt[0]=new g,this.intPt[1]=new g,this.pa=this.intPt[0],this.pb=this.intPt[1],this.result=0}function ae(){oe.apply(this)}function ue(){}function le(){this.p=null,this.crossingCount=0,this.isPointOnSegment=!1;var t=arguments[0];this.p=t}function he(){}function ce(){if(this.p0=null,this.p1=null,0===arguments.length)ce.call(this,new g,new g);else if(1===arguments.length){var t=arguments[0];ce.call(this,t.p0,t.p1)}else if(2===arguments.length){var e=arguments[0],n=arguments[1];this.p0=e,this.p1=n}else if(4===arguments.length){var i=arguments[0],r=arguments[1],s=arguments[2],o=arguments[3];ce.call(this,new g(i,r),new g(s,o))}}function fe(){if(this.matrix=null,0===arguments.length)this.matrix=Array(3).fill().map(function(){return Array(3)}),this.setAll(lt.FALSE);else if(1===arguments.length)if("string"==typeof arguments[0]){var t=arguments[0];fe.call(this),this.set(t)}else if(arguments[0]instanceof fe){var e=arguments[0];fe.call(this),this.matrix[L.INTERIOR][L.INTERIOR]=e.matrix[L.INTERIOR][L.INTERIOR],this.matrix[L.INTERIOR][L.BOUNDARY]=e.matrix[L.INTERIOR][L.BOUNDARY],this.matrix[L.INTERIOR][L.EXTERIOR]=e.matrix[L.INTERIOR][L.EXTERIOR],this.matrix[L.BOUNDARY][L.INTERIOR]=e.matrix[L.BOUNDARY][L.INTERIOR],this.matrix[L.BOUNDARY][L.BOUNDARY]=e.matrix[L.BOUNDARY][L.BOUNDARY],this.matrix[L.BOUNDARY][L.EXTERIOR]=e.matrix[L.BOUNDARY][L.EXTERIOR],this.matrix[L.EXTERIOR][L.INTERIOR]=e.matrix[L.EXTERIOR][L.INTERIOR],this.matrix[L.EXTERIOR][L.BOUNDARY]=e.matrix[L.EXTERIOR][L.BOUNDARY],this.matrix[L.EXTERIOR][L.EXTERIOR]=e.matrix[L.EXTERIOR][L.EXTERIOR]}}function ge(){this.areaBasePt=null,this.triangleCent3=new g,this.areasum2=0,this.cg3=new g,this.lineCentSum=new g,this.totalLength=0,this.ptCount=0,this.ptCentSum=new g;var t=arguments[0];this.areaBasePt=null,this.add(t)}function de(t){this.message=t||""}function pe(){this.array_=[]}function ve(){this.treeSet=new at,this.list=new I}function me(){if(this.geomFactory=null,this.inputPts=null,1===arguments.length){var t=arguments[0];me.call(this,me.extractCoordinates(t),t.getFactory())}else if(2===arguments.length){var e=arguments[0],n=arguments[1];this.inputPts=ve.filterCoordinates(e),this.geomFactory=n}}function ye(){this.origin=null;var t=arguments[0];this.origin=t}function xe(){this.inputGeom=null,this.factory=null,this.pruneEmptyGeometry=!0,this.preserveGeometryCollectionType=!0,this.preserveCollections=!1,this.preserveType=!1}function Ee(){if(this.snapTolerance=0,this.srcPts=null,this.seg=new ce,this.allowSnappingToSourceVertices=!1,this._isClosed=!1,arguments[0]instanceof St&&"number"==typeof arguments[1]){var t=arguments[0],e=arguments[1];Ee.call(this,t.getCoordinates(),e)}else if(arguments[0]instanceof Array&&"number"==typeof arguments[1]){var n=arguments[0],i=arguments[1];this.srcPts=n,this._isClosed=Ee.isClosed(n),this.snapTolerance=i}}function Ie(){this.srcGeom=null;var t=arguments[0];this.srcGeom=t}function Ne(){if(xe.apply(this),this.snapTolerance=null,this.snapPts=null,this.isSelfSnap=!1,2===arguments.length){var t=arguments[0],e=arguments[1];this.snapTolerance=t,this.snapPts=e}else if(3===arguments.length){var n=arguments[0],i=arguments[1],r=arguments[2];this.snapTolerance=n,this.snapPts=i,this.isSelfSnap=r}}function Ce(){this.isFirst=!0,this.commonMantissaBitsCount=53,this.commonBits=0,this.commonSignExp=null}function Se(){this.commonCoord=null,this.ccFilter=new we}function we(){this.commonBitsX=new Ce,this.commonBitsY=new Ce}function Le(){this.trans=null;var t=arguments[0];this.trans=t}function Re(){this.parent=null,this.atStart=null,this.max=null,this.index=null,this.subcollectionIterator=null;var t=arguments[0];this.parent=t,this.atStart=!0,this.index=0,this.max=t.getNumGeometries()}function Te(){if(this.boundaryRule=V.OGC_SFS_BOUNDARY_RULE,this.isIn=null,this.numBoundaries=null,0===arguments.length);else if(1===arguments.length){var t=arguments[0];if(null===t)throw new i("Rule must be non-null");this.boundaryRule=t}}function Pe(){}function be(){}function Oe(){this.pts=null,this.data=null;var t=arguments[0],e=arguments[1];this.pts=t,this.data=e}function _e(){}function Me(){this.bounds=null,this.item=null;var t=arguments[0],e=arguments[1];this.bounds=t,this.item=e}function De(){this._size=null,this.items=null,this._size=0,this.items=new I,this.items.add(null)}function Ae(){}function Fe(){}function Ge(){if(this.childBoundables=new I,this.bounds=null,this.level=null,0===arguments.length);else if(1===arguments.length){var t=arguments[0];this.level=t}}function qe(){this.boundable1=null,this.boundable2=null,this._distance=null,this.itemDistance=null;var t=arguments[0],e=arguments[1],n=arguments[2];this.boundable1=t,this.boundable2=e,this.itemDistance=n,this._distance=this.distance()}function Be(){if(this.root=null,this.built=!1,this.itemBoundables=new I,this.nodeCapacity=null,0===arguments.length)Be.call(this,Be.DEFAULT_NODE_CAPACITY);else if(1===arguments.length){var t=arguments[0];f.isTrue(t>1,"Node capacity must be greater than 1"),this.nodeCapacity=t}}function ze(){}function Ve(){}function ke(){if(0===arguments.length)ke.call(this,ke.DEFAULT_NODE_CAPACITY);else if(1===arguments.length){var t=arguments[0];Be.call(this,t)}}function Ye(){var t=arguments[0];Ge.call(this,t)}function Ue(){}function Xe(){this.segString=null,this.coord=null,this.segmentIndex=null,this.segmentOctant=null,this._isInterior=null;var t=arguments[0],e=arguments[1],n=arguments[2],i=arguments[3];this.segString=t,this.coord=new g(e),this.segmentIndex=n,this.segmentOctant=i,this._isInterior=!e.equals2D(t.getCoordinate(n))}function He(){this.nodeMap=new rt,this.edge=null;var t=arguments[0];this.edge=t}function We(){this.nodeList=null,this.edge=null,this.nodeIt=null,this.currNode=null,this.nextNode=null,this.currSegIndex=0;var t=arguments[0];this.nodeList=t,this.edge=t.getEdge(),this.nodeIt=t.iterator(),this.readNextNode()}function je(){}function Ke(){this.nodeList=new He(this),this.pts=null,this.data=null;var t=arguments[0],e=arguments[1];this.pts=t,this.data=e}function Ze(){this.tempEnv1=new C,this.tempEnv2=new C,this.overlapSeg1=new ce,this.overlapSeg2=new ce}function Qe(){this.pts=null,this.start=null,this.end=null,this.env=null,this.context=null,this.id=null;var t=arguments[0],e=arguments[1],n=arguments[2],i=arguments[3];this.pts=t,this.start=e,this.end=n,this.context=i}function Je(){}function $e(){}function tn(){}function en(){if(this.segInt=null,0===arguments.length);else if(1===arguments.length){var t=arguments[0];this.setSegmentIntersector(t)}}function nn(){if(this.monoChains=new I,this.index=new ke,this.idCounter=0,this.nodedSegStrings=null,this.nOverlaps=0,0===arguments.length);else if(1===arguments.length){var t=arguments[0];en.call(this,t)}}function rn(){Ze.apply(this),this.si=null;var t=arguments[0];this.si=t}function sn(){if(this.pt=null,1===arguments.length){var t=arguments[0];l.call(this,t)}else if(2===arguments.length){var e=arguments[0],n=arguments[1];l.call(this,sn.msgWithCoord(e,n)),this.pt=new g(n)}}function on(){}function an(){this.findAllIntersections=!1,this.isCheckEndSegmentsOnly=!1,this.li=null,this.interiorIntersection=null,this.intSegments=null,this.intersections=new I,this.intersectionCount=0,this.keepIntersections=!0;var t=arguments[0];this.li=t,this.interiorIntersection=null}function un(){this.li=new ae,this.segStrings=null,this.findAllIntersections=!1,this.segInt=null,this._isValid=!0;var t=arguments[0];this.segStrings=t}function ln(){this.nv=null;var t=arguments[0];this.nv=new un(ln.toSegmentStrings(t))}function hn(){this.mapOp=null;var t=arguments[0];this.mapOp=t}function cn(){}function fn(){if(this.location=null,1===arguments.length){if(arguments[0]instanceof Array){var t=arguments[0];this.init(t.length)}else if(Number.isInteger(arguments[0])){var e=arguments[0];this.init(1),this.location[cn.ON]=e}else if(arguments[0]instanceof fn){var n=arguments[0];if(this.init(n.location.length),null!==n)for(var i=0;i<this.location.length;i++)this.location[i]=n.location[i]}}else if(3===arguments.length){var r=arguments[0],s=arguments[1],o=arguments[2];this.init(3),this.location[cn.ON]=r,this.location[cn.LEFT]=s,this.location[cn.RIGHT]=o}}function gn(){if(this.elt=new Array(2).fill(null),1===arguments.length){if(Number.isInteger(arguments[0])){var t=arguments[0];this.elt[0]=new fn(t),this.elt[1]=new fn(t)}else if(arguments[0]instanceof gn){var e=arguments[0];this.elt[0]=new fn(e.elt[0]),this.elt[1]=new fn(e.elt[1])}}else if(2===arguments.length){var n=arguments[0],i=arguments[1];this.elt[0]=new fn(L.NONE),this.elt[1]=new fn(L.NONE),this.elt[n].setLocation(i)}else if(3===arguments.length){var r=arguments[0],s=arguments[1],o=arguments[2];this.elt[0]=new fn(r,s,o),this.elt[1]=new fn(r,s,o)}else if(4===arguments.length){var a=arguments[0],u=arguments[1],l=arguments[2],h=arguments[3];this.elt[0]=new fn(L.NONE,L.NONE,L.NONE),this.elt[1]=new fn(L.NONE,L.NONE,L.NONE),this.elt[a].setLocations(u,l,h)}}function dn(){this.startDe=null,this.maxNodeDegree=-1,this.edges=new I,this.pts=new I,this.label=new gn(L.NONE),this.ring=null,this._isHole=null,this.shell=null,this.holes=new I,this.geometryFactory=null;var t=arguments[0],e=arguments[1];this.geometryFactory=e,this.computePoints(t),this.computeRing()}function pn(){var t=arguments[0],e=arguments[1];dn.call(this,t,e)}function vn(){var t=arguments[0],e=arguments[1];dn.call(this,t,e)}function mn(){if(this.label=null,this._isInResult=!1,this._isCovered=!1,this._isCoveredSet=!1,this._isVisited=!1,0===arguments.length);else if(1===arguments.length){var t=arguments[0];this.label=t}}function yn(){mn.apply(this),this.coord=null,this.edges=null;var t=arguments[0],e=arguments[1];this.coord=t,this.edges=e,this.label=new gn(0,L.NONE)}function xn(){this.nodeMap=new rt,this.nodeFact=null;var t=arguments[0];this.nodeFact=t}function En(){if(this.edge=null,this.label=null,this.node=null,this.p0=null,this.p1=null,this.dx=null,this.dy=null,this.quadrant=null,1===arguments.length){var t=arguments[0];this.edge=t}else if(3===arguments.length){var e=arguments[0],n=arguments[1],i=arguments[2];En.call(this,e,n,i,null)}else if(4===arguments.length){var r=arguments[0],s=arguments[1],o=arguments[2],a=arguments[3];En.call(this,r),this.init(s,o),this.label=a}}function In(){this._isForward=null,this._isInResult=!1,this._isVisited=!1,this.sym=null,this.next=null,this.nextMin=null,this.edgeRing=null,this.minEdgeRing=null,this.depth=[0,-999,-999];var t=arguments[0],e=arguments[1];if(En.call(this,t),this._isForward=e,e)this.init(t.getCoordinate(0),t.getCoordinate(1));else{var n=t.getNumPoints()-1;this.init(t.getCoordinate(n),t.getCoordinate(n-1))}this.computeDirectedLabel()}function Nn(){}function Cn(){if(this.edges=new I,this.nodes=null,this.edgeEndList=new I,0===arguments.length)this.nodes=new xn(new Nn);else if(1===arguments.length){var t=arguments[0];this.nodes=new xn(t)}}function Sn(){this.geometryFactory=null,this.shellList=new I;var t=arguments[0];this.geometryFactory=t}function wn(){this.op=null,this.geometryFactory=null,this.ptLocator=null,this.lineEdgesList=new I,this.resultLineList=new I;var t=arguments[0],e=arguments[1],n=arguments[2];this.op=t,this.geometryFactory=e,this.ptLocator=n}function Ln(){this.op=null,this.geometryFactory=null,this.resultPointList=new I;var t=arguments[0],e=arguments[1];arguments[2];this.op=t,this.geometryFactory=e}function Rn(){}function Tn(){this.geom=null;var t=arguments[0];this.geom=t}function Pn(){this.edgeMap=new rt,this.edgeList=null,this.ptInAreaLocation=[L.NONE,L.NONE]}function bn(){Pn.apply(this),this.resultAreaEdgeList=null,this.label=null,this.SCANNING_FOR_INCOMING=1,this.LINKING_TO_OUTGOING=2}function On(){Nn.apply(this)}function _n(){this.mce=null,this.chainIndex=null;var t=arguments[0],e=arguments[1];this.mce=t,this.chainIndex=e}function Mn(){if(this.label=null,this.xValue=null,this.eventType=null,this.insertEvent=null,this.deleteEventIndex=null,this.obj=null,2===arguments.length){var t=arguments[0],e=arguments[1];this.eventType=Mn.DELETE,this.xValue=t,this.insertEvent=e}else if(3===arguments.length){var n=arguments[0],i=arguments[1],r=arguments[2];this.eventType=Mn.INSERT,this.label=n,this.xValue=i,this.obj=r}}function Dn(){}function An(){this._hasIntersection=!1,this.hasProper=!1,this.hasProperInterior=!1,this.properIntersectionPoint=null,this.li=null,this.includeProper=null,this.recordIsolated=null,this.isSelfIntersection=null,this.numIntersections=0,this.numTests=0,this.bdyNodes=null,this._isDone=!1,this.isDoneWhenProperInt=!1;var t=arguments[0],e=arguments[1],n=arguments[2];this.li=t,this.includeProper=e,this.recordIsolated=n}function Fn(){Dn.apply(this),this.events=new I,this.nOverlaps=null}function Gn(){this.min=r.POSITIVE_INFINITY,this.max=r.NEGATIVE_INFINITY}function qn(){}function Bn(){Gn.apply(this),this.item=null;var t=arguments[0],e=arguments[1],n=arguments[2];this.min=t,this.max=e,this.item=n}function zn(){Gn.apply(this),this.node1=null,this.node2=null;var t=arguments[0],e=arguments[1];this.node1=t,this.node2=e,this.buildExtent(this.node1,this.node2)}function Vn(){this.leaves=new I,this.root=null,this.level=0}function kn(){if(this.lines=null,this.isForcedToLineString=!1,1===arguments.length){var t=arguments[0];this.lines=t}else if(2===arguments.length){var e=arguments[0],n=arguments[1];this.lines=e,this.isForcedToLineString=n}}function Yn(){this.items=new I}function Un(){this.index=null;var t=arguments[0];if(!R(t,Rt))throw new i("Argument must be Polygonal");this.index=new Hn(t)}function Xn(){this.counter=null;var t=arguments[0];this.counter=t}function Hn(){this.index=new Vn;var t=arguments[0];this.init(t)}function Wn(){this.coord=null,this.segmentIndex=null,this.dist=null;var t=arguments[0],e=arguments[1],n=arguments[2];this.coord=new g(t),this.segmentIndex=e,this.dist=n}function jn(){this.nodeMap=new rt,this.edge=null;var t=arguments[0];this.edge=t}function Kn(){}function Zn(){this.e=null,this.pts=null,this.startIndex=null,this.env1=new C,this.env2=new C;var t=arguments[0];this.e=t,this.pts=t.getCoordinates();var e=new Kn;this.startIndex=e.getChainStartIndices(this.pts)}function Qn(){this.depth=Array(2).fill().map(function(){return Array(3)});for(var t=0;2>t;t++)for(var e=0;3>e;e++)this.depth[t][e]=Qn.NULL_VALUE}function Jn(){if(mn.apply(this),this.pts=null,this.env=null,this.eiList=new jn(this),this.name=null,this.mce=null,this._isIsolated=!0,this.depth=new Qn,this.depthDelta=0,1===arguments.length){var t=arguments[0];Jn.call(this,t,null)}else if(2===arguments.length){var e=arguments[0],n=arguments[1];this.pts=e,this.label=n}}function $n(){if(Cn.apply(this),this.parentGeom=null,this.lineEdgeMap=new te,this.boundaryNodeRule=null,this.useBoundaryDeterminationRule=!0,this.argIndex=null,this.boundaryNodes=null,this._hasTooFewPoints=!1,this.invalidPoint=null,this.areaPtLocator=null,this.ptLocator=new Te,2===arguments.length){var t=arguments[0],e=arguments[1];$n.call(this,t,e,V.OGC_SFS_BOUNDARY_RULE)}else if(3===arguments.length){var n=arguments[0],i=arguments[1],r=arguments[2];this.argIndex=n,this.parentGeom=i,this.boundaryNodeRule=r,null!==i&&this.add(i)}}function ti(){if(this.li=new ae,this.resultPrecisionModel=null,this.arg=null,1===arguments.length){var t=arguments[0];this.setComputationPrecision(t.getPrecisionModel()),this.arg=new Array(1).fill(null),this.arg[0]=new $n(0,t)}else if(2===arguments.length){var e=arguments[0],n=arguments[1];ti.call(this,e,n,V.OGC_SFS_BOUNDARY_RULE)}else if(3===arguments.length){var i=arguments[0],r=arguments[1],s=arguments[2];i.getPrecisionModel().compareTo(r.getPrecisionModel())>=0?this.setComputationPrecision(i.getPrecisionModel()):this.setComputationPrecision(r.getPrecisionModel()),this.arg=new Array(2).fill(null),this.arg[0]=new $n(0,i,s),this.arg[1]=new $n(1,r,s)}}function ei(){this.pts=null,this._orientation=null;var t=arguments[0];this.pts=t,this._orientation=ei.orientation(t)}function ni(){this.edges=new I,this.ocaMap=new rt}function ii(){this.ptLocator=new Te,this.geomFact=null,this.resultGeom=null,this.graph=null,this.edgeList=new ni,this.resultPolyList=new I,this.resultLineList=new I,this.resultPointList=new I;var t=arguments[0],e=arguments[1];ti.call(this,t,e),this.graph=new Cn(new On),this.geomFact=t.getFactory()}function ri(){this.geom=new Array(2).fill(null),this.snapTolerance=null,this.cbr=null;var t=arguments[0],e=arguments[1];this.geom[0]=t,this.geom[1]=e,this.computeSnapTolerance()}function si(){this.geom=new Array(2).fill(null);var t=arguments[0],e=arguments[1];this.geom[0]=t,this.geom[1]=e}function oi(){this.factory=null,this.interiorPoint=null,this.maxWidth=0;var t=arguments[0];this.factory=t.getFactory(),this.add(t)}function ai(){this.poly=null,this.centreY=null,this.hiY=r.MAX_VALUE,this.loY=-r.MAX_VALUE;var t=arguments[0];this.poly=t,this.hiY=t.getEnvelopeInternal().getMaxY(),this.loY=t.getEnvelopeInternal().getMinY(),this.centreY=oi.avg(this.loY,this.hiY)}function ui(){this.centroid=null,this.minDistance=r.MAX_VALUE,this.interiorPoint=null;var t=arguments[0];this.centroid=t.getCentroid().getCoordinate(),this.addInterior(t),null===this.interiorPoint&&this.addEndpoints(t)}function li(){this.centroid=null,this.minDistance=r.MAX_VALUE,this.interiorPoint=null;var t=arguments[0];this.centroid=t.getCentroid().getCoordinate(),this.add(t)}function hi(){}function ci(){this.p0=null,this.p1=null,this.p2=null;var t=arguments[0],e=arguments[1],n=arguments[2];this.p0=t,this.p1=e,this.p2=n}function fi(){this.input=null,this.extremalPts=null,this.centre=null,this.radius=0;var t=arguments[0];this.input=t}function gi(){if(this.inputGeom=null,this.isConvex=null,this.convexHullPts=null,this.minBaseSeg=new ce,this.minWidthPt=null,this.minPtIndex=null,this.minWidth=0,1===arguments.length){var t=arguments[0];gi.call(this,t,!1)}else if(2===arguments.length){var e=arguments[0],n=arguments[1];this.inputGeom=e,this.isConvex=n}}function di(){this.inputGeom=null,this.distanceTolerance=null;var t=arguments[0];this.inputGeom=t}function pi(){xe.apply(this),this.distanceTolerance=null;var t=arguments[0];this.distanceTolerance=t}function vi(){this._orig=null,this._sym=null,this._next=null;var t=arguments[0];this._orig=t}function mi(){this._isMarked=!1;var t=arguments[0];vi.call(this,t)}function yi(){this.vertexMap=new te}function xi(){this._isStart=!1;var t=arguments[0];mi.call(this,t)}function Ei(){yi.apply(this)}function Ii(){this.result=null,this.factory=null,this.graph=null,this.lines=new I,this.nodeEdgeStack=new pe,this.ringStartEdge=null,this.graph=new Ei}function Ni(){this.items=new I,this.subnode=new Array(4).fill(null)}function Ci(){}function Si(t,e){var n,i,r,s,o={32:{d:127,c:128,b:0,a:0},64:{d:32752,c:0,b:0,a:0}},a={32:8,64:11}[t];if(s||(n=0>e||0>1/e,isFinite(e)||(s=o[t],n&&(s.d+=1<<t/4-1),i=Math.pow(2,a)-1,r=0)),!s){for(i={32:127,64:1023}[t],r=Math.abs(e);r>=2;)i++,r/=2;for(;1>r&&i>0;)i--,r*=2;0>=i&&(r/=2),32===t&&i>254&&(s={d:n?255:127,c:128,b:0,a:0},i=Math.pow(2,a)-1,r=0)}return i}function wi(){this.pt=new g,this.level=0,this.env=null;var t=arguments[0];this.computeKey(t)}function Li(){Ni.apply(this),this.env=null,this.centrex=null,this.centrey=null,this.level=null;var t=arguments[0],e=arguments[1];this.env=t,this.level=e,this.centrex=(t.getMinX()+t.getMaxX())/2,this.centrey=(t.getMinY()+t.getMaxY())/2}function Ri(){}function Ti(){Ni.apply(this)}function Pi(){this.root=null,this.minExtent=1,this.root=new Ti}function bi(t){this.geometryFactory=t||new ie}function Oi(t){this.geometryFactory=t||new ie,this.precisionModel=this.geometryFactory.getPrecisionModel(),this.parser=new bi(this.geometryFactory)}function _i(){this.parser=new bi(this.geometryFactory)}function Mi(t){this.geometryFactory=t||new ie,this.precisionModel=this.geometryFactory.getPrecisionModel(),this.parser=new re(this.geometryFactory)}function Di(t){return[t.x,t.y]}function Ai(t){this.geometryFactory=t||new ie}function Fi(){if(this.noder=null,this.scaleFactor=null,this.offsetX=null,this.offsetY=null,this.isScaled=!1,2===arguments.length){var t=arguments[0],e=arguments[1];Fi.call(this,t,e,0,0)}else if(4===arguments.length){var n=arguments[0],i=arguments[1];arguments[2],arguments[3];this.noder=n,this.scaleFactor=i,this.isScaled=!this.isIntegerPrecision()}}function Gi(){if(this.inputGeom=null,this.isClosedEndpointsInInterior=!0,this.nonSimpleLocation=null,1===arguments.length){var t=arguments[0];this.inputGeom=t}else if(2===arguments.length){var e=arguments[0],n=arguments[1];this.inputGeom=e,this.isClosedEndpointsInInterior=!n.isInBoundary(2)}}function qi(){this.pt=null,this.isClosed=null,this.degree=null;var t=arguments[0];this.pt=t,this.isClosed=!1,this.degree=0}function Bi(){if(this.quadrantSegments=Bi.DEFAULT_QUADRANT_SEGMENTS,this.endCapStyle=Bi.CAP_ROUND,this.joinStyle=Bi.JOIN_ROUND,this.mitreLimit=Bi.DEFAULT_MITRE_LIMIT,this._isSingleSided=!1,this.simplifyFactor=Bi.DEFAULT_SIMPLIFY_FACTOR,0===arguments.length);else if(1===arguments.length){var t=arguments[0];this.setQuadrantSegments(t)}else if(2===arguments.length){var e=arguments[0],n=arguments[1];this.setQuadrantSegments(e),this.setEndCapStyle(n)}else if(4===arguments.length){var i=arguments[0],r=arguments[1],s=arguments[2],o=arguments[3];this.setQuadrantSegments(i),this.setEndCapStyle(r),this.setJoinStyle(s),this.setMitreLimit(o)}}function zi(){this.minIndex=-1,this.minCoord=null,this.minDe=null,this.orientedDe=null}function Vi(){this.array_=[]}function ki(){this.finder=null,this.dirEdgeList=new I,this.nodes=new I,this.rightMostCoord=null,this.env=null,this.finder=new zi}function Yi(){this.inputLine=null,
this.distanceTol=null,this.isDeleted=null,this.angleOrientation=he.COUNTERCLOCKWISE;var t=arguments[0];this.inputLine=t}function Ui(){this.ptList=null,this.precisionModel=null,this.minimimVertexDistance=0,this.ptList=new I}function Xi(){this.maxCurveSegmentError=0,this.filletAngleQuantum=null,this.closingSegLengthFactor=1,this.segList=null,this.distance=0,this.precisionModel=null,this.bufParams=null,this.li=null,this.s0=null,this.s1=null,this.s2=null,this.seg0=new ce,this.seg1=new ce,this.offset0=new ce,this.offset1=new ce,this.side=0,this._hasNarrowConcaveAngle=!1;var t=arguments[0],e=arguments[1],n=arguments[2];this.precisionModel=t,this.bufParams=e,this.li=new ae,this.filletAngleQuantum=Math.PI/2/e.getQuadrantSegments(),e.getQuadrantSegments()>=8&&e.getJoinStyle()===Bi.JOIN_ROUND&&(this.closingSegLengthFactor=Xi.MAX_CLOSING_SEG_LEN_FACTOR),this.init(n)}function Hi(){this.distance=0,this.precisionModel=null,this.bufParams=null;var t=arguments[0],e=arguments[1];this.precisionModel=t,this.bufParams=e}function Wi(){this.subgraphs=null,this.seg=new ce,this.cga=new he;var t=arguments[0];this.subgraphs=t}function ji(){this.upwardSeg=null,this.leftDepth=null;var t=arguments[0],e=arguments[1];this.upwardSeg=new ce(t),this.leftDepth=e}function Ki(){this.inputGeom=null,this.distance=null,this.curveBuilder=null,this.curveList=new I;var t=arguments[0],e=arguments[1],n=arguments[2];this.inputGeom=t,this.distance=e,this.curveBuilder=n}function Zi(){this._hasIntersection=!1,this.hasProper=!1,this.hasProperInterior=!1,this.hasInterior=!1,this.properIntersectionPoint=null,this.li=null,this.isSelfIntersection=null,this.numIntersections=0,this.numInteriorIntersections=0,this.numProperIntersections=0,this.numTests=0;var t=arguments[0];this.li=t}function Qi(){this.bufParams=null,this.workingPrecisionModel=null,this.workingNoder=null,this.geomFact=null,this.graph=null,this.edgeList=new ni;var t=arguments[0];this.bufParams=t}function Ji(){this.li=new ae,this.segStrings=null;var t=arguments[0];this.segStrings=t}function $i(){this.li=null,this.pt=null,this.originalPt=null,this.ptScaled=null,this.p0Scaled=null,this.p1Scaled=null,this.scaleFactor=null,this.minx=null,this.maxx=null,this.miny=null,this.maxy=null,this.corner=new Array(4).fill(null),this.safeEnv=null;var t=arguments[0],e=arguments[1],n=arguments[2];if(this.originalPt=t,this.pt=t,this.scaleFactor=e,this.li=n,0>=e)throw new i("Scale factor must be non-zero");1!==e&&(this.pt=new g(this.scale(t.x),this.scale(t.y)),this.p0Scaled=new g,this.p1Scaled=new g),this.initCorners(this.pt)}function tr(){this.tempEnv1=new C,this.selectedSegment=new ce}function er(){this.index=null;var t=arguments[0];this.index=t}function nr(){tr.apply(this),this.hotPixel=null,this.parentEdge=null,this.hotPixelVertexIndex=null,this._isNodeAdded=!1;var t=arguments[0],e=arguments[1],n=arguments[2];this.hotPixel=t,this.parentEdge=e,this.hotPixelVertexIndex=n}function ir(){this.li=null,this.interiorIntersections=null;var t=arguments[0];this.li=t,this.interiorIntersections=new I}function rr(){this.pm=null,this.li=null,this.scaleFactor=null,this.noder=null,this.pointSnapper=null,this.nodedSegStrings=null;var t=arguments[0];this.pm=t,this.li=new ae,this.li.setPrecisionModel(t),this.scaleFactor=t.getScale()}function sr(){if(this.argGeom=null,this.distance=null,this.bufParams=new Bi,this.resultGeometry=null,this.saveException=null,1===arguments.length){var t=arguments[0];this.argGeom=t}else if(2===arguments.length){var e=arguments[0],n=arguments[1];this.argGeom=e,this.bufParams=n}}function or(){this.comps=null;var t=arguments[0];this.comps=t}function ar(){if(this.component=null,this.segIndex=null,this.pt=null,2===arguments.length){var t=arguments[0],e=arguments[1];ar.call(this,t,ar.INSIDE_AREA,e)}else if(3===arguments.length){var n=arguments[0],i=arguments[1],r=arguments[2];this.component=n,this.segIndex=i,this.pt=r}}function ur(){this.pts=null;var t=arguments[0];this.pts=t}function lr(){this.locations=null;var t=arguments[0];this.locations=t}function hr(){if(this.geom=null,this.terminateDistance=0,this.ptLocator=new Te,this.minDistanceLocation=null,this.minDistance=r.MAX_VALUE,2===arguments.length){var t=arguments[0],e=arguments[1];hr.call(this,t,e,0)}else if(3===arguments.length){var n=arguments[0],i=arguments[1],s=arguments[2];this.geom=new Array(2).fill(null),this.geom[0]=n,this.geom[1]=i,this.terminateDistance=s}}function cr(){this.factory=null,this.directedEdges=new I,this.coordinates=null;var t=arguments[0];this.factory=t}function fr(){this._isMarked=!1,this._isVisited=!1,this.data=null}function gr(){fr.apply(this),this.parentEdge=null,this.from=null,this.to=null,this.p0=null,this.p1=null,this.sym=null,this.edgeDirection=null,this.quadrant=null,this.angle=null;var t=arguments[0],e=arguments[1],n=arguments[2],i=arguments[3];this.from=t,this.to=e,this.edgeDirection=i,this.p0=t.getCoordinate(),this.p1=n;var r=this.p1.x-this.p0.x,s=this.p1.y-this.p0.y;this.quadrant=Je.quadrant(r,s),this.angle=Math.atan2(s,r)}function dr(){var t=arguments[0],e=arguments[1],n=arguments[2],i=arguments[3];gr.call(this,t,e,n,i)}function pr(){if(fr.apply(this),this.dirEdge=null,0===arguments.length);else if(2===arguments.length){var t=arguments[0],e=arguments[1];this.setDirectedEdges(t,e)}}function vr(){this.outEdges=new I,this.sorted=!1}function mr(){if(fr.apply(this),this.pt=null,this.deStar=null,1===arguments.length){var t=arguments[0];mr.call(this,t,new vr)}else if(2===arguments.length){var e=arguments[0],n=arguments[1];this.pt=e,this.deStar=n}}function yr(){pr.apply(this),this.line=null;var t=arguments[0];this.line=t}function xr(){this.nodeMap=new rt}function Er(){this.edges=new J,this.dirEdges=new J,this.nodeMap=new xr}function Ir(){Er.apply(this)}function Nr(){this.graph=new Ir,this.mergedLineStrings=null,this.factory=null,this.edgeStrings=null}function Cr(){this.edgeRing=null,this.next=null,this.label=-1;var t=arguments[0],e=arguments[1],n=arguments[2],i=arguments[3];gr.call(this,t,e,n,i)}function Sr(){pr.apply(this),this.line=null;var t=arguments[0];this.line=t}function wr(){this.factory=null,this.deList=new I,this.lowestEdge=null,this.ring=null,this.ringPts=null,this.holes=null,this.shell=null,this._isHole=null,this._isProcessed=!1,this._isIncludedSet=!1,this._isIncluded=!1;var t=arguments[0];this.factory=t}function Lr(){}function Rr(){Er.apply(this),this.factory=null;var t=arguments[0];this.factory=t}function Tr(){if(this.lineStringAdder=new Pr(this),this.graph=null,this.dangles=new I,this.cutEdges=new I,this.invalidRingLines=new I,this.holeList=null,this.shellList=null,this.polyList=null,this.isCheckingRingsValid=!0,this.extractOnlyPolygonal=null,this.geomFactory=null,0===arguments.length)Tr.call(this,!1);else if(1===arguments.length){var t=arguments[0];this.extractOnlyPolygonal=t}}function Pr(){this.p=null;var t=arguments[0];this.p=t}function br(){}function Or(){if(this.edgeEnds=new I,1===arguments.length){var t=arguments[0];Or.call(this,null,t)}else if(2===arguments.length){var e=(arguments[0],arguments[1]);En.call(this,e.getEdge(),e.getCoordinate(),e.getDirectedCoordinate(),new gn(e.getLabel())),this.insert(e)}}function _r(){Pn.apply(this)}function Mr(){var t=arguments[0],e=arguments[1];yn.call(this,t,e)}function Dr(){Nn.apply(this)}function Ar(){this.li=new ae,this.ptLocator=new Te,this.arg=null,this.nodes=new xn(new Dr),this.im=null,this.isolatedEdges=new I,this.invalidPoint=null;var t=arguments[0];this.arg=t}function Fr(){this.rectEnv=null;var t=arguments[0];this.rectEnv=t.getEnvelopeInternal()}function Gr(){this.li=new ae,this.rectEnv=null,this.diagUp0=null,this.diagUp1=null,this.diagDown0=null,this.diagDown1=null;var t=arguments[0];this.rectEnv=t,this.diagUp0=new g(t.getMinX(),t.getMinY()),this.diagUp1=new g(t.getMaxX(),t.getMaxY()),this.diagDown0=new g(t.getMinX(),t.getMaxY()),this.diagDown1=new g(t.getMaxX(),t.getMinY())}function qr(){this._isDone=!1}function Br(){this.rectangle=null,this.rectEnv=null;var t=arguments[0];this.rectangle=t,this.rectEnv=t.getEnvelopeInternal()}function zr(){qr.apply(this),this.rectEnv=null,this._intersects=!1;var t=arguments[0];this.rectEnv=t}function Vr(){qr.apply(this),this.rectSeq=null,this.rectEnv=null,this._containsPoint=!1;var t=arguments[0];this.rectSeq=t.getExteriorRing().getCoordinateSequence(),this.rectEnv=t.getEnvelopeInternal()}function kr(){qr.apply(this),this.rectEnv=null,this.rectIntersector=null,this.hasIntersection=!1,this.p0=new g,this.p1=new g;var t=arguments[0];this.rectEnv=t.getEnvelopeInternal(),this.rectIntersector=new Gr(this.rectEnv)}function Yr(){if(this._relate=null,2===arguments.length){var t=arguments[0],e=arguments[1];ti.call(this,t,e),this._relate=new Ar(this.arg)}else if(3===arguments.length){var n=arguments[0],i=arguments[1],r=arguments[2];ti.call(this,n,i,r),this._relate=new Ar(this.arg)}}function Ur(){this.geomFactory=null,this.skipEmpty=!1,this.inputGeoms=null;var t=arguments[0];this.geomFactory=Ur.extractFactory(t),this.inputGeoms=t}function Xr(){this.pointGeom=null,this.otherGeom=null,this.geomFact=null;var t=arguments[0],e=arguments[1];this.pointGeom=t,this.otherGeom=e,this.geomFact=e.getFactory()}function Hr(){this.sortIndex=-1,this.comps=null;var t=arguments[0],e=arguments[1];this.sortIndex=t,this.comps=e}function Wr(){this.inputPolys=null,this.geomFactory=null;var t=arguments[0];this.inputPolys=t,null===this.inputPolys&&(this.inputPolys=new I)}function jr(){if(this.polygons=new I,this.lines=new I,this.points=new I,this.geomFact=null,1===arguments.length){if(R(arguments[0],v)){var t=arguments[0];this.extract(t)}else if(arguments[0]instanceof B){var e=arguments[0];this.extract(e)}}else if(2===arguments.length){var n=arguments[0],i=arguments[1];this.geomFact=i,this.extract(n)}}function Kr(){this.geometryFactory=new ie,this.geomGraph=null,this.disconnectedRingcoord=null;var t=arguments[0];this.geomGraph=t}function Zr(){this.items=new I,this.subnode=[null,null]}function Qr(){if(this.min=null,this.max=null,0===arguments.length)this.min=0,this.max=0;else if(1===arguments.length){var t=arguments[0];this.init(t.min,t.max)}else if(2===arguments.length){var e=arguments[0],n=arguments[1];this.init(e,n)}}function Jr(){this.pt=0,this.level=0,this.interval=null;var t=arguments[0];this.computeKey(t)}function $r(){Zr.apply(this),this.interval=null,this.centre=null,this.level=null;var t=arguments[0],e=arguments[1];this.interval=t,this.level=e,this.centre=(t.getMin()+t.getMax())/2}function ts(){Zr.apply(this)}function es(){this.root=null,this.minExtent=1,this.root=new ts}function ns(){}function is(){this.ring=null,this.tree=null,this.crossings=0,this.interval=new Qr;var t=arguments[0];this.ring=t,this.buildIndex()}function rs(){tr.apply(this),this.mcp=null,this.p=null;var t=arguments[0],e=arguments[1];this.mcp=t,this.p=e}function ss(){this.nodes=new xn(new Dr)}function os(){this.li=new ae,this.geomGraph=null,this.nodeGraph=new ss,this.invalidPoint=null;var t=arguments[0];this.geomGraph=t}function as(){this.graph=null,this.rings=new I,this.totalEnv=new C,this.index=null,this.nestedPt=null;var t=arguments[0];this.graph=t}function us(){if(this.errorType=null,this.pt=null,1===arguments.length){var t=arguments[0];us.call(this,t,null)}else if(2===arguments.length){var e=arguments[0],n=arguments[1];this.errorType=e,null!==n&&(this.pt=n.copy())}}function ls(){this.parentGeometry=null,this.isSelfTouchingRingFormingHoleValid=!1,this.validErr=null;var t=arguments[0];this.parentGeometry=t}function hs(){_t.CoordinateOperation.apply(this),this.targetPM=null,this.removeCollapsed=!0;var t=arguments[0],e=arguments[1];this.targetPM=t,this.removeCollapsed=e}function cs(){this.targetPM=null,this.removeCollapsed=!0,this.changePrecisionModel=!1,this.isPointwise=!1;var t=arguments[0];this.targetPM=t}function fs(){this.pts=null,this.usePt=null,this.distanceTolerance=null,this.seg=new ce;var t=arguments[0];this.pts=t}function gs(){this.inputGeom=null,this.distanceTolerance=null,this.isEnsureValidTopology=!0;var t=arguments[0];this.inputGeom=t}function ds(){xe.apply(this),this.isEnsureValidTopology=!0,this.distanceTolerance=null;var t=arguments[0],e=arguments[1];this.isEnsureValidTopology=t,this.distanceTolerance=e}function ps(){if(this.parent=null,this.index=null,2===arguments.length){var t=arguments[0],e=arguments[1];ps.call(this,t,e,null,-1)}else if(4===arguments.length){var n=arguments[0],i=arguments[1],r=arguments[2],s=arguments[3];ce.call(this,n,i),this.parent=r,this.index=s}}function vs(){if(this.parentLine=null,this.segs=null,this.resultSegs=new I,this.minimumSize=null,1===arguments.length){var t=arguments[0];vs.call(this,t,2)}else if(2===arguments.length){var e=arguments[0],n=arguments[1];this.parentLine=e,this.minimumSize=n,this.init()}}function ms(){this.index=new Pi}function ys(){this.querySeg=null,this.items=new I;var t=arguments[0];this.querySeg=t}function xs(){this.li=new ae,this.inputIndex=new ms,this.outputIndex=new ms,this.line=null,this.linePts=null,this.distanceTolerance=0;var t=arguments[0],e=arguments[1];this.inputIndex=t,this.outputIndex=e}function Es(){this.inputIndex=new ms,this.outputIndex=new ms,this.distanceTolerance=0}function Is(){this.inputGeom=null,this.lineSimplifier=new Es,this.linestringMap=null;var t=arguments[0];this.inputGeom=t}function Ns(){xe.apply(this),this.linestringMap=null;var t=arguments[0];this.linestringMap=t}function Cs(){this.tps=null;var t=arguments[0];this.tps=t}function Ss(){this.seg=null,this.segLen=null,this.splitPt=null,this.minimumLen=0;var t=arguments[0];this.seg=t,this.segLen=t.getLength()}function ws(){}function Ls(){}function Rs(){}function Ts(){if(this.p=null,1===arguments.length){var t=arguments[0];this.p=new g(t)}else if(2===arguments.length){var e=arguments[0],n=arguments[1];this.p=new g(e,n)}else if(3===arguments.length){var i=arguments[0],r=arguments[1],s=arguments[2];this.p=new g(i,r,s)}}function Ps(){this._isOnConstraint=null,this.constraint=null;var t=arguments[0];Ts.call(this,t)}function bs(){this._rot=null,this.vertex=null,this.next=null,this.data=null}function Os(){this.subdiv=null,this.isUsingTolerance=!1;var t=arguments[0];this.subdiv=t,this.isUsingTolerance=t.getTolerance()>0}function _s(){}function Ms(){this.subdiv=null,this.lastEdge=null;var t=arguments[0];this.subdiv=t,this.init()}function Ds(){if(this.seg=null,1===arguments.length){if("string"==typeof arguments[0]){var t=arguments[0];l.call(this,t)}else if(arguments[0]instanceof ce){var e=arguments[0];l.call(this,"Locate failed to converge (at edge: "+e+").  Possible causes include invalid Subdivision topology or very close sites"),this.seg=new ce(e)}}else if(2===arguments.length){var n=arguments[0],i=arguments[1];l.call(this,Ds.msgWithSpatial(n,i)),this.seg=new ce(i)}}function As(){}function Fs(){this.visitedKey=0,this.quadEdges=new I,this.startingEdge=null,this.tolerance=null,this.edgeCoincidenceTolerance=null,this.frameVertex=new Array(3).fill(null),this.frameEnv=null,this.locator=null,this.seg=new ce,this.triEdges=new Array(3).fill(null);var t=arguments[0],e=arguments[1];this.tolerance=e,this.edgeCoincidenceTolerance=e/Fs.EDGE_COINCIDENCE_TOL_FACTOR,this.createFrame(t),this.startingEdge=this.initSubdiv(),this.locator=new Ms(this)}function Gs(){}function qs(){this.triList=new I}function Bs(){this.triList=new I}function zs(){this.coordList=new N,this.triCoords=new I}function Vs(){if(this.ls=null,this.data=null,2===arguments.length){var t=arguments[0],e=arguments[1];this.ls=new ce(t,e)}else if(3===arguments.length){var n=arguments[0],i=arguments[1],r=arguments[2];this.ls=new ce(n,i),this.data=r}else if(6===arguments.length){var s=arguments[0],o=arguments[1],a=arguments[2],u=arguments[3],l=arguments[4],h=arguments[5];Vs.call(this,new g(s,o,a),new g(u,l,h))}else if(7===arguments.length){var c=arguments[0],f=arguments[1],d=arguments[2],p=arguments[3],v=arguments[4],m=arguments[5],y=arguments[6];Vs.call(this,new g(c,f,d),new g(p,v,m),y)}}function ks(){}function Ys(){if(this.p=null,this.data=null,this.left=null,this.right=null,this.count=null,2===arguments.length){var t=arguments[0],e=arguments[1];this.p=new g(t),this.left=null,this.right=null,this.count=1,this.data=e}else if(3===arguments.length){var n=arguments[0],i=arguments[1],r=arguments[2];this.p=new g(n,i),this.left=null,this.right=null,this.count=1,this.data=r}}function Us(){if(this.root=null,this.numberOfNodes=null,this.tolerance=null,0===arguments.length)Us.call(this,0);else if(1===arguments.length){var t=arguments[0];this.tolerance=t}}function Xs(){this.tolerance=null,this.matchNode=null,this.matchDist=0,this.p=null;var t=arguments[0],e=arguments[1];this.p=t,this.tolerance=e}function Hs(){this.initialVertices=null,this.segVertices=null,this.segments=new I,this.subdiv=null,this.incDel=null,this.convexHull=null,this.splitFinder=new Ls,this.kdt=null,this.vertexFactory=null,this.computeAreaEnv=null,this.splitPt=null,this.tolerance=null;var t=arguments[0],e=arguments[1];this.initialVertices=new I(t),this.tolerance=e,this.kdt=new Us(e)}function Ws(){this.siteCoords=null,this.tolerance=0,this.subdiv=null}function js(){this.siteCoords=null,this.constraintLines=null,this.tolerance=0,this.subdiv=null,this.constraintVertexMap=new rt}function Ks(){this.siteCoords=null,this.tolerance=0,this.subdiv=null,this.clipEnv=null,this.diagramEnv=null}function Zs(){}Array.prototype.fill||(Array.prototype.fill=function(t){for(var e=Object(this),n=parseInt(e.length,10),i=arguments[1],r=parseInt(i,10)||0,s=0>r?Math.max(n+r,0):Math.min(r,n),o=arguments[2],a=void 0===o?n:parseInt(o,10)||0,u=0>a?Math.max(n+a,0):Math.min(a,n);u>s;s++)e[s]=t;return e}),Number.isFinite=Number.isFinite||function(t){return"number"==typeof t&&isFinite(t)},Number.isInteger=Number.isInteger||function(t){return"number"==typeof t&&isFinite(t)&&Math.floor(t)===t},Number.parseFloat=Number.parseFloat||parseFloat,Number.isNaN=Number.isNaN||function(t){return t!==t},Math.trunc=Math.trunc||function(t){return 0>t?Math.ceil(t):Math.floor(t)},e(n.prototype,{interfaces_:function(){return[]},getClass:function(){return n}}),n.equalsWithTolerance=function(t,e,n){return Math.abs(t-e)<=n},r.isNaN=function(t){return Number.isNaN(t)},r.doubleToLongBits=function(t){return t},r.longBitsToDouble=function(t){return t},r.isInfinite=function(t){return!Number.isFinite(t)},r.MAX_VALUE=Number.MAX_VALUE,h(c,l),e(c.prototype,{interfaces_:function(){return[]},getClass:function(){return c}}),e(f.prototype,{interfaces_:function(){return[]},getClass:function(){return f}}),f.shouldNeverReachHere=function(){if(0===arguments.length)f.shouldNeverReachHere(null);else if(1===arguments.length){var t=arguments[0];throw new c("Should never reach here"+(null!==t?": "+t:""))}},f.isTrue=function(){if(1===arguments.length){var t=arguments[0];f.isTrue(t,null)}else if(2===arguments.length){var e=arguments[0],n=arguments[1];if(!e)throw null===n?new c:new c(n)}},f.equals=function(){if(2===arguments.length){var t=arguments[0],e=arguments[1];f.equals(t,e,null)}else if(3===arguments.length){var n=arguments[0],i=arguments[1],r=arguments[2];if(!i.equals(n))throw new c("Expected "+n+" but encountered "+i+(null!==r?": "+r:""))}},e(g.prototype,{setOrdinate:function(t,e){switch(t){case g.X:this.x=e;break;case g.Y:this.y=e;break;case g.Z:this.z=e;break;default:throw new i("Invalid ordinate index: "+t)}},equals2D:function(){if(1===arguments.length){var t=arguments[0];return this.x!==t.x?!1:this.y===t.y}if(2===arguments.length){var e=arguments[0],i=arguments[1];return n.equalsWithTolerance(this.x,e.x,i)?!!n.equalsWithTolerance(this.y,e.y,i):!1}},getOrdinate:function(t){switch(t){case g.X:return this.x;case g.Y:return this.y;case g.Z:return this.z}throw new i("Invalid ordinate index: "+t)},equals3D:function(t){return this.x===t.x&&this.y===t.y&&(this.z===t.z||r.isNaN(this.z)&&r.isNaN(t.z))},equals:function(t){return t instanceof g?this.equals2D(t):!1},equalInZ:function(t,e){return n.equalsWithTolerance(this.z,t.z,e)},compareTo:function(t){var e=t;return this.x<e.x?-1:this.x>e.x?1:this.y<e.y?-1:this.y>e.y?1:0},clone:function(){try{var t=null;return t}catch(t){if(t instanceof CloneNotSupportedException)return f.shouldNeverReachHere("this shouldn't happen because this class is Cloneable"),null;throw t}finally{}},copy:function(){return new g(this)},toString:function(){return"("+this.x+", "+this.y+", "+this.z+")"},distance3D:function(t){var e=this.x-t.x,n=this.y-t.y,i=this.z-t.z;return Math.sqrt(e*e+n*n+i*i)},distance:function(t){var e=this.x-t.x,n=this.y-t.y;return Math.sqrt(e*e+n*n)},hashCode:function(){var t=17;return t=37*t+g.hashCode(this.x),t=37*t+g.hashCode(this.y)},setCoordinate:function(t){this.x=t.x,this.y=t.y,this.z=t.z},interfaces_:function(){return[s,o,u]},getClass:function(){return g}}),g.hashCode=function(){if(1===arguments.length){var t=arguments[0],e=r.doubleToLongBits(t);return Math.trunc(e^e>>>32)}},e(d.prototype,{compare:function(t,e){var n=t,i=e,r=d.compare(n.x,i.x);if(0!==r)return r;var s=d.compare(n.y,i.y);if(0!==s)return s;if(this.dimensionsToTest<=2)return 0;var o=d.compare(n.z,i.z);return o},interfaces_:function(){return[a]},getClass:function(){return d}}),d.compare=function(t,e){return e>t?-1:t>e?1:r.isNaN(t)?r.isNaN(e)?0:-1:r.isNaN(e)?1:0},g.DimensionalComparator=d,g.serialVersionUID=0x5cbf2c235c7e5800,g.NULL_ORDINATE=r.NaN,g.X=0,g.Y=1,g.Z=2,p.prototype.hasNext=function(){},p.prototype.next=function(){},p.prototype.remove=function(){},v.prototype.add=function(){},v.prototype.addAll=function(){},v.prototype.isEmpty=function(){},v.prototype.iterator=function(){},v.prototype.size=function(){},v.prototype.toArray=function(){},v.prototype.remove=function(){},m.prototype=new Error,m.prototype.name="IndexOutOfBoundsException",y.prototype=Object.create(v.prototype),y.prototype.constructor=y,y.prototype.get=function(){},y.prototype.set=function(){},y.prototype.isEmpty=function(){},x.prototype=new Error,x.prototype.name="NoSuchElementException",E.prototype=new Error,E.prototype.name="OperationNotSupported",I.prototype=Object.create(y.prototype),I.prototype.constructor=I,I.prototype.ensureCapacity=function(){},I.prototype.interfaces_=function(){return[y,v]},I.prototype.add=function(t){return this.array_.push(t),!0},I.prototype.clear=function(){this.array_=[]},I.prototype.addAll=function(t){for(var e=t.iterator();e.hasNext();)this.add(e.next());return!0},I.prototype.set=function(t,e){var n=this.array_[t];return this.array_[t]=e,n},I.prototype.iterator=function(){return new Qs(this)},I.prototype.get=function(t){if(0>t||t>=this.size())throw new m;return this.array_[t]},I.prototype.isEmpty=function(){return 0===this.array_.length},I.prototype.size=function(){return this.array_.length},I.prototype.toArray=function(){for(var t=[],e=0,n=this.array_.length;n>e;e++)t.push(this.array_[e]);return t},I.prototype.remove=function(t){for(var e=!1,n=0,i=this.array_.length;i>n;n++)if(this.array_[n]===t){this.array_.splice(n,1),e=!0;break}return e};var Qs=function(t){this.arrayList_=t,this.position_=0};Qs.prototype.next=function(){if(this.position_===this.arrayList_.size())throw new x;return this.arrayList_.get(this.position_++)},Qs.prototype.hasNext=function(){return this.position_<this.arrayList_.size()},Qs.prototype.set=function(t){return this.arrayList_.set(this.position_-1,t)},Qs.prototype.remove=function(){throw new E},h(N,I),e(N.prototype,{getCoordinate:function(t){return this.get(t)},addAll:function(){if(2===arguments.length){for(var t=arguments[0],e=arguments[1],n=!1,i=t.iterator();i.hasNext();)this.add(i.next(),e),n=!0;return n}return I.prototype.addAll.apply(this,arguments)},clone:function t(){for(var t=I.prototype.clone.call(this),e=0;e<this.size();e++)t.add(e,this.get(e).copy());return t},toCoordinateArray:function(){return this.toArray(N.coordArrayType)},add:function(){if(1===arguments.length){var t=arguments[0];I.prototype.add.call(this,t)}else if(2===arguments.length){if(arguments[0]instanceof Array&&"boolean"==typeof arguments[1]){var e=arguments[0],n=arguments[1];return this.add(e,n,!0),!0}if(arguments[0]instanceof g&&"boolean"==typeof arguments[1]){var i=arguments[0],r=arguments[1];if(!r&&this.size()>=1){var s=this.get(this.size()-1);if(s.equals2D(i))return null}I.prototype.add.call(this,i)}else if(arguments[0]instanceof Object&&"boolean"==typeof arguments[1]){var o=arguments[0],a=arguments[1];return this.add(o,a),!0}}else if(3===arguments.length){if("boolean"==typeof arguments[2]&&arguments[0]instanceof Array&&"boolean"==typeof arguments[1]){var u=arguments[0],l=arguments[1],h=arguments[2];if(h)for(var c=0;c<u.length;c++)this.add(u[c],l);else for(var c=u.length-1;c>=0;c--)this.add(u[c],l);return!0}if("boolean"==typeof arguments[2]&&Number.isInteger(arguments[0])&&arguments[1]instanceof g){var f=arguments[0],d=arguments[1],p=arguments[2];if(!p){var v=this.size();if(v>0){if(f>0){var m=this.get(f-1);if(m.equals2D(d))return null}if(v>f){var y=this.get(f);if(y.equals2D(d))return null}}}I.prototype.add.call(this,f,d)}}else if(4===arguments.length){var x=arguments[0],E=arguments[1],N=arguments[2],C=arguments[3],S=1;N>C&&(S=-1);for(var c=N;c!==C;c+=S)this.add(x[c],E);return!0}},closeRing:function(){this.size()>0&&this.add(new g(this.get(0)),!1)},interfaces_:function(){return[]},getClass:function(){return N}}),N.coordArrayType=new Array(0).fill(null),e(C.prototype,{getArea:function(){return this.getWidth()*this.getHeight()},equals:function(t){if(!(t instanceof C))return!1;var e=t;return this.isNull()?e.isNull():this.maxx===e.getMaxX()&&this.maxy===e.getMaxY()&&this.minx===e.getMinX()&&this.miny===e.getMinY()},intersection:function(t){if(this.isNull()||t.isNull()||!this.intersects(t))return new C;var e=this.minx>t.minx?this.minx:t.minx,n=this.miny>t.miny?this.miny:t.miny,i=this.maxx<t.maxx?this.maxx:t.maxx,r=this.maxy<t.maxy?this.maxy:t.maxy;return new C(e,i,n,r)},isNull:function(){return this.maxx<this.minx},getMaxX:function(){return this.maxx},covers:function(){if(1===arguments.length){if(arguments[0]instanceof g){var t=arguments[0];return this.covers(t.x,t.y)}if(arguments[0]instanceof C){var e=arguments[0];return this.isNull()||e.isNull()?!1:e.getMinX()>=this.minx&&e.getMaxX()<=this.maxx&&e.getMinY()>=this.miny&&e.getMaxY()<=this.maxy}}else if(2===arguments.length){var n=arguments[0],i=arguments[1];return this.isNull()?!1:n>=this.minx&&n<=this.maxx&&i>=this.miny&&i<=this.maxy}},intersects:function(){if(1===arguments.length){if(arguments[0]instanceof C){var t=arguments[0];return this.isNull()||t.isNull()?!1:!(t.minx>this.maxx||t.maxx<this.minx||t.miny>this.maxy||t.maxy<this.miny)}if(arguments[0]instanceof g){var e=arguments[0];return this.intersects(e.x,e.y)}}else if(2===arguments.length){var n=arguments[0],i=arguments[1];return this.isNull()?!1:!(n>this.maxx||n<this.minx||i>this.maxy||i<this.miny)}},getMinY:function(){return this.miny},getMinX:function(){return this.minx},expandToInclude:function(){if(1===arguments.length){if(arguments[0]instanceof g){var t=arguments[0];this.expandToInclude(t.x,t.y)}else if(arguments[0]instanceof C){var e=arguments[0];if(e.isNull())return null;this.isNull()?(this.minx=e.getMinX(),this.maxx=e.getMaxX(),this.miny=e.getMinY(),this.maxy=e.getMaxY()):(e.minx<this.minx&&(this.minx=e.minx),e.maxx>this.maxx&&(this.maxx=e.maxx),e.miny<this.miny&&(this.miny=e.miny),e.maxy>this.maxy&&(this.maxy=e.maxy))}}else if(2===arguments.length){var n=arguments[0],i=arguments[1];this.isNull()?(this.minx=n,this.maxx=n,this.miny=i,this.maxy=i):(n<this.minx&&(this.minx=n),n>this.maxx&&(this.maxx=n),i<this.miny&&(this.miny=i),i>this.maxy&&(this.maxy=i))}},minExtent:function(){if(this.isNull())return 0;var t=this.getWidth(),e=this.getHeight();return e>t?t:e},getWidth:function(){return this.isNull()?0:this.maxx-this.minx},compareTo:function(t){var e=t;return this.isNull()?e.isNull()?0:-1:e.isNull()?1:this.minx<e.minx?-1:this.minx>e.minx?1:this.miny<e.miny?-1:this.miny>e.miny?1:this.maxx<e.maxx?-1:this.maxx>e.maxx?1:this.maxy<e.maxy?-1:this.maxy>e.maxy?1:0},translate:function(t,e){return this.isNull()?null:void this.init(this.getMinX()+t,this.getMaxX()+t,this.getMinY()+e,this.getMaxY()+e)},toString:function(){return"Env["+this.minx+" : "+this.maxx+", "+this.miny+" : "+this.maxy+"]"},setToNull:function(){this.minx=0,this.maxx=-1,this.miny=0,this.maxy=-1},getHeight:function(){return this.isNull()?0:this.maxy-this.miny},maxExtent:function(){if(this.isNull())return 0;var t=this.getWidth(),e=this.getHeight();return t>e?t:e},expandBy:function(){if(1===arguments.length){var t=arguments[0];this.expandBy(t,t)}else if(2===arguments.length){var e=arguments[0],n=arguments[1];if(this.isNull())return null;this.minx-=e,this.maxx+=e,this.miny-=n,this.maxy+=n,(this.minx>this.maxx||this.miny>this.maxy)&&this.setToNull()}},contains:function(){if(1===arguments.length){if(arguments[0]instanceof C){var t=arguments[0];return this.covers(t)}if(arguments[0]instanceof g){var e=arguments[0];return this.covers(e)}}else if(2===arguments.length){var n=arguments[0],i=arguments[1];return this.covers(n,i)}},centre:function(){return this.isNull()?null:new g((this.getMinX()+this.getMaxX())/2,(this.getMinY()+this.getMaxY())/2)},init:function(){if(0===arguments.length)this.setToNull();else if(1===arguments.length){if(arguments[0]instanceof g){var t=arguments[0];this.init(t.x,t.x,t.y,t.y)}else if(arguments[0]instanceof C){var e=arguments[0];this.minx=e.minx,this.maxx=e.maxx,this.miny=e.miny,this.maxy=e.maxy}}else if(2===arguments.length){var n=arguments[0],i=arguments[1];this.init(n.x,i.x,n.y,i.y)}else if(4===arguments.length){var r=arguments[0],s=arguments[1],o=arguments[2],a=arguments[3];s>r?(this.minx=r,this.maxx=s):(this.minx=s,this.maxx=r),a>o?(this.miny=o,this.maxy=a):(this.miny=a,this.maxy=o)}},getMaxY:function(){return this.maxy},distance:function(t){if(this.intersects(t))return 0;var e=0;this.maxx<t.minx?e=t.minx-this.maxx:this.minx>t.maxx&&(e=this.minx-t.maxx);var n=0;return this.maxy<t.miny?n=t.miny-this.maxy:this.miny>t.maxy&&(n=this.miny-t.maxy),0===e?n:0===n?e:Math.sqrt(e*e+n*n)},hashCode:function(){var t=17;return t=37*t+g.hashCode(this.minx),t=37*t+g.hashCode(this.maxx),t=37*t+g.hashCode(this.miny),t=37*t+g.hashCode(this.maxy)},interfaces_:function(){return[s,u]},getClass:function(){return C}}),C.intersects=function(){if(3===arguments.length){var t=arguments[0],e=arguments[1],n=arguments[2];return n.x>=(t.x<e.x?t.x:e.x)&&n.x<=(t.x>e.x?t.x:e.x)&&n.y>=(t.y<e.y?t.y:e.y)&&n.y<=(t.y>e.y?t.y:e.y)}if(4===arguments.length){var i=arguments[0],r=arguments[1],s=arguments[2],o=arguments[3],a=Math.min(s.x,o.x),u=Math.max(s.x,o.x),l=Math.min(i.x,r.x),h=Math.max(i.x,r.x);return l>u?!1:a>h?!1:(a=Math.min(s.y,o.y),u=Math.max(s.y,o.y),l=Math.min(i.y,r.y),h=Math.max(i.y,r.y),l>u?!1:!(a>h))}},C.serialVersionUID=0x51845cd552189800,h(w,S),e(w.prototype,{interfaces_:function(){return[]},getClass:function(){return w}}),e(L.prototype,{interfaces_:function(){return[]},getClass:function(){return L}}),L.toLocationSymbol=function(t){switch(t){case L.EXTERIOR:return"e";case L.BOUNDARY:return"b";case L.INTERIOR:return"i";case L.NONE:return"-"}throw new i("Unknown location value: "+t)},L.INTERIOR=0,L.BOUNDARY=1,L.EXTERIOR=2,L.NONE=-1,e(T.prototype,{interfaces_:function(){return[]},getClass:function(){return T}}),T.log10=function(t){var e=Math.log(t);return r.isInfinite(e)?e:r.isNaN(e)?e:e/T.LOG_10},T.min=function(t,e,n,i){var r=t;return r>e&&(r=e),r>n&&(r=n),r>i&&(r=i),r},T.clamp=function(){if("number"==typeof arguments[2]&&"number"==typeof arguments[0]&&"number"==typeof arguments[1]){var t=arguments[0],e=arguments[1],n=arguments[2];return e>t?e:t>n?n:t}if(Number.isInteger(arguments[2])&&Number.isInteger(arguments[0])&&Number.isInteger(arguments[1])){var i=arguments[0],r=arguments[1],s=arguments[2];return r>i?r:i>s?s:i}},T.wrap=function(t,e){return 0>t?e- -t%e:t%e},T.max=function(){if(3===arguments.length){var t=arguments[0],e=arguments[1],n=arguments[2],i=t;return e>i&&(i=e),n>i&&(i=n),i}if(4===arguments.length){var r=arguments[0],s=arguments[1],o=arguments[2],a=arguments[3],i=r;return s>i&&(i=s),o>i&&(i=o),a>i&&(i=a),i}},T.average=function(t,e){
return(t+e)/2},T.LOG_10=Math.log(10),P.prototype.append=function(t){this.str+=t},P.prototype.setCharAt=function(t,e){return this.str.substr(0,t)+e+this.str.substr(t+1)},P.prototype.toString=function(t){return this.str},b.prototype.intValue=function(){return this.value},b.prototype.compareTo=function(t){return this.value<t?-1:this.value>t?1:0},b.isNaN=function(t){return Number.isNaN(t)},O.isWhitespace=function(t){return 32>=t&&t>=0||127==t},O.toUpperCase=function(t){return t.toUpperCase()},e(_.prototype,{le:function(t){return this.hi<t.hi||this.hi===t.hi&&this.lo<=t.lo},extractSignificantDigits:function(t,e){var n=this.abs(),i=_.magnitude(n.hi),r=_.TEN.pow(i);n=n.divide(r),n.gt(_.TEN)?(n=n.divide(_.TEN),i+=1):n.lt(_.ONE)&&(n=n.multiply(_.TEN),i-=1);for(var s=i+1,o=new P,a=_.MAX_PRINT_DIGITS-1,u=0;a>=u;u++){t&&u===s&&o.append(".");var l=Math.trunc(n.hi);if(0>l)break;var h=!1,c=0;l>9?(h=!0,c="9"):c="0"+l,o.append(c),n=n.subtract(_.valueOf(l)).multiply(_.TEN),h&&n.selfAdd(_.TEN);var f=!0,g=_.magnitude(n.hi);if(0>g&&Math.abs(g)>=a-u&&(f=!1),!f)break}return e[0]=i,o.toString()},sqr:function(){return this.multiply(this)},doubleValue:function(){return this.hi+this.lo},subtract:function(){if(arguments[0]instanceof _){var t=arguments[0];return this.add(t.negate())}if("number"==typeof arguments[0]){var e=arguments[0];return this.add(-e)}},equals:function(){if(1===arguments.length){var t=arguments[0];return this.hi===t.hi&&this.lo===t.lo}},isZero:function(){return 0===this.hi&&0===this.lo},selfSubtract:function(){if(arguments[0]instanceof _){var t=arguments[0];return this.isNaN()?this:this.selfAdd(-t.hi,-t.lo)}if("number"==typeof arguments[0]){var e=arguments[0];return this.isNaN()?this:this.selfAdd(-e,0)}},getSpecialNumberString:function(){return this.isZero()?"0.0":this.isNaN()?"NaN ":null},min:function(t){return this.le(t)?this:t},selfDivide:function(){if(1===arguments.length){if(arguments[0]instanceof _){var t=arguments[0];return this.selfDivide(t.hi,t.lo)}if("number"==typeof arguments[0]){var e=arguments[0];return this.selfDivide(e,0)}}else if(2===arguments.length){var n=arguments[0],i=arguments[1],r=null,s=null,o=null,a=null,u=null,l=null,h=null,c=null;return u=this.hi/n,l=_.SPLIT*u,r=l-u,c=_.SPLIT*n,r=l-r,s=u-r,o=c-n,h=u*n,o=c-o,a=n-o,c=r*o-h+r*a+s*o+s*a,l=(this.hi-h-c+this.lo-u*i)/n,c=u+l,this.hi=c,this.lo=u-c+l,this}},dump:function(){return"DD<"+this.hi+", "+this.lo+">"},divide:function(){if(arguments[0]instanceof _){var t=arguments[0],e=null,n=null,i=null,s=null,o=null,a=null,u=null,l=null;o=this.hi/t.hi,a=_.SPLIT*o,e=a-o,l=_.SPLIT*t.hi,e=a-e,n=o-e,i=l-t.hi,u=o*t.hi,i=l-i,s=t.hi-i,l=e*i-u+e*s+n*i+n*s,a=(this.hi-u-l+this.lo-o*t.lo)/t.hi,l=o+a;var h=l,c=o-l+a;return new _(h,c)}if("number"==typeof arguments[0]){var f=arguments[0];return r.isNaN(f)?_.createNaN():_.copy(this).selfDivide(f,0)}},ge:function(t){return this.hi>t.hi||this.hi===t.hi&&this.lo>=t.lo},pow:function(t){if(0===t)return _.valueOf(1);var e=new _(this),n=_.valueOf(1),i=Math.abs(t);if(i>1)for(;i>0;)i%2===1&&n.selfMultiply(e),i/=2,i>0&&(e=e.sqr());else n=e;return 0>t?n.reciprocal():n},ceil:function(){if(this.isNaN())return _.NaN;var t=Math.ceil(this.hi),e=0;return t===this.hi&&(e=Math.ceil(this.lo)),new _(t,e)},compareTo:function(t){var e=t;return this.hi<e.hi?-1:this.hi>e.hi?1:this.lo<e.lo?-1:this.lo>e.lo?1:0},rint:function(){if(this.isNaN())return this;var t=this.add(.5);return t.floor()},setValue:function(){if(arguments[0]instanceof _){var t=arguments[0];return this.init(t),this}if("number"==typeof arguments[0]){var e=arguments[0];return this.init(e),this}},max:function(t){return this.ge(t)?this:t},sqrt:function(){if(this.isZero())return _.valueOf(0);if(this.isNegative())return _.NaN;var t=1/Math.sqrt(this.hi),e=this.hi*t,n=_.valueOf(e),i=this.subtract(n.sqr()),r=i.hi*(.5*t);return n.add(r)},selfAdd:function(){if(1===arguments.length){if(arguments[0]instanceof _){var t=arguments[0];return this.selfAdd(t.hi,t.lo)}if("number"==typeof arguments[0]){var e=arguments[0],n=null,i=null,r=null,s=null,o=null,a=null;return r=this.hi+e,o=r-this.hi,s=r-o,s=e-o+(this.hi-s),a=s+this.lo,n=r+a,i=a+(r-n),this.hi=n+i,this.lo=i+(n-this.hi),this}}else if(2===arguments.length){var u=arguments[0],l=arguments[1],n=null,i=null,h=null,c=null,r=null,s=null,o=null,a=null;r=this.hi+u,h=this.lo+l,o=r-this.hi,a=h-this.lo,s=r-o,c=h-a,s=u-o+(this.hi-s),c=l-a+(this.lo-c),o=s+h,n=r+o,i=o+(r-n),o=c+i;var f=n+o,g=o+(n-f);return this.hi=f,this.lo=g,this}},selfMultiply:function(){if(1===arguments.length){if(arguments[0]instanceof _){var t=arguments[0];return this.selfMultiply(t.hi,t.lo)}if("number"==typeof arguments[0]){var e=arguments[0];return this.selfMultiply(e,0)}}else if(2===arguments.length){var n=arguments[0],i=arguments[1],r=null,s=null,o=null,a=null,u=null,l=null;u=_.SPLIT*this.hi,r=u-this.hi,l=_.SPLIT*n,r=u-r,s=this.hi-r,o=l-n,u=this.hi*n,o=l-o,a=n-o,l=r*o-u+r*a+s*o+s*a+(this.hi*i+this.lo*n);var h=u+l;r=u-h;var c=l+r;return this.hi=h,this.lo=c,this}},selfSqr:function(){return this.selfMultiply(this)},floor:function(){if(this.isNaN())return _.NaN;var t=Math.floor(this.hi),e=0;return t===this.hi&&(e=Math.floor(this.lo)),new _(t,e)},negate:function(){return this.isNaN()?this:new _(-this.hi,-this.lo)},clone:function(){try{return null}catch(t){if(t instanceof CloneNotSupportedException)return null;throw t}finally{}},multiply:function(){if(arguments[0]instanceof _){var t=arguments[0];return t.isNaN()?_.createNaN():_.copy(this).selfMultiply(t)}if("number"==typeof arguments[0]){var e=arguments[0];return r.isNaN(e)?_.createNaN():_.copy(this).selfMultiply(e,0)}},isNaN:function(){return r.isNaN(this.hi)},intValue:function(){return Math.trunc(this.hi)},toString:function(){var t=_.magnitude(this.hi);return t>=-3&&20>=t?this.toStandardNotation():this.toSciNotation()},toStandardNotation:function(){var t=this.getSpecialNumberString();if(null!==t)return t;var e=new Array(1).fill(null),n=this.extractSignificantDigits(!0,e),i=e[0]+1,r=n;if("."===n.charAt(0))r="0"+n;else if(0>i)r="0."+_.stringOfChar("0",-i)+n;else if(-1===n.indexOf(".")){var s=i-n.length,o=_.stringOfChar("0",s);r=n+o+".0"}return this.isNegative()?"-"+r:r},reciprocal:function(){var t=null,e=null,n=null,i=null,r=null,s=null,o=null,a=null;r=1/this.hi,s=_.SPLIT*r,t=s-r,a=_.SPLIT*this.hi,t=s-t,e=r-t,n=a-this.hi,o=r*this.hi,n=a-n,i=this.hi-n,a=t*n-o+t*i+e*n+e*i,s=(1-o-a-r*this.lo)/this.hi;var u=r+s,l=r-u+s;return new _(u,l)},toSciNotation:function(){if(this.isZero())return _.SCI_NOT_ZERO;var t=this.getSpecialNumberString();if(null!==t)return t;var e=new Array(1).fill(null),n=this.extractSignificantDigits(!1,e),i=_.SCI_NOT_EXPONENT_CHAR+e[0];if("0"===n.charAt(0))throw new IllegalStateException("Found leading zero: "+n);var r="";n.length>1&&(r=n.substring(1));var s=n.charAt(0)+"."+r;return this.isNegative()?"-"+s+i:s+i},abs:function(){return this.isNaN()?_.NaN:this.isNegative()?this.negate():new _(this)},isPositive:function(){return this.hi>0||0===this.hi&&this.lo>0},lt:function(t){return this.hi<t.hi||this.hi===t.hi&&this.lo<t.lo},add:function(){if(arguments[0]instanceof _){var t=arguments[0];return _.copy(this).selfAdd(t)}if("number"==typeof arguments[0]){var e=arguments[0];return _.copy(this).selfAdd(e)}},init:function(){if(1===arguments.length){if("number"==typeof arguments[0]){var t=arguments[0];this.hi=t,this.lo=0}else if(arguments[0]instanceof _){var e=arguments[0];this.hi=e.hi,this.lo=e.lo}}else if(2===arguments.length){var n=arguments[0],i=arguments[1];this.hi=n,this.lo=i}},gt:function(t){return this.hi>t.hi||this.hi===t.hi&&this.lo>t.lo},isNegative:function(){return this.hi<0||0===this.hi&&this.lo<0},trunc:function(){return this.isNaN()?_.NaN:this.isPositive()?this.floor():this.ceil()},signum:function(){return this.hi>0?1:this.hi<0?-1:this.lo>0?1:this.lo<0?-1:0},interfaces_:function(){return[u,s,o]},getClass:function(){return _}}),_.sqr=function(t){return _.valueOf(t).selfMultiply(t)},_.valueOf=function(){if("string"==typeof arguments[0]){var t=arguments[0];return _.parse(t)}if("number"==typeof arguments[0]){var e=arguments[0];return new _(e)}},_.sqrt=function(t){return _.valueOf(t).sqrt()},_.parse=function(t){for(var e=0,n=t.length;O.isWhitespace(t.charAt(e));)e++;var i=!1;if(n>e){var r=t.charAt(e);"-"!==r&&"+"!==r||(e++,"-"===r&&(i=!0))}for(var s=new _,o=0,a=0,u=0;;){if(e>=n)break;var l=t.charAt(e);if(e++,O.isDigit(l)){var h=l-"0";s.selfMultiply(_.TEN),s.selfAdd(h),o++}else{if("."!==l){if("e"===l||"E"===l){var c=t.substring(e);try{u=b.parseInt(c)}catch(e){throw e instanceof NumberFormatException?new NumberFormatException("Invalid exponent "+c+" in string "+t):e}finally{}break}throw new NumberFormatException("Unexpected character '"+l+"' at position "+e+" in string "+t)}a=o}}var f=s,g=o-a-u;if(0===g)f=s;else if(g>0){var d=_.TEN.pow(g);f=s.divide(d)}else if(0>g){var d=_.TEN.pow(-g);f=s.multiply(d)}return i?f.negate():f},_.createNaN=function(){return new _(r.NaN,r.NaN)},_.copy=function(t){return new _(t)},_.magnitude=function(t){var e=Math.abs(t),n=Math.log(e)/Math.log(10),i=Math.trunc(Math.floor(n)),r=Math.pow(10,i);return e>=10*r&&(i+=1),i},_.stringOfChar=function(t,e){for(var n=new P,i=0;e>i;i++)n.append(t);return n.toString()},_.PI=new _(3.141592653589793,1.2246467991473532e-16),_.TWO_PI=new _(6.283185307179586,2.4492935982947064e-16),_.PI_2=new _(1.5707963267948966,6.123233995736766e-17),_.E=new _(2.718281828459045,1.4456468917292502e-16),_.NaN=new _(r.NaN,r.NaN),_.EPS=1.23259516440783e-32,_.SPLIT=134217729,_.MAX_PRINT_DIGITS=32,_.TEN=_.valueOf(10),_.ONE=_.valueOf(1),_.SCI_NOT_EXPONENT_CHAR="E",_.SCI_NOT_ZERO="0.0E0",e(M.prototype,{interfaces_:function(){return[]},getClass:function(){return M}}),M.orientationIndex=function(t,e,n){var i=M.orientationIndexFilter(t,e,n);if(1>=i)return i;var r=_.valueOf(e.x).selfAdd(-t.x),s=_.valueOf(e.y).selfAdd(-t.y),o=_.valueOf(n.x).selfAdd(-e.x),a=_.valueOf(n.y).selfAdd(-e.y);return r.selfMultiply(a).selfSubtract(s.selfMultiply(o)).signum()},M.signOfDet2x2=function(t,e,n,i){var r=t.multiply(i).selfSubtract(e.multiply(n));return r.signum()},M.intersection=function(t,e,n,i){var r=_.valueOf(i.y).selfSubtract(n.y).selfMultiply(_.valueOf(e.x).selfSubtract(t.x)),s=_.valueOf(i.x).selfSubtract(n.x).selfMultiply(_.valueOf(e.y).selfSubtract(t.y)),o=r.subtract(s),a=_.valueOf(i.x).selfSubtract(n.x).selfMultiply(_.valueOf(t.y).selfSubtract(n.y)),u=_.valueOf(i.y).selfSubtract(n.y).selfMultiply(_.valueOf(t.x).selfSubtract(n.x)),l=a.subtract(u),h=l.selfDivide(o).doubleValue(),c=_.valueOf(t.x).selfAdd(_.valueOf(e.x).selfSubtract(t.x).selfMultiply(h)).doubleValue(),f=_.valueOf(e.x).selfSubtract(t.x).selfMultiply(_.valueOf(t.y).selfSubtract(n.y)),d=_.valueOf(e.y).selfSubtract(t.y).selfMultiply(_.valueOf(t.x).selfSubtract(n.x)),p=f.subtract(d),v=p.selfDivide(o).doubleValue(),m=_.valueOf(n.y).selfAdd(_.valueOf(i.y).selfSubtract(n.y).selfMultiply(v)).doubleValue();return new g(c,m)},M.orientationIndexFilter=function(t,e,n){var i=null,r=(t.x-n.x)*(e.y-n.y),s=(t.y-n.y)*(e.x-n.x),o=r-s;if(r>0){if(0>=s)return M.signum(o);i=r+s}else{if(!(0>r))return M.signum(o);if(s>=0)return M.signum(o);i=-r-s}var a=M.DP_SAFE_EPSILON*i;return o>=a||-o>=a?M.signum(o):2},M.signum=function(t){return t>0?1:0>t?-1:0},M.DP_SAFE_EPSILON=1e-15,e(D.prototype,{setOrdinate:function(t,e,n){},size:function(){},getOrdinate:function(t,e){},getCoordinate:function(){if(1===arguments.length){arguments[0]}else if(2===arguments.length){arguments[0],arguments[1]}},getCoordinateCopy:function(t){},getDimension:function(){},getX:function(t){},clone:function(){},expandEnvelope:function(t){},copy:function(){},getY:function(t){},toCoordinateArray:function(){},interfaces_:function(){return[o]},getClass:function(){return D}}),D.X=0,D.Y=1,D.Z=2,D.M=3,A.arraycopy=function(t,e,n,i,r){for(var s=0,o=e;e+r>o;o++)n[i+s]=t[o],s++},A.getProperty=function(t){return{"line.separator":"\n"}[t]},e(F.prototype,{getY:function(){var t=this.y/this.w;if(r.isNaN(t)||r.isInfinite(t))throw new w;return t},getX:function(){var t=this.x/this.w;if(r.isNaN(t)||r.isInfinite(t))throw new w;return t},getCoordinate:function(){var t=new g;return t.x=this.getX(),t.y=this.getY(),t},interfaces_:function(){return[]},getClass:function(){return F}}),F.intersection=function(t,e,n,i){var s=t.y-e.y,o=e.x-t.x,a=t.x*e.y-e.x*t.y,u=n.y-i.y,l=i.x-n.x,h=n.x*i.y-i.x*n.y,c=o*h-l*a,f=u*a-s*h,d=s*l-u*o,p=c/d,v=f/d;if(r.isNaN(p)||r.isInfinite(p)||r.isNaN(v)||r.isInfinite(v))throw new w;return new g(p,v)},e(G.prototype,{create:function(){if(1===arguments.length){if(arguments[0]instanceof Array){arguments[0]}else if(R(arguments[0],D)){arguments[0]}}else if(2===arguments.length){arguments[0],arguments[1]}},interfaces_:function(){return[]},getClass:function(){return G}}),e(q.prototype,{filter:function(t){},interfaces_:function(){return[]},getClass:function(){return q}}),e(B.prototype,{isGeometryCollection:function(){return this.getSortIndex()===B.SORTINDEX_GEOMETRYCOLLECTION},getFactory:function(){return this.factory},getGeometryN:function(t){return this},getArea:function(){return 0},isRectangle:function(){return!1},equals:function(){if(1===arguments.length){if(arguments[0]instanceof B){var t=arguments[0];return null===t?!1:this.equalsTopo(t)}if(arguments[0]instanceof Object){var e=arguments[0];if(!(e instanceof B))return!1;var n=e;return this.equalsExact(n)}}},equalsExact:function(t){return this===t||this.equalsExact(t,0)},geometryChanged:function(){this.apply(B.geometryChangedFilter)},geometryChangedAction:function(){this.envelope=null},equalsNorm:function(t){return null===t?!1:this.norm().equalsExact(t.norm())},getLength:function(){return 0},getNumGeometries:function(){return 1},compareTo:function(){if(1===arguments.length){var t=arguments[0],e=t;return this.getSortIndex()!==e.getSortIndex()?this.getSortIndex()-e.getSortIndex():this.isEmpty()&&e.isEmpty()?0:this.isEmpty()?-1:e.isEmpty()?1:this.compareToSameClass(t)}if(2===arguments.length){var n=arguments[0],i=arguments[1],e=n;return this.getSortIndex()!==e.getSortIndex()?this.getSortIndex()-e.getSortIndex():this.isEmpty()&&e.isEmpty()?0:this.isEmpty()?-1:e.isEmpty()?1:this.compareToSameClass(n,i)}},getUserData:function(){return this.userData},getSRID:function(){return this.SRID},getEnvelope:function(){return this.getFactory().toGeometry(this.getEnvelopeInternal())},checkNotGeometryCollection:function(t){if(t.getSortIndex()===B.SORTINDEX_GEOMETRYCOLLECTION)throw new i("This method does not support GeometryCollection arguments")},equal:function(t,e,n){return 0===n?t.equals(e):t.distance(e)<=n},norm:function(){var t=this.copy();return t.normalize(),t},getPrecisionModel:function(){return this.factory.getPrecisionModel()},getEnvelopeInternal:function(){return null===this.envelope&&(this.envelope=this.computeEnvelopeInternal()),new C(this.envelope)},setSRID:function(t){this.SRID=t},setUserData:function(t){this.userData=t},compare:function(t,e){for(var n=t.iterator(),i=e.iterator();n.hasNext()&&i.hasNext();){var r=n.next(),s=i.next(),o=r.compareTo(s);if(0!==o)return o}return n.hasNext()?1:i.hasNext()?-1:0},hashCode:function(){return this.getEnvelopeInternal().hashCode()},isGeometryCollectionOrDerived:function(){return this.getSortIndex()===B.SORTINDEX_GEOMETRYCOLLECTION||this.getSortIndex()===B.SORTINDEX_MULTIPOINT||this.getSortIndex()===B.SORTINDEX_MULTILINESTRING||this.getSortIndex()===B.SORTINDEX_MULTIPOLYGON},interfaces_:function(){return[o,s,u]},getClass:function(){return B}}),B.hasNonEmptyElements=function(t){for(var e=0;e<t.length;e++)if(!t[e].isEmpty())return!0;return!1},B.hasNullElements=function(t){for(var e=0;e<t.length;e++)if(null===t[e])return!0;return!1},B.serialVersionUID=0x799ea46522854c00,B.SORTINDEX_POINT=0,B.SORTINDEX_MULTIPOINT=1,B.SORTINDEX_LINESTRING=2,B.SORTINDEX_LINEARRING=3,B.SORTINDEX_MULTILINESTRING=4,B.SORTINDEX_POLYGON=5,B.SORTINDEX_MULTIPOLYGON=6,B.SORTINDEX_GEOMETRYCOLLECTION=7,B.geometryChangedFilter={interfaces_:function(){return[q]},filter:function(t){t.geometryChangedAction()}},e(z.prototype,{filter:function(t){},interfaces_:function(){return[]},getClass:function(){return z}}),e(V.prototype,{isInBoundary:function(t){},interfaces_:function(){return[]},getClass:function(){return V}}),e(k.prototype,{isInBoundary:function(t){return t%2===1},interfaces_:function(){return[V]},getClass:function(){return k}}),e(Y.prototype,{isInBoundary:function(t){return t>0},interfaces_:function(){return[V]},getClass:function(){return Y}}),e(U.prototype,{isInBoundary:function(t){return t>1},interfaces_:function(){return[V]},getClass:function(){return U}}),e(X.prototype,{isInBoundary:function(t){return 1===t},interfaces_:function(){return[V]},getClass:function(){return X}}),V.Mod2BoundaryNodeRule=k,V.EndPointBoundaryNodeRule=Y,V.MultiValentEndPointBoundaryNodeRule=U,V.MonoValentEndPointBoundaryNodeRule=X,V.MOD2_BOUNDARY_RULE=new k,V.ENDPOINT_BOUNDARY_RULE=new Y,V.MULTIVALENT_ENDPOINT_BOUNDARY_RULE=new U,V.MONOVALENT_ENDPOINT_BOUNDARY_RULE=new X,V.OGC_SFS_BOUNDARY_RULE=V.MOD2_BOUNDARY_RULE,e(H.prototype,{interfaces_:function(){return[]},getClass:function(){return H}}),H.isRing=function(t){return t.length<4?!1:!!t[0].equals2D(t[t.length-1])},H.ptNotInList=function(t,e){for(var n=0;n<t.length;n++){var i=t[n];if(H.indexOf(i,e)<0)return i}return null},H.scroll=function(t,e){var n=H.indexOf(e,t);if(0>n)return null;var i=new Array(t.length).fill(null);A.arraycopy(t,n,i,0,t.length-n),A.arraycopy(t,0,i,t.length-n,n),A.arraycopy(i,0,t,0,t.length)},H.equals=function(){if(2===arguments.length){var t=arguments[0],e=arguments[1];if(t===e)return!0;if(null===t||null===e)return!1;if(t.length!==e.length)return!1;for(var n=0;n<t.length;n++)if(!t[n].equals(e[n]))return!1;return!0}if(3===arguments.length){var i=arguments[0],r=arguments[1],s=arguments[2];if(i===r)return!0;if(null===i||null===r)return!1;if(i.length!==r.length)return!1;for(var n=0;n<i.length;n++)if(0!==s.compare(i[n],r[n]))return!1;return!0}},H.intersection=function(t,e){for(var n=new N,i=0;i<t.length;i++)e.intersects(t[i])&&n.add(t[i],!0);return n.toCoordinateArray()},H.hasRepeatedPoints=function(t){for(var e=1;e<t.length;e++)if(t[e-1].equals(t[e]))return!0;return!1},H.removeRepeatedPoints=function(t){if(!H.hasRepeatedPoints(t))return t;var e=new N(t,!1);return e.toCoordinateArray()},H.reverse=function(t){for(var e=t.length-1,n=Math.trunc(e/2),i=0;n>=i;i++){var r=t[i];t[i]=t[e-i],t[e-i]=r}},H.removeNull=function(t){for(var e=0,n=0;n<t.length;n++)null!==t[n]&&e++;var i=new Array(e).fill(null);if(0===e)return i;for(var r=0,n=0;n<t.length;n++)null!==t[n]&&(i[r++]=t[n]);return i},H.copyDeep=function(){if(1===arguments.length){for(var t=arguments[0],e=new Array(t.length).fill(null),n=0;n<t.length;n++)e[n]=new g(t[n]);return e}if(5===arguments.length)for(var i=arguments[0],r=arguments[1],s=arguments[2],o=arguments[3],a=arguments[4],n=0;a>n;n++)s[o+n]=new g(i[r+n])},H.isEqualReversed=function(t,e){for(var n=0;n<t.length;n++){var i=t[n],r=e[t.length-n-1];if(0!==i.compareTo(r))return!1}return!0},H.envelope=function(t){for(var e=new C,n=0;n<t.length;n++)e.expandToInclude(t[n]);return e},H.toCoordinateArray=function(t){return t.toArray(H.coordArrayType)},H.atLeastNCoordinatesOrNothing=function(t,e){return e.length>=t?e:[]},H.indexOf=function(t,e){for(var n=0;n<e.length;n++)if(t.equals(e[n]))return n;return-1},H.increasingDirection=function(t){for(var e=0;e<Math.trunc(t.length/2);e++){var n=t.length-1-e,i=t[e].compareTo(t[n]);if(0!==i)return i}return 1},H.compare=function(t,e){for(var n=0;n<t.length&&n<e.length;){var i=t[n].compareTo(e[n]);if(0!==i)return i;n++}return n<e.length?-1:n<t.length?1:0},H.minCoordinate=function(t){for(var e=null,n=0;n<t.length;n++)(null===e||e.compareTo(t[n])>0)&&(e=t[n]);return e},H.extract=function(t,e,n){e=T.clamp(e,0,t.length),n=T.clamp(n,-1,t.length);var i=n-e+1;0>n&&(i=0),e>=t.length&&(i=0),e>n&&(i=0);var r=new Array(i).fill(null);if(0===i)return r;for(var s=0,o=e;n>=o;o++)r[s++]=t[o];return r},e(W.prototype,{compare:function(t,e){var n=t,i=e;return H.compare(n,i)},interfaces_:function(){return[a]},getClass:function(){return W}}),e(j.prototype,{compare:function(t,e){var n=t,i=e;if(n.length<i.length)return-1;if(n.length>i.length)return 1;if(0===n.length)return 0;var r=H.compare(n,i),s=H.isEqualReversed(n,i);return s?0:r},OLDcompare:function(t,e){var n=t,i=e;if(n.length<i.length)return-1;if(n.length>i.length)return 1;if(0===n.length)return 0;for(var r=H.increasingDirection(n),s=H.increasingDirection(i),o=r>0?0:n.length-1,a=s>0?0:n.length-1,u=0;u<n.length;u++){var l=n[o].compareTo(i[a]);if(0!==l)return l;o+=r,a+=s}return 0},interfaces_:function(){return[a]},getClass:function(){return j}}),H.ForwardComparator=W,H.BidirectionalComparator=j,H.coordArrayType=new Array(0).fill(null),K.prototype.get=function(){},K.prototype.put=function(){},K.prototype.size=function(){},K.prototype.values=function(){},K.prototype.entrySet=function(){},Z.prototype=new K,Q.prototype=new v,Q.prototype.contains=function(){},J.prototype=new Q,J.prototype.contains=function(t){for(var e=0,n=this.array_.length;n>e;e++){var i=this.array_[e];if(i===t)return!0}return!1},J.prototype.add=function(t){return this.contains(t)?!1:(this.array_.push(t),!0)},J.prototype.addAll=function(t){for(var e=t.iterator();e.hasNext();)this.add(e.next());return!0},J.prototype.remove=function(t){throw new javascript.util.OperationNotSupported},J.prototype.size=function(){return this.array_.length},J.prototype.isEmpty=function(){return 0===this.array_.length},J.prototype.toArray=function(){for(var t=[],e=0,n=this.array_.length;n>e;e++)t.push(this.array_[e]);return t},J.prototype.iterator=function(){return new Js(this)};var Js=function(t){this.hashSet_=t,this.position_=0};Js.prototype.next=function(){if(this.position_===this.hashSet_.size())throw new x;return this.hashSet_.array_[this.position_++]},Js.prototype.hasNext=function(){return this.position_<this.hashSet_.size()},Js.prototype.remove=function(){throw new E};var $s=0,to=1;rt.prototype=new Z,rt.prototype.get=function(t){for(var e=this.root_;null!==e;){var n=t.compareTo(e.key);if(0>n)e=e.left;else{if(!(n>0))return e.value;e=e.right}}return null},rt.prototype.put=function(t,e){if(null===this.root_)return this.root_={key:t,value:e,left:null,right:null,parent:null,color:$s,getValue:function(){return this.value},getKey:function(){return this.key}},this.size_=1,null;var n,i,r=this.root_;do if(n=r,i=t.compareTo(r.key),0>i)r=r.left;else{if(!(i>0)){var s=r.value;return r.value=e,s}r=r.right}while(null!==r);var o={key:t,left:null,right:null,value:e,parent:n,color:$s,getValue:function(){return this.value},getKey:function(){return this.key}};return 0>i?n.left=o:n.right=o,this.fixAfterInsertion(o),this.size_++,null},rt.prototype.fixAfterInsertion=function(t){for(t.color=to;null!=t&&t!=this.root_&&t.parent.color==to;)if(tt(t)==nt(tt(tt(t)))){var e=it(tt(tt(t)));$(e)==to?(et(tt(t),$s),et(e,$s),et(tt(tt(t)),to),t=tt(tt(t))):(t==it(tt(t))&&(t=tt(t),this.rotateLeft(t)),et(tt(t),$s),et(tt(tt(t)),to),this.rotateRight(tt(tt(t))))}else{var e=nt(tt(tt(t)));$(e)==to?(et(tt(t),$s),et(e,$s),et(tt(tt(t)),to),t=tt(tt(t))):(t==nt(tt(t))&&(t=tt(t),this.rotateRight(t)),et(tt(t),$s),et(tt(tt(t)),to),this.rotateLeft(tt(tt(t))))}this.root_.color=$s},rt.prototype.values=function(){var t=new I,e=this.getFirstEntry();if(null!==e)for(t.add(e.value);null!==(e=rt.successor(e));)t.add(e.value);return t},rt.prototype.entrySet=function(){var t=new J,e=this.getFirstEntry();if(null!==e)for(t.add(e);null!==(e=rt.successor(e));)t.add(e);return t},rt.prototype.rotateLeft=function(t){if(null!=t){var e=t.right;t.right=e.left,null!=e.left&&(e.left.parent=t),e.parent=t.parent,null==t.parent?this.root_=e:t.parent.left==t?t.parent.left=e:t.parent.right=e,e.left=t,t.parent=e}},rt.prototype.rotateRight=function(t){if(null!=t){var e=t.left;t.left=e.right,null!=e.right&&(e.right.parent=t),e.parent=t.parent,null==t.parent?this.root_=e:t.parent.right==t?t.parent.right=e:t.parent.left=e,e.right=t,t.parent=e}},rt.prototype.getFirstEntry=function(){var t=this.root_;if(null!=t)for(;null!=t.left;)t=t.left;return t},rt.successor=function(t){if(null===t)return null;if(null!==t.right){for(var e=t.right;null!==e.left;)e=e.left;return e}for(var e=t.parent,n=t;null!==e&&n===e.right;)n=e,e=e.parent;return e},rt.prototype.size=function(){return this.size_},e(st.prototype,{interfaces_:function(){return[]},getClass:function(){return st}}),ot.prototype=new Q,at.prototype=new ot,at.prototype.contains=function(t){for(var e=0,n=this.array_.length;n>e;e++){var i=this.array_[e];if(0===i.compareTo(t))return!0}return!1},at.prototype.add=function(t){if(this.contains(t))return!1;for(var e=0,n=this.array_.length;n>e;e++){var i=this.array_[e];if(1===i.compareTo(t))return this.array_.splice(e,0,t),!0}return this.array_.push(t),!0},at.prototype.addAll=function(t){for(var e=t.iterator();e.hasNext();)this.add(e.next());return!0},at.prototype.remove=function(t){throw new E},at.prototype.size=function(){return this.array_.length},at.prototype.isEmpty=function(){return 0===this.array_.length},at.prototype.toArray=function(){for(var t=[],e=0,n=this.array_.length;n>e;e++)t.push(this.array_[e]);return t},at.prototype.iterator=function(){return new eo(this)};var eo=function(t){this.treeSet_=t,this.position_=0};eo.prototype.next=function(){if(this.position_===this.treeSet_.size())throw new x;return this.treeSet_.array_[this.position_++]},eo.prototype.hasNext=function(){return this.position_<this.treeSet_.size()},eo.prototype.remove=function(){throw new E},ut.sort=function(){var t,e,n,i,r=arguments[0];if(1===arguments.length)return i=function(t,e){return t.compareTo(e)},void r.sort(i);if(2===arguments.length)n=arguments[1],i=function(t,e){return n.compare(t,e)},r.sort(i);else{if(3===arguments.length){e=r.slice(arguments[1],arguments[2]),e.sort();var s=r.slice(0,arguments[1]).concat(e,r.slice(arguments[2],r.length));for(r.splice(0,r.length),t=0;t<s.length;t++)r.push(s[t]);return}if(4===arguments.length){for(e=r.slice(arguments[1],arguments[2]),n=arguments[3],i=function(t,e){return n.compare(t,e)},e.sort(i),s=r.slice(0,arguments[1]).concat(e,r.slice(arguments[2],r.length)),r.splice(0,r.length),t=0;t<s.length;t++)r.push(s[t]);return}}},ut.asList=function(t){for(var e=new I,n=0,i=t.length;i>n;n++)e.add(t[n]);return e},e(lt.prototype,{interfaces_:function(){return[]},getClass:function(){return lt}}),lt.toDimensionSymbol=function(t){switch(t){case lt.FALSE:return lt.SYM_FALSE;case lt.TRUE:return lt.SYM_TRUE;case lt.DONTCARE:return lt.SYM_DONTCARE;case lt.P:return lt.SYM_P;case lt.L:return lt.SYM_L;case lt.A:return lt.SYM_A}throw new i("Unknown dimension value: "+t)},lt.toDimensionValue=function(t){switch(O.toUpperCase(t)){case lt.SYM_FALSE:return lt.FALSE;case lt.SYM_TRUE:return lt.TRUE;case lt.SYM_DONTCARE:return lt.DONTCARE;case lt.SYM_P:return lt.P;case lt.SYM_L:return lt.L;case lt.SYM_A:return lt.A}throw new i("Unknown dimension symbol: "+t)},lt.P=0,lt.L=1,lt.A=2,lt.FALSE=-1,lt.TRUE=-2,lt.DONTCARE=-3,lt.SYM_FALSE="F",lt.SYM_TRUE="T",lt.SYM_DONTCARE="*",lt.SYM_P="0",lt.SYM_L="1",lt.SYM_A="2",e(ht.prototype,{filter:function(t){},interfaces_:function(){return[]},getClass:function(){return ht}}),e(ct.prototype,{filter:function(t,e){},isDone:function(){},isGeometryChanged:function(){},interfaces_:function(){return[]},getClass:function(){return ct}}),h(ft,B),e(ft.prototype,{computeEnvelopeInternal:function(){for(var t=new C,e=0;e<this.geometries.length;e++)t.expandToInclude(this.geometries[e].getEnvelopeInternal());return t},getGeometryN:function(t){return this.geometries[t]},getSortIndex:function(){return B.SORTINDEX_GEOMETRYCOLLECTION},getCoordinates:function(){for(var t=new Array(this.getNumPoints()).fill(null),e=-1,n=0;n<this.geometries.length;n++)for(var i=this.geometries[n].getCoordinates(),r=0;r<i.length;r++)e++,t[e]=i[r];return t},getArea:function(){for(var t=0,e=0;e<this.geometries.length;e++)t+=this.geometries[e].getArea();return t},equalsExact:function(){if(2===arguments.length){var t=arguments[0],e=arguments[1];if(!this.isEquivalentClass(t))return!1;var n=t;if(this.geometries.length!==n.geometries.length)return!1;for(var i=0;i<this.geometries.length;i++)if(!this.geometries[i].equalsExact(n.geometries[i],e))return!1;return!0}return B.prototype.equalsExact.apply(this,arguments)},normalize:function(){for(var t=0;t<this.geometries.length;t++)this.geometries[t].normalize();ut.sort(this.geometries)},getCoordinate:function(){return this.isEmpty()?null:this.geometries[0].getCoordinate()},getBoundaryDimension:function(){for(var t=lt.FALSE,e=0;e<this.geometries.length;e++)t=Math.max(t,this.geometries[e].getBoundaryDimension());return t},getDimension:function(){for(var t=lt.FALSE,e=0;e<this.geometries.length;e++)t=Math.max(t,this.geometries[e].getDimension());return t},getLength:function(){for(var t=0,e=0;e<this.geometries.length;e++)t+=this.geometries[e].getLength();return t},getNumPoints:function(){for(var t=0,e=0;e<this.geometries.length;e++)t+=this.geometries[e].getNumPoints();return t},getNumGeometries:function(){return this.geometries.length},reverse:function(){for(var t=this.geometries.length,e=new Array(t).fill(null),n=0;n<this.geometries.length;n++)e[n]=this.geometries[n].reverse();return this.getFactory().createGeometryCollection(e)},compareToSameClass:function(){if(1===arguments.length){var t=arguments[0],e=new at(ut.asList(this.geometries)),n=new at(ut.asList(t.geometries));return this.compare(e,n)}if(2===arguments.length){for(var i=arguments[0],r=arguments[1],s=i,o=this.getNumGeometries(),a=s.getNumGeometries(),u=0;o>u&&a>u;){var l=this.getGeometryN(u),h=s.getGeometryN(u),c=l.compareToSameClass(h,r);if(0!==c)return c;u++}return o>u?1:a>u?-1:0}},apply:function(){if(R(arguments[0],z))for(var t=arguments[0],e=0;e<this.geometries.length;e++)this.geometries[e].apply(t);else if(R(arguments[0],ct)){var n=arguments[0];if(0===this.geometries.length)return null;for(var e=0;e<this.geometries.length&&(this.geometries[e].apply(n),!n.isDone());e++);n.isGeometryChanged()&&this.geometryChanged()}else if(R(arguments[0],ht)){var i=arguments[0];i.filter(this);for(var e=0;e<this.geometries.length;e++)this.geometries[e].apply(i)}else if(R(arguments[0],q)){var r=arguments[0];r.filter(this);for(var e=0;e<this.geometries.length;e++)this.geometries[e].apply(r)}},getBoundary:function(){return this.checkNotGeometryCollection(this),f.shouldNeverReachHere(),null},clone:function(){var t=B.prototype.clone.call(this);t.geometries=new Array(this.geometries.length).fill(null);for(var e=0;e<this.geometries.length;e++)t.geometries[e]=this.geometries[e].clone();return t},getGeometryType:function(){return"GeometryCollection"},copy:function(){for(var t=new Array(this.geometries.length).fill(null),e=0;e<t.length;e++)t[e]=this.geometries[e].copy();return new ft(t,this.factory)},isEmpty:function(){for(var t=0;t<this.geometries.length;t++)if(!this.geometries[t].isEmpty())return!1;return!0},interfaces_:function(){return[]},getClass:function(){return ft}}),ft.serialVersionUID=-0x4f07bcb1f857d800,h(gt,ft),e(gt.prototype,{getSortIndex:function(){return B.SORTINDEX_MULTILINESTRING},equalsExact:function(){if(2===arguments.length){var t=arguments[0],e=arguments[1];return this.isEquivalentClass(t)?ft.prototype.equalsExact.call(this,t,e):!1}return ft.prototype.equalsExact.apply(this,arguments)},getBoundaryDimension:function(){return this.isClosed()?lt.FALSE:0},isClosed:function(){if(this.isEmpty())return!1;for(var t=0;t<this.geometries.length;t++)if(!this.geometries[t].isClosed())return!1;return!0},getDimension:function(){return 1},reverse:function(){for(var t=this.geometries.length,e=new Array(t).fill(null),n=0;n<this.geometries.length;n++)e[t-1-n]=this.geometries[n].reverse();return this.getFactory().createMultiLineString(e)},getBoundary:function(){return new dt(this).getBoundary()},getGeometryType:function(){return"MultiLineString"},copy:function(){for(var t=new Array(this.geometries.length).fill(null),e=0;e<t.length;e++)t[e]=this.geometries[e].copy();return new gt(t,this.factory)},interfaces_:function(){
return[st]},getClass:function(){return gt}}),gt.serialVersionUID=0x7155d2ab4afa8000,e(dt.prototype,{boundaryMultiLineString:function(t){if(this.geom.isEmpty())return this.getEmptyMultiPoint();var e=this.computeBoundaryCoordinates(t);return 1===e.length?this.geomFact.createPoint(e[0]):this.geomFact.createMultiPointFromCoords(e)},getBoundary:function(){return this.geom instanceof St?this.boundaryLineString(this.geom):this.geom instanceof gt?this.boundaryMultiLineString(this.geom):this.geom.getBoundary()},boundaryLineString:function(t){if(this.geom.isEmpty())return this.getEmptyMultiPoint();if(t.isClosed()){var e=this.bnRule.isInBoundary(2);return e?t.getStartPoint():this.geomFact.createMultiPoint()}return this.geomFact.createMultiPoint([t.getStartPoint(),t.getEndPoint()])},getEmptyMultiPoint:function(){return this.geomFact.createMultiPoint()},computeBoundaryCoordinates:function(t){var e=new I;this.endpointMap=new rt;for(var n=0;n<t.getNumGeometries();n++){var i=t.getGeometryN(n);0!==i.getNumPoints()&&(this.addEndpoint(i.getCoordinateN(0)),this.addEndpoint(i.getCoordinateN(i.getNumPoints()-1)))}for(var r=this.endpointMap.entrySet().iterator();r.hasNext();){var s=r.next(),o=s.getValue(),a=o.count;this.bnRule.isInBoundary(a)&&e.add(s.getKey())}return H.toCoordinateArray(e)},addEndpoint:function(t){var e=this.endpointMap.get(t);null===e&&(e=new pt,this.endpointMap.put(t,e)),e.count++},interfaces_:function(){return[]},getClass:function(){return dt}}),dt.getBoundary=function(){if(1===arguments.length){var t=arguments[0],e=new dt(t);return e.getBoundary()}if(2===arguments.length){var n=arguments[0],i=arguments[1],e=new dt(n,i);return e.getBoundary()}},e(pt.prototype,{interfaces_:function(){return[]},getClass:function(){return pt}}),e(Nt.prototype,{interfaces_:function(){return[]},getClass:function(){return Nt}}),Nt.chars=function(t,e){for(var n=new Array(e).fill(null),i=0;e>i;i++)n[i]=t;return new String(n)},Nt.getStackTrace=function(){if(1===arguments.length){var t=arguments[0],e=new xt,n=new vt(e);return t.printStackTrace(n),e.toString()}if(2===arguments.length){for(var i=arguments[0],r=arguments[1],s="",o=new mt(Nt.getStackTrace(i)),a=new It(o),u=0;r>u;u++)try{s+=a.readLine()+Nt.NEWLINE}catch(t){if(!(t instanceof Et))throw t;f.shouldNeverReachHere()}finally{}return s}},Nt.split=function(t,e){for(var n=e.length,i=new I,r=""+t,s=r.indexOf(e);s>=0;){var o=r.substring(0,s);i.add(o),r=r.substring(s+n),s=r.indexOf(e)}r.length>0&&i.add(r);for(var a=new Array(i.size()).fill(null),u=0;u<a.length;u++)a[u]=i.get(u);return a},Nt.toString=function(){if(1===arguments.length){var t=arguments[0];return Nt.SIMPLE_ORDINATE_FORMAT.format(t)}},Nt.spaces=function(t){return Nt.chars(" ",t)},Nt.NEWLINE=A.getProperty("line.separator"),Nt.SIMPLE_ORDINATE_FORMAT=new yt("0.#"),e(Ct.prototype,{interfaces_:function(){return[]},getClass:function(){return Ct}}),Ct.copyCoord=function(t,e,n,i){for(var r=Math.min(t.getDimension(),n.getDimension()),s=0;r>s;s++)n.setOrdinate(i,s,t.getOrdinate(e,s))},Ct.isRing=function(t){var e=t.size();return 0===e?!0:3>=e?!1:t.getOrdinate(0,D.X)===t.getOrdinate(e-1,D.X)&&t.getOrdinate(0,D.Y)===t.getOrdinate(e-1,D.Y)},Ct.isEqual=function(t,e){var n=t.size(),i=e.size();if(n!==i)return!1;for(var s=Math.min(t.getDimension(),e.getDimension()),o=0;n>o;o++)for(var a=0;s>a;a++){var u=t.getOrdinate(o,a),l=e.getOrdinate(o,a);if(!(t.getOrdinate(o,a)===e.getOrdinate(o,a)||r.isNaN(u)&&r.isNaN(l)))return!1}return!0},Ct.extend=function(t,e,n){var i=t.create(n,e.getDimension()),r=e.size();if(Ct.copy(e,0,i,0,r),r>0)for(var s=r;n>s;s++)Ct.copy(e,r-1,i,s,1);return i},Ct.reverse=function(t){for(var e=t.size()-1,n=Math.trunc(e/2),i=0;n>=i;i++)Ct.swap(t,i,e-i)},Ct.swap=function(t,e,n){if(e===n)return null;for(var i=0;i<t.getDimension();i++){var r=t.getOrdinate(e,i);t.setOrdinate(e,i,t.getOrdinate(n,i)),t.setOrdinate(n,i,r)}},Ct.copy=function(t,e,n,i,r){for(var s=0;r>s;s++)Ct.copyCoord(t,e+s,n,i+s)},Ct.toString=function(){if(1===arguments.length){var t=arguments[0],e=t.size();if(0===e)return"()";var n=t.getDimension(),i=new P;i.append("(");for(var r=0;e>r;r++){r>0&&i.append(" ");for(var s=0;n>s;s++)s>0&&i.append(","),i.append(Nt.toString(t.getOrdinate(r,s)))}return i.append(")"),i.toString()}},Ct.ensureValidRing=function(t,e){var n=e.size();if(0===n)return e;if(3>=n)return Ct.createClosedRing(t,e,4);var i=e.getOrdinate(0,D.X)===e.getOrdinate(n-1,D.X)&&e.getOrdinate(0,D.Y)===e.getOrdinate(n-1,D.Y);return i?e:Ct.createClosedRing(t,e,n+1)},Ct.createClosedRing=function(t,e,n){var i=t.create(n,e.getDimension()),r=e.size();Ct.copy(e,0,i,0,r);for(var s=r;n>s;s++)Ct.copy(e,0,i,s,1);return i},h(St,B),e(St.prototype,{computeEnvelopeInternal:function(){return this.isEmpty()?new C:this.points.expandEnvelope(new C)},isRing:function(){return this.isClosed()&&this.isSimple()},getSortIndex:function(){return B.SORTINDEX_LINESTRING},getCoordinates:function(){return this.points.toCoordinateArray()},equalsExact:function(){if(2===arguments.length){var t=arguments[0],e=arguments[1];if(!this.isEquivalentClass(t))return!1;var n=t;if(this.points.size()!==n.points.size())return!1;for(var i=0;i<this.points.size();i++)if(!this.equal(this.points.getCoordinate(i),n.points.getCoordinate(i),e))return!1;return!0}return B.prototype.equalsExact.apply(this,arguments)},normalize:function(){for(var t=0;t<Math.trunc(this.points.size()/2);t++){var e=this.points.size()-1-t;if(!this.points.getCoordinate(t).equals(this.points.getCoordinate(e)))return this.points.getCoordinate(t).compareTo(this.points.getCoordinate(e))>0&&Ct.reverse(this.points),null}},getCoordinate:function(){return this.isEmpty()?null:this.points.getCoordinate(0)},getBoundaryDimension:function(){return this.isClosed()?lt.FALSE:0},isClosed:function(){return this.isEmpty()?!1:this.getCoordinateN(0).equals2D(this.getCoordinateN(this.getNumPoints()-1))},getEndPoint:function(){return this.isEmpty()?null:this.getPointN(this.getNumPoints()-1)},getDimension:function(){return 1},getLength:function(){return he.computeLength(this.points)},getNumPoints:function(){return this.points.size()},reverse:function(){var t=this.points.copy();Ct.reverse(t);var e=this.getFactory().createLineString(t);return e},compareToSameClass:function(){if(1===arguments.length){for(var t=arguments[0],e=t,n=0,i=0;n<this.points.size()&&i<e.points.size();){var r=this.points.getCoordinate(n).compareTo(e.points.getCoordinate(i));if(0!==r)return r;n++,i++}return n<this.points.size()?1:i<e.points.size()?-1:0}if(2===arguments.length){var s=arguments[0],o=arguments[1],e=s;return o.compare(this.points,e.points)}},apply:function(){if(R(arguments[0],z))for(var t=arguments[0],e=0;e<this.points.size();e++)t.filter(this.points.getCoordinate(e));else if(R(arguments[0],ct)){var n=arguments[0];if(0===this.points.size())return null;for(var e=0;e<this.points.size()&&(n.filter(this.points,e),!n.isDone());e++);n.isGeometryChanged()&&this.geometryChanged()}else if(R(arguments[0],ht)){var i=arguments[0];i.filter(this)}else if(R(arguments[0],q)){var r=arguments[0];r.filter(this)}},getBoundary:function(){return new dt(this).getBoundary()},isEquivalentClass:function(t){return t instanceof St},clone:function(){var t=B.prototype.clone.call(this);return t.points=this.points.clone(),t},getCoordinateN:function(t){return this.points.getCoordinate(t)},getGeometryType:function(){return"LineString"},copy:function(){return new St(this.points.copy(),this.factory)},getCoordinateSequence:function(){return this.points},isEmpty:function(){return 0===this.points.size()},init:function(t){if(null===t&&(t=this.getFactory().getCoordinateSequenceFactory().create([])),1===t.size())throw new i("Invalid number of points in LineString (found "+t.size()+" - must be 0 or >= 2)");this.points=t},isCoordinate:function(t){for(var e=0;e<this.points.size();e++)if(this.points.getCoordinate(e).equals(t))return!0;return!1},getStartPoint:function(){return this.isEmpty()?null:this.getPointN(0)},getPointN:function(t){return this.getFactory().createPoint(this.points.getCoordinate(t))},interfaces_:function(){return[st]},getClass:function(){return St}}),St.serialVersionUID=0x2b2b51ba435c8e00,e(wt.prototype,{interfaces_:function(){return[]},getClass:function(){return wt}}),h(Lt,B),e(Lt.prototype,{computeEnvelopeInternal:function(){if(this.isEmpty())return new C;var t=new C;return t.expandToInclude(this.coordinates.getX(0),this.coordinates.getY(0)),t},getSortIndex:function(){return B.SORTINDEX_POINT},getCoordinates:function(){return this.isEmpty()?[]:[this.getCoordinate()]},equalsExact:function(){if(2===arguments.length){var t=arguments[0],e=arguments[1];return this.isEquivalentClass(t)?this.isEmpty()&&t.isEmpty()?!0:this.isEmpty()!==t.isEmpty()?!1:this.equal(t.getCoordinate(),this.getCoordinate(),e):!1}return B.prototype.equalsExact.apply(this,arguments)},normalize:function(){},getCoordinate:function(){return 0!==this.coordinates.size()?this.coordinates.getCoordinate(0):null},getBoundaryDimension:function(){return lt.FALSE},getDimension:function(){return 0},getNumPoints:function(){return this.isEmpty()?0:1},reverse:function(){return this.copy()},getX:function(){if(null===this.getCoordinate())throw new IllegalStateException("getX called on empty Point");return this.getCoordinate().x},compareToSameClass:function(){if(1===arguments.length){var t=arguments[0],e=t;return this.getCoordinate().compareTo(e.getCoordinate())}if(2===arguments.length){var n=arguments[0],i=arguments[1],e=n;return i.compare(this.coordinates,e.coordinates)}},apply:function(){if(R(arguments[0],z)){var t=arguments[0];if(this.isEmpty())return null;t.filter(this.getCoordinate())}else if(R(arguments[0],ct)){var e=arguments[0];if(this.isEmpty())return null;e.filter(this.coordinates,0),e.isGeometryChanged()&&this.geometryChanged()}else if(R(arguments[0],ht)){var n=arguments[0];n.filter(this)}else if(R(arguments[0],q)){var i=arguments[0];i.filter(this)}},getBoundary:function(){return this.getFactory().createGeometryCollection(null)},clone:function(){var t=B.prototype.clone.call(this);return t.coordinates=this.coordinates.clone(),t},getGeometryType:function(){return"Point"},copy:function(){return new Lt(this.coordinates.copy(),this.factory)},getCoordinateSequence:function(){return this.coordinates},getY:function(){if(null===this.getCoordinate())throw new IllegalStateException("getY called on empty Point");return this.getCoordinate().y},isEmpty:function(){return 0===this.coordinates.size()},init:function(t){null===t&&(t=this.getFactory().getCoordinateSequenceFactory().create([])),f.isTrue(t.size()<=1),this.coordinates=t},isSimple:function(){return!0},interfaces_:function(){return[wt]},getClass:function(){return Lt}}),Lt.serialVersionUID=0x44077bad161cbc00,e(Rt.prototype,{interfaces_:function(){return[]},getClass:function(){return Rt}}),h(Tt,B),e(Tt.prototype,{computeEnvelopeInternal:function(){return this.shell.getEnvelopeInternal()},getSortIndex:function(){return B.SORTINDEX_POLYGON},getCoordinates:function(){if(this.isEmpty())return[];for(var t=new Array(this.getNumPoints()).fill(null),e=-1,n=this.shell.getCoordinates(),i=0;i<n.length;i++)e++,t[e]=n[i];for(var r=0;r<this.holes.length;r++)for(var s=this.holes[r].getCoordinates(),o=0;o<s.length;o++)e++,t[e]=s[o];return t},getArea:function(){var t=0;t+=Math.abs(he.signedArea(this.shell.getCoordinateSequence()));for(var e=0;e<this.holes.length;e++)t-=Math.abs(he.signedArea(this.holes[e].getCoordinateSequence()));return t},isRectangle:function(){if(0!==this.getNumInteriorRing())return!1;if(null===this.shell)return!1;if(5!==this.shell.getNumPoints())return!1;for(var t=this.shell.getCoordinateSequence(),e=this.getEnvelopeInternal(),n=0;5>n;n++){var i=t.getX(n);if(i!==e.getMinX()&&i!==e.getMaxX())return!1;var r=t.getY(n);if(r!==e.getMinY()&&r!==e.getMaxY())return!1}for(var s=t.getX(0),o=t.getY(0),n=1;4>=n;n++){var i=t.getX(n),r=t.getY(n),a=i!==s,u=r!==o;if(a===u)return!1;s=i,o=r}return!0},equalsExact:function(){if(2===arguments.length){var t=arguments[0],e=arguments[1];if(!this.isEquivalentClass(t))return!1;var n=t,i=this.shell,r=n.shell;if(!i.equalsExact(r,e))return!1;if(this.holes.length!==n.holes.length)return!1;for(var s=0;s<this.holes.length;s++)if(!this.holes[s].equalsExact(n.holes[s],e))return!1;return!0}return B.prototype.equalsExact.apply(this,arguments)},normalize:function(){if(0===arguments.length){this.normalize(this.shell,!0);for(var t=0;t<this.holes.length;t++)this.normalize(this.holes[t],!1);ut.sort(this.holes)}else if(2===arguments.length){var e=arguments[0],n=arguments[1];if(e.isEmpty())return null;var i=new Array(e.getCoordinates().length-1).fill(null);A.arraycopy(e.getCoordinates(),0,i,0,i.length);var r=H.minCoordinate(e.getCoordinates());H.scroll(i,r),A.arraycopy(i,0,e.getCoordinates(),0,i.length),e.getCoordinates()[i.length]=i[0],he.isCCW(e.getCoordinates())===n&&H.reverse(e.getCoordinates())}},getCoordinate:function(){return this.shell.getCoordinate()},getNumInteriorRing:function(){return this.holes.length},getBoundaryDimension:function(){return 1},getDimension:function(){return 2},getLength:function(){var t=0;t+=this.shell.getLength();for(var e=0;e<this.holes.length;e++)t+=this.holes[e].getLength();return t},getNumPoints:function(){for(var t=this.shell.getNumPoints(),e=0;e<this.holes.length;e++)t+=this.holes[e].getNumPoints();return t},reverse:function(){var t=this.copy();t.shell=this.shell.copy().reverse(),t.holes=new Array(this.holes.length).fill(null);for(var e=0;e<this.holes.length;e++)t.holes[e]=this.holes[e].copy().reverse();return t},convexHull:function(){return this.getExteriorRing().convexHull()},compareToSameClass:function(){if(1===arguments.length){var t=arguments[0],e=this.shell,n=t.shell;return e.compareToSameClass(n)}if(2===arguments.length){var i=arguments[0],r=arguments[1],s=i,e=this.shell,n=s.shell,o=e.compareToSameClass(n,r);if(0!==o)return o;for(var a=this.getNumInteriorRing(),u=s.getNumInteriorRing(),l=0;a>l&&u>l;){var h=this.getInteriorRingN(l),c=s.getInteriorRingN(l),f=h.compareToSameClass(c,r);if(0!==f)return f;l++}return a>l?1:u>l?-1:0}},apply:function(){if(R(arguments[0],z)){var t=arguments[0];this.shell.apply(t);for(var e=0;e<this.holes.length;e++)this.holes[e].apply(t)}else if(R(arguments[0],ct)){var n=arguments[0];if(this.shell.apply(n),!n.isDone())for(var e=0;e<this.holes.length&&(this.holes[e].apply(n),!n.isDone());e++);n.isGeometryChanged()&&this.geometryChanged()}else if(R(arguments[0],ht)){var i=arguments[0];i.filter(this)}else if(R(arguments[0],q)){var r=arguments[0];r.filter(this),this.shell.apply(r);for(var e=0;e<this.holes.length;e++)this.holes[e].apply(r)}},getBoundary:function(){if(this.isEmpty())return this.getFactory().createMultiLineString();var t=new Array(this.holes.length+1).fill(null);t[0]=this.shell;for(var e=0;e<this.holes.length;e++)t[e+1]=this.holes[e];return t.length<=1?this.getFactory().createLinearRing(t[0].getCoordinateSequence()):this.getFactory().createMultiLineString(t)},clone:function(){var t=B.prototype.clone.call(this);t.shell=this.shell.clone(),t.holes=new Array(this.holes.length).fill(null);for(var e=0;e<this.holes.length;e++)t.holes[e]=this.holes[e].clone();return t},getGeometryType:function(){return"Polygon"},copy:function(){for(var t=this.shell.copy(),e=new Array(this.holes.length).fill(null),n=0;n<e.length;n++)e[n]=this.holes[n].copy();return new Tt(t,e,this.factory)},getExteriorRing:function(){return this.shell},isEmpty:function(){return this.shell.isEmpty()},getInteriorRingN:function(t){return this.holes[t]},interfaces_:function(){return[Rt]},getClass:function(){return Tt}}),Tt.serialVersionUID=-0x307ffefd8dc97200,h(Pt,ft),e(Pt.prototype,{getSortIndex:function(){return B.SORTINDEX_MULTIPOINT},isValid:function(){return!0},equalsExact:function(){if(2===arguments.length){var t=arguments[0],e=arguments[1];return this.isEquivalentClass(t)?ft.prototype.equalsExact.call(this,t,e):!1}return ft.prototype.equalsExact.apply(this,arguments)},getCoordinate:function(){if(1===arguments.length){var t=arguments[0];return this.geometries[t].getCoordinate()}return ft.prototype.getCoordinate.apply(this,arguments)},getBoundaryDimension:function(){return lt.FALSE},getDimension:function(){return 0},getBoundary:function(){return this.getFactory().createGeometryCollection(null)},getGeometryType:function(){return"MultiPoint"},copy:function(){for(var t=new Array(this.geometries.length).fill(null),e=0;e<t.length;e++)t[e]=this.geometries[e].copy();return new Pt(t,this.factory)},interfaces_:function(){return[wt]},getClass:function(){return Pt}}),Pt.serialVersionUID=-0x6fb1ed4162e0fc00,h(bt,St),e(bt.prototype,{getSortIndex:function(){return B.SORTINDEX_LINEARRING},getBoundaryDimension:function(){return lt.FALSE},isClosed:function(){return this.isEmpty()?!0:St.prototype.isClosed.call(this)},reverse:function(){var t=this.points.copy();Ct.reverse(t);var e=this.getFactory().createLinearRing(t);return e},validateConstruction:function(){if(!this.isEmpty()&&!St.prototype.isClosed.call(this))throw new i("Points of LinearRing do not form a closed linestring");if(this.getCoordinateSequence().size()>=1&&this.getCoordinateSequence().size()<bt.MINIMUM_VALID_SIZE)throw new i("Invalid number of points in LinearRing (found "+this.getCoordinateSequence().size()+" - must be 0 or >= 4)")},getGeometryType:function(){return"LinearRing"},copy:function(){return new bt(this.points.copy(),this.factory)},interfaces_:function(){return[]},getClass:function(){return bt}}),bt.MINIMUM_VALID_SIZE=4,bt.serialVersionUID=-0x3b229e262367a600,h(Ot,ft),e(Ot.prototype,{getSortIndex:function(){return B.SORTINDEX_MULTIPOLYGON},equalsExact:function(){if(2===arguments.length){var t=arguments[0],e=arguments[1];return this.isEquivalentClass(t)?ft.prototype.equalsExact.call(this,t,e):!1}return ft.prototype.equalsExact.apply(this,arguments)},getBoundaryDimension:function(){return 1},getDimension:function(){return 2},reverse:function(){for(var t=this.geometries.length,e=new Array(t).fill(null),n=0;n<this.geometries.length;n++)e[n]=this.geometries[n].reverse();return this.getFactory().createMultiPolygon(e)},getBoundary:function(){if(this.isEmpty())return this.getFactory().createMultiLineString();for(var t=new I,e=0;e<this.geometries.length;e++)for(var n=this.geometries[e],i=n.getBoundary(),r=0;r<i.getNumGeometries();r++)t.add(i.getGeometryN(r));var s=new Array(t.size()).fill(null);return this.getFactory().createMultiLineString(t.toArray(s))},getGeometryType:function(){return"MultiPolygon"},copy:function(){for(var t=new Array(this.geometries.length).fill(null),e=0;e<t.length;e++)t[e]=this.geometries[e].copy();return new Ot(t,this.factory)},interfaces_:function(){return[Rt]},getClass:function(){return Ot}}),Ot.serialVersionUID=-0x7a5aa1369171980,e(_t.prototype,{setCopyUserData:function(t){this.isUserDataCopied=t},edit:function(t,e){if(null===t)return null;var n=this.editInternal(t,e);return this.isUserDataCopied&&n.setUserData(t.getUserData()),n},editInternal:function(t,e){return null===this.factory&&(this.factory=t.getFactory()),t instanceof ft?this.editGeometryCollection(t,e):t instanceof Tt?this.editPolygon(t,e):t instanceof Lt?e.edit(t,this.factory):t instanceof St?e.edit(t,this.factory):(f.shouldNeverReachHere("Unsupported Geometry class: "+t.getClass().getName()),null)},editGeometryCollection:function(t,e){for(var n=e.edit(t,this.factory),i=new I,r=0;r<n.getNumGeometries();r++){var s=this.edit(n.getGeometryN(r),e);null===s||s.isEmpty()||i.add(s)}return n.getClass()===Pt?this.factory.createMultiPoint(i.toArray([])):n.getClass()===gt?this.factory.createMultiLineString(i.toArray([])):n.getClass()===Ot?this.factory.createMultiPolygon(i.toArray([])):this.factory.createGeometryCollection(i.toArray([]))},editPolygon:function(t,e){var n=e.edit(t,this.factory);if(null===n&&(n=this.factory.createPolygon(null)),n.isEmpty())return n;var i=this.edit(n.getExteriorRing(),e);if(null===i||i.isEmpty())return this.factory.createPolygon();for(var r=new I,s=0;s<n.getNumInteriorRing();s++){var o=this.edit(n.getInteriorRingN(s),e);null===o||o.isEmpty()||r.add(o)}return this.factory.createPolygon(i,r.toArray([]))},interfaces_:function(){return[]},getClass:function(){return _t}}),_t.GeometryEditorOperation=Mt,e(Dt.prototype,{edit:function(t,e){return t},interfaces_:function(){return[Mt]},getClass:function(){return Dt}}),e(At.prototype,{edit:function(t,e){if(t instanceof bt)return e.createLinearRing(this.editCoordinates(t.getCoordinates(),t));if(t instanceof St)return e.createLineString(this.editCoordinates(t.getCoordinates(),t));if(t instanceof Lt){var n=this.editCoordinates(t.getCoordinates(),t);return n.length>0?e.createPoint(n[0]):e.createPoint()}return t},interfaces_:function(){return[Mt]},getClass:function(){return At}}),e(Ft.prototype,{edit:function(t,e){return t instanceof bt?e.createLinearRing(this.edit(t.getCoordinateSequence(),t)):t instanceof St?e.createLineString(this.edit(t.getCoordinateSequence(),t)):t instanceof Lt?e.createPoint(this.edit(t.getCoordinateSequence(),t)):t},interfaces_:function(){return[Mt]},getClass:function(){return Ft}}),_t.NoOpGeometryOperation=Dt,_t.CoordinateOperation=At,_t.CoordinateSequenceOperation=Ft,e(Gt.prototype,{setOrdinate:function(t,e,n){switch(e){case D.X:this.coordinates[t].x=n;break;case D.Y:this.coordinates[t].y=n;break;case D.Z:this.coordinates[t].z=n;break;default:throw new i("invalid ordinateIndex")}},size:function(){return this.coordinates.length},getOrdinate:function(t,e){switch(e){case D.X:return this.coordinates[t].x;case D.Y:return this.coordinates[t].y;case D.Z:return this.coordinates[t].z}return r.NaN},getCoordinate:function(){if(1===arguments.length){var t=arguments[0];return this.coordinates[t]}if(2===arguments.length){var e=arguments[0],n=arguments[1];n.x=this.coordinates[e].x,n.y=this.coordinates[e].y,n.z=this.coordinates[e].z}},getCoordinateCopy:function(t){return new g(this.coordinates[t])},getDimension:function(){return this.dimension},getX:function(t){return this.coordinates[t].x},clone:function(){for(var t=new Array(this.size()).fill(null),e=0;e<this.coordinates.length;e++)t[e]=this.coordinates[e].clone();return new Gt(t,this.dimension)},expandEnvelope:function(t){for(var e=0;e<this.coordinates.length;e++)t.expandToInclude(this.coordinates[e]);return t},copy:function(){for(var t=new Array(this.size()).fill(null),e=0;e<this.coordinates.length;e++)t[e]=this.coordinates[e].copy();return new Gt(t,this.dimension)},toString:function(){if(this.coordinates.length>0){var t=new P(17*this.coordinates.length);t.append("("),t.append(this.coordinates[0]);for(var e=1;e<this.coordinates.length;e++)t.append(", "),t.append(this.coordinates[e]);return t.append(")"),t.toString()}return"()"},getY:function(t){return this.coordinates[t].y},toCoordinateArray:function(){return this.coordinates},interfaces_:function(){return[D,u]},getClass:function(){return Gt}}),Gt.serialVersionUID=-0xcb44a778db18e00,e(qt.prototype,{readResolve:function(){return qt.instance()},create:function(){if(1===arguments.length){if(arguments[0]instanceof Array){var t=arguments[0];return new Gt(t)}if(R(arguments[0],D)){var e=arguments[0];return new Gt(e)}}else if(2===arguments.length){var n=arguments[0],i=arguments[1];return i>3&&(i=3),2>i?new Gt(n):new Gt(n,i)}},interfaces_:function(){return[G,u]},getClass:function(){return qt}}),qt.instance=function(){return qt.instanceObject},qt.serialVersionUID=-0x38e49fa6cf6f2e00,qt.instanceObject=new qt;var no,io=Object.defineProperty,ro=zt({delete:kt,has:Xt,get:Yt,set:Ht,keys:jt,values:Kt,entries:Zt,forEach:$t,clear:Wt}),so="undefined"!=typeof Map&&Map.prototype.values?Map:ro;te.prototype=new K,te.prototype.get=function(t){return this.map_.get(t)||null},te.prototype.put=function(t,e){return this.map_.set(t,e),e},te.prototype.values=function(){for(var t=new I,e=this.map_.values(),n=e.next();!n.done;)t.add(n.value),n=e.next();return t},te.prototype.entrySet=function(){var t=new J;return this.map_.entries().forEach(function(e){return t.add(e)}),t},te.prototype.size=function(){return this.map_.size()},e(ee.prototype,{equals:function(t){if(!(t instanceof ee))return!1;var e=t;return this.modelType===e.modelType&&this.scale===e.scale},compareTo:function(t){var e=t,n=this.getMaximumSignificantDigits(),i=e.getMaximumSignificantDigits();return new b(n).compareTo(new b(i))},getScale:function(){return this.scale},isFloating:function(){return this.modelType===ee.FLOATING||this.modelType===ee.FLOATING_SINGLE},getType:function(){return this.modelType},toString:function(){var t="UNKNOWN";return this.modelType===ee.FLOATING?t="Floating":this.modelType===ee.FLOATING_SINGLE?t="Floating-Single":this.modelType===ee.FIXED&&(t="Fixed (Scale="+this.getScale()+")"),t},makePrecise:function(){if("number"==typeof arguments[0]){var t=arguments[0];if(r.isNaN(t))return t;if(this.modelType===ee.FLOATING_SINGLE){var e=t;return e}return this.modelType===ee.FIXED?Math.round(t*this.scale)/this.scale:t}if(arguments[0]instanceof g){var n=arguments[0];if(this.modelType===ee.FLOATING)return null;n.x=this.makePrecise(n.x),n.y=this.makePrecise(n.y)}},getMaximumSignificantDigits:function(){var t=16;return this.modelType===ee.FLOATING?t=16:this.modelType===ee.FLOATING_SINGLE?t=6:this.modelType===ee.FIXED&&(t=1+Math.trunc(Math.ceil(Math.log(this.getScale())/Math.log(10)))),t},setScale:function(t){this.scale=Math.abs(t)},interfaces_:function(){return[u,s]},getClass:function(){return ee}}),ee.mostPrecise=function(t,e){return t.compareTo(e)>=0?t:e},e(ne.prototype,{readResolve:function(){return ne.nameToTypeMap.get(this.name)},toString:function(){return this.name},interfaces_:function(){return[u]},getClass:function(){return ne}}),ne.serialVersionUID=-552860263173159e4,ne.nameToTypeMap=new te,ee.Type=ne,ee.serialVersionUID=0x6bee6404e9a25c00,ee.FIXED=new ne("FIXED"),ee.FLOATING=new ne("FLOATING"),ee.FLOATING_SINGLE=new ne("FLOATING SINGLE"),ee.maximumPreciseValue=9007199254740992,e(ie.prototype,{toGeometry:function(t){return t.isNull()?this.createPoint(null):t.getMinX()===t.getMaxX()&&t.getMinY()===t.getMaxY()?this.createPoint(new g(t.getMinX(),t.getMinY())):t.getMinX()===t.getMaxX()||t.getMinY()===t.getMaxY()?this.createLineString([new g(t.getMinX(),t.getMinY()),new g(t.getMaxX(),t.getMaxY())]):this.createPolygon(this.createLinearRing([new g(t.getMinX(),t.getMinY()),new g(t.getMinX(),t.getMaxY()),new g(t.getMaxX(),t.getMaxY()),new g(t.getMaxX(),t.getMinY()),new g(t.getMinX(),t.getMinY())]),null)},createLineString:function(){if(0===arguments.length)return this.createLineString(this.getCoordinateSequenceFactory().create([]));if(1===arguments.length){if(arguments[0]instanceof Array){var t=arguments[0];return this.createLineString(null!==t?this.getCoordinateSequenceFactory().create(t):null)}if(R(arguments[0],D)){var e=arguments[0];return new St(e,this)}}},createMultiLineString:function(){if(0===arguments.length)return new gt(null,this);if(1===arguments.length){var t=arguments[0];return new gt(t,this)}},buildGeometry:function(t){for(var e=null,n=!1,i=!1,r=t.iterator();r.hasNext();){var s=r.next(),o=s.getClass();null===e&&(e=o),o!==e&&(n=!0),s.isGeometryCollectionOrDerived()&&(i=!0)}if(null===e)return this.createGeometryCollection();if(n||i)return this.createGeometryCollection(ie.toGeometryArray(t));var a=t.iterator().next(),u=t.size()>1;if(u){if(a instanceof Tt)return this.createMultiPolygon(ie.toPolygonArray(t));if(a instanceof St)return this.createMultiLineString(ie.toLineStringArray(t));if(a instanceof Lt)return this.createMultiPoint(ie.toPointArray(t));f.shouldNeverReachHere("Unhandled class: "+a.getClass().getName())}return a},createMultiPointFromCoords:function(t){return this.createMultiPoint(null!==t?this.getCoordinateSequenceFactory().create(t):null)},createPoint:function(){if(0===arguments.length)return this.createPoint(this.getCoordinateSequenceFactory().create([]));if(1===arguments.length){if(arguments[0]instanceof g){var t=arguments[0];return this.createPoint(null!==t?this.getCoordinateSequenceFactory().create([t]):null)}if(R(arguments[0],D)){var e=arguments[0];return new Lt(e,this)}}},getCoordinateSequenceFactory:function(){return this.coordinateSequenceFactory},createPolygon:function(){if(0===arguments.length)return new Tt(null,null,this);if(1===arguments.length){if(R(arguments[0],D)){var t=arguments[0];return this.createPolygon(this.createLinearRing(t))}if(arguments[0]instanceof Array){var e=arguments[0];return this.createPolygon(this.createLinearRing(e))}if(arguments[0]instanceof bt){var n=arguments[0];return this.createPolygon(n,null)}}else if(2===arguments.length){var i=arguments[0],r=arguments[1];return new Tt(i,r,this)}},getSRID:function(){return this.SRID},createGeometryCollection:function(){if(0===arguments.length)return new ft(null,this);if(1===arguments.length){var t=arguments[0];return new ft(t,this)}},createGeometry:function(t){var e=new _t(this);return e.edit(t,{edit:function(){if(2===arguments.length){var t=arguments[0];arguments[1];return this.coordinateSequenceFactory.create(t)}}})},getPrecisionModel:function(){return this.precisionModel},createLinearRing:function(){if(0===arguments.length)return this.createLinearRing(this.getCoordinateSequenceFactory().create([]));if(1===arguments.length){if(arguments[0]instanceof Array){var t=arguments[0];return this.createLinearRing(null!==t?this.getCoordinateSequenceFactory().create(t):null)}if(R(arguments[0],D)){var e=arguments[0];return new bt(e,this)}}},createMultiPolygon:function(){if(0===arguments.length)return new Ot(null,this);if(1===arguments.length){var t=arguments[0];return new Ot(t,this)}},createMultiPoint:function(){if(0===arguments.length)return new Pt(null,this);if(1===arguments.length){if(arguments[0]instanceof Array){var t=arguments[0];return new Pt(t,this)}if(arguments[0]instanceof Array){var e=arguments[0];return this.createMultiPoint(null!==e?this.getCoordinateSequenceFactory().create(e):null)}if(R(arguments[0],D)){var n=arguments[0];if(null===n)return this.createMultiPoint(new Array(0).fill(null));for(var i=new Array(n.size()).fill(null),r=0;r<n.size();r++){var s=this.getCoordinateSequenceFactory().create(1,n.getDimension());Ct.copy(n,r,s,0,1),i[r]=this.createPoint(s)}return this.createMultiPoint(i)}}},interfaces_:function(){return[u]},getClass:function(){return ie}}),ie.toMultiPolygonArray=function(t){var e=new Array(t.size()).fill(null);return t.toArray(e)},ie.toGeometryArray=function(t){if(null===t)return null;var e=new Array(t.size()).fill(null);return t.toArray(e)},ie.getDefaultCoordinateSequenceFactory=function(){return qt.instance()},ie.toMultiLineStringArray=function(t){var e=new Array(t.size()).fill(null);return t.toArray(e)},ie.toLineStringArray=function(t){var e=new Array(t.size()).fill(null);return t.toArray(e)},ie.toMultiPointArray=function(t){var e=new Array(t.size()).fill(null);return t.toArray(e)},ie.toLinearRingArray=function(t){var e=new Array(t.size()).fill(null);return t.toArray(e)},ie.toPointArray=function(t){var e=new Array(t.size()).fill(null);return t.toArray(e)},ie.toPolygonArray=function(t){var e=new Array(t.size()).fill(null);return t.toArray(e)},ie.createPointFromInternalCoord=function(t,e){return e.getPrecisionModel().makePrecise(t),e.getFactory().createPoint(t)},ie.serialVersionUID=-0x5ea75f2051eeb400;var oo={typeStr:/^\s*(\w+)\s*\(\s*(.*)\s*\)\s*$/,emptyTypeStr:/^\s*(\w+)\s*EMPTY\s*$/,spaces:/\s+/,parenComma:/\)\s*,\s*\(/,doubleParenComma:/\)\s*\)\s*,\s*\(\s*\(/,trimParens:/^\s*\(?(.*?)\)?\s*$/};e(re.prototype,{read:function(t){var e,n,i;t=t.replace(/[\n\r]/g," ");var r=oo.typeStr.exec(t);if(-1!==t.search("EMPTY")&&(r=oo.emptyTypeStr.exec(t),r[2]=void 0),r&&(n=r[1].toLowerCase(),i=r[2],uo[n]&&(e=uo[n].apply(this,[i]))),void 0===e)throw new Error("Could not parse WKT "+t);return e},write:function(t){return this.extractGeometry(t)},extractGeometry:function(t){var e=t.getGeometryType().toLowerCase();if(!ao[e])return null;var n,i=e.toUpperCase();return n=t.isEmpty()?i+" EMPTY":i+"("+ao[e].apply(this,[t])+")"}});var ao={coordinate:function(t){return t.x+" "+t.y},point:function(t){
return ao.coordinate.call(this,t.coordinates.coordinates[0])},multipoint:function(t){for(var e=[],n=0,i=t.geometries.length;i>n;++n)e.push("("+ao.point.apply(this,[t.geometries[n]])+")");return e.join(",")},linestring:function(t){for(var e=[],n=0,i=t.points.coordinates.length;i>n;++n)e.push(ao.coordinate.apply(this,[t.points.coordinates[n]]));return e.join(",")},linearring:function(t){for(var e=[],n=0,i=t.points.coordinates.length;i>n;++n)e.push(ao.coordinate.apply(this,[t.points.coordinates[n]]));return e.join(",")},multilinestring:function(t){for(var e=[],n=0,i=t.geometries.length;i>n;++n)e.push("("+ao.linestring.apply(this,[t.geometries[n]])+")");return e.join(",")},polygon:function(t){var e=[];e.push("("+ao.linestring.apply(this,[t.shell])+")");for(var n=0,i=t.holes.length;i>n;++n)e.push("("+ao.linestring.apply(this,[t.holes[n]])+")");return e.join(",")},multipolygon:function(t){for(var e=[],n=0,i=t.geometries.length;i>n;++n)e.push("("+ao.polygon.apply(this,[t.geometries[n]])+")");return e.join(",")},geometrycollection:function(t){for(var e=[],n=0,i=t.geometries.length;i>n;++n)e.push(this.extractGeometry(t.geometries[n]));return e.join(",")}},uo={point:function(t){if(void 0===t)return this.geometryFactory.createPoint();var e=t.trim().split(oo.spaces);return this.geometryFactory.createPoint(new g(Number.parseFloat(e[0]),Number.parseFloat(e[1])))},multipoint:function(t){if(void 0===t)return this.geometryFactory.createMultiPoint();for(var e,n=t.trim().split(","),i=[],r=0,s=n.length;s>r;++r)e=n[r].replace(oo.trimParens,"$1"),i.push(uo.point.apply(this,[e]));return this.geometryFactory.createMultiPoint(i)},linestring:function(t){if(void 0===t)return this.geometryFactory.createLineString();for(var e,n=t.trim().split(","),i=[],r=0,s=n.length;s>r;++r)e=n[r].trim().split(oo.spaces),i.push(new g(Number.parseFloat(e[0]),Number.parseFloat(e[1])));return this.geometryFactory.createLineString(i)},linearring:function(t){if(void 0===t)return this.geometryFactory.createLinearRing();for(var e,n=t.trim().split(","),i=[],r=0,s=n.length;s>r;++r)e=n[r].trim().split(oo.spaces),i.push(new g(Number.parseFloat(e[0]),Number.parseFloat(e[1])));return this.geometryFactory.createLinearRing(i)},multilinestring:function(t){if(void 0===t)return this.geometryFactory.createMultiLineString();for(var e,n=t.trim().split(oo.parenComma),i=[],r=0,s=n.length;s>r;++r)e=n[r].replace(oo.trimParens,"$1"),i.push(uo.linestring.apply(this,[e]));return this.geometryFactory.createMultiLineString(i)},polygon:function(t){if(void 0===t)return this.geometryFactory.createPolygon();for(var e,n,i,r,s=t.trim().split(oo.parenComma),o=[],a=0,u=s.length;u>a;++a)e=s[a].replace(oo.trimParens,"$1"),n=uo.linestring.apply(this,[e]),i=this.geometryFactory.createLinearRing(n.points),0===a?r=i:o.push(i);return this.geometryFactory.createPolygon(r,o)},multipolygon:function(t){if(void 0===t)return this.geometryFactory.createMultiPolygon();for(var e,n=t.trim().split(oo.doubleParenComma),i=[],r=0,s=n.length;s>r;++r)e=n[r].replace(oo.trimParens,"$1"),i.push(uo.polygon.apply(this,[e]));return this.geometryFactory.createMultiPolygon(i)},geometrycollection:function(t){if(void 0===t)return this.geometryFactory.createGeometryCollection();t=t.replace(/,\s*([A-Za-z])/g,"|$1");for(var e=t.trim().split("|"),n=[],i=0,r=e.length;r>i;++i)n.push(this.read(e[i]));return this.geometryFactory.createGeometryCollection(n)}};e(se.prototype,{write:function(t){return this.parser.write(t)}}),e(se,{toLineString:function(t,e){if(2!==arguments.length)throw new Error("Not implemented");return"LINESTRING ( "+t.x+" "+t.y+", "+e.x+" "+e.y+" )"}}),e(oe.prototype,{getIndexAlongSegment:function(t,e){return this.computeIntLineIndex(),this.intLineIndex[t][e]},getTopologySummary:function(){var t=new P;return this.isEndPoint()&&t.append(" endpoint"),this._isProper&&t.append(" proper"),this.isCollinear()&&t.append(" collinear"),t.toString()},computeIntersection:function(t,e,n,i){this.inputLines[0][0]=t,this.inputLines[0][1]=e,this.inputLines[1][0]=n,this.inputLines[1][1]=i,this.result=this.computeIntersect(t,e,n,i)},getIntersectionNum:function(){return this.result},computeIntLineIndex:function(){if(0===arguments.length)null===this.intLineIndex&&(this.intLineIndex=Array(2).fill().map(function(){return Array(2)}),this.computeIntLineIndex(0),this.computeIntLineIndex(1));else if(1===arguments.length){var t=arguments[0],e=this.getEdgeDistance(t,0),n=this.getEdgeDistance(t,1);e>n?(this.intLineIndex[t][0]=0,this.intLineIndex[t][1]=1):(this.intLineIndex[t][0]=1,this.intLineIndex[t][1]=0)}},isProper:function(){return this.hasIntersection()&&this._isProper},setPrecisionModel:function(t){this.precisionModel=t},isInteriorIntersection:function(){if(0===arguments.length)return this.isInteriorIntersection(0)?!0:!!this.isInteriorIntersection(1);if(1===arguments.length){for(var t=arguments[0],e=0;e<this.result;e++)if(!this.intPt[e].equals2D(this.inputLines[t][0])&&!this.intPt[e].equals2D(this.inputLines[t][1]))return!0;return!1}},getIntersection:function(t){return this.intPt[t]},isEndPoint:function(){return this.hasIntersection()&&!this._isProper},hasIntersection:function(){return this.result!==oe.NO_INTERSECTION},getEdgeDistance:function(t,e){var n=oe.computeEdgeDistance(this.intPt[e],this.inputLines[t][0],this.inputLines[t][1]);return n},isCollinear:function(){return this.result===oe.COLLINEAR_INTERSECTION},toString:function(){return se.toLineString(this.inputLines[0][0],this.inputLines[0][1])+" - "+se.toLineString(this.inputLines[1][0],this.inputLines[1][1])+this.getTopologySummary()},getEndpoint:function(t,e){return this.inputLines[t][e]},isIntersection:function(t){for(var e=0;e<this.result;e++)if(this.intPt[e].equals2D(t))return!0;return!1},getIntersectionAlongSegment:function(t,e){return this.computeIntLineIndex(),this.intPt[this.intLineIndex[t][e]]},interfaces_:function(){return[]},getClass:function(){return oe}}),oe.computeEdgeDistance=function(t,e,n){var i=Math.abs(n.x-e.x),r=Math.abs(n.y-e.y),s=-1;if(t.equals(e))s=0;else if(t.equals(n))s=i>r?i:r;else{var o=Math.abs(t.x-e.x),a=Math.abs(t.y-e.y);s=i>r?o:a,0!==s||t.equals(e)||(s=Math.max(o,a))}return f.isTrue(!(0===s&&!t.equals(e)),"Bad distance calculation"),s},oe.nonRobustComputeEdgeDistance=function(t,e,n){var i=t.x-e.x,r=t.y-e.y,s=Math.sqrt(i*i+r*r);return f.isTrue(!(0===s&&!t.equals(e)),"Invalid distance calculation"),s},oe.DONT_INTERSECT=0,oe.DO_INTERSECT=1,oe.COLLINEAR=2,oe.NO_INTERSECTION=0,oe.POINT_INTERSECTION=1,oe.COLLINEAR_INTERSECTION=2,h(ae,oe),e(ae.prototype,{isInSegmentEnvelopes:function(t){var e=new C(this.inputLines[0][0],this.inputLines[0][1]),n=new C(this.inputLines[1][0],this.inputLines[1][1]);return e.contains(t)&&n.contains(t)},computeIntersection:function(){if(3!==arguments.length)return oe.prototype.computeIntersection.apply(this,arguments);var t=arguments[0],e=arguments[1],n=arguments[2];return this._isProper=!1,C.intersects(e,n,t)&&0===he.orientationIndex(e,n,t)&&0===he.orientationIndex(n,e,t)?(this._isProper=!0,(t.equals(e)||t.equals(n))&&(this._isProper=!1),this.result=oe.POINT_INTERSECTION,null):void(this.result=oe.NO_INTERSECTION)},normalizeToMinimum:function(t,e,n,i,r){r.x=this.smallestInAbsValue(t.x,e.x,n.x,i.x),r.y=this.smallestInAbsValue(t.y,e.y,n.y,i.y),t.x-=r.x,t.y-=r.y,e.x-=r.x,e.y-=r.y,n.x-=r.x,n.y-=r.y,i.x-=r.x,i.y-=r.y},safeHCoordinateIntersection:function(t,e,n,i){var r=null;try{r=F.intersection(t,e,n,i)}catch(s){if(!(s instanceof w))throw s;r=ae.nearestEndpoint(t,e,n,i)}finally{}return r},intersection:function(t,e,n,i){var r=this.intersectionWithNormalization(t,e,n,i);return this.isInSegmentEnvelopes(r)||(r=new g(ae.nearestEndpoint(t,e,n,i))),null!==this.precisionModel&&this.precisionModel.makePrecise(r),r},smallestInAbsValue:function(t,e,n,i){var r=t,s=Math.abs(r);return Math.abs(e)<s&&(r=e,s=Math.abs(e)),Math.abs(n)<s&&(r=n,s=Math.abs(n)),Math.abs(i)<s&&(r=i),r},checkDD:function(t,e,n,i,r){var s=M.intersection(t,e,n,i),o=this.isInSegmentEnvelopes(s);A.out.println("DD in env = "+o+"  --------------------- "+s),r.distance(s)>1e-4&&A.out.println("Distance = "+r.distance(s))},intersectionWithNormalization:function(t,e,n,i){var r=new g(t),s=new g(e),o=new g(n),a=new g(i),u=new g;this.normalizeToEnvCentre(r,s,o,a,u);var l=this.safeHCoordinateIntersection(r,s,o,a);return l.x+=u.x,l.y+=u.y,l},computeCollinearIntersection:function(t,e,n,i){var r=C.intersects(t,e,n),s=C.intersects(t,e,i),o=C.intersects(n,i,t),a=C.intersects(n,i,e);return r&&s?(this.intPt[0]=n,this.intPt[1]=i,oe.COLLINEAR_INTERSECTION):o&&a?(this.intPt[0]=t,this.intPt[1]=e,oe.COLLINEAR_INTERSECTION):r&&o?(this.intPt[0]=n,this.intPt[1]=t,!n.equals(t)||s||a?oe.COLLINEAR_INTERSECTION:oe.POINT_INTERSECTION):r&&a?(this.intPt[0]=n,this.intPt[1]=e,!n.equals(e)||s||o?oe.COLLINEAR_INTERSECTION:oe.POINT_INTERSECTION):s&&o?(this.intPt[0]=i,this.intPt[1]=t,!i.equals(t)||r||a?oe.COLLINEAR_INTERSECTION:oe.POINT_INTERSECTION):s&&a?(this.intPt[0]=i,this.intPt[1]=e,!i.equals(e)||r||o?oe.COLLINEAR_INTERSECTION:oe.POINT_INTERSECTION):oe.NO_INTERSECTION},normalizeToEnvCentre:function(t,e,n,i,r){var s=t.x<e.x?t.x:e.x,o=t.y<e.y?t.y:e.y,a=t.x>e.x?t.x:e.x,u=t.y>e.y?t.y:e.y,l=n.x<i.x?n.x:i.x,h=n.y<i.y?n.y:i.y,c=n.x>i.x?n.x:i.x,f=n.y>i.y?n.y:i.y,g=s>l?s:l,d=c>a?a:c,p=o>h?o:h,v=f>u?u:f,m=(g+d)/2,y=(p+v)/2;r.x=m,r.y=y,t.x-=r.x,t.y-=r.y,e.x-=r.x,e.y-=r.y,n.x-=r.x,n.y-=r.y,i.x-=r.x,i.y-=r.y},computeIntersect:function(t,e,n,i){if(this._isProper=!1,!C.intersects(t,e,n,i))return oe.NO_INTERSECTION;var r=he.orientationIndex(t,e,n),s=he.orientationIndex(t,e,i);if(r>0&&s>0||0>r&&0>s)return oe.NO_INTERSECTION;var o=he.orientationIndex(n,i,t),a=he.orientationIndex(n,i,e);if(o>0&&a>0||0>o&&0>a)return oe.NO_INTERSECTION;var u=0===r&&0===s&&0===o&&0===a;return u?this.computeCollinearIntersection(t,e,n,i):(0===r||0===s||0===o||0===a?(this._isProper=!1,t.equals2D(n)||t.equals2D(i)?this.intPt[0]=t:e.equals2D(n)||e.equals2D(i)?this.intPt[0]=e:0===r?this.intPt[0]=new g(n):0===s?this.intPt[0]=new g(i):0===o?this.intPt[0]=new g(t):0===a&&(this.intPt[0]=new g(e))):(this._isProper=!0,this.intPt[0]=this.intersection(t,e,n,i)),oe.POINT_INTERSECTION)},interfaces_:function(){return[]},getClass:function(){return ae}}),ae.nearestEndpoint=function(t,e,n,i){var r=t,s=he.distancePointLine(t,n,i),o=he.distancePointLine(e,n,i);return s>o&&(s=o,r=e),o=he.distancePointLine(n,t,e),s>o&&(s=o,r=n),o=he.distancePointLine(i,t,e),s>o&&(s=o,r=i),r},e(ue.prototype,{interfaces_:function(){return[]},getClass:function(){return ue}}),ue.orientationIndex=function(t,e,n){var i=e.x-t.x,r=e.y-t.y,s=n.x-e.x,o=n.y-e.y;return ue.signOfDet2x2(i,r,s,o)},ue.signOfDet2x2=function(t,e,n,i){var r=null,s=null,o=null,a=0;if(r=1,0===t||0===i)return 0===e||0===n?0:e>0?n>0?-r:r:n>0?r:-r;if(0===e||0===n)return i>0?t>0?r:-r:t>0?-r:r;if(e>0?i>0?i>=e||(r=-r,s=t,t=n,n=s,s=e,e=i,i=s):-i>=e?(r=-r,n=-n,i=-i):(s=t,t=-n,n=s,s=e,e=-i,i=s):i>0?i>=-e?(r=-r,t=-t,e=-e):(s=-t,t=n,n=s,s=-e,e=i,i=s):e>=i?(t=-t,e=-e,n=-n,i=-i):(r=-r,s=-t,t=-n,n=s,s=-e,e=-i,i=s),t>0){if(!(n>0))return r;if(!(n>=t))return r}else{if(n>0)return-r;if(!(t>=n))return-r;r=-r,t=-t,n=-n}for(;;){if(a+=1,o=Math.floor(n/t),n-=o*t,i-=o*e,0>i)return-r;if(i>e)return r;if(t>n+n){if(i+i>e)return r}else{if(e>i+i)return-r;n=t-n,i=e-i,r=-r}if(0===i)return 0===n?0:-r;if(0===n)return r;if(o=Math.floor(t/n),t-=o*n,e-=o*i,0>e)return r;if(e>i)return-r;if(n>t+t){if(e+e>i)return-r}else{if(i>e+e)return r;t=n-t,e=i-e,r=-r}if(0===e)return 0===t?0:r;if(0===t)return-r}},e(le.prototype,{countSegment:function(t,e){if(t.x<this.p.x&&e.x<this.p.x)return null;if(this.p.x===e.x&&this.p.y===e.y)return this.isPointOnSegment=!0,null;if(t.y===this.p.y&&e.y===this.p.y){var n=t.x,i=e.x;return n>i&&(n=e.x,i=t.x),this.p.x>=n&&this.p.x<=i&&(this.isPointOnSegment=!0),null}if(t.y>this.p.y&&e.y<=this.p.y||e.y>this.p.y&&t.y<=this.p.y){var r=t.x-this.p.x,s=t.y-this.p.y,o=e.x-this.p.x,a=e.y-this.p.y,u=ue.signOfDet2x2(r,s,o,a);if(0===u)return this.isPointOnSegment=!0,null;s>a&&(u=-u),u>0&&this.crossingCount++}},isPointInPolygon:function(){return this.getLocation()!==L.EXTERIOR},getLocation:function(){return this.isPointOnSegment?L.BOUNDARY:this.crossingCount%2===1?L.INTERIOR:L.EXTERIOR},isOnSegment:function(){return this.isPointOnSegment},interfaces_:function(){return[]},getClass:function(){return le}}),le.locatePointInRing=function(){if(arguments[0]instanceof g&&R(arguments[1],D)){for(var t=arguments[0],e=arguments[1],n=new le(t),i=new g,r=new g,s=1;s<e.size();s++)if(e.getCoordinate(s,i),e.getCoordinate(s-1,r),n.countSegment(i,r),n.isOnSegment())return n.getLocation();return n.getLocation()}if(arguments[0]instanceof g&&arguments[1]instanceof Array){for(var o=arguments[0],a=arguments[1],n=new le(o),s=1;s<a.length;s++){var i=a[s],r=a[s-1];if(n.countSegment(i,r),n.isOnSegment())return n.getLocation()}return n.getLocation()}},e(he.prototype,{interfaces_:function(){return[]},getClass:function(){return he}}),he.orientationIndex=function(t,e,n){return M.orientationIndex(t,e,n)},he.signedArea=function(){if(arguments[0]instanceof Array){var t=arguments[0];if(t.length<3)return 0;for(var e=0,n=t[0].x,i=1;i<t.length-1;i++){var r=t[i].x-n,s=t[i+1].y,o=t[i-1].y;e+=r*(o-s)}return e/2}if(R(arguments[0],D)){var a=arguments[0],u=a.size();if(3>u)return 0;var l=new g,h=new g,c=new g;a.getCoordinate(0,h),a.getCoordinate(1,c);var n=h.x;c.x-=n;for(var e=0,i=1;u-1>i;i++)l.y=h.y,h.x=c.x,h.y=c.y,a.getCoordinate(i+1,c),c.x-=n,e+=h.x*(l.y-c.y);return e/2}},he.distanceLineLine=function(t,e,n,i){if(t.equals(e))return he.distancePointLine(t,n,i);if(n.equals(i))return he.distancePointLine(i,t,e);var r=!1;if(C.intersects(t,e,n,i)){var s=(e.x-t.x)*(i.y-n.y)-(e.y-t.y)*(i.x-n.x);if(0===s)r=!0;else{var o=(t.y-n.y)*(i.x-n.x)-(t.x-n.x)*(i.y-n.y),a=(t.y-n.y)*(e.x-t.x)-(t.x-n.x)*(e.y-t.y),u=a/s,l=o/s;(0>l||l>1||0>u||u>1)&&(r=!0)}}else r=!0;return r?T.min(he.distancePointLine(t,n,i),he.distancePointLine(e,n,i),he.distancePointLine(n,t,e),he.distancePointLine(i,t,e)):0},he.isPointInRing=function(t,e){return he.locatePointInRing(t,e)!==L.EXTERIOR},he.computeLength=function(t){var e=t.size();if(1>=e)return 0;var n=0,i=new g;t.getCoordinate(0,i);for(var r=i.x,s=i.y,o=1;e>o;o++){t.getCoordinate(o,i);var a=i.x,u=i.y,l=a-r,h=u-s;n+=Math.sqrt(l*l+h*h),r=a,s=u}return n},he.isCCW=function(t){var e=t.length-1;if(3>e)throw new i("Ring has fewer than 4 points, so orientation cannot be determined");for(var n=t[0],r=0,s=1;e>=s;s++){var o=t[s];o.y>n.y&&(n=o,r=s)}var a=r;do a-=1,0>a&&(a=e);while(t[a].equals2D(n)&&a!==r);var u=r;do u=(u+1)%e;while(t[u].equals2D(n)&&u!==r);var l=t[a],h=t[u];if(l.equals2D(n)||h.equals2D(n)||l.equals2D(h))return!1;var c=he.computeOrientation(l,n,h),f=!1;return f=0===c?l.x>h.x:c>0},he.locatePointInRing=function(t,e){return le.locatePointInRing(t,e)},he.distancePointLinePerpendicular=function(t,e,n){var i=(n.x-e.x)*(n.x-e.x)+(n.y-e.y)*(n.y-e.y),r=((e.y-t.y)*(n.x-e.x)-(e.x-t.x)*(n.y-e.y))/i;return Math.abs(r)*Math.sqrt(i)},he.computeOrientation=function(t,e,n){return he.orientationIndex(t,e,n)},he.distancePointLine=function(){if(2===arguments.length){var t=arguments[0],e=arguments[1];if(0===e.length)throw new i("Line array must contain at least one vertex");for(var n=t.distance(e[0]),r=0;r<e.length-1;r++){var s=he.distancePointLine(t,e[r],e[r+1]);n>s&&(n=s)}return n}if(3===arguments.length){var o=arguments[0],a=arguments[1],u=arguments[2];if(a.x===u.x&&a.y===u.y)return o.distance(a);var l=(u.x-a.x)*(u.x-a.x)+(u.y-a.y)*(u.y-a.y),h=((o.x-a.x)*(u.x-a.x)+(o.y-a.y)*(u.y-a.y))/l;if(0>=h)return o.distance(a);if(h>=1)return o.distance(u);var c=((a.y-o.y)*(u.x-a.x)-(a.x-o.x)*(u.y-a.y))/l;return Math.abs(c)*Math.sqrt(l)}},he.isOnLine=function(t,e){for(var n=new ae,i=1;i<e.length;i++){var r=e[i-1],s=e[i];if(n.computeIntersection(t,r,s),n.hasIntersection())return!0}return!1},he.CLOCKWISE=-1,he.RIGHT=he.CLOCKWISE,he.COUNTERCLOCKWISE=1,he.LEFT=he.COUNTERCLOCKWISE,he.COLLINEAR=0,he.STRAIGHT=he.COLLINEAR,e(ce.prototype,{minX:function(){return Math.min(this.p0.x,this.p1.x)},orientationIndex:function(){if(arguments[0]instanceof ce){var t=arguments[0],e=he.orientationIndex(this.p0,this.p1,t.p0),n=he.orientationIndex(this.p0,this.p1,t.p1);return e>=0&&n>=0?Math.max(e,n):0>=e&&0>=n?Math.max(e,n):0}if(arguments[0]instanceof g){var i=arguments[0];return he.orientationIndex(this.p0,this.p1,i)}},toGeometry:function(t){return t.createLineString([this.p0,this.p1])},isVertical:function(){return this.p0.x===this.p1.x},equals:function(t){if(!(t instanceof ce))return!1;var e=t;return this.p0.equals(e.p0)&&this.p1.equals(e.p1)},intersection:function(t){var e=new ae;return e.computeIntersection(this.p0,this.p1,t.p0,t.p1),e.hasIntersection()?e.getIntersection(0):null},project:function(){if(arguments[0]instanceof g){var t=arguments[0];if(t.equals(this.p0)||t.equals(this.p1))return new g(t);var e=this.projectionFactor(t),n=new g;return n.x=this.p0.x+e*(this.p1.x-this.p0.x),n.y=this.p0.y+e*(this.p1.y-this.p0.y),n}if(arguments[0]instanceof ce){var i=arguments[0],r=this.projectionFactor(i.p0),s=this.projectionFactor(i.p1);if(r>=1&&s>=1)return null;if(0>=r&&0>=s)return null;var o=this.project(i.p0);0>r&&(o=this.p0),r>1&&(o=this.p1);var a=this.project(i.p1);return 0>s&&(a=this.p0),s>1&&(a=this.p1),new ce(o,a)}},normalize:function(){this.p1.compareTo(this.p0)<0&&this.reverse()},angle:function(){return Math.atan2(this.p1.y-this.p0.y,this.p1.x-this.p0.x)},getCoordinate:function(t){return 0===t?this.p0:this.p1},distancePerpendicular:function(t){return he.distancePointLinePerpendicular(t,this.p0,this.p1)},minY:function(){return Math.min(this.p0.y,this.p1.y)},midPoint:function(){return ce.midPoint(this.p0,this.p1)},projectionFactor:function(t){if(t.equals(this.p0))return 0;if(t.equals(this.p1))return 1;var e=this.p1.x-this.p0.x,n=this.p1.y-this.p0.y,i=e*e+n*n;if(0>=i)return r.NaN;var s=((t.x-this.p0.x)*e+(t.y-this.p0.y)*n)/i;return s},closestPoints:function(t){var e=this.intersection(t);if(null!==e)return[e,e];var n=new Array(2).fill(null),i=r.MAX_VALUE,s=null,o=this.closestPoint(t.p0);i=o.distance(t.p0),n[0]=o,n[1]=t.p0;var a=this.closestPoint(t.p1);s=a.distance(t.p1),i>s&&(i=s,n[0]=a,n[1]=t.p1);var u=t.closestPoint(this.p0);s=u.distance(this.p0),i>s&&(i=s,n[0]=this.p0,n[1]=u);var l=t.closestPoint(this.p1);return s=l.distance(this.p1),i>s&&(i=s,n[0]=this.p1,n[1]=l),n},closestPoint:function(t){var e=this.projectionFactor(t);if(e>0&&1>e)return this.project(t);var n=this.p0.distance(t),i=this.p1.distance(t);return i>n?this.p0:this.p1},maxX:function(){return Math.max(this.p0.x,this.p1.x)},getLength:function(){return this.p0.distance(this.p1)},compareTo:function(t){var e=t,n=this.p0.compareTo(e.p0);return 0!==n?n:this.p1.compareTo(e.p1)},reverse:function(){var t=this.p0;this.p0=this.p1,this.p1=t},equalsTopo:function(t){return this.p0.equals(t.p0)&&this.p1.equals(t.p1)||this.p0.equals(t.p1)&&this.p1.equals(t.p0)},lineIntersection:function(t){try{var e=F.intersection(this.p0,this.p1,t.p0,t.p1);return e}catch(t){if(!(t instanceof w))throw t}finally{}return null},maxY:function(){return Math.max(this.p0.y,this.p1.y)},pointAlongOffset:function(t,e){var n=this.p0.x+t*(this.p1.x-this.p0.x),i=this.p0.y+t*(this.p1.y-this.p0.y),r=this.p1.x-this.p0.x,s=this.p1.y-this.p0.y,o=Math.sqrt(r*r+s*s),a=0,u=0;if(0!==e){if(0>=o)throw new IllegalStateException("Cannot compute offset from zero-length line segment");a=e*r/o,u=e*s/o}var l=n-u,h=i+a,c=new g(l,h);return c},setCoordinates:function(){if(1===arguments.length){var t=arguments[0];this.setCoordinates(t.p0,t.p1)}else if(2===arguments.length){var e=arguments[0],n=arguments[1];this.p0.x=e.x,this.p0.y=e.y,this.p1.x=n.x,this.p1.y=n.y}},segmentFraction:function(t){var e=this.projectionFactor(t);return 0>e?e=0:(e>1||r.isNaN(e))&&(e=1),e},toString:function(){return"LINESTRING( "+this.p0.x+" "+this.p0.y+", "+this.p1.x+" "+this.p1.y+")"},isHorizontal:function(){return this.p0.y===this.p1.y},distance:function(){if(arguments[0]instanceof ce){var t=arguments[0];return he.distanceLineLine(this.p0,this.p1,t.p0,t.p1)}if(arguments[0]instanceof g){var e=arguments[0];return he.distancePointLine(e,this.p0,this.p1)}},pointAlong:function(t){var e=new g;return e.x=this.p0.x+t*(this.p1.x-this.p0.x),e.y=this.p0.y+t*(this.p1.y-this.p0.y),e},hashCode:function(){var t=java.lang.Double.doubleToLongBits(this.p0.x);t^=31*java.lang.Double.doubleToLongBits(this.p0.y);var e=Math.trunc(t)^Math.trunc(t>>32),n=java.lang.Double.doubleToLongBits(this.p1.x);n^=31*java.lang.Double.doubleToLongBits(this.p1.y);var i=Math.trunc(n)^Math.trunc(n>>32);return e^i},interfaces_:function(){return[s,u]},getClass:function(){return ce}}),ce.midPoint=function(t,e){return new g((t.x+e.x)/2,(t.y+e.y)/2)},ce.serialVersionUID=0x2d2172135f411c00,e(fe.prototype,{isIntersects:function(){return!this.isDisjoint()},isCovers:function(){var t=fe.isTrue(this.matrix[L.INTERIOR][L.INTERIOR])||fe.isTrue(this.matrix[L.INTERIOR][L.BOUNDARY])||fe.isTrue(this.matrix[L.BOUNDARY][L.INTERIOR])||fe.isTrue(this.matrix[L.BOUNDARY][L.BOUNDARY]);return t&&this.matrix[L.EXTERIOR][L.INTERIOR]===lt.FALSE&&this.matrix[L.EXTERIOR][L.BOUNDARY]===lt.FALSE},isCoveredBy:function(){var t=fe.isTrue(this.matrix[L.INTERIOR][L.INTERIOR])||fe.isTrue(this.matrix[L.INTERIOR][L.BOUNDARY])||fe.isTrue(this.matrix[L.BOUNDARY][L.INTERIOR])||fe.isTrue(this.matrix[L.BOUNDARY][L.BOUNDARY]);return t&&this.matrix[L.INTERIOR][L.EXTERIOR]===lt.FALSE&&this.matrix[L.BOUNDARY][L.EXTERIOR]===lt.FALSE},set:function(){if(1===arguments.length)for(var t=arguments[0],e=0;e<t.length;e++){var n=Math.trunc(e/3),i=e%3;this.matrix[n][i]=lt.toDimensionValue(t.charAt(e))}else if(3===arguments.length){var r=arguments[0],s=arguments[1],o=arguments[2];this.matrix[r][s]=o}},isContains:function(){return fe.isTrue(this.matrix[L.INTERIOR][L.INTERIOR])&&this.matrix[L.EXTERIOR][L.INTERIOR]===lt.FALSE&&this.matrix[L.EXTERIOR][L.BOUNDARY]===lt.FALSE},setAtLeast:function(){if(1===arguments.length)for(var t=arguments[0],e=0;e<t.length;e++){var n=Math.trunc(e/3),i=e%3;this.setAtLeast(n,i,lt.toDimensionValue(t.charAt(e)))}else if(3===arguments.length){var r=arguments[0],s=arguments[1],o=arguments[2];this.matrix[r][s]<o&&(this.matrix[r][s]=o)}},setAtLeastIfValid:function(t,e,n){t>=0&&e>=0&&this.setAtLeast(t,e,n)},isWithin:function(){return fe.isTrue(this.matrix[L.INTERIOR][L.INTERIOR])&&this.matrix[L.INTERIOR][L.EXTERIOR]===lt.FALSE&&this.matrix[L.BOUNDARY][L.EXTERIOR]===lt.FALSE},isTouches:function(t,e){return t>e?this.isTouches(e,t):t===lt.A&&e===lt.A||t===lt.L&&e===lt.L||t===lt.L&&e===lt.A||t===lt.P&&e===lt.A||t===lt.P&&e===lt.L?this.matrix[L.INTERIOR][L.INTERIOR]===lt.FALSE&&(fe.isTrue(this.matrix[L.INTERIOR][L.BOUNDARY])||fe.isTrue(this.matrix[L.BOUNDARY][L.INTERIOR])||fe.isTrue(this.matrix[L.BOUNDARY][L.BOUNDARY])):!1},isOverlaps:function(t,e){return t===lt.P&&e===lt.P||t===lt.A&&e===lt.A?fe.isTrue(this.matrix[L.INTERIOR][L.INTERIOR])&&fe.isTrue(this.matrix[L.INTERIOR][L.EXTERIOR])&&fe.isTrue(this.matrix[L.EXTERIOR][L.INTERIOR]):t===lt.L&&e===lt.L?1===this.matrix[L.INTERIOR][L.INTERIOR]&&fe.isTrue(this.matrix[L.INTERIOR][L.EXTERIOR])&&fe.isTrue(this.matrix[L.EXTERIOR][L.INTERIOR]):!1},isEquals:function(t,e){return t!==e?!1:fe.isTrue(this.matrix[L.INTERIOR][L.INTERIOR])&&this.matrix[L.INTERIOR][L.EXTERIOR]===lt.FALSE&&this.matrix[L.BOUNDARY][L.EXTERIOR]===lt.FALSE&&this.matrix[L.EXTERIOR][L.INTERIOR]===lt.FALSE&&this.matrix[L.EXTERIOR][L.BOUNDARY]===lt.FALSE},toString:function(){for(var t=new P("123456789"),e=0;3>e;e++)for(var n=0;3>n;n++)t.setCharAt(3*e+n,lt.toDimensionSymbol(this.matrix[e][n]));return t.toString()},setAll:function(t){for(var e=0;3>e;e++)for(var n=0;3>n;n++)this.matrix[e][n]=t},get:function(t,e){return this.matrix[t][e]},transpose:function(){var t=this.matrix[1][0];return this.matrix[1][0]=this.matrix[0][1],this.matrix[0][1]=t,t=this.matrix[2][0],this.matrix[2][0]=this.matrix[0][2],this.matrix[0][2]=t,t=this.matrix[2][1],this.matrix[2][1]=this.matrix[1][2],this.matrix[1][2]=t,this},matches:function(t){if(9!==t.length)throw new i("Should be length 9: "+t);for(var e=0;3>e;e++)for(var n=0;3>n;n++)if(!fe.matches(this.matrix[e][n],t.charAt(3*e+n)))return!1;return!0},add:function(t){for(var e=0;3>e;e++)for(var n=0;3>n;n++)this.setAtLeast(e,n,t.get(e,n))},isDisjoint:function(){return this.matrix[L.INTERIOR][L.INTERIOR]===lt.FALSE&&this.matrix[L.INTERIOR][L.BOUNDARY]===lt.FALSE&&this.matrix[L.BOUNDARY][L.INTERIOR]===lt.FALSE&&this.matrix[L.BOUNDARY][L.BOUNDARY]===lt.FALSE},isCrosses:function(t,e){return t===lt.P&&e===lt.L||t===lt.P&&e===lt.A||t===lt.L&&e===lt.A?fe.isTrue(this.matrix[L.INTERIOR][L.INTERIOR])&&fe.isTrue(this.matrix[L.INTERIOR][L.EXTERIOR]):t===lt.L&&e===lt.P||t===lt.A&&e===lt.P||t===lt.A&&e===lt.L?fe.isTrue(this.matrix[L.INTERIOR][L.INTERIOR])&&fe.isTrue(this.matrix[L.EXTERIOR][L.INTERIOR]):t===lt.L&&e===lt.L?0===this.matrix[L.INTERIOR][L.INTERIOR]:!1},interfaces_:function(){return[o]},getClass:function(){return fe}}),fe.matches=function(){if(Number.isInteger(arguments[0])&&"string"==typeof arguments[1]){var t=arguments[0],e=arguments[1];return e===lt.SYM_DONTCARE?!0:e===lt.SYM_TRUE&&(t>=0||t===lt.TRUE)?!0:e===lt.SYM_FALSE&&t===lt.FALSE?!0:e===lt.SYM_P&&t===lt.P?!0:e===lt.SYM_L&&t===lt.L?!0:e===lt.SYM_A&&t===lt.A}if("string"==typeof arguments[0]&&"string"==typeof arguments[1]){var n=arguments[0],i=arguments[1],r=new fe(n);return r.matches(i)}},fe.isTrue=function(t){return t>=0||t===lt.TRUE};var lo=Object.freeze({Coordinate:g,CoordinateList:N,Envelope:C,LineSegment:ce,GeometryFactory:ie,Geometry:B,Point:Lt,LineString:St,LinearRing:bt,Polygon:Tt,GeometryCollection:ft,MultiPoint:Pt,MultiLineString:gt,MultiPolygon:Ot,Dimension:lt,IntersectionMatrix:fe});e(ge.prototype,{addPoint:function(t){this.ptCount+=1,this.ptCentSum.x+=t.x,this.ptCentSum.y+=t.y},setBasePoint:function(t){null===this.areaBasePt&&(this.areaBasePt=t)},addLineSegments:function(t){for(var e=0,n=0;n<t.length-1;n++){var i=t[n].distance(t[n+1]);if(0!==i){e+=i;var r=(t[n].x+t[n+1].x)/2;this.lineCentSum.x+=i*r;var s=(t[n].y+t[n+1].y)/2;this.lineCentSum.y+=i*s}}this.totalLength+=e,0===e&&t.length>0&&this.addPoint(t[0])},addHole:function(t){for(var e=he.isCCW(t),n=0;n<t.length-1;n++)this.addTriangle(this.areaBasePt,t[n],t[n+1],e);this.addLineSegments(t)},getCentroid:function(){var t=new g;if(Math.abs(this.areasum2)>0)t.x=this.cg3.x/3/this.areasum2,t.y=this.cg3.y/3/this.areasum2;else if(this.totalLength>0)t.x=this.lineCentSum.x/this.totalLength,t.y=this.lineCentSum.y/this.totalLength;else{if(!(this.ptCount>0))return null;t.x=this.ptCentSum.x/this.ptCount,t.y=this.ptCentSum.y/this.ptCount}return t},addShell:function(t){t.length>0&&this.setBasePoint(t[0]);for(var e=!he.isCCW(t),n=0;n<t.length-1;n++)this.addTriangle(this.areaBasePt,t[n],t[n+1],e);this.addLineSegments(t)},addTriangle:function(t,e,n,i){var r=i?1:-1;ge.centroid3(t,e,n,this.triangleCent3);var s=ge.area2(t,e,n);this.cg3.x+=r*s*this.triangleCent3.x,this.cg3.y+=r*s*this.triangleCent3.y,this.areasum2+=r*s},add:function(){if(arguments[0]instanceof Tt){var t=arguments[0];this.addShell(t.getExteriorRing().getCoordinates());for(var e=0;e<t.getNumInteriorRing();e++)this.addHole(t.getInteriorRingN(e).getCoordinates())}else if(arguments[0]instanceof B){var n=arguments[0];if(n.isEmpty())return null;if(n instanceof Lt)this.addPoint(n.getCoordinate());else if(n instanceof St)this.addLineSegments(n.getCoordinates());else if(n instanceof Tt){var i=n;this.add(i)}else if(n instanceof ft)for(var r=n,e=0;e<r.getNumGeometries();e++)this.add(r.getGeometryN(e))}},interfaces_:function(){return[]},getClass:function(){return ge}}),ge.area2=function(t,e,n){return(e.x-t.x)*(n.y-t.y)-(n.x-t.x)*(e.y-t.y)},ge.centroid3=function(t,e,n,i){return i.x=t.x+e.x+n.x,i.y=t.y+e.y+n.y,null},ge.getCentroid=function(t){var e=new ge(t);return e.getCentroid()},de.prototype=new Error,de.prototype.name="EmptyStackException",pe.prototype=new y,pe.prototype.add=function(t){return this.array_.push(t),!0},pe.prototype.get=function(t){if(0>t||t>=this.size())throw new IndexOutOfBoundsException;return this.array_[t]},pe.prototype.push=function(t){return this.array_.push(t),t},pe.prototype.pop=function(t){if(0===this.array_.length)throw new de;return this.array_.pop()},pe.prototype.peek=function(){if(0===this.array_.length)throw new de;return this.array_[this.array_.length-1]},pe.prototype.empty=function(){return 0===this.array_.length},pe.prototype.isEmpty=function(){return this.empty()},pe.prototype.search=function(t){return this.array_.indexOf(t)},pe.prototype.size=function(){return this.array_.length},pe.prototype.toArray=function(){for(var t=[],e=0,n=this.array_.length;n>e;e++)t.push(this.array_[e]);return t},e(ve.prototype,{filter:function(t){this.treeSet.contains(t)||(this.list.add(t),this.treeSet.add(t))},getCoordinates:function(){var t=new Array(this.list.size()).fill(null);return this.list.toArray(t)},interfaces_:function(){return[z]},getClass:function(){return ve}}),ve.filterCoordinates=function(t){for(var e=new ve,n=0;n<t.length;n++)e.filter(t[n]);return e.getCoordinates()},e(me.prototype,{preSort:function(t){for(var e=null,n=1;n<t.length;n++)(t[n].y<t[0].y||t[n].y===t[0].y&&t[n].x<t[0].x)&&(e=t[0],t[0]=t[n],t[n]=e);return ut.sort(t,1,t.length,new ye(t[0])),t},computeOctRing:function(t){var e=this.computeOctPts(t),n=new N;return n.add(e,!1),n.size()<3?null:(n.closeRing(),n.toCoordinateArray())},lineOrPolygon:function(t){if(t=this.cleanRing(t),3===t.length)return this.geomFactory.createLineString([t[0],t[1]]);var e=this.geomFactory.createLinearRing(t);return this.geomFactory.createPolygon(e,null)},cleanRing:function(t){f.equals(t[0],t[t.length-1]);for(var e=new I,n=null,i=0;i<=t.length-2;i++){var r=t[i],s=t[i+1];r.equals(s)||null!==n&&this.isBetween(n,r,s)||(e.add(r),n=r)}e.add(t[t.length-1]);var o=new Array(e.size()).fill(null);return e.toArray(o)},isBetween:function(t,e,n){if(0!==he.computeOrientation(t,e,n))return!1;if(t.x!==n.x){if(t.x<=e.x&&e.x<=n.x)return!0;if(n.x<=e.x&&e.x<=t.x)return!0}if(t.y!==n.y){if(t.y<=e.y&&e.y<=n.y)return!0;if(n.y<=e.y&&e.y<=t.y)return!0}return!1},reduce:function(t){var e=this.computeOctRing(t);if(null===e)return t;for(var n=new at,i=0;i<e.length;i++)n.add(e[i]);for(var i=0;i<t.length;i++)he.isPointInRing(t[i],e)||n.add(t[i]);var r=H.toCoordinateArray(n);return r.length<3?this.padArray3(r):r},getConvexHull:function(){if(0===this.inputPts.length)return this.geomFactory.createGeometryCollection(null);if(1===this.inputPts.length)return this.geomFactory.createPoint(this.inputPts[0]);if(2===this.inputPts.length)return this.geomFactory.createLineString(this.inputPts);var t=this.inputPts;this.inputPts.length>50&&(t=this.reduce(this.inputPts));var e=this.preSort(t),n=this.grahamScan(e),i=this.toCoordinateArray(n);return this.lineOrPolygon(i)},padArray3:function(t){for(var e=new Array(3).fill(null),n=0;n<e.length;n++)n<t.length?e[n]=t[n]:e[n]=t[0];return e},computeOctPts:function(t){for(var e=new Array(8).fill(null),n=0;n<e.length;n++)e[n]=t[0];for(var i=1;i<t.length;i++)t[i].x<e[0].x&&(e[0]=t[i]),t[i].x-t[i].y<e[1].x-e[1].y&&(e[1]=t[i]),t[i].y>e[2].y&&(e[2]=t[i]),t[i].x+t[i].y>e[3].x+e[3].y&&(e[3]=t[i]),t[i].x>e[4].x&&(e[4]=t[i]),t[i].x-t[i].y>e[5].x-e[5].y&&(e[5]=t[i]),t[i].y<e[6].y&&(e[6]=t[i]),t[i].x+t[i].y<e[7].x+e[7].y&&(e[7]=t[i]);return e},toCoordinateArray:function(t){for(var e=new Array(t.size()).fill(null),n=0;n<t.size();n++){var i=t.get(n);e[n]=i}return e},grahamScan:function(t){var e=null,n=new pe;e=n.push(t[0]),e=n.push(t[1]),e=n.push(t[2]);for(var i=3;i<t.length;i++){for(e=n.pop();!n.empty()&&he.computeOrientation(n.peek(),e,t[i])>0;)e=n.pop();e=n.push(e),e=n.push(t[i])}return e=n.push(t[0]),n},interfaces_:function(){return[]},getClass:function(){return me}}),me.extractCoordinates=function(t){var e=new ve;return t.apply(e),e.getCoordinates()},e(ye.prototype,{compare:function(t,e){var n=t,i=e;return ye.polarCompare(this.origin,n,i)},interfaces_:function(){return[a]},getClass:function(){return ye}}),ye.polarCompare=function(t,e,n){var i=e.x-t.x,r=e.y-t.y,s=n.x-t.x,o=n.y-t.y,a=he.computeOrientation(t,e,n);
if(a===he.COUNTERCLOCKWISE)return 1;if(a===he.CLOCKWISE)return-1;var u=i*i+r*r,l=s*s+o*o;return l>u?-1:u>l?1:0},me.RadialComparator=ye,e(xe.prototype,{transformPoint:function(t,e){return this.factory.createPoint(this.transformCoordinates(t.getCoordinateSequence(),t))},transformPolygon:function(t,e){var n=!0,i=this.transformLinearRing(t.getExteriorRing(),t);null!==i&&i instanceof bt&&!i.isEmpty()||(n=!1);for(var r=new I,s=0;s<t.getNumInteriorRing();s++){var o=this.transformLinearRing(t.getInteriorRingN(s),t);null===o||o.isEmpty()||(o instanceof bt||(n=!1),r.add(o))}if(n)return this.factory.createPolygon(i,r.toArray([]));var a=new I;return null!==i&&a.add(i),a.addAll(r),this.factory.buildGeometry(a)},createCoordinateSequence:function(t){return this.factory.getCoordinateSequenceFactory().create(t)},getInputGeometry:function(){return this.inputGeom},transformMultiLineString:function(t,e){for(var n=new I,i=0;i<t.getNumGeometries();i++){var r=this.transformLineString(t.getGeometryN(i),t);null!==r&&(r.isEmpty()||n.add(r))}return this.factory.buildGeometry(n)},transformCoordinates:function(t,e){return this.copy(t)},transformLineString:function(t,e){return this.factory.createLineString(this.transformCoordinates(t.getCoordinateSequence(),t))},transformMultiPoint:function(t,e){for(var n=new I,i=0;i<t.getNumGeometries();i++){var r=this.transformPoint(t.getGeometryN(i),t);null!==r&&(r.isEmpty()||n.add(r))}return this.factory.buildGeometry(n)},transformMultiPolygon:function(t,e){for(var n=new I,i=0;i<t.getNumGeometries();i++){var r=this.transformPolygon(t.getGeometryN(i),t);null!==r&&(r.isEmpty()||n.add(r))}return this.factory.buildGeometry(n)},copy:function(t){return t.copy()},transformGeometryCollection:function(t,e){for(var n=new I,i=0;i<t.getNumGeometries();i++){var r=this.transform(t.getGeometryN(i));null!==r&&(this.pruneEmptyGeometry&&r.isEmpty()||n.add(r))}return this.preserveGeometryCollectionType?this.factory.createGeometryCollection(ie.toGeometryArray(n)):this.factory.buildGeometry(n)},transform:function(t){if(this.inputGeom=t,this.factory=t.getFactory(),t instanceof Lt)return this.transformPoint(t,null);if(t instanceof Pt)return this.transformMultiPoint(t,null);if(t instanceof bt)return this.transformLinearRing(t,null);if(t instanceof St)return this.transformLineString(t,null);if(t instanceof gt)return this.transformMultiLineString(t,null);if(t instanceof Tt)return this.transformPolygon(t,null);if(t instanceof Ot)return this.transformMultiPolygon(t,null);if(t instanceof ft)return this.transformGeometryCollection(t,null);throw new i("Unknown Geometry subtype: "+t.getClass().getName())},transformLinearRing:function(t,e){var n=this.transformCoordinates(t.getCoordinateSequence(),t);if(null===n)return this.factory.createLinearRing(null);var i=n.size();return i>0&&4>i&&!this.preserveType?this.factory.createLineString(n):this.factory.createLinearRing(n)},interfaces_:function(){return[]},getClass:function(){return xe}}),e(Ee.prototype,{snapVertices:function(t,e){for(var n=this._isClosed?t.size()-1:t.size(),i=0;n>i;i++){var r=t.get(i),s=this.findSnapForVertex(r,e);null!==s&&(t.set(i,new g(s)),0===i&&this._isClosed&&t.set(t.size()-1,new g(s)))}},findSnapForVertex:function(t,e){for(var n=0;n<e.length;n++){if(t.equals2D(e[n]))return null;if(t.distance(e[n])<this.snapTolerance)return e[n]}return null},snapTo:function(t){var e=new N(this.srcPts);this.snapVertices(e,t),this.snapSegments(e,t);var n=e.toCoordinateArray();return n},snapSegments:function(t,e){if(0===e.length)return null;var n=e.length;e[0].equals2D(e[e.length-1])&&(n=e.length-1);for(var i=0;n>i;i++){var r=e[i],s=this.findSegmentIndexToSnap(r,t);s>=0&&t.add(s+1,new g(r),!1)}},findSegmentIndexToSnap:function(t,e){for(var n=r.MAX_VALUE,i=-1,s=0;s<e.size()-1;s++){if(this.seg.p0=e.get(s),this.seg.p1=e.get(s+1),this.seg.p0.equals2D(t)||this.seg.p1.equals2D(t)){if(this.allowSnappingToSourceVertices)continue;return-1}var o=this.seg.distance(t);o<this.snapTolerance&&n>o&&(n=o,i=s)}return i},setAllowSnappingToSourceVertices:function(t){this.allowSnappingToSourceVertices=t},interfaces_:function(){return[]},getClass:function(){return Ee}}),Ee.isClosed=function(t){return t.length<=1?!1:t[0].equals2D(t[t.length-1])},e(Ie.prototype,{snapTo:function(t,e){var n=this.extractTargetCoordinates(t),i=new Ne(e,n);return i.transform(this.srcGeom)},snapToSelf:function(t,e){var n=this.extractTargetCoordinates(this.srcGeom),i=new Ne(t,n,!0),r=i.transform(this.srcGeom),s=r;return e&&R(s,Rt)&&(s=r.buffer(0)),s},computeSnapTolerance:function(t){var e=this.computeMinimumSegmentLength(t),n=e/10;return n},extractTargetCoordinates:function(t){for(var e=new at,n=t.getCoordinates(),i=0;i<n.length;i++)e.add(n[i]);return e.toArray(new Array(0).fill(null))},computeMinimumSegmentLength:function(t){for(var e=r.MAX_VALUE,n=0;n<t.length-1;n++){var i=t[n].distance(t[n+1]);e>i&&(e=i)}return e},interfaces_:function(){return[]},getClass:function(){return Ie}}),Ie.snap=function(t,e,n){var i=new Array(2).fill(null),r=new Ie(t);i[0]=r.snapTo(e,n);var s=new Ie(e);return i[1]=s.snapTo(i[0],n),i},Ie.computeOverlaySnapTolerance=function(){if(1===arguments.length){var t=arguments[0],e=Ie.computeSizeBasedSnapTolerance(t),n=t.getPrecisionModel();if(n.getType()===ee.FIXED){var i=1/n.getScale()*2/1.415;i>e&&(e=i)}return e}if(2===arguments.length){var r=arguments[0],s=arguments[1];return Math.min(Ie.computeOverlaySnapTolerance(r),Ie.computeOverlaySnapTolerance(s))}},Ie.computeSizeBasedSnapTolerance=function(t){var e=t.getEnvelopeInternal(),n=Math.min(e.getHeight(),e.getWidth()),i=n*Ie.SNAP_PRECISION_FACTOR;return i},Ie.snapToSelf=function(t,e,n){var i=new Ie(t);return i.snapToSelf(e,n)},Ie.SNAP_PRECISION_FACTOR=1e-9,h(Ne,xe),e(Ne.prototype,{snapLine:function(t,e){var n=new Ee(t,this.snapTolerance);return n.setAllowSnappingToSourceVertices(this.isSelfSnap),n.snapTo(e)},transformCoordinates:function(t,e){var n=t.toCoordinateArray(),i=this.snapLine(n,this.snapPts);return this.factory.getCoordinateSequenceFactory().create(i)},interfaces_:function(){return[]},getClass:function(){return Ne}}),e(Ce.prototype,{getCommon:function(){return r.longBitsToDouble(this.commonBits)},add:function(t){var e=r.doubleToLongBits(t);if(this.isFirst)return this.commonBits=e,this.commonSignExp=Ce.signExpBits(this.commonBits),this.isFirst=!1,null;var n=Ce.signExpBits(e);return n!==this.commonSignExp?(this.commonBits=0,null):(this.commonMantissaBitsCount=Ce.numCommonMostSigMantissaBits(this.commonBits,e),void(this.commonBits=Ce.zeroLowerBits(this.commonBits,64-(12+this.commonMantissaBitsCount))))},toString:function(){if(1===arguments.length){var t=arguments[0],e=r.longBitsToDouble(t),n=Long.toBinaryString(t),i="0000000000000000000000000000000000000000000000000000000000000000"+n,s=i.substring(i.length-64),o=s.substring(0,1)+"  "+s.substring(1,12)+"(exp) "+s.substring(12)+" [ "+e+" ]";return o}},interfaces_:function(){return[]},getClass:function(){return Ce}}),Ce.getBit=function(t,e){var n=1<<e;return 0!==(t&n)?1:0},Ce.signExpBits=function(t){return t>>52},Ce.zeroLowerBits=function(t,e){var n=(1<<e)-1,i=~n,r=t&i;return r},Ce.numCommonMostSigMantissaBits=function(t,e){for(var n=0,i=52;i>=0;i--){if(Ce.getBit(t,i)!==Ce.getBit(e,i))return n;n++}return 52},e(Se.prototype,{addCommonBits:function(t){var e=new Le(this.commonCoord);t.apply(e),t.geometryChanged()},removeCommonBits:function(t){if(0===this.commonCoord.x&&0===this.commonCoord.y)return t;var e=new g(this.commonCoord);e.x=-e.x,e.y=-e.y;var n=new Le(e);return t.apply(n),t.geometryChanged(),t},getCommonCoordinate:function(){return this.commonCoord},add:function(t){t.apply(this.ccFilter),this.commonCoord=this.ccFilter.getCommonCoordinate()},interfaces_:function(){return[]},getClass:function(){return Se}}),e(we.prototype,{filter:function(t){this.commonBitsX.add(t.x),this.commonBitsY.add(t.y)},getCommonCoordinate:function(){return new g(this.commonBitsX.getCommon(),this.commonBitsY.getCommon())},interfaces_:function(){return[z]},getClass:function(){return we}}),e(Le.prototype,{filter:function(t,e){var n=t.getOrdinate(e,0)+this.trans.x,i=t.getOrdinate(e,1)+this.trans.y;t.setOrdinate(e,0,n),t.setOrdinate(e,1,i)},isDone:function(){return!1},isGeometryChanged:function(){return!0},interfaces_:function(){return[ct]},getClass:function(){return Le}}),Se.CommonCoordinateFilter=we,Se.Translater=Le,e(Re.prototype,{next:function(){if(this.atStart)return this.atStart=!1,Re.isAtomic(this.parent)&&this.index++,this.parent;if(null!==this.subcollectionIterator){if(this.subcollectionIterator.hasNext())return this.subcollectionIterator.next();this.subcollectionIterator=null}if(this.index>=this.max)throw new x;var t=this.parent.getGeometryN(this.index++);return t instanceof ft?(this.subcollectionIterator=new Re(t),this.subcollectionIterator.next()):t},remove:function(){throw new UnsupportedOperationException(this.getClass().getName())},hasNext:function(){if(this.atStart)return!0;if(null!==this.subcollectionIterator){if(this.subcollectionIterator.hasNext())return!0;this.subcollectionIterator=null}return!(this.index>=this.max)},interfaces_:function(){return[p]},getClass:function(){return Re}}),Re.isAtomic=function(t){return!(t instanceof ft)},e(Te.prototype,{locateInternal:function(){if(arguments[0]instanceof g&&arguments[1]instanceof Tt){var t=arguments[0],e=arguments[1];if(e.isEmpty())return L.EXTERIOR;var n=e.getExteriorRing(),i=this.locateInPolygonRing(t,n);if(i===L.EXTERIOR)return L.EXTERIOR;if(i===L.BOUNDARY)return L.BOUNDARY;for(var r=0;r<e.getNumInteriorRing();r++){var s=e.getInteriorRingN(r),o=this.locateInPolygonRing(t,s);if(o===L.INTERIOR)return L.EXTERIOR;if(o===L.BOUNDARY)return L.BOUNDARY}return L.INTERIOR}if(arguments[0]instanceof g&&arguments[1]instanceof St){var a=arguments[0],u=arguments[1];if(!u.getEnvelopeInternal().intersects(a))return L.EXTERIOR;var l=u.getCoordinates();return u.isClosed()||!a.equals(l[0])&&!a.equals(l[l.length-1])?he.isOnLine(a,l)?L.INTERIOR:L.EXTERIOR:L.BOUNDARY}if(arguments[0]instanceof g&&arguments[1]instanceof Lt){var h=arguments[0],c=arguments[1],f=c.getCoordinate();return f.equals2D(h)?L.INTERIOR:L.EXTERIOR}},locateInPolygonRing:function(t,e){return e.getEnvelopeInternal().intersects(t)?he.locatePointInRing(t,e.getCoordinates()):L.EXTERIOR},intersects:function(t,e){return this.locate(t,e)!==L.EXTERIOR},updateLocationInfo:function(t){t===L.INTERIOR&&(this.isIn=!0),t===L.BOUNDARY&&this.numBoundaries++},computeLocation:function(t,e){if(e instanceof Lt&&this.updateLocationInfo(this.locateInternal(t,e)),e instanceof St)this.updateLocationInfo(this.locateInternal(t,e));else if(e instanceof Tt)this.updateLocationInfo(this.locateInternal(t,e));else if(e instanceof gt)for(var n=e,i=0;i<n.getNumGeometries();i++){var r=n.getGeometryN(i);this.updateLocationInfo(this.locateInternal(t,r))}else if(e instanceof Ot)for(var s=e,i=0;i<s.getNumGeometries();i++){var o=s.getGeometryN(i);this.updateLocationInfo(this.locateInternal(t,o))}else if(e instanceof ft)for(var a=new Re(e);a.hasNext();){var u=a.next();u!==e&&this.computeLocation(t,u)}},locate:function(t,e){return e.isEmpty()?L.EXTERIOR:e instanceof St?this.locateInternal(t,e):e instanceof Tt?this.locateInternal(t,e):(this.isIn=!1,this.numBoundaries=0,this.computeLocation(t,e),this.boundaryRule.isInBoundary(this.numBoundaries)?L.BOUNDARY:this.numBoundaries>0||this.isIn?L.INTERIOR:L.EXTERIOR)},interfaces_:function(){return[]},getClass:function(){return Te}}),e(Pe.prototype,{interfaces_:function(){return[]},getClass:function(){return Pe}}),Pe.octant=function(){if("number"==typeof arguments[0]&&"number"==typeof arguments[1]){var t=arguments[0],e=arguments[1];if(0===t&&0===e)throw new i("Cannot compute the octant for point ( "+t+", "+e+" )");var n=Math.abs(t),r=Math.abs(e);return t>=0?e>=0?n>=r?0:1:n>=r?7:6:e>=0?n>=r?3:2:n>=r?4:5}if(arguments[0]instanceof g&&arguments[1]instanceof g){var s=arguments[0],o=arguments[1],a=o.x-s.x,u=o.y-s.y;if(0===a&&0===u)throw new i("Cannot compute the octant for two identical points "+s);return Pe.octant(a,u)}},e(be.prototype,{getCoordinates:function(){},size:function(){},getCoordinate:function(t){},isClosed:function(){},setData:function(t){},getData:function(){},interfaces_:function(){return[]},getClass:function(){return be}}),e(Oe.prototype,{getCoordinates:function(){return this.pts},size:function(){return this.pts.length},getCoordinate:function(t){return this.pts[t]},isClosed:function(){return this.pts[0].equals(this.pts[this.pts.length-1])},getSegmentOctant:function(t){return t===this.pts.length-1?-1:Pe.octant(this.getCoordinate(t),this.getCoordinate(t+1))},setData:function(t){this.data=t},getData:function(){return this.data},toString:function(){return se.toLineString(new Gt(this.pts))},interfaces_:function(){return[be]},getClass:function(){return Oe}}),e(_e.prototype,{getBounds:function(){},interfaces_:function(){return[]},getClass:function(){return _e}}),e(Me.prototype,{getItem:function(){return this.item},getBounds:function(){return this.bounds},interfaces_:function(){return[_e,u]},getClass:function(){return Me}}),e(De.prototype,{poll:function(){if(this.isEmpty())return null;var t=this.items.get(1);return this.items.set(1,this.items.get(this._size)),this._size-=1,this.reorder(1),t},size:function(){return this._size},reorder:function(t){for(var e=null,n=this.items.get(t);2*t<=this._size&&(e=2*t,e!==this._size&&this.items.get(e+1).compareTo(this.items.get(e))<0&&e++,this.items.get(e).compareTo(n)<0);t=e)this.items.set(t,this.items.get(e));this.items.set(t,n)},clear:function(){this._size=0,this.items.clear()},isEmpty:function(){return 0===this._size},add:function(t){this.items.add(null),this._size+=1;var e=this._size;for(this.items.set(0,t);t.compareTo(this.items.get(Math.trunc(e/2)))<0;e/=2)this.items.set(e,this.items.get(Math.trunc(e/2)));this.items.set(e,t)},interfaces_:function(){return[]},getClass:function(){return De}}),e(Ae.prototype,{visitItem:function(t){},interfaces_:function(){return[]},getClass:function(){return Ae}}),e(Fe.prototype,{insert:function(t,e){},remove:function(t,e){},query:function(){if(1===arguments.length){arguments[0]}else if(2===arguments.length){arguments[0],arguments[1]}},interfaces_:function(){return[]},getClass:function(){return Fe}}),e(Ge.prototype,{getLevel:function(){return this.level},size:function(){return this.childBoundables.size()},getChildBoundables:function(){return this.childBoundables},addChildBoundable:function(t){f.isTrue(null===this.bounds),this.childBoundables.add(t)},isEmpty:function(){return this.childBoundables.isEmpty()},getBounds:function(){return null===this.bounds&&(this.bounds=this.computeBounds()),this.bounds},interfaces_:function(){return[_e,u]},getClass:function(){return Ge}}),Ge.serialVersionUID=0x5a1e55ec41369800;var ho={reverseOrder:function(){return{compare:function(t,e){return e.compareTo(t)}}},min:function(t){return ho.sort(t),t.get(0)},sort:function(t,e){var n=t.toArray();e?ut.sort(n,e):ut.sort(n);for(var i=t.iterator(),r=0,s=n.length;s>r;r++)i.next(),i.set(n[r])},singletonList:function(t){var e=new I;return e.add(t),e}};e(qe.prototype,{expandToQueue:function(t,e){var n=qe.isComposite(this.boundable1),r=qe.isComposite(this.boundable2);if(n&&r)return qe.area(this.boundable1)>qe.area(this.boundable2)?(this.expand(this.boundable1,this.boundable2,t,e),null):(this.expand(this.boundable2,this.boundable1,t,e),null);if(n)return this.expand(this.boundable1,this.boundable2,t,e),null;if(r)return this.expand(this.boundable2,this.boundable1,t,e),null;throw new i("neither boundable is composite")},isLeaves:function(){return!(qe.isComposite(this.boundable1)||qe.isComposite(this.boundable2))},compareTo:function(t){var e=t;return this._distance<e._distance?-1:this._distance>e._distance?1:0},expand:function(t,e,n,i){for(var r=t.getChildBoundables(),s=r.iterator();s.hasNext();){var o=s.next(),a=new qe(o,e,this.itemDistance);a.getDistance()<i&&n.add(a)}},getBoundable:function(t){return 0===t?this.boundable1:this.boundable2},getDistance:function(){return this._distance},distance:function(){return this.isLeaves()?this.itemDistance.distance(this.boundable1,this.boundable2):this.boundable1.getBounds().distance(this.boundable2.getBounds())},interfaces_:function(){return[s]},getClass:function(){return qe}}),qe.area=function(t){return t.getBounds().getArea()},qe.isComposite=function(t){return t instanceof Ge},e(Be.prototype,{getNodeCapacity:function(){return this.nodeCapacity},lastNode:function(t){return t.get(t.size()-1)},size:function t(){if(0===arguments.length)return this.isEmpty()?0:(this.build(),this.size(this.root));if(1===arguments.length){for(var e=arguments[0],t=0,n=e.getChildBoundables().iterator();n.hasNext();){var i=n.next();i instanceof Ge?t+=this.size(i):i instanceof Me&&(t+=1)}return t}},removeItem:function(t,e){for(var n=null,i=t.getChildBoundables().iterator();i.hasNext();){var r=i.next();r instanceof Me&&r.getItem()===e&&(n=r)}return null!==n?(t.getChildBoundables().remove(n),!0):!1},itemsTree:function(){if(0===arguments.length){this.build();var t=this.itemsTree(this.root);return null===t?new I:t}if(1===arguments.length){for(var e=arguments[0],n=new I,i=e.getChildBoundables().iterator();i.hasNext();){var r=i.next();if(r instanceof Ge){var s=this.itemsTree(r);null!==s&&n.add(s)}else r instanceof Me?n.add(r.getItem()):f.shouldNeverReachHere()}return n.size()<=0?null:n}},insert:function(t,e){f.isTrue(!this.built,"Cannot insert items into an STR packed R-tree after it has been built."),this.itemBoundables.add(new Me(t,e))},boundablesAtLevel:function(){if(1===arguments.length){var t=arguments[0],e=new I;return this.boundablesAtLevel(t,this.root,e),e}if(3===arguments.length){var n=arguments[0],i=arguments[1],r=arguments[2];if(f.isTrue(n>-2),i.getLevel()===n)return r.add(i),null;for(var s=i.getChildBoundables().iterator();s.hasNext();){var o=s.next();o instanceof Ge?this.boundablesAtLevel(n,o,r):(f.isTrue(o instanceof Me),-1===n&&r.add(o))}return null}},query:function(){if(1===arguments.length){var t=arguments[0];this.build();var e=new I;return this.isEmpty()?e:(this.getIntersectsOp().intersects(this.root.getBounds(),t)&&this.query(t,this.root,e),e)}if(2===arguments.length){var n=arguments[0],i=arguments[1];if(this.build(),this.isEmpty())return null;this.getIntersectsOp().intersects(this.root.getBounds(),n)&&this.query(n,this.root,i)}else if(3===arguments.length)if(R(arguments[2],Ae)&&arguments[0]instanceof Object&&arguments[1]instanceof Ge)for(var r=arguments[0],s=arguments[1],o=arguments[2],a=s.getChildBoundables(),u=0;u<a.size();u++){var l=a.get(u);this.getIntersectsOp().intersects(l.getBounds(),r)&&(l instanceof Ge?this.query(r,l,o):l instanceof Me?o.visitItem(l.getItem()):f.shouldNeverReachHere())}else if(R(arguments[2],y)&&arguments[0]instanceof Object&&arguments[1]instanceof Ge)for(var h=arguments[0],c=arguments[1],g=arguments[2],a=c.getChildBoundables(),u=0;u<a.size();u++){var l=a.get(u);this.getIntersectsOp().intersects(l.getBounds(),h)&&(l instanceof Ge?this.query(h,l,g):l instanceof Me?g.add(l.getItem()):f.shouldNeverReachHere())}},build:function(){return this.built?null:(this.root=this.itemBoundables.isEmpty()?this.createNode(0):this.createHigherLevels(this.itemBoundables,-1),this.itemBoundables=null,void(this.built=!0))},getRoot:function(){return this.build(),this.root},remove:function(){if(2===arguments.length){var t=arguments[0],e=arguments[1];return this.build(),this.getIntersectsOp().intersects(this.root.getBounds(),t)?this.remove(t,this.root,e):!1}if(3===arguments.length){var n=arguments[0],i=arguments[1],r=arguments[2],s=this.removeItem(i,r);if(s)return!0;for(var o=null,a=i.getChildBoundables().iterator();a.hasNext();){var u=a.next();if(this.getIntersectsOp().intersects(u.getBounds(),n)&&u instanceof Ge&&(s=this.remove(n,u,r))){o=u;break}}return null!==o&&o.getChildBoundables().isEmpty()&&i.getChildBoundables().remove(o),s}},createHigherLevels:function(t,e){f.isTrue(!t.isEmpty());var n=this.createParentBoundables(t,e+1);return 1===n.size()?n.get(0):this.createHigherLevels(n,e+1)},depth:function(){if(0===arguments.length)return this.isEmpty()?0:(this.build(),this.depth(this.root));if(1===arguments.length){for(var t=arguments[0],e=0,n=t.getChildBoundables().iterator();n.hasNext();){var i=n.next();if(i instanceof Ge){var r=this.depth(i);r>e&&(e=r)}}return e+1}},createParentBoundables:function(t,e){f.isTrue(!t.isEmpty());var n=new I;n.add(this.createNode(e));var i=new I(t);ho.sort(i,this.getComparator());for(var r=i.iterator();r.hasNext();){var s=r.next();this.lastNode(n).getChildBoundables().size()===this.getNodeCapacity()&&n.add(this.createNode(e)),this.lastNode(n).addChildBoundable(s)}return n},isEmpty:function(){return this.built?this.root.isEmpty():this.itemBoundables.isEmpty()},interfaces_:function(){return[u]},getClass:function(){return Be}}),Be.compareDoubles=function(t,e){return t>e?1:e>t?-1:0},Be.IntersectsOp=ze,Be.serialVersionUID=-0x35ef64c82d4c5400,Be.DEFAULT_NODE_CAPACITY=10,e(Ve.prototype,{distance:function(t,e){},interfaces_:function(){return[]},getClass:function(){return Ve}}),h(ke,Be),e(ke.prototype,{createParentBoundablesFromVerticalSlices:function(t,e){f.isTrue(t.length>0);for(var n=new I,i=0;i<t.length;i++)n.addAll(this.createParentBoundablesFromVerticalSlice(t[i],e));return n},createNode:function(t){return new Ye(t)},size:function(){return 0===arguments.length?Be.prototype.size.call(this):Be.prototype.size.apply(this,arguments)},insert:function(){if(2!==arguments.length)return Be.prototype.insert.apply(this,arguments);var t=arguments[0],e=arguments[1];return t.isNull()?null:void Be.prototype.insert.call(this,t,e)},getIntersectsOp:function(){return ke.intersectsOp},verticalSlices:function(t,e){for(var n=Math.trunc(Math.ceil(t.size()/e)),i=new Array(e).fill(null),r=t.iterator(),s=0;e>s;s++){i[s]=new I;for(var o=0;r.hasNext()&&n>o;){var a=r.next();i[s].add(a),o++}}return i},query:function(){if(1===arguments.length){var t=arguments[0];return Be.prototype.query.call(this,t)}if(2===arguments.length){var e=arguments[0],n=arguments[1];Be.prototype.query.call(this,e,n)}else if(3===arguments.length)if(R(arguments[2],Ae)&&arguments[0]instanceof Object&&arguments[1]instanceof Ge){var i=arguments[0],r=arguments[1],s=arguments[2];Be.prototype.query.call(this,i,r,s)}else if(R(arguments[2],y)&&arguments[0]instanceof Object&&arguments[1]instanceof Ge){var o=arguments[0],a=arguments[1],u=arguments[2];Be.prototype.query.call(this,o,a,u)}},getComparator:function(){return ke.yComparator},createParentBoundablesFromVerticalSlice:function(t,e){return Be.prototype.createParentBoundables.call(this,t,e)},remove:function(){if(2===arguments.length){var t=arguments[0],e=arguments[1];return Be.prototype.remove.call(this,t,e)}return Be.prototype.remove.apply(this,arguments)},depth:function(){return 0===arguments.length?Be.prototype.depth.call(this):Be.prototype.depth.apply(this,arguments)},createParentBoundables:function(t,e){f.isTrue(!t.isEmpty());var n=Math.trunc(Math.ceil(t.size()/this.getNodeCapacity())),i=new I(t);ho.sort(i,ke.xComparator);var r=this.verticalSlices(i,Math.trunc(Math.ceil(Math.sqrt(n))));return this.createParentBoundablesFromVerticalSlices(r,e)},nearestNeighbour:function(){if(1===arguments.length){if(R(arguments[0],Ve)){var t=arguments[0],e=new qe(this.getRoot(),this.getRoot(),t);return this.nearestNeighbour(e)}if(arguments[0]instanceof qe){var n=arguments[0];return this.nearestNeighbour(n,r.POSITIVE_INFINITY)}}else if(2===arguments.length){if(arguments[0]instanceof ke&&R(arguments[1],Ve)){var i=arguments[0],s=arguments[1],e=new qe(this.getRoot(),i.getRoot(),s);return this.nearestNeighbour(e)}if(arguments[0]instanceof qe&&"number"==typeof arguments[1]){var o=arguments[0],a=arguments[1],u=a,l=null,h=new De;for(h.add(o);!h.isEmpty()&&u>0;){var c=h.poll(),f=c.getDistance();if(f>=u)break;c.isLeaves()?(u=f,l=c):c.expandToQueue(h,u)}return[l.getBoundable(0).getItem(),l.getBoundable(1).getItem()]}}else if(3===arguments.length){var g=arguments[0],d=arguments[1],p=arguments[2],v=new Me(g,d),e=new qe(this.getRoot(),v,p);return this.nearestNeighbour(e)[0]}},interfaces_:function(){return[Fe,u]},getClass:function(){return ke}}),ke.centreX=function(t){return ke.avg(t.getMinX(),t.getMaxX())},ke.avg=function(t,e){return(t+e)/2},ke.centreY=function(t){return ke.avg(t.getMinY(),t.getMaxY())},h(Ye,Ge),e(Ye.prototype,{computeBounds:function(){for(var t=null,e=this.getChildBoundables().iterator();e.hasNext();){var n=e.next();null===t?t=new C(n.getBounds()):t.expandToInclude(n.getBounds())}return t},interfaces_:function(){return[]},getClass:function(){return Ye}}),ke.STRtreeNode=Ye,ke.serialVersionUID=0x39920f7d5f261e0,ke.xComparator={interfaces_:function(){return[a]},compare:function(t,e){return Be.compareDoubles(ke.centreX(t.getBounds()),ke.centreX(e.getBounds()))}},ke.yComparator={interfaces_:function(){return[a]},compare:function(t,e){return Be.compareDoubles(ke.centreY(t.getBounds()),ke.centreY(e.getBounds()))}},ke.intersectsOp={interfaces_:function(){return[IntersectsOp]},intersects:function(t,e){return t.intersects(e)}},ke.DEFAULT_NODE_CAPACITY=10,e(Ue.prototype,{interfaces_:function(){return[]},getClass:function(){return Ue}}),Ue.relativeSign=function(t,e){return e>t?-1:t>e?1:0},Ue.compare=function(t,e,n){if(e.equals2D(n))return 0;var i=Ue.relativeSign(e.x,n.x),r=Ue.relativeSign(e.y,n.y);switch(t){case 0:return Ue.compareValue(i,r);case 1:return Ue.compareValue(r,i);case 2:return Ue.compareValue(r,-i);case 3:return Ue.compareValue(-i,r);case 4:return Ue.compareValue(-i,-r);case 5:return Ue.compareValue(-r,-i);case 6:return Ue.compareValue(-r,i);case 7:return Ue.compareValue(i,-r)}return f.shouldNeverReachHere("invalid octant value"),0},Ue.compareValue=function(t,e){return 0>t?-1:t>0?1:0>e?-1:e>0?1:0},e(Xe.prototype,{getCoordinate:function(){return this.coord},print:function(t){t.print(this.coord),t.print(" seg # = "+this.segmentIndex)},compareTo:function(t){var e=t;return this.segmentIndex<e.segmentIndex?-1:this.segmentIndex>e.segmentIndex?1:this.coord.equals2D(e.coord)?0:Ue.compare(this.segmentOctant,this.coord,e.coord)},isEndPoint:function(t){return 0!==this.segmentIndex||this._isInterior?this.segmentIndex===t:!0},isInterior:function(){return this._isInterior},interfaces_:function(){return[s]},getClass:function(){return Xe}}),e(He.prototype,{getSplitCoordinates:function(){var t=new N;this.addEndpoints();for(var e=this.iterator(),n=e.next();e.hasNext();){var i=e.next();this.addEdgeCoordinates(n,i,t),n=i}return t.toCoordinateArray()},addCollapsedNodes:function(){var t=new I;this.findCollapsesFromInsertedNodes(t),this.findCollapsesFromExistingVertices(t);for(var e=t.iterator();e.hasNext();){var n=e.next().intValue();this.add(this.edge.getCoordinate(n),n)}},print:function(t){t.println("Intersections:");for(var e=this.iterator();e.hasNext();){var n=e.next();n.print(t)}},findCollapsesFromExistingVertices:function(t){for(var e=0;e<this.edge.size()-2;e++){var n=this.edge.getCoordinate(e),i=(this.edge.getCoordinate(e+1),this.edge.getCoordinate(e+2));n.equals2D(i)&&t.add(new b(e+1))}},addEdgeCoordinates:function(t,e,n){var i=e.segmentIndex-t.segmentIndex+2,r=this.edge.getCoordinate(e.segmentIndex),s=e.isInterior()||!e.coord.equals2D(r);s||i--;n.add(new g(t.coord),!1);for(var o=t.segmentIndex+1;o<=e.segmentIndex;o++)n.add(this.edge.getCoordinate(o));s&&n.add(new g(e.coord))},iterator:function(){return this.nodeMap.values().iterator()},addSplitEdges:function(t){this.addEndpoints(),this.addCollapsedNodes();for(var e=this.iterator(),n=e.next();e.hasNext();){var i=e.next(),r=this.createSplitEdge(n,i);t.add(r),n=i}},findCollapseIndex:function(t,e,n){if(!t.coord.equals2D(e.coord))return!1;var i=e.segmentIndex-t.segmentIndex;return e.isInterior()||i--,1===i?(n[0]=t.segmentIndex+1,!0):!1},findCollapsesFromInsertedNodes:function(t){for(var e=new Array(1).fill(null),n=this.iterator(),i=n.next();n.hasNext();){var r=n.next(),s=this.findCollapseIndex(i,r,e);s&&t.add(new b(e[0])),i=r}},getEdge:function(){return this.edge},addEndpoints:function(){var t=this.edge.size()-1;this.add(this.edge.getCoordinate(0),0),this.add(this.edge.getCoordinate(t),t)},createSplitEdge:function(t,e){var n=e.segmentIndex-t.segmentIndex+2,i=this.edge.getCoordinate(e.segmentIndex),r=e.isInterior()||!e.coord.equals2D(i);r||n--;var s=new Array(n).fill(null),o=0;s[o++]=new g(t.coord);for(var a=t.segmentIndex+1;a<=e.segmentIndex;a++)s[o++]=this.edge.getCoordinate(a);return r&&(s[o]=new g(e.coord)),new Ke(s,this.edge.getData())},add:function(t,e){var n=new Xe(this.edge,t,e,this.edge.getSegmentOctant(e)),i=this.nodeMap.get(n);return null!==i?(f.isTrue(i.coord.equals2D(t),"Found equal nodes with different coordinates"),i):(this.nodeMap.put(n,n),n)},checkSplitEdgesCorrectness:function(t){var e=this.edge.getCoordinates(),n=t.get(0),i=n.getCoordinate(0);if(!i.equals2D(e[0]))throw new l("bad split edge start point at "+i);var r=t.get(t.size()-1),s=r.getCoordinates(),o=s[s.length-1];if(!o.equals2D(e[e.length-1]))throw new l("bad split edge end point at "+o)},interfaces_:function(){return[]},getClass:function(){return He}}),e(We.prototype,{next:function(){return null===this.currNode?(this.currNode=this.nextNode,this.currSegIndex=this.currNode.segmentIndex,this.readNextNode(),this.currNode):null===this.nextNode?null:this.nextNode.segmentIndex===this.currNode.segmentIndex?(this.currNode=this.nextNode,this.currSegIndex=this.currNode.segmentIndex,this.readNextNode(),this.currNode):(this.nextNode.segmentIndex>this.currNode.segmentIndex,null)},remove:function(){throw new UnsupportedOperationException(this.getClass().getName())},hasNext:function(){return null!==this.nextNode},readNextNode:function(){this.nodeIt.hasNext()?this.nextNode=this.nodeIt.next():this.nextNode=null},interfaces_:function(){return[p]},getClass:function(){return We}}),e(je.prototype,{addIntersection:function(t,e){},interfaces_:function(){return[be]},getClass:function(){return je}}),e(Ke.prototype,{getCoordinates:function(){return this.pts},size:function(){return this.pts.length},getCoordinate:function(t){return this.pts[t]},isClosed:function(){return this.pts[0].equals(this.pts[this.pts.length-1])},getSegmentOctant:function(t){return t===this.pts.length-1?-1:this.safeOctant(this.getCoordinate(t),this.getCoordinate(t+1))},setData:function(t){this.data=t},safeOctant:function(t,e){return t.equals2D(e)?0:Pe.octant(t,e)},getData:function(){return this.data},addIntersection:function(){if(2===arguments.length){var t=arguments[0],e=arguments[1];this.addIntersectionNode(t,e)}else if(4===arguments.length){var n=arguments[0],i=arguments[1],r=(arguments[2],arguments[3]),s=new g(n.getIntersection(r));this.addIntersection(s,i)}},toString:function(){return se.toLineString(new Gt(this.pts))},getNodeList:function(){return this.nodeList},addIntersectionNode:function(t,e){var n=e,i=n+1;if(i<this.pts.length){var r=this.pts[i];t.equals2D(r)&&(n=i)}var s=this.nodeList.add(t,n);return s},addIntersections:function(t,e,n){for(var i=0;i<t.getIntersectionNum();i++)this.addIntersection(t,e,n,i)},interfaces_:function(){return[je]},getClass:function(){return Ke}}),Ke.getNodedSubstrings=function(){if(1===arguments.length){var t=arguments[0],e=new I;return Ke.getNodedSubstrings(t,e),e}if(2===arguments.length)for(var n=arguments[0],i=arguments[1],r=n.iterator();r.hasNext();){var s=r.next();s.getNodeList().addSplitEdges(i)}},e(Ze.prototype,{overlap:function(){if(2===arguments.length){arguments[0],arguments[1]}else if(4===arguments.length){var t=arguments[0],e=arguments[1],n=arguments[2],i=arguments[3];t.getLineSegment(e,this.overlapSeg1),n.getLineSegment(i,this.overlapSeg2),this.overlap(this.overlapSeg1,this.overlapSeg2)}},interfaces_:function(){return[]},getClass:function(){return Ze}}),e(Qe.prototype,{getLineSegment:function(t,e){e.p0=this.pts[t],e.p1=this.pts[t+1]},computeSelect:function(t,e,n,i){var r=this.pts[e],s=this.pts[n];if(i.tempEnv1.init(r,s),n-e===1)return i.select(this,e),null;if(!t.intersects(i.tempEnv1))return null;var o=Math.trunc((e+n)/2);
o>e&&this.computeSelect(t,e,o,i),n>o&&this.computeSelect(t,o,n,i)},getCoordinates:function(){for(var t=new Array(this.end-this.start+1).fill(null),e=0,n=this.start;n<=this.end;n++)t[e++]=this.pts[n];return t},computeOverlaps:function(t,e){this.computeOverlapsInternal(this.start,this.end,t,t.start,t.end,e)},setId:function(t){this.id=t},select:function(t,e){this.computeSelect(t,this.start,this.end,e)},getEnvelope:function(){if(null===this.env){var t=this.pts[this.start],e=this.pts[this.end];this.env=new C(t,e)}return this.env},getEndIndex:function(){return this.end},getStartIndex:function(){return this.start},getContext:function(){return this.context},getId:function(){return this.id},computeOverlapsInternal:function(t,e,n,i,r,s){var o=this.pts[t],a=this.pts[e],u=n.pts[i],l=n.pts[r];if(e-t===1&&r-i===1)return s.overlap(this,t,n,i),null;if(s.tempEnv1.init(o,a),s.tempEnv2.init(u,l),!s.tempEnv1.intersects(s.tempEnv2))return null;var h=Math.trunc((t+e)/2),c=Math.trunc((i+r)/2);h>t&&(c>i&&this.computeOverlapsInternal(t,h,n,i,c,s),r>c&&this.computeOverlapsInternal(t,h,n,c,r,s)),e>h&&(c>i&&this.computeOverlapsInternal(h,e,n,i,c,s),r>c&&this.computeOverlapsInternal(h,e,n,c,r,s))},interfaces_:function(){return[]},getClass:function(){return Qe}}),e(Je.prototype,{interfaces_:function(){return[]},getClass:function(){return Je}}),Je.isNorthern=function(t){return t===Je.NE||t===Je.NW},Je.isOpposite=function(t,e){if(t===e)return!1;var n=(t-e+4)%4;return 2===n},Je.commonHalfPlane=function(t,e){if(t===e)return t;var n=(t-e+4)%4;if(2===n)return-1;var i=e>t?t:e,r=t>e?t:e;return 0===i&&3===r?3:i},Je.isInHalfPlane=function(t,e){return e===Je.SE?t===Je.SE||t===Je.SW:t===e||t===e+1},Je.quadrant=function(){if("number"==typeof arguments[0]&&"number"==typeof arguments[1]){var t=arguments[0],e=arguments[1];if(0===t&&0===e)throw new i("Cannot compute the quadrant for point ( "+t+", "+e+" )");return t>=0?e>=0?Je.NE:Je.SE:e>=0?Je.NW:Je.SW}if(arguments[0]instanceof g&&arguments[1]instanceof g){var n=arguments[0],r=arguments[1];if(r.x===n.x&&r.y===n.y)throw new i("Cannot compute the quadrant for two identical points "+n);return r.x>=n.x?r.y>=n.y?Je.NE:Je.SE:r.y>=n.y?Je.NW:Je.SW}},Je.NE=0,Je.NW=1,Je.SW=2,Je.SE=3,e($e.prototype,{interfaces_:function(){return[]},getClass:function(){return $e}}),$e.getChainStartIndices=function(t){var e=0,n=new I;n.add(new b(e));do{var i=$e.findChainEnd(t,e);n.add(new b(i)),e=i}while(e<t.length-1);var r=$e.toIntArray(n);return r},$e.findChainEnd=function(t,e){for(var n=e;n<t.length-1&&t[n].equals2D(t[n+1]);)n++;if(n>=t.length-1)return t.length-1;for(var i=Je.quadrant(t[n],t[n+1]),r=e+1;r<t.length;){if(!t[r-1].equals2D(t[r])){var s=Je.quadrant(t[r-1],t[r]);if(s!==i)break}r++}return r-1},$e.getChains=function(){if(1===arguments.length){var t=arguments[0];return $e.getChains(t,null)}if(2===arguments.length){for(var e=arguments[0],n=arguments[1],i=new I,r=$e.getChainStartIndices(e),s=0;s<r.length-1;s++){var o=new Qe(e,r[s],r[s+1],n);i.add(o)}return i}},$e.toIntArray=function(t){for(var e=new Array(t.size()).fill(null),n=0;n<e.length;n++)e[n]=t.get(n).intValue();return e},e(tn.prototype,{computeNodes:function(t){},getNodedSubstrings:function(){},interfaces_:function(){return[]},getClass:function(){return tn}}),e(en.prototype,{setSegmentIntersector:function(t){this.segInt=t},interfaces_:function(){return[tn]},getClass:function(){return en}}),h(nn,en),e(nn.prototype,{getMonotoneChains:function(){return this.monoChains},getNodedSubstrings:function(){return Ke.getNodedSubstrings(this.nodedSegStrings)},getIndex:function(){return this.index},add:function(t){for(var e=$e.getChains(t.getCoordinates(),t),n=e.iterator();n.hasNext();){var i=n.next();i.setId(this.idCounter++),this.index.insert(i.getEnvelope(),i),this.monoChains.add(i)}},computeNodes:function(t){this.nodedSegStrings=t;for(var e=t.iterator();e.hasNext();)this.add(e.next());this.intersectChains()},intersectChains:function(){for(var t=new rn(this.segInt),e=this.monoChains.iterator();e.hasNext();)for(var n=e.next(),i=this.index.query(n.getEnvelope()),r=i.iterator();r.hasNext();){var s=r.next();if(s.getId()>n.getId()&&(n.computeOverlaps(s,t),this.nOverlaps++),this.segInt.isDone())return null}},interfaces_:function(){return[]},getClass:function(){return nn}}),h(rn,Ze),e(rn.prototype,{overlap:function(){if(4!==arguments.length)return Ze.prototype.overlap.apply(this,arguments);var t=arguments[0],e=arguments[1],n=arguments[2],i=arguments[3],r=t.getContext(),s=n.getContext();this.si.processIntersections(r,e,s,i)},interfaces_:function(){return[]},getClass:function(){return rn}}),nn.SegmentOverlapAction=rn,h(sn,l),e(sn.prototype,{getCoordinate:function(){return this.pt},interfaces_:function(){return[]},getClass:function(){return sn}}),sn.msgWithCoord=function(t,e){return null!==e?t+" [ "+e+" ]":t},e(on.prototype,{processIntersections:function(t,e,n,i){},isDone:function(){},interfaces_:function(){return[]},getClass:function(){return on}}),e(an.prototype,{getInteriorIntersection:function(){return this.interiorIntersection},setCheckEndSegmentsOnly:function(t){this.isCheckEndSegmentsOnly=t},getIntersectionSegments:function(){return this.intSegments},count:function(){return this.intersectionCount},getIntersections:function(){return this.intersections},setFindAllIntersections:function(t){this.findAllIntersections=t},setKeepIntersections:function(t){this.keepIntersections=t},processIntersections:function(t,e,n,i){if(!this.findAllIntersections&&this.hasIntersection())return null;if(t===n&&e===i)return null;if(this.isCheckEndSegmentsOnly){var r=this.isEndSegment(t,e)||this.isEndSegment(n,i);if(!r)return null}var s=t.getCoordinates()[e],o=t.getCoordinates()[e+1],a=n.getCoordinates()[i],u=n.getCoordinates()[i+1];this.li.computeIntersection(s,o,a,u),this.li.hasIntersection()&&this.li.isInteriorIntersection()&&(this.intSegments=new Array(4).fill(null),this.intSegments[0]=s,this.intSegments[1]=o,this.intSegments[2]=a,this.intSegments[3]=u,this.interiorIntersection=this.li.getIntersection(0),this.keepIntersections&&this.intersections.add(this.interiorIntersection),this.intersectionCount++)},isEndSegment:function(t,e){return 0===e?!0:e>=t.size()-2},hasIntersection:function(){return null!==this.interiorIntersection},isDone:function(){return this.findAllIntersections?!1:null!==this.interiorIntersection},interfaces_:function(){return[on]},getClass:function(){return an}}),an.createAllIntersectionsFinder=function(t){var e=new an(t);return e.setFindAllIntersections(!0),e},an.createAnyIntersectionFinder=function(t){return new an(t)},an.createIntersectionCounter=function(t){var e=new an(t);return e.setFindAllIntersections(!0),e.setKeepIntersections(!1),e},e(un.prototype,{execute:function(){return null!==this.segInt?null:void this.checkInteriorIntersections()},getIntersections:function(){return this.segInt.getIntersections()},isValid:function(){return this.execute(),this._isValid},setFindAllIntersections:function(t){this.findAllIntersections=t},checkInteriorIntersections:function(){this._isValid=!0,this.segInt=new an(this.li),this.segInt.setFindAllIntersections(this.findAllIntersections);var t=new nn;return t.setSegmentIntersector(this.segInt),t.computeNodes(this.segStrings),this.segInt.hasIntersection()?(this._isValid=!1,null):void 0},checkValid:function(){if(this.execute(),!this._isValid)throw new sn(this.getErrorMessage(),this.segInt.getInteriorIntersection())},getErrorMessage:function(){if(this._isValid)return"no intersections found";var t=this.segInt.getIntersectionSegments();return"found non-noded intersection between "+se.toLineString(t[0],t[1])+" and "+se.toLineString(t[2],t[3])},interfaces_:function(){return[]},getClass:function(){return un}}),un.computeIntersections=function(t){var e=new un(t);return e.setFindAllIntersections(!0),e.isValid(),e.getIntersections()},e(ln.prototype,{checkValid:function(){this.nv.checkValid()},interfaces_:function(){return[]},getClass:function(){return ln}}),ln.toSegmentStrings=function(t){for(var e=new I,n=t.iterator();n.hasNext();){var i=n.next();e.add(new Oe(i.getCoordinates(),i))}return e},ln.checkValid=function(t){var e=new ln(t);e.checkValid()},e(hn.prototype,{map:function(t){for(var e=new I,n=0;n<t.getNumGeometries();n++){var i=this.mapOp.map(t.getGeometryN(n));i.isEmpty()||e.add(i)}return t.getFactory().createGeometryCollection(ie.toGeometryArray(e))},interfaces_:function(){return[]},getClass:function(){return hn}}),hn.map=function(t,e){var n=new hn(e);return n.map(t)},e(cn.prototype,{interfaces_:function(){return[]},getClass:function(){return cn}}),cn.opposite=function(t){return t===cn.LEFT?cn.RIGHT:t===cn.RIGHT?cn.LEFT:t},cn.ON=0,cn.LEFT=1,cn.RIGHT=2,e(fn.prototype,{setAllLocations:function(t){for(var e=0;e<this.location.length;e++)this.location[e]=t},isNull:function(){for(var t=0;t<this.location.length;t++)if(this.location[t]!==L.NONE)return!1;return!0},setAllLocationsIfNull:function(t){for(var e=0;e<this.location.length;e++)this.location[e]===L.NONE&&(this.location[e]=t)},isLine:function(){return 1===this.location.length},merge:function(t){if(t.location.length>this.location.length){var e=new Array(3).fill(null);e[cn.ON]=this.location[cn.ON],e[cn.LEFT]=L.NONE,e[cn.RIGHT]=L.NONE,this.location=e}for(var n=0;n<this.location.length;n++)this.location[n]===L.NONE&&n<t.location.length&&(this.location[n]=t.location[n])},getLocations:function(){return this.location},flip:function(){if(this.location.length<=1)return null;var t=this.location[cn.LEFT];this.location[cn.LEFT]=this.location[cn.RIGHT],this.location[cn.RIGHT]=t},toString:function(){var t=new P;return this.location.length>1&&t.append(L.toLocationSymbol(this.location[cn.LEFT])),t.append(L.toLocationSymbol(this.location[cn.ON])),this.location.length>1&&t.append(L.toLocationSymbol(this.location[cn.RIGHT])),t.toString()},setLocations:function(t,e,n){this.location[cn.ON]=t,this.location[cn.LEFT]=e,this.location[cn.RIGHT]=n},get:function(t){return t<this.location.length?this.location[t]:L.NONE},isArea:function(){return this.location.length>1},isAnyNull:function(){for(var t=0;t<this.location.length;t++)if(this.location[t]===L.NONE)return!0;return!1},setLocation:function(){if(1===arguments.length){var t=arguments[0];this.setLocation(cn.ON,t)}else if(2===arguments.length){var e=arguments[0],n=arguments[1];this.location[e]=n}},init:function(t){this.location=new Array(t).fill(null),this.setAllLocations(L.NONE)},isEqualOnSide:function(t,e){return this.location[e]===t.location[e]},allPositionsEqual:function(t){for(var e=0;e<this.location.length;e++)if(this.location[e]!==t)return!1;return!0},interfaces_:function(){return[]},getClass:function(){return fn}}),e(gn.prototype,{getGeometryCount:function(){var t=0;return this.elt[0].isNull()||t++,this.elt[1].isNull()||t++,t},setAllLocations:function(t,e){this.elt[t].setAllLocations(e)},isNull:function(t){return this.elt[t].isNull()},setAllLocationsIfNull:function(){if(1===arguments.length){var t=arguments[0];this.setAllLocationsIfNull(0,t),this.setAllLocationsIfNull(1,t)}else if(2===arguments.length){var e=arguments[0],n=arguments[1];this.elt[e].setAllLocationsIfNull(n)}},isLine:function(t){return this.elt[t].isLine()},merge:function(t){for(var e=0;2>e;e++)null===this.elt[e]&&null!==t.elt[e]?this.elt[e]=new fn(t.elt[e]):this.elt[e].merge(t.elt[e])},flip:function(){this.elt[0].flip(),this.elt[1].flip()},getLocation:function(){if(1===arguments.length){var t=arguments[0];return this.elt[t].get(cn.ON)}if(2===arguments.length){var e=arguments[0],n=arguments[1];return this.elt[e].get(n)}},toString:function(){var t=new P;return null!==this.elt[0]&&(t.append("A:"),t.append(this.elt[0].toString())),null!==this.elt[1]&&(t.append(" B:"),t.append(this.elt[1].toString())),t.toString()},isArea:function(){if(0===arguments.length)return this.elt[0].isArea()||this.elt[1].isArea();if(1===arguments.length){var t=arguments[0];return this.elt[t].isArea()}},isAnyNull:function(t){return this.elt[t].isAnyNull()},setLocation:function(){if(2===arguments.length){var t=arguments[0],e=arguments[1];this.elt[t].setLocation(cn.ON,e)}else if(3===arguments.length){var n=arguments[0],i=arguments[1],r=arguments[2];this.elt[n].setLocation(i,r)}},isEqualOnSide:function(t,e){return this.elt[0].isEqualOnSide(t.elt[0],e)&&this.elt[1].isEqualOnSide(t.elt[1],e)},allPositionsEqual:function(t,e){return this.elt[t].allPositionsEqual(e)},toLine:function(t){this.elt[t].isArea()&&(this.elt[t]=new fn(this.elt[t].location[0]))},interfaces_:function(){return[]},getClass:function(){return gn}}),gn.toLineLabel=function(t){for(var e=new gn(L.NONE),n=0;2>n;n++)e.setLocation(n,t.getLocation(n));return e},e(dn.prototype,{computeRing:function(){if(null!==this.ring)return null;for(var t=new Array(this.pts.size()).fill(null),e=0;e<this.pts.size();e++)t[e]=this.pts.get(e);this.ring=this.geometryFactory.createLinearRing(t),this._isHole=he.isCCW(this.ring.getCoordinates())},isIsolated:function(){return 1===this.label.getGeometryCount()},computePoints:function(t){this.startDe=t;var e=t,n=!0;do{if(null===e)throw new sn("Found null DirectedEdge");if(e.getEdgeRing()===this)throw new sn("Directed Edge visited twice during ring-building at "+e.getCoordinate());this.edges.add(e);var i=e.getLabel();f.isTrue(i.isArea()),this.mergeLabel(i),this.addPoints(e.getEdge(),e.isForward(),n),n=!1,this.setEdgeRing(e,this),e=this.getNext(e)}while(e!==this.startDe)},getLinearRing:function(){return this.ring},getCoordinate:function(t){return this.pts.get(t)},computeMaxNodeDegree:function(){this.maxNodeDegree=0;var t=this.startDe;do{var e=t.getNode(),n=e.getEdges().getOutgoingDegree(this);n>this.maxNodeDegree&&(this.maxNodeDegree=n),t=this.getNext(t)}while(t!==this.startDe);this.maxNodeDegree*=2},addPoints:function(t,e,n){var i=t.getCoordinates();if(e){var r=1;n&&(r=0);for(var s=r;s<i.length;s++)this.pts.add(i[s])}else{var r=i.length-2;n&&(r=i.length-1);for(var s=r;s>=0;s--)this.pts.add(i[s])}},isHole:function(){return this._isHole},setInResult:function(){var t=this.startDe;do t.getEdge().setInResult(!0),t=t.getNext();while(t!==this.startDe)},containsPoint:function(t){var e=this.getLinearRing(),n=e.getEnvelopeInternal();if(!n.contains(t))return!1;if(!he.isPointInRing(t,e.getCoordinates()))return!1;for(var i=this.holes.iterator();i.hasNext();){var r=i.next();if(r.containsPoint(t))return!1}return!0},addHole:function(t){this.holes.add(t)},isShell:function(){return null===this.shell},getLabel:function(){return this.label},getEdges:function(){return this.edges},getMaxNodeDegree:function(){return this.maxNodeDegree<0&&this.computeMaxNodeDegree(),this.maxNodeDegree},getShell:function(){return this.shell},mergeLabel:function(){if(1===arguments.length){var t=arguments[0];this.mergeLabel(t,0),this.mergeLabel(t,1)}else if(2===arguments.length){var e=arguments[0],n=arguments[1],i=e.getLocation(n,cn.RIGHT);if(i===L.NONE)return null;if(this.label.getLocation(n)===L.NONE)return this.label.setLocation(n,i),null}},setShell:function(t){this.shell=t,null!==t&&t.addHole(this)},toPolygon:function(t){for(var e=new Array(this.holes.size()).fill(null),n=0;n<this.holes.size();n++)e[n]=this.holes.get(n).getLinearRing();var i=t.createPolygon(this.getLinearRing(),e);return i},interfaces_:function(){return[]},getClass:function(){return dn}}),h(pn,dn),e(pn.prototype,{setEdgeRing:function(t,e){t.setMinEdgeRing(e)},getNext:function(t){return t.getNextMin()},interfaces_:function(){return[]},getClass:function(){return pn}}),h(vn,dn),e(vn.prototype,{buildMinimalRings:function(){var t=new I,e=this.startDe;do{if(null===e.getMinEdgeRing()){var n=new pn(e,this.geometryFactory);t.add(n)}e=e.getNext()}while(e!==this.startDe);return t},setEdgeRing:function(t,e){t.setEdgeRing(e)},linkDirectedEdgesForMinimalEdgeRings:function(){var t=this.startDe;do{var e=t.getNode();e.getEdges().linkMinimalDirectedEdges(this),t=t.getNext()}while(t!==this.startDe)},getNext:function(t){return t.getNext()},interfaces_:function(){return[]},getClass:function(){return vn}}),e(mn.prototype,{setVisited:function(t){this._isVisited=t},setInResult:function(t){this._isInResult=t},isCovered:function(){return this._isCovered},isCoveredSet:function(){return this._isCoveredSet},setLabel:function(t){this.label=t},getLabel:function(){return this.label},setCovered:function(t){this._isCovered=t,this._isCoveredSet=!0},updateIM:function(t){f.isTrue(this.label.getGeometryCount()>=2,"found partial label"),this.computeIM(t)},isInResult:function(){return this._isInResult},isVisited:function(){return this._isVisited},interfaces_:function(){return[]},getClass:function(){return mn}}),h(yn,mn),e(yn.prototype,{isIncidentEdgeInResult:function(){for(var t=this.getEdges().getEdges().iterator();t.hasNext();){var e=t.next();if(e.getEdge().isInResult())return!0}return!1},isIsolated:function(){return 1===this.label.getGeometryCount()},getCoordinate:function(){return this.coord},print:function(t){t.println("node "+this.coord+" lbl: "+this.label)},computeIM:function(t){},computeMergedLocation:function(t,e){var n=L.NONE;if(n=this.label.getLocation(e),!t.isNull(e)){var i=t.getLocation(e);n!==L.BOUNDARY&&(n=i)}return n},setLabel:function(){if(2!==arguments.length)return mn.prototype.setLabel.apply(this,arguments);var t=arguments[0],e=arguments[1];null===this.label?this.label=new gn(t,e):this.label.setLocation(t,e)},getEdges:function(){return this.edges},mergeLabel:function(){if(arguments[0]instanceof yn){var t=arguments[0];this.mergeLabel(t.label)}else if(arguments[0]instanceof gn)for(var e=arguments[0],n=0;2>n;n++){var i=this.computeMergedLocation(e,n),r=this.label.getLocation(n);r===L.NONE&&this.label.setLocation(n,i)}},add:function(t){this.edges.insert(t),t.setNode(this)},setLabelBoundary:function(t){if(null===this.label)return null;var e=L.NONE;null!==this.label&&(e=this.label.getLocation(t));var n=null;switch(e){case L.BOUNDARY:n=L.INTERIOR;break;case L.INTERIOR:n=L.BOUNDARY;break;default:n=L.BOUNDARY}this.label.setLocation(t,n)},interfaces_:function(){return[]},getClass:function(){return yn}}),e(xn.prototype,{find:function(t){return this.nodeMap.get(t)},addNode:function(){if(arguments[0]instanceof g){var t=arguments[0],e=this.nodeMap.get(t);return null===e&&(e=this.nodeFact.createNode(t),this.nodeMap.put(t,e)),e}if(arguments[0]instanceof yn){var n=arguments[0],e=this.nodeMap.get(n.getCoordinate());return null===e?(this.nodeMap.put(n.getCoordinate(),n),n):(e.mergeLabel(n),e)}},print:function(t){for(var e=this.iterator();e.hasNext();){var n=e.next();n.print(t)}},iterator:function(){return this.nodeMap.values().iterator()},values:function(){return this.nodeMap.values()},getBoundaryNodes:function(t){for(var e=new I,n=this.iterator();n.hasNext();){var i=n.next();i.getLabel().getLocation(t)===L.BOUNDARY&&e.add(i)}return e},add:function(t){var e=t.getCoordinate(),n=this.addNode(e);n.add(t)},interfaces_:function(){return[]},getClass:function(){return xn}}),e(En.prototype,{compareDirection:function(t){return this.dx===t.dx&&this.dy===t.dy?0:this.quadrant>t.quadrant?1:this.quadrant<t.quadrant?-1:he.computeOrientation(t.p0,t.p1,this.p1)},getDy:function(){return this.dy},getCoordinate:function(){return this.p0},setNode:function(t){this.node=t},print:function(t){var e=Math.atan2(this.dy,this.dx),n=this.getClass().getName(),i=n.lastIndexOf("."),r=n.substring(i+1);t.print("  "+r+": "+this.p0+" - "+this.p1+" "+this.quadrant+":"+e+"   "+this.label)},compareTo:function(t){var e=t;return this.compareDirection(e)},getDirectedCoordinate:function(){return this.p1},getDx:function(){return this.dx},getLabel:function(){return this.label},getEdge:function(){return this.edge},getQuadrant:function(){return this.quadrant},getNode:function(){return this.node},toString:function(){var t=Math.atan2(this.dy,this.dx),e=this.getClass().getName(),n=e.lastIndexOf("."),i=e.substring(n+1);return"  "+i+": "+this.p0+" - "+this.p1+" "+this.quadrant+":"+t+"   "+this.label},computeLabel:function(t){},init:function(t,e){this.p0=t,this.p1=e,this.dx=e.x-t.x,this.dy=e.y-t.y,this.quadrant=Je.quadrant(this.dx,this.dy),f.isTrue(!(0===this.dx&&0===this.dy),"EdgeEnd with identical endpoints found")},interfaces_:function(){return[s]},getClass:function(){return En}}),h(In,En),e(In.prototype,{getNextMin:function(){return this.nextMin},getDepth:function(t){return this.depth[t]},setVisited:function(t){this._isVisited=t},computeDirectedLabel:function(){this.label=new gn(this.edge.getLabel()),this._isForward||this.label.flip()},getNext:function(){return this.next},setDepth:function(t,e){if(-999!==this.depth[t]&&this.depth[t]!==e)throw new sn("assigned depths do not match",this.getCoordinate());this.depth[t]=e},isInteriorAreaEdge:function t(){for(var t=!0,e=0;2>e;e++)this.label.isArea(e)&&this.label.getLocation(e,cn.LEFT)===L.INTERIOR&&this.label.getLocation(e,cn.RIGHT)===L.INTERIOR||(t=!1);return t},setNextMin:function(t){this.nextMin=t},print:function(t){En.prototype.print.call(this,t),t.print(" "+this.depth[cn.LEFT]+"/"+this.depth[cn.RIGHT]),t.print(" ("+this.getDepthDelta()+")"),this._isInResult&&t.print(" inResult")},setMinEdgeRing:function(t){this.minEdgeRing=t},isLineEdge:function(){var t=this.label.isLine(0)||this.label.isLine(1),e=!this.label.isArea(0)||this.label.allPositionsEqual(0,L.EXTERIOR),n=!this.label.isArea(1)||this.label.allPositionsEqual(1,L.EXTERIOR);return t&&e&&n},setEdgeRing:function(t){this.edgeRing=t},getMinEdgeRing:function(){return this.minEdgeRing},getDepthDelta:function(){var t=this.edge.getDepthDelta();return this._isForward||(t=-t),t},setInResult:function(t){this._isInResult=t},getSym:function(){return this.sym},isForward:function(){return this._isForward},getEdge:function(){return this.edge},printEdge:function(t){this.print(t),t.print(" "),this._isForward?this.edge.print(t):this.edge.printReverse(t)},setSym:function(t){this.sym=t},setVisitedEdge:function(t){this.setVisited(t),this.sym.setVisited(t)},setEdgeDepths:function(t,e){var n=this.getEdge().getDepthDelta();this._isForward||(n=-n);var i=1;t===cn.LEFT&&(i=-1);var r=cn.opposite(t),s=n*i,o=e+s;this.setDepth(t,e),this.setDepth(r,o)},getEdgeRing:function(){return this.edgeRing},isInResult:function(){return this._isInResult},setNext:function(t){this.next=t},isVisited:function(){return this._isVisited},interfaces_:function(){return[]},getClass:function(){return In}}),In.depthFactor=function(t,e){return t===L.EXTERIOR&&e===L.INTERIOR?1:t===L.INTERIOR&&e===L.EXTERIOR?-1:0},e(Nn.prototype,{createNode:function(t){return new yn(t,null)},interfaces_:function(){return[]},getClass:function(){return Nn}}),e(Cn.prototype,{printEdges:function(t){t.println("Edges:");for(var e=0;e<this.edges.size();e++){t.println("edge "+e+":");var n=this.edges.get(e);n.print(t),n.eiList.print(t)}},find:function(t){return this.nodes.find(t)},addNode:function(){if(arguments[0]instanceof yn){var t=arguments[0];return this.nodes.addNode(t)}if(arguments[0]instanceof g){var e=arguments[0];return this.nodes.addNode(e)}},getNodeIterator:function(){return this.nodes.iterator()},linkResultDirectedEdges:function(){for(var t=this.nodes.iterator();t.hasNext();){var e=t.next();e.getEdges().linkResultDirectedEdges()}},debugPrintln:function(t){A.out.println(t)},isBoundaryNode:function(t,e){var n=this.nodes.find(e);if(null===n)return!1;var i=n.getLabel();return null!==i&&i.getLocation(t)===L.BOUNDARY},linkAllDirectedEdges:function(){for(var t=this.nodes.iterator();t.hasNext();){var e=t.next();e.getEdges().linkAllDirectedEdges()}},matchInSameDirection:function(t,e,n,i){return t.equals(n)?he.computeOrientation(t,e,i)===he.COLLINEAR&&Je.quadrant(t,e)===Je.quadrant(n,i):!1},getEdgeEnds:function(){return this.edgeEndList},debugPrint:function(t){A.out.print(t)},getEdgeIterator:function(){return this.edges.iterator()},findEdgeInSameDirection:function(t,e){for(var n=0;n<this.edges.size();n++){var i=this.edges.get(n),r=i.getCoordinates();if(this.matchInSameDirection(t,e,r[0],r[1]))return i;if(this.matchInSameDirection(t,e,r[r.length-1],r[r.length-2]))return i}return null},insertEdge:function(t){this.edges.add(t)},findEdgeEnd:function(t){for(var e=this.getEdgeEnds().iterator();e.hasNext();){var n=e.next();if(n.getEdge()===t)return n}return null},addEdges:function(t){for(var e=t.iterator();e.hasNext();){var n=e.next();this.edges.add(n);var i=new In(n,!0),r=new In(n,!1);i.setSym(r),r.setSym(i),this.add(i),this.add(r)}},add:function(t){this.nodes.add(t),this.edgeEndList.add(t)},getNodes:function(){return this.nodes.values()},findEdge:function(t,e){for(var n=0;n<this.edges.size();n++){var i=this.edges.get(n),r=i.getCoordinates();if(t.equals(r[0])&&e.equals(r[1]))return i}return null},interfaces_:function(){return[]},getClass:function(){return Cn}}),Cn.linkResultDirectedEdges=function(t){for(var e=t.iterator();e.hasNext();){var n=e.next();n.getEdges().linkResultDirectedEdges()}},e(Sn.prototype,{sortShellsAndHoles:function(t,e,n){for(var i=t.iterator();i.hasNext();){var r=i.next();r.isHole()?n.add(r):e.add(r)}},computePolygons:function(t){for(var e=new I,n=t.iterator();n.hasNext();){var i=n.next(),r=i.toPolygon(this.geometryFactory);e.add(r)}return e},placeFreeHoles:function(t,e){for(var n=e.iterator();n.hasNext();){var i=n.next();if(null===i.getShell()){var r=this.findEdgeRingContaining(i,t);if(null===r)throw new sn("unable to assign hole to a shell",i.getCoordinate(0));i.setShell(r)}}},buildMinimalEdgeRings:function(t,e,n){for(var i=new I,r=t.iterator();r.hasNext();){var s=r.next();if(s.getMaxNodeDegree()>2){s.linkDirectedEdgesForMinimalEdgeRings();var o=s.buildMinimalRings(),a=this.findShell(o);null!==a?(this.placePolygonHoles(a,o),e.add(a)):n.addAll(o)}else i.add(s)}return i},containsPoint:function(t){for(var e=this.shellList.iterator();e.hasNext();){var n=e.next();if(n.containsPoint(t))return!0}return!1},buildMaximalEdgeRings:function(t){for(var e=new I,n=t.iterator();n.hasNext();){var i=n.next();if(i.isInResult()&&i.getLabel().isArea()&&null===i.getEdgeRing()){var r=new vn(i,this.geometryFactory);e.add(r),r.setInResult()}}return e},placePolygonHoles:function(t,e){for(var n=e.iterator();n.hasNext();){var i=n.next();i.isHole()&&i.setShell(t)}},getPolygons:function(){var t=this.computePolygons(this.shellList);return t},findEdgeRingContaining:function(t,e){for(var n=t.getLinearRing(),i=n.getEnvelopeInternal(),r=n.getCoordinateN(0),s=null,o=null,a=e.iterator();a.hasNext();){var u=a.next(),l=u.getLinearRing(),h=l.getEnvelopeInternal();null!==s&&(o=s.getLinearRing().getEnvelopeInternal());var c=!1;h.contains(i)&&he.isPointInRing(r,l.getCoordinates())&&(c=!0),c&&(null===s||o.contains(h))&&(s=u)}return s},findShell:function(t){for(var e=0,n=null,i=t.iterator();i.hasNext();){var r=i.next();r.isHole()||(n=r,e++)}return f.isTrue(1>=e,"found two shells in MinimalEdgeRing list"),n},add:function(){if(1===arguments.length){var t=arguments[0];this.add(t.getEdgeEnds(),t.getNodes())}else if(2===arguments.length){var e=arguments[0],n=arguments[1];Cn.linkResultDirectedEdges(n);var i=this.buildMaximalEdgeRings(e),r=new I,s=this.buildMinimalEdgeRings(i,this.shellList,r);this.sortShellsAndHoles(s,this.shellList,r),this.placeFreeHoles(this.shellList,r)}},interfaces_:function(){return[]},getClass:function(){return Sn}}),e(wn.prototype,{collectLines:function(t){for(var e=this.op.getGraph().getEdgeEnds().iterator();e.hasNext();){var n=e.next();this.collectLineEdge(n,t,this.lineEdgesList),this.collectBoundaryTouchEdge(n,t,this.lineEdgesList)}},labelIsolatedLine:function(t,e){var n=this.ptLocator.locate(t.getCoordinate(),this.op.getArgGeometry(e));t.getLabel().setLocation(e,n)},build:function(t){return this.findCoveredLineEdges(),this.collectLines(t),this.buildLines(t),this.resultLineList},collectLineEdge:function(t,e,n){var i=t.getLabel(),r=t.getEdge();t.isLineEdge()&&(t.isVisited()||!ii.isResultOfOp(i,e)||r.isCovered()||(n.add(r),t.setVisitedEdge(!0)))},findCoveredLineEdges:function(){for(var t=this.op.getGraph().getNodes().iterator();t.hasNext();){var e=t.next();e.getEdges().findCoveredLineEdges()}for(var n=this.op.getGraph().getEdgeEnds().iterator();n.hasNext();){var i=n.next(),r=i.getEdge();if(i.isLineEdge()&&!r.isCoveredSet()){var s=this.op.isCoveredByA(i.getCoordinate());r.setCovered(s)}}},labelIsolatedLines:function(t){for(var e=t.iterator();e.hasNext();){var n=e.next(),i=n.getLabel();n.isIsolated()&&(i.isNull(0)?this.labelIsolatedLine(n,0):this.labelIsolatedLine(n,1))}},buildLines:function(t){for(var e=this.lineEdgesList.iterator();e.hasNext();){var n=e.next(),i=(n.getLabel(),this.geometryFactory.createLineString(n.getCoordinates()));this.resultLineList.add(i),n.setInResult(!0)}},collectBoundaryTouchEdge:function(t,e,n){var i=t.getLabel();return t.isLineEdge()?null:t.isVisited()?null:t.isInteriorAreaEdge()?null:t.getEdge().isInResult()?null:(f.isTrue(!(t.isInResult()||t.getSym().isInResult())||!t.getEdge().isInResult()),void(ii.isResultOfOp(i,e)&&e===ii.INTERSECTION&&(n.add(t.getEdge()),t.setVisitedEdge(!0))))},interfaces_:function(){return[]},getClass:function(){return wn}}),e(Ln.prototype,{filterCoveredNodeToPoint:function(t){var e=t.getCoordinate();if(!this.op.isCoveredByLA(e)){var n=this.geometryFactory.createPoint(e);this.resultPointList.add(n)}},extractNonCoveredResultNodes:function(t){for(var e=this.op.getGraph().getNodes().iterator();e.hasNext();){var n=e.next();if(!(n.isInResult()||n.isIncidentEdgeInResult()||0!==n.getEdges().getDegree()&&t!==ii.INTERSECTION)){var i=n.getLabel();ii.isResultOfOp(i,t)&&this.filterCoveredNodeToPoint(n)}}},build:function(t){return this.extractNonCoveredResultNodes(t),this.resultPointList},interfaces_:function(){return[]},getClass:function(){return Ln}}),e(Rn.prototype,{locate:function(t){},interfaces_:function(){return[]},getClass:function(){return Rn}}),e(Tn.prototype,{locate:function(t){return Tn.locate(t,this.geom)},interfaces_:function(){return[Rn]},getClass:function(){return Tn}}),Tn.isPointInRing=function(t,e){return e.getEnvelopeInternal().intersects(t)?he.isPointInRing(t,e.getCoordinates()):!1},Tn.containsPointInPolygon=function(t,e){if(e.isEmpty())return!1;var n=e.getExteriorRing();if(!Tn.isPointInRing(t,n))return!1;for(var i=0;i<e.getNumInteriorRing();i++){var r=e.getInteriorRingN(i);if(Tn.isPointInRing(t,r))return!1}return!0},Tn.containsPoint=function(t,e){if(e instanceof Tt)return Tn.containsPointInPolygon(t,e);if(e instanceof ft)for(var n=new Re(e);n.hasNext();){var i=n.next();if(i!==e&&Tn.containsPoint(t,i))return!0}return!1},Tn.locate=function(t,e){return e.isEmpty()?L.EXTERIOR:Tn.containsPoint(t,e)?L.INTERIOR:L.EXTERIOR},e(Pn.prototype,{getNextCW:function(t){this.getEdges();var e=this.edgeList.indexOf(t),n=e-1;return 0===e&&(n=this.edgeList.size()-1),this.edgeList.get(n)},propagateSideLabels:function(t){for(var e=L.NONE,n=this.iterator();n.hasNext();){var i=n.next(),r=i.getLabel();r.isArea(t)&&r.getLocation(t,cn.LEFT)!==L.NONE&&(e=r.getLocation(t,cn.LEFT))}if(e===L.NONE)return null;for(var s=e,n=this.iterator();n.hasNext();){var i=n.next(),r=i.getLabel();if(r.getLocation(t,cn.ON)===L.NONE&&r.setLocation(t,cn.ON,s),r.isArea(t)){var o=r.getLocation(t,cn.LEFT),a=r.getLocation(t,cn.RIGHT);if(a!==L.NONE){if(a!==s)throw new sn("side location conflict",i.getCoordinate());o===L.NONE&&f.shouldNeverReachHere("found single null side (at "+i.getCoordinate()+")"),s=o}else f.isTrue(r.getLocation(t,cn.LEFT)===L.NONE,"found single null side"),r.setLocation(t,cn.RIGHT,s),r.setLocation(t,cn.LEFT,s)}}},getCoordinate:function(){var t=this.iterator();if(!t.hasNext())return null;var e=t.next();return e.getCoordinate()},print:function(t){A.out.println("EdgeEndStar:   "+this.getCoordinate());for(var e=this.iterator();e.hasNext();){var n=e.next();n.print(t)}},isAreaLabelsConsistent:function(t){return this.computeEdgeEndLabels(t.getBoundaryNodeRule()),this.checkAreaLabelsConsistent(0)},checkAreaLabelsConsistent:function(t){var e=this.getEdges();if(e.size()<=0)return!0;var n=e.size()-1,i=e.get(n).getLabel(),r=i.getLocation(t,cn.LEFT);f.isTrue(r!==L.NONE,"Found unlabelled area edge");for(var s=r,o=this.iterator();o.hasNext();){var a=o.next(),u=a.getLabel();
f.isTrue(u.isArea(t),"Found non-area edge");var l=u.getLocation(t,cn.LEFT),h=u.getLocation(t,cn.RIGHT);if(l===h)return!1;if(h!==s)return!1;s=l}return!0},findIndex:function(t){this.iterator();for(var e=0;e<this.edgeList.size();e++){var n=this.edgeList.get(e);if(n===t)return e}return-1},iterator:function(){return this.getEdges().iterator()},getEdges:function(){return null===this.edgeList&&(this.edgeList=new I(this.edgeMap.values())),this.edgeList},getLocation:function(t,e,n){return this.ptInAreaLocation[t]===L.NONE&&(this.ptInAreaLocation[t]=Tn.locate(e,n[t].getGeometry())),this.ptInAreaLocation[t]},toString:function(){var t=new P;t.append("EdgeEndStar:   "+this.getCoordinate()),t.append("\n");for(var e=this.iterator();e.hasNext();){var n=e.next();t.append(n),t.append("\n")}return t.toString()},computeEdgeEndLabels:function(t){for(var e=this.iterator();e.hasNext();){var n=e.next();n.computeLabel(t)}},computeLabelling:function(t){this.computeEdgeEndLabels(t[0].getBoundaryNodeRule()),this.propagateSideLabels(0),this.propagateSideLabels(1);for(var e=[!1,!1],n=this.iterator();n.hasNext();)for(var i=n.next(),r=i.getLabel(),s=0;2>s;s++)r.isLine(s)&&r.getLocation(s)===L.BOUNDARY&&(e[s]=!0);for(var n=this.iterator();n.hasNext();)for(var i=n.next(),r=i.getLabel(),s=0;2>s;s++)if(r.isAnyNull(s)){var o=L.NONE;if(e[s])o=L.EXTERIOR;else{var a=i.getCoordinate();o=this.getLocation(s,a,t)}r.setAllLocationsIfNull(s,o)}},getDegree:function(){return this.edgeMap.size()},insertEdgeEnd:function(t,e){this.edgeMap.put(t,e),this.edgeList=null},interfaces_:function(){return[]},getClass:function(){return Pn}}),h(bn,Pn),e(bn.prototype,{linkResultDirectedEdges:function(){this.getResultAreaEdges();for(var t=null,e=null,n=this.SCANNING_FOR_INCOMING,i=0;i<this.resultAreaEdgeList.size();i++){var r=this.resultAreaEdgeList.get(i),s=r.getSym();if(r.getLabel().isArea())switch(null===t&&r.isInResult()&&(t=r),n){case this.SCANNING_FOR_INCOMING:if(!s.isInResult())continue;e=s,n=this.LINKING_TO_OUTGOING;break;case this.LINKING_TO_OUTGOING:if(!r.isInResult())continue;e.setNext(r),n=this.SCANNING_FOR_INCOMING}}if(n===this.LINKING_TO_OUTGOING){if(null===t)throw new sn("no outgoing dirEdge found",this.getCoordinate());f.isTrue(t.isInResult(),"unable to link last incoming dirEdge"),e.setNext(t)}},insert:function(t){var e=t;this.insertEdgeEnd(e,e)},getRightmostEdge:function(){var t=this.getEdges(),e=t.size();if(1>e)return null;var n=t.get(0);if(1===e)return n;var i=t.get(e-1),r=n.getQuadrant(),s=i.getQuadrant();if(Je.isNorthern(r)&&Je.isNorthern(s))return n;if(!Je.isNorthern(r)&&!Je.isNorthern(s))return i;return 0!==n.getDy()?n:0!==i.getDy()?i:(f.shouldNeverReachHere("found two horizontal edges incident on node"),null)},print:function(t){A.out.println("DirectedEdgeStar: "+this.getCoordinate());for(var e=this.iterator();e.hasNext();){var n=e.next();t.print("out "),n.print(t),t.println(),t.print("in "),n.getSym().print(t),t.println()}},getResultAreaEdges:function(){if(null!==this.resultAreaEdgeList)return this.resultAreaEdgeList;this.resultAreaEdgeList=new I;for(var t=this.iterator();t.hasNext();){var e=t.next();(e.isInResult()||e.getSym().isInResult())&&this.resultAreaEdgeList.add(e)}return this.resultAreaEdgeList},updateLabelling:function(t){for(var e=this.iterator();e.hasNext();){var n=e.next(),i=n.getLabel();i.setAllLocationsIfNull(0,t.getLocation(0)),i.setAllLocationsIfNull(1,t.getLocation(1))}},linkAllDirectedEdges:function(){this.getEdges();for(var t=null,e=null,n=this.edgeList.size()-1;n>=0;n--){var i=this.edgeList.get(n),r=i.getSym();null===e&&(e=r),null!==t&&r.setNext(t),t=i}e.setNext(t)},computeDepths:function(){if(1===arguments.length){var t=arguments[0],e=this.findIndex(t),n=(t.getLabel(),t.getDepth(cn.LEFT)),i=t.getDepth(cn.RIGHT),r=this.computeDepths(e+1,this.edgeList.size(),n),s=this.computeDepths(0,e,r);if(s!==i)throw new sn("depth mismatch at "+t.getCoordinate())}else if(3===arguments.length){for(var o=arguments[0],a=arguments[1],u=arguments[2],l=u,h=o;a>h;h++){var c=this.edgeList.get(h);c.getLabel();c.setEdgeDepths(cn.RIGHT,l),l=c.getDepth(cn.LEFT)}return l}},mergeSymLabels:function(){for(var t=this.iterator();t.hasNext();){var e=t.next(),n=e.getLabel();n.merge(e.getSym().getLabel())}},linkMinimalDirectedEdges:function(t){for(var e=null,n=null,i=this.SCANNING_FOR_INCOMING,r=this.resultAreaEdgeList.size()-1;r>=0;r--){var s=this.resultAreaEdgeList.get(r),o=s.getSym();switch(null===e&&s.getEdgeRing()===t&&(e=s),i){case this.SCANNING_FOR_INCOMING:if(o.getEdgeRing()!==t)continue;n=o,i=this.LINKING_TO_OUTGOING;break;case this.LINKING_TO_OUTGOING:if(s.getEdgeRing()!==t)continue;n.setNextMin(s),i=this.SCANNING_FOR_INCOMING}}i===this.LINKING_TO_OUTGOING&&(f.isTrue(null!==e,"found null for first outgoing dirEdge"),f.isTrue(e.getEdgeRing()===t,"unable to link last incoming dirEdge"),n.setNextMin(e))},getOutgoingDegree:function(){if(0===arguments.length){for(var t=0,e=this.iterator();e.hasNext();){var n=e.next();n.isInResult()&&t++}return t}if(1===arguments.length){for(var i=arguments[0],t=0,e=this.iterator();e.hasNext();){var n=e.next();n.getEdgeRing()===i&&t++}return t}},getLabel:function(){return this.label},findCoveredLineEdges:function(){for(var t=L.NONE,e=this.iterator();e.hasNext();){var n=e.next(),i=n.getSym();if(!n.isLineEdge()){if(n.isInResult()){t=L.INTERIOR;break}if(i.isInResult()){t=L.EXTERIOR;break}}}if(t===L.NONE)return null;for(var r=t,e=this.iterator();e.hasNext();){var n=e.next(),i=n.getSym();n.isLineEdge()?n.getEdge().setCovered(r===L.INTERIOR):(n.isInResult()&&(r=L.EXTERIOR),i.isInResult()&&(r=L.INTERIOR))}},computeLabelling:function(t){Pn.prototype.computeLabelling.call(this,t),this.label=new gn(L.NONE);for(var e=this.iterator();e.hasNext();)for(var n=e.next(),i=n.getEdge(),r=i.getLabel(),s=0;2>s;s++){var o=r.getLocation(s);o!==L.INTERIOR&&o!==L.BOUNDARY||this.label.setLocation(s,L.INTERIOR)}},interfaces_:function(){return[]},getClass:function(){return bn}}),h(On,Nn),e(On.prototype,{createNode:function(t){return new yn(t,new bn)},interfaces_:function(){return[]},getClass:function(){return On}}),e(_n.prototype,{computeIntersections:function(t,e){this.mce.computeIntersectsForChain(this.chainIndex,t.mce,t.chainIndex,e)},interfaces_:function(){return[]},getClass:function(){return _n}}),e(Mn.prototype,{isDelete:function(){return this.eventType===Mn.DELETE},setDeleteEventIndex:function(t){this.deleteEventIndex=t},getObject:function(){return this.obj},compareTo:function(t){var e=t;return this.xValue<e.xValue?-1:this.xValue>e.xValue?1:this.eventType<e.eventType?-1:this.eventType>e.eventType?1:0},getInsertEvent:function(){return this.insertEvent},isInsert:function(){return this.eventType===Mn.INSERT},isSameLabel:function(t){return null===this.label?!1:this.label===t.label},getDeleteEventIndex:function(){return this.deleteEventIndex},interfaces_:function(){return[s]},getClass:function(){return Mn}}),Mn.INSERT=1,Mn.DELETE=2,e(Dn.prototype,{interfaces_:function(){return[]},getClass:function(){return Dn}}),e(An.prototype,{isTrivialIntersection:function(t,e,n,i){if(t===n&&1===this.li.getIntersectionNum()){if(An.isAdjacentSegments(e,i))return!0;if(t.isClosed()){var r=t.getNumPoints()-1;if(0===e&&i===r||0===i&&e===r)return!0}}return!1},getProperIntersectionPoint:function(){return this.properIntersectionPoint},setIsDoneIfProperInt:function(t){this.isDoneWhenProperInt=t},hasProperInteriorIntersection:function(){return this.hasProperInterior},isBoundaryPointInternal:function(t,e){for(var n=e.iterator();n.hasNext();){var i=n.next(),r=i.getCoordinate();if(t.isIntersection(r))return!0}return!1},hasProperIntersection:function(){return this.hasProper},hasIntersection:function(){return this._hasIntersection},isDone:function(){return this._isDone},isBoundaryPoint:function(t,e){return null===e?!1:this.isBoundaryPointInternal(t,e[0])?!0:!!this.isBoundaryPointInternal(t,e[1])},setBoundaryNodes:function(t,e){this.bdyNodes=new Array(2).fill(null),this.bdyNodes[0]=t,this.bdyNodes[1]=e},addIntersections:function(t,e,n,i){if(t===n&&e===i)return null;this.numTests++;var r=t.getCoordinates()[e],s=t.getCoordinates()[e+1],o=n.getCoordinates()[i],a=n.getCoordinates()[i+1];this.li.computeIntersection(r,s,o,a),this.li.hasIntersection()&&(this.recordIsolated&&(t.setIsolated(!1),n.setIsolated(!1)),this.numIntersections++,this.isTrivialIntersection(t,e,n,i)||(this._hasIntersection=!0,!this.includeProper&&this.li.isProper()||(t.addIntersections(this.li,e,0),n.addIntersections(this.li,i,1)),this.li.isProper()&&(this.properIntersectionPoint=this.li.getIntersection(0).copy(),this.hasProper=!0,this.isDoneWhenProperInt&&(this._isDone=!0),this.isBoundaryPoint(this.li,this.bdyNodes)||(this.hasProperInterior=!0))))},interfaces_:function(){return[]},getClass:function(){return An}}),An.isAdjacentSegments=function(t,e){return 1===Math.abs(t-e)},h(Fn,Dn),e(Fn.prototype,{prepareEvents:function(){ho.sort(this.events);for(var t=0;t<this.events.size();t++){var e=this.events.get(t);e.isDelete()&&e.getInsertEvent().setDeleteEventIndex(t)}},computeIntersections:function(){if(1===arguments.length){var t=arguments[0];this.nOverlaps=0,this.prepareEvents();for(var e=0;e<this.events.size();e++){var n=this.events.get(e);if(n.isInsert()&&this.processOverlaps(e,n.getDeleteEventIndex(),n,t),t.isDone())break}}else if(3===arguments.length)if(arguments[2]instanceof An&&R(arguments[0],y)&&R(arguments[1],y)){var i=arguments[0],r=arguments[1],s=arguments[2];this.addEdges(i,i),this.addEdges(r,r),this.computeIntersections(s)}else if("boolean"==typeof arguments[2]&&R(arguments[0],y)&&arguments[1]instanceof An){var o=arguments[0],a=arguments[1],u=arguments[2];u?this.addEdges(o,null):this.addEdges(o),this.computeIntersections(a)}},addEdge:function(t,e){for(var n=t.getMonotoneChainEdge(),i=n.getStartIndexes(),r=0;r<i.length-1;r++){var s=new _n(n,r),o=new Mn(e,n.getMinX(r),s);this.events.add(o),this.events.add(new Mn(n.getMaxX(r),o))}},processOverlaps:function(t,e,n,i){for(var r=n.getObject(),s=t;e>s;s++){var o=this.events.get(s);if(o.isInsert()){var a=o.getObject();n.isSameLabel(o)||(r.computeIntersections(a,i),this.nOverlaps++)}}},addEdges:function(){if(1===arguments.length)for(var t=arguments[0],e=t.iterator();e.hasNext();){var n=e.next();this.addEdge(n,n)}else if(2===arguments.length)for(var i=arguments[0],r=arguments[1],e=i.iterator();e.hasNext();){var n=e.next();this.addEdge(n,r)}},interfaces_:function(){return[]},getClass:function(){return Fn}}),e(Gn.prototype,{getMin:function(){return this.min},intersects:function(t,e){return!(this.min>e||this.max<t)},getMax:function(){return this.max},toString:function(){return se.toLineString(new g(this.min,0),new g(this.max,0))},interfaces_:function(){return[]},getClass:function(){return Gn}}),e(qn.prototype,{compare:function(t,e){var n=t,i=e,r=(n.min+n.max)/2,s=(i.min+i.max)/2;return s>r?-1:r>s?1:0},interfaces_:function(){return[a]},getClass:function(){return qn}}),Gn.NodeComparator=qn,h(Bn,Gn),e(Bn.prototype,{query:function(t,e,n){return this.intersects(t,e)?void n.visitItem(this.item):null},interfaces_:function(){return[]},getClass:function(){return Bn}}),h(zn,Gn),e(zn.prototype,{buildExtent:function(t,e){this.min=Math.min(t.min,e.min),this.max=Math.max(t.max,e.max)},query:function(t,e,n){return this.intersects(t,e)?(null!==this.node1&&this.node1.query(t,e,n),void(null!==this.node2&&this.node2.query(t,e,n))):null},interfaces_:function(){return[]},getClass:function(){return zn}}),e(Vn.prototype,{buildTree:function(){ho.sort(this.leaves,new IntervalRTreeNode.NodeComparator);for(var t=this.leaves,e=null,n=new I;;){if(this.buildLevel(t,n),1===n.size())return n.get(0);e=t,t=n,n=e}},insert:function(t,e,n){if(null!==this.root)throw new IllegalStateException("Index cannot be added to once it has been queried");this.leaves.add(new Bn(t,e,n))},query:function(t,e,n){this.init(),this.root.query(t,e,n)},buildRoot:function(){return null!==this.root?null:void(this.root=this.buildTree())},printNode:function(t){A.out.println(se.toLineString(new g(t.min,this.level),new g(t.max,this.level)))},init:function(){return null!==this.root?null:void this.buildRoot()},buildLevel:function(t,e){this.level++,e.clear();for(var n=0;n<t.size();n+=2){var i=t.get(n),r=n+1<t.size()?t.get(n):null;if(null===r)e.add(i);else{var s=new zn(t.get(n),t.get(n+1));e.add(s)}}},interfaces_:function(){return[]},getClass:function(){return Vn}}),e(kn.prototype,{filter:function(t){if(this.isForcedToLineString&&t instanceof bt){var e=t.getFactory().createLineString(t.getCoordinateSequence());return this.lines.add(e),null}t instanceof St&&this.lines.add(t)},setForceToLineString:function(t){this.isForcedToLineString=t},interfaces_:function(){return[q]},getClass:function(){return kn}}),kn.getGeometry=function(){if(1===arguments.length){var t=arguments[0];return t.getFactory().buildGeometry(kn.getLines(t))}if(2===arguments.length){var e=arguments[0],n=arguments[1];return e.getFactory().buildGeometry(kn.getLines(e,n))}},kn.getLines=function(){if(1===arguments.length){var t=arguments[0];return kn.getLines(t,!1)}if(2===arguments.length){if(R(arguments[0],v)&&R(arguments[1],v)){for(var e=arguments[0],n=arguments[1],i=e.iterator();i.hasNext();){var r=i.next();kn.getLines(r,n)}return n}if(arguments[0]instanceof B&&"boolean"==typeof arguments[1]){var s=arguments[0],o=arguments[1],a=new I;return s.apply(new kn(a,o)),a}if(arguments[0]instanceof B&&R(arguments[1],v)){var u=arguments[0],l=arguments[1];return u instanceof St?l.add(u):u.apply(new kn(l)),l}}else if(3===arguments.length){if("boolean"==typeof arguments[2]&&R(arguments[0],v)&&R(arguments[1],v)){for(var h=arguments[0],c=arguments[1],f=arguments[2],i=h.iterator();i.hasNext();){var r=i.next();kn.getLines(r,c,f)}return c}if("boolean"==typeof arguments[2]&&arguments[0]instanceof B&&R(arguments[1],v)){var g=arguments[0],d=arguments[1],p=arguments[2];return g.apply(new kn(d,p)),d}}},e(Yn.prototype,{visitItem:function(t){this.items.add(t)},getItems:function(){return this.items},interfaces_:function(){return[Ae]},getClass:function(){return Yn}}),e(Un.prototype,{locate:function(t){var e=new le(t),n=new Xn(e);return this.index.query(t.y,t.y,n),e.getLocation()},interfaces_:function(){return[Rn]},getClass:function(){return Un}}),e(Xn.prototype,{visitItem:function(t){var e=t;this.counter.countSegment(e.getCoordinate(0),e.getCoordinate(1))},interfaces_:function(){return[Ae]},getClass:function(){return Xn}}),e(Hn.prototype,{init:function(t){for(var e=kn.getLines(t),n=e.iterator();n.hasNext();){var i=n.next(),r=i.getCoordinates();this.addLine(r)}},addLine:function(t){for(var e=1;e<t.length;e++){var n=new ce(t[e-1],t[e]),i=Math.min(n.p0.y,n.p1.y),r=Math.max(n.p0.y,n.p1.y);this.index.insert(i,r,n)}},query:function(){if(2===arguments.length){var t=arguments[0],e=arguments[1],n=new Yn;return this.index.query(t,e,n),n.getItems()}if(3===arguments.length){var i=arguments[0],r=arguments[1],s=arguments[2];this.index.query(i,r,s)}},interfaces_:function(){return[]},getClass:function(){return Hn}}),Un.SegmentVisitor=Xn,Un.IntervalIndexedGeometry=Hn,e(Wn.prototype,{getSegmentIndex:function(){return this.segmentIndex},getCoordinate:function(){return this.coord},print:function(t){t.print(this.coord),t.print(" seg # = "+this.segmentIndex),t.println(" dist = "+this.dist)},compareTo:function(t){var e=t;return this.compare(e.segmentIndex,e.dist)},isEndPoint:function(t){return 0===this.segmentIndex&&0===this.dist?!0:this.segmentIndex===t},toString:function(){return this.coord+" seg # = "+this.segmentIndex+" dist = "+this.dist},getDistance:function(){return this.dist},compare:function(t,e){return this.segmentIndex<t?-1:this.segmentIndex>t?1:this.dist<e?-1:this.dist>e?1:0},interfaces_:function(){return[s]},getClass:function(){return Wn}}),e(jn.prototype,{print:function(t){t.println("Intersections:");for(var e=this.iterator();e.hasNext();){var n=e.next();n.print(t)}},iterator:function(){return this.nodeMap.values().iterator()},addSplitEdges:function(t){this.addEndpoints();for(var e=this.iterator(),n=e.next();e.hasNext();){var i=e.next(),r=this.createSplitEdge(n,i);t.add(r),n=i}},addEndpoints:function(){var t=this.edge.pts.length-1;this.add(this.edge.pts[0],0,0),this.add(this.edge.pts[t],t,0)},createSplitEdge:function(t,e){var n=e.segmentIndex-t.segmentIndex+2,i=this.edge.pts[e.segmentIndex],r=e.dist>0||!e.coord.equals2D(i);r||n--;var s=new Array(n).fill(null),o=0;s[o++]=new g(t.coord);for(var a=t.segmentIndex+1;a<=e.segmentIndex;a++)s[o++]=this.edge.pts[a];return r&&(s[o]=e.coord),new Jn(s,new gn(this.edge.label))},add:function(t,e,n){var i=new Wn(t,e,n),r=this.nodeMap.get(i);return null!==r?r:(this.nodeMap.put(i,i),i)},isIntersection:function(t){for(var e=this.iterator();e.hasNext();){var n=e.next();if(n.coord.equals(t))return!0}return!1},interfaces_:function(){return[]},getClass:function(){return jn}}),e(Kn.prototype,{getChainStartIndices:function(t){var e=0,n=new I;n.add(new b(e));do{var i=this.findChainEnd(t,e);n.add(new b(i)),e=i}while(e<t.length-1);var r=Kn.toIntArray(n);return r},findChainEnd:function(t,e){for(var n=Je.quadrant(t[e],t[e+1]),i=e+1;i<t.length;){var r=Je.quadrant(t[i-1],t[i]);if(r!==n)break;i++}return i-1},interfaces_:function(){return[]},getClass:function(){return Kn}}),Kn.toIntArray=function(t){for(var e=new Array(t.size()).fill(null),n=0;n<e.length;n++)e[n]=t.get(n).intValue();return e},e(Zn.prototype,{getCoordinates:function(){return this.pts},getMaxX:function(t){var e=this.pts[this.startIndex[t]].x,n=this.pts[this.startIndex[t+1]].x;return e>n?e:n},getMinX:function(t){var e=this.pts[this.startIndex[t]].x,n=this.pts[this.startIndex[t+1]].x;return n>e?e:n},computeIntersectsForChain:function(){if(4===arguments.length){var t=arguments[0],e=arguments[1],n=arguments[2],i=arguments[3];this.computeIntersectsForChain(this.startIndex[t],this.startIndex[t+1],e,e.startIndex[n],e.startIndex[n+1],i)}else if(6===arguments.length){var r=arguments[0],s=arguments[1],o=arguments[2],a=arguments[3],u=arguments[4],l=arguments[5],h=this.pts[r],c=this.pts[s],f=o.pts[a],g=o.pts[u];if(s-r===1&&u-a===1)return l.addIntersections(this.e,r,o.e,a),null;if(this.env1.init(h,c),this.env2.init(f,g),!this.env1.intersects(this.env2))return null;var d=Math.trunc((r+s)/2),p=Math.trunc((a+u)/2);d>r&&(p>a&&this.computeIntersectsForChain(r,d,o,a,p,l),u>p&&this.computeIntersectsForChain(r,d,o,p,u,l)),s>d&&(p>a&&this.computeIntersectsForChain(d,s,o,a,p,l),u>p&&this.computeIntersectsForChain(d,s,o,p,u,l))}},getStartIndexes:function(){return this.startIndex},computeIntersects:function(t,e){for(var n=0;n<this.startIndex.length-1;n++)for(var i=0;i<t.startIndex.length-1;i++)this.computeIntersectsForChain(n,t,i,e)},interfaces_:function(){return[]},getClass:function(){return Zn}}),e(Qn.prototype,{getDepth:function(t,e){return this.depth[t][e]},setDepth:function(t,e,n){this.depth[t][e]=n},isNull:function(){if(0===arguments.length){for(var t=0;2>t;t++)for(var e=0;3>e;e++)if(this.depth[t][e]!==Qn.NULL_VALUE)return!1;return!0}if(1===arguments.length){var n=arguments[0];return this.depth[n][1]===Qn.NULL_VALUE}if(2===arguments.length){var i=arguments[0],r=arguments[1];return this.depth[i][r]===Qn.NULL_VALUE}},normalize:function(){for(var t=0;2>t;t++)if(!this.isNull(t)){var e=this.depth[t][1];this.depth[t][2]<e&&(e=this.depth[t][2]),0>e&&(e=0);for(var n=1;3>n;n++){var i=0;this.depth[t][n]>e&&(i=1),this.depth[t][n]=i}}},getDelta:function(t){return this.depth[t][cn.RIGHT]-this.depth[t][cn.LEFT]},getLocation:function(t,e){return this.depth[t][e]<=0?L.EXTERIOR:L.INTERIOR},toString:function(){return"A: "+this.depth[0][1]+","+this.depth[0][2]+" B: "+this.depth[1][1]+","+this.depth[1][2]},add:function(){if(1===arguments.length)for(var t=arguments[0],e=0;2>e;e++)for(var n=1;3>n;n++){var i=t.getLocation(e,n);i!==L.EXTERIOR&&i!==L.INTERIOR||(this.isNull(e,n)?this.depth[e][n]=Qn.depthAtLocation(i):this.depth[e][n]+=Qn.depthAtLocation(i))}else if(3===arguments.length){var r=arguments[0],s=arguments[1],o=arguments[2];o===L.INTERIOR&&this.depth[r][s]++}},interfaces_:function(){return[]},getClass:function(){return Qn}}),Qn.depthAtLocation=function(t){return t===L.EXTERIOR?0:t===L.INTERIOR?1:Qn.NULL_VALUE},Qn.NULL_VALUE=-1,h(Jn,mn),e(Jn.prototype,{getDepth:function(){return this.depth},getCollapsedEdge:function(){var t=new Array(2).fill(null);t[0]=this.pts[0],t[1]=this.pts[1];var e=new Jn(t,gn.toLineLabel(this.label));return e},isIsolated:function(){return this._isIsolated},getCoordinates:function(){return this.pts},setIsolated:function(t){this._isIsolated=t},setName:function(t){this.name=t},equals:function(t){if(!(t instanceof Jn))return!1;var e=t;if(this.pts.length!==e.pts.length)return!1;for(var n=!0,i=!0,r=this.pts.length,s=0;s<this.pts.length;s++)if(this.pts[s].equals2D(e.pts[s])||(n=!1),this.pts[s].equals2D(e.pts[--r])||(i=!1),!n&&!i)return!1;return!0},getCoordinate:function(){if(0===arguments.length)return this.pts.length>0?this.pts[0]:null;if(1===arguments.length){var t=arguments[0];return this.pts[t]}},print:function(t){t.print("edge "+this.name+": "),t.print("LINESTRING (");for(var e=0;e<this.pts.length;e++)e>0&&t.print(","),t.print(this.pts[e].x+" "+this.pts[e].y);t.print(")  "+this.label+" "+this.depthDelta)},computeIM:function(t){Jn.updateIM(this.label,t)},isCollapsed:function(){return this.label.isArea()?3!==this.pts.length?!1:!!this.pts[0].equals(this.pts[2]):!1},isClosed:function(){return this.pts[0].equals(this.pts[this.pts.length-1])},getMaximumSegmentIndex:function(){return this.pts.length-1},getDepthDelta:function(){return this.depthDelta},getNumPoints:function(){return this.pts.length},printReverse:function(t){t.print("edge "+this.name+": ");for(var e=this.pts.length-1;e>=0;e--)t.print(this.pts[e]+" ");t.println("")},getMonotoneChainEdge:function(){return null===this.mce&&(this.mce=new Zn(this)),this.mce},getEnvelope:function(){if(null===this.env){this.env=new C;for(var t=0;t<this.pts.length;t++)this.env.expandToInclude(this.pts[t])}return this.env},addIntersection:function(t,e,n,i){var r=new g(t.getIntersection(i)),s=e,o=t.getEdgeDistance(n,i),a=s+1;if(a<this.pts.length){var u=this.pts[a];r.equals2D(u)&&(s=a,o=0)}this.eiList.add(r,s,o)},toString:function(){var t=new P;t.append("edge "+this.name+": "),t.append("LINESTRING (");for(var e=0;e<this.pts.length;e++)e>0&&t.append(","),t.append(this.pts[e].x+" "+this.pts[e].y);return t.append(")  "+this.label+" "+this.depthDelta),t.toString()},isPointwiseEqual:function(t){if(this.pts.length!==t.pts.length)return!1;for(var e=0;e<this.pts.length;e++)if(!this.pts[e].equals2D(t.pts[e]))return!1;return!0},setDepthDelta:function(t){this.depthDelta=t},getEdgeIntersectionList:function(){return this.eiList},addIntersections:function(t,e,n){for(var i=0;i<t.getIntersectionNum();i++)this.addIntersection(t,e,n,i)},interfaces_:function(){return[]},getClass:function(){return Jn}}),Jn.updateIM=function(){if(2!==arguments.length)return mn.prototype.updateIM.apply(this,arguments);var t=arguments[0],e=arguments[1];e.setAtLeastIfValid(t.getLocation(0,cn.ON),t.getLocation(1,cn.ON),1),t.isArea()&&(e.setAtLeastIfValid(t.getLocation(0,cn.LEFT),t.getLocation(1,cn.LEFT),2),e.setAtLeastIfValid(t.getLocation(0,cn.RIGHT),t.getLocation(1,cn.RIGHT),2))},h($n,Cn),e($n.prototype,{insertBoundaryPoint:function(t,e){var n=this.nodes.addNode(e),i=n.getLabel(),r=1,s=L.NONE;s=i.getLocation(t,cn.ON),s===L.BOUNDARY&&r++;var o=$n.determineBoundary(this.boundaryNodeRule,r);i.setLocation(t,o)},computeSelfNodes:function(){if(2===arguments.length){var t=arguments[0],e=arguments[1];return this.computeSelfNodes(t,e,!1)}if(3===arguments.length){var n=arguments[0],i=arguments[1],r=arguments[2],s=new An(n,!0,!1);s.setIsDoneIfProperInt(r);var o=this.createEdgeSetIntersector(),a=this.parentGeom instanceof bt||this.parentGeom instanceof Tt||this.parentGeom instanceof Ot,u=i||!a;return o.computeIntersections(this.edges,s,u),this.addSelfIntersectionNodes(this.argIndex),s}},computeSplitEdges:function(t){for(var e=this.edges.iterator();e.hasNext();){var n=e.next();n.eiList.addSplitEdges(t)}},computeEdgeIntersections:function(t,e,n){var i=new An(e,n,!0);i.setBoundaryNodes(this.getBoundaryNodes(),t.getBoundaryNodes());var r=this.createEdgeSetIntersector();return r.computeIntersections(this.edges,t.edges,i),i},getGeometry:function(){return this.parentGeom},getBoundaryNodeRule:function(){return this.boundaryNodeRule},hasTooFewPoints:function(){return this._hasTooFewPoints},addPoint:function(){if(arguments[0]instanceof Lt){var t=arguments[0],e=t.getCoordinate();this.insertPoint(this.argIndex,e,L.INTERIOR)}else if(arguments[0]instanceof g){var n=arguments[0];this.insertPoint(this.argIndex,n,L.INTERIOR)}},addPolygon:function(t){this.addPolygonRing(t.getExteriorRing(),L.EXTERIOR,L.INTERIOR);for(var e=0;e<t.getNumInteriorRing();e++){var n=t.getInteriorRingN(e);this.addPolygonRing(n,L.INTERIOR,L.EXTERIOR)}},addEdge:function(t){this.insertEdge(t);var e=t.getCoordinates();this.insertPoint(this.argIndex,e[0],L.BOUNDARY),this.insertPoint(this.argIndex,e[e.length-1],L.BOUNDARY)},addLineString:function(t){var e=H.removeRepeatedPoints(t.getCoordinates());if(e.length<2)return this._hasTooFewPoints=!0,this.invalidPoint=e[0],null;var n=new Jn(e,new gn(this.argIndex,L.INTERIOR));this.lineEdgeMap.put(t,n),this.insertEdge(n),f.isTrue(e.length>=2,"found LineString with single point"),this.insertBoundaryPoint(this.argIndex,e[0]),this.insertBoundaryPoint(this.argIndex,e[e.length-1])},getInvalidPoint:function(){return this.invalidPoint},getBoundaryPoints:function(){for(var t=this.getBoundaryNodes(),e=new Array(t.size()).fill(null),n=0,i=t.iterator();i.hasNext();){var r=i.next();e[n++]=r.getCoordinate().copy()}return e},getBoundaryNodes:function(){return null===this.boundaryNodes&&(this.boundaryNodes=this.nodes.getBoundaryNodes(this.argIndex)),this.boundaryNodes},addSelfIntersectionNode:function(t,e,n){return this.isBoundaryNode(t,e)?null:void(n===L.BOUNDARY&&this.useBoundaryDeterminationRule?this.insertBoundaryPoint(t,e):this.insertPoint(t,e,n))},addPolygonRing:function(t,e,n){if(t.isEmpty())return null;var i=H.removeRepeatedPoints(t.getCoordinates());if(i.length<4)return this._hasTooFewPoints=!0,this.invalidPoint=i[0],null;var r=e,s=n;he.isCCW(i)&&(r=n,s=e);var o=new Jn(i,new gn(this.argIndex,L.BOUNDARY,r,s));this.lineEdgeMap.put(t,o),this.insertEdge(o),this.insertPoint(this.argIndex,i[0],L.BOUNDARY)},insertPoint:function(t,e,n){var i=this.nodes.addNode(e),r=i.getLabel();null===r?i.label=new gn(t,n):r.setLocation(t,n)},createEdgeSetIntersector:function(){return new Fn},addSelfIntersectionNodes:function(t){for(var e=this.edges.iterator();e.hasNext();)for(var n=e.next(),i=n.getLabel().getLocation(t),r=n.eiList.iterator();r.hasNext();){var s=r.next();this.addSelfIntersectionNode(t,s.coord,i)}},add:function(){if(1!==arguments.length)return Cn.prototype.add.apply(this,arguments);var t=arguments[0];if(t.isEmpty())return null;if(t instanceof Ot&&(this.useBoundaryDeterminationRule=!1),t instanceof Tt)this.addPolygon(t);else if(t instanceof St)this.addLineString(t);else if(t instanceof Lt)this.addPoint(t);else if(t instanceof Pt)this.addCollection(t);else if(t instanceof gt)this.addCollection(t);else if(t instanceof Ot)this.addCollection(t);else{if(!(t instanceof ft))throw new UnsupportedOperationException(t.getClass().getName());this.addCollection(t)}},addCollection:function(t){for(var e=0;e<t.getNumGeometries();e++){var n=t.getGeometryN(e);this.add(n)}},locate:function(t){return R(this.parentGeom,Rt)&&this.parentGeom.getNumGeometries()>50?(null===this.areaPtLocator&&(this.areaPtLocator=new Un(this.parentGeom)),this.areaPtLocator.locate(t)):this.ptLocator.locate(t,this.parentGeom)},findEdge:function(){if(1===arguments.length){var t=arguments[0];return this.lineEdgeMap.get(t)}return Cn.prototype.findEdge.apply(this,arguments)},interfaces_:function(){return[]},getClass:function(){return $n}}),$n.determineBoundary=function(t,e){return t.isInBoundary(e)?L.BOUNDARY:L.INTERIOR},e(ti.prototype,{getArgGeometry:function(t){return this.arg[t].getGeometry()},setComputationPrecision:function(t){this.resultPrecisionModel=t,this.li.setPrecisionModel(this.resultPrecisionModel)},interfaces_:function(){return[]},getClass:function(){return ti}}),e(ei.prototype,{compareTo:function(t){var e=t,n=ei.compareOriented(this.pts,this._orientation,e.pts,e._orientation);return n},interfaces_:function(){return[s]},getClass:function(){return ei}}),ei.orientation=function(t){return 1===H.increasingDirection(t)},ei.compareOriented=function(t,e,n,i){for(var r=e?1:-1,s=i?1:-1,o=e?t.length:-1,a=i?n.length:-1,u=e?0:t.length-1,l=i?0:n.length-1;;){var h=t[u].compareTo(n[l]);if(0!==h)return h;u+=r,l+=s;var c=u===o,f=l===a;if(c&&!f)return-1;if(!c&&f)return 1;if(c&&f)return 0}},e(ni.prototype,{print:function(t){t.print("MULTILINESTRING ( ");for(var e=0;e<this.edges.size();e++){var n=this.edges.get(e);e>0&&t.print(","),t.print("(");for(var i=n.getCoordinates(),r=0;r<i.length;r++)r>0&&t.print(","),t.print(i[r].x+" "+i[r].y);t.println(")")}t.print(")  ")},addAll:function(t){for(var e=t.iterator();e.hasNext();)this.add(e.next())},findEdgeIndex:function(t){for(var e=0;e<this.edges.size();e++)if(this.edges.get(e).equals(t))return e;return-1},iterator:function(){return this.edges.iterator()},getEdges:function(){return this.edges},get:function(t){return this.edges.get(t)},findEqualEdge:function(t){var e=new ei(t.getCoordinates()),n=this.ocaMap.get(e);return n},add:function(t){this.edges.add(t);var e=new ei(t.getCoordinates());this.ocaMap.put(e,t)},interfaces_:function(){return[]},getClass:function(){return ni}}),h(ii,ti),e(ii.prototype,{insertUniqueEdge:function(t){var e=this.edgeList.findEqualEdge(t);if(null!==e){var n=e.getLabel(),i=t.getLabel();e.isPointwiseEqual(t)||(i=new gn(t.getLabel()),i.flip());var r=e.getDepth();r.isNull()&&r.add(n),r.add(i),n.merge(i)}else this.edgeList.add(t)},getGraph:function(){return this.graph},cancelDuplicateResultEdges:function(){for(var t=this.graph.getEdgeEnds().iterator();t.hasNext();){var e=t.next(),n=e.getSym();e.isInResult()&&n.isInResult()&&(e.setInResult(!1),n.setInResult(!1))}},isCoveredByLA:function(t){return this.isCovered(t,this.resultLineList)?!0:!!this.isCovered(t,this.resultPolyList)},computeGeometry:function(t,e,n,i){var r=new I;return r.addAll(t),r.addAll(e),r.addAll(n),r.isEmpty()?ii.createEmptyResult(i,this.arg[0].getGeometry(),this.arg[1].getGeometry(),this.geomFact):this.geomFact.buildGeometry(r)},mergeSymLabels:function(){for(var t=this.graph.getNodes().iterator();t.hasNext();){var e=t.next();e.getEdges().mergeSymLabels()}},isCovered:function(t,e){for(var n=e.iterator();n.hasNext();){var i=n.next(),r=this.ptLocator.locate(t,i);if(r!==L.EXTERIOR)return!0}return!1},replaceCollapsedEdges:function(){for(var t=new I,e=this.edgeList.iterator();e.hasNext();){var n=e.next();n.isCollapsed()&&(e.remove(),t.add(n.getCollapsedEdge()))}this.edgeList.addAll(t)},updateNodeLabelling:function(){for(var t=this.graph.getNodes().iterator();t.hasNext();){var e=t.next(),n=e.getEdges().getLabel();e.getLabel().merge(n)}},getResultGeometry:function(t){return this.computeOverlay(t),this.resultGeom},insertUniqueEdges:function(t){for(var e=t.iterator();e.hasNext();){var n=e.next();this.insertUniqueEdge(n)}},computeOverlay:function(t){this.copyPoints(0),this.copyPoints(1),this.arg[0].computeSelfNodes(this.li,!1),this.arg[1].computeSelfNodes(this.li,!1),this.arg[0].computeEdgeIntersections(this.arg[1],this.li,!0);var e=new I;this.arg[0].computeSplitEdges(e),this.arg[1].computeSplitEdges(e);this.insertUniqueEdges(e),this.computeLabelsFromDepths(),this.replaceCollapsedEdges(),ln.checkValid(this.edgeList.getEdges()),this.graph.addEdges(this.edgeList.getEdges()),this.computeLabelling(),this.labelIncompleteNodes(),this.findResultAreaEdges(t),this.cancelDuplicateResultEdges();var n=new Sn(this.geomFact);n.add(this.graph),this.resultPolyList=n.getPolygons();var i=new wn(this,this.geomFact,this.ptLocator);this.resultLineList=i.build(t);var r=new Ln(this,this.geomFact,this.ptLocator);this.resultPointList=r.build(t),
this.resultGeom=this.computeGeometry(this.resultPointList,this.resultLineList,this.resultPolyList,t)},labelIncompleteNode:function(t,e){var n=this.ptLocator.locate(t.getCoordinate(),this.arg[e].getGeometry());t.getLabel().setLocation(e,n)},copyPoints:function(t){for(var e=this.arg[t].getNodeIterator();e.hasNext();){var n=e.next(),i=this.graph.addNode(n.getCoordinate());i.setLabel(t,n.getLabel().getLocation(t))}},findResultAreaEdges:function(t){for(var e=this.graph.getEdgeEnds().iterator();e.hasNext();){var n=e.next(),i=n.getLabel();i.isArea()&&!n.isInteriorAreaEdge()&&ii.isResultOfOp(i.getLocation(0,cn.RIGHT),i.getLocation(1,cn.RIGHT),t)&&n.setInResult(!0)}},computeLabelsFromDepths:function(){for(var t=this.edgeList.iterator();t.hasNext();){var e=t.next(),n=e.getLabel(),i=e.getDepth();if(!i.isNull()){i.normalize();for(var r=0;2>r;r++)n.isNull(r)||!n.isArea()||i.isNull(r)||(0===i.getDelta(r)?n.toLine(r):(f.isTrue(!i.isNull(r,cn.LEFT),"depth of LEFT side has not been initialized"),n.setLocation(r,cn.LEFT,i.getLocation(r,cn.LEFT)),f.isTrue(!i.isNull(r,cn.RIGHT),"depth of RIGHT side has not been initialized"),n.setLocation(r,cn.RIGHT,i.getLocation(r,cn.RIGHT))))}}},computeLabelling:function(){for(var t=this.graph.getNodes().iterator();t.hasNext();){var e=t.next();e.getEdges().computeLabelling(this.arg)}this.mergeSymLabels(),this.updateNodeLabelling()},labelIncompleteNodes:function(){for(var t=0,e=this.graph.getNodes().iterator();e.hasNext();){var n=e.next(),i=n.getLabel();n.isIsolated()&&(t++,i.isNull(0)?this.labelIncompleteNode(n,0):this.labelIncompleteNode(n,1)),n.getEdges().updateLabelling(i)}},isCoveredByA:function(t){return!!this.isCovered(t,this.resultPolyList)},interfaces_:function(){return[]},getClass:function(){return ii}}),ii.overlayOp=function(t,e,n){var i=new ii(t,e),r=i.getResultGeometry(n);return r},ii.intersection=function(t,e){if(t.isEmpty()||e.isEmpty())return ii.createEmptyResult(ii.INTERSECTION,t,e,t.getFactory());if(t.isGeometryCollection()){var n=e;return hn.map(t,{interfaces_:function(){return[MapOp]},map:function(t){return t.intersection(n)}})}return t.checkNotGeometryCollection(t),t.checkNotGeometryCollection(e),si.overlayOp(t,e,ii.INTERSECTION)},ii.symDifference=function(t,e){if(t.isEmpty()||e.isEmpty()){if(t.isEmpty()&&e.isEmpty())return ii.createEmptyResult(ii.SYMDIFFERENCE,t,e,t.getFactory());if(t.isEmpty())return e.copy();if(e.isEmpty())return t.copy()}return t.checkNotGeometryCollection(t),t.checkNotGeometryCollection(e),si.overlayOp(t,e,ii.SYMDIFFERENCE)},ii.resultDimension=function(t,e,n){var i=e.getDimension(),r=n.getDimension(),s=-1;switch(t){case ii.INTERSECTION:s=Math.min(i,r);break;case ii.UNION:s=Math.max(i,r);break;case ii.DIFFERENCE:s=i;break;case ii.SYMDIFFERENCE:s=Math.max(i,r)}return s},ii.createEmptyResult=function(t,e,n,i){var r=null;switch(ii.resultDimension(t,e,n)){case-1:r=i.createGeometryCollection(new Array(0).fill(null));break;case 0:r=i.createPoint();break;case 1:r=i.createLineString();break;case 2:r=i.createPolygon()}return r},ii.difference=function(t,e){return t.isEmpty()?ii.createEmptyResult(ii.DIFFERENCE,t,e,t.getFactory()):e.isEmpty()?t.copy():(t.checkNotGeometryCollection(t),t.checkNotGeometryCollection(e),si.overlayOp(t,e,ii.DIFFERENCE))},ii.isResultOfOp=function(){if(2===arguments.length){var t=arguments[0],e=arguments[1],n=t.getLocation(0),i=t.getLocation(1);return ii.isResultOfOp(n,i,e)}if(3===arguments.length){var r=arguments[0],s=arguments[1],o=arguments[2];switch(r===L.BOUNDARY&&(r=L.INTERIOR),s===L.BOUNDARY&&(s=L.INTERIOR),o){case ii.INTERSECTION:return r===L.INTERIOR&&s===L.INTERIOR;case ii.UNION:return r===L.INTERIOR||s===L.INTERIOR;case ii.DIFFERENCE:return r===L.INTERIOR&&s!==L.INTERIOR;case ii.SYMDIFFERENCE:return r===L.INTERIOR&&s!==L.INTERIOR||r!==L.INTERIOR&&s===L.INTERIOR}return!1}},ii.INTERSECTION=1,ii.UNION=2,ii.DIFFERENCE=3,ii.SYMDIFFERENCE=4,e(ri.prototype,{selfSnap:function(t){var e=new Ie(t),n=e.snapTo(t,this.snapTolerance);return n},removeCommonBits:function(t){this.cbr=new Se,this.cbr.add(t[0]),this.cbr.add(t[1]);var e=new Array(2).fill(null);return e[0]=this.cbr.removeCommonBits(t[0].copy()),e[1]=this.cbr.removeCommonBits(t[1].copy()),e},prepareResult:function(t){return this.cbr.addCommonBits(t),t},getResultGeometry:function(t){var e=this.snap(this.geom),n=ii.overlayOp(e[0],e[1],t);return this.prepareResult(n)},checkValid:function(t){t.isValid()||A.out.println("Snapped geometry is invalid")},computeSnapTolerance:function(){this.snapTolerance=Ie.computeOverlaySnapTolerance(this.geom[0],this.geom[1])},snap:function(t){var e=this.removeCommonBits(t),n=Ie.snap(e[0],e[1],this.snapTolerance);return n},interfaces_:function(){return[]},getClass:function(){return ri}}),ri.overlayOp=function(t,e,n){var i=new ri(t,e);return i.getResultGeometry(n)},ri.union=function(t,e){return ri.overlayOp(t,e,ii.UNION)},ri.intersection=function(t,e){return ri.overlayOp(t,e,ii.INTERSECTION)},ri.symDifference=function(t,e){return ri.overlayOp(t,e,ii.SYMDIFFERENCE)},ri.difference=function(t,e){return ri.overlayOp(t,e,ii.DIFFERENCE)},e(si.prototype,{getResultGeometry:function(t){var e=null,n=!1,i=null;try{e=ii.overlayOp(this.geom[0],this.geom[1],t);var r=!0;r&&(n=!0)}catch(t){if(!(t instanceof l))throw t;i=t}finally{}if(!n)try{e=ri.overlayOp(this.geom[0],this.geom[1],t)}catch(t){throw t instanceof l?i:t}finally{}return e},interfaces_:function(){return[]},getClass:function(){return si}}),si.overlayOp=function(t,e,n){var i=new si(t,e);return i.getResultGeometry(n)},si.union=function(t,e){return si.overlayOp(t,e,ii.UNION)},si.intersection=function(t,e){return si.overlayOp(t,e,ii.INTERSECTION)},si.symDifference=function(t,e){return si.overlayOp(t,e,ii.SYMDIFFERENCE)},si.difference=function(t,e){return si.overlayOp(t,e,ii.DIFFERENCE)},e(oi.prototype,{addPolygon:function(t){if(t.isEmpty())return null;var e=null,n=0,i=this.horizontalBisector(t);if(0===i.getLength())n=0,e=i.getCoordinate();else{var r=si.overlayOp(i,t,ii.INTERSECTION),s=this.widestGeometry(r);n=s.getEnvelopeInternal().getWidth(),e=oi.centre(s.getEnvelopeInternal())}(null===this.interiorPoint||n>this.maxWidth)&&(this.interiorPoint=e,this.maxWidth=n)},getInteriorPoint:function(){return this.interiorPoint},widestGeometry:function t(){if(arguments[0]instanceof ft){var e=arguments[0];if(e.isEmpty())return e;for(var t=e.getGeometryN(0),n=1;n<e.getNumGeometries();n++)e.getGeometryN(n).getEnvelopeInternal().getWidth()>t.getEnvelopeInternal().getWidth()&&(t=e.getGeometryN(n));return t}if(arguments[0]instanceof B){var i=arguments[0];return i instanceof ft?this.widestGeometry(i):i}},horizontalBisector:function(t){var e=t.getEnvelopeInternal(),n=ai.getBisectorY(t);return this.factory.createLineString([new g(e.getMinX(),n),new g(e.getMaxX(),n)])},add:function(t){if(t instanceof Tt)this.addPolygon(t);else if(t instanceof ft)for(var e=t,n=0;n<e.getNumGeometries();n++)this.add(e.getGeometryN(n))},interfaces_:function(){return[]},getClass:function(){return oi}}),oi.centre=function(t){return new g(oi.avg(t.getMinX(),t.getMaxX()),oi.avg(t.getMinY(),t.getMaxY()))},oi.avg=function(t,e){return(t+e)/2},e(ai.prototype,{updateInterval:function(t){t<=this.centreY?t>this.loY&&(this.loY=t):t>this.centreY&&t<this.hiY&&(this.hiY=t)},getBisectorY:function(){this.process(this.poly.getExteriorRing());for(var t=0;t<this.poly.getNumInteriorRing();t++)this.process(this.poly.getInteriorRingN(t));var e=oi.avg(this.hiY,this.loY);return e},process:function(t){for(var e=t.getCoordinateSequence(),n=0;n<e.size();n++){var i=e.getY(n);this.updateInterval(i)}},interfaces_:function(){return[]},getClass:function(){return ai}}),ai.getBisectorY=function(t){var e=new ai(t);return e.getBisectorY()},oi.SafeBisectorFinder=ai,e(ui.prototype,{addEndpoints:function(){if(arguments[0]instanceof B){var t=arguments[0];if(t instanceof St)this.addEndpoints(t.getCoordinates());else if(t instanceof ft)for(var e=t,n=0;n<e.getNumGeometries();n++)this.addEndpoints(e.getGeometryN(n))}else if(arguments[0]instanceof Array){var i=arguments[0];this.add(i[0]),this.add(i[i.length-1])}},getInteriorPoint:function(){return this.interiorPoint},addInterior:function(){if(arguments[0]instanceof B){var t=arguments[0];if(t instanceof St)this.addInterior(t.getCoordinates());else if(t instanceof ft)for(var e=t,n=0;n<e.getNumGeometries();n++)this.addInterior(e.getGeometryN(n))}else if(arguments[0]instanceof Array)for(var i=arguments[0],n=1;n<i.length-1;n++)this.add(i[n])},add:function(t){var e=t.distance(this.centroid);e<this.minDistance&&(this.interiorPoint=new g(t),this.minDistance=e)},interfaces_:function(){return[]},getClass:function(){return ui}}),e(li.prototype,{getInteriorPoint:function(){return this.interiorPoint},add:function(){if(arguments[0]instanceof B){var t=arguments[0];if(t instanceof Lt)this.add(t.getCoordinate());else if(t instanceof ft)for(var e=t,n=0;n<e.getNumGeometries();n++)this.add(e.getGeometryN(n))}else if(arguments[0]instanceof g){var i=arguments[0],r=i.distance(this.centroid);r<this.minDistance&&(this.interiorPoint=new g(i),this.minDistance=r)}},interfaces_:function(){return[]},getClass:function(){return li}}),e(hi.prototype,{interfaces_:function(){return[]},getClass:function(){return hi}}),hi.toDegrees=function(t){return 180*t/Math.PI},hi.normalize=function(t){for(;t>Math.PI;)t-=hi.PI_TIMES_2;for(;t<=-Math.PI;)t+=hi.PI_TIMES_2;return t},hi.angle=function(){if(1===arguments.length){var t=arguments[0];return Math.atan2(t.y,t.x)}if(2===arguments.length){var e=arguments[0],n=arguments[1],i=n.x-e.x,r=n.y-e.y;return Math.atan2(r,i)}},hi.isAcute=function(t,e,n){var i=t.x-e.x,r=t.y-e.y,s=n.x-e.x,o=n.y-e.y,a=i*s+r*o;return a>0},hi.isObtuse=function(t,e,n){var i=t.x-e.x,r=t.y-e.y,s=n.x-e.x,o=n.y-e.y,a=i*s+r*o;return 0>a},hi.interiorAngle=function(t,e,n){var i=hi.angle(e,t),r=hi.angle(e,n);return Math.abs(r-i)},hi.normalizePositive=function(t){if(0>t){for(;0>t;)t+=hi.PI_TIMES_2;t>=hi.PI_TIMES_2&&(t=0)}else{for(;t>=hi.PI_TIMES_2;)t-=hi.PI_TIMES_2;0>t&&(t=0)}return t},hi.angleBetween=function(t,e,n){var i=hi.angle(e,t),r=hi.angle(e,n);return hi.diff(i,r)},hi.diff=function(t,e){var n=null;return n=e>t?e-t:t-e,n>Math.PI&&(n=2*Math.PI-n),n},hi.toRadians=function(t){return t*Math.PI/180},hi.getTurn=function(t,e){var n=Math.sin(e-t);return n>0?hi.COUNTERCLOCKWISE:0>n?hi.CLOCKWISE:hi.NONE},hi.angleBetweenOriented=function(t,e,n){var i=hi.angle(e,t),r=hi.angle(e,n),s=r-i;return s<=-Math.PI?s+hi.PI_TIMES_2:s>Math.PI?s-hi.PI_TIMES_2:s},hi.PI_TIMES_2=2*Math.PI,hi.PI_OVER_2=Math.PI/2,hi.PI_OVER_4=Math.PI/4,hi.COUNTERCLOCKWISE=he.COUNTERCLOCKWISE,hi.CLOCKWISE=he.CLOCKWISE,hi.NONE=he.COLLINEAR,e(ci.prototype,{area:function(){return ci.area(this.p0,this.p1,this.p2)},signedArea:function(){return ci.signedArea(this.p0,this.p1,this.p2)},interpolateZ:function(t){if(null===t)throw new i("Supplied point is null.");return ci.interpolateZ(t,this.p0,this.p1,this.p2)},longestSideLength:function(){return ci.longestSideLength(this.p0,this.p1,this.p2)},isAcute:function(){return ci.isAcute(this.p0,this.p1,this.p2)},circumcentre:function(){return ci.circumcentre(this.p0,this.p1,this.p2)},area3D:function(){return ci.area3D(this.p0,this.p1,this.p2)},centroid:function(){return ci.centroid(this.p0,this.p1,this.p2)},inCentre:function(){return ci.inCentre(this.p0,this.p1,this.p2)},interfaces_:function(){return[]},getClass:function(){return ci}}),ci.area=function(t,e,n){return Math.abs(((n.x-t.x)*(e.y-t.y)-(e.x-t.x)*(n.y-t.y))/2)},ci.signedArea=function(t,e,n){return((n.x-t.x)*(e.y-t.y)-(e.x-t.x)*(n.y-t.y))/2},ci.det=function(t,e,n,i){return t*i-e*n},ci.interpolateZ=function(t,e,n,i){var r=e.x,s=e.y,o=n.x-r,a=i.x-r,u=n.y-s,l=i.y-s,h=o*l-a*u,c=t.x-r,f=t.y-s,g=(l*c-a*f)/h,d=(-u*c+o*f)/h,p=e.z+g*(n.z-e.z)+d*(i.z-e.z);return p},ci.longestSideLength=function(t,e,n){var i=t.distance(e),r=e.distance(n),s=n.distance(t),o=i;return r>o&&(o=r),s>o&&(o=s),o},ci.isAcute=function(t,e,n){return hi.isAcute(t,e,n)&&hi.isAcute(e,n,t)?!!hi.isAcute(n,t,e):!1},ci.circumcentre=function(t,e,n){var i=n.x,r=n.y,s=t.x-i,o=t.y-r,a=e.x-i,u=e.y-r,l=2*ci.det(s,o,a,u),h=ci.det(o,s*s+o*o,u,a*a+u*u),c=ci.det(s,s*s+o*o,a,a*a+u*u),f=i-h/l,d=r+c/l;return new g(f,d)},ci.perpendicularBisector=function(t,e){var n=e.x-t.x,i=e.y-t.y,r=new F(t.x+n/2,t.y+i/2,1),s=new F(t.x-i+n/2,t.y+n+i/2,1);return new F(r,s)},ci.angleBisector=function(t,e,n){var i=e.distance(t),r=e.distance(n),s=i/(i+r),o=n.x-t.x,a=n.y-t.y,u=new g(t.x+s*o,t.y+s*a);return u},ci.area3D=function(t,e,n){var i=e.x-t.x,r=e.y-t.y,s=e.z-t.z,o=n.x-t.x,a=n.y-t.y,u=n.z-t.z,l=r*u-s*a,h=s*o-i*u,c=i*a-r*o,f=l*l+h*h+c*c,g=Math.sqrt(f)/2;return g},ci.centroid=function(t,e,n){var i=(t.x+e.x+n.x)/3,r=(t.y+e.y+n.y)/3;return new g(i,r)},ci.inCentre=function(t,e,n){var i=e.distance(n),r=t.distance(n),s=t.distance(e),o=i+r+s,a=(i*t.x+r*e.x+s*n.x)/o,u=(i*t.y+r*e.y+s*n.y)/o;return new g(a,u)},e(fi.prototype,{getRadius:function(){return this.compute(),this.radius},getDiameter:function(){switch(this.compute(),this.extremalPts.length){case 0:return this.input.getFactory().createLineString();case 1:return this.input.getFactory().createPoint(this.centre)}var t=this.extremalPts[0],e=this.extremalPts[1];return this.input.getFactory().createLineString([t,e])},getExtremalPoints:function(){return this.compute(),this.extremalPts},computeCirclePoints:function(){if(this.input.isEmpty())return this.extremalPts=new Array(0).fill(null),null;if(1===this.input.getNumPoints()){var t=this.input.getCoordinates();return this.extremalPts=[new g(t[0])],null}var e=this.input.convexHull(),n=e.getCoordinates(),t=n;if(n[0].equals2D(n[n.length-1])&&(t=new Array(n.length-1).fill(null),H.copyDeep(n,0,t,0,n.length-1)),t.length<=2)return this.extremalPts=H.copyDeep(t),null;for(var i=fi.lowestPoint(t),r=fi.pointWitMinAngleWithX(t,i),s=0;s<t.length;s++){var o=fi.pointWithMinAngleWithSegment(t,i,r);if(hi.isObtuse(i,o,r))return this.extremalPts=[new g(i),new g(r)],null;if(hi.isObtuse(o,i,r))i=o;else{if(!hi.isObtuse(o,r,i))return this.extremalPts=[new g(i),new g(r),new g(o)],null;r=o}}f.shouldNeverReachHere("Logic failure in Minimum Bounding Circle algorithm!")},compute:function(){return null!==this.extremalPts?null:(this.computeCirclePoints(),this.computeCentre(),void(null!==this.centre&&(this.radius=this.centre.distance(this.extremalPts[0]))))},getFarthestPoints:function(){switch(this.compute(),this.extremalPts.length){case 0:return this.input.getFactory().createLineString();case 1:return this.input.getFactory().createPoint(this.centre)}var t=this.extremalPts[0],e=this.extremalPts[this.extremalPts.length-1];return this.input.getFactory().createLineString([t,e])},getCircle:function(){if(this.compute(),null===this.centre)return this.input.getFactory().createPolygon();var t=this.input.getFactory().createPoint(this.centre);return 0===this.radius?t:t.buffer(this.radius)},getCentre:function(){return this.compute(),this.centre},computeCentre:function(){switch(this.extremalPts.length){case 0:this.centre=null;break;case 1:this.centre=this.extremalPts[0];break;case 2:this.centre=new g((this.extremalPts[0].x+this.extremalPts[1].x)/2,(this.extremalPts[0].y+this.extremalPts[1].y)/2);break;case 3:this.centre=ci.circumcentre(this.extremalPts[0],this.extremalPts[1],this.extremalPts[2])}},interfaces_:function(){return[]},getClass:function(){return fi}}),fi.pointWitMinAngleWithX=function(t,e){for(var n=r.MAX_VALUE,i=null,s=0;s<t.length;s++){var o=t[s];if(o!==e){var a=o.x-e.x,u=o.y-e.y;0>u&&(u=-u);var l=Math.sqrt(a*a+u*u),h=u/l;n>h&&(n=h,i=o)}}return i},fi.lowestPoint=function(t){for(var e=t[0],n=1;n<t.length;n++)t[n].y<e.y&&(e=t[n]);return e},fi.pointWithMinAngleWithSegment=function(t,e,n){for(var i=r.MAX_VALUE,s=null,o=0;o<t.length;o++){var a=t[o];if(a!==e&&a!==n){var u=hi.angleBetween(e,a,n);i>u&&(i=u,s=a)}}return s},e(gi.prototype,{getWidthCoordinate:function(){return this.computeMinimumDiameter(),this.minWidthPt},getSupportingSegment:function(){return this.computeMinimumDiameter(),this.inputGeom.getFactory().createLineString([this.minBaseSeg.p0,this.minBaseSeg.p1])},getDiameter:function(){if(this.computeMinimumDiameter(),null===this.minWidthPt)return this.inputGeom.getFactory().createLineString(null);var t=this.minBaseSeg.project(this.minWidthPt);return this.inputGeom.getFactory().createLineString([t,this.minWidthPt])},computeWidthConvex:function(t){t instanceof Tt?this.convexHullPts=t.getExteriorRing().getCoordinates():this.convexHullPts=t.getCoordinates(),0===this.convexHullPts.length?(this.minWidth=0,this.minWidthPt=null,this.minBaseSeg=null):1===this.convexHullPts.length?(this.minWidth=0,this.minWidthPt=this.convexHullPts[0],this.minBaseSeg.p0=this.convexHullPts[0],this.minBaseSeg.p1=this.convexHullPts[0]):2===this.convexHullPts.length||3===this.convexHullPts.length?(this.minWidth=0,this.minWidthPt=this.convexHullPts[0],this.minBaseSeg.p0=this.convexHullPts[0],this.minBaseSeg.p1=this.convexHullPts[1]):this.computeConvexRingMinDiameter(this.convexHullPts)},computeConvexRingMinDiameter:function(t){this.minWidth=r.MAX_VALUE;for(var e=1,n=new ce,i=0;i<t.length-1;i++)n.p0=t[i],n.p1=t[i+1],e=this.findMaxPerpDistance(t,n,e)},computeMinimumDiameter:function(){if(null!==this.minWidthPt)return null;if(this.isConvex)this.computeWidthConvex(this.inputGeom);else{var t=new me(this.inputGeom).getConvexHull();this.computeWidthConvex(t)}},getLength:function(){return this.computeMinimumDiameter(),this.minWidth},findMaxPerpDistance:function(t,e,n){for(var i=e.distancePerpendicular(t[n]),r=i,s=n,o=s;r>=i;)i=r,s=o,o=gi.nextIndex(t,s),r=e.distancePerpendicular(t[o]);return i<this.minWidth&&(this.minPtIndex=s,this.minWidth=i,this.minWidthPt=t[this.minPtIndex],this.minBaseSeg=new ce(e)),s},getMinimumRectangle:function(){if(this.computeMinimumDiameter(),0===this.minWidth)return this.minBaseSeg.p0.equals2D(this.minBaseSeg.p1)?this.inputGeom.getFactory().createPoint(this.minBaseSeg.p0):this.minBaseSeg.toGeometry(this.inputGeom.getFactory());for(var t=this.minBaseSeg.p1.x-this.minBaseSeg.p0.x,e=this.minBaseSeg.p1.y-this.minBaseSeg.p0.y,n=r.MAX_VALUE,i=-r.MAX_VALUE,s=r.MAX_VALUE,o=-r.MAX_VALUE,a=0;a<this.convexHullPts.length;a++){var u=gi.computeC(t,e,this.convexHullPts[a]);u>i&&(i=u),n>u&&(n=u);var l=gi.computeC(-e,t,this.convexHullPts[a]);l>o&&(o=l),s>l&&(s=l)}var h=gi.computeSegmentForLine(-t,-e,o),c=gi.computeSegmentForLine(-t,-e,s),f=gi.computeSegmentForLine(-e,t,i),g=gi.computeSegmentForLine(-e,t,n),d=f.lineIntersection(h),p=g.lineIntersection(h),v=g.lineIntersection(c),m=f.lineIntersection(c),y=this.inputGeom.getFactory().createLinearRing([d,p,v,m,d]);return this.inputGeom.getFactory().createPolygon(y,null)},interfaces_:function(){return[]},getClass:function(){return gi}}),gi.nextIndex=function(t,e){return e++,e>=t.length&&(e=0),e},gi.computeC=function(t,e,n){return t*n.y-e*n.x},gi.getMinimumDiameter=function(t){return new gi(t).getDiameter()},gi.getMinimumRectangle=function(t){return new gi(t).getMinimumRectangle()},gi.computeSegmentForLine=function(t,e,n){var i=null,r=null;return Math.abs(e)>Math.abs(t)?(i=new g(0,n/e),r=new g(1,n/e-t/e)):(i=new g(n/t,0),r=new g(n/t-e/t,1)),new ce(i,r)};var co=Object.freeze({Centroid:ge,CGAlgorithms:he,ConvexHull:me,InteriorPointArea:oi,InteriorPointLine:ui,InteriorPointPoint:li,RobustLineIntersector:ae,MinimumBoundingCircle:fi,MinimumDiameter:gi});e(di.prototype,{getResultGeometry:function(){return new pi(this.distanceTolerance).transform(this.inputGeom)},setDistanceTolerance:function(t){if(0>=t)throw new i("Tolerance must be positive");this.distanceTolerance=t},interfaces_:function(){return[]},getClass:function(){return di}}),di.densifyPoints=function(t,e,n){for(var i=new ce,r=new N,s=0;s<t.length-1;s++){i.p0=t[s],i.p1=t[s+1],r.add(i.p0,!1);var o=i.getLength(),a=Math.trunc(o/e)+1;if(a>1)for(var u=o/a,l=1;a>l;l++){var h=l*u/o,c=i.pointAlong(h);n.makePrecise(c),r.add(c,!1)}}return r.add(t[t.length-1],!1),r.toCoordinateArray()},di.densify=function(t,e){var n=new di(t);return n.setDistanceTolerance(e),n.getResultGeometry()},h(pi,xe),e(pi.prototype,{transformMultiPolygon:function(t,e){var n=xe.prototype.transformMultiPolygon.call(this,t,e);return this.createValidArea(n)},transformPolygon:function(t,e){var n=xe.prototype.transformPolygon.call(this,t,e);return e instanceof Ot?n:this.createValidArea(n)},transformCoordinates:function(t,e){var n=t.toCoordinateArray(),i=di.densifyPoints(n,this.distanceTolerance,e.getPrecisionModel());return e instanceof St&&1===i.length&&(i=new Array(0).fill(null)),this.factory.getCoordinateSequenceFactory().create(i)},createValidArea:function(t){return t.buffer(0)},interfaces_:function(){return[]},getClass:function(){return pi}}),di.DensifyTransformer=pi;var fo=Object.freeze({Densifier:di});e(vi.prototype,{find:function(t){var e=this;do{if(null===e)return null;if(e.dest().equals2D(t))return e;e=e.oNext()}while(e!==this);return null},dest:function(){return this._sym._orig},oNext:function(){return this._sym._next},insert:function(t){if(this.oNext()===this)return this.insertAfter(t),null;var e=this.compareTo(t),n=this;do{var i=n.oNext(),r=i.compareTo(t);if(r!==e||i===this)return n.insertAfter(t),null;n=i}while(n!==this);f.shouldNeverReachHere()},insertAfter:function(t){f.equals(this._orig,t.orig());var e=this.oNext();this._sym.setNext(t),t.sym().setNext(e)},degree:function t(){var t=0,e=this;do t++,e=e.oNext();while(e!==this);return t},equals:function(){if(2===arguments.length){var t=arguments[0],e=arguments[1];return this._orig.equals2D(t)&&this._sym._orig.equals(e)}},deltaY:function(){return this._sym._orig.y-this._orig.y},sym:function(){return this._sym},prev:function(){return this._sym.next()._sym},compareAngularDirection:function(t){var e=this.deltaX(),n=this.deltaY(),i=t.deltaX(),r=t.deltaY();if(e===i&&n===r)return 0;var s=Je.quadrant(e,n),o=Je.quadrant(i,r);return s>o?1:o>s?-1:he.computeOrientation(t._orig,t.dest(),this.dest())},prevNode:function(){for(var t=this;2===t.degree();)if(t=t.prev(),t===this)return null;return t},compareTo:function(t){var e=t,n=this.compareAngularDirection(e);return n},next:function(){return this._next},setSym:function(t){this._sym=t},orig:function(){return this._orig},toString:function(){return"HE("+this._orig.x+" "+this._orig.y+", "+this._sym._orig.x+" "+this._sym._orig.y+")"},setNext:function(t){this._next=t},init:function(t){this.setSym(t),t.setSym(this),this.setNext(t),t.setNext(this)},deltaX:function(){return this._sym._orig.x-this._orig.x},interfaces_:function(){return[]},getClass:function(){return vi}}),vi.init=function(t,e){if(null!==t._sym||null!==e._sym||null!==t._next||null!==e._next)throw new IllegalStateException("Edges are already initialized");return t.init(e),t},vi.create=function(t,e){var n=new vi(t),i=new vi(e);return n.init(i),n},h(mi,vi),e(mi.prototype,{mark:function(){this._isMarked=!0},setMark:function(t){this._isMarked=t},isMarked:function(){return this._isMarked},interfaces_:function(){return[]},getClass:function(){return mi}}),mi.setMarkBoth=function(t,e){t.setMark(e),t.sym().setMark(e)},mi.isMarked=function(t){return t.isMarked()},mi.setMark=function(t,e){t.setMark(e)},mi.markBoth=function(t){t.mark(),t.sym().mark()},mi.mark=function(t){t.mark()},e(yi.prototype,{insert:function(t,e,n){var i=this.create(t,e);null!==n?n.insert(i):this.vertexMap.put(t,i);var r=this.vertexMap.get(e);return null!==r?r.insert(i.sym()):this.vertexMap.put(e,i.sym()),i},create:function(t,e){var n=this.createEdge(t),i=this.createEdge(e);return vi.init(n,i),n},createEdge:function(t){return new vi(t)},addEdge:function(t,e){if(!yi.isValidEdge(t,e))return null;var n=this.vertexMap.get(t),i=null;if(null!==n&&(i=n.find(e)),null!==i)return i;var r=this.insert(t,e,n);return r},getVertexEdges:function(){return this.vertexMap.values()},findEdge:function(t,e){var n=this.vertexMap.get(t);return null===n?null:n.find(e)},interfaces_:function(){return[]},getClass:function(){return yi}}),yi.isValidEdge=function(t,e){var n=e.compareTo(t);return 0!==n},h(xi,mi),e(xi.prototype,{setStart:function(){this._isStart=!0},isStart:function(){return this._isStart},interfaces_:function(){return[]},getClass:function(){return xi}}),h(Ei,yi),e(Ei.prototype,{createEdge:function(t){return new xi(t)},interfaces_:function(){return[]},getClass:function(){return Ei}}),e(Ii.prototype,{addLine:function(t){this.lines.add(this.factory.createLineString(t.toCoordinateArray()))},updateRingStartEdge:function(t){return t.isStart()||(t=t.sym(),t.isStart())?null===this.ringStartEdge?(this.ringStartEdge=t,null):void(t.orig().compareTo(this.ringStartEdge.orig())<0&&(this.ringStartEdge=t)):null},getResult:function(){return null===this.result&&this.computeResult(),this.result},process:function(t){var e=t.prevNode();null===e&&(e=t),this.stackEdges(e),this.buildLines()},buildRing:function(t){var e=new N,n=t;for(e.add(n.orig().copy(),!1);2===n.sym().degree();){var i=n.next();if(i===t)break;e.add(i.orig().copy(),!1),n=i}e.add(n.dest().copy(),!1),this.addLine(e)},buildLine:function(t){var e=new N,n=t;for(this.ringStartEdge=null,mi.markBoth(n),e.add(n.orig().copy(),!1);2===n.sym().degree();){this.updateRingStartEdge(n);var i=n.next();if(i===t)return this.buildRing(this.ringStartEdge),null;e.add(i.orig().copy(),!1),n=i,mi.markBoth(n)}e.add(n.dest().copy(),!1),this.stackEdges(n.sym()),this.addLine(e)},stackEdges:function(t){var e=t;do mi.isMarked(e)||this.nodeEdgeStack.add(e),e=e.oNext();while(e!==t)},computeResult:function(){for(var t=this.graph.getVertexEdges(),e=t.iterator();e.hasNext();){var n=e.next();mi.isMarked(n)||this.process(n)}this.result=this.factory.buildGeometry(this.lines)},buildLines:function(){for(;!this.nodeEdgeStack.empty();){var t=this.nodeEdgeStack.pop();mi.isMarked(t)||this.buildLine(t)}},add:function(){if(arguments[0]instanceof B){var t=arguments[0];t.apply({interfaces_:function(){return[q]},filter:function(t){t instanceof St&&this.add(t)}})}else if(R(arguments[0],v))for(var e=arguments[0],n=e.iterator();n.hasNext();){var i=n.next();this.add(i)}else if(arguments[0]instanceof St){var r=arguments[0];null===this.factory&&(this.factory=r.getFactory());for(var s=r.getCoordinateSequence(),o=!1,n=1;n<s.size();n++){var a=this.graph.addEdge(s.getCoordinate(n-1),s.getCoordinate(n));null!==a&&(o||(a.setStart(),o=!0))}}},interfaces_:function(){return[]},getClass:function(){return Ii}}),Ii.dissolve=function(t){var e=new Ii;return e.add(t),e.getResult()};var go=Object.freeze({LineDissolver:Ii});e(Ni.prototype,{hasChildren:function(){for(var t=0;4>t;t++)if(null!==this.subnode[t])return!0;return!1},isPrunable:function(){return!(this.hasChildren()||this.hasItems())},addAllItems:function(t){t.addAll(this.items);for(var e=0;4>e;e++)null!==this.subnode[e]&&this.subnode[e].addAllItems(t);return t},getNodeCount:function(){for(var t=0,e=0;4>e;e++)null!==this.subnode[e]&&(t+=this.subnode[e].size());return t+1},size:function(){for(var t=0,e=0;4>e;e++)null!==this.subnode[e]&&(t+=this.subnode[e].size());return t+this.items.size()},addAllItemsFromOverlapping:function(t,e){if(!this.isSearchMatch(t))return null;e.addAll(this.items);for(var n=0;4>n;n++)null!==this.subnode[n]&&this.subnode[n].addAllItemsFromOverlapping(t,e)},visitItems:function(t,e){for(var n=this.items.iterator();n.hasNext();)e.visitItem(n.next())},hasItems:function(){return!this.items.isEmpty()},remove:function(t,e){if(!this.isSearchMatch(t))return!1;for(var n=!1,i=0;4>i;i++)if(null!==this.subnode[i]&&(n=this.subnode[i].remove(t,e))){this.subnode[i].isPrunable()&&(this.subnode[i]=null);break}return n?n:n=this.items.remove(e)},visit:function(t,e){if(!this.isSearchMatch(t))return null;this.visitItems(t,e);for(var n=0;4>n;n++)null!==this.subnode[n]&&this.subnode[n].visit(t,e)},getItems:function(){return this.items},depth:function(){for(var t=0,e=0;4>e;e++)if(null!==this.subnode[e]){var n=this.subnode[e].depth();n>t&&(t=n)}return t+1},isEmpty:function t(){var t=!0;this.items.isEmpty()||(t=!1);for(var e=0;4>e;e++)null!==this.subnode[e]&&(this.subnode[e].isEmpty()||(t=!1));return t},add:function(t){this.items.add(t)},interfaces_:function(){return[u]},getClass:function(){return Ni}}),Ni.getSubnodeIndex=function(t,e,n){var i=-1;return t.getMinX()>=e&&(t.getMinY()>=n&&(i=3),t.getMaxY()<=n&&(i=1)),t.getMaxX()<=e&&(t.getMinY()>=n&&(i=2),t.getMaxY()<=n&&(i=0)),i},Ci.exponent=function(t){return Si(64,t)-1023},Ci.powerOf2=function(t){return Math.pow(2,t)},e(wi.prototype,{getLevel:function(){return this.level},computeKey:function(){if(1===arguments.length){var t=arguments[0];for(this.level=wi.computeQuadLevel(t),this.env=new C,this.computeKey(this.level,t);!this.env.contains(t);)this.level+=1,this.computeKey(this.level,t)}else if(2===arguments.length){var e=arguments[0],n=arguments[1],i=Ci.powerOf2(e);this.pt.x=Math.floor(n.getMinX()/i)*i,this.pt.y=Math.floor(n.getMinY()/i)*i,this.env.init(this.pt.x,this.pt.x+i,this.pt.y,this.pt.y+i)}},getEnvelope:function(){return this.env},getCentre:function(){return new g((this.env.getMinX()+this.env.getMaxX())/2,(this.env.getMinY()+this.env.getMaxY())/2)},getPoint:function(){return this.pt},interfaces_:function(){return[]},getClass:function(){return wi}}),wi.computeQuadLevel=function(t){var e=t.getWidth(),n=t.getHeight(),i=e>n?e:n,r=Ci.exponent(i)+1;return r},h(Li,Ni),e(Li.prototype,{find:function(t){var e=Ni.getSubnodeIndex(t,this.centrex,this.centrey);if(-1===e)return this;if(null!==this.subnode[e]){var n=this.subnode[e];return n.find(t)}return this},isSearchMatch:function(t){return this.env.intersects(t)},getSubnode:function(t){return null===this.subnode[t]&&(this.subnode[t]=this.createSubnode(t)),this.subnode[t]},getEnvelope:function(){return this.env},getNode:function(t){var e=Ni.getSubnodeIndex(t,this.centrex,this.centrey);if(-1!==e){var n=this.getSubnode(e);return n.getNode(t)}return this},createSubnode:function(t){var e=0,n=0,i=0,r=0;switch(t){case 0:e=this.env.getMinX(),n=this.centrex,i=this.env.getMinY(),r=this.centrey;break;case 1:e=this.centrex,n=this.env.getMaxX(),i=this.env.getMinY(),r=this.centrey;break;case 2:e=this.env.getMinX(),n=this.centrex,i=this.centrey,r=this.env.getMaxY();break;case 3:e=this.centrex,n=this.env.getMaxX(),i=this.centrey,r=this.env.getMaxY()}var s=new C(e,n,i,r),o=new Li(s,this.level-1);return o},insertNode:function(t){f.isTrue(null===this.env||this.env.contains(t.env));var e=Ni.getSubnodeIndex(t.env,this.centrex,this.centrey);if(t.level===this.level-1)this.subnode[e]=t;else{var n=this.createSubnode(e);n.insertNode(t),this.subnode[e]=n}},interfaces_:function(){return[]},getClass:function(){return Li}}),Li.createNode=function(t){var e=new wi(t),n=new Li(e.getEnvelope(),e.getLevel());return n},Li.createExpanded=function(t,e){var n=new C(e);null!==t&&n.expandToInclude(t.env);var i=Li.createNode(n);return null!==t&&i.insertNode(t),i},e(Ri.prototype,{interfaces_:function(){return[]},getClass:function(){return Ri}}),Ri.isZeroWidth=function(t,e){var n=e-t;if(0===n)return!0;var i=Math.max(Math.abs(t),Math.abs(e)),r=n/i,s=Ci.exponent(r);return s<=Ri.MIN_BINARY_EXPONENT},Ri.MIN_BINARY_EXPONENT=-50,h(Ti,Ni),e(Ti.prototype,{insert:function(t,e){var n=Ni.getSubnodeIndex(t,Ti.origin.x,Ti.origin.y);if(-1===n)return this.add(e),null;var i=this.subnode[n];if(null===i||!i.getEnvelope().contains(t)){var r=Li.createExpanded(i,t);this.subnode[n]=r}this.insertContained(this.subnode[n],t,e)},isSearchMatch:function(t){return!0},insertContained:function(t,e,n){f.isTrue(t.getEnvelope().contains(e));var i=Ri.isZeroWidth(e.getMinX(),e.getMaxX()),r=Ri.isZeroWidth(e.getMinY(),e.getMaxY()),s=null;s=i||r?t.find(e):t.getNode(e),s.add(n)},interfaces_:function(){return[]},getClass:function(){return Ti}}),Ti.origin=new g(0,0),e(Pi.prototype,{size:function(){return null!==this.root?this.root.size():0},insert:function(t,e){this.collectStats(t);var n=Pi.ensureExtent(t,this.minExtent);this.root.insert(n,e)},query:function(){if(1===arguments.length){var t=arguments[0],e=new Yn;return this.query(t,e),e.getItems()}if(2===arguments.length){var n=arguments[0],i=arguments[1];this.root.visit(n,i)}},queryAll:function(){var t=new I;return this.root.addAllItems(t),
t},remove:function(t,e){var n=Pi.ensureExtent(t,this.minExtent);return this.root.remove(n,e)},collectStats:function(t){var e=t.getWidth();e<this.minExtent&&e>0&&(this.minExtent=e);var n=t.getHeight();n<this.minExtent&&n>0&&(this.minExtent=n)},depth:function(){return null!==this.root?this.root.depth():0},isEmpty:function(){return null===this.root},interfaces_:function(){return[Fe,u]},getClass:function(){return Pi}}),Pi.ensureExtent=function(t,e){var n=t.getMinX(),i=t.getMaxX(),r=t.getMinY(),s=t.getMaxY();return n!==i&&r!==s?t:(n===i&&(n-=e/2,i=n+e/2),r===s&&(r-=e/2,s=r+e/2),new C(n,i,r,s))},Pi.serialVersionUID=-0x678b60c967a25400;var po=Object.freeze({Quadtree:Pi}),vo=Object.freeze({STRtree:ke}),mo=Object.freeze({quadtree:po,strtree:vo}),yo=["Point","MultiPoint","LineString","MultiLineString","Polygon","MultiPolygon"];e(bi.prototype,{read:function(t){var e=void 0;e="string"==typeof t?JSON.parse(t):t;var n=e.type;if(!xo[n])throw new Error("Unknown GeoJSON type: "+e.type);return-1!==yo.indexOf(n)?xo[n].apply(this,[e.coordinates]):"GeometryCollection"===n?xo[n].apply(this,[e.geometries]):xo[n].apply(this,[e])},write:function(t){var e=t.getGeometryType();if(!Eo[e])throw new Error("Geometry is not supported");return Eo[e].apply(this,[t])}});var xo={Feature:function(t){var e={};for(var n in t)e[n]=t[n];if(t.geometry){var i=t.geometry.type;if(!xo[i])throw new Error("Unknown GeoJSON type: "+t.type);e.geometry=this.read(t.geometry)}return t.bbox&&(e.bbox=xo.bbox.apply(this,[t.bbox])),e},FeatureCollection:function(t){var e={};if(t.features){e.features=[];for(var n=0;n<t.features.length;++n)e.features.push(this.read(t.features[n]))}return t.bbox&&(e.bbox=this.parse.bbox.apply(this,[t.bbox])),e},coordinates:function t(e){for(var t=[],n=0;n<e.length;++n){var i=e[n];t.push(new g(i[0],i[1]))}return t},bbox:function(t){return this.geometryFactory.createLinearRing([new g(t[0],t[1]),new g(t[2],t[1]),new g(t[2],t[3]),new g(t[0],t[3]),new g(t[0],t[1])])},Point:function(t){var e=new g(t[0],t[1]);return this.geometryFactory.createPoint(e)},MultiPoint:function(t){for(var e=[],n=0;n<t.length;++n)e.push(xo.Point.apply(this,[t[n]]));return this.geometryFactory.createMultiPoint(e)},LineString:function(t){var e=xo.coordinates.apply(this,[t]);return this.geometryFactory.createLineString(e)},MultiLineString:function(t){for(var e=[],n=0;n<t.length;++n)e.push(xo.LineString.apply(this,[t[n]]));return this.geometryFactory.createMultiLineString(e)},Polygon:function(t){for(var e=xo.coordinates.apply(this,[t[0]]),n=this.geometryFactory.createLinearRing(e),i=[],r=1;r<t.length;++r){var s=t[r],o=xo.coordinates.apply(this,[s]),a=this.geometryFactory.createLinearRing(o);i.push(a)}return this.geometryFactory.createPolygon(n,i)},MultiPolygon:function(t){for(var e=[],n=0;n<t.length;++n){var i=t[n];e.push(xo.Polygon.apply(this,[i]))}return this.geometryFactory.createMultiPolygon(e)},GeometryCollection:function(t){for(var e=[],n=0;n<t.length;++n){var i=t[n];e.push(this.read(i))}return this.geometryFactory.createGeometryCollection(e)}},Eo={coordinate:function(t){return[t.x,t.y]},Point:function(t){var e=Eo.coordinate.apply(this,[t.getCoordinate()]);return{type:"Point",coordinates:e}},MultiPoint:function(t){for(var e=[],n=0;n<t.geometries.length;++n){var i=t.geometries[n],r=Eo.Point.apply(this,[i]);e.push(r.coordinates)}return{type:"MultiPoint",coordinates:e}},LineString:function(t){for(var e=[],n=t.getCoordinates(),i=0;i<n.length;++i){var r=n[i];e.push(Eo.coordinate.apply(this,[r]))}return{type:"LineString",coordinates:e}},MultiLineString:function(t){for(var e=[],n=0;n<t.geometries.length;++n){var i=t.geometries[n],r=Eo.LineString.apply(this,[i]);e.push(r.coordinates)}return{type:"MultiLineString",coordinates:e}},Polygon:function(t){var e=[],n=Eo.LineString.apply(this,[t.shell]);e.push(n.coordinates);for(var i=0;i<t.holes.length;++i){var r=t.holes[i],s=Eo.LineString.apply(this,[r]);e.push(s.coordinates)}return{type:"Polygon",coordinates:e}},MultiPolygon:function(t){for(var e=[],n=0;n<t.geometries.length;++n){var i=t.geometries[n],r=Eo.Polygon.apply(this,[i]);e.push(r.coordinates)}return{type:"MultiPolygon",coordinates:e}},GeometryCollection:function(t){for(var e=[],n=0;n<t.geometries.length;++n){var i=t.geometries[n],r=i.getGeometryType();e.push(Eo[r].apply(this,[i]))}return{type:"GeometryCollection",geometries:e}}};e(Oi.prototype,{read:function(t){var e=this.parser.read(t);return this.precisionModel.getType()===ee.FIXED&&this.reducePrecision(e),e},reducePrecision:function(t){var e,n;if(t.coordinate)this.precisionModel.makePrecise(t.coordinate);else if(t.points)for(e=0,n=t.points.length;n>e;e++)this.precisionModel.makePrecise(t.points[e]);else if(t.geometries)for(e=0,n=t.geometries.length;n>e;e++)this.reducePrecision(t.geometries[e])}}),e(_i.prototype,{write:function(t){return this.parser.write(t)}}),e(Mi.prototype,{read:function(t){var e=this.parser.read(t);return this.precisionModel.getType()===ee.FIXED&&this.reducePrecision(e),e},reducePrecision:function(t){if(t.coordinate)this.precisionModel.makePrecise(t.coordinate);else if(t.points)for(var e=0,n=t.points.coordinates.length;n>e;e++)this.precisionModel.makePrecise(t.points.coordinates[e]);else if(t.geometries)for(var i=0,r=t.geometries.length;r>i;i++)this.reducePrecision(t.geometries[i])}}),e(Ai.prototype,{read:function(t){return t instanceof ol.geom.Point?this.convertFromPoint(t):t instanceof ol.geom.LineString?this.convertFromLineString(t):t instanceof ol.geom.LinearRing?this.convertFromLinearRing(t):t instanceof ol.geom.Polygon?this.convertFromPolygon(t):t instanceof ol.geom.MultiPoint?this.convertFromMultiPoint(t):t instanceof ol.geom.MultiLineString?this.convertFromMultiLineString(t):t instanceof ol.geom.MultiPolygon?this.convertFromMultiPolygon(t):t instanceof ol.geom.GeometryCollection?this.convertFromCollection(t):void 0},convertFromPoint:function(t){var e=t.getCoordinates();return this.geometryFactory.createPoint(new g(e[0],e[1]))},convertFromLineString:function(t){return this.geometryFactory.createLineString(t.getCoordinates().map(function(t){return new g(t[0],t[1])}))},convertFromLinearRing:function(t){return this.geometryFactory.createLinearRing(t.getCoordinates().map(function(t){return new g(t[0],t[1])}))},convertFromPolygon:function(t){for(var e=t.getLinearRings(),n=null,i=[],r=0;r<e.length;r++){var s=this.convertFromLinearRing(e[r]);0===r?n=s:i.push(s)}return this.geometryFactory.createPolygon(n,i)},convertFromMultiPoint:function(t){var e=t.getPoints().map(function(t){return this.convertFromPoint(t)},this);return this.geometryFactory.createMultiPoint(e)},convertFromMultiLineString:function(t){var e=t.getLineStrings().map(function(t){return this.convertFromLineString(t)},this);return this.geometryFactory.createMultiLineString(e)},convertFromMultiPolygon:function(t){var e=t.getPolygons().map(function(t){return this.convertFromPolygon(t)},this);return this.geometryFactory.createMultiPolygon(e)},convertFromCollection:function(t){var e=t.getGeometries().map(function(t){return this.read(t)},this);return this.geometryFactory.createGeometryCollection(e)},write:function(t){return"Point"===t.getGeometryType()?this.convertToPoint(t.getCoordinate()):"LineString"===t.getGeometryType()?this.convertToLineString(t):"LinearRing"===t.getGeometryType()?this.convertToLinearRing(t):"Polygon"===t.getGeometryType()?this.convertToPolygon(t):"MultiPoint"===t.getGeometryType()?this.convertToMultiPoint(t):"MultiLineString"===t.getGeometryType()?this.convertToMultiLineString(t):"MultiPolygon"===t.getGeometryType()?this.convertToMultiPolygon(t):"GeometryCollection"===t.getGeometryType()?this.convertToCollection(t):void 0},convertToPoint:function(t){return new ol.geom.Point([t.x,t.y])},convertToLineString:function(t){var e=t.points.coordinates.map(Di);return new ol.geom.LineString(e)},convertToLinearRing:function(t){var e=t.points.coordinates.map(Di);return new ol.geom.LinearRing(e)},convertToPolygon:function(t){for(var e=[t.shell.points.coordinates.map(Di)],n=0;n<t.holes.length;n++)e.push(t.holes[n].points.coordinates.map(Di));return new ol.geom.Polygon(e)},convertToMultiPoint:function(t){return new ol.geom.MultiPoint(t.getCoordinates().map(Di))},convertToMultiLineString:function(t){for(var e=[],n=0;n<t.geometries.length;n++)e.push(this.convertToLineString(t.geometries[n]).getCoordinates());return new ol.geom.MultiLineString(e)},convertToMultiPolygon:function(t){for(var e=[],n=0;n<t.geometries.length;n++)e.push(this.convertToPolygon(t.geometries[n]).getCoordinates());return new ol.geom.MultiPolygon(e)},convertToCollection:function(t){for(var e=[],n=0;n<t.geometries.length;n++){var i=t.geometries[n];e.push(this.write(i))}return new ol.geom.GeometryCollection(e)}});var Io=Object.freeze({GeoJSONReader:Oi,GeoJSONWriter:_i,OL3Parser:Ai,WKTReader:Mi,WKTWriter:se});e(Fi.prototype,{rescale:function(){if(R(arguments[0],v))for(var t=arguments[0],e=t.iterator();e.hasNext();){var n=e.next();this.rescale(n.getCoordinates())}else if(arguments[0]instanceof Array){var i=arguments[0],r=null,s=null;2===i.length&&(r=new g(i[0]),s=new g(i[1]));for(var e=0;e<i.length;e++)i[e].x=i[e].x/this.scaleFactor+this.offsetX,i[e].y=i[e].y/this.scaleFactor+this.offsetY;2===i.length&&i[0].equals2D(i[1])&&A.out.println(i)}},scale:function(){if(R(arguments[0],v)){for(var t=arguments[0],e=new I,n=t.iterator();n.hasNext();){var i=n.next();e.add(new Ke(this.scale(i.getCoordinates()),i.getData()))}return e}if(arguments[0]instanceof Array){for(var r=arguments[0],s=new Array(r.length).fill(null),n=0;n<r.length;n++)s[n]=new g(Math.round((r[n].x-this.offsetX)*this.scaleFactor),Math.round((r[n].y-this.offsetY)*this.scaleFactor),r[n].z);var o=H.removeRepeatedPoints(s);return o}},isIntegerPrecision:function(){return 1===this.scaleFactor},getNodedSubstrings:function(){var t=this.noder.getNodedSubstrings();return this.isScaled&&this.rescale(t),t},computeNodes:function(t){var e=t;this.isScaled&&(e=this.scale(t)),this.noder.computeNodes(e)},interfaces_:function(){return[tn]},getClass:function(){return Fi}});var No=Object.freeze({MCIndexNoder:nn,ScaledNoder:Fi,SegmentString:be});e(Gi.prototype,{isSimpleMultiPoint:function(t){if(t.isEmpty())return!0;for(var e=new at,n=0;n<t.getNumGeometries();n++){var i=t.getGeometryN(n),r=i.getCoordinate();if(e.contains(r))return this.nonSimpleLocation=r,!1;e.add(r)}return!0},isSimplePolygonal:function(t){for(var e=kn.getLines(t),n=e.iterator();n.hasNext();){var i=n.next();if(!this.isSimpleLinearGeometry(i))return!1}return!0},hasClosedEndpointIntersection:function(t){for(var e=new rt,n=t.getEdgeIterator();n.hasNext();){var i=n.next(),r=(i.getMaximumSegmentIndex(),i.isClosed()),s=i.getCoordinate(0);this.addEndpoint(e,s,r);var o=i.getCoordinate(i.getNumPoints()-1);this.addEndpoint(e,o,r)}for(var n=e.values().iterator();n.hasNext();){var a=n.next();if(a.isClosed&&2!==a.degree)return this.nonSimpleLocation=a.getCoordinate(),!0}return!1},getNonSimpleLocation:function(){return this.nonSimpleLocation},isSimpleLinearGeometry:function(t){if(t.isEmpty())return!0;var e=new $n(0,t),n=new ae,i=e.computeSelfNodes(n,!0);return i.hasIntersection()?i.hasProperIntersection()?(this.nonSimpleLocation=i.getProperIntersectionPoint(),!1):this.hasNonEndpointIntersection(e)?!1:!this.isClosedEndpointsInInterior||!this.hasClosedEndpointIntersection(e):!0},hasNonEndpointIntersection:function(t){for(var e=t.getEdgeIterator();e.hasNext();)for(var n=e.next(),i=n.getMaximumSegmentIndex(),r=n.getEdgeIntersectionList().iterator();r.hasNext();){var s=r.next();if(!s.isEndPoint(i))return this.nonSimpleLocation=s.getCoordinate(),!0}return!1},addEndpoint:function(t,e,n){var i=t.get(e);null===i&&(i=new qi(e),t.put(e,i)),i.addEndpoint(n)},computeSimple:function(t){return this.nonSimpleLocation=null,t.isEmpty()?!0:t instanceof St?this.isSimpleLinearGeometry(t):t instanceof gt?this.isSimpleLinearGeometry(t):t instanceof Pt?this.isSimpleMultiPoint(t):R(t,Rt)?this.isSimplePolygonal(t):t instanceof ft?this.isSimpleGeometryCollection(t):!0},isSimple:function(){return this.nonSimpleLocation=null,this.computeSimple(this.inputGeom)},isSimpleGeometryCollection:function(t){for(var e=0;e<t.getNumGeometries();e++){var n=t.getGeometryN(e);if(!this.computeSimple(n))return!1}return!0},interfaces_:function(){return[]},getClass:function(){return Gi}}),e(qi.prototype,{addEndpoint:function(t){this.degree++,this.isClosed|=t},getCoordinate:function(){return this.pt},interfaces_:function(){return[]},getClass:function(){return qi}}),Gi.EndpointInfo=qi,e(Bi.prototype,{getEndCapStyle:function(){return this.endCapStyle},isSingleSided:function(){return this._isSingleSided},setQuadrantSegments:function(t){this.quadrantSegments=t,0===this.quadrantSegments&&(this.joinStyle=Bi.JOIN_BEVEL),this.quadrantSegments<0&&(this.joinStyle=Bi.JOIN_MITRE,this.mitreLimit=Math.abs(this.quadrantSegments)),0>=t&&(this.quadrantSegments=1),this.joinStyle!==Bi.JOIN_ROUND&&(this.quadrantSegments=Bi.DEFAULT_QUADRANT_SEGMENTS)},getJoinStyle:function(){return this.joinStyle},setJoinStyle:function(t){this.joinStyle=t},setSimplifyFactor:function(t){this.simplifyFactor=0>t?0:t},getSimplifyFactor:function(){return this.simplifyFactor},getQuadrantSegments:function(){return this.quadrantSegments},setEndCapStyle:function(t){this.endCapStyle=t},getMitreLimit:function(){return this.mitreLimit},setMitreLimit:function(t){this.mitreLimit=t},setSingleSided:function(t){this._isSingleSided=t},interfaces_:function(){return[]},getClass:function(){return Bi}}),Bi.bufferDistanceError=function(t){var e=Math.PI/2/t;return 1-Math.cos(e/2)},Bi.CAP_ROUND=1,Bi.CAP_FLAT=2,Bi.CAP_SQUARE=3,Bi.JOIN_ROUND=1,Bi.JOIN_MITRE=2,Bi.JOIN_BEVEL=3,Bi.DEFAULT_QUADRANT_SEGMENTS=8,Bi.DEFAULT_MITRE_LIMIT=5,Bi.DEFAULT_SIMPLIFY_FACTOR=.01,e(zi.prototype,{getCoordinate:function(){return this.minCoord},getRightmostSide:function(t,e){var n=this.getRightmostSideOfSegment(t,e);return 0>n&&(n=this.getRightmostSideOfSegment(t,e-1)),0>n&&(this.minCoord=null,this.checkForRightmostCoordinate(t)),n},findRightmostEdgeAtVertex:function(){var t=this.minDe.getEdge().getCoordinates();f.isTrue(this.minIndex>0&&this.minIndex<t.length,"rightmost point expected to be interior vertex of edge");var e=t[this.minIndex-1],n=t[this.minIndex+1],i=he.computeOrientation(this.minCoord,n,e),r=!1;e.y<this.minCoord.y&&n.y<this.minCoord.y&&i===he.COUNTERCLOCKWISE?r=!0:e.y>this.minCoord.y&&n.y>this.minCoord.y&&i===he.CLOCKWISE&&(r=!0),r&&(this.minIndex=this.minIndex-1)},getRightmostSideOfSegment:function(t,e){var n=t.getEdge(),i=n.getCoordinates();if(0>e||e+1>=i.length)return-1;if(i[e].y===i[e+1].y)return-1;var r=cn.LEFT;return i[e].y<i[e+1].y&&(r=cn.RIGHT),r},getEdge:function(){return this.orientedDe},checkForRightmostCoordinate:function(t){for(var e=t.getEdge().getCoordinates(),n=0;n<e.length-1;n++)(null===this.minCoord||e[n].x>this.minCoord.x)&&(this.minDe=t,this.minIndex=n,this.minCoord=e[n])},findRightmostEdgeAtNode:function(){var t=this.minDe.getNode(),e=t.getEdges();this.minDe=e.getRightmostEdge(),this.minDe.isForward()||(this.minDe=this.minDe.getSym(),this.minIndex=this.minDe.getEdge().getCoordinates().length-1)},findEdge:function(t){for(var e=t.iterator();e.hasNext();){var n=e.next();n.isForward()&&this.checkForRightmostCoordinate(n)}f.isTrue(0!==this.minIndex||this.minCoord.equals(this.minDe.getCoordinate()),"inconsistency in rightmost processing"),0===this.minIndex?this.findRightmostEdgeAtNode():this.findRightmostEdgeAtVertex(),this.orientedDe=this.minDe;var i=this.getRightmostSide(this.minDe,this.minIndex);i===cn.LEFT&&(this.orientedDe=this.minDe.getSym())},interfaces_:function(){return[]},getClass:function(){return zi}}),Vi.prototype.addLast=function(t){this.array_.push(t)},Vi.prototype.removeFirst=function(){return this.array_.shift()},Vi.prototype.isEmpty=function(){return 0===this.array_.length},e(ki.prototype,{clearVisitedEdges:function(){for(var t=this.dirEdgeList.iterator();t.hasNext();){var e=t.next();e.setVisited(!1)}},getRightmostCoordinate:function(){return this.rightMostCoord},computeNodeDepth:function(t){for(var e=null,n=t.getEdges().iterator();n.hasNext();){var i=n.next();if(i.isVisited()||i.getSym().isVisited()){e=i;break}}if(null===e)throw new sn("unable to find edge to compute depths at "+t.getCoordinate());t.getEdges().computeDepths(e);for(var n=t.getEdges().iterator();n.hasNext();){var i=n.next();i.setVisited(!0),this.copySymDepths(i)}},computeDepth:function(t){this.clearVisitedEdges();var e=this.finder.getEdge();e.getNode(),e.getLabel();e.setEdgeDepths(cn.RIGHT,t),this.copySymDepths(e),this.computeDepths(e)},create:function(t){this.addReachable(t),this.finder.findEdge(this.dirEdgeList),this.rightMostCoord=this.finder.getCoordinate()},findResultEdges:function(){for(var t=this.dirEdgeList.iterator();t.hasNext();){var e=t.next();e.getDepth(cn.RIGHT)>=1&&e.getDepth(cn.LEFT)<=0&&!e.isInteriorAreaEdge()&&e.setInResult(!0)}},computeDepths:function(t){var e=new J,n=new Vi,i=t.getNode();for(n.addLast(i),e.add(i),t.setVisited(!0);!n.isEmpty();){var r=n.removeFirst();e.add(r),this.computeNodeDepth(r);for(var s=r.getEdges().iterator();s.hasNext();){var o=s.next(),a=o.getSym();if(!a.isVisited()){var u=a.getNode();e.contains(u)||(n.addLast(u),e.add(u))}}}},compareTo:function(t){var e=t;return this.rightMostCoord.x<e.rightMostCoord.x?-1:this.rightMostCoord.x>e.rightMostCoord.x?1:0},getEnvelope:function(){if(null===this.env){for(var t=new C,e=this.dirEdgeList.iterator();e.hasNext();)for(var n=e.next(),i=n.getEdge().getCoordinates(),r=0;r<i.length-1;r++)t.expandToInclude(i[r]);this.env=t}return this.env},addReachable:function(t){var e=new pe;for(e.add(t);!e.empty();){var n=e.pop();this.add(n,e)}},copySymDepths:function(t){var e=t.getSym();e.setDepth(cn.LEFT,t.getDepth(cn.RIGHT)),e.setDepth(cn.RIGHT,t.getDepth(cn.LEFT))},add:function(t,e){t.setVisited(!0),this.nodes.add(t);for(var n=t.getEdges().iterator();n.hasNext();){var i=n.next();this.dirEdgeList.add(i);var r=i.getSym(),s=r.getNode();s.isVisited()||e.push(s)}},getNodes:function(){return this.nodes},getDirectedEdges:function(){return this.dirEdgeList},interfaces_:function(){return[s]},getClass:function(){return ki}}),e(Yi.prototype,{isDeletable:function(t,e,n,i){var r=this.inputLine[t],s=this.inputLine[e],o=this.inputLine[n];return this.isConcave(r,s,o)&&this.isShallow(r,s,o,i)?this.isShallowSampled(r,s,t,n,i):!1},deleteShallowConcavities:function(){for(var t=1,e=(this.inputLine.length-1,this.findNextNonDeletedIndex(t)),n=this.findNextNonDeletedIndex(e),i=!1;n<this.inputLine.length;){var r=!1;this.isDeletable(t,e,n,this.distanceTol)&&(this.isDeleted[e]=Yi.DELETE,r=!0,i=!0),t=r?n:e,e=this.findNextNonDeletedIndex(t),n=this.findNextNonDeletedIndex(e)}return i},isShallowConcavity:function(t,e,n,i){var r=he.computeOrientation(t,e,n),s=r===this.angleOrientation;if(!s)return!1;var o=he.distancePointLine(e,t,n);return i>o},isShallowSampled:function(t,e,n,i,r){var s=Math.trunc((i-n)/Yi.NUM_PTS_TO_CHECK);0>=s&&(s=1);for(var o=n;i>o;o+=s)if(!this.isShallow(t,e,this.inputLine[o],r))return!1;return!0},isConcave:function t(e,n,i){var r=he.computeOrientation(e,n,i),t=r===this.angleOrientation;return t},simplify:function(t){this.distanceTol=Math.abs(t),0>t&&(this.angleOrientation=he.CLOCKWISE),this.isDeleted=new Array(this.inputLine.length).fill(null);var e=!1;do e=this.deleteShallowConcavities();while(e);return this.collapseLine()},findNextNonDeletedIndex:function(t){for(var e=t+1;e<this.inputLine.length&&this.isDeleted[e]===Yi.DELETE;)e++;return e},isShallow:function(t,e,n,i){var r=he.distancePointLine(e,t,n);return i>r},collapseLine:function(){for(var t=new N,e=0;e<this.inputLine.length;e++)this.isDeleted[e]!==Yi.DELETE&&t.add(this.inputLine[e]);return t.toCoordinateArray()},interfaces_:function(){return[]},getClass:function(){return Yi}}),Yi.simplify=function(t,e){var n=new Yi(t);return n.simplify(e)},Yi.INIT=0,Yi.DELETE=1,Yi.KEEP=1,Yi.NUM_PTS_TO_CHECK=10,e(Ui.prototype,{getCoordinates:function(){var t=this.ptList.toArray(Ui.COORDINATE_ARRAY_TYPE);return t},setPrecisionModel:function(t){this.precisionModel=t},addPt:function(t){var e=new g(t);return this.precisionModel.makePrecise(e),this.isRedundant(e)?null:void this.ptList.add(e)},reverse:function(){},addPts:function(t,e){if(e)for(var n=0;n<t.length;n++)this.addPt(t[n]);else for(var n=t.length-1;n>=0;n--)this.addPt(t[n])},isRedundant:function(t){if(this.ptList.size()<1)return!1;var e=this.ptList.get(this.ptList.size()-1),n=t.distance(e);return n<this.minimimVertexDistance},toString:function(){var t=new ie,e=t.createLineString(this.getCoordinates());return e.toString()},closeRing:function(){if(this.ptList.size()<1)return null;var t=new g(this.ptList.get(0)),e=this.ptList.get(this.ptList.size()-1),n=null;return this.ptList.size()>=2&&(n=this.ptList.get(this.ptList.size()-2)),t.equals(e)?null:void this.ptList.add(t)},setMinimumVertexDistance:function(t){this.minimimVertexDistance=t},interfaces_:function(){return[]},getClass:function(){return Ui}}),Ui.COORDINATE_ARRAY_TYPE=new Array(0).fill(null),e(Xi.prototype,{addNextSegment:function(t,e){if(this.s0=this.s1,this.s1=this.s2,this.s2=t,this.seg0.setCoordinates(this.s0,this.s1),this.computeOffsetSegment(this.seg0,this.side,this.distance,this.offset0),this.seg1.setCoordinates(this.s1,this.s2),this.computeOffsetSegment(this.seg1,this.side,this.distance,this.offset1),this.s1.equals(this.s2))return null;var n=he.computeOrientation(this.s0,this.s1,this.s2),i=n===he.CLOCKWISE&&this.side===cn.LEFT||n===he.COUNTERCLOCKWISE&&this.side===cn.RIGHT;0===n?this.addCollinear(e):i?this.addOutsideTurn(n,e):this.addInsideTurn(n,e)},addLineEndCap:function(t,e){var n=new ce(t,e),i=new ce;this.computeOffsetSegment(n,cn.LEFT,this.distance,i);var r=new ce;this.computeOffsetSegment(n,cn.RIGHT,this.distance,r);var s=e.x-t.x,o=e.y-t.y,a=Math.atan2(o,s);switch(this.bufParams.getEndCapStyle()){case Bi.CAP_ROUND:this.segList.addPt(i.p1),this.addFilletArc(e,a+Math.PI/2,a-Math.PI/2,he.CLOCKWISE,this.distance),this.segList.addPt(r.p1);break;case Bi.CAP_FLAT:this.segList.addPt(i.p1),this.segList.addPt(r.p1);break;case Bi.CAP_SQUARE:var u=new g;u.x=Math.abs(this.distance)*Math.cos(a),u.y=Math.abs(this.distance)*Math.sin(a);var l=new g(i.p1.x+u.x,i.p1.y+u.y),h=new g(r.p1.x+u.x,r.p1.y+u.y);this.segList.addPt(l),this.segList.addPt(h)}},getCoordinates:function(){var t=this.segList.getCoordinates();return t},addMitreJoin:function(t,e,n,i){var r=!0,s=null;try{s=F.intersection(e.p0,e.p1,n.p0,n.p1);var o=0>=i?1:s.distance(t)/Math.abs(i);o>this.bufParams.getMitreLimit()&&(r=!1)}catch(t){if(!(t instanceof w))throw t;s=new g(0,0),r=!1}finally{}r?this.segList.addPt(s):this.addLimitedMitreJoin(e,n,i,this.bufParams.getMitreLimit())},addFilletCorner:function(t,e,n,i,r){var s=e.x-t.x,o=e.y-t.y,a=Math.atan2(o,s),u=n.x-t.x,l=n.y-t.y,h=Math.atan2(l,u);i===he.CLOCKWISE?h>=a&&(a+=2*Math.PI):a>=h&&(a-=2*Math.PI),this.segList.addPt(e),this.addFilletArc(t,a,h,i,r),this.segList.addPt(n)},addOutsideTurn:function(t,e){return this.offset0.p1.distance(this.offset1.p0)<this.distance*Xi.OFFSET_SEGMENT_SEPARATION_FACTOR?(this.segList.addPt(this.offset0.p1),null):void(this.bufParams.getJoinStyle()===Bi.JOIN_MITRE?this.addMitreJoin(this.s1,this.offset0,this.offset1,this.distance):this.bufParams.getJoinStyle()===Bi.JOIN_BEVEL?this.addBevelJoin(this.offset0,this.offset1):(e&&this.segList.addPt(this.offset0.p1),this.addFilletCorner(this.s1,this.offset0.p1,this.offset1.p0,t,this.distance),this.segList.addPt(this.offset1.p0)))},createSquare:function(t){this.segList.addPt(new g(t.x+this.distance,t.y+this.distance)),this.segList.addPt(new g(t.x+this.distance,t.y-this.distance)),this.segList.addPt(new g(t.x-this.distance,t.y-this.distance)),this.segList.addPt(new g(t.x-this.distance,t.y+this.distance)),this.segList.closeRing()},addSegments:function(t,e){this.segList.addPts(t,e)},addFirstSegment:function(){this.segList.addPt(this.offset1.p0)},addLastSegment:function(){this.segList.addPt(this.offset1.p1)},initSideSegments:function(t,e,n){this.s1=t,this.s2=e,this.side=n,this.seg1.setCoordinates(t,e),this.computeOffsetSegment(this.seg1,n,this.distance,this.offset1)},addLimitedMitreJoin:function(t,e,n,i){var r=this.seg0.p1,s=hi.angle(r,this.seg0.p0),o=(hi.angle(r,this.seg1.p1),hi.angleBetweenOriented(this.seg0.p0,r,this.seg1.p1)),a=o/2,u=hi.normalize(s+a),l=hi.normalize(u+Math.PI),h=i*n,c=h*Math.abs(Math.sin(a)),f=n-c,d=r.x+h*Math.cos(l),p=r.y+h*Math.sin(l),v=new g(d,p),m=new ce(r,v),y=m.pointAlongOffset(1,f),x=m.pointAlongOffset(1,-f);this.side===cn.LEFT?(this.segList.addPt(y),this.segList.addPt(x)):(this.segList.addPt(x),this.segList.addPt(y))},computeOffsetSegment:function(t,e,n,i){var r=e===cn.LEFT?1:-1,s=t.p1.x-t.p0.x,o=t.p1.y-t.p0.y,a=Math.sqrt(s*s+o*o),u=r*n*s/a,l=r*n*o/a;i.p0.x=t.p0.x-l,i.p0.y=t.p0.y+u,i.p1.x=t.p1.x-l,i.p1.y=t.p1.y+u},addFilletArc:function(t,e,n,i,r){var s=i===he.CLOCKWISE?-1:1,o=Math.abs(e-n),a=Math.trunc(o/this.filletAngleQuantum+.5);if(1>a)return null;var u=null,l=null;u=0,l=o/a;for(var h=u,c=new g;o>h;){var f=e+s*h;c.x=t.x+r*Math.cos(f),c.y=t.y+r*Math.sin(f),this.segList.addPt(c),h+=l}},addInsideTurn:function(t,e){if(this.li.computeIntersection(this.offset0.p0,this.offset0.p1,this.offset1.p0,this.offset1.p1),this.li.hasIntersection())this.segList.addPt(this.li.getIntersection(0));else if(this._hasNarrowConcaveAngle=!0,this.offset0.p1.distance(this.offset1.p0)<this.distance*Xi.INSIDE_TURN_VERTEX_SNAP_DISTANCE_FACTOR)this.segList.addPt(this.offset0.p1);else{if(this.segList.addPt(this.offset0.p1),this.closingSegLengthFactor>0){var n=new g((this.closingSegLengthFactor*this.offset0.p1.x+this.s1.x)/(this.closingSegLengthFactor+1),(this.closingSegLengthFactor*this.offset0.p1.y+this.s1.y)/(this.closingSegLengthFactor+1));this.segList.addPt(n);var i=new g((this.closingSegLengthFactor*this.offset1.p0.x+this.s1.x)/(this.closingSegLengthFactor+1),(this.closingSegLengthFactor*this.offset1.p0.y+this.s1.y)/(this.closingSegLengthFactor+1));this.segList.addPt(i)}else this.segList.addPt(this.s1);this.segList.addPt(this.offset1.p0)}},createCircle:function(t){var e=new g(t.x+this.distance,t.y);this.segList.addPt(e),this.addFilletArc(t,0,2*Math.PI,-1,this.distance),this.segList.closeRing()},addBevelJoin:function(t,e){this.segList.addPt(t.p1),this.segList.addPt(e.p0)},init:function(t){this.distance=t,this.maxCurveSegmentError=t*(1-Math.cos(this.filletAngleQuantum/2)),this.segList=new Ui,this.segList.setPrecisionModel(this.precisionModel),this.segList.setMinimumVertexDistance(t*Xi.CURVE_VERTEX_SNAP_DISTANCE_FACTOR)},addCollinear:function(t){this.li.computeIntersection(this.s0,this.s1,this.s1,this.s2);var e=this.li.getIntersectionNum();e>=2&&(this.bufParams.getJoinStyle()===Bi.JOIN_BEVEL||this.bufParams.getJoinStyle()===Bi.JOIN_MITRE?(t&&this.segList.addPt(this.offset0.p1),this.segList.addPt(this.offset1.p0)):this.addFilletCorner(this.s1,this.offset0.p1,this.offset1.p0,he.CLOCKWISE,this.distance))},closeRing:function(){this.segList.closeRing()},hasNarrowConcaveAngle:function(){return this._hasNarrowConcaveAngle},interfaces_:function(){return[]},getClass:function(){return Xi}}),Xi.OFFSET_SEGMENT_SEPARATION_FACTOR=.001,Xi.INSIDE_TURN_VERTEX_SNAP_DISTANCE_FACTOR=.001,Xi.CURVE_VERTEX_SNAP_DISTANCE_FACTOR=1e-6,Xi.MAX_CLOSING_SEG_LEN_FACTOR=80,e(Hi.prototype,{getOffsetCurve:function(t,e){if(this.distance=e,0===e)return null;var n=0>e,i=Math.abs(e),r=this.getSegGen(i);t.length<=1?this.computePointCurve(t[0],r):this.computeOffsetCurve(t,n,r);var s=r.getCoordinates();return n&&H.reverse(s),s},computeSingleSidedBufferCurve:function(t,e,n){var i=this.simplifyTolerance(this.distance);if(e){n.addSegments(t,!0);var r=Yi.simplify(t,-i),s=r.length-1;n.initSideSegments(r[s],r[s-1],cn.LEFT),n.addFirstSegment();for(var o=s-2;o>=0;o--)n.addNextSegment(r[o],!0)}else{n.addSegments(t,!1);var a=Yi.simplify(t,i),u=a.length-1;n.initSideSegments(a[0],a[1],cn.LEFT),n.addFirstSegment();for(var o=2;u>=o;o++)n.addNextSegment(a[o],!0)}n.addLastSegment(),n.closeRing()},computeRingBufferCurve:function(t,e,n){var i=this.simplifyTolerance(this.distance);e===cn.RIGHT&&(i=-i);var r=Yi.simplify(t,i),s=r.length-1;n.initSideSegments(r[s-1],r[0],e);for(var o=1;s>=o;o++){var a=1!==o;n.addNextSegment(r[o],a)}n.closeRing()},computeLineBufferCurve:function(t,e){var n=this.simplifyTolerance(this.distance),i=Yi.simplify(t,n),r=i.length-1;e.initSideSegments(i[0],i[1],cn.LEFT);for(var s=2;r>=s;s++)e.addNextSegment(i[s],!0);e.addLastSegment(),e.addLineEndCap(i[r-1],i[r]);var o=Yi.simplify(t,-n),a=o.length-1;e.initSideSegments(o[a],o[a-1],cn.LEFT);for(var s=a-2;s>=0;s--)e.addNextSegment(o[s],!0);e.addLastSegment(),e.addLineEndCap(o[1],o[0]),e.closeRing()},computePointCurve:function(t,e){switch(this.bufParams.getEndCapStyle()){case Bi.CAP_ROUND:e.createCircle(t);break;case Bi.CAP_SQUARE:e.createSquare(t)}},getLineCurve:function(t,e){if(this.distance=e,0>e&&!this.bufParams.isSingleSided())return null;if(0===e)return null;var n=Math.abs(e),i=this.getSegGen(n);if(t.length<=1)this.computePointCurve(t[0],i);else if(this.bufParams.isSingleSided()){var r=0>e;this.computeSingleSidedBufferCurve(t,r,i)}else this.computeLineBufferCurve(t,i);var s=i.getCoordinates();return s},getBufferParameters:function(){return this.bufParams},simplifyTolerance:function(t){return t*this.bufParams.getSimplifyFactor()},getRingCurve:function(t,e,n){if(this.distance=n,t.length<=2)return this.getLineCurve(t,n);if(0===n)return Hi.copyCoordinates(t);var i=this.getSegGen(n);return this.computeRingBufferCurve(t,e,i),i.getCoordinates()},computeOffsetCurve:function(t,e,n){var i=this.simplifyTolerance(this.distance);if(e){var r=Yi.simplify(t,-i),s=r.length-1;n.initSideSegments(r[s],r[s-1],cn.LEFT),n.addFirstSegment();for(var o=s-2;o>=0;o--)n.addNextSegment(r[o],!0)}else{var a=Yi.simplify(t,i),u=a.length-1;n.initSideSegments(a[0],a[1],cn.LEFT),n.addFirstSegment();for(var o=2;u>=o;o++)n.addNextSegment(a[o],!0)}n.addLastSegment()},getSegGen:function(t){return new Xi(this.precisionModel,this.bufParams,t)},interfaces_:function(){return[]},getClass:function(){return Hi}}),Hi.copyCoordinates=function(t){for(var e=new Array(t.length).fill(null),n=0;n<e.length;n++)e[n]=new g(t[n]);return e},e(Wi.prototype,{findStabbedSegments:function(){if(1===arguments.length){for(var t=arguments[0],e=new I,n=this.subgraphs.iterator();n.hasNext();){var i=n.next(),r=i.getEnvelope();t.y<r.getMinY()||t.y>r.getMaxY()||this.findStabbedSegments(t,i.getDirectedEdges(),e)}return e}if(3===arguments.length)if(R(arguments[2],y)&&arguments[0]instanceof g&&arguments[1]instanceof In)for(var s=arguments[0],o=arguments[1],a=arguments[2],u=o.getEdge().getCoordinates(),n=0;n<u.length-1;n++){this.seg.p0=u[n],this.seg.p1=u[n+1],this.seg.p0.y>this.seg.p1.y&&this.seg.reverse();var l=Math.max(this.seg.p0.x,this.seg.p1.x);if(!(l<s.x||this.seg.isHorizontal()||s.y<this.seg.p0.y||s.y>this.seg.p1.y||he.computeOrientation(this.seg.p0,this.seg.p1,s)===he.RIGHT)){var h=o.getDepth(cn.LEFT);this.seg.p0.equals(u[n])||(h=o.getDepth(cn.RIGHT));var c=new ji(this.seg,h);a.add(c)}}else if(R(arguments[2],y)&&arguments[0]instanceof g&&R(arguments[1],y))for(var f=arguments[0],d=arguments[1],p=arguments[2],n=d.iterator();n.hasNext();){var v=n.next();v.isForward()&&this.findStabbedSegments(f,v,p)}},getDepth:function(t){var e=this.findStabbedSegments(t);if(0===e.size())return 0;var n=ho.min(e);return n.leftDepth},interfaces_:function(){return[]},getClass:function(){return Wi}}),e(ji.prototype,{compareTo:function(t){var e=t;if(this.upwardSeg.minX()>=e.upwardSeg.maxX())return 1;if(this.upwardSeg.maxX()<=e.upwardSeg.minX())return-1;var n=this.upwardSeg.orientationIndex(e.upwardSeg);return 0!==n?n:(n=-1*e.upwardSeg.orientationIndex(this.upwardSeg),0!==n?n:this.upwardSeg.compareTo(e.upwardSeg))},compareX:function(t,e){var n=t.p0.compareTo(e.p0);return 0!==n?n:t.p1.compareTo(e.p1)},toString:function(){return this.upwardSeg.toString()},interfaces_:function(){return[s]},getClass:function(){return ji}}),Wi.DepthSegment=ji,e(Ki.prototype,{addPoint:function(t){if(this.distance<=0)return null;
var e=t.getCoordinates(),n=this.curveBuilder.getLineCurve(e,this.distance);this.addCurve(n,L.EXTERIOR,L.INTERIOR)},addPolygon:function(t){var e=this.distance,n=cn.LEFT;this.distance<0&&(e=-this.distance,n=cn.RIGHT);var i=t.getExteriorRing(),r=H.removeRepeatedPoints(i.getCoordinates());if(this.distance<0&&this.isErodedCompletely(i,this.distance))return null;if(this.distance<=0&&r.length<3)return null;this.addPolygonRing(r,e,n,L.EXTERIOR,L.INTERIOR);for(var s=0;s<t.getNumInteriorRing();s++){var o=t.getInteriorRingN(s),a=H.removeRepeatedPoints(o.getCoordinates());this.distance>0&&this.isErodedCompletely(o,-this.distance)||this.addPolygonRing(a,e,cn.opposite(n),L.INTERIOR,L.EXTERIOR)}},isTriangleErodedCompletely:function(t,e){var n=new ci(t[0],t[1],t[2]),i=n.inCentre(),r=he.distancePointLine(i,n.p0,n.p1);return r<Math.abs(e)},addLineString:function(t){if(this.distance<=0&&!this.curveBuilder.getBufferParameters().isSingleSided())return null;var e=H.removeRepeatedPoints(t.getCoordinates()),n=this.curveBuilder.getLineCurve(e,this.distance);this.addCurve(n,L.EXTERIOR,L.INTERIOR)},addCurve:function(t,e,n){if(null===t||t.length<2)return null;var i=new Ke(t,new gn(0,L.BOUNDARY,e,n));this.curveList.add(i)},getCurves:function(){return this.add(this.inputGeom),this.curveList},addPolygonRing:function(t,e,n,i,r){if(0===e&&t.length<bt.MINIMUM_VALID_SIZE)return null;var s=i,o=r;t.length>=bt.MINIMUM_VALID_SIZE&&he.isCCW(t)&&(s=r,o=i,n=cn.opposite(n));var a=this.curveBuilder.getRingCurve(t,n,e);this.addCurve(a,s,o)},add:function(t){if(t.isEmpty())return null;if(t instanceof Tt)this.addPolygon(t);else if(t instanceof St)this.addLineString(t);else if(t instanceof Lt)this.addPoint(t);else if(t instanceof Pt)this.addCollection(t);else if(t instanceof gt)this.addCollection(t);else if(t instanceof Ot)this.addCollection(t);else{if(!(t instanceof ft))throw new UnsupportedOperationException(t.getClass().getName());this.addCollection(t)}},isErodedCompletely:function(t,e){var n=t.getCoordinates();if(n.length<4)return 0>e;if(4===n.length)return this.isTriangleErodedCompletely(n,e);var i=t.getEnvelopeInternal(),r=Math.min(i.getHeight(),i.getWidth());return 0>e&&2*Math.abs(e)>r},addCollection:function(t){for(var e=0;e<t.getNumGeometries();e++){var n=t.getGeometryN(e);this.add(n)}},interfaces_:function(){return[]},getClass:function(){return Ki}}),e(Zi.prototype,{isTrivialIntersection:function(t,e,n,i){if(t===n&&1===this.li.getIntersectionNum()){if(Zi.isAdjacentSegments(e,i))return!0;if(t.isClosed()){var r=t.size()-1;if(0===e&&i===r||0===i&&e===r)return!0}}return!1},getProperIntersectionPoint:function(){return this.properIntersectionPoint},hasProperInteriorIntersection:function(){return this.hasProperInterior},getLineIntersector:function(){return this.li},hasProperIntersection:function(){return this.hasProper},processIntersections:function(t,e,n,i){if(t===n&&e===i)return null;this.numTests++;var r=t.getCoordinates()[e],s=t.getCoordinates()[e+1],o=n.getCoordinates()[i],a=n.getCoordinates()[i+1];this.li.computeIntersection(r,s,o,a),this.li.hasIntersection()&&(this.numIntersections++,this.li.isInteriorIntersection()&&(this.numInteriorIntersections++,this.hasInterior=!0),this.isTrivialIntersection(t,e,n,i)||(this._hasIntersection=!0,t.addIntersections(this.li,e,0),n.addIntersections(this.li,i,1),this.li.isProper()&&(this.numProperIntersections++,this.hasProper=!0,this.hasProperInterior=!0)))},hasIntersection:function(){return this._hasIntersection},isDone:function(){return!1},hasInteriorIntersection:function(){return this.hasInterior},interfaces_:function(){return[on]},getClass:function(){return Zi}}),Zi.isAdjacentSegments=function(t,e){return 1===Math.abs(t-e)},e(Qi.prototype,{setWorkingPrecisionModel:function(t){this.workingPrecisionModel=t},insertUniqueEdge:function(t){var e=this.edgeList.findEqualEdge(t);if(null!==e){var n=e.getLabel(),i=t.getLabel();e.isPointwiseEqual(t)||(i=new gn(t.getLabel()),i.flip()),n.merge(i);var r=Qi.depthDelta(i),s=e.getDepthDelta(),o=s+r;e.setDepthDelta(o)}else this.edgeList.add(t),t.setDepthDelta(Qi.depthDelta(t.getLabel()))},buildSubgraphs:function(t,e){for(var n=new I,i=t.iterator();i.hasNext();){var r=i.next(),s=r.getRightmostCoordinate(),o=new Wi(n),a=o.getDepth(s);r.computeDepth(a),r.findResultEdges(),n.add(r),e.add(r.getDirectedEdges(),r.getNodes())}},createSubgraphs:function(t){for(var e=new I,n=t.getNodes().iterator();n.hasNext();){var i=n.next();if(!i.isVisited()){var r=new ki;r.create(i),e.add(r)}}return ho.sort(e,ho.reverseOrder()),e},createEmptyResultGeometry:function(){var t=this.geomFact.createPolygon();return t},getNoder:function(t){if(null!==this.workingNoder)return this.workingNoder;var e=new nn,n=new ae;return n.setPrecisionModel(t),e.setSegmentIntersector(new Zi(n)),e},buffer:function(t,e){var n=this.workingPrecisionModel;null===n&&(n=t.getPrecisionModel()),this.geomFact=t.getFactory();var i=new Hi(n,this.bufParams),r=new Ki(t,e,i),s=r.getCurves();if(s.size()<=0)return this.createEmptyResultGeometry();this.computeNodedEdges(s,n),this.graph=new Cn(new On),this.graph.addEdges(this.edgeList.getEdges());var o=this.createSubgraphs(this.graph),a=new Sn(this.geomFact);this.buildSubgraphs(o,a);var u=a.getPolygons();if(u.size()<=0)return this.createEmptyResultGeometry();var l=this.geomFact.buildGeometry(u);return l},computeNodedEdges:function(t,e){var n=this.getNoder(e);n.computeNodes(t);for(var i=n.getNodedSubstrings(),r=i.iterator();r.hasNext();){var s=r.next(),o=s.getCoordinates();if(2!==o.length||!o[0].equals2D(o[1])){var a=s.getData(),u=new Jn(s.getCoordinates(),new gn(a));this.insertUniqueEdge(u)}}},setNoder:function(t){this.workingNoder=t},interfaces_:function(){return[]},getClass:function(){return Qi}}),Qi.depthDelta=function(t){var e=t.getLocation(0,cn.LEFT),n=t.getLocation(0,cn.RIGHT);return e===L.INTERIOR&&n===L.EXTERIOR?1:e===L.EXTERIOR&&n===L.INTERIOR?-1:0},Qi.convertSegStrings=function(t){for(var e=new ie,n=new I;t.hasNext();){var i=t.next(),r=e.createLineString(i.getCoordinates());n.add(r)}return e.buildGeometry(n)},e(Ji.prototype,{checkEndPtVertexIntersections:function(){if(0===arguments.length)for(var t=this.segStrings.iterator();t.hasNext();){var e=t.next(),n=e.getCoordinates();this.checkEndPtVertexIntersections(n[0],this.segStrings),this.checkEndPtVertexIntersections(n[n.length-1],this.segStrings)}else if(2===arguments.length)for(var i=arguments[0],r=arguments[1],t=r.iterator();t.hasNext();)for(var e=t.next(),n=e.getCoordinates(),s=1;s<n.length-1;s++)if(n[s].equals(i))throw new l("found endpt/interior pt intersection at index "+s+" :pt "+i)},checkInteriorIntersections:function(){if(0===arguments.length)for(var t=this.segStrings.iterator();t.hasNext();)for(var e=t.next(),n=this.segStrings.iterator();n.hasNext();){var i=n.next();this.checkInteriorIntersections(e,i)}else if(2===arguments.length)for(var r=arguments[0],s=arguments[1],o=r.getCoordinates(),a=s.getCoordinates(),u=0;u<o.length-1;u++)for(var h=0;h<a.length-1;h++)this.checkInteriorIntersections(r,u,s,h);else if(4===arguments.length){var c=arguments[0],f=arguments[1],g=arguments[2],d=arguments[3];if(c===g&&f===d)return null;var p=c.getCoordinates()[f],v=c.getCoordinates()[f+1],m=g.getCoordinates()[d],y=g.getCoordinates()[d+1];if(this.li.computeIntersection(p,v,m,y),this.li.hasIntersection()&&(this.li.isProper()||this.hasInteriorIntersection(this.li,p,v)||this.hasInteriorIntersection(this.li,m,y)))throw new l("found non-noded intersection at "+p+"-"+v+" and "+m+"-"+y)}},checkValid:function(){this.checkEndPtVertexIntersections(),this.checkInteriorIntersections(),this.checkCollapses()},checkCollapses:function(){if(0===arguments.length)for(var t=this.segStrings.iterator();t.hasNext();){var e=t.next();this.checkCollapses(e)}else if(1===arguments.length)for(var n=arguments[0],i=n.getCoordinates(),t=0;t<i.length-2;t++)this.checkCollapse(i[t],i[t+1],i[t+2])},hasInteriorIntersection:function(t,e,n){for(var i=0;i<t.getIntersectionNum();i++){var r=t.getIntersection(i);if(!r.equals(e)&&!r.equals(n))return!0}return!1},checkCollapse:function(t,e,n){if(t.equals(n))throw new l("found non-noded collapse at "+Ji.fact.createLineString([t,e,n]))},interfaces_:function(){return[]},getClass:function(){return Ji}}),Ji.fact=new ie,e($i.prototype,{intersectsScaled:function(t,e){var n=Math.min(t.x,e.x),i=Math.max(t.x,e.x),r=Math.min(t.y,e.y),s=Math.max(t.y,e.y),o=this.maxx<n||this.minx>i||this.maxy<r||this.miny>s;if(o)return!1;var a=this.intersectsToleranceSquare(t,e);return f.isTrue(!(o&&a),"Found bad envelope test"),a},initCorners:function(t){var e=.5;this.minx=t.x-e,this.maxx=t.x+e,this.miny=t.y-e,this.maxy=t.y+e,this.corner[0]=new g(this.maxx,this.maxy),this.corner[1]=new g(this.minx,this.maxy),this.corner[2]=new g(this.minx,this.miny),this.corner[3]=new g(this.maxx,this.miny)},intersects:function(t,e){return 1===this.scaleFactor?this.intersectsScaled(t,e):(this.copyScaled(t,this.p0Scaled),this.copyScaled(e,this.p1Scaled),this.intersectsScaled(this.p0Scaled,this.p1Scaled))},scale:function(t){return Math.round(t*this.scaleFactor)},getCoordinate:function(){return this.originalPt},copyScaled:function(t,e){e.x=this.scale(t.x),e.y=this.scale(t.y)},getSafeEnvelope:function(){if(null===this.safeEnv){var t=$i.SAFE_ENV_EXPANSION_FACTOR/this.scaleFactor;this.safeEnv=new C(this.originalPt.x-t,this.originalPt.x+t,this.originalPt.y-t,this.originalPt.y+t)}return this.safeEnv},intersectsPixelClosure:function(t,e){return this.li.computeIntersection(t,e,this.corner[0],this.corner[1]),this.li.hasIntersection()?!0:(this.li.computeIntersection(t,e,this.corner[1],this.corner[2]),this.li.hasIntersection()?!0:(this.li.computeIntersection(t,e,this.corner[2],this.corner[3]),this.li.hasIntersection()?!0:(this.li.computeIntersection(t,e,this.corner[3],this.corner[0]),!!this.li.hasIntersection())))},intersectsToleranceSquare:function(t,e){var n=!1,i=!1;return this.li.computeIntersection(t,e,this.corner[0],this.corner[1]),this.li.isProper()?!0:(this.li.computeIntersection(t,e,this.corner[1],this.corner[2]),this.li.isProper()?!0:(this.li.hasIntersection()&&(n=!0),this.li.computeIntersection(t,e,this.corner[2],this.corner[3]),this.li.isProper()?!0:(this.li.hasIntersection()&&(i=!0),this.li.computeIntersection(t,e,this.corner[3],this.corner[0]),this.li.isProper()?!0:n&&i?!0:t.equals(this.pt)?!0:!!e.equals(this.pt))))},addSnappedNode:function(t,e){var n=t.getCoordinate(e),i=t.getCoordinate(e+1);return this.intersects(n,i)?(t.addIntersection(this.getCoordinate(),e),!0):!1},interfaces_:function(){return[]},getClass:function(){return $i}}),$i.SAFE_ENV_EXPANSION_FACTOR=.75,e(tr.prototype,{select:function(){if(1===arguments.length){arguments[0]}else if(2===arguments.length){var t=arguments[0],e=arguments[1];t.getLineSegment(e,this.selectedSegment),this.select(this.selectedSegment)}},interfaces_:function(){return[]},getClass:function(){return tr}}),e(er.prototype,{snap:function(){if(1===arguments.length){var t=arguments[0];return this.snap(t,null,-1)}if(3===arguments.length){var e=arguments[0],n=arguments[1],i=arguments[2],r=e.getSafeEnvelope(),s=new nr(e,n,i);return this.index.query(r,{interfaces_:function(){return[Ae]},visitItem:function(t){var e=t;e.select(r,s)}}),s.isNodeAdded()}},interfaces_:function(){return[]},getClass:function(){return er}}),h(nr,tr),e(nr.prototype,{isNodeAdded:function(){return this._isNodeAdded},select:function(){if(2!==arguments.length)return tr.prototype.select.apply(this,arguments);var t=arguments[0],e=arguments[1],n=t.getContext();return null!==this.parentEdge&&n===this.parentEdge&&e===this.hotPixelVertexIndex?null:void(this._isNodeAdded=this.hotPixel.addSnappedNode(n,e))},interfaces_:function(){return[]},getClass:function(){return nr}}),er.HotPixelSnapAction=nr,e(ir.prototype,{processIntersections:function(t,e,n,i){if(t===n&&e===i)return null;var r=t.getCoordinates()[e],s=t.getCoordinates()[e+1],o=n.getCoordinates()[i],a=n.getCoordinates()[i+1];if(this.li.computeIntersection(r,s,o,a),this.li.hasIntersection()&&this.li.isInteriorIntersection()){for(var u=0;u<this.li.getIntersectionNum();u++)this.interiorIntersections.add(this.li.getIntersection(u));t.addIntersections(this.li,e,0),n.addIntersections(this.li,i,1)}},isDone:function(){return!1},getInteriorIntersections:function(){return this.interiorIntersections},interfaces_:function(){return[on]},getClass:function(){return ir}}),e(rr.prototype,{checkCorrectness:function(t){var e=Ke.getNodedSubstrings(t),n=new Ji(e);try{n.checkValid()}catch(t){if(!(t instanceof S))throw t;t.printStackTrace()}finally{}},getNodedSubstrings:function(){return Ke.getNodedSubstrings(this.nodedSegStrings)},snapRound:function(t,e){var n=this.findInteriorIntersections(t,e);this.computeIntersectionSnaps(n),this.computeVertexSnaps(t)},findInteriorIntersections:function(t,e){var n=new ir(e);return this.noder.setSegmentIntersector(n),this.noder.computeNodes(t),n.getInteriorIntersections()},computeVertexSnaps:function(){if(R(arguments[0],v))for(var t=arguments[0],e=t.iterator();e.hasNext();){var n=e.next();this.computeVertexSnaps(n)}else if(arguments[0]instanceof Ke)for(var i=arguments[0],r=i.getCoordinates(),s=0;s<r.length;s++){var o=new $i(r[s],this.scaleFactor,this.li),a=this.pointSnapper.snap(o,i,s);a&&i.addIntersection(r[s],s)}},computeNodes:function(t){this.nodedSegStrings=t,this.noder=new nn,this.pointSnapper=new er(this.noder.getIndex()),this.snapRound(t,this.li)},computeIntersectionSnaps:function(t){for(var e=t.iterator();e.hasNext();){var n=e.next(),i=new $i(n,this.scaleFactor,this.li);this.pointSnapper.snap(i)}},interfaces_:function(){return[tn]},getClass:function(){return rr}}),e(sr.prototype,{bufferFixedPrecision:function(t){var e=new Fi(new rr(new ee(1)),t.getScale()),n=new Qi(this.bufParams);n.setWorkingPrecisionModel(t),n.setNoder(e),this.resultGeometry=n.buffer(this.argGeom,this.distance)},bufferReducedPrecision:function(){if(0===arguments.length){for(var t=sr.MAX_PRECISION_DIGITS;t>=0;t--){try{this.bufferReducedPrecision(t)}catch(t){if(!(t instanceof sn))throw t;this.saveException=t}finally{}if(null!==this.resultGeometry)return null}throw this.saveException}if(1===arguments.length){var e=arguments[0],n=sr.precisionScaleFactor(this.argGeom,this.distance,e),i=new ee(n);this.bufferFixedPrecision(i)}},computeGeometry:function(){if(this.bufferOriginalPrecision(),null!==this.resultGeometry)return null;var t=this.argGeom.getFactory().getPrecisionModel();t.getType()===ee.FIXED?this.bufferFixedPrecision(t):this.bufferReducedPrecision()},setQuadrantSegments:function(t){this.bufParams.setQuadrantSegments(t)},bufferOriginalPrecision:function(){try{var t=new Qi(this.bufParams);this.resultGeometry=t.buffer(this.argGeom,this.distance)}catch(t){if(!(t instanceof l))throw t;this.saveException=t}finally{}},getResultGeometry:function(t){return this.distance=t,this.computeGeometry(),this.resultGeometry},setEndCapStyle:function(t){this.bufParams.setEndCapStyle(t)},interfaces_:function(){return[]},getClass:function(){return sr}}),sr.bufferOp=function(){if(2===arguments.length){var t=arguments[0],e=arguments[1],n=new sr(t),i=n.getResultGeometry(e);return i}if(3===arguments.length){if(Number.isInteger(arguments[2])&&arguments[0]instanceof B&&"number"==typeof arguments[1]){var r=arguments[0],s=arguments[1],o=arguments[2],a=new sr(r);a.setQuadrantSegments(o);var i=a.getResultGeometry(s);return i}if(arguments[2]instanceof Bi&&arguments[0]instanceof B&&"number"==typeof arguments[1]){var u=arguments[0],l=arguments[1],h=arguments[2],a=new sr(u,h),i=a.getResultGeometry(l);return i}}else if(4===arguments.length){var c=arguments[0],f=arguments[1],g=arguments[2],d=arguments[3],a=new sr(c);a.setQuadrantSegments(g),a.setEndCapStyle(d);var i=a.getResultGeometry(f);return i}},sr.precisionScaleFactor=function(t,e,n){var i=t.getEnvelopeInternal(),r=T.max(Math.abs(i.getMaxX()),Math.abs(i.getMaxY()),Math.abs(i.getMinX()),Math.abs(i.getMinY())),s=e>0?e:0,o=r+2*s,a=Math.trunc(Math.log(o)/Math.log(10)+1),u=n-a,l=Math.pow(10,u);return l},sr.CAP_ROUND=Bi.CAP_ROUND,sr.CAP_BUTT=Bi.CAP_FLAT,sr.CAP_FLAT=Bi.CAP_FLAT,sr.CAP_SQUARE=Bi.CAP_SQUARE,sr.MAX_PRECISION_DIGITS=12;var Co=Object.freeze({BufferOp:sr,BufferParameters:Bi});e(or.prototype,{filter:function(t){t instanceof Tt&&this.comps.add(t)},interfaces_:function(){return[ht]},getClass:function(){return or}}),or.getPolygons=function(){if(1===arguments.length){var t=arguments[0];return or.getPolygons(t,new I)}if(2===arguments.length){var e=arguments[0],n=arguments[1];return e instanceof Tt?n.add(e):e instanceof ft&&e.apply(new or(n)),n}},e(ar.prototype,{isInsideArea:function(){return this.segIndex===ar.INSIDE_AREA},getCoordinate:function(){return this.pt},getGeometryComponent:function(){return this.component},getSegmentIndex:function(){return this.segIndex},interfaces_:function(){return[]},getClass:function(){return ar}}),ar.INSIDE_AREA=-1,e(ur.prototype,{filter:function(t){t instanceof Lt&&this.pts.add(t)},interfaces_:function(){return[ht]},getClass:function(){return ur}}),ur.getPoints=function(){if(1===arguments.length){var t=arguments[0];return t instanceof Lt?ho.singletonList(t):ur.getPoints(t,new I)}if(2===arguments.length){var e=arguments[0],n=arguments[1];return e instanceof Lt?n.add(e):e instanceof ft&&e.apply(new ur(n)),n}},e(lr.prototype,{filter:function(t){(t instanceof Lt||t instanceof St||t instanceof Tt)&&this.locations.add(new ar(t,0,t.getCoordinate()))},interfaces_:function(){return[ht]},getClass:function(){return lr}}),lr.getLocations=function(t){var e=new I;return t.apply(new lr(e)),e},e(hr.prototype,{computeContainmentDistance:function(){if(0===arguments.length){var t=new Array(2).fill(null);if(this.computeContainmentDistance(0,t),this.minDistance<=this.terminateDistance)return null;this.computeContainmentDistance(1,t)}else if(2===arguments.length){var e=arguments[0],n=arguments[1],i=1-e,r=or.getPolygons(this.geom[e]);if(r.size()>0){var s=lr.getLocations(this.geom[i]);if(this.computeContainmentDistance(s,r,n),this.minDistance<=this.terminateDistance)return this.minDistanceLocation[i]=n[0],this.minDistanceLocation[e]=n[1],null}}else if(3===arguments.length)if(arguments[2]instanceof Array&&R(arguments[0],y)&&R(arguments[1],y)){for(var o=arguments[0],a=arguments[1],u=arguments[2],l=0;l<o.size();l++)for(var h=o.get(l),c=0;c<a.size();c++)if(this.computeContainmentDistance(h,a.get(c),u),this.minDistance<=this.terminateDistance)return null}else if(arguments[2]instanceof Array&&arguments[0]instanceof ar&&arguments[1]instanceof Tt){var f=arguments[0],g=arguments[1],d=arguments[2],p=f.getCoordinate();if(L.EXTERIOR!==this.ptLocator.locate(p,g))return this.minDistance=0,d[0]=f,d[1]=new ar(g,p),null}},computeMinDistanceLinesPoints:function(t,e,n){for(var i=0;i<t.size();i++)for(var r=t.get(i),s=0;s<e.size();s++){var o=e.get(s);if(this.computeMinDistance(r,o,n),this.minDistance<=this.terminateDistance)return null}},computeFacetDistance:function(){var t=new Array(2).fill(null),e=kn.getLines(this.geom[0]),n=kn.getLines(this.geom[1]),i=ur.getPoints(this.geom[0]),r=ur.getPoints(this.geom[1]);return this.computeMinDistanceLines(e,n,t),this.updateMinDistance(t,!1),this.minDistance<=this.terminateDistance?null:(t[0]=null,t[1]=null,this.computeMinDistanceLinesPoints(e,r,t),this.updateMinDistance(t,!1),this.minDistance<=this.terminateDistance?null:(t[0]=null,t[1]=null,this.computeMinDistanceLinesPoints(n,i,t),this.updateMinDistance(t,!0),this.minDistance<=this.terminateDistance?null:(t[0]=null,t[1]=null,this.computeMinDistancePoints(i,r,t),void this.updateMinDistance(t,!1))))},nearestLocations:function(){return this.computeMinDistance(),this.minDistanceLocation},updateMinDistance:function(t,e){return null===t[0]?null:void(e?(this.minDistanceLocation[0]=t[1],this.minDistanceLocation[1]=t[0]):(this.minDistanceLocation[0]=t[0],this.minDistanceLocation[1]=t[1]))},nearestPoints:function(){this.computeMinDistance();var t=[this.minDistanceLocation[0].getCoordinate(),this.minDistanceLocation[1].getCoordinate()];return t},computeMinDistance:function(){if(0===arguments.length){if(null!==this.minDistanceLocation)return null;if(this.minDistanceLocation=new Array(2).fill(null),this.computeContainmentDistance(),this.minDistance<=this.terminateDistance)return null;this.computeFacetDistance()}else if(3===arguments.length)if(arguments[2]instanceof Array&&arguments[0]instanceof St&&arguments[1]instanceof Lt){var t=arguments[0],e=arguments[1],n=arguments[2];if(t.getEnvelopeInternal().distance(e.getEnvelopeInternal())>this.minDistance)return null;for(var i=t.getCoordinates(),r=e.getCoordinate(),s=0;s<i.length-1;s++){var o=he.distancePointLine(r,i[s],i[s+1]);if(o<this.minDistance){this.minDistance=o;var a=new ce(i[s],i[s+1]),u=a.closestPoint(r);n[0]=new ar(t,s,u),n[1]=new ar(e,0,r)}if(this.minDistance<=this.terminateDistance)return null}}else if(arguments[2]instanceof Array&&arguments[0]instanceof St&&arguments[1]instanceof St){var l=arguments[0],h=arguments[1],c=arguments[2];if(l.getEnvelopeInternal().distance(h.getEnvelopeInternal())>this.minDistance)return null;for(var i=l.getCoordinates(),f=h.getCoordinates(),s=0;s<i.length-1;s++)for(var g=0;g<f.length-1;g++){var o=he.distanceLineLine(i[s],i[s+1],f[g],f[g+1]);if(o<this.minDistance){this.minDistance=o;var d=new ce(i[s],i[s+1]),p=new ce(f[g],f[g+1]),v=d.closestPoints(p);c[0]=new ar(l,s,v[0]),c[1]=new ar(h,g,v[1])}if(this.minDistance<=this.terminateDistance)return null}}},computeMinDistancePoints:function(t,e,n){for(var i=0;i<t.size();i++)for(var r=t.get(i),s=0;s<e.size();s++){var o=e.get(s),a=r.getCoordinate().distance(o.getCoordinate());if(a<this.minDistance&&(this.minDistance=a,n[0]=new ar(r,0,r.getCoordinate()),n[1]=new ar(o,0,o.getCoordinate())),this.minDistance<=this.terminateDistance)return null}},distance:function(){if(null===this.geom[0]||null===this.geom[1])throw new i("null geometries are not supported");return this.geom[0].isEmpty()||this.geom[1].isEmpty()?0:(this.computeMinDistance(),this.minDistance)},computeMinDistanceLines:function(t,e,n){for(var i=0;i<t.size();i++)for(var r=t.get(i),s=0;s<e.size();s++){var o=e.get(s);if(this.computeMinDistance(r,o,n),this.minDistance<=this.terminateDistance)return null}},interfaces_:function(){return[]},getClass:function(){return hr}}),hr.distance=function(t,e){var n=new hr(t,e);return n.distance()},hr.isWithinDistance=function(t,e,n){var i=new hr(t,e,n);return i.distance()<=n},hr.nearestPoints=function(t,e){var n=new hr(t,e);return n.nearestPoints()};var So=Object.freeze({DistanceOp:hr});e(cr.prototype,{getCoordinates:function(){if(null===this.coordinates){for(var t=0,e=0,n=new N,i=this.directedEdges.iterator();i.hasNext();){var r=i.next();r.getEdgeDirection()?t++:e++,n.add(r.getEdge().getLine().getCoordinates(),!1,r.getEdgeDirection())}this.coordinates=n.toCoordinateArray(),e>t&&H.reverse(this.coordinates)}return this.coordinates},toLineString:function(){return this.factory.createLineString(this.getCoordinates())},add:function(t){this.directedEdges.add(t)},interfaces_:function(){return[]},getClass:function(){return cr}}),e(fr.prototype,{setVisited:function(t){this._isVisited=t},isMarked:function(){return this._isMarked},setData:function(t){this.data=t},getData:function(){return this.data},setMarked:function(t){this._isMarked=t},getContext:function(){return this.data},isVisited:function(){return this._isVisited},setContext:function(t){this.data=t},interfaces_:function(){return[]},getClass:function(){return fr}}),fr.getComponentWithVisitedState=function(t,e){for(;t.hasNext();){var n=t.next();if(n.isVisited()===e)return n}return null},fr.setVisited=function(t,e){for(;t.hasNext();){var n=t.next();n.setVisited(e)}},fr.setMarked=function(t,e){for(;t.hasNext();){var n=t.next();n.setMarked(e)}},h(gr,fr),e(gr.prototype,{isRemoved:function(){return null===this.parentEdge},compareDirection:function(t){return this.quadrant>t.quadrant?1:this.quadrant<t.quadrant?-1:he.computeOrientation(t.p0,t.p1,this.p1)},getCoordinate:function(){return this.from.getCoordinate()},print:function(t){var e=this.getClass().getName(),n=e.lastIndexOf("."),i=e.substring(n+1);t.print("  "+i+": "+this.p0+" - "+this.p1+" "+this.quadrant+":"+this.angle)},getDirectionPt:function(){return this.p1},getAngle:function(){return this.angle},compareTo:function(t){var e=t;return this.compareDirection(e)},getFromNode:function(){return this.from},getSym:function(){return this.sym},setEdge:function(t){this.parentEdge=t},remove:function(){this.sym=null,this.parentEdge=null},getEdge:function(){return this.parentEdge},getQuadrant:function(){return this.quadrant},setSym:function(t){this.sym=t},getToNode:function(){return this.to},getEdgeDirection:function(){return this.edgeDirection},interfaces_:function(){return[s]},getClass:function(){return gr}}),gr.toEdges=function(t){for(var e=new I,n=t.iterator();n.hasNext();)e.add(n.next().parentEdge);return e},h(dr,gr),e(dr.prototype,{getNext:function(){return 2!==this.getToNode().getDegree()?null:this.getToNode().getOutEdges().getEdges().get(0)===this.getSym()?this.getToNode().getOutEdges().getEdges().get(1):(f.isTrue(this.getToNode().getOutEdges().getEdges().get(1)===this.getSym()),this.getToNode().getOutEdges().getEdges().get(0))},interfaces_:function(){return[]},getClass:function(){return dr}}),h(pr,fr),e(pr.prototype,{isRemoved:function(){return null===this.dirEdge},setDirectedEdges:function(t,e){this.dirEdge=[t,e],t.setEdge(this),e.setEdge(this),t.setSym(e),e.setSym(t),t.getFromNode().addOutEdge(t),e.getFromNode().addOutEdge(e)},getDirEdge:function(){if(Number.isInteger(arguments[0])){var t=arguments[0];return this.dirEdge[t]}if(arguments[0]instanceof mr){var e=arguments[0];return this.dirEdge[0].getFromNode()===e?this.dirEdge[0]:this.dirEdge[1].getFromNode()===e?this.dirEdge[1]:null}},remove:function(){this.dirEdge=null},getOppositeNode:function(t){return this.dirEdge[0].getFromNode()===t?this.dirEdge[0].getToNode():this.dirEdge[1].getFromNode()===t?this.dirEdge[1].getToNode():null},interfaces_:function(){return[]},getClass:function(){return pr}}),e(vr.prototype,{getNextEdge:function(t){var e=this.getIndex(t);return this.outEdges.get(this.getIndex(e+1))},getCoordinate:function(){var t=this.iterator();if(!t.hasNext())return null;var e=t.next();return e.getCoordinate()},iterator:function(){return this.sortEdges(),this.outEdges.iterator()},sortEdges:function(){this.sorted||(ho.sort(this.outEdges),this.sorted=!0)},remove:function(t){this.outEdges.remove(t)},getEdges:function(){return this.sortEdges(),this.outEdges},getNextCWEdge:function(t){var e=this.getIndex(t);return this.outEdges.get(this.getIndex(e-1))},getIndex:function(){if(arguments[0]instanceof pr){var t=arguments[0];this.sortEdges();for(var e=0;e<this.outEdges.size();e++){var n=this.outEdges.get(e);if(n.getEdge()===t)return e}return-1}if(arguments[0]instanceof gr){var i=arguments[0];this.sortEdges();for(var e=0;e<this.outEdges.size();e++){var n=this.outEdges.get(e);if(n===i)return e}return-1}if(Number.isInteger(arguments[0])){var r=arguments[0],s=r%this.outEdges.size();return 0>s&&(s+=this.outEdges.size()),s}},add:function(t){this.outEdges.add(t),this.sorted=!1},getDegree:function(){return this.outEdges.size()},interfaces_:function(){return[]},getClass:function(){return vr}}),h(mr,fr),e(mr.prototype,{isRemoved:function(){return null===this.pt},addOutEdge:function(t){this.deStar.add(t)},getCoordinate:function(){return this.pt},getOutEdges:function(){return this.deStar},remove:function(){if(0===arguments.length)this.pt=null;else if(1===arguments.length){var t=arguments[0];this.deStar.remove(t)}},getIndex:function(t){return this.deStar.getIndex(t)},getDegree:function(){return this.deStar.getDegree()},interfaces_:function(){return[]},getClass:function(){return mr}}),mr.getEdgesBetween=function(t,e){var n=gr.toEdges(t.getOutEdges().getEdges()),i=new J(n),r=gr.toEdges(e.getOutEdges().getEdges());return i.retainAll(r),i},h(yr,pr),e(yr.prototype,{getLine:function(){return this.line},interfaces_:function(){return[]},getClass:function(){return yr}}),e(xr.prototype,{find:function(t){return this.nodeMap.get(t)},iterator:function(){return this.nodeMap.values().iterator()},remove:function(t){return this.nodeMap.remove(t)},values:function(){return this.nodeMap.values()},add:function(t){return this.nodeMap.put(t.getCoordinate(),t),t},interfaces_:function(){return[]},getClass:function(){return xr}}),e(Er.prototype,{findNodesOfDegree:function(t){for(var e=new I,n=this.nodeIterator();n.hasNext();){var i=n.next();i.getDegree()===t&&e.add(i)}return e},dirEdgeIterator:function(){return this.dirEdges.iterator()},edgeIterator:function(){return this.edges.iterator()},remove:function(){if(arguments[0]instanceof pr){var t=arguments[0];this.remove(t.getDirEdge(0)),this.remove(t.getDirEdge(1)),this.edges.remove(t),t.remove()}else if(arguments[0]instanceof gr){var e=arguments[0],n=e.getSym();null!==n&&n.setSym(null),e.getFromNode().remove(e),e.remove(),this.dirEdges.remove(e)}else if(arguments[0]instanceof mr){for(var i=arguments[0],r=i.getOutEdges().getEdges(),s=r.iterator();s.hasNext();){var o=s.next(),n=o.getSym();null!==n&&this.remove(n),this.dirEdges.remove(o);var a=o.getEdge();null!==a&&this.edges.remove(a)}this.nodeMap.remove(i.getCoordinate()),i.remove()}},findNode:function(t){return this.nodeMap.find(t)},getEdges:function(){return this.edges},nodeIterator:function(){return this.nodeMap.iterator()},contains:function(){if(arguments[0]instanceof pr){var t=arguments[0];return this.edges.contains(t)}if(arguments[0]instanceof gr){var e=arguments[0];return this.dirEdges.contains(e)}},add:function(){if(arguments[0]instanceof mr){var t=arguments[0];this.nodeMap.add(t)}else if(arguments[0]instanceof pr){var e=arguments[0];this.edges.add(e),this.add(e.getDirEdge(0)),this.add(e.getDirEdge(1))}else if(arguments[0]instanceof gr){var n=arguments[0];this.dirEdges.add(n)}},getNodes:function(){return this.nodeMap.values()},interfaces_:function(){return[]},getClass:function(){return Er}}),h(Ir,Er),e(Ir.prototype,{addEdge:function(t){if(t.isEmpty())return null;var e=H.removeRepeatedPoints(t.getCoordinates());if(e.length<=1)return null;var n=e[0],i=e[e.length-1],r=this.getNode(n),s=this.getNode(i),o=new dr(r,s,e[1],!0),a=new dr(s,r,e[e.length-2],!1),u=new yr(t);u.setDirectedEdges(o,a),this.add(u)},getNode:function(t){var e=this.findNode(t);return null===e&&(e=new mr(t),this.add(e)),e},interfaces_:function(){return[]},getClass:function(){return Ir}}),e(Nr.prototype,{buildEdgeStringsForUnprocessedNodes:function(){for(var t=this.graph.getNodes().iterator();t.hasNext();){var e=t.next();e.isMarked()||(f.isTrue(2===e.getDegree()),this.buildEdgeStringsStartingAt(e),e.setMarked(!0))}},buildEdgeStringsForNonDegree2Nodes:function(){for(var t=this.graph.getNodes().iterator();t.hasNext();){var e=t.next();2!==e.getDegree()&&(this.buildEdgeStringsStartingAt(e),e.setMarked(!0))}},buildEdgeStringsForObviousStartNodes:function(){this.buildEdgeStringsForNonDegree2Nodes()},getMergedLineStrings:function(){return this.merge(),this.mergedLineStrings},buildEdgeStringsStartingAt:function(t){for(var e=t.getOutEdges().iterator();e.hasNext();){var n=e.next();n.getEdge().isMarked()||this.edgeStrings.add(this.buildEdgeStringStartingWith(n))}},merge:function(){if(null!==this.mergedLineStrings)return null;fr.setMarked(this.graph.nodeIterator(),!1),fr.setMarked(this.graph.edgeIterator(),!1),this.edgeStrings=new I,this.buildEdgeStringsForObviousStartNodes(),this.buildEdgeStringsForIsolatedLoops(),this.mergedLineStrings=new I;for(var t=this.edgeStrings.iterator();t.hasNext();){var e=t.next();this.mergedLineStrings.add(e.toLineString())}},buildEdgeStringStartingWith:function(t){var e=new cr(this.factory),n=t;do e.add(n),n.getEdge().setMarked(!0),n=n.getNext();while(null!==n&&n!==t);return e},add:function(){if(arguments[0]instanceof B){var t=arguments[0];t.apply({interfaces_:function(){return[q]},filter:function(t){t instanceof St&&this.add(t)}})}else if(R(arguments[0],v)){var e=arguments[0];this.mergedLineStrings=null;for(var n=e.iterator();n.hasNext();){
var i=n.next();this.add(i)}}else if(arguments[0]instanceof St){var r=arguments[0];null===this.factory&&(this.factory=r.getFactory()),this.graph.addEdge(r)}},buildEdgeStringsForIsolatedLoops:function(){this.buildEdgeStringsForUnprocessedNodes()},interfaces_:function(){return[]},getClass:function(){return Nr}});var wo=Object.freeze({LineMerger:Nr}),Lo=Object.freeze({OverlayOp:ii});h(Cr,gr),e(Cr.prototype,{getNext:function(){return this.next},isInRing:function(){return null!==this.edgeRing},setRing:function(t){this.edgeRing=t},setLabel:function(t){this.label=t},getLabel:function(){return this.label},setNext:function(t){this.next=t},getRing:function(){return this.edgeRing},interfaces_:function(){return[]},getClass:function(){return Cr}}),h(Sr,pr),e(Sr.prototype,{getLine:function(){return this.line},interfaces_:function(){return[]},getClass:function(){return Sr}}),e(wr.prototype,{isIncluded:function(){return this._isIncluded},getCoordinates:function(){if(null===this.ringPts){for(var t=new N,e=this.deList.iterator();e.hasNext();){var n=e.next(),i=n.getEdge();wr.addEdge(i.getLine().getCoordinates(),n.getEdgeDirection(),t)}this.ringPts=t.toCoordinateArray()}return this.ringPts},isIncludedSet:function(){return this._isIncludedSet},isValid:function(){return this.getCoordinates(),this.ringPts.length<=3?!1:(this.getRing(),this.ring.isValid())},build:function(t){var e=t;do this.add(e),e.setRing(this),e=e.getNext(),f.isTrue(null!==e,"found null DE in ring"),f.isTrue(e===t||!e.isInRing(),"found DE already in ring");while(e!==t)},isOuterHole:function(){return this._isHole?!this.hasShell():!1},getPolygon:function(){var t=null;if(null!==this.holes){t=new Array(this.holes.size()).fill(null);for(var e=0;e<this.holes.size();e++)t[e]=this.holes.get(e)}var n=this.factory.createPolygon(this.ring,t);return n},isHole:function(){return this._isHole},isProcessed:function(){return this._isProcessed},addHole:function(){if(arguments[0]instanceof bt){var t=arguments[0];null===this.holes&&(this.holes=new I),this.holes.add(t)}else if(arguments[0]instanceof wr){var e=arguments[0];e.setShell(this);var n=e.getRing();null===this.holes&&(this.holes=new I),this.holes.add(n)}},setIncluded:function(t){this._isIncluded=t,this._isIncludedSet=!0},getOuterHole:function(){if(this.isHole())return null;for(var t=0;t<this.deList.size();t++){var e=this.deList.get(t),n=e.getSym().getRing();if(n.isOuterHole())return n}return null},computeHole:function(){var t=this.getRing();this._isHole=he.isCCW(t.getCoordinates())},hasShell:function(){return null!==this.shell},isOuterShell:function(){return null!==this.getOuterHole()},getLineString:function(){return this.getCoordinates(),this.factory.createLineString(this.ringPts)},toString:function(){return se.toLineString(new Gt(this.getCoordinates()))},getShell:function(){return this.isHole()?this.shell:this},add:function(t){this.deList.add(t)},getRing:function(){if(null!==this.ring)return this.ring;this.getCoordinates(),this.ringPts.length<3&&A.out.println(this.ringPts);try{this.ring=this.factory.createLinearRing(this.ringPts)}catch(t){if(!(t instanceof S))throw t;A.out.println(this.ringPts)}finally{}return this.ring},updateIncluded:function(){if(this.isHole())return null;for(var t=0;t<this.deList.size();t++){var e=this.deList.get(t),n=e.getSym().getRing().getShell();if(null!==n&&n.isIncludedSet())return this.setIncluded(!n.isIncluded()),null}},setShell:function(t){this.shell=t},setProcessed:function(t){this._isProcessed=t},interfaces_:function(){return[]},getClass:function(){return wr}}),wr.findDirEdgesInRing=function(t){var e=t,n=new I;do n.add(e),e=e.getNext(),f.isTrue(null!==e,"found null DE in ring"),f.isTrue(e===t||!e.isInRing(),"found DE already in ring");while(e!==t);return n},wr.addEdge=function(t,e,n){if(e)for(var i=0;i<t.length;i++)n.add(t[i],!1);else for(var i=t.length-1;i>=0;i--)n.add(t[i],!1)},wr.findEdgeRingContaining=function(t,e){for(var n=t.getRing(),i=n.getEnvelopeInternal(),r=n.getCoordinateN(0),s=null,o=null,a=e.iterator();a.hasNext();){var u=a.next(),l=u.getRing(),h=l.getEnvelopeInternal();if(!h.equals(i)&&h.contains(i)){r=H.ptNotInList(n.getCoordinates(),l.getCoordinates());var c=!1;he.isPointInRing(r,l.getCoordinates())&&(c=!0),c&&(null===s||o.contains(h))&&(s=u,o=s.getRing().getEnvelopeInternal())}}return s},e(Lr.prototype,{compare:function(t,e){var n=t,i=e;return n.getRing().getEnvelope().compareTo(i.getRing().getEnvelope())},interfaces_:function(){return[a]},getClass:function(){return Lr}}),wr.EnvelopeComparator=Lr,h(Rr,Er),e(Rr.prototype,{findEdgeRing:function(t){var e=new wr(this.factory);return e.build(t),e},computeDepthParity:function(){if(0===arguments.length)for(;;){var t=null;if(null===t)return null;this.computeDepthParity(t)}else if(1===arguments.length){arguments[0]}},computeNextCWEdges:function(){for(var t=this.nodeIterator();t.hasNext();){var e=t.next();Rr.computeNextCWEdges(e)}},addEdge:function(t){if(t.isEmpty())return null;var e=H.removeRepeatedPoints(t.getCoordinates());if(e.length<2)return null;var n=e[0],i=e[e.length-1],r=this.getNode(n),s=this.getNode(i),o=new Cr(r,s,e[1],!0),a=new Cr(s,r,e[e.length-2],!1),u=new Sr(t);u.setDirectedEdges(o,a),this.add(u)},deleteCutEdges:function(){this.computeNextCWEdges(),Rr.findLabeledEdgeRings(this.dirEdges);for(var t=new I,e=this.dirEdges.iterator();e.hasNext();){var n=e.next();if(!n.isMarked()){var i=n.getSym();if(n.getLabel()===i.getLabel()){n.setMarked(!0),i.setMarked(!0);var r=n.getEdge();t.add(r.getLine())}}}return t},getEdgeRings:function(){this.computeNextCWEdges(),Rr.label(this.dirEdges,-1);var t=Rr.findLabeledEdgeRings(this.dirEdges);this.convertMaximalToMinimalEdgeRings(t);for(var e=new I,n=this.dirEdges.iterator();n.hasNext();){var i=n.next();if(!i.isMarked()&&!i.isInRing()){var r=this.findEdgeRing(i);e.add(r)}}return e},getNode:function(t){var e=this.findNode(t);return null===e&&(e=new mr(t),this.add(e)),e},convertMaximalToMinimalEdgeRings:function(t){for(var e=t.iterator();e.hasNext();){var n=e.next(),i=n.getLabel(),r=Rr.findIntersectionNodes(n,i);if(null!==r)for(var s=r.iterator();s.hasNext();){var o=s.next();Rr.computeNextCCWEdges(o,i)}}},deleteDangles:function(){for(var t=this.findNodesOfDegree(1),e=new J,n=new pe,i=t.iterator();i.hasNext();)n.push(i.next());for(;!n.isEmpty();){var r=n.pop();Rr.deleteAllEdges(r);for(var s=r.getOutEdges().getEdges(),i=s.iterator();i.hasNext();){var o=i.next();o.setMarked(!0);var a=o.getSym();null!==a&&a.setMarked(!0);var u=o.getEdge();e.add(u.getLine());var l=o.getToNode();1===Rr.getDegreeNonDeleted(l)&&n.push(l)}}return e},interfaces_:function(){return[]},getClass:function(){return Rr}}),Rr.findLabeledEdgeRings=function(t){for(var e=new I,n=1,i=t.iterator();i.hasNext();){var r=i.next();if(!(r.isMarked()||r.getLabel()>=0)){e.add(r);var s=wr.findDirEdgesInRing(r);Rr.label(s,n),n++}}return e},Rr.getDegreeNonDeleted=function(t){for(var e=t.getOutEdges().getEdges(),n=0,i=e.iterator();i.hasNext();){var r=i.next();r.isMarked()||n++}return n},Rr.deleteAllEdges=function(t){for(var e=t.getOutEdges().getEdges(),n=e.iterator();n.hasNext();){var i=n.next();i.setMarked(!0);var r=i.getSym();null!==r&&r.setMarked(!0)}},Rr.label=function(t,e){for(var n=t.iterator();n.hasNext();){var i=n.next();i.setLabel(e)}},Rr.computeNextCWEdges=function(t){for(var e=t.getOutEdges(),n=null,i=null,r=e.getEdges().iterator();r.hasNext();){var s=r.next();if(!s.isMarked()){if(null===n&&(n=s),null!==i){var o=i.getSym();o.setNext(s)}i=s}}if(null!==i){var o=i.getSym();o.setNext(n)}},Rr.computeNextCCWEdges=function(t,e){for(var n=t.getOutEdges(),i=null,r=null,s=n.getEdges(),o=s.size()-1;o>=0;o--){var a=s.get(o),u=a.getSym(),l=null;a.getLabel()===e&&(l=a);var h=null;u.getLabel()===e&&(h=u),null===l&&null===h||(null!==h&&(r=h),null!==l&&(null!==r&&(r.setNext(l),r=null),null===i&&(i=l)))}null!==r&&(f.isTrue(null!==i),r.setNext(i))},Rr.getDegree=function(t,e){for(var n=t.getOutEdges().getEdges(),i=0,r=n.iterator();r.hasNext();){var s=r.next();s.getLabel()===e&&i++}return i},Rr.findIntersectionNodes=function(t,e){var n=t,i=null;do{var r=n.getFromNode();Rr.getDegree(r,e)>1&&(null===i&&(i=new I),i.add(r)),n=n.getNext(),f.isTrue(null!==n,"found null DE in ring"),f.isTrue(n===t||!n.isInRing(),"found DE already in ring")}while(n!==t);return i},e(Tr.prototype,{getGeometry:function(){return null===this.geomFactory&&(this.geomFactory=new ie),this.polygonize(),this.extractOnlyPolygonal?this.geomFactory.buildGeometry(this.polyList):this.geomFactory.createGeometryCollection(ie.toGeometryArray(this.polyList))},getInvalidRingLines:function(){return this.polygonize(),this.invalidRingLines},findValidRings:function(t,e,n){for(var i=t.iterator();i.hasNext();){var r=i.next();r.isValid()?e.add(r):n.add(r.getLineString())}},polygonize:function(){if(null!==this.polyList)return null;if(this.polyList=new I,null===this.graph)return null;this.dangles=this.graph.deleteDangles(),this.cutEdges=this.graph.deleteCutEdges();var t=this.graph.getEdgeRings(),e=new I;this.invalidRingLines=new I,this.isCheckingRingsValid?this.findValidRings(t,e,this.invalidRingLines):e=t,this.findShellsAndHoles(e),Tr.assignHolesToShells(this.holeList,this.shellList),ho.sort(this.shellList,new wr.EnvelopeComparator);var n=!0;this.extractOnlyPolygonal&&(Tr.findDisjointShells(this.shellList),n=!1),this.polyList=Tr.extractPolygons(this.shellList,n)},getDangles:function(){return this.polygonize(),this.dangles},getCutEdges:function(){return this.polygonize(),this.cutEdges},getPolygons:function(){return this.polygonize(),this.polyList},add:function(){if(R(arguments[0],v))for(var t=arguments[0],e=t.iterator();e.hasNext();){var n=e.next();this.add(n)}else if(arguments[0]instanceof St){var i=arguments[0];this.geomFactory=i.getFactory(),null===this.graph&&(this.graph=new Rr(this.geomFactory)),this.graph.addEdge(i)}else if(arguments[0]instanceof B){var r=arguments[0];r.apply(this.lineStringAdder)}},setCheckRingsValid:function(t){this.isCheckingRingsValid=t},findShellsAndHoles:function(t){this.holeList=new I,this.shellList=new I;for(var e=t.iterator();e.hasNext();){var n=e.next();n.computeHole(),n.isHole()?this.holeList.add(n):this.shellList.add(n)}},interfaces_:function(){return[]},getClass:function(){return Tr}}),Tr.findOuterShells=function(t){for(var e=t.iterator();e.hasNext();){var n=e.next(),i=n.getOuterHole();null===i||i.isProcessed()||(n.setIncluded(!0),i.setProcessed(!0))}},Tr.extractPolygons=function(t,e){for(var n=new I,i=t.iterator();i.hasNext();){var r=i.next();(e||r.isIncluded())&&n.add(r.getPolygon())}return n},Tr.assignHolesToShells=function(t,e){for(var n=t.iterator();n.hasNext();){var i=n.next();Tr.assignHoleToShell(i,e)}},Tr.assignHoleToShell=function(t,e){var n=wr.findEdgeRingContaining(t,e);null!==n&&n.addHole(t)},Tr.findDisjointShells=function(t){Tr.findOuterShells(t);var e=null;do{e=!1;for(var n=t.iterator();n.hasNext();){var i=n.next();i.isIncludedSet()||(i.updateIncluded(),i.isIncludedSet()||(e=!0))}}while(e)},e(Pr.prototype,{filter:function(t){t instanceof St&&this.p.add(t)},interfaces_:function(){return[q]},getClass:function(){return Pr}}),Tr.LineStringAdder=Pr;var Ro=Object.freeze({Polygonizer:Tr});e(br.prototype,{createEdgeEndForNext:function(t,e,n,i){var r=n.segmentIndex+1;if(r>=t.getNumPoints()&&null===i)return null;var s=t.getCoordinate(r);null!==i&&i.segmentIndex===n.segmentIndex&&(s=i.coord);var o=new En(t,n.coord,s,new gn(t.getLabel()));e.add(o)},createEdgeEndForPrev:function(t,e,n,i){var r=n.segmentIndex;if(0===n.dist){if(0===r)return null;r--}var s=t.getCoordinate(r);null!==i&&i.segmentIndex>=r&&(s=i.coord);var o=new gn(t.getLabel());o.flip();var a=new En(t,n.coord,s,o);e.add(a)},computeEdgeEnds:function(){if(1===arguments.length){for(var t=arguments[0],e=new I,n=t;n.hasNext();){var i=n.next();this.computeEdgeEnds(i,e)}return e}if(2===arguments.length){var r=arguments[0],s=arguments[1],o=r.getEdgeIntersectionList();o.addEndpoints();var a=o.iterator(),u=null,l=null;if(!a.hasNext())return null;var h=a.next();do u=l,l=h,h=null,a.hasNext()&&(h=a.next()),null!==l&&(this.createEdgeEndForPrev(r,s,l,u),this.createEdgeEndForNext(r,s,l,h));while(null!==l)}},interfaces_:function(){return[]},getClass:function(){return br}}),h(Or,En),e(Or.prototype,{insert:function(t){this.edgeEnds.add(t)},print:function(t){t.println("EdgeEndBundle--> Label: "+this.label);for(var e=this.iterator();e.hasNext();){var n=e.next();n.print(t),t.println()}},iterator:function(){return this.edgeEnds.iterator()},getEdgeEnds:function(){return this.edgeEnds},computeLabelOn:function(t,e){for(var n=0,i=!1,r=this.iterator();r.hasNext();){var s=r.next(),o=s.getLabel().getLocation(t);o===L.BOUNDARY&&n++,o===L.INTERIOR&&(i=!0)}var o=L.NONE;i&&(o=L.INTERIOR),n>0&&(o=$n.determineBoundary(e,n)),this.label.setLocation(t,o)},computeLabelSide:function(t,e){for(var n=this.iterator();n.hasNext();){var i=n.next();if(i.getLabel().isArea()){var r=i.getLabel().getLocation(t,e);if(r===L.INTERIOR)return this.label.setLocation(t,e,L.INTERIOR),null;r===L.EXTERIOR&&this.label.setLocation(t,e,L.EXTERIOR)}}},getLabel:function(){return this.label},computeLabelSides:function(t){this.computeLabelSide(t,cn.LEFT),this.computeLabelSide(t,cn.RIGHT)},updateIM:function(t){Jn.updateIM(this.label,t)},computeLabel:function(t){for(var e=!1,n=this.iterator();n.hasNext();){var i=n.next();i.getLabel().isArea()&&(e=!0)}e?this.label=new gn(L.NONE,L.NONE,L.NONE):this.label=new gn(L.NONE);for(var r=0;2>r;r++)this.computeLabelOn(r,t),e&&this.computeLabelSides(r)},interfaces_:function(){return[]},getClass:function(){return Or}}),h(_r,Pn),e(_r.prototype,{updateIM:function(t){for(var e=this.iterator();e.hasNext();){var n=e.next();n.updateIM(t)}},insert:function(t){var e=this.edgeMap.get(t);null===e?(e=new Or(t),this.insertEdgeEnd(t,e)):e.insert(t)},interfaces_:function(){return[]},getClass:function(){return _r}}),h(Mr,yn),e(Mr.prototype,{updateIMFromEdges:function(t){this.edges.updateIM(t)},computeIM:function(t){t.setAtLeastIfValid(this.label.getLocation(0),this.label.getLocation(1),0)},interfaces_:function(){return[]},getClass:function(){return Mr}}),h(Dr,Nn),e(Dr.prototype,{createNode:function(t){return new Mr(t,new _r)},interfaces_:function(){return[]},getClass:function(){return Dr}}),e(Ar.prototype,{insertEdgeEnds:function(t){for(var e=t.iterator();e.hasNext();){var n=e.next();this.nodes.add(n)}},computeProperIntersectionIM:function(t,e){var n=this.arg[0].getGeometry().getDimension(),i=this.arg[1].getGeometry().getDimension(),r=t.hasProperIntersection(),s=t.hasProperInteriorIntersection();2===n&&2===i?r&&e.setAtLeast("212101212"):2===n&&1===i?(r&&e.setAtLeast("FFF0FFFF2"),s&&e.setAtLeast("1FFFFF1FF")):1===n&&2===i?(r&&e.setAtLeast("F0FFFFFF2"),s&&e.setAtLeast("1F1FFFFFF")):1===n&&1===i&&s&&e.setAtLeast("0FFFFFFFF")},labelIsolatedEdges:function(t,e){for(var n=this.arg[t].getEdgeIterator();n.hasNext();){var i=n.next();i.isIsolated()&&(this.labelIsolatedEdge(i,e,this.arg[e].getGeometry()),this.isolatedEdges.add(i))}},labelIsolatedEdge:function(t,e,n){if(n.getDimension()>0){var i=this.ptLocator.locate(t.getCoordinate(),n);t.getLabel().setAllLocations(e,i)}else t.getLabel().setAllLocations(e,L.EXTERIOR)},computeIM:function(){var t=new fe;if(t.set(L.EXTERIOR,L.EXTERIOR,2),!this.arg[0].getGeometry().getEnvelopeInternal().intersects(this.arg[1].getGeometry().getEnvelopeInternal()))return this.computeDisjointIM(t),t;this.arg[0].computeSelfNodes(this.li,!1),this.arg[1].computeSelfNodes(this.li,!1);var e=this.arg[0].computeEdgeIntersections(this.arg[1],this.li,!1);this.computeIntersectionNodes(0),this.computeIntersectionNodes(1),this.copyNodesAndLabels(0),this.copyNodesAndLabels(1),this.labelIsolatedNodes(),this.computeProperIntersectionIM(e,t);var n=new br,i=n.computeEdgeEnds(this.arg[0].getEdgeIterator());this.insertEdgeEnds(i);var r=n.computeEdgeEnds(this.arg[1].getEdgeIterator());return this.insertEdgeEnds(r),this.labelNodeEdges(),this.labelIsolatedEdges(0,1),this.labelIsolatedEdges(1,0),this.updateIM(t),t},labelNodeEdges:function(){for(var t=this.nodes.iterator();t.hasNext();){var e=t.next();e.getEdges().computeLabelling(this.arg)}},copyNodesAndLabels:function(t){for(var e=this.arg[t].getNodeIterator();e.hasNext();){var n=e.next(),i=this.nodes.addNode(n.getCoordinate());i.setLabel(t,n.getLabel().getLocation(t))}},labelIntersectionNodes:function(t){for(var e=this.arg[t].getEdgeIterator();e.hasNext();)for(var n=e.next(),i=n.getLabel().getLocation(t),r=n.getEdgeIntersectionList().iterator();r.hasNext();){var s=r.next(),o=this.nodes.find(s.coord);o.getLabel().isNull(t)&&(i===L.BOUNDARY?o.setLabelBoundary(t):o.setLabel(t,L.INTERIOR))}},labelIsolatedNode:function(t,e){var n=this.ptLocator.locate(t.getCoordinate(),this.arg[e].getGeometry());t.getLabel().setAllLocations(e,n)},computeIntersectionNodes:function(t){for(var e=this.arg[t].getEdgeIterator();e.hasNext();)for(var n=e.next(),i=n.getLabel().getLocation(t),r=n.getEdgeIntersectionList().iterator();r.hasNext();){var s=r.next(),o=this.nodes.addNode(s.coord);i===L.BOUNDARY?o.setLabelBoundary(t):o.getLabel().isNull(t)&&o.setLabel(t,L.INTERIOR)}},labelIsolatedNodes:function(){for(var t=this.nodes.iterator();t.hasNext();){var e=t.next(),n=e.getLabel();f.isTrue(n.getGeometryCount()>0,"node with empty label found"),e.isIsolated()&&(n.isNull(0)?this.labelIsolatedNode(e,0):this.labelIsolatedNode(e,1))}},updateIM:function(t){for(var e=this.isolatedEdges.iterator();e.hasNext();){var n=e.next();n.updateIM(t)}for(var i=this.nodes.iterator();i.hasNext();){var r=i.next();r.updateIM(t),r.updateIMFromEdges(t)}},computeDisjointIM:function(t){var e=this.arg[0].getGeometry();e.isEmpty()||(t.set(L.INTERIOR,L.EXTERIOR,e.getDimension()),t.set(L.BOUNDARY,L.EXTERIOR,e.getBoundaryDimension()));var n=this.arg[1].getGeometry();n.isEmpty()||(t.set(L.EXTERIOR,L.INTERIOR,n.getDimension()),t.set(L.EXTERIOR,L.BOUNDARY,n.getBoundaryDimension()))},interfaces_:function(){return[]},getClass:function(){return Ar}}),e(Fr.prototype,{isContainedInBoundary:function(t){if(t instanceof Tt)return!1;if(t instanceof Lt)return this.isPointContainedInBoundary(t);if(t instanceof St)return this.isLineStringContainedInBoundary(t);for(var e=0;e<t.getNumGeometries();e++){var n=t.getGeometryN(e);if(!this.isContainedInBoundary(n))return!1}return!0},isLineSegmentContainedInBoundary:function(t,e){if(t.equals(e))return this.isPointContainedInBoundary(t);if(t.x===e.x){if(t.x===this.rectEnv.getMinX()||t.x===this.rectEnv.getMaxX())return!0}else if(t.y===e.y&&(t.y===this.rectEnv.getMinY()||t.y===this.rectEnv.getMaxY()))return!0;return!1},isLineStringContainedInBoundary:function(t){for(var e=t.getCoordinateSequence(),n=new g,i=new g,r=0;r<e.size()-1;r++)if(e.getCoordinate(r,n),e.getCoordinate(r+1,i),!this.isLineSegmentContainedInBoundary(n,i))return!1;return!0},isPointContainedInBoundary:function(){if(arguments[0]instanceof Lt){var t=arguments[0];return this.isPointContainedInBoundary(t.getCoordinate())}if(arguments[0]instanceof g){var e=arguments[0];return e.x===this.rectEnv.getMinX()||e.x===this.rectEnv.getMaxX()||e.y===this.rectEnv.getMinY()||e.y===this.rectEnv.getMaxY()}},contains:function(t){return this.rectEnv.contains(t.getEnvelopeInternal())?!this.isContainedInBoundary(t):!1},interfaces_:function(){return[]},getClass:function(){return Fr}}),Fr.contains=function(t,e){var n=new Fr(t);return n.contains(e)},e(Gr.prototype,{intersects:function(t,e){var n=new C(t,e);if(!this.rectEnv.intersects(n))return!1;if(this.rectEnv.intersects(t))return!0;if(this.rectEnv.intersects(e))return!0;if(t.compareTo(e)>0){var i=t;t=e,e=i}var r=!1;return e.y>t.y&&(r=!0),r?this.li.computeIntersection(t,e,this.diagDown0,this.diagDown1):this.li.computeIntersection(t,e,this.diagUp0,this.diagUp1),!!this.li.hasIntersection()},interfaces_:function(){return[]},getClass:function(){return Gr}}),e(qr.prototype,{applyTo:function(t){for(var e=0;e<t.getNumGeometries()&&!this._isDone;e++){var n=t.getGeometryN(e);if(n instanceof ft)this.applyTo(n);else if(this.visit(n),this.isDone())return this._isDone=!0,null}},interfaces_:function(){return[]},getClass:function(){return qr}}),e(Br.prototype,{intersects:function(t){if(!this.rectEnv.intersects(t.getEnvelopeInternal()))return!1;var e=new zr(this.rectEnv);if(e.applyTo(t),e.intersects())return!0;var n=new Vr(this.rectangle);if(n.applyTo(t),n.containsPoint())return!0;var i=new kr(this.rectangle);return i.applyTo(t),!!i.intersects()},interfaces_:function(){return[]},getClass:function(){return Br}}),Br.intersects=function(t,e){var n=new Br(t);return n.intersects(e)},h(zr,qr),e(zr.prototype,{isDone:function(){return this._intersects===!0},visit:function(t){var e=t.getEnvelopeInternal();return this.rectEnv.intersects(e)?this.rectEnv.contains(e)?(this._intersects=!0,null):e.getMinX()>=this.rectEnv.getMinX()&&e.getMaxX()<=this.rectEnv.getMaxX()?(this._intersects=!0,null):e.getMinY()>=this.rectEnv.getMinY()&&e.getMaxY()<=this.rectEnv.getMaxY()?(this._intersects=!0,null):void 0:null},intersects:function(){return this._intersects},interfaces_:function(){return[]},getClass:function(){return zr}}),h(Vr,qr),e(Vr.prototype,{isDone:function(){return this._containsPoint===!0},visit:function(t){if(!(t instanceof Tt))return null;var e=t.getEnvelopeInternal();if(!this.rectEnv.intersects(e))return null;for(var n=new g,i=0;4>i;i++)if(this.rectSeq.getCoordinate(i,n),e.contains(n)&&Tn.containsPointInPolygon(n,t))return this._containsPoint=!0,null},containsPoint:function(){return this._containsPoint},interfaces_:function(){return[]},getClass:function(){return Vr}}),h(kr,qr),e(kr.prototype,{intersects:function(){return this.hasIntersection},isDone:function(){return this.hasIntersection===!0},visit:function(t){var e=t.getEnvelopeInternal();if(!this.rectEnv.intersects(e))return null;var n=kn.getLines(t);this.checkIntersectionWithLineStrings(n)},checkIntersectionWithLineStrings:function(t){for(var e=t.iterator();e.hasNext();){var n=e.next();if(this.checkIntersectionWithSegments(n),this.hasIntersection)return null}},checkIntersectionWithSegments:function(t){for(var e=t.getCoordinateSequence(),n=1;n<e.size();n++)if(e.getCoordinate(n-1,this.p0),e.getCoordinate(n,this.p1),this.rectIntersector.intersects(this.p0,this.p1))return this.hasIntersection=!0,null},interfaces_:function(){return[]},getClass:function(){return kr}}),h(Yr,ti),e(Yr.prototype,{getIntersectionMatrix:function(){return this._relate.computeIM()},interfaces_:function(){return[]},getClass:function(){return Yr}}),Yr.covers=function(t,e){return t.getEnvelopeInternal().covers(e.getEnvelopeInternal())?t.isRectangle()?!0:Yr.relate(t,e).isCovers():!1},Yr.intersects=function(t,e){return t.getEnvelopeInternal().intersects(e.getEnvelopeInternal())?t.isRectangle()?Br.intersects(t,e):e.isRectangle()?Br.intersects(e,t):Yr.relate(t,e).isIntersects():!1},Yr.touches=function(t,e){return t.getEnvelopeInternal().intersects(e.getEnvelopeInternal())?Yr.relate(t,e).isTouches(t.getDimension(),e.getDimension()):!1},Yr.within=function(t,e){return e.contains(t)},Yr.coveredBy=function(t,e){return Yr.covers(e,t)},Yr.relate=function(){if(2===arguments.length){var t=arguments[0],e=arguments[1],n=new Yr(t,e),i=n.getIntersectionMatrix();return i}if(3===arguments.length){if("string"==typeof arguments[2]&&arguments[0]instanceof B&&arguments[1]instanceof B){var r=arguments[0],s=arguments[1],o=arguments[2];return Yr.relateWithCheck(r,s).matches(o)}if(R(arguments[2],V)&&arguments[0]instanceof B&&arguments[1]instanceof B){var a=arguments[0],u=arguments[1],l=arguments[2],n=new Yr(a,u,l),i=n.getIntersectionMatrix();return i}}},Yr.overlaps=function(t,e){return t.getEnvelopeInternal().intersects(e.getEnvelopeInternal())?Yr.relate(t,e).isOverlaps(t.getDimension(),e.getDimension()):!1},Yr.disjoint=function(t,e){return!t.intersects(e)},Yr.relateWithCheck=function(t,e){return t.checkNotGeometryCollection(t),t.checkNotGeometryCollection(e),Yr.relate(t,e)},Yr.crosses=function(t,e){return t.getEnvelopeInternal().intersects(e.getEnvelopeInternal())?Yr.relate(t,e).isCrosses(t.getDimension(),e.getDimension()):!1},Yr.contains=function(t,e){return t.getEnvelopeInternal().contains(e.getEnvelopeInternal())?t.isRectangle()?Fr.contains(t,e):Yr.relate(t,e).isContains():!1};var To=Object.freeze({RelateOp:Yr});e(Ur.prototype,{extractElements:function(t,e){if(null===t)return null;for(var n=0;n<t.getNumGeometries();n++){var i=t.getGeometryN(n);this.skipEmpty&&i.isEmpty()||e.add(i)}},combine:function(){for(var t=new I,e=this.inputGeoms.iterator();e.hasNext();){var n=e.next();this.extractElements(n,t)}return 0===t.size()?null!==this.geomFactory?this.geomFactory.createGeometryCollection(null):null:this.geomFactory.buildGeometry(t)},interfaces_:function(){return[]},getClass:function(){return Ur}}),Ur.combine=function(){if(1===arguments.length){var t=arguments[0],e=new Ur(t);return e.combine()}if(2===arguments.length){var n=arguments[0],i=arguments[1],e=new Ur(Ur.createList(n,i));return e.combine()}if(3===arguments.length){var r=arguments[0],s=arguments[1],o=arguments[2],e=new Ur(Ur.createList(r,s,o));return e.combine()}},Ur.extractFactory=function(t){return t.isEmpty()?null:t.iterator().next().getFactory()},Ur.createList=function(){if(2===arguments.length){var t=arguments[0],e=arguments[1],n=new I;return n.add(t),n.add(e),n}if(3===arguments.length){var i=arguments[0],r=arguments[1],s=arguments[2],n=new I;return n.add(i),n.add(r),n.add(s),n}},e(Xr.prototype,{union:function(){for(var t=new Te,e=new at,n=0;n<this.pointGeom.getNumGeometries();n++){var i=this.pointGeom.getGeometryN(n),r=i.getCoordinate(),s=t.locate(r,this.otherGeom);s===L.EXTERIOR&&e.add(r)}if(0===e.size())return this.otherGeom;var o=null,a=H.toCoordinateArray(e);return o=1===a.length?this.geomFact.createPoint(a[0]):this.geomFact.createMultiPointFromCoords(a),Ur.combine(o,this.otherGeom)},interfaces_:function(){return[]},getClass:function(){return Xr}}),Xr.union=function(t,e){var n=new Xr(t,e);return n.union()},e(Hr.prototype,{filter:function(t){-1!==this.sortIndex&&t.getSortIndex()!==this.sortIndex||this.comps.add(t)},interfaces_:function(){return[ht]},getClass:function(){return Hr}}),Hr.extract=function(){if(2===arguments.length){var t=arguments[0],e=arguments[1];return Hr.extract(t,e,new I)}if(3===arguments.length){var n=arguments[0],i=arguments[1],r=arguments[2];return n.getSortIndex()===i?r.add(n):n instanceof ft&&n.apply(new Hr(i,r)),r}},e(Wr.prototype,{reduceToGeometries:function(t){for(var e=new I,n=t.iterator();n.hasNext();){var i=n.next(),r=null;R(i,y)?r=this.unionTree(i):i instanceof B&&(r=i),e.add(r)}return e},extractByEnvelope:function(t,e,n){for(var i=new I,r=0;r<e.getNumGeometries();r++){var s=e.getGeometryN(r);s.getEnvelopeInternal().intersects(t)?i.add(s):n.add(s)}return this.geomFactory.buildGeometry(i)},unionOptimized:function(t,e){var n=t.getEnvelopeInternal(),i=e.getEnvelopeInternal();if(!n.intersects(i)){var r=Ur.combine(t,e);return r}if(t.getNumGeometries()<=1&&e.getNumGeometries()<=1)return this.unionActual(t,e);var s=n.intersection(i);return this.unionUsingEnvelopeIntersection(t,e,s)},union:function(){if(null===this.inputPolys)throw new IllegalStateException("union() method cannot be called twice");if(this.inputPolys.isEmpty())return null;this.geomFactory=this.inputPolys.iterator().next().getFactory();for(var t=new ke(Wr.STRTREE_NODE_CAPACITY),e=this.inputPolys.iterator();e.hasNext();){var n=e.next();t.insert(n.getEnvelopeInternal(),n)}this.inputPolys=null;var i=t.itemsTree(),r=this.unionTree(i);return r},binaryUnion:function(){if(1===arguments.length){var t=arguments[0];return this.binaryUnion(t,0,t.size())}if(3===arguments.length){var e=arguments[0],n=arguments[1],i=arguments[2];if(1>=i-n){var r=Wr.getGeometry(e,n);return this.unionSafe(r,null)}if(i-n===2)return this.unionSafe(Wr.getGeometry(e,n),Wr.getGeometry(e,n+1));var s=Math.trunc((i+n)/2),r=this.binaryUnion(e,n,s),o=this.binaryUnion(e,s,i);return this.unionSafe(r,o)}},repeatedUnion:function(t){for(var e=null,n=t.iterator();n.hasNext();){var i=n.next();e=null===e?i.copy():e.union(i)}return e},unionSafe:function(t,e){return null===t&&null===e?null:null===t?e.copy():null===e?t.copy():this.unionOptimized(t,e)},unionActual:function(t,e){return Wr.restrictToPolygons(t.union(e))},unionTree:function(t){var e=this.reduceToGeometries(t),n=this.binaryUnion(e);return n},unionUsingEnvelopeIntersection:function(t,e,n){var i=new I,r=this.extractByEnvelope(n,t,i),s=this.extractByEnvelope(n,e,i),o=this.unionActual(r,s);i.add(o);var a=Ur.combine(i);return a},bufferUnion:function(){if(1===arguments.length){var t=arguments[0],e=t.get(0).getFactory(),n=e.buildGeometry(t),i=n.buffer(0);return i}if(2===arguments.length){var r=arguments[0],s=arguments[1],e=r.getFactory(),n=e.createGeometryCollection([r,s]),i=n.buffer(0);return i}},interfaces_:function(){return[]},getClass:function(){return Wr}}),Wr.restrictToPolygons=function(t){if(R(t,Rt))return t;var e=or.getPolygons(t);return 1===e.size()?e.get(0):t.getFactory().createMultiPolygon(ie.toPolygonArray(e))},Wr.getGeometry=function(t,e){return e>=t.size()?null:t.get(e)},Wr.union=function(t){var e=new Wr(t);return e.union()},Wr.STRTREE_NODE_CAPACITY=4,e(jr.prototype,{unionNoOpt:function(t){var e=this.geomFact.createPoint();return si.overlayOp(t,e,ii.UNION)},unionWithNull:function(t,e){return null===t&&null===e?null:null===e?t:null===t?e:t.union(e)},extract:function(){if(R(arguments[0],v))for(var t=arguments[0],e=t.iterator();e.hasNext();){var n=e.next();this.extract(n)}else if(arguments[0]instanceof B){var i=arguments[0];null===this.geomFact&&(this.geomFact=i.getFactory()),Hr.extract(i,B.SORTINDEX_POLYGON,this.polygons),Hr.extract(i,B.SORTINDEX_LINESTRING,this.lines),Hr.extract(i,B.SORTINDEX_POINT,this.points)}},union:function t(){if(null===this.geomFact)return null;var e=null;if(this.points.size()>0){var n=this.geomFact.buildGeometry(this.points);e=this.unionNoOpt(n)}var i=null;if(this.lines.size()>0){var r=this.geomFact.buildGeometry(this.lines);i=this.unionNoOpt(r)}var s=null;this.polygons.size()>0&&(s=Wr.union(this.polygons));var o=this.unionWithNull(i,s),t=null;return t=null===e?o:null===o?e:Xr.union(e,o),null===t?this.geomFact.createGeometryCollection():t},interfaces_:function(){return[]},getClass:function(){return jr}}),jr.union=function(){if(1===arguments.length){if(R(arguments[0],v)){var t=arguments[0],e=new jr(t);return e.union()}if(arguments[0]instanceof B){var n=arguments[0],e=new jr(n);return e.union()}}else if(2===arguments.length){var i=arguments[0],r=arguments[1],e=new jr(i,r);return e.union()}};var Po=Object.freeze({UnaryUnionOp:jr});e(Kr.prototype,{visitInteriorRing:function(t,e){var n=t.getCoordinates(),i=n[0],r=Kr.findDifferentPoint(n,i),s=e.findEdgeInSameDirection(i,r),o=e.findEdgeEnd(s),a=null;o.getLabel().getLocation(0,cn.RIGHT)===L.INTERIOR?a=o:o.getSym().getLabel().getLocation(0,cn.RIGHT)===L.INTERIOR&&(a=o.getSym()),f.isTrue(null!==a,"unable to find dirEdge with Interior on RHS"),this.visitLinkedDirectedEdges(a)},visitShellInteriors:function(t,e){if(t instanceof Tt){var n=t;this.visitInteriorRing(n.getExteriorRing(),e)}if(t instanceof Ot)for(var i=t,r=0;r<i.getNumGeometries();r++){var n=i.getGeometryN(r);this.visitInteriorRing(n.getExteriorRing(),e)}},getCoordinate:function(){return this.disconnectedRingcoord},setInteriorEdgesInResult:function(t){for(var e=t.getEdgeEnds().iterator();e.hasNext();){var n=e.next();n.getLabel().getLocation(0,cn.RIGHT)===L.INTERIOR&&n.setInResult(!0)}},visitLinkedDirectedEdges:function(t){var e=t,n=t;do f.isTrue(null!==n,"found null Directed Edge"),n.setVisited(!0),n=n.getNext();while(n!==e)},buildEdgeRings:function(t){for(var e=new I,n=t.iterator();n.hasNext();){var i=n.next();if(i.isInResult()&&null===i.getEdgeRing()){var r=new vn(i,this.geometryFactory);r.linkDirectedEdgesForMinimalEdgeRings();var s=r.buildMinimalRings();e.addAll(s)}}return e},hasUnvisitedShellEdge:function(t){for(var e=0;e<t.size();e++){var n=t.get(e);if(!n.isHole()){var i=n.getEdges(),r=i.get(0);if(r.getLabel().getLocation(0,cn.RIGHT)===L.INTERIOR)for(var s=0;s<i.size();s++)if(r=i.get(s),
!r.isVisited())return this.disconnectedRingcoord=r.getCoordinate(),!0}}return!1},isInteriorsConnected:function(){var t=new I;this.geomGraph.computeSplitEdges(t);var e=new Cn(new On);e.addEdges(t),this.setInteriorEdgesInResult(e),e.linkResultDirectedEdges();var n=this.buildEdgeRings(e.getEdgeEnds());return this.visitShellInteriors(this.geomGraph.getGeometry(),e),!this.hasUnvisitedShellEdge(n)},interfaces_:function(){return[]},getClass:function(){return Kr}}),Kr.findDifferentPoint=function(t,e){for(var n=0;n<t.length;n++)if(!t[n].equals(e))return t[n];return null},e(Zr.prototype,{hasChildren:function(){for(var t=0;2>t;t++)if(null!==this.subnode[t])return!0;return!1},isPrunable:function(){return!(this.hasChildren()||this.hasItems())},addAllItems:function(t){t.addAll(this.items);for(var e=0;2>e;e++)null!==this.subnode[e]&&this.subnode[e].addAllItems(t);return t},size:function(){for(var t=0,e=0;2>e;e++)null!==this.subnode[e]&&(t+=this.subnode[e].size());return t+this.items.size()},addAllItemsFromOverlapping:function(t,e){return null===t||this.isSearchMatch(t)?(e.addAll(this.items),null!==this.subnode[0]&&this.subnode[0].addAllItemsFromOverlapping(t,e),void(null!==this.subnode[1]&&this.subnode[1].addAllItemsFromOverlapping(t,e))):null},hasItems:function(){return!this.items.isEmpty()},remove:function(t,e){if(!this.isSearchMatch(t))return!1;for(var n=!1,i=0;2>i;i++)if(null!==this.subnode[i]&&(n=this.subnode[i].remove(t,e))){this.subnode[i].isPrunable()&&(this.subnode[i]=null);break}return n?n:n=this.items.remove(e)},getItems:function(){return this.items},depth:function(){for(var t=0,e=0;2>e;e++)if(null!==this.subnode[e]){var n=this.subnode[e].depth();n>t&&(t=n)}return t+1},nodeSize:function(){for(var t=0,e=0;2>e;e++)null!==this.subnode[e]&&(t+=this.subnode[e].nodeSize());return t+1},add:function(t){this.items.add(t)},interfaces_:function(){return[]},getClass:function(){return Zr}}),Zr.getSubnodeIndex=function(t,e){var n=-1;return t.min>=e&&(n=1),t.max<=e&&(n=0),n},e(Qr.prototype,{expandToInclude:function(t){t.max>this.max&&(this.max=t.max),t.min<this.min&&(this.min=t.min)},getWidth:function(){return this.max-this.min},overlaps:function(){if(1===arguments.length){var t=arguments[0];return this.overlaps(t.min,t.max)}if(2===arguments.length){var e=arguments[0],n=arguments[1];return!(this.min>n||this.max<e)}},getMin:function(){return this.min},toString:function(){return"["+this.min+", "+this.max+"]"},contains:function(){if(1===arguments.length){if(arguments[0]instanceof Qr){var t=arguments[0];return this.contains(t.min,t.max)}if("number"==typeof arguments[0]){var e=arguments[0];return e>=this.min&&e<=this.max}}else if(2===arguments.length){var n=arguments[0],i=arguments[1];return n>=this.min&&i<=this.max}},init:function(t,e){this.min=t,this.max=e,t>e&&(this.min=e,this.max=t)},getMax:function(){return this.max},interfaces_:function(){return[]},getClass:function(){return Qr}}),e(Jr.prototype,{getInterval:function(){return this.interval},getLevel:function(){return this.level},computeKey:function(t){for(this.level=Jr.computeLevel(t),this.interval=new Qr,this.computeInterval(this.level,t);!this.interval.contains(t);)this.level+=1,this.computeInterval(this.level,t)},computeInterval:function(t,e){var n=Ci.powerOf2(t);this.pt=Math.floor(e.getMin()/n)*n,this.interval.init(this.pt,this.pt+n)},getPoint:function(){return this.pt},interfaces_:function(){return[]},getClass:function(){return Jr}}),Jr.computeLevel=function(t){var e=t.getWidth(),n=Ci.exponent(e)+1;return n},h($r,Zr),e($r.prototype,{getInterval:function(){return this.interval},find:function(t){var e=Zr.getSubnodeIndex(t,this.centre);if(-1===e)return this;if(null!==this.subnode[e]){var n=this.subnode[e];return n.find(t)}return this},insert:function(t){f.isTrue(null===this.interval||this.interval.contains(t.interval));var e=Zr.getSubnodeIndex(t.interval,this.centre);if(t.level===this.level-1)this.subnode[e]=t;else{var n=this.createSubnode(e);n.insert(t),this.subnode[e]=n}},isSearchMatch:function(t){return t.overlaps(this.interval)},getSubnode:function(t){return null===this.subnode[t]&&(this.subnode[t]=this.createSubnode(t)),this.subnode[t]},getNode:function(t){var e=Zr.getSubnodeIndex(t,this.centre);if(-1!==e){var n=this.getSubnode(e);return n.getNode(t)}return this},createSubnode:function(t){var e=0,n=0;switch(t){case 0:e=this.interval.getMin(),n=this.centre;break;case 1:e=this.centre,n=this.interval.getMax()}var i=new Qr(e,n),r=new $r(i,this.level-1);return r},interfaces_:function(){return[]},getClass:function(){return $r}}),$r.createNode=function(t){var e=new Jr(t),n=new $r(e.getInterval(),e.getLevel());return n},$r.createExpanded=function(t,e){var n=new Qr(e);null!==t&&n.expandToInclude(t.interval);var i=$r.createNode(n);return null!==t&&i.insert(t),i},h(ts,Zr),e(ts.prototype,{insert:function(t,e){var n=Zr.getSubnodeIndex(t,ts.origin);if(-1===n)return this.add(e),null;var i=this.subnode[n];if(null===i||!i.getInterval().contains(t)){var r=$r.createExpanded(i,t);this.subnode[n]=r}this.insertContained(this.subnode[n],t,e)},isSearchMatch:function(t){return!0},insertContained:function(t,e,n){f.isTrue(t.getInterval().contains(e));var i=Ri.isZeroWidth(e.getMin(),e.getMax()),r=null;r=i?t.find(e):t.getNode(e),r.add(n)},interfaces_:function(){return[]},getClass:function(){return ts}}),ts.origin=0,e(es.prototype,{size:function(){return null!==this.root?this.root.size():0},insert:function(t,e){this.collectStats(t);var n=es.ensureExtent(t,this.minExtent);this.root.insert(n,e)},query:function(){if(1===arguments.length){if("number"==typeof arguments[0]){var t=arguments[0];return this.query(new Qr(t,t))}if(arguments[0]instanceof Qr){var e=arguments[0],n=new I;return this.query(e,n),n}}else if(2===arguments.length){var i=arguments[0],r=arguments[1];this.root.addAllItemsFromOverlapping(i,r)}},iterator:function(){var t=new I;return this.root.addAllItems(t),t.iterator()},remove:function(t,e){var n=es.ensureExtent(t,this.minExtent);return this.root.remove(n,e)},collectStats:function(t){var e=t.getWidth();e<this.minExtent&&e>0&&(this.minExtent=e)},depth:function(){return null!==this.root?this.root.depth():0},nodeSize:function(){return null!==this.root?this.root.nodeSize():0},interfaces_:function(){return[]},getClass:function(){return es}}),es.ensureExtent=function(t,e){var n=t.getMin(),i=t.getMax();return n!==i?t:(n===i&&(n-=e/2,i=n+e/2),new Qr(n,i))},e(ns.prototype,{isInside:function(t){},interfaces_:function(){return[]},getClass:function(){return ns}}),e(is.prototype,{testLineSegment:function(t,e){var n=null,i=null,r=null,s=null,o=null,a=e.p0,u=e.p1;i=a.x-t.x,r=a.y-t.y,s=u.x-t.x,o=u.y-t.y,(r>0&&0>=o||o>0&&0>=r)&&(n=ue.signOfDet2x2(i,r,s,o)/(o-r),n>0&&this.crossings++)},buildIndex:function(){this.tree=new es;for(var t=H.removeRepeatedPoints(this.ring.getCoordinates()),e=$e.getChains(t),n=0;n<e.size();n++){var i=e.get(n),r=i.getEnvelope();this.interval.min=r.getMinY(),this.interval.max=r.getMaxY(),this.tree.insert(this.interval,i)}},testMonotoneChain:function(t,e,n){n.select(t,e)},isInside:function(t){this.crossings=0;var e=new C(r.NEGATIVE_INFINITY,r.POSITIVE_INFINITY,t.y,t.y);this.interval.min=t.y,this.interval.max=t.y;for(var n=this.tree.query(this.interval),i=new rs(this,t),s=n.iterator();s.hasNext();){var o=s.next();this.testMonotoneChain(e,i,o)}return this.crossings%2===1},interfaces_:function(){return[ns]},getClass:function(){return is}}),h(rs,tr),e(rs.prototype,{select:function(){if(1!==arguments.length)return tr.prototype.select.apply(this,arguments);var t=arguments[0];this.mcp.testLineSegment(this.p,t)},interfaces_:function(){return[]},getClass:function(){return rs}}),is.MCSelecter=rs,e(ss.prototype,{insertEdgeEnds:function(t){for(var e=t.iterator();e.hasNext();){var n=e.next();this.nodes.add(n)}},getNodeIterator:function(){return this.nodes.iterator()},copyNodesAndLabels:function(t,e){for(var n=t.getNodeIterator();n.hasNext();){var i=n.next(),r=this.nodes.addNode(i.getCoordinate());r.setLabel(e,i.getLabel().getLocation(e))}},build:function(t){this.computeIntersectionNodes(t,0),this.copyNodesAndLabels(t,0);var e=new br,n=e.computeEdgeEnds(t.getEdgeIterator());this.insertEdgeEnds(n)},computeIntersectionNodes:function(t,e){for(var n=t.getEdgeIterator();n.hasNext();)for(var i=n.next(),r=i.getLabel().getLocation(e),s=i.getEdgeIntersectionList().iterator();s.hasNext();){var o=s.next(),a=this.nodes.addNode(o.coord);r===L.BOUNDARY?a.setLabelBoundary(e):a.getLabel().isNull(e)&&a.setLabel(e,L.INTERIOR)}},interfaces_:function(){return[]},getClass:function(){return ss}}),e(os.prototype,{isNodeEdgeAreaLabelsConsistent:function(){for(var t=this.nodeGraph.getNodeIterator();t.hasNext();){var e=t.next();if(!e.getEdges().isAreaLabelsConsistent(this.geomGraph))return this.invalidPoint=e.getCoordinate().copy(),!1}return!0},getInvalidPoint:function(){return this.invalidPoint},hasDuplicateRings:function(){for(var t=this.nodeGraph.getNodeIterator();t.hasNext();)for(var e=t.next(),n=e.getEdges().iterator();n.hasNext();){var i=n.next();if(i.getEdgeEnds().size()>1)return this.invalidPoint=i.getEdge().getCoordinate(0),!0}return!1},isNodeConsistentArea:function(){var t=this.geomGraph.computeSelfNodes(this.li,!0,!0);return t.hasProperIntersection()?(this.invalidPoint=t.getProperIntersectionPoint(),!1):(this.nodeGraph.build(this.geomGraph),this.isNodeEdgeAreaLabelsConsistent())},interfaces_:function(){return[]},getClass:function(){return os}}),e(as.prototype,{buildIndex:function(){this.index=new ke;for(var t=0;t<this.rings.size();t++){var e=this.rings.get(t),n=e.getEnvelopeInternal();this.index.insert(n,e)}},getNestedPoint:function(){return this.nestedPt},isNonNested:function(){this.buildIndex();for(var t=0;t<this.rings.size();t++)for(var e=this.rings.get(t),n=e.getCoordinates(),i=this.index.query(e.getEnvelopeInternal()),r=0;r<i.size();r++){var s=i.get(r),o=s.getCoordinates();if(e!==s&&e.getEnvelopeInternal().intersects(s.getEnvelopeInternal())){var a=ls.findPtNotNode(n,s,this.graph);if(null!==a){var u=he.isPointInRing(a,o);if(u)return this.nestedPt=a,!1}}}return!0},add:function(t){this.rings.add(t),this.totalEnv.expandToInclude(t.getEnvelopeInternal())},interfaces_:function(){return[]},getClass:function(){return as}}),e(us.prototype,{getErrorType:function(){return this.errorType},getMessage:function(){return us.errMsg[this.errorType]},getCoordinate:function(){return this.pt},toString:function(){var t="";return null!==this.pt&&(t=" at or near point "+this.pt),this.getMessage()+t},interfaces_:function(){return[]},getClass:function(){return us}}),us.ERROR=0,us.REPEATED_POINT=1,us.HOLE_OUTSIDE_SHELL=2,us.NESTED_HOLES=3,us.DISCONNECTED_INTERIOR=4,us.SELF_INTERSECTION=5,us.RING_SELF_INTERSECTION=6,us.NESTED_SHELLS=7,us.DUPLICATE_RINGS=8,us.TOO_FEW_POINTS=9,us.INVALID_COORDINATE=10,us.RING_NOT_CLOSED=11,us.errMsg=["Topology Validation Error","Repeated Point","Hole lies outside shell","Holes are nested","Interior is disconnected","Self-intersection","Ring Self-intersection","Nested shells","Duplicate Rings","Too few distinct points in geometry component","Invalid Coordinate","Ring is not closed"],e(ls.prototype,{checkInvalidCoordinates:function(){if(arguments[0]instanceof Array){for(var t=arguments[0],e=0;e<t.length;e++)if(!ls.isValid(t[e]))return this.validErr=new us(us.INVALID_COORDINATE,t[e]),null}else if(arguments[0]instanceof Tt){var n=arguments[0];if(this.checkInvalidCoordinates(n.getExteriorRing().getCoordinates()),null!==this.validErr)return null;for(var e=0;e<n.getNumInteriorRing();e++)if(this.checkInvalidCoordinates(n.getInteriorRingN(e).getCoordinates()),null!==this.validErr)return null}},checkHolesNotNested:function(t,e){for(var n=new as(e),i=0;i<t.getNumInteriorRing();i++){var r=t.getInteriorRingN(i);n.add(r)}var s=n.isNonNested();s||(this.validErr=new us(us.NESTED_HOLES,n.getNestedPoint()))},checkConsistentArea:function(t){var e=new os(t),n=e.isNodeConsistentArea();return n?void(e.hasDuplicateRings()&&(this.validErr=new us(us.DUPLICATE_RINGS,e.getInvalidPoint()))):(this.validErr=new us(us.SELF_INTERSECTION,e.getInvalidPoint()),null)},isValid:function(){return this.checkValid(this.parentGeometry),null===this.validErr},checkShellInsideHole:function(t,e,n){var i=t.getCoordinates(),r=e.getCoordinates(),s=ls.findPtNotNode(i,e,n);if(null!==s){var o=he.isPointInRing(s,r);if(!o)return s}var a=ls.findPtNotNode(r,t,n);if(null!==a){var u=he.isPointInRing(a,i);return u?a:null}return f.shouldNeverReachHere("points in shell and hole appear to be equal"),null},checkNoSelfIntersectingRings:function(t){for(var e=t.getEdgeIterator();e.hasNext();){var n=e.next();if(this.checkNoSelfIntersectingRing(n.getEdgeIntersectionList()),null!==this.validErr)return null}},checkConnectedInteriors:function(t){var e=new Kr(t);e.isInteriorsConnected()||(this.validErr=new us(us.DISCONNECTED_INTERIOR,e.getCoordinate()))},checkNoSelfIntersectingRing:function(t){for(var e=new at,n=!0,i=t.iterator();i.hasNext();){var r=i.next();if(n)n=!1;else{if(e.contains(r.coord))return this.validErr=new us(us.RING_SELF_INTERSECTION,r.coord),null;e.add(r.coord)}}},checkHolesInShell:function(t,e){for(var n=t.getExteriorRing(),i=new is(n),r=0;r<t.getNumInteriorRing();r++){var s=t.getInteriorRingN(r),o=ls.findPtNotNode(s.getCoordinates(),n,e);if(null===o)return null;var a=!i.isInside(o);if(a)return this.validErr=new us(us.HOLE_OUTSIDE_SHELL,o),null}},checkTooFewPoints:function(t){return t.hasTooFewPoints()?(this.validErr=new us(us.TOO_FEW_POINTS,t.getInvalidPoint()),null):void 0},getValidationError:function(){return this.checkValid(this.parentGeometry),this.validErr},checkValid:function(){if(arguments[0]instanceof Lt){var t=arguments[0];this.checkInvalidCoordinates(t.getCoordinates())}else if(arguments[0]instanceof Pt){var e=arguments[0];this.checkInvalidCoordinates(e.getCoordinates())}else if(arguments[0]instanceof bt){var n=arguments[0];if(this.checkInvalidCoordinates(n.getCoordinates()),null!==this.validErr)return null;if(this.checkClosedRing(n),null!==this.validErr)return null;var i=new $n(0,n);if(this.checkTooFewPoints(i),null!==this.validErr)return null;var r=new ae;i.computeSelfNodes(r,!0,!0),this.checkNoSelfIntersectingRings(i)}else if(arguments[0]instanceof St){var s=arguments[0];if(this.checkInvalidCoordinates(s.getCoordinates()),null!==this.validErr)return null;var i=new $n(0,s);this.checkTooFewPoints(i)}else if(arguments[0]instanceof Tt){var o=arguments[0];if(this.checkInvalidCoordinates(o),null!==this.validErr)return null;if(this.checkClosedRings(o),null!==this.validErr)return null;var i=new $n(0,o);if(this.checkTooFewPoints(i),null!==this.validErr)return null;if(this.checkConsistentArea(i),null!==this.validErr)return null;if(!this.isSelfTouchingRingFormingHoleValid&&(this.checkNoSelfIntersectingRings(i),null!==this.validErr))return null;if(this.checkHolesInShell(o,i),null!==this.validErr)return null;if(this.checkHolesNotNested(o,i),null!==this.validErr)return null;this.checkConnectedInteriors(i)}else if(arguments[0]instanceof Ot){for(var a=arguments[0],u=0;u<a.getNumGeometries();u++){var l=a.getGeometryN(u);if(this.checkInvalidCoordinates(l),null!==this.validErr)return null;if(this.checkClosedRings(l),null!==this.validErr)return null}var i=new $n(0,a);if(this.checkTooFewPoints(i),null!==this.validErr)return null;if(this.checkConsistentArea(i),null!==this.validErr)return null;if(!this.isSelfTouchingRingFormingHoleValid&&(this.checkNoSelfIntersectingRings(i),null!==this.validErr))return null;for(var u=0;u<a.getNumGeometries();u++){var l=a.getGeometryN(u);if(this.checkHolesInShell(l,i),null!==this.validErr)return null}for(var u=0;u<a.getNumGeometries();u++){var l=a.getGeometryN(u);if(this.checkHolesNotNested(l,i),null!==this.validErr)return null}if(this.checkShellsNotNested(a,i),null!==this.validErr)return null;this.checkConnectedInteriors(i)}else if(arguments[0]instanceof ft)for(var h=arguments[0],u=0;u<h.getNumGeometries();u++){var c=h.getGeometryN(u);if(this.checkValid(c),null!==this.validErr)return null}else if(arguments[0]instanceof B){var f=arguments[0];if(this.validErr=null,f.isEmpty())return null;if(f instanceof Lt)this.checkValid(f);else if(f instanceof Pt)this.checkValid(f);else if(f instanceof bt)this.checkValid(f);else if(f instanceof St)this.checkValid(f);else if(f instanceof Tt)this.checkValid(f);else if(f instanceof Ot)this.checkValid(f);else{if(!(f instanceof ft))throw new UnsupportedOperationException(f.getClass().getName());this.checkValid(f)}}},setSelfTouchingRingFormingHoleValid:function(t){this.isSelfTouchingRingFormingHoleValid=t},checkShellNotNested:function(t,e,n){var i=t.getCoordinates(),r=e.getExteriorRing(),s=r.getCoordinates(),o=ls.findPtNotNode(i,r,n);if(null===o)return null;var a=he.isPointInRing(o,s);if(!a)return null;if(e.getNumInteriorRing()<=0)return this.validErr=new us(us.NESTED_SHELLS,o),null;for(var u=null,l=0;l<e.getNumInteriorRing();l++){var h=e.getInteriorRingN(l);if(u=this.checkShellInsideHole(t,h,n),null===u)return null}this.validErr=new us(us.NESTED_SHELLS,u)},checkClosedRings:function(t){if(this.checkClosedRing(t.getExteriorRing()),null!==this.validErr)return null;for(var e=0;e<t.getNumInteriorRing();e++)if(this.checkClosedRing(t.getInteriorRingN(e)),null!==this.validErr)return null},checkClosedRing:function(t){if(!t.isClosed()){var e=null;t.getNumPoints()>=1&&(e=t.getCoordinateN(0)),this.validErr=new us(us.RING_NOT_CLOSED,e)}},checkShellsNotNested:function(t,e){for(var n=0;n<t.getNumGeometries();n++)for(var i=t.getGeometryN(n),r=i.getExteriorRing(),s=0;s<t.getNumGeometries();s++)if(n!==s){var o=t.getGeometryN(s);if(this.checkShellNotNested(r,o,e),null!==this.validErr)return null}},interfaces_:function(){return[]},getClass:function(){return ls}}),ls.findPtNotNode=function(t,e,n){for(var i=n.findEdge(e),r=i.getEdgeIntersectionList(),s=0;s<t.length;s++){var o=t[s];if(!r.isIntersection(o))return o}return null},ls.isValid=function(){if(arguments[0]instanceof B){var t=arguments[0],e=new ls(t);return e.isValid()}if(arguments[0]instanceof g){var n=arguments[0];return r.isNaN(n.x)?!1:r.isInfinite(n.x)?!1:r.isNaN(n.y)?!1:!r.isInfinite(n.y)}};var bo=Object.freeze({IsValidOp:ls}),Oo=Object.freeze({BoundaryOp:dt,IsSimpleOp:Gi,buffer:Co,distance:So,linemerge:wo,overlay:Lo,polygonize:Ro,relate:To,union:Po,valid:bo});h(hs,_t.CoordinateOperation),e(hs.prototype,{editCoordinates:function(t,e){if(0===t.length)return null;for(var n=new Array(t.length).fill(null),i=0;i<t.length;i++){var r=new g(t[i]);this.targetPM.makePrecise(r),n[i]=r}var s=new N(n,!1),o=s.toCoordinateArray(),a=0;e instanceof St&&(a=2),e instanceof bt&&(a=4);var u=n;return this.removeCollapsed&&(u=null),o.length<a?u:o},interfaces_:function(){return[]},getClass:function(){return hs}}),e(cs.prototype,{fixPolygonalTopology:function(t){var e=t;this.changePrecisionModel||(e=this.changePM(t,this.targetPM));var n=e.buffer(0),i=n;return this.changePrecisionModel||(i=t.getFactory().createGeometry(n)),i},reducePointwise:function(t){var e=null;if(this.changePrecisionModel){var n=this.createFactory(t.getFactory(),this.targetPM);e=new _t(n)}else e=new _t;var i=this.removeCollapsed;t.getDimension()>=2&&(i=!0);var r=e.edit(t,new hs(this.targetPM,i));return r},changePM:function(t,e){var n=this.createEditor(t.getFactory(),e);return n.edit(t,new _t.NoOpGeometryOperation)},setRemoveCollapsedComponents:function(t){this.removeCollapsed=t},createFactory:function(t,e){var n=new ie(e,t.getSRID(),t.getCoordinateSequenceFactory());return n},setChangePrecisionModel:function(t){this.changePrecisionModel=t},reduce:function(t){var e=this.reducePointwise(t);return this.isPointwise?e:R(e,Rt)?e.isValid()?e:this.fixPolygonalTopology(e):e},setPointwise:function(t){this.isPointwise=t},createEditor:function(t,e){if(t.getPrecisionModel()===e)return new _t;var n=this.createFactory(t,e),i=new _t(n);return i},interfaces_:function(){return[]},getClass:function(){return cs}}),cs.reduce=function(t,e){var n=new cs(e);return n.reduce(t)},cs.reducePointwise=function(t,e){var n=new cs(e);return n.setPointwise(!0),n.reduce(t)};var _o=Object.freeze({GeometryPrecisionReducer:cs});e(fs.prototype,{simplifySection:function(t,e){if(t+1===e)return null;this.seg.p0=this.pts[t],this.seg.p1=this.pts[e];for(var n=-1,i=t,r=t+1;e>r;r++){var s=this.seg.distance(this.pts[r]);s>n&&(n=s,i=r)}if(n<=this.distanceTolerance)for(var r=t+1;e>r;r++)this.usePt[r]=!1;else this.simplifySection(t,i),this.simplifySection(i,e)},setDistanceTolerance:function(t){this.distanceTolerance=t},simplify:function(){this.usePt=new Array(this.pts.length).fill(null);for(var t=0;t<this.pts.length;t++)this.usePt[t]=!0;this.simplifySection(0,this.pts.length-1);for(var e=new N,t=0;t<this.pts.length;t++)this.usePt[t]&&e.add(new g(this.pts[t]));return e.toCoordinateArray()},interfaces_:function(){return[]},getClass:function(){return fs}}),fs.simplify=function(t,e){var n=new fs(t);return n.setDistanceTolerance(e),n.simplify()},e(gs.prototype,{setEnsureValid:function(t){this.isEnsureValidTopology=t},getResultGeometry:function(){return this.inputGeom.isEmpty()?this.inputGeom.copy():new ds(this.isEnsureValidTopology,this.distanceTolerance).transform(this.inputGeom)},setDistanceTolerance:function(t){if(0>t)throw new i("Tolerance must be non-negative");this.distanceTolerance=t},interfaces_:function(){return[]},getClass:function(){return gs}}),gs.simplify=function(t,e){var n=new gs(t);return n.setDistanceTolerance(e),n.getResultGeometry()},h(ds,xe),e(ds.prototype,{transformPolygon:function(t,e){if(t.isEmpty())return null;var n=xe.prototype.transformPolygon.call(this,t,e);return e instanceof Ot?n:this.createValidArea(n)},createValidArea:function(t){return this.isEnsureValidTopology?t.buffer(0):t},transformCoordinates:function(t,e){var n=t.toCoordinateArray(),i=null;return i=0===n.length?new Array(0).fill(null):fs.simplify(n,this.distanceTolerance),this.factory.getCoordinateSequenceFactory().create(i)},transformMultiPolygon:function(t,e){var n=xe.prototype.transformMultiPolygon.call(this,t,e);return this.createValidArea(n)},transformLinearRing:function(t,e){var n=e instanceof Tt,i=xe.prototype.transformLinearRing.call(this,t,e);return!n||i instanceof bt?i:null},interfaces_:function(){return[]},getClass:function(){return ds}}),gs.DPTransformer=ds,h(ps,ce),e(ps.prototype,{getIndex:function(){return this.index},getParent:function(){return this.parent},interfaces_:function(){return[]},getClass:function(){return ps}}),e(vs.prototype,{addToResult:function(t){this.resultSegs.add(t)},asLineString:function(){return this.parentLine.getFactory().createLineString(vs.extractCoordinates(this.resultSegs))},getResultSize:function(){var t=this.resultSegs.size();return 0===t?0:t+1},getParent:function(){return this.parentLine},getSegment:function(t){return this.segs[t]},getParentCoordinates:function(){return this.parentLine.getCoordinates()},getMinimumSize:function(){return this.minimumSize},asLinearRing:function(){return this.parentLine.getFactory().createLinearRing(vs.extractCoordinates(this.resultSegs))},getSegments:function(){return this.segs},init:function(){var t=this.parentLine.getCoordinates();this.segs=new Array(t.length-1).fill(null);for(var e=0;e<t.length-1;e++){var n=new ps(t[e],t[e+1],this.parentLine,e);this.segs[e]=n}},getResultCoordinates:function(){return vs.extractCoordinates(this.resultSegs)},interfaces_:function(){return[]},getClass:function(){return vs}}),vs.extractCoordinates=function(t){for(var e=new Array(t.size()+1).fill(null),n=null,i=0;i<t.size();i++)n=t.get(i),e[i]=n.p0;return e[e.length-1]=n.p1,e},e(ms.prototype,{remove:function(t){this.index.remove(new C(t.p0,t.p1),t)},add:function(){if(arguments[0]instanceof vs)for(var t=arguments[0],e=t.getSegments(),n=0;n<e.length;n++){var i=e[n];this.add(i)}else if(arguments[0]instanceof ce){var r=arguments[0];this.index.insert(new C(r.p0,r.p1),r)}},query:function(t){var e=new C(t.p0,t.p1),n=new ys(t);this.index.query(e,n);var i=n.getItems();return i},interfaces_:function(){return[]},getClass:function(){return ms}}),e(ys.prototype,{visitItem:function(t){var e=t;C.intersects(e.p0,e.p1,this.querySeg.p0,this.querySeg.p1)&&this.items.add(t)},getItems:function(){return this.items},interfaces_:function(){return[Ae]},getClass:function(){return ys}}),e(xs.prototype,{flatten:function(t,e){var n=this.linePts[t],i=this.linePts[e],r=new ce(n,i);return this.remove(this.line,t,e),this.outputIndex.add(r),r},hasBadIntersection:function(t,e,n){return this.hasBadOutputIntersection(n)?!0:!!this.hasBadInputIntersection(t,e,n)},setDistanceTolerance:function(t){this.distanceTolerance=t},simplifySection:function(t,e,n){n+=1;var i=new Array(2).fill(null);if(t+1===e){var r=this.line.getSegment(t);return this.line.addToResult(r),null}var s=!0;if(this.line.getResultSize()<this.line.getMinimumSize()){var o=n+1;o<this.line.getMinimumSize()&&(s=!1)}var a=new Array(1).fill(null),u=this.findFurthestPoint(this.linePts,t,e,a);a[0]>this.distanceTolerance&&(s=!1);var l=new ce;if(l.p0=this.linePts[t],l.p1=this.linePts[e],i[0]=t,i[1]=e,this.hasBadIntersection(this.line,i,l)&&(s=!1),s){var r=this.flatten(t,e);return this.line.addToResult(r),null}this.simplifySection(t,u,n),this.simplifySection(u,e,n)},hasBadOutputIntersection:function(t){for(var e=this.outputIndex.query(t),n=e.iterator();n.hasNext();){var i=n.next();if(this.hasInteriorIntersection(i,t))return!0}return!1},findFurthestPoint:function(t,e,n,i){var r=new ce;r.p0=t[e],r.p1=t[n];for(var s=-1,o=e,a=e+1;n>a;a++){var u=t[a],l=r.distance(u);l>s&&(s=l,o=a)}return i[0]=s,o},simplify:function(t){this.line=t,this.linePts=t.getParentCoordinates(),this.simplifySection(0,this.linePts.length-1,0)},remove:function(t,e,n){for(var i=e;n>i;i++){var r=t.getSegment(i);this.inputIndex.remove(r)}},hasInteriorIntersection:function(t,e){return this.li.computeIntersection(t.p0,t.p1,e.p0,e.p1),this.li.isInteriorIntersection()},hasBadInputIntersection:function(t,e,n){for(var i=this.inputIndex.query(n),r=i.iterator();r.hasNext();){var s=r.next();if(this.hasInteriorIntersection(s,n)){if(xs.isInLineSection(t,e,s))continue;return!0}}return!1},interfaces_:function(){return[]},getClass:function(){return xs}}),xs.isInLineSection=function(t,e,n){if(n.getParent()!==t.getParent())return!1;var i=n.getIndex();return i>=e[0]&&i<e[1]},e(Es.prototype,{setDistanceTolerance:function(t){this.distanceTolerance=t},simplify:function(t){for(var e=t.iterator();e.hasNext();)this.inputIndex.add(e.next());for(var e=t.iterator();e.hasNext();){var n=new xs(this.inputIndex,this.outputIndex);n.setDistanceTolerance(this.distanceTolerance),n.simplify(e.next())}},interfaces_:function(){return[]},getClass:function(){return Es}}),e(Is.prototype,{getResultGeometry:function(){if(this.inputGeom.isEmpty())return this.inputGeom.copy();this.linestringMap=new te,this.inputGeom.apply(new Cs(this)),this.lineSimplifier.simplify(this.linestringMap.values());var t=new Ns(this.linestringMap).transform(this.inputGeom);return t},setDistanceTolerance:function(t){if(0>t)throw new i("Tolerance must be non-negative");this.lineSimplifier.setDistanceTolerance(t)},interfaces_:function(){return[]},getClass:function(){return Is}}),Is.simplify=function(t,e){var n=new Is(t);return n.setDistanceTolerance(e),n.getResultGeometry()},h(Ns,xe),e(Ns.prototype,{transformCoordinates:function(t,e){if(0===t.size())return null;if(e instanceof St){var n=this.linestringMap.get(e);return this.createCoordinateSequence(n.getResultCoordinates())}return xe.prototype.transformCoordinates.call(this,t,e)},interfaces_:function(){return[]},getClass:function(){return Ns}}),e(Cs.prototype,{filter:function(t){if(t instanceof St){var e=t;if(e.isEmpty())return null;var n=e.isClosed()?4:2,i=new vs(e,n);this.tps.linestringMap.put(e,i)}},interfaces_:function(){return[q]},getClass:function(){return Cs}}),Is.LineStringTransformer=Ns,Is.LineStringMapBuilderFilter=Cs;var Mo=Object.freeze({DouglasPeuckerSimplifier:gs,TopologyPreservingSimplifier:Is});e(Ss.prototype,{splitAt:function(){if(1===arguments.length){var t=arguments[0],e=this.minimumLen/this.segLen;if(t.distance(this.seg.p0)<this.minimumLen)return this.splitPt=this.seg.pointAlong(e),null;if(t.distance(this.seg.p1)<this.minimumLen)return this.splitPt=Ss.pointAlongReverse(this.seg,e),null;this.splitPt=t}else if(2===arguments.length){var n=arguments[0],i=arguments[1],r=this.getConstrainedLength(n),s=r/this.segLen;i.equals2D(this.seg.p0)?this.splitPt=this.seg.pointAlong(s):this.splitPt=Ss.pointAlongReverse(this.seg,s)}},setMinimumLength:function(t){this.minimumLen=t},getConstrainedLength:function(t){return t<this.minimumLen?this.minimumLen:t},getSplitPoint:function(){return this.splitPt},interfaces_:function(){return[]},getClass:function(){return Ss}}),Ss.pointAlongReverse=function(t,e){var n=new g;return n.x=t.p1.x-e*(t.p1.x-t.p0.x),n.y=t.p1.y-e*(t.p1.y-t.p0.y),n},e(ws.prototype,{findSplitPoint:function(t,e){},interfaces_:function(){return[]},getClass:function(){return ws}}),e(Ls.prototype,{findSplitPoint:function(t,e){var n=t.getLineSegment(),i=n.getLength(),r=i/2,s=new Ss(n),o=Ls.projectedSplitPoint(t,e),a=2*o.distance(e)*.8,u=a;return u>r&&(u=r),s.setMinimumLength(u),s.splitAt(o),s.getSplitPoint()},interfaces_:function(){return[ws]},getClass:function(){return Ls}}),Ls.projectedSplitPoint=function(t,e){var n=t.getLineSegment(),i=n.project(e);return i},e(Rs.prototype,{interfaces_:function(){return[]},getClass:function(){return Rs}}),Rs.triArea=function(t,e,n){return(e.x-t.x)*(n.y-t.y)-(e.y-t.y)*(n.x-t.x)},Rs.isInCircleDDNormalized=function(t,e,n,i){var r=_.valueOf(t.x).selfSubtract(i.x),s=_.valueOf(t.y).selfSubtract(i.y),o=_.valueOf(e.x).selfSubtract(i.x),a=_.valueOf(e.y).selfSubtract(i.y),u=_.valueOf(n.x).selfSubtract(i.x),l=_.valueOf(n.y).selfSubtract(i.y),h=r.multiply(a).selfSubtract(o.multiply(s)),c=o.multiply(l).selfSubtract(u.multiply(a)),f=u.multiply(s).selfSubtract(r.multiply(l)),g=r.multiply(r).selfAdd(s.multiply(s)),d=o.multiply(o).selfAdd(a.multiply(a)),p=u.multiply(u).selfAdd(l.multiply(l)),v=g.selfMultiply(c).selfAdd(d.selfMultiply(f)).selfAdd(p.selfMultiply(h)),m=v.doubleValue()>0;return m},Rs.checkRobustInCircle=function(t,e,n,i){var r=Rs.isInCircleNonRobust(t,e,n,i),s=Rs.isInCircleDDSlow(t,e,n,i),o=Rs.isInCircleCC(t,e,n,i),a=ci.circumcentre(t,e,n);A.out.println("p radius diff a = "+Math.abs(i.distance(a)-t.distance(a))/t.distance(a)),r===s&&r===o||(A.out.println("inCircle robustness failure (double result = "+r+", DD result = "+s+", CC result = "+o+")"),A.out.println(se.toLineString(new Gt([t,e,n,i]))),A.out.println("Circumcentre = "+se.toPoint(a)+" radius = "+t.distance(a)),A.out.println("p radius diff a = "+Math.abs(i.distance(a)/t.distance(a)-1)),A.out.println("p radius diff b = "+Math.abs(i.distance(a)/e.distance(a)-1)),A.out.println("p radius diff c = "+Math.abs(i.distance(a)/n.distance(a)-1)),A.out.println())},Rs.isInCircleDDFast=function(t,e,n,i){var r=_.sqr(t.x).selfAdd(_.sqr(t.y)).selfMultiply(Rs.triAreaDDFast(e,n,i)),s=_.sqr(e.x).selfAdd(_.sqr(e.y)).selfMultiply(Rs.triAreaDDFast(t,n,i)),o=_.sqr(n.x).selfAdd(_.sqr(n.y)).selfMultiply(Rs.triAreaDDFast(t,e,i)),a=_.sqr(i.x).selfAdd(_.sqr(i.y)).selfMultiply(Rs.triAreaDDFast(t,e,n)),u=r.selfSubtract(s).selfAdd(o).selfSubtract(a),l=u.doubleValue()>0;return l},Rs.isInCircleCC=function(t,e,n,i){var r=ci.circumcentre(t,e,n),s=t.distance(r),o=i.distance(r)-s;return 0>=o},Rs.isInCircleNormalized=function(t,e,n,i){var r=t.x-i.x,s=t.y-i.y,o=e.x-i.x,a=e.y-i.y,u=n.x-i.x,l=n.y-i.y,h=r*a-o*s,c=o*l-u*a,f=u*s-r*l,g=r*r+s*s,d=o*o+a*a,p=u*u+l*l,v=g*c+d*f+p*h;return v>0},Rs.isInCircleDDSlow=function(t,e,n,i){var r=_.valueOf(i.x),s=_.valueOf(i.y),o=_.valueOf(t.x),a=_.valueOf(t.y),u=_.valueOf(e.x),l=_.valueOf(e.y),h=_.valueOf(n.x),c=_.valueOf(n.y),f=o.multiply(o).add(a.multiply(a)).multiply(Rs.triAreaDDSlow(u,l,h,c,r,s)),g=u.multiply(u).add(l.multiply(l)).multiply(Rs.triAreaDDSlow(o,a,h,c,r,s)),d=h.multiply(h).add(c.multiply(c)).multiply(Rs.triAreaDDSlow(o,a,u,l,r,s)),p=r.multiply(r).add(s.multiply(s)).multiply(Rs.triAreaDDSlow(o,a,u,l,h,c)),v=f.subtract(g).add(d).subtract(p),m=v.doubleValue()>0;
return m},Rs.isInCircleNonRobust=function(t,e,n,i){var r=(t.x*t.x+t.y*t.y)*Rs.triArea(e,n,i)-(e.x*e.x+e.y*e.y)*Rs.triArea(t,n,i)+(n.x*n.x+n.y*n.y)*Rs.triArea(t,e,i)-(i.x*i.x+i.y*i.y)*Rs.triArea(t,e,n)>0;return r},Rs.isInCircleRobust=function(t,e,n,i){return Rs.isInCircleNormalized(t,e,n,i)},Rs.triAreaDDSlow=function(t,e,n,i,r,s){return n.subtract(t).multiply(s.subtract(e)).subtract(i.subtract(e).multiply(r.subtract(t)))},Rs.triAreaDDFast=function(t,e,n){var i=_.valueOf(e.x).selfSubtract(t.x).selfMultiply(_.valueOf(n.y).selfSubtract(t.y)),r=_.valueOf(e.y).selfSubtract(t.y).selfMultiply(_.valueOf(n.x).selfSubtract(t.x));return i.selfSubtract(r)},e(Ts.prototype,{circleCenter:function(t,e){var n=new Ts(this.getX(),this.getY()),i=this.bisector(n,t),r=this.bisector(t,e),s=new F(i,r),o=null;try{o=new Ts(s.getX(),s.getY())}catch(i){if(!(i instanceof w))throw i;A.err.println("a: "+n+"  b: "+t+"  c: "+e),A.err.println(i)}finally{}return o},dot:function(t){return this.p.x*t.getX()+this.p.y*t.getY()},magn:function(){return Math.sqrt(this.p.x*this.p.x+this.p.y*this.p.y)},getZ:function(){return this.p.z},bisector:function(t,e){var n=e.getX()-t.getX(),i=e.getY()-t.getY(),r=new F(t.getX()+n/2,t.getY()+i/2,1),s=new F(t.getX()-i+n/2,t.getY()+n+i/2,1);return new F(r,s)},equals:function(){if(1===arguments.length){var t=arguments[0];return this.p.x===t.getX()&&this.p.y===t.getY()}if(2===arguments.length){var e=arguments[0],n=arguments[1];return this.p.distance(e.getCoordinate())<n}},getCoordinate:function(){return this.p},isInCircle:function(t,e,n){return Rs.isInCircleRobust(t.p,e.p,n.p,this.p)},interpolateZValue:function(t,e,n){var i=t.getX(),r=t.getY(),s=e.getX()-i,o=n.getX()-i,a=e.getY()-r,u=n.getY()-r,l=s*u-o*a,h=this.getX()-i,c=this.getY()-r,f=(u*h-o*c)/l,g=(-a*h+s*c)/l,d=t.getZ()+f*(e.getZ()-t.getZ())+g*(n.getZ()-t.getZ());return d},midPoint:function(t){var e=(this.p.x+t.getX())/2,n=(this.p.y+t.getY())/2,i=(this.p.z+t.getZ())/2;return new Ts(e,n,i)},rightOf:function(t){return this.isCCW(t.dest(),t.orig())},isCCW:function(t,e){return(t.p.x-this.p.x)*(e.p.y-this.p.y)-(t.p.y-this.p.y)*(e.p.x-this.p.x)>0},getX:function(){return this.p.x},crossProduct:function(t){return this.p.x*t.getY()-this.p.y*t.getX()},setZ:function(t){this.p.z=t},times:function(t){return new Ts(t*this.p.x,t*this.p.y)},cross:function(){return new Ts(this.p.y,-this.p.x)},leftOf:function(t){return this.isCCW(t.orig(),t.dest())},toString:function(){return"POINT ("+this.p.x+" "+this.p.y+")"},sub:function(t){return new Ts(this.p.x-t.getX(),this.p.y-t.getY())},getY:function(){return this.p.y},classify:function(t,e){var n=this,i=e.sub(t),r=n.sub(t),s=i.crossProduct(r);return s>0?Ts.LEFT:0>s?Ts.RIGHT:i.getX()*r.getX()<0||i.getY()*r.getY()<0?Ts.BEHIND:i.magn()<r.magn()?Ts.BEYOND:t.equals(n)?Ts.ORIGIN:e.equals(n)?Ts.DESTINATION:Ts.BETWEEN},sum:function(t){return new Ts(this.p.x+t.getX(),this.p.y+t.getY())},distance:function(t,e){return Math.sqrt(Math.pow(e.getX()-t.getX(),2)+Math.pow(e.getY()-t.getY(),2))},circumRadiusRatio:function(t,e){var n=this.circleCenter(t,e),i=this.distance(n,t),r=this.distance(this,t),s=this.distance(t,e);return r>s&&(r=s),s=this.distance(e,this),r>s&&(r=s),i/r},interfaces_:function(){return[]},getClass:function(){return Ts}}),Ts.interpolateZ=function(){if(3===arguments.length){var t=arguments[0],e=arguments[1],n=arguments[2],i=e.distance(n),r=t.distance(e),s=n.z-e.z,o=e.z+s*(r/i);return o}if(4===arguments.length){var a=arguments[0],u=arguments[1],l=arguments[2],h=arguments[3],c=u.x,f=u.y,g=l.x-c,d=h.x-c,p=l.y-f,v=h.y-f,m=g*v-d*p,y=a.x-c,x=a.y-f,E=(v*y-d*x)/m,I=(-p*y+g*x)/m,N=u.z+E*(l.z-u.z)+I*(h.z-u.z);return N}},Ts.LEFT=0,Ts.RIGHT=1,Ts.BEYOND=2,Ts.BEHIND=3,Ts.BETWEEN=4,Ts.ORIGIN=5,Ts.DESTINATION=6,h(Ps,Ts),e(Ps.prototype,{getConstraint:function(){return this.constraint},setOnConstraint:function(t){this._isOnConstraint=t},merge:function(t){t._isOnConstraint&&(this._isOnConstraint=!0,this.constraint=t.constraint)},isOnConstraint:function(){return this._isOnConstraint},setConstraint:function(t){this._isOnConstraint=!0,this.constraint=t},interfaces_:function(){return[]},getClass:function(){return Ps}}),e(bs.prototype,{equalsNonOriented:function(t){return this.equalsOriented(t)?!0:!!this.equalsOriented(t.sym())},toLineSegment:function(){return new ce(this.vertex.getCoordinate(),this.dest().getCoordinate())},dest:function(){return this.sym().orig()},oNext:function(){return this.next},equalsOriented:function(t){return!(!this.orig().getCoordinate().equals2D(t.orig().getCoordinate())||!this.dest().getCoordinate().equals2D(t.dest().getCoordinate()))},dNext:function(){return this.sym().oNext().sym()},lPrev:function(){return this.next.sym()},rPrev:function(){return this.sym().oNext()},rot:function(){return this._rot},oPrev:function(){return this._rot.next._rot},sym:function(){return this._rot._rot},setOrig:function(t){this.vertex=t},lNext:function(){return this.invRot().oNext().rot()},getLength:function(){return this.orig().getCoordinate().distance(this.dest().getCoordinate())},invRot:function(){return this._rot.sym()},setDest:function(t){this.sym().setOrig(t)},setData:function(t){this.data=t},getData:function(){return this.data},delete:function(){this._rot=null},orig:function(){return this.vertex},rNext:function(){return this._rot.next.invRot()},toString:function(){var t=this.vertex.getCoordinate(),e=this.dest().getCoordinate();return se.toLineString(t,e)},isLive:function(){return null!==this._rot},getPrimary:function(){return this.orig().getCoordinate().compareTo(this.dest().getCoordinate())<=0?this:this.sym()},dPrev:function(){return this.invRot().oNext().invRot()},setNext:function(t){this.next=t},interfaces_:function(){return[]},getClass:function(){return bs}}),bs.makeEdge=function(t,e){var n=new bs,i=new bs,r=new bs,s=new bs;n._rot=i,i._rot=r,r._rot=s,s._rot=n,n.setNext(n),i.setNext(s),r.setNext(r),s.setNext(i);var o=n;return o.setOrig(t),o.setDest(e),o},bs.swap=function(t){var e=t.oPrev(),n=t.sym().oPrev();bs.splice(t,e),bs.splice(t.sym(),n),bs.splice(t,e.lNext()),bs.splice(t.sym(),n.lNext()),t.setOrig(e.dest()),t.setDest(n.dest())},bs.splice=function(t,e){var n=t.oNext().rot(),i=e.oNext().rot(),r=e.oNext(),s=t.oNext(),o=i.oNext(),a=n.oNext();t.setNext(r),e.setNext(s),n.setNext(o),i.setNext(a)},bs.connect=function(t,e){var n=bs.makeEdge(t.dest(),e.orig());return bs.splice(n,t.lNext()),bs.splice(n.sym(),e),n},e(Os.prototype,{insertSite:function(t){var e=this.subdiv.locate(t);if(this.subdiv.isVertexOfEdge(e,t))return e;this.subdiv.isOnEdge(e,t.getCoordinate())&&(e=e.oPrev(),this.subdiv.delete(e.oNext()));var n=this.subdiv.makeEdge(e.orig(),t);bs.splice(n,e);var i=n;do n=this.subdiv.connect(e,n.sym()),e=n.oPrev();while(e.lNext()!==i);for(;;){var r=e.oPrev();if(r.dest().rightOf(e)&&t.isInCircle(e.orig(),r.dest(),e.dest()))bs.swap(e),e=e.oPrev();else{if(e.oNext()===i)return n;e=e.oNext().lPrev()}}},insertSites:function(t){for(var e=t.iterator();e.hasNext();){var n=e.next();this.insertSite(n)}},interfaces_:function(){return[]},getClass:function(){return Os}}),e(_s.prototype,{locate:function(t){},interfaces_:function(){return[]},getClass:function(){return _s}}),e(Ms.prototype,{init:function(){this.lastEdge=this.findEdge()},locate:function(t){this.lastEdge.isLive()||this.init();var e=this.subdiv.locateFromEdge(t,this.lastEdge);return this.lastEdge=e,e},findEdge:function(){var t=this.subdiv.getEdges();return t.iterator().next()},interfaces_:function(){return[_s]},getClass:function(){return Ms}}),h(Ds,l),e(Ds.prototype,{getSegment:function(){return this.seg},interfaces_:function(){return[]},getClass:function(){return Ds}}),Ds.msgWithSpatial=function(t,e){return null!==e?t+" [ "+e+" ]":t},e(As.prototype,{visit:function(t){},interfaces_:function(){return[]},getClass:function(){return As}}),e(Fs.prototype,{getTriangleVertices:function(t){var e=new Bs;return this.visitTriangles(e,t),e.getTriangleVertices()},isFrameVertex:function(t){return t.equals(this.frameVertex[0])?!0:t.equals(this.frameVertex[1])?!0:!!t.equals(this.frameVertex[2])},isVertexOfEdge:function(t,e){return!(!e.equals(t.orig(),this.tolerance)&&!e.equals(t.dest(),this.tolerance))},connect:function(t,e){var n=bs.connect(t,e);return this.quadEdges.add(n),n},getVoronoiCellPolygon:function(t,e){var n=new I,i=t;do{var r=t.rot().orig().getCoordinate();n.add(r),t=t.oPrev()}while(t!==i);var s=new N;s.addAll(n,!1),s.closeRing(),s.size()<4&&(A.out.println(s),s.add(s.get(s.size()-1),!0));var o=s.toCoordinateArray(),a=e.createPolygon(e.createLinearRing(o),null),u=i.orig();return a.setUserData(u.getCoordinate()),a},setLocator:function(t){this.locator=t},initSubdiv:function(){var t=this.makeEdge(this.frameVertex[0],this.frameVertex[1]),e=this.makeEdge(this.frameVertex[1],this.frameVertex[2]);bs.splice(t.sym(),e);var n=this.makeEdge(this.frameVertex[2],this.frameVertex[0]);return bs.splice(e.sym(),n),bs.splice(n.sym(),t),t},isFrameBorderEdge:function(t){var e=new Array(3).fill(null);Fs.getTriangleEdges(t,e);var n=new Array(3).fill(null);Fs.getTriangleEdges(t.sym(),n);var i=t.lNext().dest();if(this.isFrameVertex(i))return!0;var r=t.sym().lNext().dest();return!!this.isFrameVertex(r)},makeEdge:function(t,e){var n=bs.makeEdge(t,e);return this.quadEdges.add(n),n},visitTriangles:function(t,e){this.visitedKey++;var n=new pe;n.push(this.startingEdge);for(var i=new J;!n.empty();){var r=n.pop();if(!i.contains(r)){var s=this.fetchTriangleToVisit(r,n,e,i);null!==s&&t.visit(s)}}},isFrameEdge:function(t){return!(!this.isFrameVertex(t.orig())&&!this.isFrameVertex(t.dest()))},isOnEdge:function(t,e){this.seg.setCoordinates(t.orig().getCoordinate(),t.dest().getCoordinate());var n=this.seg.distance(e);return n<this.edgeCoincidenceTolerance},getEnvelope:function(){return new C(this.frameEnv)},createFrame:function(t){var e=t.getWidth(),n=t.getHeight(),i=0;i=e>n?10*e:10*n,this.frameVertex[0]=new Ts((t.getMaxX()+t.getMinX())/2,t.getMaxY()+i),this.frameVertex[1]=new Ts(t.getMinX()-i,t.getMinY()-i),this.frameVertex[2]=new Ts(t.getMaxX()+i,t.getMinY()-i),this.frameEnv=new C(this.frameVertex[0].getCoordinate(),this.frameVertex[1].getCoordinate()),this.frameEnv.expandToInclude(this.frameVertex[2].getCoordinate())},getTriangleCoordinates:function(t){var e=new zs;return this.visitTriangles(e,t),e.getTriangles()},getVertices:function(t){for(var e=new J,n=this.quadEdges.iterator();n.hasNext();){var i=n.next(),r=i.orig();!t&&this.isFrameVertex(r)||e.add(r);var s=i.dest();!t&&this.isFrameVertex(s)||e.add(s)}return e},fetchTriangleToVisit:function(t,e,n,i){var r=t,s=0,o=!1;do{this.triEdges[s]=r,this.isFrameEdge(r)&&(o=!0);var a=r.sym();i.contains(a)||e.push(a),i.add(r),s++,r=r.lNext()}while(r!==t);return o&&!n?null:this.triEdges},getEdges:function(){if(0===arguments.length)return this.quadEdges;if(1===arguments.length){for(var t=arguments[0],e=this.getPrimaryEdges(!1),n=new Array(e.size()).fill(null),i=0,r=e.iterator();r.hasNext();){var s=r.next();n[i++]=t.createLineString([s.orig().getCoordinate(),s.dest().getCoordinate()])}return t.createMultiLineString(n)}},getVertexUniqueEdges:function(t){for(var e=new I,n=new J,i=this.quadEdges.iterator();i.hasNext();){var r=i.next(),s=r.orig();n.contains(s)||(n.add(s),!t&&this.isFrameVertex(s)||e.add(r));var o=r.sym(),a=o.orig();n.contains(a)||(n.add(a),!t&&this.isFrameVertex(a)||e.add(o))}return e},getTriangleEdges:function(t){var e=new qs;return this.visitTriangles(e,t),e.getTriangleEdges()},getPrimaryEdges:function(t){this.visitedKey++;var e=new I,n=new pe;n.push(this.startingEdge);for(var i=new J;!n.empty();){var r=n.pop();if(!i.contains(r)){var s=r.getPrimary();!t&&this.isFrameEdge(s)||e.add(s),n.push(r.oNext()),n.push(r.sym().oNext()),i.add(r),i.add(r.sym())}}return e},delete:function(t){bs.splice(t,t.oPrev()),bs.splice(t.sym(),t.sym().oPrev());var e=t.sym(),n=t.rot(),i=t.rot().sym();this.quadEdges.remove(t),this.quadEdges.remove(e),this.quadEdges.remove(n),this.quadEdges.remove(i),t.delete(),e.delete(),n.delete(),i.delete()},locateFromEdge:function(t,e){for(var n=0,i=this.quadEdges.size(),r=e;;){if(n++,n>i)throw new Ds(r.toLineSegment());if(t.equals(r.orig())||t.equals(r.dest()))break;if(t.rightOf(r))r=r.sym();else if(t.rightOf(r.oNext())){if(t.rightOf(r.dPrev()))break;r=r.dPrev()}else r=r.oNext()}return r},getTolerance:function(){return this.tolerance},getVoronoiCellPolygons:function(t){this.visitTriangles(new Gs,!0);for(var e=new I,n=this.getVertexUniqueEdges(!1),i=n.iterator();i.hasNext();){var r=i.next();e.add(this.getVoronoiCellPolygon(r,t))}return e},getVoronoiDiagram:function(t){var e=this.getVoronoiCellPolygons(t);return t.createGeometryCollection(ie.toGeometryArray(e))},getTriangles:function(t){for(var e=this.getTriangleCoordinates(!1),n=new Array(e.size()).fill(null),i=0,r=e.iterator();r.hasNext();){var s=r.next();n[i++]=t.createPolygon(t.createLinearRing(s),null)}return t.createGeometryCollection(n)},insertSite:function(t){var e=this.locate(t);if(t.equals(e.orig(),this.tolerance)||t.equals(e.dest(),this.tolerance))return e;var n=this.makeEdge(e.orig(),t);bs.splice(n,e);var i=n;do n=this.connect(e,n.sym()),e=n.oPrev();while(e.lNext()!==i);return i},locate:function(){if(1===arguments.length){if(arguments[0]instanceof Ts){var t=arguments[0];return this.locator.locate(t)}if(arguments[0]instanceof g){var e=arguments[0];return this.locator.locate(new Ts(e))}}else if(2===arguments.length){var n=arguments[0],i=arguments[1],r=this.locator.locate(new Ts(n));if(null===r)return null;var s=r;r.dest().getCoordinate().equals2D(n)&&(s=r.sym());var o=s;do{if(o.dest().getCoordinate().equals2D(i))return o;o=o.oNext()}while(o!==s);return null}},interfaces_:function(){return[]},getClass:function(){return Fs}}),Fs.getTriangleEdges=function(t,e){if(e[0]=t,e[1]=e[0].lNext(),e[2]=e[1].lNext(),e[2].lNext()!==e[0])throw new i("Edges do not form a triangle")},e(Gs.prototype,{visit:function(t){for(var e=t[0].orig().getCoordinate(),n=t[1].orig().getCoordinate(),i=t[2].orig().getCoordinate(),r=ci.circumcentre(e,n,i),s=new Ts(r),o=0;3>o;o++)t[o].rot().setOrig(s)},interfaces_:function(){return[As]},getClass:function(){return Gs}}),e(qs.prototype,{getTriangleEdges:function(){return this.triList},visit:function(t){this.triList.add(t.clone())},interfaces_:function(){return[As]},getClass:function(){return qs}}),e(Bs.prototype,{visit:function(t){this.triList.add([t[0].orig(),t[1].orig(),t[2].orig()])},getTriangleVertices:function(){return this.triList},interfaces_:function(){return[As]},getClass:function(){return Bs}}),e(zs.prototype,{checkTriangleSize:function(t){var e="";t.length>=2?e=se.toLineString(t[0],t[1]):t.length>=1&&(e=se.toPoint(t[0]))},visit:function(t){this.coordList.clear();for(var e=0;3>e;e++){var n=t[e].orig();this.coordList.add(n.getCoordinate())}if(this.coordList.size()>0){this.coordList.closeRing();var i=this.coordList.toCoordinateArray();if(4!==i.length)return null;this.triCoords.add(i)}},getTriangles:function(){return this.triCoords},interfaces_:function(){return[As]},getClass:function(){return zs}}),Fs.TriangleCircumcentreVisitor=Gs,Fs.TriangleEdgesListVisitor=qs,Fs.TriangleVertexListVisitor=Bs,Fs.TriangleCoordinatesVisitor=zs,Fs.EDGE_COINCIDENCE_TOL_FACTOR=1e3,e(Vs.prototype,{getLineSegment:function(){return this.ls},getEndZ:function(){var t=this.ls.getCoordinate(1);return t.z},getStartZ:function(){var t=this.ls.getCoordinate(0);return t.z},intersection:function(t){return this.ls.intersection(t.getLineSegment())},getStart:function(){return this.ls.getCoordinate(0)},getEnd:function(){return this.ls.getCoordinate(1)},getEndY:function(){var t=this.ls.getCoordinate(1);return t.y},getStartX:function(){var t=this.ls.getCoordinate(0);return t.x},equalsTopo:function(t){return this.ls.equalsTopo(t.getLineSegment())},getStartY:function(){var t=this.ls.getCoordinate(0);return t.y},setData:function(t){this.data=t},getData:function(){return this.data},getEndX:function(){var t=this.ls.getCoordinate(1);return t.x},toString:function(){return this.ls.toString()},interfaces_:function(){return[]},getClass:function(){return Vs}}),e(ks.prototype,{visit:function(t){},interfaces_:function(){return[]},getClass:function(){return ks}}),e(Ys.prototype,{isRepeated:function(){return this.count>1},getRight:function(){return this.right},getCoordinate:function(){return this.p},setLeft:function(t){this.left=t},getX:function(){return this.p.x},getData:function(){return this.data},getCount:function(){return this.count},getLeft:function(){return this.left},getY:function(){return this.p.y},increment:function(){this.count=this.count+1},setRight:function(t){this.right=t},interfaces_:function(){return[]},getClass:function(){return Ys}}),e(Us.prototype,{insert:function(){if(1===arguments.length){var t=arguments[0];return this.insert(t,null)}if(2===arguments.length){var e=arguments[0],n=arguments[1];if(null===this.root)return this.root=new Ys(e,n),this.root;if(this.tolerance>0){var i=this.findBestMatchNode(e);if(null!==i)return i.increment(),i}return this.insertExact(e,n)}},query:function(){var t=arguments,e=this;if(1===arguments.length){var n=arguments[0],i=new I;return this.query(n,i),i}if(2===arguments.length)if(arguments[0]instanceof C&&R(arguments[1],y))!function(){var n=t[0],i=t[1];e.queryNode(e.root,n,!0,{interfaces_:function(){return[ks]},visit:function(t){i.add(t)}})}();else if(arguments[0]instanceof C&&R(arguments[1],ks)){var r=arguments[0],s=arguments[1];this.queryNode(this.root,r,!0,s)}},queryNode:function(t,e,n,i){if(null===t)return null;var r=null,s=null,o=null;n?(r=e.getMinX(),s=e.getMaxX(),o=t.getX()):(r=e.getMinY(),s=e.getMaxY(),o=t.getY());var a=o>r,u=s>=o;a&&this.queryNode(t.getLeft(),e,!n,i),e.contains(t.getCoordinate())&&i.visit(t),u&&this.queryNode(t.getRight(),e,!n,i)},findBestMatchNode:function(t){var e=new Xs(t,this.tolerance);return this.query(e.queryEnvelope(),e),e.getNode()},isEmpty:function(){return null===this.root},insertExact:function(t,e){for(var n=this.root,i=this.root,r=!0,s=!0;null!==n;){if(null!==n){var o=t.distance(n.getCoordinate())<=this.tolerance;if(o)return n.increment(),n}s=r?t.x<n.getX():t.y<n.getY(),i=n,n=s?n.getLeft():n.getRight(),r=!r}this.numberOfNodes=this.numberOfNodes+1;var a=new Ys(t,e);return s?i.setLeft(a):i.setRight(a),a},interfaces_:function(){return[]},getClass:function(){return Us}}),Us.toCoordinates=function(){if(1===arguments.length){var t=arguments[0];return Us.toCoordinates(t,!1)}if(2===arguments.length){for(var e=arguments[0],n=arguments[1],i=new N,r=e.iterator();r.hasNext();)for(var s=r.next(),o=n?s.getCount():1,a=0;o>a;a++)i.add(s.getCoordinate(),!0);return i.toCoordinateArray()}},e(Xs.prototype,{visit:function(t){var e=this.p.distance(t.getCoordinate()),n=e<=this.tolerance;if(!n)return null;var i=!1;(null===this.matchNode||e<this.matchDist||null!==this.matchNode&&e===this.matchDist&&t.getCoordinate().compareTo(this.matchNode.getCoordinate())<1)&&(i=!0),i&&(this.matchNode=t,this.matchDist=e)},queryEnvelope:function(){var t=new C(this.p);return t.expandBy(this.tolerance),t},getNode:function(){return this.matchNode},interfaces_:function(){return[ks]},getClass:function(){return Xs}}),Us.BestMatchVisitor=Xs,e(Hs.prototype,{getInitialVertices:function(){return this.initialVertices},getKDT:function(){return this.kdt},enforceConstraints:function(){this.addConstraintVertices();var t=0,e=0;do e=this.enforceGabriel(this.segments),t++;while(e>0&&t<Hs.MAX_SPLIT_ITER)},insertSites:function(t){for(var e=t.iterator();e.hasNext();){var n=e.next();this.insertSite(n)}},getVertexFactory:function(){return this.vertexFactory},getPointArray:function(){for(var t=new Array(this.initialVertices.size()+this.segVertices.size()).fill(null),e=0,n=this.initialVertices.iterator();n.hasNext();){var i=n.next();t[e++]=i.getCoordinate()}for(var r=this.segVertices.iterator();r.hasNext();){var i=r.next();t[e++]=i.getCoordinate()}return t},setConstraints:function(t,e){this.segments=t,this.segVertices=e},computeConvexHull:function(){var t=new ie,e=this.getPointArray(),n=new me(e,t);this.convexHull=n.getConvexHull()},addConstraintVertices:function(){this.computeConvexHull(),this.insertSites(this.segVertices)},findNonGabrielPoint:function(t){var e=t.getStart(),n=t.getEnd(),i=new g((e.x+n.x)/2,(e.y+n.y)/2),s=e.distance(i),o=new C(i);o.expandBy(s);for(var a=this.kdt.query(o),u=null,l=r.MAX_VALUE,h=a.iterator();h.hasNext();){var c=h.next(),f=c.getCoordinate();if(!f.equals2D(e)&&!f.equals2D(n)){var d=i.distance(f);if(s>d){var p=d;(null===u||l>p)&&(u=f,l=p)}}}return u},getConstraintSegments:function(){return this.segments},setSplitPointFinder:function(t){this.splitFinder=t},getConvexHull:function(){return this.convexHull},getTolerance:function(){return this.tolerance},enforceGabriel:function(t){for(var e=new I,n=0,i=new I,r=t.iterator();r.hasNext();){var s=r.next(),o=this.findNonGabrielPoint(s);if(null!==o){this.splitPt=this.splitFinder.findSplitPoint(s,o);var a=this.createVertex(this.splitPt,s),u=(this.insertSite(a),new Vs(s.getStartX(),s.getStartY(),s.getStartZ(),a.getX(),a.getY(),a.getZ(),s.getData())),l=new Vs(a.getX(),a.getY(),a.getZ(),s.getEndX(),s.getEndY(),s.getEndZ(),s.getData());e.add(u),e.add(l),i.add(s),n+=1}}return t.removeAll(i),t.addAll(e),n},createVertex:function(){if(1===arguments.length){var t=arguments[0],e=null;return e=null!==this.vertexFactory?this.vertexFactory.createVertex(t,null):new Ps(t)}if(2===arguments.length){var n=arguments[0],i=arguments[1],e=null;return e=null!==this.vertexFactory?this.vertexFactory.createVertex(n,i):new Ps(n),e.setOnConstraint(!0),e}},getSubdivision:function(){return this.subdiv},computeBoundingBox:function(){var t=Hs.computeVertexEnvelope(this.initialVertices),e=Hs.computeVertexEnvelope(this.segVertices),n=new C(t);n.expandToInclude(e);var i=.2*n.getWidth(),r=.2*n.getHeight(),s=Math.max(i,r);this.computeAreaEnv=new C(n),this.computeAreaEnv.expandBy(s)},setVertexFactory:function(t){this.vertexFactory=t},formInitialDelaunay:function(){this.computeBoundingBox(),this.subdiv=new Fs(this.computeAreaEnv,this.tolerance),this.subdiv.setLocator(new Ms(this.subdiv)),this.incDel=new Os(this.subdiv),this.insertSites(this.initialVertices)},insertSite:function(){if(arguments[0]instanceof Ps){var t=arguments[0],e=this.kdt.insert(t.getCoordinate(),t);if(e.isRepeated()){var n=e.getData();return n.merge(t),n}return this.incDel.insertSite(t),t}if(arguments[0]instanceof g){var i=arguments[0];this.insertSite(this.createVertex(i))}},interfaces_:function(){return[]},getClass:function(){return Hs}}),Hs.computeVertexEnvelope=function(t){for(var e=new C,n=t.iterator();n.hasNext();){var i=n.next();e.expandToInclude(i.getCoordinate())}return e},Hs.MAX_SPLIT_ITER=99,e(Ws.prototype,{create:function(){if(null!==this.subdiv)return null;var t=Ws.envelope(this.siteCoords),e=Ws.toVertices(this.siteCoords);this.subdiv=new Fs(t,this.tolerance);var n=new Os(this.subdiv);n.insertSites(e)},setTolerance:function(t){this.tolerance=t},setSites:function(){if(arguments[0]instanceof B){var t=arguments[0];this.siteCoords=Ws.extractUniqueCoordinates(t)}else if(R(arguments[0],v)){var e=arguments[0];this.siteCoords=Ws.unique(H.toCoordinateArray(e))}},getEdges:function(t){return this.create(),this.subdiv.getEdges(t)},getSubdivision:function(){return this.create(),this.subdiv},getTriangles:function(t){return this.create(),this.subdiv.getTriangles(t)},interfaces_:function(){return[]},getClass:function(){return Ws}}),Ws.extractUniqueCoordinates=function(t){if(null===t)return new N;var e=t.getCoordinates();return Ws.unique(e)},Ws.envelope=function(t){for(var e=new C,n=t.iterator();n.hasNext();){var i=n.next();e.expandToInclude(i)}return e},Ws.unique=function(t){var e=H.copyDeep(t);ut.sort(e);var n=new N(e,!1);return n},Ws.toVertices=function(t){for(var e=new I,n=t.iterator();n.hasNext();){var i=n.next();e.add(new Ts(i))}return e},e(js.prototype,{createSiteVertices:function(t){for(var e=new I,n=t.iterator();n.hasNext();){var i=n.next();this.constraintVertexMap.containsKey(i)||e.add(new Ps(i))}return e},create:function(){if(null!==this.subdiv)return null;var t=Ws.envelope(this.siteCoords),e=new I;null!==this.constraintLines&&(t.expandToInclude(this.constraintLines.getEnvelopeInternal()),this.createVertices(this.constraintLines),e=js.createConstraintSegments(this.constraintLines));var n=this.createSiteVertices(this.siteCoords),i=new Hs(n,this.tolerance);i.setConstraints(e,new I(this.constraintVertexMap.values())),i.formInitialDelaunay(),i.enforceConstraints(),this.subdiv=i.getSubdivision()},setTolerance:function(t){this.tolerance=t},setConstraints:function(t){this.constraintLines=t},setSites:function(t){this.siteCoords=Ws.extractUniqueCoordinates(t)},getEdges:function(t){return this.create(),this.subdiv.getEdges(t)},getSubdivision:function(){return this.create(),this.subdiv},getTriangles:function(t){return this.create(),this.subdiv.getTriangles(t)},createVertices:function(t){for(var e=t.getCoordinates(),n=0;n<e.length;n++){var i=new Ps(e[n]);this.constraintVertexMap.put(e[n],i)}},interfaces_:function(){return[]},getClass:function(){return js}}),js.createConstraintSegments=function(){if(1===arguments.length){for(var t=arguments[0],e=kn.getLines(t),n=new I,i=e.iterator();i.hasNext();){var r=i.next();js.createConstraintSegments(r,n)}return n}if(2===arguments.length)for(var s=arguments[0],o=arguments[1],a=s.getCoordinates(),i=1;i<a.length;i++)o.add(new Vs(a[i-1],a[i]))},e(Ks.prototype,{create:function(){if(null!==this.subdiv)return null;var t=Ws.envelope(this.siteCoords);this.diagramEnv=t;var e=Math.max(this.diagramEnv.getWidth(),this.diagramEnv.getHeight());this.diagramEnv.expandBy(e),null!==this.clipEnv&&this.diagramEnv.expandToInclude(this.clipEnv);var n=Ws.toVertices(this.siteCoords);this.subdiv=new Fs(t,this.tolerance);var i=new Os(this.subdiv);i.insertSites(n)},getDiagram:function(t){this.create();var e=this.subdiv.getVoronoiDiagram(t);return Ks.clipGeometryCollection(e,this.diagramEnv)},setTolerance:function(t){this.tolerance=t},setSites:function(){if(arguments[0]instanceof B){var t=arguments[0];this.siteCoords=Ws.extractUniqueCoordinates(t)}else if(R(arguments[0],v)){var e=arguments[0];this.siteCoords=Ws.unique(H.toCoordinateArray(e))}},setClipEnvelope:function(t){this.clipEnv=t},getSubdivision:function(){return this.create(),this.subdiv},interfaces_:function(){return[]},getClass:function(){return Ks}}),Ks.clipGeometryCollection=function(t,e){for(var n=t.getFactory().toGeometry(e),i=new I,r=0;r<t.getNumGeometries();r++){var s=t.getGeometryN(r),o=null;e.contains(s.getEnvelopeInternal())?o=s:e.intersects(s.getEnvelopeInternal())&&(o=n.intersection(s),o.setUserData(s.getUserData())),null===o||o.isEmpty()||i.add(o)}return t.getFactory().createGeometryCollection(ie.toGeometryArray(i))};var Do=Object.freeze({ConformingDelaunayTriangulationBuilder:js,DelaunayTriangulationBuilder:Ws,VoronoiDiagramBuilder:Ks});e(Zs.prototype,{interfaces_:function(){return[]},getClass:function(){return Zs}}),Zs.union=function(t,e){if(t.isEmpty()||e.isEmpty()){if(t.isEmpty()&&e.isEmpty())return ii.createEmptyResult(ii.UNION,t,e,t.getFactory());if(t.isEmpty())return e.copy();if(e.isEmpty())return t.copy()}return t.checkNotGeometryCollection(t),t.checkNotGeometryCollection(e),si.overlayOp(t,e,ii.UNION)},e(B.prototype,{equalsTopo:function(t){return this.getEnvelopeInternal().equals(t.getEnvelopeInternal())?Yr.relate(this,t).isEquals(this.getDimension(),t.getDimension()):!1},union:function(){if(0===arguments.length)return jr.union(this);if(1===arguments.length){var t=arguments[0];return Zs.union(this,t)}},isValid:function(){return ls.isValid(this)},intersection:function(t){if(this.isEmpty()||t.isEmpty())return ii.createEmptyResult(ii.INTERSECTION,this,t,this.factory);if(this.isGeometryCollection()){var e=t;return hn.map(this,{interfaces_:function(){return[MapOp]},map:function(t){return t.intersection(e)}})}return this.checkNotGeometryCollection(this),this.checkNotGeometryCollection(t),si.overlayOp(this,t,ii.INTERSECTION)},covers:function(t){return Yr.covers(this,t)},coveredBy:function(t){return Yr.coveredBy(this,t)},touches:function(t){return Yr.touches(this,t)},intersects:function(t){return Yr.intersects(this,t)},within:function(t){return Yr.within(this,t)},overlaps:function(t){return Yr.overlaps(this,t)},disjoint:function(t){return Yr.disjoint(this,t)},crosses:function(t){return Yr.crosses(this,t)},buffer:function(){if(1===arguments.length){var t=arguments[0];return sr.bufferOp(this,t)}if(2===arguments.length){var e=arguments[0],n=arguments[1];return sr.bufferOp(this,e,n)}if(3===arguments.length){var i=arguments[0],r=arguments[1],s=arguments[2];return sr.bufferOp(this,i,r,s)}},convexHull:function(){return new me(this).getConvexHull()},relate:function(){for(var t=arguments.length,e=Array(t),n=0;t>n;n++)e[n]=arguments[n];return Yr.relate.apply(Yr,[this].concat(e))},getCentroid:function(){if(this.isEmpty())return this.factory.createPoint();var t=ge.getCentroid(this);return this.createPointFromInternalCoord(t,this)},getInteriorPoint:function(){if(this.isEmpty())return this.factory.createPoint();var t=null,e=this.getDimension();if(0===e){var n=new li(this);t=n.getInteriorPoint()}else if(1===e){var n=new ui(this);t=n.getInteriorPoint()}else{var n=new oi(this);t=n.getInteriorPoint()}return this.createPointFromInternalCoord(t,this)},symDifference:function(t){if(this.isEmpty()||t.isEmpty()){if(this.isEmpty()&&t.isEmpty())return ii.createEmptyResult(ii.SYMDIFFERENCE,this,t,this.factory);if(this.isEmpty())return t.copy();if(t.isEmpty())return this.copy()}return this.checkNotGeometryCollection(this),this.checkNotGeometryCollection(t),si.overlayOp(this,t,ii.SYMDIFFERENCE)},createPointFromInternalCoord:function(t,e){return e.getPrecisionModel().makePrecise(t),e.getFactory().createPoint(t)},toText:function(){var t=new se;return t.write(this)},toString:function(){this.toText()},contains:function(t){return Yr.contains(this,t)},difference:function(t){return this.isEmpty()?ii.createEmptyResult(ii.DIFFERENCE,this,t,this.factory):t.isEmpty()?this.copy():(this.checkNotGeometryCollection(this),this.checkNotGeometryCollection(t),si.overlayOp(this,t,ii.DIFFERENCE))},isSimple:function(){var t=new Gi(this);return t.isSimple()},isWithinDistance:function(t,e){var n=this.getEnvelopeInternal().distance(t.getEnvelopeInternal());return n>e?!1:hr.isWithinDistance(this,t,e)},distance:function(t){return hr.distance(this,t)},isEquivalentClass:function(t){return this.getClass()===t.getClass()}});var Ao="1.1.2 (248dab8)";t.version=Ao,t.algorithm=co,t.densify=fo,t.dissolve=go,t.geom=lo,t.index=mo,t.io=Io,t.noding=No,t.operation=Oo,t.precision=_o,t.simplify=Mo,t.triangulate=Do});

},{}],14:[function(require,module,exports){
'use strict'

module.exports = monotoneConvexHull2D

var orient = require('robust-orientation')[3]

function monotoneConvexHull2D(points) {
  var n = points.length

  if(n < 3) {
    var result = new Array(n)
    for(var i=0; i<n; ++i) {
      result[i] = i
    }

    if(n === 2 &&
       points[0][0] === points[1][0] &&
       points[0][1] === points[1][1]) {
      return [0]
    }

    return result
  }

  //Sort point indices along x-axis
  var sorted = new Array(n)
  for(var i=0; i<n; ++i) {
    sorted[i] = i
  }
  sorted.sort(function(a,b) {
    var d = points[a][0]-points[b][0]
    if(d) {
      return d
    }
    return points[a][1] - points[b][1]
  })

  //Construct upper and lower hulls
  var lower = [sorted[0], sorted[1]]
  var upper = [sorted[0], sorted[1]]

  for(var i=2; i<n; ++i) {
    var idx = sorted[i]
    var p   = points[idx]

    //Insert into lower list
    var m = lower.length
    while(m > 1 && orient(
        points[lower[m-2]], 
        points[lower[m-1]], 
        p) <= 0) {
      m -= 1
      lower.pop()
    }
    lower.push(idx)

    //Insert into upper list
    m = upper.length
    while(m > 1 && orient(
        points[upper[m-2]], 
        points[upper[m-1]], 
        p) >= 0) {
      m -= 1
      upper.pop()
    }
    upper.push(idx)
  }

  //Merge lists together
  var result = new Array(upper.length + lower.length - 2)
  var ptr    = 0
  for(var i=0, nl=lower.length; i<nl; ++i) {
    result[ptr++] = lower[i]
  }
  for(var j=upper.length-2; j>0; --j) {
    result[ptr++] = upper[j]
  }

  //Return result
  return result
}
},{"robust-orientation":15}],15:[function(require,module,exports){
"use strict"

var twoProduct = require("two-product")
var robustSum = require("robust-sum")
var robustScale = require("robust-scale")
var robustSubtract = require("robust-subtract")

var NUM_EXPAND = 5

var EPSILON     = 1.1102230246251565e-16
var ERRBOUND3   = (3.0 + 16.0 * EPSILON) * EPSILON
var ERRBOUND4   = (7.0 + 56.0 * EPSILON) * EPSILON

function cofactor(m, c) {
  var result = new Array(m.length-1)
  for(var i=1; i<m.length; ++i) {
    var r = result[i-1] = new Array(m.length-1)
    for(var j=0,k=0; j<m.length; ++j) {
      if(j === c) {
        continue
      }
      r[k++] = m[i][j]
    }
  }
  return result
}

function matrix(n) {
  var result = new Array(n)
  for(var i=0; i<n; ++i) {
    result[i] = new Array(n)
    for(var j=0; j<n; ++j) {
      result[i][j] = ["m", j, "[", (n-i-1), "]"].join("")
    }
  }
  return result
}

function sign(n) {
  if(n & 1) {
    return "-"
  }
  return ""
}

function generateSum(expr) {
  if(expr.length === 1) {
    return expr[0]
  } else if(expr.length === 2) {
    return ["sum(", expr[0], ",", expr[1], ")"].join("")
  } else {
    var m = expr.length>>1
    return ["sum(", generateSum(expr.slice(0, m)), ",", generateSum(expr.slice(m)), ")"].join("")
  }
}

function determinant(m) {
  if(m.length === 2) {
    return [["sum(prod(", m[0][0], ",", m[1][1], "),prod(-", m[0][1], ",", m[1][0], "))"].join("")]
  } else {
    var expr = []
    for(var i=0; i<m.length; ++i) {
      expr.push(["scale(", generateSum(determinant(cofactor(m, i))), ",", sign(i), m[0][i], ")"].join(""))
    }
    return expr
  }
}

function orientation(n) {
  var pos = []
  var neg = []
  var m = matrix(n)
  var args = []
  for(var i=0; i<n; ++i) {
    if((i&1)===0) {
      pos.push.apply(pos, determinant(cofactor(m, i)))
    } else {
      neg.push.apply(neg, determinant(cofactor(m, i)))
    }
    args.push("m" + i)
  }
  var posExpr = generateSum(pos)
  var negExpr = generateSum(neg)
  var funcName = "orientation" + n + "Exact"
  var code = ["function ", funcName, "(", args.join(), "){var p=", posExpr, ",n=", negExpr, ",d=sub(p,n);\
return d[d.length-1];};return ", funcName].join("")
  var proc = new Function("sum", "prod", "scale", "sub", code)
  return proc(robustSum, twoProduct, robustScale, robustSubtract)
}

var orientation3Exact = orientation(3)
var orientation4Exact = orientation(4)

var CACHED = [
  function orientation0() { return 0 },
  function orientation1() { return 0 },
  function orientation2(a, b) { 
    return b[0] - a[0]
  },
  function orientation3(a, b, c) {
    var l = (a[1] - c[1]) * (b[0] - c[0])
    var r = (a[0] - c[0]) * (b[1] - c[1])
    var det = l - r
    var s
    if(l > 0) {
      if(r <= 0) {
        return det
      } else {
        s = l + r
      }
    } else if(l < 0) {
      if(r >= 0) {
        return det
      } else {
        s = -(l + r)
      }
    } else {
      return det
    }
    var tol = ERRBOUND3 * s
    if(det >= tol || det <= -tol) {
      return det
    }
    return orientation3Exact(a, b, c)
  },
  function orientation4(a,b,c,d) {
    var adx = a[0] - d[0]
    var bdx = b[0] - d[0]
    var cdx = c[0] - d[0]
    var ady = a[1] - d[1]
    var bdy = b[1] - d[1]
    var cdy = c[1] - d[1]
    var adz = a[2] - d[2]
    var bdz = b[2] - d[2]
    var cdz = c[2] - d[2]
    var bdxcdy = bdx * cdy
    var cdxbdy = cdx * bdy
    var cdxady = cdx * ady
    var adxcdy = adx * cdy
    var adxbdy = adx * bdy
    var bdxady = bdx * ady
    var det = adz * (bdxcdy - cdxbdy) 
            + bdz * (cdxady - adxcdy)
            + cdz * (adxbdy - bdxady)
    var permanent = (Math.abs(bdxcdy) + Math.abs(cdxbdy)) * Math.abs(adz)
                  + (Math.abs(cdxady) + Math.abs(adxcdy)) * Math.abs(bdz)
                  + (Math.abs(adxbdy) + Math.abs(bdxady)) * Math.abs(cdz)
    var tol = ERRBOUND4 * permanent
    if ((det > tol) || (-det > tol)) {
      return det
    }
    return orientation4Exact(a,b,c,d)
  }
]

function slowOrient(args) {
  var proc = CACHED[args.length]
  if(!proc) {
    proc = CACHED[args.length] = orientation(args.length)
  }
  return proc.apply(undefined, args)
}

function generateOrientationProc() {
  while(CACHED.length <= NUM_EXPAND) {
    CACHED.push(orientation(CACHED.length))
  }
  var args = []
  var procArgs = ["slow"]
  for(var i=0; i<=NUM_EXPAND; ++i) {
    args.push("a" + i)
    procArgs.push("o" + i)
  }
  var code = [
    "function getOrientation(", args.join(), "){switch(arguments.length){case 0:case 1:return 0;"
  ]
  for(var i=2; i<=NUM_EXPAND; ++i) {
    code.push("case ", i, ":return o", i, "(", args.slice(0, i).join(), ");")
  }
  code.push("}var s=new Array(arguments.length);for(var i=0;i<arguments.length;++i){s[i]=arguments[i]};return slow(s);}return getOrientation")
  procArgs.push(code.join(""))

  var proc = Function.apply(undefined, procArgs)
  module.exports = proc.apply(undefined, [slowOrient].concat(CACHED))
  for(var i=0; i<=NUM_EXPAND; ++i) {
    module.exports[i] = CACHED[i]
  }
}

generateOrientationProc()
},{"robust-scale":16,"robust-subtract":17,"robust-sum":18,"two-product":71}],16:[function(require,module,exports){
"use strict"

var twoProduct = require("two-product")
var twoSum = require("two-sum")

module.exports = scaleLinearExpansion

function scaleLinearExpansion(e, scale) {
  var n = e.length
  if(n === 1) {
    var ts = twoProduct(e[0], scale)
    if(ts[0]) {
      return ts
    }
    return [ ts[1] ]
  }
  var g = new Array(2 * n)
  var q = [0.1, 0.1]
  var t = [0.1, 0.1]
  var count = 0
  twoProduct(e[0], scale, q)
  if(q[0]) {
    g[count++] = q[0]
  }
  for(var i=1; i<n; ++i) {
    twoProduct(e[i], scale, t)
    var pq = q[1]
    twoSum(pq, t[0], q)
    if(q[0]) {
      g[count++] = q[0]
    }
    var a = t[1]
    var b = q[1]
    var x = a + b
    var bv = x - a
    var y = b - bv
    q[1] = x
    if(y) {
      g[count++] = y
    }
  }
  if(q[1]) {
    g[count++] = q[1]
  }
  if(count === 0) {
    g[count++] = 0.0
  }
  g.length = count
  return g
}
},{"two-product":71,"two-sum":72}],17:[function(require,module,exports){
"use strict"

module.exports = robustSubtract

//Easy case: Add two scalars
function scalarScalar(a, b) {
  var x = a + b
  var bv = x - a
  var av = x - bv
  var br = b - bv
  var ar = a - av
  var y = ar + br
  if(y) {
    return [y, x]
  }
  return [x]
}

function robustSubtract(e, f) {
  var ne = e.length|0
  var nf = f.length|0
  if(ne === 1 && nf === 1) {
    return scalarScalar(e[0], -f[0])
  }
  var n = ne + nf
  var g = new Array(n)
  var count = 0
  var eptr = 0
  var fptr = 0
  var abs = Math.abs
  var ei = e[eptr]
  var ea = abs(ei)
  var fi = -f[fptr]
  var fa = abs(fi)
  var a, b
  if(ea < fa) {
    b = ei
    eptr += 1
    if(eptr < ne) {
      ei = e[eptr]
      ea = abs(ei)
    }
  } else {
    b = fi
    fptr += 1
    if(fptr < nf) {
      fi = -f[fptr]
      fa = abs(fi)
    }
  }
  if((eptr < ne && ea < fa) || (fptr >= nf)) {
    a = ei
    eptr += 1
    if(eptr < ne) {
      ei = e[eptr]
      ea = abs(ei)
    }
  } else {
    a = fi
    fptr += 1
    if(fptr < nf) {
      fi = -f[fptr]
      fa = abs(fi)
    }
  }
  var x = a + b
  var bv = x - a
  var y = b - bv
  var q0 = y
  var q1 = x
  var _x, _bv, _av, _br, _ar
  while(eptr < ne && fptr < nf) {
    if(ea < fa) {
      a = ei
      eptr += 1
      if(eptr < ne) {
        ei = e[eptr]
        ea = abs(ei)
      }
    } else {
      a = fi
      fptr += 1
      if(fptr < nf) {
        fi = -f[fptr]
        fa = abs(fi)
      }
    }
    b = q0
    x = a + b
    bv = x - a
    y = b - bv
    if(y) {
      g[count++] = y
    }
    _x = q1 + x
    _bv = _x - q1
    _av = _x - _bv
    _br = x - _bv
    _ar = q1 - _av
    q0 = _ar + _br
    q1 = _x
  }
  while(eptr < ne) {
    a = ei
    b = q0
    x = a + b
    bv = x - a
    y = b - bv
    if(y) {
      g[count++] = y
    }
    _x = q1 + x
    _bv = _x - q1
    _av = _x - _bv
    _br = x - _bv
    _ar = q1 - _av
    q0 = _ar + _br
    q1 = _x
    eptr += 1
    if(eptr < ne) {
      ei = e[eptr]
    }
  }
  while(fptr < nf) {
    a = fi
    b = q0
    x = a + b
    bv = x - a
    y = b - bv
    if(y) {
      g[count++] = y
    } 
    _x = q1 + x
    _bv = _x - q1
    _av = _x - _bv
    _br = x - _bv
    _ar = q1 - _av
    q0 = _ar + _br
    q1 = _x
    fptr += 1
    if(fptr < nf) {
      fi = -f[fptr]
    }
  }
  if(q0) {
    g[count++] = q0
  }
  if(q1) {
    g[count++] = q1
  }
  if(!count) {
    g[count++] = 0.0  
  }
  g.length = count
  return g
}
},{}],18:[function(require,module,exports){
"use strict"

module.exports = linearExpansionSum

//Easy case: Add two scalars
function scalarScalar(a, b) {
  var x = a + b
  var bv = x - a
  var av = x - bv
  var br = b - bv
  var ar = a - av
  var y = ar + br
  if(y) {
    return [y, x]
  }
  return [x]
}

function linearExpansionSum(e, f) {
  var ne = e.length|0
  var nf = f.length|0
  if(ne === 1 && nf === 1) {
    return scalarScalar(e[0], f[0])
  }
  var n = ne + nf
  var g = new Array(n)
  var count = 0
  var eptr = 0
  var fptr = 0
  var abs = Math.abs
  var ei = e[eptr]
  var ea = abs(ei)
  var fi = f[fptr]
  var fa = abs(fi)
  var a, b
  if(ea < fa) {
    b = ei
    eptr += 1
    if(eptr < ne) {
      ei = e[eptr]
      ea = abs(ei)
    }
  } else {
    b = fi
    fptr += 1
    if(fptr < nf) {
      fi = f[fptr]
      fa = abs(fi)
    }
  }
  if((eptr < ne && ea < fa) || (fptr >= nf)) {
    a = ei
    eptr += 1
    if(eptr < ne) {
      ei = e[eptr]
      ea = abs(ei)
    }
  } else {
    a = fi
    fptr += 1
    if(fptr < nf) {
      fi = f[fptr]
      fa = abs(fi)
    }
  }
  var x = a + b
  var bv = x - a
  var y = b - bv
  var q0 = y
  var q1 = x
  var _x, _bv, _av, _br, _ar
  while(eptr < ne && fptr < nf) {
    if(ea < fa) {
      a = ei
      eptr += 1
      if(eptr < ne) {
        ei = e[eptr]
        ea = abs(ei)
      }
    } else {
      a = fi
      fptr += 1
      if(fptr < nf) {
        fi = f[fptr]
        fa = abs(fi)
      }
    }
    b = q0
    x = a + b
    bv = x - a
    y = b - bv
    if(y) {
      g[count++] = y
    }
    _x = q1 + x
    _bv = _x - q1
    _av = _x - _bv
    _br = x - _bv
    _ar = q1 - _av
    q0 = _ar + _br
    q1 = _x
  }
  while(eptr < ne) {
    a = ei
    b = q0
    x = a + b
    bv = x - a
    y = b - bv
    if(y) {
      g[count++] = y
    }
    _x = q1 + x
    _bv = _x - q1
    _av = _x - _bv
    _br = x - _bv
    _ar = q1 - _av
    q0 = _ar + _br
    q1 = _x
    eptr += 1
    if(eptr < ne) {
      ei = e[eptr]
    }
  }
  while(fptr < nf) {
    a = fi
    b = q0
    x = a + b
    bv = x - a
    y = b - bv
    if(y) {
      g[count++] = y
    } 
    _x = q1 + x
    _bv = _x - q1
    _av = _x - _bv
    _br = x - _bv
    _ar = q1 - _av
    q0 = _ar + _br
    q1 = _x
    fptr += 1
    if(fptr < nf) {
      fi = f[fptr]
    }
  }
  if(q0) {
    g[count++] = q0
  }
  if(q1) {
    g[count++] = q1
  }
  if(!count) {
    g[count++] = 0.0  
  }
  g.length = count
  return g
}
},{}],19:[function(require,module,exports){
"use strict"; "use restrict";

var bits      = require("bit-twiddle")
  , UnionFind = require("union-find")

//Returns the dimension of a cell complex
function dimension(cells) {
  var d = 0
    , max = Math.max
  for(var i=0, il=cells.length; i<il; ++i) {
    d = max(d, cells[i].length)
  }
  return d-1
}
exports.dimension = dimension

//Counts the number of vertices in faces
function countVertices(cells) {
  var vc = -1
    , max = Math.max
  for(var i=0, il=cells.length; i<il; ++i) {
    var c = cells[i]
    for(var j=0, jl=c.length; j<jl; ++j) {
      vc = max(vc, c[j])
    }
  }
  return vc+1
}
exports.countVertices = countVertices

//Returns a deep copy of cells
function cloneCells(cells) {
  var ncells = new Array(cells.length)
  for(var i=0, il=cells.length; i<il; ++i) {
    ncells[i] = cells[i].slice(0)
  }
  return ncells
}
exports.cloneCells = cloneCells

//Ranks a pair of cells up to permutation
function compareCells(a, b) {
  var n = a.length
    , t = a.length - b.length
    , min = Math.min
  if(t) {
    return t
  }
  switch(n) {
    case 0:
      return 0;
    case 1:
      return a[0] - b[0];
    case 2:
      var d = a[0]+a[1]-b[0]-b[1]
      if(d) {
        return d
      }
      return min(a[0],a[1]) - min(b[0],b[1])
    case 3:
      var l1 = a[0]+a[1]
        , m1 = b[0]+b[1]
      d = l1+a[2] - (m1+b[2])
      if(d) {
        return d
      }
      var l0 = min(a[0], a[1])
        , m0 = min(b[0], b[1])
        , d  = min(l0, a[2]) - min(m0, b[2])
      if(d) {
        return d
      }
      return min(l0+a[2], l1) - min(m0+b[2], m1)
    
    //TODO: Maybe optimize n=4 as well?
    
    default:
      var as = a.slice(0)
      as.sort()
      var bs = b.slice(0)
      bs.sort()
      for(var i=0; i<n; ++i) {
        t = as[i] - bs[i]
        if(t) {
          return t
        }
      }
      return 0
  }
}
exports.compareCells = compareCells

function compareZipped(a, b) {
  return compareCells(a[0], b[0])
}

//Puts a cell complex into normal order for the purposes of findCell queries
function normalize(cells, attr) {
  if(attr) {
    var len = cells.length
    var zipped = new Array(len)
    for(var i=0; i<len; ++i) {
      zipped[i] = [cells[i], attr[i]]
    }
    zipped.sort(compareZipped)
    for(var i=0; i<len; ++i) {
      cells[i] = zipped[i][0]
      attr[i] = zipped[i][1]
    }
    return cells
  } else {
    cells.sort(compareCells)
    return cells
  }
}
exports.normalize = normalize

//Removes all duplicate cells in the complex
function unique(cells) {
  if(cells.length === 0) {
    return []
  }
  var ptr = 1
    , len = cells.length
  for(var i=1; i<len; ++i) {
    var a = cells[i]
    if(compareCells(a, cells[i-1])) {
      if(i === ptr) {
        ptr++
        continue
      }
      cells[ptr++] = a
    }
  }
  cells.length = ptr
  return cells
}
exports.unique = unique;

//Finds a cell in a normalized cell complex
function findCell(cells, c) {
  var lo = 0
    , hi = cells.length-1
    , r  = -1
  while (lo <= hi) {
    var mid = (lo + hi) >> 1
      , s   = compareCells(cells[mid], c)
    if(s <= 0) {
      if(s === 0) {
        r = mid
      }
      lo = mid + 1
    } else if(s > 0) {
      hi = mid - 1
    }
  }
  return r
}
exports.findCell = findCell;

//Builds an index for an n-cell.  This is more general than dual, but less efficient
function incidence(from_cells, to_cells) {
  var index = new Array(from_cells.length)
  for(var i=0, il=index.length; i<il; ++i) {
    index[i] = []
  }
  var b = []
  for(var i=0, n=to_cells.length; i<n; ++i) {
    var c = to_cells[i]
    var cl = c.length
    for(var k=1, kn=(1<<cl); k<kn; ++k) {
      b.length = bits.popCount(k)
      var l = 0
      for(var j=0; j<cl; ++j) {
        if(k & (1<<j)) {
          b[l++] = c[j]
        }
      }
      var idx=findCell(from_cells, b)
      if(idx < 0) {
        continue
      }
      while(true) {
        index[idx++].push(i)
        if(idx >= from_cells.length || compareCells(from_cells[idx], b) !== 0) {
          break
        }
      }
    }
  }
  return index
}
exports.incidence = incidence

//Computes the dual of the mesh.  This is basically an optimized version of buildIndex for the situation where from_cells is just the list of vertices
function dual(cells, vertex_count) {
  if(!vertex_count) {
    return incidence(unique(skeleton(cells, 0)), cells, 0)
  }
  var res = new Array(vertex_count)
  for(var i=0; i<vertex_count; ++i) {
    res[i] = []
  }
  for(var i=0, len=cells.length; i<len; ++i) {
    var c = cells[i]
    for(var j=0, cl=c.length; j<cl; ++j) {
      res[c[j]].push(i)
    }
  }
  return res
}
exports.dual = dual

//Enumerates all cells in the complex
function explode(cells) {
  var result = []
  for(var i=0, il=cells.length; i<il; ++i) {
    var c = cells[i]
      , cl = c.length|0
    for(var j=1, jl=(1<<cl); j<jl; ++j) {
      var b = []
      for(var k=0; k<cl; ++k) {
        if((j >>> k) & 1) {
          b.push(c[k])
        }
      }
      result.push(b)
    }
  }
  return normalize(result)
}
exports.explode = explode

//Enumerates all of the n-cells of a cell complex
function skeleton(cells, n) {
  if(n < 0) {
    return []
  }
  var result = []
    , k0     = (1<<(n+1))-1
  for(var i=0; i<cells.length; ++i) {
    var c = cells[i]
    for(var k=k0; k<(1<<c.length); k=bits.nextCombination(k)) {
      var b = new Array(n+1)
        , l = 0
      for(var j=0; j<c.length; ++j) {
        if(k & (1<<j)) {
          b[l++] = c[j]
        }
      }
      result.push(b)
    }
  }
  return normalize(result)
}
exports.skeleton = skeleton;

//Computes the boundary of all cells, does not remove duplicates
function boundary(cells) {
  var res = []
  for(var i=0,il=cells.length; i<il; ++i) {
    var c = cells[i]
    for(var j=0,cl=c.length; j<cl; ++j) {
      var b = new Array(c.length-1)
      for(var k=0, l=0; k<cl; ++k) {
        if(k !== j) {
          b[l++] = c[k]
        }
      }
      res.push(b)
    }
  }
  return normalize(res)
}
exports.boundary = boundary;

//Computes connected components for a dense cell complex
function connectedComponents_dense(cells, vertex_count) {
  var labels = new UnionFind(vertex_count)
  for(var i=0; i<cells.length; ++i) {
    var c = cells[i]
    for(var j=0; j<c.length; ++j) {
      for(var k=j+1; k<c.length; ++k) {
        labels.link(c[j], c[k])
      }
    }
  }
  var components = []
    , component_labels = labels.ranks
  for(var i=0; i<component_labels.length; ++i) {
    component_labels[i] = -1
  }
  for(var i=0; i<cells.length; ++i) {
    var l = labels.find(cells[i][0])
    if(component_labels[l] < 0) {
      component_labels[l] = components.length
      components.push([cells[i].slice(0)])
    } else {
      components[component_labels[l]].push(cells[i].slice(0))
    }
  }
  return components
}

//Computes connected components for a sparse graph
function connectedComponents_sparse(cells) {
  var vertices  = unique(normalize(skeleton(cells, 0)))
    , labels    = new UnionFind(vertices.length)
  for(var i=0; i<cells.length; ++i) {
    var c = cells[i]
    for(var j=0; j<c.length; ++j) {
      var vj = findCell(vertices, [c[j]])
      for(var k=j+1; k<c.length; ++k) {
        labels.link(vj, findCell(vertices, [c[k]]))
      }
    }
  }
  var components        = []
    , component_labels  = labels.ranks
  for(var i=0; i<component_labels.length; ++i) {
    component_labels[i] = -1
  }
  for(var i=0; i<cells.length; ++i) {
    var l = labels.find(findCell(vertices, [cells[i][0]]));
    if(component_labels[l] < 0) {
      component_labels[l] = components.length
      components.push([cells[i].slice(0)])
    } else {
      components[component_labels[l]].push(cells[i].slice(0))
    }
  }
  return components
}

//Computes connected components for a cell complex
function connectedComponents(cells, vertex_count) {
  if(vertex_count) {
    return connectedComponents_dense(cells, vertex_count)
  }
  return connectedComponents_sparse(cells)
}
exports.connectedComponents = connectedComponents

},{"bit-twiddle":3,"union-find":73}],20:[function(require,module,exports){
/*
 (c) 2013, Vladimir Agafonkin
 Simplify.js, a high-performance JS polyline simplification library
 mourner.github.io/simplify-js
*/

(function () { 'use strict';

// to suit your point format, run search/replace for '.x' and '.y';
// for 3D version, see 3d branch (configurability would draw significant performance overhead)

// square distance between 2 points
function getSqDist(p1, p2) {

    var dx = p1.x - p2.x,
        dy = p1.y - p2.y;

    return dx * dx + dy * dy;
}

// square distance from a point to a segment
function getSqSegDist(p, p1, p2) {

    var x = p1.x,
        y = p1.y,
        dx = p2.x - x,
        dy = p2.y - y;

    if (dx !== 0 || dy !== 0) {

        var t = ((p.x - x) * dx + (p.y - y) * dy) / (dx * dx + dy * dy);

        if (t > 1) {
            x = p2.x;
            y = p2.y;

        } else if (t > 0) {
            x += dx * t;
            y += dy * t;
        }
    }

    dx = p.x - x;
    dy = p.y - y;

    return dx * dx + dy * dy;
}
// rest of the code doesn't care about point format

// basic distance-based simplification
function simplifyRadialDist(points, sqTolerance) {

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
}

// simplification using optimized Douglas-Peucker algorithm with recursion elimination
function simplifyDouglasPeucker(points, sqTolerance) {

    var len = points.length,
        MarkerArray = typeof Uint8Array !== 'undefined' ? Uint8Array : Array,
        markers = new MarkerArray(len),
        first = 0,
        last = len - 1,
        stack = [],
        newPoints = [],
        i, maxSqDist, sqDist, index;

    markers[first] = markers[last] = 1;

    while (last) {

        maxSqDist = 0;

        for (i = first + 1; i < last; i++) {
            sqDist = getSqSegDist(points[i], points[first], points[last]);

            if (sqDist > maxSqDist) {
                index = i;
                maxSqDist = sqDist;
            }
        }

        if (maxSqDist > sqTolerance) {
            markers[index] = 1;
            stack.push(first, index, index, last);
        }

        last = stack.pop();
        first = stack.pop();
    }

    for (i = 0; i < len; i++) {
        if (markers[i]) newPoints.push(points[i]);
    }

    return newPoints;
}

// both algorithms combined for awesome performance
function simplify(points, tolerance, highestQuality) {

    var sqTolerance = tolerance !== undefined ? tolerance * tolerance : 1;

    points = highestQuality ? points : simplifyRadialDist(points, sqTolerance);
    points = simplifyDouglasPeucker(points, sqTolerance);

    return points;
}

// export as AMD module / Node module / browser or worker variable
if (typeof define === 'function' && define.amd) define(function() { return simplify; });
else if (typeof module !== 'undefined') module.exports = simplify;
else if (typeof self !== 'undefined') self.simplify = simplify;
else window.simplify = simplify;

})();

},{}],21:[function(require,module,exports){
var distance = require('turf-distance');
var point = require('turf-helpers').point;
var bearing = require('turf-bearing');
var destination = require('turf-destination');

/**
 * Takes a {@link LineString|line} and returns a {@link Point|point} at a specified distance along the line.
 *
 * @name along
 * @param {Feature<LineString>} line input line
 * @param {number} distance distance along the line
 * @param {String} [units=miles] can be degrees, radians, miles, or kilometers
 * @return {Feature<Point>} Point `distance` `units` along the line
 * @example
 * var line = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "LineString",
 *     "coordinates": [
 *       [-77.031669, 38.878605],
 *       [-77.029609, 38.881946],
 *       [-77.020339, 38.884084],
 *       [-77.025661, 38.885821],
 *       [-77.021884, 38.889563],
 *       [-77.019824, 38.892368]
 *     ]
 *   }
 * };
 *
 * var along = turf.along(line, 1, 'miles');
 *
 * var result = {
 *   "type": "FeatureCollection",
 *   "features": [line, along]
 * };
 *
 * //=result
 */
module.exports = function (line, dist, units) {
    var coords;
    if (line.type === 'Feature') coords = line.geometry.coordinates;
    else if (line.type === 'LineString') coords = line.coordinates;
    else throw new Error('input must be a LineString Feature or Geometry');

    var travelled = 0;
    for (var i = 0; i < coords.length; i++) {
        if (dist >= travelled && i === coords.length - 1) break;
        else if (travelled >= dist) {
            var overshot = dist - travelled;
            if (!overshot) return point(coords[i]);
            else {
                var direction = bearing(coords[i], coords[i - 1]) - 180;
                var interpolated = destination(coords[i], overshot, direction, units);
                return interpolated;
            }
        } else {
            travelled += distance(coords[i], coords[i + 1], units);
        }
    }
    return point(coords[coords.length - 1]);
};

},{"turf-bearing":25,"turf-destination":35,"turf-distance":37,"turf-helpers":42}],22:[function(require,module,exports){
var geometryArea = require('geojson-area').geometry;

/**
 * Takes a one or more features and returns their area
 * in square meters.
 *
 * @param {(Feature|FeatureCollection)} input input features
 * @return {Number} area in square meters
 * @example
 * var polygons = {
 *   "type": "FeatureCollection",
 *   "features": [
 *     {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Polygon",
 *         "coordinates": [[
 *           [-67.031021, 10.458102],
 *           [-67.031021, 10.53372],
 *           [-66.929397, 10.53372],
 *           [-66.929397, 10.458102],
 *           [-67.031021, 10.458102]
 *         ]]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Polygon",
 *         "coordinates": [[
 *           [-66.919784, 10.397325],
 *           [-66.919784, 10.513467],
 *           [-66.805114, 10.513467],
 *           [-66.805114, 10.397325],
 *           [-66.919784, 10.397325]
 *         ]]
 *       }
 *     }
 *   ]
 * };
 *
 * var area = turf.area(polygons);
 *
 * //=area
 */
function area(input) {
    if (input.type === 'FeatureCollection') {
        for (var i = 0, sum = 0; i < input.features.length; i++) {
            if (input.features[i].geometry) {
                sum += geometryArea(input.features[i].geometry);
            }
        }
        return sum;
    } else if (input.type === 'Feature') {
        return geometryArea(input.geometry);
    } else {
        return geometryArea(input);
    }
}
module.exports = area;

},{"geojson-area":9}],23:[function(require,module,exports){
var polygon = require('turf-helpers').polygon;

/**
 * Takes a bbox and returns an equivalent {@link Polygon|polygon}.
 *
 * @name bboxPolygon
 * @param {Array<number>} bbox an Array of bounding box coordinates in the form: ```[xLow, yLow, xHigh, yHigh]```
 * @return {Feature<Polygon>} a Polygon representation of the bounding box
 * @example
 * var bbox = [0, 0, 10, 10];
 *
 * var poly = turf.bboxPolygon(bbox);
 *
 * //=poly
 */

module.exports = function (bbox) {
    var lowLeft = [bbox[0], bbox[1]];
    var topLeft = [bbox[0], bbox[3]];
    var topRight = [bbox[2], bbox[3]];
    var lowRight = [bbox[2], bbox[1]];

    return polygon([[
        lowLeft,
        lowRight,
        topRight,
        topLeft,
        lowLeft
    ]]);
};

},{"turf-helpers":42}],24:[function(require,module,exports){
var each = require('turf-meta').coordEach;

/**
 * Takes a set of features, calculates the bbox of all input features, and returns a bounding box.
 *
 * @name bbox
 * @param {(Feature|FeatureCollection)} input input features
 * @return {Array<number>} the bounding box of `input` given
 * as an array in WSEN order (west, south, east, north)
 * @example
 * var input = {
 *   "type": "FeatureCollection",
 *   "features": [
 *     {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [114.175329, 22.2524]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [114.170007, 22.267969]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [114.200649, 22.274641]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [114.186744, 22.265745]
 *       }
 *     }
 *   ]
 * };
 *
 * var bbox = turf.bbox(input);
 *
 * var bboxPolygon = turf.bboxPolygon(bbox);
 *
 * var resultFeatures = input.features.concat(bboxPolygon);
 * var result = {
 *   "type": "FeatureCollection",
 *   "features": resultFeatures
 * };
 *
 * //=result
 */
module.exports = function (layer) {
    var bbox = [Infinity, Infinity, -Infinity, -Infinity];
    each(layer, function (coord) {
        if (bbox[0] > coord[0]) bbox[0] = coord[0];
        if (bbox[1] > coord[1]) bbox[1] = coord[1];
        if (bbox[2] < coord[0]) bbox[2] = coord[0];
        if (bbox[3] < coord[1]) bbox[3] = coord[1];
    });
    return bbox;
};

},{"turf-meta":52}],25:[function(require,module,exports){
var getCoord = require('turf-invariant').getCoord;
//http://en.wikipedia.org/wiki/Haversine_formula
//http://www.movable-type.co.uk/scripts/latlong.html

/**
 * Takes two {@link Point|points} and finds the geographic bearing between them.
 *
 * @name bearing
 * @param {Feature<Point>} start starting Point
 * @param {Feature<Point>} end ending Point
 * @returns {Number} bearing in decimal degrees
 * @example
 * var point1 = {
 *   "type": "Feature",
 *   "properties": {
 *     "marker-color": '#f00'
 *   },
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [-75.343, 39.984]
 *   }
 * };
 * var point2 = {
 *   "type": "Feature",
 *   "properties": {
 *     "marker-color": '#0f0'
 *   },
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [-75.534, 39.123]
 *   }
 * };
 *
 * var points = {
 *   "type": "FeatureCollection",
 *   "features": [point1, point2]
 * };
 *
 * //=points
 *
 * var bearing = turf.bearing(point1, point2);
 *
 * //=bearing
 */
module.exports = function (p1, p2) {
    var degrees2radians = Math.PI / 180;
    var radians2degrees = 180 / Math.PI;
    var coordinates1 = getCoord(p1);
    var coordinates2 = getCoord(p2);

    var lon1 = degrees2radians * coordinates1[0];
    var lon2 = degrees2radians * coordinates2[0];
    var lat1 = degrees2radians * coordinates1[1];
    var lat2 = degrees2radians * coordinates2[1];
    var a = Math.sin(lon2 - lon1) * Math.cos(lat2);
    var b = Math.cos(lat1) * Math.sin(lat2) -
        Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);

    var bearing = radians2degrees * Math.atan2(a, b);

    return bearing;
};

},{"turf-invariant":46}],26:[function(require,module,exports){
var linestring = require('turf-helpers').lineString;
var Spline = require('./spline.js');

/**
 * Takes a {@link LineString|line} and returns a curved version
 * by applying a [Bezier spline](http://en.wikipedia.org/wiki/B%C3%A9zier_spline)
 * algorithm.
 *
 * The bezier spline implementation is by [Leszek Rybicki](http://leszek.rybicki.cc/).
 *
 * @name bezier
 * @param {Feature<LineString>} line input LineString
 * @param {Number} [resolution=10000] time in milliseconds between points
 * @param {Number} [sharpness=0.85] a measure of how curvy the path should be between splines
 * @returns {Feature<LineString>} curved line
 * @example
 * var line = {
 *   "type": "Feature",
 *   "properties": {
 *     "stroke": "#f00"
 *   },
 *   "geometry": {
 *     "type": "LineString",
 *     "coordinates": [
 *       [-76.091308, 18.427501],
 *       [-76.695556, 18.729501],
 *       [-76.552734, 19.40443],
 *       [-74.61914, 19.134789],
 *       [-73.652343, 20.07657],
 *       [-73.157958, 20.210656]
 *     ]
 *   }
 * };
 *
 * var curved = turf.bezier(line);
 * curved.properties = { stroke: '#0f0' };
 *
 * var result = {
 *   "type": "FeatureCollection",
 *   "features": [line, curved]
 * };
 *
 * //=result
 */
module.exports = function (line, resolution, sharpness) {
    var lineOut = linestring([]);

    lineOut.properties = line.properties;

    var spline = new Spline({
        points: line.geometry.coordinates.map(function (pt) {
            return {x: pt[0], y: pt[1]};
        }),
        duration: resolution,
        sharpness: sharpness
    });

    for (var i = 0; i < spline.duration; i += 10) {
        var pos = spline.pos(i);
        if (Math.floor(i / 100) % 2 === 0) {
            lineOut.geometry.coordinates.push([pos.x, pos.y]);
        }
    }

    return lineOut;
};

},{"./spline.js":27,"turf-helpers":42}],27:[function(require,module,exports){
/* eslint-disable */

 /**
   * BezierSpline
   * https://github.com/leszekr/bezier-spline-js
   *
   * @private
   * @copyright
   * Copyright (c) 2013 Leszek Rybicki
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   */
var Spline = function (options) {
    this.points = options.points || [];
    this.duration = options.duration || 10000;
    this.sharpness = options.sharpness || 0.85;
    this.centers = [];
    this.controls = [];
    this.stepLength = options.stepLength || 60;
    this.length = this.points.length;
    this.delay = 0;
    // this is to ensure compatibility with the 2d version
    for (var i = 0; i < this.length; i++) this.points[i].z = this.points[i].z || 0;
    for (var i = 0; i < this.length - 1; i++) {
        var p1 = this.points[i];
        var p2 = this.points[i + 1];
        this.centers.push({
            x: (p1.x + p2.x) / 2,
            y: (p1.y + p2.y) / 2,
            z: (p1.z + p2.z) / 2
        });
    }
    this.controls.push([this.points[0], this.points[0]]);
    for (var i = 0; i < this.centers.length - 1; i++) {
        var p1 = this.centers[i];
        var p2 = this.centers[i + 1];
        var dx = this.points[i + 1].x - (this.centers[i].x + this.centers[i + 1].x) / 2;
        var dy = this.points[i + 1].y - (this.centers[i].y + this.centers[i + 1].y) / 2;
        var dz = this.points[i + 1].z - (this.centers[i].y + this.centers[i + 1].z) / 2;
        this.controls.push([{
            x: (1.0 - this.sharpness) * this.points[i + 1].x + this.sharpness * (this.centers[i].x + dx),
            y: (1.0 - this.sharpness) * this.points[i + 1].y + this.sharpness * (this.centers[i].y + dy),
            z: (1.0 - this.sharpness) * this.points[i + 1].z + this.sharpness * (this.centers[i].z + dz)},
            {
                x: (1.0 - this.sharpness) * this.points[i + 1].x + this.sharpness * (this.centers[i + 1].x + dx),
                y: (1.0 - this.sharpness) * this.points[i + 1].y + this.sharpness * (this.centers[i + 1].y + dy),
                z: (1.0 - this.sharpness) * this.points[i + 1].z + this.sharpness * (this.centers[i + 1].z + dz)}]);
    }
    this.controls.push([this.points[this.length - 1], this.points[this.length - 1]]);
    this.steps = this.cacheSteps(this.stepLength);
    return this;
};

  /*
    Caches an array of equidistant (more or less) points on the curve.
  */
Spline.prototype.cacheSteps = function (mindist) {
    var steps = [];
    var laststep = this.pos(0);
    steps.push(0);
    for (var t = 0; t < this.duration; t += 10) {
        var step = this.pos(t);
        var dist = Math.sqrt((step.x - laststep.x) * (step.x - laststep.x) + (step.y - laststep.y) * (step.y - laststep.y) + (step.z - laststep.z) * (step.z - laststep.z));
        if (dist > mindist) {
            steps.push(t);
            laststep = step;
        }
    }
    return steps;
};

  /*
    returns angle and speed in the given point in the curve
  */
Spline.prototype.vector = function (t) {
    var p1 = this.pos(t + 10);
    var p2 = this.pos(t - 10);
    return {
        angle:180 * Math.atan2(p1.y - p2.y, p1.x - p2.x) / 3.14,
        speed:Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y) + (p2.z - p1.z) * (p2.z - p1.z))
    };
};

  /*
    Gets the position of the point, given time.

    WARNING: The speed is not constant. The time it takes between control points is constant.

    For constant speed, use Spline.steps[i];
  */
Spline.prototype.pos = function (time) {

    function bezier(t, p1, c1, c2, p2) {
        var B = function (t) {
            var t2 = t * t, t3 = t2 * t;
            return [(t3), (3 * t2 * (1 - t)), (3 * t * (1 - t) * (1 - t)), ((1 - t) * (1 - t) * (1 - t))];
        };
        var b = B(t);
        var pos = {
            x : p2.x * b[0] + c2.x * b[1] + c1.x * b[2] + p1.x * b[3],
            y : p2.y * b[0] + c2.y * b[1] + c1.y * b[2] + p1.y * b[3],
            z : p2.z * b[0] + c2.z * b[1] + c1.z * b[2] + p1.z * b[3]
        };
        return pos;
    }
    var t = time - this.delay;
    if (t < 0) t = 0;
    if (t > this.duration) t = this.duration - 1;
    //t = t-this.delay;
    var t2 = (t) / this.duration;
    if (t2 >= 1) return this.points[this.length - 1];

    var n = Math.floor((this.points.length - 1) * t2);
    var t1 = (this.length - 1) * t2 - n;
    return bezier(t1, this.points[n], this.controls[n][1], this.controls[n + 1][0], this.points[n + 1]);
};

module.exports = Spline;

},{}],28:[function(require,module,exports){
// http://stackoverflow.com/questions/839899/how-do-i-calculate-a-point-on-a-circles-circumference
// radians = degrees * (pi/180)
// https://github.com/bjornharrtell/jsts/blob/master/examples/buffer.html

var helpers = require('turf-helpers');
var featureCollection = helpers.featureCollection;
var jsts = require('jsts');
var normalize = require('geojson-normalize');

/**
 * Calculates a buffer for input features for a given radius. Units supported are miles, kilometers, and degrees.
 *
 * @name buffer
 * @param {(Feature|FeatureCollection)} feature input to be buffered
 * @param {number} distance distance to draw the buffer
 * @param {string} unit any of the options supported by turf units
 * @return {FeatureCollection<Polygon>|FeatureCollection<MultiPolygon>|Polygon|MultiPolygon} buffered features
 *
 * @example
 * var pt = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [-90.548630, 14.616599]
 *   }
 * };
 * var unit = 'miles';
 *
 * var buffered = turf.buffer(pt, 500, unit);
 * var result = turf.featurecollection([buffered, pt]);
 *
 * //=result
 */

module.exports = function (feature, radius, units) {

    var degrees = helpers.distanceToDegrees(radius, units);
    var fc = normalize(feature);
    var buffered = normalize(featureCollection(fc.features.map(function (f) {
        return bufferOp(f, degrees);
    })));

    if (buffered.features.length > 1) return buffered;
    else if (buffered.features.length === 1) return buffered.features[0];
};

function bufferOp(feature, radius) {
    var reader = new jsts.io.GeoJSONReader();
    var geom = reader.read(feature.geometry);
    var buffered = geom.buffer(radius);
    var writer = new jsts.io.GeoJSONWriter();
    buffered = writer.write(buffered);

    return {
        type: 'Feature',
        geometry: buffered,
        properties: {}
    };
}

},{"geojson-normalize":10,"jsts":13,"turf-helpers":42}],29:[function(require,module,exports){
var bbox = require('turf-bbox'),
    point = require('turf-helpers').point;

/**
 * Takes a {@link FeatureCollection} and returns the absolute center point of all features.
 *
 * @name center
 * @param {FeatureCollection} features input features
 * @return {Feature<Point>} a Point feature at the
 * absolute center point of all input features
 * @example
 * var features = {
 *   "type": "FeatureCollection",
 *   "features": [
 *     {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-97.522259, 35.4691]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-97.502754, 35.463455]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-97.508269, 35.463245]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-97.516809, 35.465779]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-97.515372, 35.467072]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-97.509363, 35.463053]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-97.511123, 35.466601]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-97.518547, 35.469327]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-97.519706, 35.469659]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-97.517839, 35.466998]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-97.508678, 35.464942]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-97.514914, 35.463453]
 *       }
 *     }
 *   ]
 * };
 *
 * var centerPt = turf.center(features);
 * centerPt.properties['marker-size'] = 'large';
 * centerPt.properties['marker-color'] = '#000';
 *
 * var resultFeatures = features.features.concat(centerPt);
 * var result = {
 *   "type": "FeatureCollection",
 *   "features": resultFeatures
 * };
 *
 * //=result
 */

module.exports = function (layer) {
    var ext = bbox(layer);
    var x = (ext[0] + ext[2]) / 2;
    var y = (ext[1] + ext[3]) / 2;
    return point([x, y]);
};

},{"turf-bbox":24,"turf-helpers":42}],30:[function(require,module,exports){
var each = require('turf-meta').coordEach;
var point = require('turf-helpers').point;

/**
 * Takes one or more features and calculates the centroid using
 * the mean of all vertices.
 * This lessens the effect of small islands and artifacts when calculating
 * the centroid of a set of polygons.
 *
 * @name centroid
 * @param {(Feature|FeatureCollection)} features input features
 * @return {Feature<Point>} the centroid of the input features
 * @example
 * var poly = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Polygon",
 *     "coordinates": [[
 *       [105.818939,21.004714],
 *       [105.818939,21.061754],
 *       [105.890007,21.061754],
 *       [105.890007,21.004714],
 *       [105.818939,21.004714]
 *     ]]
 *   }
 * };
 *
 * var centroidPt = turf.centroid(poly);
 *
 * var result = {
 *   "type": "FeatureCollection",
 *   "features": [poly, centroidPt]
 * };
 *
 * //=result
 */
module.exports = function (features) {
    var xSum = 0, ySum = 0, len = 0;
    each(features, function (coord) {
        xSum += coord[0];
        ySum += coord[1];
        len++;
    }, true);
    return point([xSum / len, ySum / len]);
};

},{"turf-helpers":42,"turf-meta":52}],31:[function(require,module,exports){
var inside = require('turf-inside');

/**
 * Joins attributes FeatureCollection of polygons with a FeatureCollection of
 * points. Given an `inProperty` on points and an `outProperty` for polygons,
 * this finds every point that lies within each polygon, collects the `inProperty`
 * values from those points, and adds them as an array to `outProperty` on the
 * polygon.
 *
 * @name collect
 * @param {FeatureCollection<Polygon>} polygons polygons with values on which to aggregate
 * @param {FeatureCollection<Point>} points points to be aggregated
 * @param {Array} aggregations an array of aggregation objects
 * @return {FeatureCollection<Polygon>} polygons with properties listed based on `outField` values in `aggregations`
 * @example
 * var polygons = {
 *   "type": "FeatureCollection",
 *   "features": [
 *     {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Polygon",
 *         "coordinates": [[
 *           [1.669921, 48.632908],
 *           [1.669921, 49.382372],
 *           [3.636474, 49.382372],
 *           [3.636474, 48.632908],
 *           [1.669921, 48.632908]
 *         ]]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Polygon",
 *         "coordinates": [[
 *           [2.230224, 47.85003],
 *           [2.230224, 48.611121],
 *           [4.361572, 48.611121],
 *           [4.361572, 47.85003],
 *           [2.230224, 47.85003]
 *         ]]
 *       }
 *     }
 *   ]
 * };
 * var points = {
 *   "type": "FeatureCollection",
 *   "features": [
 *     {
 *       "type": "Feature",
 *       "properties": {
 *         "population": 200
 *       },
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [2.054443,49.138596]
 *       }
 *     },
 *     {
 *       "type": "Feature",
 *       "properties": {
 *         "population": 600
 *       },
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [3.065185,48.850258]
 *       }
 *     },
 *     {
 *       "type": "Feature",
 *       "properties": {
 *         "population": 100
 *       },
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [2.329101,48.79239]
 *       }
 *     },
 *     {
 *       "type": "Feature",
 *       "properties": {
 *         "population": 200
 *       },
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [2.614746,48.334343]
 *       }
 *     },
 *     {
 *       "type": "Feature",
 *       "properties": {
 *         "population": 300
 *       },
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [3.416748,48.056053]
 *       }
 *     }
 *   ]
 * };
 * var aggregations = [
 *   {
 *     aggregation: 'sum',
 *     inField: 'population',
 *     outField: 'pop_sum'
 *   },
 *   {
 *     aggregation: 'average',
 *     inField: 'population',
 *     outField: 'pop_avg'
 *   },
 *   {
 *     aggregation: 'median',
 *     inField: 'population',
 *     outField: 'pop_median'
 *   },
 *   {
 *     aggregation: 'min',
 *     inField: 'population',
 *     outField: 'pop_min'
 *   },
 *   {
 *     aggregation: 'max',
 *     inField: 'population',
 *     outField: 'pop_max'
 *   },
 *   {
 *     aggregation: 'deviation',
 *     inField: 'population',
 *     outField: 'pop_deviation'
 *   },
 *   {
 *     aggregation: 'variance',
 *     inField: 'population',
 *     outField: 'pop_variance'
 *   },
 *   {
 *     aggregation: 'count',
 *     inField: '',
 *     outField: 'point_count'
 *   }
 * ];
 *
 * var aggregated = turf.aggregate(
 *   polygons, points, statsProperty);
 *
 * var result = turf.featurecollection(
 *   points.features.concat(aggregated.features));
 *
 * //=result
 */
module.exports = function collect(polyFC, ptFC, inProperty, outProperty) {
    polyFC.features.forEach(function (poly) {
        var values = ptFC.features.filter(function (pt) {
            return inside(pt, poly);
        }).map(function (pt) {
            return pt.properties[inProperty];
        });

        if (!poly.properties) {
            poly.properties = {};
        }

        poly.properties[outProperty] = values;
    });

    return polyFC;
};

},{"turf-inside":44}],32:[function(require,module,exports){
var meta = require('turf-meta');

/**
 * Combines a {@link FeatureCollection} of {@link Point},
 * {@link LineString}, or {@link Polygon} features
 * into {@link MultiPoint}, {@link MultiLineString}, or
 * {@link MultiPolygon} features.
 *
 * @name combine
 * @param {FeatureCollection<(Point|LineString|Polygon)>} fc a FeatureCollection of any type
 * @return {FeatureCollection<(MultiPoint|MultiLineString|MultiPolygon)>} a FeatureCollection of corresponding type to input
 * @example
 * var fc = {
 *   "type": "FeatureCollection",
 *   "features": [
 *     {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [19.026432, 47.49134]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [19.074497, 47.509548]
 *       }
 *     }
 *   ]
 * };
 *
 * var combined = turf.combine(fc);
 *
 * //=combined
 */

module.exports = function (fc) {
    var groups = {
        MultiPoint: {coordinates: [], properties: []},
        MultiLineString: {coordinates: [], properties: []},
        MultiPolygon: {coordinates: [], properties: []}
    };

    var multiMapping = Object.keys(groups).reduce(function (memo, item) {
        memo[item.replace('Multi', '')] = item;
        return memo;
    }, {});

    function addToGroup(feature, key, multi) {
        if (!multi) {
            groups[key].coordinates.push(feature.geometry.coordinates);
        } else {
            groups[key].coordinates = groups[key].coordinates.concat(feature.geometry.coordinates);
        }
        groups[key].properties.push(feature.properties);
    }

    meta.featureEach(fc, function (feature) {
        if (!feature.geometry) return;
        if (groups[feature.geometry.type]) {
            addToGroup(feature, feature.geometry.type, true);
        } else if (multiMapping[feature.geometry.type]) {
            addToGroup(feature, multiMapping[feature.geometry.type], false);
        }
    });

    return {
        type: 'FeatureCollection',
        features: Object.keys(groups)
            .filter(function (key) {
                return groups[key].coordinates.length;
            })
            .sort()
            .map(function (key) {
                return {
                    type: 'Feature',
                    properties: {
                        collectedProperties: groups[key].properties
                    },
                    geometry: {
                        type: key,
                        coordinates: groups[key].coordinates
                    }
                };
            })
    };
};

},{"turf-meta":52}],33:[function(require,module,exports){
// 1. run tin on points
// 2. calculate lenth of all edges and area of all triangles
// 3. remove triangles that fail the max length test
// 4. buffer the results slightly
// 5. merge the results
var tin = require('turf-tin');
var union = require('turf-union');
var distance = require('turf-distance');

/**
 * Takes a set of {@link Point|points} and returns a concave hull polygon.
 *
 * Internally, this uses [turf-tin](https://github.com/Turfjs/turf-tin) to generate geometries.
 *
 * @param {FeatureCollection<Point>} points input points
 * @param {number} maxEdge the size of an edge necessary for part of the
 * hull to become concave (in miles)
 * @param {string} units used for maxEdge distance (miles or kilometers)
 * @returns {Feature<Polygon>} a concave hull
 * @throws {Error} if maxEdge parameter is missing
 * @throws {Error} if units parameter is missing
 * @example
 * var points = {
 *   "type": "FeatureCollection",
 *   "features": [
 *     {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-63.601226, 44.642643]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-63.591442, 44.651436]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-63.580799, 44.648749]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-63.573589, 44.641788]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-63.587665, 44.64533]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-63.595218, 44.64765]
 *       }
 *     }
 *   ]
 * };
 *
 * var hull = turf.concave(points, 1, 'miles');
 *
 * var resultFeatures = points.features.concat(hull);
 * var result = {
 *   "type": "FeatureCollection",
 *   "features": resultFeatures
 * };
 *
 * //=result
 */
function concave(points, maxEdge, units) {
    if (typeof maxEdge !== 'number') throw new Error('maxEdge parameter is required');
    if (typeof units !== 'string') throw new Error('units parameter is required');

    var tinPolys = tin(points);
    var filteredPolys = tinPolys.features.filter(filterTriangles);
    tinPolys.features = filteredPolys;

    function filterTriangles(triangle) {
        var pt1 = triangle.geometry.coordinates[0][0];
        var pt2 = triangle.geometry.coordinates[0][1];
        var pt3 = triangle.geometry.coordinates[0][2];
        var dist1 = distance(pt1, pt2, units);
        var dist2 = distance(pt2, pt3, units);
        var dist3 = distance(pt1, pt3, units);
        return (dist1 <= maxEdge && dist2 <= maxEdge && dist3 <= maxEdge);
    }

    return merge(tinPolys);
}

function merge(polygons) {
    var merged = JSON.parse(JSON.stringify(polygons.features[0])),
        features = polygons.features;

    for (var i = 0, len = features.length; i < len; i++) {
        var poly = features[i];
        if (poly.geometry) {
            merged = union(merged, poly);
        }
    }
    return merged;
}

module.exports = concave;

},{"turf-distance":37,"turf-tin":67,"turf-union":69}],34:[function(require,module,exports){
var each = require('turf-meta').coordEach,
    convexHull = require('convex-hull'),
    polygon = require('turf-helpers').polygon;

/**
 * Takes a set of {@link Point|points} and returns a
 * [convex hull](http://en.wikipedia.org/wiki/Convex_hull) polygon.
 *
 * Internally this uses
 * the [convex-hull](https://github.com/mikolalysenko/convex-hull) module that
 * implements a [monotone chain hull](http://en.wikibooks.org/wiki/Algorithm_Implementation/Geometry/Convex_hull/Monotone_chain).
 *
 * @name convex
 * @param {FeatureCollection<Point>} input input points
 * @returns {Feature<Polygon>} a convex hull
 * @example
 * var points = {
 *   "type": "FeatureCollection",
 *   "features": [
 *     {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [10.195312, 43.755225]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [10.404052, 43.8424511]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [10.579833, 43.659924]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [10.360107, 43.516688]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [10.14038, 43.588348]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [10.195312, 43.755225]
 *       }
 *     }
 *   ]
 * };
 *
 * var hull = turf.convex(points);
 *
 * var resultFeatures = points.features.concat(hull);
 * var result = {
 *   "type": "FeatureCollection",
 *   "features": resultFeatures
 * };
 *
 * //=result
 */
module.exports = function (fc) {
    var points = [];
    each(fc, function (coord) { points.push(coord); });
    var hull = convexHull(points);
    if (hull.length > 0) {
        var ring = [];
        for (var i = 0; i < hull.length; i++) {
            ring.push(points[hull[i][0]]);
        }
        ring.push(points[hull[hull.length - 1][1]]);
        return polygon([ring]);
    }
    return undefined;
};

},{"convex-hull":4,"turf-helpers":42,"turf-meta":52}],35:[function(require,module,exports){
//http://en.wikipedia.org/wiki/Haversine_formula
//http://www.movable-type.co.uk/scripts/latlong.html
var getCoord = require('turf-invariant').getCoord;
var helpers = require('turf-helpers');
var point = helpers.point;
var distanceToRadians = helpers.distanceToRadians;

/**
 * Takes a {@link Point} and calculates the location of a destination point given a distance in degrees, radians, miles, or kilometers; and bearing in degrees. This uses the [Haversine formula](http://en.wikipedia.org/wiki/Haversine_formula) to account for global curvature.
 *
 * @name destination
 * @param {Feature<Point>} start starting point
 * @param {number} distance distance from the starting point
 * @param {number} bearing ranging from -180 to 180
 * @param {String} [units=kilometers] miles, kilometers, degrees, or radians
 * @returns {Feature<Point>} destination point
 * @example
 * var point = {
 *   "type": "Feature",
 *   "properties": {
 *     "marker-color": "#0f0"
 *   },
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [-75.343, 39.984]
 *   }
 * };
 * var distance = 50;
 * var bearing = 90;
 * var units = 'miles';
 *
 * var destination = turf.destination(point, distance, bearing, units);
 * destination.properties['marker-color'] = '#f00';
 *
 * var result = {
 *   "type": "FeatureCollection",
 *   "features": [point, destination]
 * };
 *
 * //=result
 */
module.exports = function (point1, distance, bearing, units) {
    var degrees2radians = Math.PI / 180;
    var radians2degrees = 180 / Math.PI;
    var coordinates1 = getCoord(point1);
    var longitude1 = degrees2radians * coordinates1[0];
    var latitude1 = degrees2radians * coordinates1[1];
    var bearing_rad = degrees2radians * bearing;

    var radians = distanceToRadians(distance, units);

    var latitude2 = Math.asin(Math.sin(latitude1) * Math.cos(radians) +
        Math.cos(latitude1) * Math.sin(radians) * Math.cos(bearing_rad));
    var longitude2 = longitude1 + Math.atan2(Math.sin(bearing_rad) *
        Math.sin(radians) * Math.cos(latitude1),
        Math.cos(radians) - Math.sin(latitude1) * Math.sin(latitude2));

    return point([radians2degrees * longitude2, radians2degrees * latitude2]);
};

},{"turf-helpers":42,"turf-invariant":46}],36:[function(require,module,exports){
// depend on jsts for now https://github.com/bjornharrtell/jsts/blob/master/examples/overlay.html
var jsts = require('jsts');

/**
 * Finds the difference between two {@link Polygon|polygons} by clipping the second
 * polygon from the first.
 *
 * @name difference
 * @param {Feature<Polygon>} poly1 input Polygon feaure
 * @param {Feature<Polygon>} poly2 Polygon feature to difference from `poly1`
 * @return {Feature<Polygon>} a Polygon feature showing the area of `poly1` excluding the area of `poly2`
 * @example
 * var poly1 = {
 *   "type": "Feature",
 *   "properties": {
 *     "fill": "#0f0"
 *   },
 *   "geometry": {
 *     "type": "Polygon",
 *     "coordinates": [[
 *       [-46.738586, -23.596711],
 *       [-46.738586, -23.458207],
 *       [-46.560058, -23.458207],
 *       [-46.560058, -23.596711],
 *       [-46.738586, -23.596711]
 *     ]]
 *   }
 * };
 * var poly2 = {
 *   "type": "Feature",
 *   "properties": {
 *     "fill": "#00f"
 *   },
 *   "geometry": {
 *     "type": "Polygon",
 *     "coordinates": [[
 *       [-46.650009, -23.631314],
 *       [-46.650009, -23.5237],
 *       [-46.509246, -23.5237],
 *       [-46.509246, -23.631314],
 *       [-46.650009, -23.631314]
 *     ]]
 *   }
 * };
 *
 * var differenced = turf.difference(poly1, poly2);
 * differenced.properties.fill = '#f00';
 *
 * var polygons = {
 *   "type": "FeatureCollection",
 *   "features": [poly1, poly2]
 * };
 *
 * //=polygons
 *
 * //=differenced
 */

module.exports = function (p1, p2) {
    var poly1 = JSON.parse(JSON.stringify(p1));
    var poly2 = JSON.parse(JSON.stringify(p2));
    if (poly1.type !== 'Feature') {
        poly1 = {
            type: 'Feature',
            properties: {},
            geometry: poly1
        };
    }
    if (poly2.type !== 'Feature') {
        poly2 = {
            type: 'Feature',
            properties: {},
            geometry: poly2
        };
    }

    var reader = new jsts.io.GeoJSONReader();
    var a = reader.read(JSON.stringify(poly1.geometry));
    var b = reader.read(JSON.stringify(poly2.geometry));
    var differenced = a.difference(b);

    if (differenced.isEmpty()) return undefined;

    var writer = new jsts.io.GeoJSONWriter();
    var geojsonGeometry = writer.write(differenced);

    poly1.geometry = differenced;

    return {
        type: 'Feature',
        properties: poly1.properties,
        geometry: geojsonGeometry
    };
};

},{"jsts":13}],37:[function(require,module,exports){
var getCoord = require('turf-invariant').getCoord;
var radiansToDistance = require('turf-helpers').radiansToDistance;
//http://en.wikipedia.org/wiki/Haversine_formula
//http://www.movable-type.co.uk/scripts/latlong.html

/**
 * Calculates the distance between two {@link Point|points} in degrees, radians,
 * miles, or kilometers. This uses the
 * [Haversine formula](http://en.wikipedia.org/wiki/Haversine_formula)
 * to account for global curvature.
 *
 * @name distance
 * @param {Feature<Point>} from origin point
 * @param {Feature<Point>} to destination point
 * @param {String} [units=kilometers] can be degrees, radians, miles, or kilometers
 * @return {Number} distance between the two points
 * @example
 * var point1 = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [-75.343, 39.984]
 *   }
 * };
 * var point2 = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [-75.534, 39.123]
 *   }
 * };
 * var units = "miles";
 *
 * var points = {
 *   "type": "FeatureCollection",
 *   "features": [point1, point2]
 * };
 *
 * //=points
 *
 * var distance = turf.distance(point1, point2, units);
 *
 * //=distance
 */
module.exports = function (point1, point2, units) {
    var degrees2radians = Math.PI / 180;
    var coordinates1 = getCoord(point1);
    var coordinates2 = getCoord(point2);
    var dLat = degrees2radians * (coordinates2[1] - coordinates1[1]);
    var dLon = degrees2radians * (coordinates2[0] - coordinates1[0]);
    var lat1 = degrees2radians * coordinates1[1];
    var lat2 = degrees2radians * coordinates2[1];

    var a = Math.pow(Math.sin(dLat / 2), 2) +
          Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2);

    return radiansToDistance(2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)), units);
};

},{"turf-helpers":42,"turf-invariant":46}],38:[function(require,module,exports){
var bbox = require('turf-bbox');
var bboxPolygon = require('turf-bbox-polygon');

/**
 * Takes any number of features and returns a rectangular {@link Polygon} that encompasses all vertices.
 *
 * @name envelope
 * @param {FeatureCollection} fc input features
 * @return {Feature<Polygon>} a rectangular Polygon feature that encompasses all vertices
 * @example
 * var fc = {
 *   "type": "FeatureCollection",
 *   "features": [
 *     {
 *       "type": "Feature",
 *       "properties": {
 *         "name": "Location A"
 *       },
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-75.343, 39.984]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {
 *         "name": "Location B"
 *       },
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-75.833, 39.284]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {
 *         "name": "Location C"
 *       },
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-75.534, 39.123]
 *       }
 *     }
 *   ]
 * };
 *
 * var enveloped = turf.envelope(fc);
 *
 * var resultFeatures = fc.features.concat(enveloped);
 * var result = {
 *   "type": "FeatureCollection",
 *   "features": resultFeatures
 * };
 *
 * //=result
 */

module.exports = function (features) {
    return bboxPolygon(bbox(features));
};

},{"turf-bbox":24,"turf-bbox-polygon":23}],39:[function(require,module,exports){
var featureCollection = require('turf-helpers').featureCollection;
var each = require('turf-meta').coordEach;
var point = require('turf-helpers').point;

/**
 * Takes a feature or set of features and returns all positions as
 * {@link Point|points}.
 *
 * @name explode
 * @param {(Feature|FeatureCollection)} input input features
 * @return {FeatureCollection<point>} points representing the exploded input features
 * @throws {Error} if it encounters an unknown geometry type
 * @example
 * var poly = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Polygon",
 *     "coordinates": [[
 *       [177.434692, -17.77517],
 *       [177.402076, -17.779093],
 *       [177.38079, -17.803937],
 *       [177.40242, -17.826164],
 *       [177.438468, -17.824857],
 *       [177.454948, -17.796746],
 *       [177.434692, -17.77517]
 *     ]]
 *   }
 * };
 *
 * var points = turf.explode(poly);
 *
 * //=poly
 *
 * //=points
 */
module.exports = function (layer) {
    var points = [];
    each(layer, function (coord) {
        points.push(point(coord));
    });
    return featureCollection(points);
};

},{"turf-helpers":42,"turf-meta":52}],40:[function(require,module,exports){
var coordEach = require('turf-meta').coordEach;

/**
 * Takes input features and flips all of their coordinates
 * from `[x, y]` to `[y, x]`.
 *
 * @name flip
 * @param {(Feature|FeatureCollection)} input input features
 * @returns {(Feature|FeatureCollection)} a feature or set of features of the same type as `input` with flipped coordinates
 * @example
 * var serbia = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [20.566406, 43.421008]
 *   }
 * };
 *
 * //=serbia
 *
 * var saudiArabia = turf.flip(serbia);
 *
 * //=saudiArabia
 */
module.exports = function flip(input) {
    // ensure that we don't modify features in-place and changes to the
    // output do not change the previous feature, including changes to nested
    // properties.
    input = JSON.parse(JSON.stringify(input));

    coordEach(input, function (coord) {
        coord.reverse();
    });
    return input;
};

},{"turf-meta":52}],41:[function(require,module,exports){
var point = require('turf-point');

/**
 * Takes a bounding box and a cell depth and returns a {@link FeatureCollection} of {@link Point} features in a grid.
 *
 * @module turf/grid
 * @category interpolation
 * @param {Array<number>} extent extent in [minX, minY, maxX, maxY] order
 * @param {Number} depth how many cells to output
 * @return {FeatureCollection} grid as FeatureCollection with {@link Point} features
 * @example
 * var extent = [-70.823364, -33.553984, -70.473175, -33.302986];
 * var depth = 10;
 *
 * var grid = turf.grid(extent, depth);
 *
 * //=grid
 */
module.exports = function(extents, depth) {
  var xmin = extents[0];
  var ymin = extents[1];
  var xmax = extents[2];
  var ymax = extents[3];
  var interval = (xmax - xmin) / depth;
  var coords = [];
  var fc = {
    type: 'FeatureCollection',
    features: []
  };

  for (var x=0; x<=depth; x++){
    for (var y=0;y<=depth; y++){
      fc.features.push(point([(x * interval) + xmin, (y * interval) + ymin]));
    }
  }
  return fc;
}

},{"turf-point":59}],42:[function(require,module,exports){
/**
 * Wraps a GeoJSON {@link Geometry} in a GeoJSON {@link Feature}.
 *
 * @name feature
 * @param {Geometry} geometry input geometry
 * @returns {FeatureCollection} a FeatureCollection of input features
 * @example
 * var geometry = {
 *      "type": "Point",
 *      "coordinates": [
 *        67.5,
 *        32.84267363195431
 *      ]
 *    }
 *
 * var feature = turf.feature(geometry);
 *
 * //=feature
 */
function feature(geometry, properties) {
    return {
        type: 'Feature',
        properties: properties || {},
        geometry: geometry
    };
}

module.exports.feature = feature;

/**
 * Takes coordinates and properties (optional) and returns a new {@link Point} feature.
 *
 * @name point
 * @param {number[]} coordinates longitude, latitude position (each in decimal degrees)
 * @param {Object=} properties an Object that is used as the {@link Feature}'s
 * properties
 * @returns {Feature<Point>} a Point feature
 * @example
 * var pt1 = turf.point([-75.343, 39.984]);
 *
 * //=pt1
 */
module.exports.point = function (coordinates, properties) {
    if (!Array.isArray(coordinates)) throw new Error('Coordinates must be an array');
    if (coordinates.length < 2) throw new Error('Coordinates must be at least 2 numbers long');
    return feature({
        type: 'Point',
        coordinates: coordinates.slice()
    }, properties);
};

/**
 * Takes an array of LinearRings and optionally an {@link Object} with properties and returns a {@link Polygon} feature.
 *
 * @name polygon
 * @param {Array<Array<Array<number>>>} rings an array of LinearRings
 * @param {Object=} properties a properties object
 * @returns {Feature<Polygon>} a Polygon feature
 * @throws {Error} throw an error if a LinearRing of the polygon has too few positions
 * or if a LinearRing of the Polygon does not have matching Positions at the
 * beginning & end.
 * @example
 * var polygon = turf.polygon([[
 *  [-2.275543, 53.464547],
 *  [-2.275543, 53.489271],
 *  [-2.215118, 53.489271],
 *  [-2.215118, 53.464547],
 *  [-2.275543, 53.464547]
 * ]], { name: 'poly1', population: 400});
 *
 * //=polygon
 */
module.exports.polygon = function (coordinates, properties) {

    if (!coordinates) throw new Error('No coordinates passed');

    for (var i = 0; i < coordinates.length; i++) {
        var ring = coordinates[i];
        if (ring.length < 4) {
            throw new Error('Each LinearRing of a Polygon must have 4 or more Positions.');
        }
        for (var j = 0; j < ring[ring.length - 1].length; j++) {
            if (ring[ring.length - 1][j] !== ring[0][j]) {
                throw new Error('First and last Position are not equivalent.');
            }
        }
    }

    return feature({
        type: 'Polygon',
        coordinates: coordinates
    }, properties);
};

/**
 * Creates a {@link LineString} based on a
 * coordinate array. Properties can be added optionally.
 *
 * @name lineString
 * @param {Array<Array<number>>} coordinates an array of Positions
 * @param {Object=} properties an Object of key-value pairs to add as properties
 * @returns {Feature<LineString>} a LineString feature
 * @throws {Error} if no coordinates are passed
 * @example
 * var linestring1 = turf.lineString([
 *	[-21.964416, 64.148203],
 *	[-21.956176, 64.141316],
 *	[-21.93901, 64.135924],
 *	[-21.927337, 64.136673]
 * ]);
 * var linestring2 = turf.lineString([
 *	[-21.929054, 64.127985],
 *	[-21.912918, 64.134726],
 *	[-21.916007, 64.141016],
 * 	[-21.930084, 64.14446]
 * ], {name: 'line 1', distance: 145});
 *
 * //=linestring1
 *
 * //=linestring2
 */
module.exports.lineString = function (coordinates, properties) {
    if (!coordinates) {
        throw new Error('No coordinates passed');
    }
    return feature({
        type: 'LineString',
        coordinates: coordinates
    }, properties);
};

/**
 * Takes one or more {@link Feature|Features} and creates a {@link FeatureCollection}.
 *
 * @name featureCollection
 * @param {Feature[]} features input features
 * @returns {FeatureCollection} a FeatureCollection of input features
 * @example
 * var features = [
 *  turf.point([-75.343, 39.984], {name: 'Location A'}),
 *  turf.point([-75.833, 39.284], {name: 'Location B'}),
 *  turf.point([-75.534, 39.123], {name: 'Location C'})
 * ];
 *
 * var fc = turf.featureCollection(features);
 *
 * //=fc
 */
module.exports.featureCollection = function (features) {
    return {
        type: 'FeatureCollection',
        features: features
    };
};

/**
 * Creates a {@link Feature<MultiLineString>} based on a
 * coordinate array. Properties can be added optionally.
 *
 * @name multiLineString
 * @param {Array<Array<Array<number>>>} coordinates an array of LineStrings
 * @param {Object=} properties an Object of key-value pairs to add as properties
 * @returns {Feature<MultiLineString>} a MultiLineString feature
 * @throws {Error} if no coordinates are passed
 * @example
 * var multiLine = turf.multiLineString([[[0,0],[10,10]]]);
 *
 * //=multiLine
 *
 */
module.exports.multiLineString = function (coordinates, properties) {
    if (!coordinates) {
        throw new Error('No coordinates passed');
    }
    return feature({
        type: 'MultiLineString',
        coordinates: coordinates
    }, properties);
};

/**
 * Creates a {@link Feature<MultiPoint>} based on a
 * coordinate array. Properties can be added optionally.
 *
 * @name multiPoint
 * @param {Array<Array<number>>} coordinates an array of Positions
 * @param {Object=} properties an Object of key-value pairs to add as properties
 * @returns {Feature<MultiPoint>} a MultiPoint feature
 * @throws {Error} if no coordinates are passed
 * @example
 * var multiPt = turf.multiPoint([[0,0],[10,10]]);
 *
 * //=multiPt
 *
 */
module.exports.multiPoint = function (coordinates, properties) {
    if (!coordinates) {
        throw new Error('No coordinates passed');
    }
    return feature({
        type: 'MultiPoint',
        coordinates: coordinates
    }, properties);
};


/**
 * Creates a {@link Feature<MultiPolygon>} based on a
 * coordinate array. Properties can be added optionally.
 *
 * @name multiPolygon
 * @param {Array<Array<Array<Array<number>>>>} coordinates an array of Polygons
 * @param {Object=} properties an Object of key-value pairs to add as properties
 * @returns {Feature<MultiPolygon>} a multipolygon feature
 * @throws {Error} if no coordinates are passed
 * @example
 * var multiPoly = turf.multiPolygon([[[[0,0],[0,10],[10,10],[10,0],[0,0]]]);
 *
 * //=multiPoly
 *
 */
module.exports.multiPolygon = function (coordinates, properties) {
    if (!coordinates) {
        throw new Error('No coordinates passed');
    }
    return feature({
        type: 'MultiPolygon',
        coordinates: coordinates
    }, properties);
};

/**
 * Creates a {@link Feature<GeometryCollection>} based on a
 * coordinate array. Properties can be added optionally.
 *
 * @name geometryCollection
 * @param {Array<{Geometry}>} geometries an array of GeoJSON Geometries
 * @param {Object=} properties an Object of key-value pairs to add as properties
 * @returns {Feature<GeometryCollection>} a geometrycollection feature
 * @example
 * var pt = {
 *     "type": "Point",
 *       "coordinates": [100, 0]
 *     };
 * var line = {
 *     "type": "LineString",
 *     "coordinates": [ [101, 0], [102, 1] ]
 *   };
 * var collection = turf.geometrycollection([[0,0],[10,10]]);
 *
 * //=collection
 */
module.exports.geometryCollection = function (geometries, properties) {
    return feature({
        type: 'GeometryCollection',
        geometries: geometries
    }, properties);
};

var factors = {
    miles: 3960,
    nauticalmiles: 3441.145,
    degrees: 57.2957795,
    radians: 1,
    inches: 250905600,
    yards: 6969600,
    meters: 6373000,
    metres: 6373000,
    kilometers: 6373,
    kilometres: 6373
};

/*
 * Convert a distance measurement from radians to a more friendly unit.
 *
 * @name radiansToDistance
 * @param {number} distance in radians across the sphere
 * @param {string=kilometers} units: one of miles, nauticalmiles, degrees, radians,
 * inches, yards, metres, meters, kilometres, kilometers.
 * @returns {number} distance
 */
module.exports.radiansToDistance = function (radians, units) {
    var factor = factors[units || 'kilometers'];
    if (factor === undefined) {
        throw new Error('Invalid unit');
    }
    return radians * factor;
};

/*
 * Convert a distance measurement from a real-world unit into radians
 *
 * @name distanceToRadians
 * @param {number} distance in real units
 * @param {string=kilometers} units: one of miles, nauticalmiles, degrees, radians,
 * inches, yards, metres, meters, kilometres, kilometers.
 * @returns {number} radians
 */
module.exports.distanceToRadians = function (distance, units) {
    var factor = factors[units || 'kilometers'];
    if (factor === undefined) {
        throw new Error('Invalid unit');
    }
    return distance / factor;
};

/*
 * Convert a distance measurement from a real-world unit into degrees
 *
 * @name distanceToRadians
 * @param {number} distance in real units
 * @param {string=kilometers} units: one of miles, nauticalmiles, degrees, radians,
 * inches, yards, metres, meters, kilometres, kilometers.
 * @returns {number} degrees
 */
module.exports.distanceToDegrees = function (distance, units) {
    var factor = factors[units || 'kilometers'];
    if (factor === undefined) {
        throw new Error('Invalid unit');
    }
    return (distance / factor) * 57.2958;
};

},{}],43:[function(require,module,exports){
var point = require('turf-helpers').point;
var polygon = require('turf-helpers').polygon;
var distance = require('turf-distance');
var featurecollection = require('turf-helpers').featureCollection;

//Precompute cosines and sines of angles used in hexagon creation
// for performance gain
var cosines = [];
var sines = [];
for (var i = 0; i < 6; i++) {
    var angle = 2 * Math.PI / 6 * i;
    cosines.push(Math.cos(angle));
    sines.push(Math.sin(angle));
}

/**
 * Takes a bounding box and a cell size in degrees and returns a {@link FeatureCollection} of flat-topped
 * hexagons ({@link Polygon} features) aligned in an "odd-q" vertical grid as
 * described in [Hexagonal Grids](http://www.redblobgames.com/grids/hexagons/).
 *
 * @name hexGrid
 * @param {Array<number>} bbox bounding box in [minX, minY, maxX, maxY] order
 * @param {number} cellWidth width of cell in specified units
 * @param {string} units used in calculating cellWidth ('miles' or 'kilometers')
 * @return {FeatureCollection<Polygon>} a hexagonal grid
 * @example
 * var bbox = [-96,31,-84,40];
 * var cellWidth = 50;
 * var units = 'miles';
 *
 * var hexgrid = turf.hexGrid(bbox, cellWidth, units);
 *
 * //=hexgrid
 */
module.exports = function hexGrid(bbox, cell, units, triangles) {
    var xFraction = cell / (distance(point([bbox[0], bbox[1]]), point([bbox[2], bbox[1]]), units));
    var cellWidth = xFraction * (bbox[2] - bbox[0]);
    var yFraction = cell / (distance(point([bbox[0], bbox[1]]), point([bbox[0], bbox[3]]), units));
    var cellHeight = yFraction * (bbox[3] - bbox[1]);
    var radius = cellWidth / 2;

    var hex_width = radius * 2;
    var hex_height = Math.sqrt(3) / 2 * cellHeight;

    var box_width = bbox[2] - bbox[0];
    var box_height = bbox[3] - bbox[1];

    var x_interval = 3 / 4 * hex_width;
    var y_interval = hex_height;

    var x_span = box_width / (hex_width - radius / 2);
    var x_count = Math.ceil(x_span);
    if (Math.round(x_span) === x_count) {
        x_count++;
    }

    var x_adjust = ((x_count * x_interval - radius / 2) - box_width) / 2 - radius / 2;

    var y_count = Math.ceil(box_height / hex_height);

    var y_adjust = (box_height - y_count * hex_height) / 2;

    var hasOffsetY = y_count * hex_height - box_height > hex_height / 2;
    if (hasOffsetY) {
        y_adjust -= hex_height / 4;
    }

    var fc = featurecollection([]);
    for (var x = 0; x < x_count; x++) {
        for (var y = 0; y <= y_count; y++) {

            var isOdd = x % 2 === 1;
            if (y === 0 && isOdd) {
                continue;
            }

            if (y === 0 && hasOffsetY) {
                continue;
            }

            var center_x = x * x_interval + bbox[0] - x_adjust;
            var center_y = y * y_interval + bbox[1] + y_adjust;

            if (isOdd) {
                center_y -= hex_height / 2;
            }
            if (triangles) {
                fc.features.push.apply(fc.features, hexTriangles([center_x, center_y], cellWidth / 2, cellHeight / 2));
            } else {
                fc.features.push(hexagon([center_x, center_y], cellWidth / 2, cellHeight / 2));
            }
        }
    }

    return fc;
};

//Center should be [x, y]
function hexagon(center, rx, ry) {
    var vertices = [];
    for (var i = 0; i < 6; i++) {
        var x = center[0] + rx * cosines[i];
        var y = center[1] + ry * sines[i];
        vertices.push([x, y]);
    }
    //first and last vertex must be the same
    vertices.push(vertices[0]);
    return polygon([vertices]);
}

//Center should be [x, y]
function hexTriangles(center, rx, ry) {
    var triangles = [];
    for (var i = 0; i < 6; i++) {
        var vertices = [];
        vertices.push(center);
        vertices.push([
            center[0] + rx * cosines[i],
            center[1] + ry * sines[i]
        ]);
        vertices.push([
            center[0] + rx * cosines[(i + 1) % 6],
            center[1] + ry * sines[(i + 1) % 6]
        ]);
        vertices.push(center);
        triangles.push(polygon([vertices]));
    }
    return triangles;
}

},{"turf-distance":37,"turf-helpers":42}],44:[function(require,module,exports){
var invariant = require('turf-invariant');

// http://en.wikipedia.org/wiki/Even%E2%80%93odd_rule
// modified from: https://github.com/substack/point-in-polygon/blob/master/index.js
// which was modified from http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

/**
 * Takes a {@link Point} and a {@link Polygon} or {@link MultiPolygon} and determines if the point resides inside the polygon. The polygon can
 * be convex or concave. The function accounts for holes.
 *
 * @name inside
 * @param {Feature<Point>} point input point
 * @param {Feature<(Polygon|MultiPolygon)>} polygon input polygon or multipolygon
 * @return {Boolean} `true` if the Point is inside the Polygon; `false` if the Point is not inside the Polygon
 * @example
 * var pt1 = {
 *   "type": "Feature",
 *   "properties": {
 *     "marker-color": "#f00"
 *   },
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [-111.467285, 40.75766]
 *   }
 * };
 * var pt2 = {
 *   "type": "Feature",
 *   "properties": {
 *     "marker-color": "#0f0"
 *   },
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [-111.873779, 40.647303]
 *   }
 * };
 * var poly = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Polygon",
 *     "coordinates": [[
 *       [-112.074279, 40.52215],
 *       [-112.074279, 40.853293],
 *       [-111.610107, 40.853293],
 *       [-111.610107, 40.52215],
 *       [-112.074279, 40.52215]
 *     ]]
 *   }
 * };
 *
 * var features = {
 *   "type": "FeatureCollection",
 *   "features": [pt1, pt2, poly]
 * };
 *
 * //=features
 *
 * var isInside1 = turf.inside(pt1, poly);
 * //=isInside1
 *
 * var isInside2 = turf.inside(pt2, poly);
 * //=isInside2
 */
module.exports = function input(point, polygon) {
    var pt = invariant.getCoord(point);
    var polys = polygon.geometry.coordinates;
    // normalize to multipolygon
    if (polygon.geometry.type === 'Polygon') polys = [polys];

    for (var i = 0, insidePoly = false; i < polys.length && !insidePoly; i++) {
        // check if it is in the outer ring first
        if (inRing(pt, polys[i][0])) {
            var inHole = false;
            var k = 1;
            // check for the point in any of the holes
            while (k < polys[i].length && !inHole) {
                if (inRing(pt, polys[i][k])) {
                    inHole = true;
                }
                k++;
            }
            if (!inHole) insidePoly = true;
        }
    }
    return insidePoly;
};

// pt is [x,y] and ring is [[x,y], [x,y],..]
function inRing(pt, ring) {
    var isInside = false;
    for (var i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        var xi = ring[i][0], yi = ring[i][1];
        var xj = ring[j][0], yj = ring[j][1];
        var intersect = ((yi > pt[1]) !== (yj > pt[1])) &&
        (pt[0] < (xj - xi) * (pt[1] - yi) / (yj - yi) + xi);
        if (intersect) isInside = !isInside;
    }
    return isInside;
}

},{"turf-invariant":46}],45:[function(require,module,exports){
// depend on jsts for now https://github.com/bjornharrtell/jsts/blob/master/examples/overlay.html
var jsts = require('jsts');

/**
 * Takes two {@link Polygon|polygons} and finds their intersection. If they share a border, returns the border; if they don't intersect, returns undefined.
 *
 * @name intersect
 * @param {Feature<Polygon>} poly1 the first polygon
 * @param {Feature<Polygon>} poly2 the second polygon
 * @return {(Feature<Polygon>|undefined|Feature<MultiLineString>)} if `poly1` and `poly2` overlap, returns a Polygon feature representing the area they overlap; if `poly1` and `poly2` do not overlap, returns `undefined`; if `poly1` and `poly2` share a border, a MultiLineString of the locations where their borders are shared
 * @example
 * var poly1 = {
 *   "type": "Feature",
 *   "properties": {
 *     "fill": "#0f0"
 *   },
 *   "geometry": {
 *     "type": "Polygon",
 *     "coordinates": [[
 *       [-122.801742, 45.48565],
 *       [-122.801742, 45.60491],
 *       [-122.584762, 45.60491],
 *       [-122.584762, 45.48565],
 *       [-122.801742, 45.48565]
 *     ]]
 *   }
 * }
 * var poly2 = {
 *   "type": "Feature",
 *   "properties": {
 *     "fill": "#00f"
 *   },
 *   "geometry": {
 *     "type": "Polygon",
 *     "coordinates": [[
 *       [-122.520217, 45.535693],
 *       [-122.64038, 45.553967],
 *       [-122.720031, 45.526554],
 *       [-122.669906, 45.507309],
 *       [-122.723464, 45.446643],
 *       [-122.532577, 45.408574],
 *       [-122.487258, 45.477466],
 *       [-122.520217, 45.535693]
 *     ]]
 *   }
 * }
 *
 * var polygons = {
 *   "type": "FeatureCollection",
 *   "features": [poly1, poly2]
 * };
 *
 * var intersection = turf.intersect(poly1, poly2);
 *
 * //=polygons
 *
 * //=intersection
 */
module.exports = function intersect(poly1, poly2) {
    var geom1, geom2;
    if (poly1.type === 'Feature') geom1 = poly1.geometry;
    else geom1 = poly1;
    if (poly2.type === 'Feature') geom2 = poly2.geometry;
    else geom2 = poly2;
    var reader = new jsts.io.GeoJSONReader();
    var a = reader.read(JSON.stringify(geom1));
    var b = reader.read(JSON.stringify(geom2));
    var intersection = a.intersection(b);

    if (intersection.isEmpty()) {
        return undefined;
    }

    var writer = new jsts.io.GeoJSONWriter();

    var geojsonGeometry = writer.write(intersection);
    return {
        type: 'Feature',
        properties: {},
        geometry: geojsonGeometry
    };
};

},{"jsts":13}],46:[function(require,module,exports){
/**
 * Unwrap a coordinate from a Feature with a Point geometry, a Point
 * geometry, or a single coordinate.
 *
 * @param {*} value any value
 * @returns {Array<number>} a coordinate
 */
function getCoord(obj) {
    if (Array.isArray(obj) &&
        typeof obj[0] === 'number' &&
        typeof obj[1] === 'number') {
        return obj;
    } else if (obj) {
        if (obj.type === 'Feature' &&
            obj.geometry &&
            obj.geometry.type === 'Point' &&
            Array.isArray(obj.geometry.coordinates)) {
            return obj.geometry.coordinates;
        } else if (obj.type === 'Point' &&
            Array.isArray(obj.coordinates)) {
            return obj.coordinates;
        }
    }
    throw new Error('A coordinate, feature, or point geometry is required');
}

/**
 * Enforce expectations about types of GeoJSON objects for Turf.
 *
 * @alias geojsonType
 * @param {GeoJSON} value any GeoJSON object
 * @param {string} type expected GeoJSON type
 * @param {string} name name of calling function
 * @throws {Error} if value is not the expected type.
 */
function geojsonType(value, type, name) {
    if (!type || !name) throw new Error('type and name required');

    if (!value || value.type !== type) {
        throw new Error('Invalid input to ' + name + ': must be a ' + type + ', given ' + value.type);
    }
}

/**
 * Enforce expectations about types of {@link Feature} inputs for Turf.
 * Internally this uses {@link geojsonType} to judge geometry types.
 *
 * @alias featureOf
 * @param {Feature} feature a feature with an expected geometry type
 * @param {string} type expected GeoJSON type
 * @param {string} name name of calling function
 * @throws {Error} error if value is not the expected type.
 */
function featureOf(value, type, name) {
    if (!name) throw new Error('.featureOf() requires a name');
    if (!value || value.type !== 'Feature' || !value.geometry) {
        throw new Error('Invalid input to ' + name + ', Feature with geometry required');
    }
    if (!value.geometry || value.geometry.type !== type) {
        throw new Error('Invalid input to ' + name + ': must be a ' + type + ', given ' + value.geometry.type);
    }
}

/**
 * Enforce expectations about types of {@link FeatureCollection} inputs for Turf.
 * Internally this uses {@link geojsonType} to judge geometry types.
 *
 * @alias collectionOf
 * @param {FeatureCollection} featurecollection a featurecollection for which features will be judged
 * @param {string} type expected GeoJSON type
 * @param {string} name name of calling function
 * @throws {Error} if value is not the expected type.
 */
function collectionOf(value, type, name) {
    if (!name) throw new Error('.collectionOf() requires a name');
    if (!value || value.type !== 'FeatureCollection') {
        throw new Error('Invalid input to ' + name + ', FeatureCollection required');
    }
    for (var i = 0; i < value.features.length; i++) {
        var feature = value.features[i];
        if (!feature || feature.type !== 'Feature' || !feature.geometry) {
            throw new Error('Invalid input to ' + name + ', Feature with geometry required');
        }
        if (!feature.geometry || feature.geometry.type !== type) {
            throw new Error('Invalid input to ' + name + ': must be a ' + type + ', given ' + feature.geometry.type);
        }
    }
}

module.exports.geojsonType = geojsonType;
module.exports.collectionOf = collectionOf;
module.exports.featureOf = featureOf;
module.exports.getCoord = getCoord;

},{}],47:[function(require,module,exports){
/* eslint-disable */

/*
 * Copyright (c) 2010, Jason Davies.
 *
 * All rights reserved.  This code is based on Bradley White's Java version,
 * which is in turn based on Nicholas Yue's C++ version, which in turn is based
 * on Paul D. Bourke's original Fortran version.  See below for the respective
 * copyright notices.
 *
 * See http://local.wasp.uwa.edu.au/~pbourke/papers/conrec/ for the original
 * paper by Paul D. Bourke.
 *
 * The vector conversion code is based on http://apptree.net/conrec.htm by
 * Graham Cox.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the <organization> nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/*
 * Copyright (c) 1996-1997 Nicholas Yue
 *
 * This software is copyrighted by Nicholas Yue. This code is based on Paul D.
 * Bourke's CONREC.F routine.
 *
 * The authors hereby grant permission to use, copy, and distribute this
 * software and its documentation for any purpose, provided that existing
 * copyright notices are retained in all copies and that this notice is
 * included verbatim in any distributions. Additionally, the authors grant
 * permission to modify this software and its documentation for any purpose,
 * provided that such modifications are not distributed without the explicit
 * consent of the authors and that existing copyright notices are retained in
 * all copies. Some of the algorithms implemented by this software are
 * patented, observe all applicable patent law.
 *
 * IN NO EVENT SHALL THE AUTHORS OR DISTRIBUTORS BE LIABLE TO ANY PARTY FOR
 * DIRECT, INDIRECT, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES ARISING OUT
 * OF THE USE OF THIS SOFTWARE, ITS DOCUMENTATION, OR ANY DERIVATIVES THEREOF,
 * EVEN IF THE AUTHORS HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * THE AUTHORS AND DISTRIBUTORS SPECIFICALLY DISCLAIM ANY WARRANTIES,
 * INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.  THIS SOFTWARE IS
 * PROVIDED ON AN "AS IS" BASIS, AND THE AUTHORS AND DISTRIBUTORS HAVE NO
 * OBLIGATION TO PROVIDE MAINTENANCE, SUPPORT, UPDATES, ENHANCEMENTS, OR
 * MODIFICATIONS.
 */


  module.exports = Conrec;

  var EPSILON = 1e-10;

  function pointsEqual(a, b) {
      var x = a.x - b.x, y = a.y - b.y;
      return x * x + y * y < EPSILON;
  }

  function reverseList(list) {
      var pp = list.head;

      while (pp) {
      // swap prev/next pointers
          var temp = pp.next;
          pp.next = pp.prev;
          pp.prev = temp;

      // continue through the list
          pp = temp;
      }

    // swap head/tail pointers
      var temp = list.head;
      list.head = list.tail;
      list.tail = temp;
  }

  function ContourBuilder(level) {
      this.level = level;
      this.s = null;
      this.count = 0;
  }
  ContourBuilder.prototype.remove_seq = function (list) {
    // if list is the first item, static ptr s is updated
      if (list.prev) {
          list.prev.next = list.next;
      } else {
          this.s = list.next;
      }

      if (list.next) {
          list.next.prev = list.prev;
      }
      --this.count;
  };
  ContourBuilder.prototype.addSegment = function (a, b) {
      var ss = this.s;
      var ma = null;
      var mb = null;
      var prependA = false;
      var prependB = false;

      while (ss) {
          if (ma == null) {
        // no match for a yet
              if (pointsEqual(a, ss.head.p)) {
                  ma = ss;
                  prependA = true;
              } else if (pointsEqual(a, ss.tail.p)) {
                  ma = ss;
              }
          }
          if (mb == null) {
        // no match for b yet
              if (pointsEqual(b, ss.head.p)) {
                  mb = ss;
                  prependB = true;
              } else if (pointsEqual(b, ss.tail.p)) {
                  mb = ss;
              }
          }
      // if we matched both no need to continue searching
          if (mb != null && ma != null) {
              break;
          } else {
              ss = ss.next;
          }
      }

    // c is the case selector based on which of ma and/or mb are set
      var c = ((ma != null) ? 1 : 0) | ((mb != null) ? 2 : 0);

      switch (c) {
      case 0:   // both unmatched, add as new sequence
          var aa = {p: a, prev: null};
          var bb = {p: b, next: null};
          aa.next = bb;
          bb.prev = aa;

        // create sequence element and push onto head of main list. The order
        // of items in this list is unimportant
          ma = {head: aa, tail: bb, next: this.s, prev: null, closed: false};
          if (this.s) {
              this.s.prev = ma;
          }
          this.s = ma;

          ++this.count;    // not essential - tracks number of unmerged sequences
          break;

      case 1:   // a matched, b did not - thus b extends sequence ma
          var pp = {p: b};

          if (prependA) {
              pp.next = ma.head;
              pp.prev = null;
              ma.head.prev = pp;
              ma.head = pp;
          } else {
              pp.next = null;
              pp.prev = ma.tail;
              ma.tail.next = pp;
              ma.tail = pp;
          }
          break;

      case 2:   // b matched, a did not - thus a extends sequence mb
          var pp = {p: a};

          if (prependB) {
              pp.next = mb.head;
              pp.prev = null;
              mb.head.prev = pp;
              mb.head = pp;
          } else {
              pp.next = null;
              pp.prev = mb.tail;
              mb.tail.next = pp;
              mb.tail = pp;
          }
          break;

      case 3:   // both matched, can merge sequences
        // if the sequences are the same, do nothing, as we are simply closing this path (could set a flag)

          if (ma === mb) {
              var pp = {p: ma.tail.p, next: ma.head, prev: null};
              ma.head.prev = pp;
              ma.head = pp;
              ma.closed = true;
              break;
          }

        // there are 4 ways the sequence pair can be joined. The current setting of prependA and
        // prependB will tell us which type of join is needed. For head/head and tail/tail joins
        // one sequence needs to be reversed
          switch ((prependA ? 1 : 0) | (prependB ? 2 : 0)) {
          case 0:   // tail-tail
            // reverse ma and append to mb
              reverseList(ma);
            // fall through to head/tail case
          case 1:   // head-tail
            // ma is appended to mb and ma discarded
              mb.tail.next = ma.head;
              ma.head.prev = mb.tail;
              mb.tail = ma.tail;

            //discard ma sequence record
              this.remove_seq(ma);
              break;

          case 3:   // head-head
            // reverse ma and append mb to it
              reverseList(ma);
            // fall through to tail/head case
          case 2:   // tail-head
            // mb is appended to ma and mb is discarded
              ma.tail.next = mb.head;
              mb.head.prev = ma.tail;
              ma.tail = mb.tail;

            //discard mb sequence record
              this.remove_seq(mb);
              break;
          }
      }
  };

  /*
   * Implements CONREC.
   *
   * @private
   * @param {function} drawContour function for drawing contour.  Defaults to a
   *                               custom "contour builder", which populates the
   *                               contours property.
   */
  function Conrec(drawContour) {
      if (!drawContour) {
          var c = this;
          c.contours = {};
      /**
       * drawContour - interface for implementing the user supplied method to
       * render the countours.
       *
       * Draws a line between the start and end coordinates.
       *
       * @private
       * @param startX    - start coordinate for X
       * @param startY    - start coordinate for Y
       * @param endX      - end coordinate for X
       * @param endY      - end coordinate for Y
       * @param contourLevel - Contour level for line.
       */
          this.drawContour = function (startX, startY, endX, endY, contourLevel, k) {
              var cb = c.contours[k];
              if (!cb) {
                  cb = c.contours[k] = new ContourBuilder(contourLevel);
              }
              cb.addSegment({x: startX, y: startY}, {x: endX, y: endY});
          };
          this.contourList = function () {
              var l = [];
              var a = c.contours;
              for (var k in a) {
                  var s = a[k].s;
                  var level = a[k].level;
                  while (s) {
                      var h = s.head;
                      var l2 = [];
                      l2.level = level;
                      l2.k = k;
                      while (h && h.p) {
                          l2.push(h.p);
                          h = h.next;
                      }
                      l.push(l2);
                      s = s.next;
                  }
              }
              l.sort(function (a, b) { return a.k - b.k; });
              return l;
          };
      } else {
          this.drawContour = drawContour;
      }
      this.h  = new Array(5);
      this.sh = new Array(5);
      this.xh = new Array(5);
      this.yh = new Array(5);
  }

  /*
   * contour is a contouring subroutine for rectangularily spaced data
   *
   * It emits calls to a line drawing subroutine supplied by the user which
   * draws a contour map corresponding to real*4data on a randomly spaced
   * rectangular grid. The coordinates emitted are in the same units given in
   * the x() and y() arrays.
   *
   * Any number of contour levels may be specified but they must be in order of
   * increasing value.
   *
   *
   * @param {number[][]} d - matrix of data to contour
   * @param {number} ilb,iub,jlb,jub - index bounds of data matrix
   *
   *             The following two, one dimensional arrays (x and y) contain
   *             the horizontal and vertical coordinates of each sample points.
   * @param {number[]} x  - data matrix column coordinates
   * @param {number[]} y  - data matrix row coordinates
   * @param {number} nc   - number of contour levels
   * @param {number[]} z  - contour levels in increasing order.
   */
  Conrec.prototype.contour = function (d, ilb, iub, jlb, jub, x, y, nc, z) {
      var h = this.h, sh = this.sh, xh = this.xh, yh = this.yh;
      var drawContour = this.drawContour;
      this.contours = {};

      var xsect = function (p1, p2) {
          return (h[p2] * xh[p1] - h[p1] * xh[p2]) / (h[p2] - h[p1]);
      };

      var ysect = function (p1, p2) {
          return (h[p2] * yh[p1] - h[p1] * yh[p2]) / (h[p2] - h[p1]);
      };
      var m1;
      var m2;
      var m3;
      var case_value;
      var dmin;
      var dmax;
      var x1 = 0.0;
      var x2 = 0.0;
      var y1 = 0.0;
      var y2 = 0.0;

    // The indexing of im and jm should be noted as it has to start from zero
    // unlike the fortran counter part
      var im = [0, 1, 1, 0];
      var jm = [0, 0, 1, 1];

    // Note that castab is arranged differently from the FORTRAN code because
    // Fortran and C/C++ arrays are transposed of each other, in this case
    // it is more tricky as castab is in 3 dimensions
      var castab = [
          [
        [0, 0, 8], [0, 2, 5], [7, 6, 9]
          ],
          [
        [0, 3, 4], [1, 3, 1], [4, 3, 0]
          ],
          [
        [9, 6, 7], [5, 2, 0], [8, 0, 0]
          ]
      ];

      for (var j = (jub - 1); j >= jlb; j--) {
          for (var i = ilb; i <= iub - 1; i++) {
              var temp1, temp2;
              temp1 = Math.min(d[i][j], d[i][j + 1]);
              temp2 = Math.min(d[i + 1][j], d[i + 1][j + 1]);
              dmin  = Math.min(temp1, temp2);
              temp1 = Math.max(d[i][j], d[i][j + 1]);
              temp2 = Math.max(d[i + 1][j], d[i + 1][j + 1]);
              dmax  = Math.max(temp1, temp2);

              if (dmax >= z[0] && dmin <= z[nc - 1]) {
                  for (var k = 0; k < nc; k++) {
                      if (z[k] >= dmin && z[k] <= dmax) {
                          for (var m = 4; m >= 0; m--) {
                            if (m > 0) {
                  // The indexing of im and jm should be noted as it has to
                  // start from zero
                              h[m] = d[i + im[m - 1]][j + jm[m - 1]] - z[k];
                              xh[m] = x[i + im[m - 1]];
                              yh[m] = y[j + jm[m - 1]];
                          } else {
                              h[0] = 0.25 * (h[1] + h[2] + h[3] + h[4]);
                              xh[0] = 0.5 * (x[i] + x[i + 1]);
                              yh[0] = 0.5 * (y[j] + y[j + 1]);
                          }
                            if (h[m] > EPSILON) {
                              sh[m] = 1;
                          } else if (h[m] < -EPSILON) {
                            sh[m] = -1;
                        } else
                  sh[m] = 0;
                        }
              //
              // Note: at this stage the relative heights of the corners and the
              // centre are in the h array, and the corresponding coordinates are
              // in the xh and yh arrays. The centre of the box is indexed by 0
              // and the 4 corners by 1 to 4 as shown below.
              // Each triangle is then indexed by the parameter m, and the 3
              // vertices of each triangle are indexed by parameters m1,m2,and
              // m3.
              // It is assumed that the centre of the box is always vertex 2
              // though this isimportant only when all 3 vertices lie exactly on
              // the same contour level, in which case only the side of the box
              // is drawn.
              //
              //
              //      vertex 4 +-------------------+ vertex 3
              //               | \               / |
              //               |   \    m-3    /   |
              //               |     \       /     |
              //               |       \   /       |
              //               |  m=2    X   m=2   |       the centre is vertex 0
              //               |       /   \       |
              //               |     /       \     |
              //               |   /    m=1    \   |
              //               | /               \ |
              //      vertex 1 +-------------------+ vertex 2
              //
              //
              //
              //               Scan each triangle in the box
              //
                          for (m = 1; m <= 4; m++) {
                            m1 = m;
                            m2 = 0;
                            if (m != 4) {
                              m3 = m + 1;
                          } else {
                              m3 = 1;
                          }
                            case_value = castab[sh[m1] + 1][sh[m2] + 1][sh[m3] + 1];
                            if (case_value != 0) {
                              switch (case_value) {
                            case 1: // Line between vertices 1 and 2
                                x1 = xh[m1];
                                y1 = yh[m1];
                                x2 = xh[m2];
                                y2 = yh[m2];
                                break;
                            case 2: // Line between vertices 2 and 3
                                x1 = xh[m2];
                                y1 = yh[m2];
                                x2 = xh[m3];
                                y2 = yh[m3];
                                break;
                            case 3: // Line between vertices 3 and 1
                                x1 = xh[m3];
                                y1 = yh[m3];
                                x2 = xh[m1];
                                y2 = yh[m1];
                                break;
                            case 4: // Line between vertex 1 and side 2-3
                                x1 = xh[m1];
                                y1 = yh[m1];
                                x2 = xsect(m2, m3);
                                y2 = ysect(m2, m3);
                                break;
                            case 5: // Line between vertex 2 and side 3-1
                                x1 = xh[m2];
                                y1 = yh[m2];
                                x2 = xsect(m3, m1);
                                y2 = ysect(m3, m1);
                                break;
                            case 6: //  Line between vertex 3 and side 1-2
                                x1 = xh[m3];
                                y1 = yh[m3];
                                x2 = xsect(m1, m2);
                                y2 = ysect(m1, m2);
                                break;
                            case 7: // Line between sides 1-2 and 2-3
                                x1 = xsect(m1, m2);
                                y1 = ysect(m1, m2);
                                x2 = xsect(m2, m3);
                                y2 = ysect(m2, m3);
                                break;
                            case 8: // Line between sides 2-3 and 3-1
                                x1 = xsect(m2, m3);
                                y1 = ysect(m2, m3);
                                x2 = xsect(m3, m1);
                                y2 = ysect(m3, m1);
                                break;
                            case 9: // Line between sides 3-1 and 1-2
                                x1 = xsect(m3, m1);
                                y1 = ysect(m3, m1);
                                x2 = xsect(m1, m2);
                                y2 = ysect(m1, m2);
                                break;
                            default:
                                break;
                            }
                  // Put your processing code here and comment out the printf
                  //printf("%f %f %f %f %f\n",x1,y1,x2,y2,z[k]);
                              drawContour(x1, y1, x2, y2, z[k], k);
                          }
                        }
                      }
                  }
              }
          }
      }
  };

},{}],48:[function(require,module,exports){
//https://github.com/jasondavies/conrec.js
//http://stackoverflow.com/questions/263305/drawing-a-topographical-map
var tin = require('turf-tin');
var inside = require('turf-inside');
var grid = require('turf-grid');
var bbox = require('turf-bbox');
var planepoint = require('turf-planepoint');
var featurecollection = require('turf-helpers').featureCollection;
var linestring = require('turf-helpers').lineString;
var square = require('turf-square');
var Conrec = require('./conrec');

/**
 * Takes {@link Point|points} with z-values and an array of
 * value breaks and generates [isolines](http://en.wikipedia.org/wiki/Isoline).
 *
 * @name isolines
 * @param {FeatureCollection<Point>} points input points
 * @param {string} z the property name in `points` from which z-values will be pulled
 * @param {number} resolution resolution of the underlying grid
 * @param {Array<number>} breaks where to draw contours
 * @returns {FeatureCollection<LineString>} isolines
 * @example
 * // create random points with random
 * // z-values in their properties
 * var points = turf.random('point', 100, {
 *   bbox: [0, 30, 20, 50]
 * });
 * for (var i = 0; i < points.features.length; i++) {
 *   points.features[i].properties.z = Math.random() * 10;
 * }
 * var breaks = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
 * var isolined = turf.isolines(points, 'z', 15, breaks);
 * //=isolined
 */
module.exports = function (points, z, resolution, breaks) {
    var tinResult = tin(points, z);
    var bboxBBox = bbox(points);
    var squareBBox = square(bboxBBox);
    var gridResult = grid(squareBBox, resolution);
    var data = [];

    for (var i = 0; i < gridResult.features.length; i++) {
        var pt = gridResult.features[i];
        for (var j = 0; j < tinResult.features.length; j++) {
            var triangle = tinResult.features[j];
            if (inside(pt, triangle)) {
                pt.properties = {};
                pt.properties[z] = planepoint(pt, triangle);
            }
        }
    }

    var depth = Math.sqrt(gridResult.features.length);
    for (var x = 0; x < depth; x++) {
        var xGroup = gridResult.features.slice(x * depth, (x + 1) * depth);
        var xFlat = [];

        for (var g = 0; g < xGroup.length; g++) {
            if (xGroup[g].properties) {
                xFlat.push(xGroup[g].properties[z]);
            } else {
                xFlat.push(0);
            }
        }
        data.push(xFlat);
    }
    var interval = (squareBBox[2] - squareBBox[0]) / depth;
    var xCoordinates = [];
    var yCoordinates = [];
    for (var d = 0; d < depth; d++) {
        xCoordinates.push(d * interval + squareBBox[0]);
        yCoordinates.push(d * interval + squareBBox[1]);
    }

    var c = new Conrec();
    c.contour(data, 0, resolution, 0, resolution, xCoordinates, yCoordinates, breaks.length, breaks);
    var contourList = c.contourList();

    var fc = featurecollection([]);
    contourList.forEach(function (c) {
        if (c.length > 2) {
            var polyCoordinates = [];
            c.forEach(function (coord) {
                polyCoordinates.push([coord.x, coord.y]);
            });
            var poly = linestring(polyCoordinates);
            poly.properties = {};
            poly.properties[z] = c.level;

            fc.features.push(poly);
        }
    });

    return fc;
};

},{"./conrec":47,"turf-bbox":24,"turf-grid":41,"turf-helpers":42,"turf-inside":44,"turf-planepoint":55,"turf-square":64,"turf-tin":67}],49:[function(require,module,exports){
/**
 * Takes a {@link Polygon|polygon} and returns {@link Point|points} at all self-intersections.
 *
 * @name kinks
 * @param {Feature<Polygon>|Polygon} polygon input polygon
 * @returns {FeatureCollection<Point>} self-intersections
 * @example
 * var poly = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Polygon",
 *     "coordinates": [[
 *       [-12.034835, 8.901183],
 *       [-12.060413, 8.899826],
 *       [-12.03638, 8.873199],
 *       [-12.059383, 8.871418],
 *       [-12.034835, 8.901183]
 *     ]]
 *   }
 * };
 *
 * var kinks = turf.kinks(poly);
 *
 * var resultFeatures = kinks.intersections.features.concat(poly);
 * var result = {
 *   "type": "FeatureCollection",
 *   "features": resultFeatures
 * };
 *
 * //=result
 */

var point = require('turf-helpers').point;

module.exports = function (polyIn) {
    var poly;
    var results = {
        type: 'FeatureCollection',
        features: []
    };
    if (polyIn.type === 'Feature') {
        poly = polyIn.geometry;
    } else {
        poly = polyIn;
    }
    poly.coordinates.forEach(function (ring1) {
        poly.coordinates.forEach(function (ring2) {
            for (var i = 0; i < ring1.length - 1; i++) {
                for (var k = 0; k < ring2.length - 1; k++) {
                    // don't check adjacent sides of a given ring, since of course they intersect in a vertex.
                    if (ring1 === ring2 && (Math.abs(i - k) === 1 || Math.abs(i - k) === ring1.length - 2)) {
                        continue;
                    }

                    var intersection = lineIntersects(ring1[i][0], ring1[i][1], ring1[i + 1][0], ring1[i + 1][1],
                        ring2[k][0], ring2[k][1], ring2[k + 1][0], ring2[k + 1][1]);
                    if (intersection) {
                        results.features.push(point([intersection[0], intersection[1]]));
                    }
                }
            }
        });
    });
    return results;
};


// modified from http://jsfiddle.net/justin_c_rounds/Gd2S2/light/
function lineIntersects(line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) {
    // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
    var denominator, a, b, numerator1, numerator2,
        result = {
            x: null,
            y: null,
            onLine1: false,
            onLine2: false
        };
    denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
    if (denominator === 0) {
        if (result.x !== null && result.y !== null) {
            return result;
        } else {
            return false;
        }
    }
    a = line1StartY - line2StartY;
    b = line1StartX - line2StartX;
    numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
    numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
    a = numerator1 / denominator;
    b = numerator2 / denominator;

    // if we cast these lines infinitely in both directions, they intersect here:
    result.x = line1StartX + (a * (line1EndX - line1StartX));
    result.y = line1StartY + (a * (line1EndY - line1StartY));

    // if line1 is a segment and line2 is infinite, they intersect if:
    if (a >= 0 && a <= 1) {
        result.onLine1 = true;
    }
    // if line2 is a segment and line1 is infinite, they intersect if:
    if (b >= 0 && b <= 1) {
        result.onLine2 = true;
    }
    // if line1 and line2 are segments, they intersect if both of the above are true
    if (result.onLine1 && result.onLine2) {
        return [result.x, result.y];
    } else {
        return false;
    }
}

},{"turf-helpers":42}],50:[function(require,module,exports){
var distance = require('turf-distance');
var point = require('turf-helpers').point;

/**
 * Takes a {@link LineString|line} and measures its length in the specified units.
 *
 * @name lineDistance
 * @param {Feature<LineString>} line line to measure
 * @param {String} [units=kilometers] can be degrees, radians, miles, or kilometers
 * @return {Number} length of the input line
 * @example
 * var line = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "LineString",
 *     "coordinates": [
 *       [-77.031669, 38.878605],
 *       [-77.029609, 38.881946],
 *       [-77.020339, 38.884084],
 *       [-77.025661, 38.885821],
 *       [-77.021884, 38.889563],
 *       [-77.019824, 38.892368]
 *     ]
 *   }
 * };
 *
 * var length = turf.lineDistance(line, 'miles');
 *
 * //=line
 *
 * //=length
 */
module.exports = function lineDistance(line, units) {
    if (line.type === 'FeatureCollection') {
        return line.features.reduce(function (memo, feature) {
            return memo + lineDistance(feature, units);
        }, 0);
    }

    var geometry = line.type === 'Feature' ? line.geometry : line;
    var d, i;

    if (geometry.type === 'LineString') {
        return length(geometry.coordinates, units);
    } else if (geometry.type === 'Polygon' || geometry.type === 'MultiLineString') {
        d = 0;
        for (i = 0; i < geometry.coordinates.length; i++) {
            d += length(geometry.coordinates[i], units);
        }
        return d;
    } else if (line.type === 'MultiPolygon') {
        d = 0;
        for (i = 0; i < geometry.coordinates.length; i++) {
            for (var j = 0; j < geometry.coordinates[i].length; j++) {
                d += length(geometry.coordinates[i][j], units);
            }
        }
        return d;
    } else {
        throw new Error('input must be a LineString, MultiLineString, ' +
            'Polygon, or MultiPolygon Feature or Geometry (or a FeatureCollection ' +
            'containing only those types)');
    }

};

function length(coords, units) {
    var travelled = 0;
    var prevCoords = point(coords[0]);
    var curCoords = point(coords[0]);
    var temp;
    for (var i = 1; i < coords.length; i++) {
        curCoords.geometry.coordinates = coords[i];
        travelled += distance(prevCoords, curCoords, units);
        temp = prevCoords;
        prevCoords = curCoords;
        curCoords = temp;
    }
    return travelled;
}

},{"turf-distance":37,"turf-helpers":42}],51:[function(require,module,exports){
var linestring = require('turf-helpers').lineString;
var pointOnLine = require('turf-point-on-line');

/**
 * Takes a {@link LineString|line}, a start {@link Point}, and a stop point
 * and returns a subsection of the line in-between those points.
 * The start & stop points don't need to fall exactly on the line.
 *
 * This can be useful for extracting only the part of a route between waypoints.
 *
 * @name lineSlice
 * @param {Feature<Point>} point1 starting point
 * @param {Feature<Point>} point2 stopping point
 * @param {Feature<LineString>|LineString} line line to slice
 * @return {Feature<LineString>} sliced line
 * @example
 * var line = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "LineString",
 *     "coordinates": [
 *       [-77.031669, 38.878605],
 *       [-77.029609, 38.881946],
 *       [-77.020339, 38.884084],
 *       [-77.025661, 38.885821],
 *       [-77.021884, 38.889563],
 *       [-77.019824, 38.892368]
 *     ]
 *   }
 * };
 * var start = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [-77.029609, 38.881946]
 *   }
 * };
 * var stop = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [-77.021884, 38.889563]
 *   }
 * };
 *
 * var sliced = turf.lineSlice(start, stop, line);
 *
 * //=line
 *
 * //=sliced
 */

module.exports = function lineSlice(startPt, stopPt, line) {
    var coords;
    if (line.type === 'Feature') {
        coords = line.geometry.coordinates;
    } else if (line.type === 'LineString') {
        coords = line.coordinates;
    } else {
        throw new Error('input must be a LineString Feature or Geometry');
    }

    var startVertex = pointOnLine(line, startPt);
    var stopVertex = pointOnLine(line, stopPt);
    var ends;
    if (startVertex.properties.index <= stopVertex.properties.index) {
        ends = [startVertex, stopVertex];
    } else {
        ends = [stopVertex, startVertex];
    }
    var clipLine = linestring([ends[0].geometry.coordinates], {});
    for (var i = ends[0].properties.index + 1; i < ends[1].properties.index + 1; i++) {
        clipLine.geometry.coordinates.push(coords[i]);
    }
    clipLine.geometry.coordinates.push(ends[1].geometry.coordinates);
    return clipLine;
};

},{"turf-helpers":42,"turf-point-on-line":57}],52:[function(require,module,exports){
/**
 * Iterate over coordinates in any GeoJSON object, similar to
 * Array.forEach.
 *
 * @param {Object} layer any GeoJSON object
 * @param {Function} callback a method that takes (value)
 * @param {boolean=} excludeWrapCoord whether or not to include
 * the final coordinate of LinearRings that wraps the ring in its iteration.
 * @example
 * var point = { type: 'Point', coordinates: [0, 0] };
 * coordEach(point, function(coords) {
 *   // coords is equal to [0, 0]
 * });
 */
function coordEach(layer, callback, excludeWrapCoord) {
    var i, j, k, g, l, geometry, stopG, coords,
        geometryMaybeCollection,
        wrapShrink = 0,
        isGeometryCollection,
        isFeatureCollection = layer.type === 'FeatureCollection',
        isFeature = layer.type === 'Feature',
        stop = isFeatureCollection ? layer.features.length : 1;

  // This logic may look a little weird. The reason why it is that way
  // is because it's trying to be fast. GeoJSON supports multiple kinds
  // of objects at its root: FeatureCollection, Features, Geometries.
  // This function has the responsibility of handling all of them, and that
  // means that some of the `for` loops you see below actually just don't apply
  // to certain inputs. For instance, if you give this just a
  // Point geometry, then both loops are short-circuited and all we do
  // is gradually rename the input until it's called 'geometry'.
  //
  // This also aims to allocate as few resources as possible: just a
  // few numbers and booleans, rather than any temporary arrays as would
  // be required with the normalization approach.
    for (i = 0; i < stop; i++) {

        geometryMaybeCollection = (isFeatureCollection ? layer.features[i].geometry :
        (isFeature ? layer.geometry : layer));
        isGeometryCollection = geometryMaybeCollection.type === 'GeometryCollection';
        stopG = isGeometryCollection ? geometryMaybeCollection.geometries.length : 1;

        for (g = 0; g < stopG; g++) {
            geometry = isGeometryCollection ?
            geometryMaybeCollection.geometries[g] : geometryMaybeCollection;
            coords = geometry.coordinates;

            wrapShrink = (excludeWrapCoord &&
                (geometry.type === 'Polygon' || geometry.type === 'MultiPolygon')) ?
                1 : 0;

            if (geometry.type === 'Point') {
                callback(coords);
            } else if (geometry.type === 'LineString' || geometry.type === 'MultiPoint') {
                for (j = 0; j < coords.length; j++) callback(coords[j]);
            } else if (geometry.type === 'Polygon' || geometry.type === 'MultiLineString') {
                for (j = 0; j < coords.length; j++)
                    for (k = 0; k < coords[j].length - wrapShrink; k++)
                        callback(coords[j][k]);
            } else if (geometry.type === 'MultiPolygon') {
                for (j = 0; j < coords.length; j++)
                    for (k = 0; k < coords[j].length; k++)
                        for (l = 0; l < coords[j][k].length - wrapShrink; l++)
                            callback(coords[j][k][l]);
            } else {
                throw new Error('Unknown Geometry Type');
            }
        }
    }
}
module.exports.coordEach = coordEach;

/**
 * Reduce coordinates in any GeoJSON object into a single value,
 * similar to how Array.reduce works. However, in this case we lazily run
 * the reduction, so an array of all coordinates is unnecessary.
 *
 * @param {Object} layer any GeoJSON object
 * @param {Function} callback a method that takes (memo, value) and returns
 * a new memo
 * @param {boolean=} excludeWrapCoord whether or not to include
 * the final coordinate of LinearRings that wraps the ring in its iteration.
 * @param {*} memo the starting value of memo: can be any type.
 */
function coordReduce(layer, callback, memo, excludeWrapCoord) {
    coordEach(layer, function (coord) {
        memo = callback(memo, coord);
    }, excludeWrapCoord);
    return memo;
}
module.exports.coordReduce = coordReduce;

/**
 * Iterate over property objects in any GeoJSON object, similar to
 * Array.forEach.
 *
 * @param {Object} layer any GeoJSON object
 * @param {Function} callback a method that takes (value)
 * @example
 * var point = { type: 'Feature', geometry: null, properties: { foo: 1 } };
 * propEach(point, function(props) {
 *   // props is equal to { foo: 1}
 * });
 */
function propEach(layer, callback) {
    var i;
    switch (layer.type) {
    case 'FeatureCollection':
        for (i = 0; i < layer.features.length; i++) {
            callback(layer.features[i].properties);
        }
        break;
    case 'Feature':
        callback(layer.properties);
        break;
    }
}
module.exports.propEach = propEach;

/**
 * Reduce properties in any GeoJSON object into a single value,
 * similar to how Array.reduce works. However, in this case we lazily run
 * the reduction, so an array of all properties is unnecessary.
 *
 * @param {Object} layer any GeoJSON object
 * @param {Function} callback a method that takes (memo, coord) and returns
 * a new memo
 * @param {*} memo the starting value of memo: can be any type.
 */
function propReduce(layer, callback, memo) {
    propEach(layer, function (prop) {
        memo = callback(memo, prop);
    });
    return memo;
}
module.exports.propReduce = propReduce;

/**
 * Iterate over features in any GeoJSON object, similar to
 * Array.forEach.
 *
 * @param {Object} layer any GeoJSON object
 * @param {Function} callback a method that takes (value)
 * @example
 * var feature = { type: 'Feature', geometry: null, properties: {} };
 * featureEach(feature, function(feature) {
 *   // feature == feature
 * });
 */
function featureEach(layer, callback) {
    if (layer.type === 'Feature') {
        return callback(layer);
    }
    if (layer.type === 'FeatureCollection') {
        for (var i = 0; i < layer.features.length; i++) {
            callback(layer.features[i]);
        }
    }
}
module.exports.featureEach = featureEach;

/**
 * Get all coordinates from any GeoJSON object, returning an array of coordinate
 * arrays.
 * @param {Object} layer any GeoJSON object
 * @return {Array<Array<Number>>} coordinate position array
 */
function coordAll(layer) {
    var coords = [];
    coordEach(layer, function (coord) {
        coords.push(coord);
    });
    return coords;
}
module.exports.coordAll = coordAll;

},{}],53:[function(require,module,exports){
var bearing = require('turf-bearing');
var destination = require('turf-destination');
var distance = require('turf-distance');

/**
 * Takes two {@link Point|points} and returns a point midway between them.
 * The midpoint is calculated geodesically, meaning the curvature of the earth is taken into account.
 *
 * @name midpoint
 * @param {Feature<Point>} pt1 first point
 * @param {Feature<Point>} pt2 second point
 * @return {Feature<Point>} a point midway between `pt1` and `pt2`
 * @example
 * var pt1 = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [144.834823, -37.771257]
 *   }
 * };
 * var pt2 = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [145.14244, -37.830937]
 *   }
 * };
 *
 * var midpointed = turf.midpoint(pt1, pt2);
 * midpointed.properties['marker-color'] = '#f00';
 *
 *
 * var result = {
 *   "type": "FeatureCollection",
 *   "features": [pt1, pt2, midpointed]
 * };
 *
 * //=result
 */
module.exports = function (point1, point2) {
    var dist = distance(point1, point2, 'miles');
    var heading = bearing(point1, point2);
    var midpoint = destination(point1, dist / 2, heading, 'miles');

    return midpoint;
};

},{"turf-bearing":25,"turf-destination":35,"turf-distance":37}],54:[function(require,module,exports){
var distance = require('turf-distance');

/**
 * Takes a reference {@link Point|point} and a FeatureCollection of Features
 * with Point geometries and returns the
 * point from the FeatureCollection closest to the reference. This calculation
 * is geodesic.
 *
 * @name nearest
 * @param {Feature<Point>} point the reference point
 * @param {FeatureCollection<Point>} against input point set
 * @return {Feature<Point>} the closest point in the set to the reference point
 * @example
 * var point = {
 *   "type": "Feature",
 *   "properties": {
 *     "marker-color": "#0f0"
 *   },
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [28.965797, 41.010086]
 *   }
 * };
 * var against = {
 *   "type": "FeatureCollection",
 *   "features": [
 *     {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [28.973865, 41.011122]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [28.948459, 41.024204]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [28.938674, 41.013324]
 *       }
 *     }
 *   ]
 * };
 *
 * var nearest = turf.nearest(point, against);
 * nearest.properties['marker-color'] = '#f00';
 *
 * var resultFeatures = against.features.concat(point);
 * var result = {
 *   "type": "FeatureCollection",
 *   "features": resultFeatures
 * };
 *
 * //=result
 */
module.exports = function (targetPoint, points) {
    var nearestPoint, minDist = Infinity;
    for (var i = 0; i < points.features.length; i++) {
        var distanceToPoint = distance(targetPoint, points.features[i], 'miles');
        if (distanceToPoint < minDist) {
            nearestPoint = points.features[i];
            minDist = distanceToPoint;
        }
    }
    return nearestPoint;
};

},{"turf-distance":37}],55:[function(require,module,exports){
/**
 * Takes a triangular plane as a {@link Polygon}
 * and a {@link Point} within that triangle and returns the z-value
 * at that point. The Polygon needs to have properties `a`, `b`, and `c`
 * that define the values at its three corners.
 *
 * @name planepoint
 * @param {Feature<Point>} interpolatedPoint the Point for which a z-value will be calculated
 * @param {Feature<Polygon>} triangle a Polygon feature with three vertices
 * @return {Number} the z-value for `interpolatedPoint`
 * @example
 * var point = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [-75.3221, 39.529]
 *   }
 * };
 * var point = turf.point([-75.3221, 39.529]);
 * // triangle is a polygon with "a", "b",
 * // and "c" values representing
 * // the values of the coordinates in order.
 * var triangle = {
 *   "type": "Feature",
 *   "properties": {
 *     "a": 11,
 *     "b": 122,
 *     "c": 44
 *   },
 *   "geometry": {
 *     "type": "Polygon",
 *     "coordinates": [[
 *       [-75.1221, 39.57],
 *       [-75.58, 39.18],
 *       [-75.97, 39.86],
 *       [-75.1221, 39.57]
 *     ]]
 *   }
 * };
 *
 * var features = {
 *   "type": "FeatureCollection",
 *   "features": [triangle, point]
 * };
 *
 * var zValue = turf.planepoint(point, triangle);
 *
 * //=features
 *
 * //=zValue
 */
module.exports = function (point, triangle) {
    var x = point.geometry.coordinates[0],
        y = point.geometry.coordinates[1],
        x1 = triangle.geometry.coordinates[0][0][0],
        y1 = triangle.geometry.coordinates[0][0][1],
        z1 = triangle.properties.a,
        x2 = triangle.geometry.coordinates[0][1][0],
        y2 = triangle.geometry.coordinates[0][1][1],
        z2 = triangle.properties.b,
        x3 = triangle.geometry.coordinates[0][2][0],
        y3 = triangle.geometry.coordinates[0][2][1],
        z3 = triangle.properties.c;

    var z = (z3 * (x - x1) * (y - y2) + z1 * (x - x2) * (y - y3) + z2 * (x - x3) * (y - y1) -
      z2 * (x - x1) * (y - y3) - z3 * (x - x2) * (y - y1) - z1 * (x - x3) * (y - y2)) /
      ((x - x1) * (y - y2) + (x - x2) * (y - y3) + (x - x3) * (y - y1) -
       (x - x1) * (y - y3) - (x - x2) * (y - y1) - (x - x3) * (y - y2));

    return z;
};

},{}],56:[function(require,module,exports){
var point = require('turf-helpers').point;
var featurecollection = require('turf-helpers').featureCollection;
var distance = require('turf-distance');
/**
 * Takes a bounding box and a cell depth and returns a set of {@link Point|points} in a grid.
 *
 * @name pointGrid
 * @param {Array<number>} extent extent in [minX, minY, maxX, maxY] order
 * @param {number} cellWidth the distance across each cell
 * @param {string} [units=kilometers] used in calculating cellWidth, can be degrees, radians, miles, or kilometers
 * @return {FeatureCollection<Point>} grid of points
 * @example
 * var extent = [-70.823364, -33.553984, -70.473175, -33.302986];
 * var cellWidth = 3;
 * var units = 'miles';
 *
 * var grid = turf.pointGrid(extent, cellWidth, units);
 *
 * //=grid
 */
module.exports = function pointGrid(bbox, cell, units) {
    var fc = featurecollection([]);
    var xFraction = cell / (distance(point([bbox[0], bbox[1]]), point([bbox[2], bbox[1]]), units));
    var cellWidth = xFraction * (bbox[2] - bbox[0]);
    var yFraction = cell / (distance(point([bbox[0], bbox[1]]), point([bbox[0], bbox[3]]), units));
    var cellHeight = yFraction * (bbox[3] - bbox[1]);

    var currentX = bbox[0];
    while (currentX <= bbox[2]) {
        var currentY = bbox[1];
        while (currentY <= bbox[3]) {
            fc.features.push(point([currentX, currentY]));

            currentY += cellHeight;
        }
        currentX += cellWidth;
    }

    return fc;
};

},{"turf-distance":37,"turf-helpers":42}],57:[function(require,module,exports){
var distance = require('turf-distance');
var point = require('turf-helpers').point;
var bearing = require('turf-bearing');
var destination = require('turf-destination');

/**
 * Takes a {@link Point} and a {@link LineString} and calculates the closest Point on the LineString.
 *
 * @name pointOnLine
 * @param {Feature<LineString>} line line to snap to
 * @param {Feature<Point>} point point to snap from
 * @return {Feature<Point>} closest point on the `line` to `point`
 * @example
 * var line = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "LineString",
 *     "coordinates": [
 *       [-77.031669, 38.878605],
 *       [-77.029609, 38.881946],
 *       [-77.020339, 38.884084],
 *       [-77.025661, 38.885821],
 *       [-77.021884, 38.889563],
 *       [-77.019824, 38.892368]
 *     ]
 *   }
 * };
 * var pt = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [-77.037076, 38.884017]
 *   }
 * };
 *
 * var snapped = turf.pointOnLine(line, pt);
 * snapped.properties['marker-color'] = '#00f'
 *
 * var result = {
 *   "type": "FeatureCollection",
 *   "features": [line, pt, snapped]
 * };
 *
 * //=result
 */

module.exports = function (line, pt) {
    var coords;
    if (line.type === 'Feature') {
        coords = line.geometry.coordinates;
    } else if (line.type === 'LineString') {
        coords = line.coordinates;
    } else {
        throw new Error('input must be a LineString Feature or Geometry');
    }

    return pointOnLine(pt, coords);
};

function pointOnLine(pt, coords) {
    var units = 'miles';
    var closestPt = point([Infinity, Infinity], {
        dist: Infinity
    });
    for (var i = 0; i < coords.length - 1; i++) {
        var start = point(coords[i]);
        var stop = point(coords[i + 1]);
        //start
        start.properties.dist = distance(pt, start, units);
        //stop
        stop.properties.dist = distance(pt, stop, units);
        //perpendicular
        var heightDistance = Math.max(start.properties.dist, stop.properties.dist);
        var direction = bearing(start, stop);
        var perpendicularPt1 = destination(pt, heightDistance, direction + 90, units);
        var perpendicularPt2 = destination(pt, heightDistance, direction - 90, units);
        var intersect = lineIntersects(
        perpendicularPt1.geometry.coordinates[0],
        perpendicularPt1.geometry.coordinates[1],
        perpendicularPt2.geometry.coordinates[0],
        perpendicularPt2.geometry.coordinates[1],
        start.geometry.coordinates[0],
        start.geometry.coordinates[1],
        stop.geometry.coordinates[0],
        stop.geometry.coordinates[1]
        );
        var intersectPt;
        if (intersect) {
            intersectPt = point(intersect);
            intersectPt.properties.dist = distance(pt, intersectPt, units);
        }

        if (start.properties.dist < closestPt.properties.dist) {
            closestPt = start;
            closestPt.properties.index = i;
        }
        if (stop.properties.dist < closestPt.properties.dist) {
            closestPt = stop;
            closestPt.properties.index = i;
        }
        if (intersectPt && intersectPt.properties.dist < closestPt.properties.dist) {
            closestPt = intersectPt;
            closestPt.properties.index = i;
        }
    }

    return closestPt;
}

// modified from http://jsfiddle.net/justin_c_rounds/Gd2S2/light/
function lineIntersects(line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) {
    // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
    var denominator, a, b, numerator1, numerator2;
    var result = {
        x: null,
        y: null,
        onLine1: false,
        onLine2: false
    };
    denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
    if (denominator === 0) {
        if (result.x !== null && result.y !== null) {
            return result;
        } else {
            return false;
        }
    }
    a = line1StartY - line2StartY;
    b = line1StartX - line2StartX;
    numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
    numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
    a = numerator1 / denominator;
    b = numerator2 / denominator;

    // if we cast these lines infinitely in both directions, they intersect here:
    result.x = line1StartX + (a * (line1EndX - line1StartX));
    result.y = line1StartY + (a * (line1EndY - line1StartY));

    // if line1 is a segment and line2 is infinite, they intersect if:
    if (a > 0 && a < 1) {
        result.onLine1 = true;
    }
    // if line2 is a segment and line1 is infinite, they intersect if:
    if (b > 0 && b < 1) {
        result.onLine2 = true;
    }
    // if line1 and line2 are segments, they intersect if both of the above are true
    if (result.onLine1 && result.onLine2) {
        return [result.x, result.y];
    } else {
        return false;
    }
}

},{"turf-bearing":25,"turf-destination":35,"turf-distance":37,"turf-helpers":42}],58:[function(require,module,exports){
var featureCollection = require('turf-helpers').featureCollection;
var centroid = require('turf-center');
var distance = require('turf-distance');
var inside = require('turf-inside');
var explode = require('turf-explode');

/**
 * Takes a feature and returns a {@link Point} guaranteed to be on the surface of the feature.
 *
 * * Given a {@link Polygon}, the point will be in the area of the polygon
 * * Given a {@link LineString}, the point will be along the string
 * * Given a {@link Point}, the point will the same as the input
 *
 * @param {(Feature|FeatureCollection)} fc any feature or set of features
 * @returns {Feature} a point on the surface of `input`
 * @example
 * // create a random polygon
 * var polygon = turf.random('polygon');
 *
 * //=polygon
 *
 * var pointOnPolygon = turf.pointOnSurface(polygon);
 *
* var resultFeatures = polygon.features.concat(pointOnPolygon);
* var result = {
*   "type": "FeatureCollection",
*   "features": resultFeatures
* };
 *
 * //=result
 */
function pointOnSurface(fc) {
    // normalize
    if (fc.type !== 'FeatureCollection') {
        if (fc.type !== 'Feature') {
            fc = {
                type: 'Feature',
                geometry: fc,
                properties: {}
            };
        }
        fc = featureCollection([fc]);
    }

    //get centroid
    var cent = centroid(fc);

    // check to see if centroid is on surface
    var onSurface = false;
    var i = 0;
    while (!onSurface && i < fc.features.length) {
        var geom = fc.features[i].geometry;
        var x, y, x1, y1, x2, y2, k;
        var onLine = false;
        if (geom.type === 'Point') {
            if (cent.geometry.coordinates[0] === geom.coordinates[0] &&
        cent.geometry.coordinates[1] === geom.coordinates[1]) {
                onSurface = true;
            }
        } else if (geom.type === 'MultiPoint') {
            var onMultiPoint = false;
            k = 0;
            while (!onMultiPoint && k < geom.coordinates.length) {
                if (cent.geometry.coordinates[0] === geom.coordinates[k][0] &&
          cent.geometry.coordinates[1] === geom.coordinates[k][1]) {
                    onSurface = true;
                    onMultiPoint = true;
                }
                k++;
            }
        } else if (geom.type === 'LineString') {
            k = 0;
            while (!onLine && k < geom.coordinates.length - 1) {
                x = cent.geometry.coordinates[0];
                y = cent.geometry.coordinates[1];
                x1 = geom.coordinates[k][0];
                y1 = geom.coordinates[k][1];
                x2 = geom.coordinates[k + 1][0];
                y2 = geom.coordinates[k + 1][1];
                if (pointOnSegment(x, y, x1, y1, x2, y2)) {
                    onLine = true;
                    onSurface = true;
                }
                k++;
            }
        } else if (geom.type === 'MultiLineString') {
            var j = 0;
            while (j < geom.coordinates.length) {
                onLine = false;
                k = 0;
                var line = geom.coordinates[j];
                while (!onLine && k < line.length - 1) {
                    x = cent.geometry.coordinates[0];
                    y = cent.geometry.coordinates[1];
                    x1 = line[k][0];
                    y1 = line[k][1];
                    x2 = line[k + 1][0];
                    y2 = line[k + 1][1];
                    if (pointOnSegment(x, y, x1, y1, x2, y2)) {
                        onLine = true;
                        onSurface = true;
                    }
                    k++;
                }
                j++;
            }
        } else if (geom.type === 'Polygon' || geom.type === 'MultiPolygon') {
            var f = {
                type: 'Feature',
                geometry: geom,
                properties: {}
            };
            if (inside(cent, f)) {
                onSurface = true;
            }
        }
        i++;
    }
    if (onSurface) {
        return cent;
    } else {
        var vertices = featureCollection([]);
        for (i = 0; i < fc.features.length; i++) {
            vertices.features = vertices.features.concat(explode(fc.features[i]).features);
        }
        var closestVertex;
        var closestDistance = Infinity;
        for (i = 0; i < vertices.features.length; i++) {
            var dist = distance(cent, vertices.features[i], 'miles');
            if (dist < closestDistance) {
                closestDistance = dist;
                closestVertex = vertices.features[i];
            }
        }
        return closestVertex;
    }
}

function pointOnSegment(x, y, x1, y1, x2, y2) {
    var ab = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    var ap = Math.sqrt((x - x1) * (x - x1) + (y - y1) * (y - y1));
    var pb = Math.sqrt((x2 - x) * (x2 - x) + (y2 - y) * (y2 - y));
    if (ab === ap + pb) {
        return true;
    }
}

module.exports = pointOnSurface;

},{"turf-center":29,"turf-distance":37,"turf-explode":39,"turf-helpers":42,"turf-inside":44}],59:[function(require,module,exports){
/**
 * Takes coordinates and properties (optional) and returns a new {@link Point} feature.
 *
 * @module turf/point
 * @category helper
 * @param {number} longitude position west to east in decimal degrees
 * @param {number} latitude position south to north in decimal degrees
 * @param {Object} properties an Object that is used as the {@link Feature}'s
 * properties
 * @return {Point} a Point feature
 * @example
 * var pt1 = turf.point([-75.343, 39.984]);
 *
 * //=pt1
 */
var isArray = Array.isArray || function(arg) {
  return Object.prototype.toString.call(arg) === '[object Array]';
};
module.exports = function(coordinates, properties) {
  if (!isArray(coordinates)) throw new Error('Coordinates must be an array');
  if (coordinates.length < 2) throw new Error('Coordinates must be at least 2 numbers long');
  return {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: coordinates
    },
    properties: properties || {}
  };
};

},{}],60:[function(require,module,exports){
var random = require('geojson-random');

/**
 * Generates random {@link GeoJSON} data, including {@link Point|Points} and {@link Polygon|Polygons}, for testing
 * and experimentation.
 *
 * @name random
 * @param {String} [type='point'] type of features desired: 'points' or 'polygons'
 * @param {Number} [count=1] how many geometries should be generated.
 * @param {Object} options options relevant to the feature desired. Can include:
 * @param {Array<number>} options.bbox a bounding box inside of which geometries
 * are placed. In the case of {@link Point} features, they are guaranteed to be within this bounds,
 * while {@link Polygon} features have their centroid within the bounds.
 * @param {Number} [options.num_vertices=10] options.vertices the number of vertices added
 * to polygon features.
 * @param {Number} [options.max_radial_length=10] the total number of decimal
 * degrees longitude or latitude that a polygon can extent outwards to
 * from its center.
 * @return {FeatureCollection} generated random features
 * @example
 * var points = turf.random('points', 100, {
 *   bbox: [-70, 40, -60, 60]
 * });
 *
 * //=points
 *
 * var polygons = turf.random('polygons', 4, {
 *   bbox: [-70, 40, -60, 60]
 * });
 *
 * //=polygons
 */
module.exports = function (type, count, options) {
    options = options || {};
    count = count || 1;
    switch (type) {
    case 'point':
    case 'points':
    case undefined:
        return random.point(count, options.bbox);
    case 'polygon':
    case 'polygons':
        return random.polygon(
                count,
                options.num_vertices,
                options.max_radial_length,
                options.bbox);
    default:
        throw new Error('Unknown type given: valid options are points and polygons');
    }
};

},{"geojson-random":11}],61:[function(require,module,exports){
// http://stackoverflow.com/questions/11935175/sampling-a-random-subset-from-an-array
var featureCollection = require('turf-helpers').featureCollection;

/**
 * Takes a {@link FeatureCollection} and returns a FeatureCollection with given number of {@link Feature|features} at random.
 *
 * @name sample
 * @param {FeatureCollection} features set of input features
 * @param {number} n number of features to select
 * @return {FeatureCollection} a FeatureCollection with `n` features
 * @example
 * var points = turf.random('points', 1000);
 *
 * //=points
 *
 * var sample = turf.sample(points, 10);
 *
 * //=sample
 */
module.exports = function (fc, num) {
    var outFC = featureCollection(getRandomSubarray(fc.features, num));
    return outFC;
};

function getRandomSubarray(arr, size) {
    var shuffled = arr.slice(0), i = arr.length, min = i - size, temp, index;
    while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(min);
}

},{"turf-helpers":42}],62:[function(require,module,exports){
var simplify = require('simplify-js');

// supported GeoJSON geometries, used to check whether to wrap in simpleFeature()
var supportedTypes = ['LineString', 'MultiLineString', 'Polygon', 'MultiPolygon'];

/**
 * Takes a {@link LineString} or {@link Polygon} and returns a simplified version. Internally uses [simplify-js](http://mourner.github.io/simplify-js/) to perform simplification.
 *
 * @name simplify
 * @param {Feature<(LineString|Polygon|MultiLineString|MultiPolygon)>|FeatureCollection|GeometryCollection} feature feature to be simplified
 * @param {number} tolerance simplification tolerance
 * @param {boolean} highQuality whether or not to spend more time to create
 * a higher-quality simplification with a different algorithm
 * @return {Feature<(LineString|Polygon|MultiLineString|MultiPolygon)>|FeatureCollection|GeometryCollection} a simplified feature
 * @example
  * var feature = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Polygon",
 *     "coordinates": [[
 *       [-70.603637, -33.399918],
 *       [-70.614624, -33.395332],
 *       [-70.639343, -33.392466],
 *       [-70.659942, -33.394759],
 *       [-70.683975, -33.404504],
 *       [-70.697021, -33.419406],
 *       [-70.701141, -33.434306],
 *       [-70.700454, -33.446339],
 *       [-70.694274, -33.458369],
 *       [-70.682601, -33.465816],
 *       [-70.668869, -33.472117],
 *       [-70.646209, -33.473835],
 *       [-70.624923, -33.472117],
 *       [-70.609817, -33.468107],
 *       [-70.595397, -33.458369],
 *       [-70.587158, -33.442901],
 *       [-70.587158, -33.426283],
 *       [-70.590591, -33.414248],
 *       [-70.594711, -33.406224],
 *       [-70.603637, -33.399918]
 *     ]]
 *   }
 * };

 * var tolerance = 0.01;
 *
 * var simplified = turf.simplify(
 *  feature, tolerance, false);
 *
 * //=feature
 *
 * //=simplified
 */
module.exports = function (feature, tolerance, highQuality) {
    if (feature.type === 'Feature') {
        return simpleFeature(
            simplifyHelper(feature, tolerance, highQuality),
            feature.properties);
    } else if (feature.type === 'FeatureCollection') {
        return {
            type: 'FeatureCollection',
            features: feature.features.map(function (f) {
                var simplified = simplifyHelper(f, tolerance, highQuality);

                // we create simpleFeature here because it doesn't apply to GeometryCollection
                // so we can't create it at simplifyHelper()
                if (supportedTypes.indexOf(simplified.type) > -1) {
                    return simpleFeature(simplified, f.properties);
                } else {
                    return simplified;
                }
            })
        };
    } else if (feature.type === 'GeometryCollection') {
        return {
            type: 'GeometryCollection',
            geometries: feature.geometries.map(function (g) {
                if (supportedTypes.indexOf(g.type) > -1) {
                    return simplifyHelper({
                        type: 'Feature',
                        geometry: g
                    }, tolerance, highQuality);
                }
                return g;
            })
        };
    } else {
        return feature;
    }
};


function simplifyHelper(feature, tolerance, highQuality) {
    if (feature.geometry.type === 'LineString') {
        return {
            type: 'LineString',
            coordinates: simplifyLine(feature.geometry.coordinates, tolerance, highQuality)
        };
    } else if (feature.geometry.type === 'MultiLineString') {
        return {
            type: 'MultiLineString',
            coordinates: feature.geometry.coordinates.map(function (lines) {
                return simplifyLine(lines, tolerance, highQuality);
            })
        };
    } else if (feature.geometry.type === 'Polygon') {
        return {
            type: 'Polygon',
            coordinates: simplifyPolygon(feature.geometry.coordinates, tolerance, highQuality)
        };
    } else if (feature.geometry.type === 'MultiPolygon') {
        return {
            type: 'MultiPolygon',
            coordinates: feature.geometry.coordinates.map(function (rings) {
                return simplifyPolygon(rings, tolerance, highQuality);
            })
        };
    } else {
        // unsupported geometry type supplied
        return feature;
    }
}

/*
* returns true if ring's first coordinate is the same as its last
*/
function checkValidity(ring) {
    if (ring.length < 3) {
        return false;
    //if the last point is the same as the first, it's not a triangle
    } else if (ring.length === 3 &&
      ((ring[2][0] === ring[0][0]) && (ring[2][1] === ring[0][1]))) {
        return false;
    } else {
        return true;
    }
}

function simpleFeature(geom, properties) {
    return {
        type: 'Feature',
        geometry: geom,
        properties: properties
    };
}

function simplifyLine(coordinates, tolerance, highQuality) {
    return simplify(coordinates.map(function (coord) {
        return {x: coord[0], y: coord[1]};
    }), tolerance, highQuality).map(function (coords) {
        return [coords.x, coords.y];
    });
}

function simplifyPolygon(coordinates, tolerance, highQuality) {
    return coordinates.map(function (ring) {
        var pts = ring.map(function (coord) {
            return {x: coord[0], y: coord[1]};
        });
        if (pts.length < 4) {
            throw new Error('Invalid polygon');
        }
        var simpleRing = simplify(pts, tolerance, highQuality).map(function (coords) {
            return [coords.x, coords.y];
        });
        //remove 1 percent of tolerance until enough points to make a triangle
        while (!checkValidity(simpleRing)) {
            tolerance -= tolerance * 0.01;
            simpleRing = simplify(pts, tolerance, highQuality).map(function (coords) {
                return [coords.x, coords.y];
            });
        }
        if (
            (simpleRing[simpleRing.length - 1][0] !== simpleRing[0][0]) ||
                (simpleRing[simpleRing.length - 1][1] !== simpleRing[0][1])) {
            simpleRing.push(simpleRing[0]);
        }
        return simpleRing;
    });
}

},{"simplify-js":20}],63:[function(require,module,exports){
var featurecollection = require('turf-helpers').featureCollection;
var point = require('turf-helpers').point;
var polygon = require('turf-helpers').polygon;
var distance = require('turf-distance');

/**
 * Takes a bounding box and a cell depth and returns a set of square {@link Polygon|polygons} in a grid.
 *
 * @name squareGrid
 * @param {Array<number>} extent extent in [minX, minY, maxX, maxY] order
 * @param {number} cellWidth width of each cell
 * @param {string} units units to use for cellWidth
 * @return {FeatureCollection<Polygon>} grid a grid of polygons
 * @example
 * var extent = [-77.3876953125,38.71980474264239,-76.9482421875,39.027718840211605];
 * var cellWidth = 10;
 * var units = 'miles';
 *
 * var squareGrid = turf.squareGrid(extent, cellWidth, units);
 *
 * //=squareGrid
 */
module.exports = function squareGrid(bbox, cell, units) {
    var fc = featurecollection([]);
    var xFraction = cell / (distance(point([bbox[0], bbox[1]]), point([bbox[2], bbox[1]]), units));
    var cellWidth = xFraction * (bbox[2] - bbox[0]);
    var yFraction = cell / (distance(point([bbox[0], bbox[1]]), point([bbox[0], bbox[3]]), units));
    var cellHeight = yFraction * (bbox[3] - bbox[1]);

    var currentX = bbox[0];
    while (currentX <= bbox[2]) {
        var currentY = bbox[1];
        while (currentY <= bbox[3]) {
            var cellPoly = polygon([[
                [currentX, currentY],
                [currentX, currentY + cellHeight],
                [currentX + cellWidth, currentY + cellHeight],
                [currentX + cellWidth, currentY],
                [currentX, currentY]
            ]]);
            fc.features.push(cellPoly);

            currentY += cellHeight;
        }
        currentX += cellWidth;
    }

    return fc;
};

},{"turf-distance":37,"turf-helpers":42}],64:[function(require,module,exports){
var distance = require('turf-distance');

/**
 * Takes a bounding box and calculates the minimum square bounding box that
 * would contain the input.
 *
 * @name square
 * @param {Array<number>} bbox a bounding box
 * @return {Array<number>} a square surrounding `bbox`
 * @example
 * var bbox = [-20,-20,-15,0];
 *
 * var squared = turf.square(bbox);
 *
 * var features = {
 *   "type": "FeatureCollection",
 *   "features": [
 *     turf.bboxPolygon(bbox),
 *     turf.bboxPolygon(squared)
 *   ]
 * };
 *
 * //=features
 */
module.exports = function (bbox) {
    var horizontalDistance = distance(bbox.slice(0, 2), [bbox[2], bbox[1]], 'miles');
    var verticalDistance = distance(bbox.slice(0, 2), [bbox[0], bbox[3]], 'miles');
    if (horizontalDistance >= verticalDistance) {
        var verticalMidpoint = (bbox[1] + bbox[3]) / 2;
        return [
            bbox[0],
            verticalMidpoint - ((bbox[2] - bbox[0]) / 2),
            bbox[2],
            verticalMidpoint + ((bbox[2] - bbox[0]) / 2)
        ];
    } else {
        var horizontalMidpoint = (bbox[0] + bbox[2]) / 2;
        return [
            horizontalMidpoint - ((bbox[3] - bbox[1]) / 2),
            bbox[1],
            horizontalMidpoint + ((bbox[3] - bbox[1]) / 2),
            bbox[3]
        ];
    }
};

},{"turf-distance":37}],65:[function(require,module,exports){
var inside = require('turf-inside');

/**
 * Takes a set of {@link Point|points} and a set of {@link Polygon|polygons} and performs a spatial join.
 *
 * @name tag
 * @param {FeatureCollection<Point>} points input points
 * @param {FeatureCollection<Polygon>} polygons input polygons
 * @param {string} polyId property in `polygons` to add to joined Point features
 * @param {string} containingPolyId property in `points` in which to store joined property from `polygons
 * @return {FeatureCollection<Point>} points with `containingPolyId` property containing values from `polyId`
 * @example
 * var bbox = [0, 0, 10, 10];
 * // create a triangular grid of polygons
 * var triangleGrid = turf.triangleGrid(bbox, 50, 'miles');
 * triangleGrid.features.forEach(function(f) {
 *   f.properties.fill = '#' +
 *     (~~(Math.random() * 16)).toString(16) +
 *     (~~(Math.random() * 16)).toString(16) +
 *     (~~(Math.random() * 16)).toString(16);
 *   f.properties.stroke = 0;
 *   f.properties['fill-opacity'] = 1;
 * });
 * var randomPoints = turf.random('point', 30, {
 *   bbox: bbox
 * });
 * var both = turf.featurecollection(
 *   triangleGrid.features.concat(randomPoints.features));
 *
 * //=both
 *
 * var tagged = turf.tag(randomPoints, triangleGrid,
 *                       'fill', 'marker-color');
 *
 * //=tagged
 */
module.exports = function (points, polygons, field, outField) {
    // prevent mutations
    points = JSON.parse(JSON.stringify(points));
    polygons = JSON.parse(JSON.stringify(polygons));
    points.features.forEach(function (pt) {
        if (!pt.properties) {
            pt.properties = {};
        }
        polygons.features.forEach(function (poly) {
            if (pt.properties[outField] === undefined) {
                var isInside = inside(pt, poly);
                if (isInside) {
                    pt.properties[outField] = poly.properties[field];
                }
            }
        });
    });
    return points;
};

},{"turf-inside":44}],66:[function(require,module,exports){
var polygon = require('turf-helpers').polygon;
var earcut = require('earcut');

/**
 * Tesselates a {@link Feature<Polygon>} into a {@link FeatureCollection<Polygon>} of triangles
 * using [earcut](https://github.com/mapbox/earcut).
 *
 * @name tesselate
 * @param {Feature<Polygon>} polygon the polygon to tesselate
 * @returns {FeatureCollection<Polygon>} a geometrycollection feature
 * @example
 * var polygon = {"type":"Feature","id":"USA-CA","properties":{"name":"California"},"geometry":{"type":"Polygon","coordinates":[[[-123.233256,42.006186],[-122.378853,42.011663],[-121.037003,41.995232],[-120.001861,41.995232],[-119.996384,40.264519],[-120.001861,38.999346],[-118.71478,38.101128],[-117.498899,37.21934],[-116.540435,36.501861],[-115.85034,35.970598],[-114.634459,35.00118],[-114.634459,34.87521],[-114.470151,34.710902],[-114.333228,34.448009],[-114.136058,34.305608],[-114.256551,34.174162],[-114.415382,34.108438],[-114.535874,33.933176],[-114.497536,33.697668],[-114.524921,33.54979],[-114.727567,33.40739],[-114.661844,33.034958],[-114.524921,33.029481],[-114.470151,32.843265],[-114.524921,32.755634],[-114.72209,32.717295],[-116.04751,32.624187],[-117.126467,32.536556],[-117.24696,32.668003],[-117.252437,32.876127],[-117.329114,33.122589],[-117.471515,33.297851],[-117.7837,33.538836],[-118.183517,33.763391],[-118.260194,33.703145],[-118.413548,33.741483],[-118.391641,33.840068],[-118.566903,34.042715],[-118.802411,33.998899],[-119.218659,34.146777],[-119.278905,34.26727],[-119.558229,34.415147],[-119.875891,34.40967],[-120.138784,34.475393],[-120.472878,34.448009],[-120.64814,34.579455],[-120.609801,34.858779],[-120.670048,34.902595],[-120.631709,35.099764],[-120.894602,35.247642],[-120.905556,35.450289],[-121.004141,35.461243],[-121.168449,35.636505],[-121.283465,35.674843],[-121.332757,35.784382],[-121.716143,36.195153],[-121.896882,36.315645],[-121.935221,36.638785],[-121.858544,36.6114],[-121.787344,36.803093],[-121.929744,36.978355],[-122.105006,36.956447],[-122.335038,37.115279],[-122.417192,37.241248],[-122.400761,37.361741],[-122.515777,37.520572],[-122.515777,37.783465],[-122.329561,37.783465],[-122.406238,38.15042],[-122.488392,38.112082],[-122.504823,37.931343],[-122.701993,37.893004],[-122.937501,38.029928],[-122.97584,38.265436],[-123.129194,38.451652],[-123.331841,38.566668],[-123.44138,38.698114],[-123.737134,38.95553],[-123.687842,39.032208],[-123.824765,39.366301],[-123.764519,39.552517],[-123.85215,39.831841],[-124.109566,40.105688],[-124.361506,40.259042],[-124.410798,40.439781],[-124.158859,40.877937],[-124.109566,41.025814],[-124.158859,41.14083],[-124.065751,41.442061],[-124.147905,41.715908],[-124.257444,41.781632],[-124.213628,42.000709],[-123.233256,42.006186]]]}};
 *
 * var triangles = turf.tesselate(polygon);
 *
 * //=triangles
 */

module.exports = function (poly) {
    if (!poly.geometry || (poly.geometry.type !== 'Polygon' && poly.geometry.type !== 'MultiPolygon')) {
        throw new Error('input must be a Polygon or MultiPolygon');
    }

    var fc = {type: 'FeatureCollection', features: []};

    if (poly.geometry.type === 'Polygon') {
        fc.features = processPolygon(poly.geometry.coordinates);
    } else {
        poly.geometry.coordinates.forEach(function (coordinates) {
            fc.features = fc.features.concat(processPolygon(coordinates));
        });
    }

    return fc;
};

function processPolygon(coordinates) {
    var data = flattenCoords(coordinates);
    var dim = 2;
    var result = earcut(data.vertices, data.holes, dim);

    var features = [];
    var vertices = [];

    result.forEach(function (vert, i) {
        var index = result[i];
        vertices.push([data.vertices[index * dim], data.vertices[index * dim + 1]]);
    });

    for (var i = 0; i < vertices.length; i += 3) {
        var coords = vertices.slice(i, i + 3);
        coords.push(vertices[i]);
        features.push(polygon([coords]));
    }

    return features;
}

function flattenCoords(data) {
    var dim = data[0][0].length,
        result = {vertices: [], holes: [], dimensions: dim},
        holeIndex = 0;

    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].length; j++) {
            for (var d = 0; d < dim; d++) result.vertices.push(data[i][j][d]);
        }
        if (i > 0) {
            holeIndex += data[i - 1].length;
            result.holes.push(holeIndex);
        }
    }

    return result;
}

},{"earcut":8,"turf-helpers":42}],67:[function(require,module,exports){
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
 * @param {String=} propertyName name of the property from which to pull z values
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

},{"turf-helpers":42}],68:[function(require,module,exports){
var featurecollection = require('turf-helpers').featureCollection;
var polygon = require('turf-helpers').polygon;
var distance = require('turf-distance');

/**
 * Takes a bounding box and a cell depth and returns a set of triangular {@link Polygon|polygons} in a grid.
 *
 * @name triangleGrid
 * @param {Array<number>} extent extent in [minX, minY, maxX, maxY] order
 * @param {number} cellWidth width of each cell
 * @param {string} units units to use for cellWidth
 * @return {FeatureCollection<Polygon>} grid of polygons
 * @example
 * var extent = [-77.3876953125,38.71980474264239,-76.9482421875,39.027718840211605];
 * var cellWidth = 10;
 * var units = 'miles';
 *
 * var triangleGrid = turf.triangleGrid(extent, cellWidth, units);
 *
 * //=triangleGrid
 */
module.exports = function (bbox, cell, units) {
    var fc = featurecollection([]);
    var xFraction = cell / (distance([bbox[0], bbox[1]], [bbox[2], bbox[1]], units));
    var cellWidth = xFraction * (bbox[2] - bbox[0]);
    var yFraction = cell / (distance([bbox[0], bbox[1]], [bbox[0], bbox[3]], units));
    var cellHeight = yFraction * (bbox[3] - bbox[1]);

    var xi = 0;
    var currentX = bbox[0];
    while (currentX <= bbox[2]) {
        var yi = 0;
        var currentY = bbox[1];
        while (currentY <= bbox[3]) {
            if (xi % 2 === 0 && yi % 2 === 0) {
                fc.features.push(polygon([[
                    [currentX, currentY],
                    [currentX, currentY + cellHeight],
                    [currentX + cellWidth, currentY],
                    [currentX, currentY]
                ]]), polygon([[
                    [currentX, currentY + cellHeight],
                    [currentX + cellWidth, currentY + cellHeight],
                    [currentX + cellWidth, currentY],
                    [currentX, currentY + cellHeight]
                ]]));
            } else if (xi % 2 === 0 && yi % 2 === 1) {
                fc.features.push(polygon([[
                    [currentX, currentY],
                    [currentX + cellWidth, currentY + cellHeight],
                    [currentX + cellWidth, currentY],
                    [currentX, currentY]
                ]]), polygon([[
                    [currentX, currentY],
                    [currentX, currentY + cellHeight],
                    [currentX + cellWidth, currentY + cellHeight],
                    [currentX, currentY]
                ]]));
            } else if (yi % 2 === 0 && xi % 2 === 1) {
                fc.features.push(polygon([[
                    [currentX, currentY],
                    [currentX, currentY + cellHeight],
                    [currentX + cellWidth, currentY + cellHeight],
                    [currentX, currentY]
                ]]), polygon([[
                    [currentX, currentY],
                    [currentX + cellWidth, currentY + cellHeight],
                    [currentX + cellWidth, currentY],
                    [currentX, currentY]
                ]]));
            } else if (yi % 2 === 1 && xi % 2 === 1) {
                fc.features.push(polygon([[
                    [currentX, currentY],
                    [currentX, currentY + cellHeight],
                    [currentX + cellWidth, currentY],
                    [currentX, currentY]
                ]]), polygon([[
                    [currentX, currentY + cellHeight],
                    [currentX + cellWidth, currentY + cellHeight],
                    [currentX + cellWidth, currentY],
                    [currentX, currentY + cellHeight]
                ]]));
            }
            currentY += cellHeight;
            yi++;
        }
        xi++;
        currentX += cellWidth;
    }
    return fc;
};


},{"turf-distance":37,"turf-helpers":42}],69:[function(require,module,exports){
// look here for help http://svn.osgeo.org/grass/grass/branches/releasebranch_6_4/vector/v.overlay/main.c
//must be array of polygons

// depend on jsts for now https://github.com/bjornharrtell/jsts/blob/master/examples/overlay.html

var jsts = require('jsts');

/**
 * Takes two {@link Polygon|polygons} and returns a combined polygon. If the input polygons are not contiguous, this function returns a {@link MultiPolygon} feature.
 *
 * @name union
 * @param {Feature<Polygon>} poly1 input polygon
 * @param {Feature<Polygon>} poly2 another input polygon
 * @return {Feature<(Polygon|MultiPolygon)>} a combined {@link Polygon} or {@link MultiPolygon} feature
 * @example
 * var poly1 = {
 *   "type": "Feature",
 *   "properties": {
 *     "fill": "#0f0"
 *   },
 *   "geometry": {
 *     "type": "Polygon",
 *     "coordinates": [[
 *       [-82.574787, 35.594087],
 *       [-82.574787, 35.615581],
 *       [-82.545261, 35.615581],
 *       [-82.545261, 35.594087],
 *       [-82.574787, 35.594087]
 *     ]]
 *   }
 * };
 * var poly2 = {
 *   "type": "Feature",
 *   "properties": {
 *     "fill": "#00f"
 *   },
 *   "geometry": {
 *     "type": "Polygon",
 *     "coordinates": [[
 *       [-82.560024, 35.585153],
 *       [-82.560024, 35.602602],
 *       [-82.52964, 35.602602],
 *       [-82.52964, 35.585153],
 *       [-82.560024, 35.585153]
 *     ]]
 *   }
 * };
 * var polygons = {
 *   "type": "FeatureCollection",
 *   "features": [poly1, poly2]
 * };
 *
 * var union = turf.union(poly1, poly2);
 *
 * //=polygons
 *
 * //=union
 */
module.exports = function (poly1, poly2) {
    var reader = new jsts.io.GeoJSONReader();
    var a = reader.read(JSON.stringify(poly1.geometry));
    var b = reader.read(JSON.stringify(poly2.geometry));
    var union = a.union(b);
    var writer = new jsts.io.GeoJSONWriter();

    union = writer.write(union);
    return {
        type: 'Feature',
        geometry: union,
        properties: poly1.properties
    };
};

},{"jsts":13}],70:[function(require,module,exports){
var inside = require('turf-inside');
var featureCollection = require('turf-helpers').featureCollection;

/**
 * Takes a set of {@link Point|points} and a set of {@link Polygon|polygons} and returns the points that fall within the polygons.
 *
 * @name within
 * @param {FeatureCollection<Point>} points input points
 * @param {FeatureCollection<Polygon>} polygons input polygons
 * @return {FeatureCollection<Point>} points that land within at least one polygon
 * @example
 * var searchWithin = {
 *   "type": "FeatureCollection",
 *   "features": [
 *     {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Polygon",
 *         "coordinates": [[
 *           [-46.653,-23.543],
 *           [-46.634,-23.5346],
 *           [-46.613,-23.543],
 *           [-46.614,-23.559],
 *           [-46.631,-23.567],
 *           [-46.653,-23.560],
 *           [-46.653,-23.543]
 *         ]]
 *       }
 *     }
 *   ]
 * };
 * var points = {
 *   "type": "FeatureCollection",
 *   "features": [
 *     {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-46.6318, -23.5523]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-46.6246, -23.5325]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-46.6062, -23.5513]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-46.663, -23.554]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-46.643, -23.557]
 *       }
 *     }
 *   ]
 * };
 *
 * var ptsWithin = turf.within(points, searchWithin);
 *
 * //=points
 *
 * //=searchWithin
 *
 * //=ptsWithin
 */
module.exports = function (ptFC, polyFC) {
    var pointsWithin = featureCollection([]);
    for (var i = 0; i < polyFC.features.length; i++) {
        for (var j = 0; j < ptFC.features.length; j++) {
            var isInside = inside(ptFC.features[j], polyFC.features[i]);
            if (isInside) {
                pointsWithin.features.push(ptFC.features[j]);
            }
        }
    }
    return pointsWithin;
};

},{"turf-helpers":42,"turf-inside":44}],71:[function(require,module,exports){
"use strict"

module.exports = twoProduct

var SPLITTER = +(Math.pow(2, 27) + 1.0)

function twoProduct(a, b, result) {
  var x = a * b

  var c = SPLITTER * a
  var abig = c - a
  var ahi = c - abig
  var alo = a - ahi

  var d = SPLITTER * b
  var bbig = d - b
  var bhi = d - bbig
  var blo = b - bhi

  var err1 = x - (ahi * bhi)
  var err2 = err1 - (alo * bhi)
  var err3 = err2 - (ahi * blo)

  var y = alo * blo - err3

  if(result) {
    result[0] = y
    result[1] = x
    return result
  }

  return [ y, x ]
}
},{}],72:[function(require,module,exports){
"use strict"

module.exports = fastTwoSum

function fastTwoSum(a, b, result) {
	var x = a + b
	var bv = x - a
	var av = x - bv
	var br = b - bv
	var ar = a - av
	if(result) {
		result[0] = ar + br
		result[1] = x
		return result
	}
	return [ar+br, x]
}
},{}],73:[function(require,module,exports){
"use strict"; "use restrict";

module.exports = UnionFind;

function UnionFind(count) {
  this.roots = new Array(count);
  this.ranks = new Array(count);
  
  for(var i=0; i<count; ++i) {
    this.roots[i] = i;
    this.ranks[i] = 0;
  }
}

var proto = UnionFind.prototype

Object.defineProperty(proto, "length", {
  "get": function() {
    return this.roots.length
  }
})

proto.makeSet = function() {
  var n = this.roots.length;
  this.roots.push(n);
  this.ranks.push(0);
  return n;
}

proto.find = function(x) {
  var x0 = x
  var roots = this.roots;
  while(roots[x] !== x) {
    x = roots[x]
  }
  while(roots[x0] !== x) {
    var y = roots[x0]
    roots[x0] = x
    x0 = y
  }
  return x;
}

proto.link = function(x, y) {
  var xr = this.find(x)
    , yr = this.find(y);
  if(xr === yr) {
    return;
  }
  var ranks = this.ranks
    , roots = this.roots
    , xd    = ranks[xr]
    , yd    = ranks[yr];
  if(xd < yd) {
    roots[xr] = yr;
  } else if(yd < xd) {
    roots[yr] = xr;
  } else {
    roots[yr] = xr;
    ++ranks[xr];
  }
}
},{}],74:[function(require,module,exports){
module.exports.RADIUS = 6378137;
module.exports.FLATTENING = 1/298.257223563;
module.exports.POLAR_RADIUS = 6356752.3142;

},{}]},{},[1])(1)
});