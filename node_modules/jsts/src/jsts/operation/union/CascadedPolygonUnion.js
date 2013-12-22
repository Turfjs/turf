/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */
/**
 * Provides an efficient method of unioning a collection of
 * {@link Polygonal} geometrys.
 * This algorithm is faster and likely more robust than
 * the simple iterated approach of
 * repeatedly unioning each polygon to a result geometry.
 * <p>
 * The <tt>buffer(0)</tt> trick is sometimes faster, but can be less robust and
 * can sometimes take an exceptionally long time to complete.
 * This is particularly the case where there is a high degree of overlap
 * between the polygons.  In this case, <tt>buffer(0)</tt> is forced to compute
 * with <i>all</i> line segments from the outset,
 * whereas cascading can eliminate many segments
 * at each stage of processing.
 * The best case for buffer(0) is the trivial case
 * where there is <i>no</i> overlap between the input geometries.
 * However, this case is likely rare in practice.
 *
 */



/**
 * Creates a new instance to union
 * the given collection of {@link Geometry}s.
 *
 * @param {Array.<jsts.geom.Geometry>} geoms a collection of {@link Polygonal} {@link Geometry}s.
 * @constructor
 */
jsts.operation.union.CascadedPolygonUnion = function(polys) {
  this.inputPolys = polys;
};


/**
 * Computes the union of
 * a collection of {@link Polygonal} {@link Geometry}s.
 *
 * @param {Array.<jsts.geom.Geometry>} polys a collection of {@link Polygonal} {@link Geometry}s.
 * @return {jsts.geom.Geometry}
 * @public
 */
jsts.operation.union.CascadedPolygonUnion.union = function(polys) {
  var op = new jsts.operation.union.CascadedPolygonUnion(polys);
  return op.union();
};


/**
 * @type {Array.<jsts.geom.Geometry>}
 */
jsts.operation.union.CascadedPolygonUnion.prototype.inputPolys;


/**
 * @type {jsts.geom.GeometryFactory}
 */
jsts.operation.union.CascadedPolygonUnion.prototype.geomFactory = null;


/**
 * The effectiveness of the index is somewhat sensitive
 * to the node capacity.
 * Testing indicates that a smaller capacity is better.
 * For an STRtree, 4 is probably a good number (since
 * this produces 2x2 "squares").
 *
 * @type {number}
 * @const
 */
jsts.operation.union.CascadedPolygonUnion.prototype.STRTREE_NODE_CAPACITY = 4;


/**
 * Computes the union of the input geometries.
 *
 * @return {?jsts.geom.Geometry} the union of the input geometries, null if no input geometries were provided.
 * @public
 */
jsts.operation.union.CascadedPolygonUnion.prototype.union = function() {
  if (this.inputPolys.length === 0) {
    return null;
  }
  this.geomFactory = this.inputPolys[0].getFactory();

  /**
   * A spatial index to organize the collection
   * into groups of close geometries.
   * This makes unioning more efficient, since vertices are more likely
   * to be eliminated on each round.
   */

  var index = new jsts.index.strtree.STRtree(this.STRTREE_NODE_CAPACITY);
  for (var i = 0, l = this.inputPolys.length; i < l; i++) {
    var item = this.inputPolys[i];
    index.insert(item.getEnvelopeInternal(), item);
  }
  var itemTree = index.itemsTree();
  var unionAll = this.unionTree(itemTree);
  return unionAll;
};


/**
 *
 * @param {Array.<jsts.geom.Geometry>} geomTree
 * @return {jsts.geom.Geometry}
 * @private
 */
jsts.operation.union.CascadedPolygonUnion.prototype.unionTree = function(geomTree) {
  /**
   * Recursively unions all subtrees in the list into single geometries.
   * The result is a list of Geometrys only
   */
  var geoms = this.reduceToGeometries(geomTree);
  var union = this.bindayUnion(geoms);
  return union;
};


//TODO: Implement experimental methods?


/**
 * Unions a list of geometries
 * by treating the list as a flattened binary tree,
 * and performing a cascaded union on the tree.
 *
 * Unions a section of a list using a recursive binary union on each half
 * of the section.
 *
 * @param {Array.<jsts.geom.Geometry>} geoms
 * @param {number=} [start].
 * @param {number=} [end].
 * @return {jsts.geom.Geometry} the union of the list section.
 * @private
 */
jsts.operation.union.CascadedPolygonUnion.prototype.binaryUnion = function(geoms, start, end) {
  start = start || 0;
  end = end || geoms.length;

  if (end - start <= 1) {
    var g0 = this.getGeometry(geoms, start);
    return this.unionSafe(g0, null);
  }
  else if (end - start === 2) {
    return this.unionSafe(this.getGeometry(geoms, start), this.getGeometry(geoms, start + 1));
  }
  else {
    // recurse on both halves of the list
    var mid = (end + start) / 2;
    var g0 = this.binaryUnion(geoms, start, mid);
    var g1 = this.binaryUnion(geoms, mid, end);
    return this.unionSafe(g0, g1);
  }
};


/**
 *
 * @param {Array.<jsts.geom.Geometry>} list
 * @param {number} index
 * @return {jsts.geom.Geometry}
 * @private
 */
jsts.operation.union.CascadedPolygonUnion.getGeometry = function(list, index) {
  if (index >= list.length) {
    return null;
  }
  return list[i];
};


/**
 * Reduces a tree of geometries to a list of geometries
 * by recursively unioning the subtrees in the list.
 *
 * @param {Array} geomTree a tree-structured list of geometries.
 * @return {Array.<jsts.geom.Geometry>} a list of Geometrys.
 * @private
 */
jsts.operation.union.CascadedPolygonUnion.prototype.reduceToGeometries = function(geomTree) {
  var geoms = [];
  for (var i = 0, l = geomTree.length; i < l; i++) {
    var o = geomTree[i],
        geom = null;
    if (o instanceof Array) {
      geom = this.unionTree(o);
    }
    else if (o instanceof jsts.geom.Geometry) {
      geom = o;
    }
    geoms.push(geom);
  }
  return geoms;
};


/**
 * Computes the union of two geometries,
 * either of both of which may be null.
 *
 * @param {jsts.geom.Geometry} g0 a Geometry.
 * @param {jsts.geom.Geometry} g1 a Geometry.
 * @return {?jsts.geom.Geometry} the union of the input(s),
 *                               null if both inputs are null.
 * @private
 */
jsts.operation.union.CascadedPolygonUnion.prototype.unionSafe = function(g0, g1) {
  if (g0 === null && g1 === null) {
    return null;
  }
  if (g0 === null) {
    return g1.clone();
  }
  if (g1 === null) {
    return g0.clone();
  }

  //what if both are null?  Maybe return empty GC?

  return unionOptimized(g0, g1);
};


/**
 * @param {jsts.geom.Geometry} g0 a Geometry.
 * @param {jsts.geom.Geometry} g1 a Geometry.
 * @return {jsts.geom.Geometry} the union of the input(s).
 * @private
 */
jsts.operation.union.CascadedPolygonUnion.prototype.unionOptimized = function(g0, g1) {
  var g0Env = g0.getEnvelopeInternal(),
      g1Env = g1.getEnvelopeInternal();

  if (!g0Env.intersects(g1Env)) {
    var combo = jsts.geom.util.GeometryCombiner.combine(g0, g1);
    return combo;
  }

  if (g0.getNumGeometries <= 1 && g1.getNumGeometries <= 1) {
    return this.unionActual(g0, g1);
  }

  var commonEnv = g0Env.intersection(g1Env);
  return this.unionUsingEnvelopeIntersection(g0, g1, commonEnv);
};


/**
 * Unions two polygonal geometries.
 * The case of MultiPolygons is optimized to union only
 * the polygons which lie in the intersection of the two geometry's envelopes.
 * Polygons outside this region can simply be combined with the union result,
 * which is potentially much faster.
 * This case is likely to occur often during cascaded union, and may also
 * occur in real world data (such as unioning data for parcels on different street blocks).
 *
 * @param {jsts.geom.Geometry} g0 a polygonal geometry.
 * @param {jsts.geom.Geometry} g1 a polygonal geometry.
 * @param {jsts.geom.Envelope} common the intersection of the envelopes of the inputs.
 * @return {jsts.geom.Geometry} the union of the inputs.
 * @private
 */
jsts.operation.union.CascadedPolygonUnion.prototype.unionUsingEnvelopeIntersection = function(g0, g1, common) {
  var disjointPolys = [];
  var g0Int = this.extractByEnvelope(common, g0, disjointPolys);
  var g1Int = this.extractByEnvelope(common, g1, disjointPolys);

  var union = this.unionActual(g0Int, g1Int);

  disjointPolys.push(union);
  var overallUnion = jsts.geom.util.GeometryCombiner.combine(disjointPolys);

  return overallUnion;
};


/**
 *
 * @param {jsts.geom.Envelope} env
 * @param {jsts.geom.Geometry} geom
 * @param {Array.<jsts.geom.Geometry>} disjointGeoms
 * @return {jsts.geom.Geometry}
 * @private
 */
jsts.operation.union.CascadedPolygonUnion.prototype.extractByEnvelope = function(env, geom, disjointGeoms) {
  var intersectingGeoms = [];

  for (var i = 0; i < geom.getNumGeometries(); i++) {
    var elem = geom.getGeometryN(i);
    if (elem.getEnvelopeInternal().intersects(env)) {
      intersectingGeoms.push(elem);
    }
    else {
      disjointGeoms.add(elem);
    }
  }

  return this.geomFactory.buildGeometry(intersectingGeoms);
};


/**
 * Encapsulates the actual unioning of two polygonal geometries.
 *
 * @param {jsts.geom.Geometry} g0
 * @param {jsts.geom.Geometry} g1
 * @return {jsts.geom.Geometry}
 * @private
 */
jsts.operation.union.CascadedPolygonUnion.prototype.unionActual = function(g0, g1) {
  return g0.union(g1);
};
