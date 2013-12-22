/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Combines {@link Geometry}s
 * to produce a {@link GeometryCollection} of the most appropriate type.
 * Input geometries which are already collections
 * will have their elements extracted first.
 * No validation of the result geometry is performed.
 * (The only case where invalidity is possible is where {@link Polygonal} geometries
 * are combined and result in a self-intersection).
 *
 * @see GeometryFactory#buildGeometry
 */



/**
 * Creates a new combiner for a collection of geometries
 *
 * @param {Array} geoms the geometries to combine.
 * @constructor
 */
jsts.geom.util.GeometryCombiner = function(geoms) {
  this.geomFactory = jsts.geom.util.GeometryCombiner.extractFactory(geoms);
  this.inputGeoms = geoms;
};


/**
 * Combines a collection of geometries.
 *
 * @param {ArrayList} geoms the geometries to combine.
 * @return {Geometry} the combined geometry.
 * @public
 */
jsts.geom.util.GeometryCombiner.combine = function(geoms) {
  if (arguments.length>1) return this.combine2.apply(this, arguments);
  var combiner = new jsts.geom.util.GeometryCombiner(geoms);
  return combiner.combine();
};


/**
 * Combines two or three geometries.
 *
 * @param {Geometry} g0 a geometry to combine.
 * @param {Geometry} g1 a geometry to combine.
 * @param {Geometry=} [g2] a geometry to combine.
 * @return {Geometry} the combined geometry.
 * @public
 */
jsts.geom.util.GeometryCombiner.combine2 = function() {
  var arrayList = new javascript.util.ArrayList();
  arguments.foreach(function(a) { arrayList.add(a); })

  var combiner = jsts.geom.util.GeometryCombiner(arrayList);
  return combiner.combine();
};


/**
 * @type {GeometryFactory}
 * @private
 */
jsts.geom.util.GeometryCombiner.prototype.geomFactory = null;


/**
 * @type {boolean}
 * @private
 */
jsts.geom.util.GeometryCombiner.prototype.skipEmpty = false;


/**
 * @type {Array}
 * @private
 */
jsts.geom.util.GeometryCombiner.prototype.inputGeoms;


/**
 * Extracts the GeometryFactory used by the geometries in a collection
 *
 * @param {Array} geoms
 * @return {jsts.geom.GeometryFactory} a GeometryFactory.
 * @public
 */
jsts.geom.util.GeometryCombiner.extractFactory = function(geoms) {
  if (geoms.isEmpty()) return null;
  return geoms.iterator().next().getFactory();
};


/**
 * Computes the combination of the input geometries
 * to produce the most appropriate {@link Geometry} or {@link GeometryCollection}
 *
 * @return {jsts.geom.Geometry} a Geometry which is the combination of the inputs.
 * @public
 */
jsts.geom.util.GeometryCombiner.prototype.combine = function() {
    var elems = new javascript.util.ArrayList(), i;
  	for (i = this.inputGeoms.iterator(); i.hasNext(); ) {
        var g = i.next();
        this.extractElements(g, elems);
  	}
    
    if (elems.size() === 0) {
    	if (this.geomFactory !== null) {
            // return an empty GC
            return geomFactory.createGeometryCollection(null);
    	}
    	return null;
    }
    // return the "simplest possible" geometry
    return this.geomFactory.buildGeometry(elems);
};


/**
 * @param {jsts.geom.Geometry} geom
 * @param {Array} elems
 * @private
 */
jsts.geom.util.GeometryCombiner.prototype.extractElements = function(geom, elems) {
  if (geom === null) {
    return;
  }

  for (var i = 0; i < geom.getNumGeometries(); i++) {
    var elemGeom = geom.getGeometryN(i);
    if (this.skipEmpty && elemGeom.isEmpty()) {
      continue;
    }
    elems.add(elemGeom);
  }
};
