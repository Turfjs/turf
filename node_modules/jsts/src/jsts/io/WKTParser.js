/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 *
 * This file incorporates work covered by the following copyright and
 * permission notice:
 *
 * Copyright (c) 2006-2011 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the Clear BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license.
 */

/**
 * Class for reading and writing Well-Known Text.
 *
 * NOTE: Adapted from OpenLayers 2.11 implementation.
 */

/**
 * Create a new parser for WKT
 * 
 * @param {}
 *          geometryFactory
 * @return An instance of WKTParser.
 */
jsts.io.WKTParser = function(geometryFactory) {
  this.geometryFactory = geometryFactory || new jsts.geom.GeometryFactory();

  this.regExes = {
    'typeStr': /^\s*(\w+)\s*\(\s*(.*)\s*\)\s*$/,
    'emptyTypeStr': /^\s*(\w+)\s*EMPTY\s*$/,
    'spaces': /\s+/,
    'parenComma': /\)\s*,\s*\(/,
    'doubleParenComma': /\)\s*\)\s*,\s*\(\s*\(/, // can't use {2} here
    'trimParens': /^\s*\(?(.*?)\)?\s*$/
  };
};


/**
 * Deserialize a WKT string and return a geometry. Supports WKT for POINT,
 * MULTIPOINT, LINESTRING, LINEARRING, MULTILINESTRING, POLYGON, MULTIPOLYGON,
 * and GEOMETRYCOLLECTION.
 * 
 * @param {String}
 *          wkt A WKT string.
 * @return {jsts.geom.Geometry} A geometry instance.
 */
jsts.io.WKTParser.prototype.read = function(wkt) {
  var geometry, type, str;
  wkt = wkt.replace(/[\n\r]/g, ' ');
  var matches = this.regExes.typeStr.exec(wkt);
  if (wkt.search('EMPTY') !== -1) {
    matches = this.regExes.emptyTypeStr.exec(wkt);
    matches[2] = undefined;
  }
  if (matches) {
    type = matches[1].toLowerCase();
    str = matches[2];
    if (this.parse[type]) {
      geometry = this.parse[type].apply(this, [str]);
    }
  }

  if (geometry === undefined)
    throw new Error('Could not parse WKT ' + wkt);

  return geometry;
};

/**
 * Serialize a geometry into a WKT string.
 * 
 * @param {jsts.geom.Geometry}
 *          geometry A feature or array of features.
 * @return {String} The WKT string representation of the input geometries.
 */
jsts.io.WKTParser.prototype.write = function(geometry) {
  return this.extractGeometry(geometry);
};

/**
 * Entry point to construct the WKT for a single Geometry object.
 * 
 * @param {jsts.geom.Geometry}
 *          geometry
 * 
 * @return {String} A WKT string of representing the geometry.
 */
jsts.io.WKTParser.prototype.extractGeometry = function(geometry) {
  var type = geometry.CLASS_NAME.split('.')[2].toLowerCase();
  if (!this.extract[type]) {
    return null;
  }
  var wktType = type.toUpperCase();
  var data;
  if (geometry.isEmpty()) {
    data = wktType + ' EMPTY';
  } else {
    data = wktType + '(' + this.extract[type].apply(this, [geometry]) + ')';
  }
  return data;
};

/**
 * Object with properties corresponding to the geometry types. Property values
 * are functions that do the actual data extraction.
 */
jsts.io.WKTParser.prototype.extract = {
  'coordinate': function(coordinate) {
    return coordinate.x + ' ' + coordinate.y;
  },

  /**
   * Return a space delimited string of point coordinates.
   * 
   * @param {jsts.geom.Point}
   *          point
   * @return {String} A string of coordinates representing the point.
   */
  'point': function(point) {
    return point.coordinate.x + ' ' + point.coordinate.y;
  },

  /**
   * Return a comma delimited string of point coordinates from a multipoint.
   * 
   * @param {jsts.geom.MultiPoint>}
   *          multipoint
   * @return {String} A string of point coordinate strings representing the
   *         multipoint.
   */
  'multipoint': function(multipoint) {
    var array = [];
    for ( var i = 0, len = multipoint.geometries.length; i < len; ++i) {
      array.push('(' +
          this.extract.point.apply(this, [multipoint.geometries[i]]) + ')');
    }
    return array.join(',');
  },

  /**
   * Return a comma delimited string of point coordinates from a line.
   * 
   * @param {jsts.geom.LineString>}
   *          linestring
   * @return {String} A string of point coordinate strings representing the
   *         linestring.
   */
  'linestring': function(linestring) {
    var array = [];
    for ( var i = 0, len = linestring.points.length; i < len; ++i) {
      array.push(this.extract.coordinate.apply(this, [linestring.points[i]]));
    }
    return array.join(',');
  },

  /**
   * Return a comma delimited string of linestring strings from a
   * multilinestring.
   * 
   * @param {jsts.geom.MultiLineString>}
   *          multilinestring
   * @return {String} A string of of linestring strings representing the
   *         multilinestring.
   */
  'multilinestring': function(multilinestring) {
    var array = [];
    for ( var i = 0, len = multilinestring.geometries.length; i < len; ++i) {
      array.push('(' +
          this.extract.linestring.apply(this, [multilinestring.geometries[i]]) +
          ')');
    }
    return array.join(',');
  },

  /**
   * Return a comma delimited string of linear ring arrays from a polygon.
   * 
   * @param {jsts.geom.Polygon>}
   *          polygon
   * @return {String} An array of linear ring arrays representing the polygon.
   */
  'polygon': function(polygon) {
    var array = [];
    array.push('(' + this.extract.linestring.apply(this, [polygon.shell]) + ')');
    for ( var i = 0, len = polygon.holes.length; i < len; ++i) {
      array.push('(' + this.extract.linestring.apply(this, [polygon.holes[i]]) + ')');
    }
    return array.join(',');
  },

  /**
   * Return an array of polygon arrays from a multipolygon.
   * 
   * @param {jsts.geom.MultiPolygon>}
   *          multipolygon
   * @return {String} An array of polygon arrays representing the multipolygon.
   */
  'multipolygon': function(multipolygon) {
    var array = [];
    for ( var i = 0, len = multipolygon.geometries.length; i < len; ++i) {
      array.push('(' + this.extract.polygon.apply(this, [multipolygon.geometries[i]]) + ')');
    }
    return array.join(',');
  },

  /**
   * Return the WKT portion between 'GEOMETRYCOLLECTION(' and ')' for an
   * geometrycollection.
   * 
   * @param {jsts.geom.GeometryCollection>}
   *          collection
   * @return {String} internal WKT representation of the collection.
   */
  'geometrycollection': function(collection) {
    var array = [];
    for ( var i = 0, len = collection.geometries.length; i < len; ++i) {
      array.push(this.extractGeometry.apply(this, [collection.geometries[i]]));
    }
    return array.join(',');
  }

};

/**
 * Object with properties corresponding to the geometry types. Property values
 * are functions that do the actual parsing.
 */
jsts.io.WKTParser.prototype.parse = {
  /**
   * Return point geometry given a point WKT fragment.
   * 
   * @param {String}
   *          str A WKT fragment representing the point.
   * @return {jsts.geom.Point} A point geometry.
   * @private
   */
  'point': function(str) {
    if (str === undefined) {
      return this.geometryFactory.createPoint(null);
    }

    var coords = str.trim().split(this.regExes.spaces);
    return this.geometryFactory.createPoint(new jsts.geom.Coordinate(coords[0],
        coords[1]));
  },

  /**
   * Return a multipoint geometry given a multipoint WKT fragment.
   * 
   * @param {String}
   *          A WKT fragment representing the multipoint.
   * @return {jsts.geom.Point} A multipoint feature.
   * @private
   */
  'multipoint': function(str) {
    if (str === undefined) {
      return this.geometryFactory.createMultiPoint(null);
    }

    var point;
    var points = str.trim().split(',');
    var components = [];
    for ( var i = 0, len = points.length; i < len; ++i) {
      point = points[i].replace(this.regExes.trimParens, '$1');
      components.push(this.parse.point.apply(this, [point]));
    }
    return this.geometryFactory.createMultiPoint(components);
  },

  /**
   * Return a linestring geometry given a linestring WKT fragment.
   * 
   * @param {String}
   *          A WKT fragment representing the linestring.
   * @return {jsts.geom.LineString} A linestring geometry.
   * @private
   */
  'linestring': function(str) {
    if (str === undefined) {
      return this.geometryFactory.createLineString(null);
    }

    var points = str.trim().split(',');
    var components = [];
    var coords;
    for ( var i = 0, len = points.length; i < len; ++i) {
      coords = points[i].trim().split(this.regExes.spaces);
      components.push(new jsts.geom.Coordinate(coords[0], coords[1]));
    }
    return this.geometryFactory.createLineString(components);
  },

  /**
   * Return a linearring geometry given a linearring WKT fragment.
   * 
   * @param {String}
   *          A WKT fragment representing the linearring.
   * @return {jsts.geom.LinearRing} A linearring geometry.
   * @private
   */
  'linearring': function(str) {
    if (str === undefined) {
      return this.geometryFactory.createLinearRing(null);
    }

    var points = str.trim().split(',');
    var components = [];
    var coords;
    for ( var i = 0, len = points.length; i < len; ++i) {
      coords = points[i].trim().split(this.regExes.spaces);
      components.push(new jsts.geom.Coordinate(coords[0], coords[1]));
    }
    return this.geometryFactory.createLinearRing(components);
  },

  /**
   * Return a multilinestring geometry given a multilinestring WKT fragment.
   * 
   * @param {String}
   *          A WKT fragment representing the multilinestring.
   * @return {jsts.geom.MultiLineString} A multilinestring geometry.
   * @private
   */
  'multilinestring': function(str) {
    if (str === undefined) {
      return this.geometryFactory.createMultiLineString(null);
    }

    var line;
    var lines = str.trim().split(this.regExes.parenComma);
    var components = [];
    for ( var i = 0, len = lines.length; i < len; ++i) {
      line = lines[i].replace(this.regExes.trimParens, '$1');
      components.push(this.parse.linestring.apply(this, [line]));
    }
    return this.geometryFactory.createMultiLineString(components);
  },

  /**
   * Return a polygon geometry given a polygon WKT fragment.
   * 
   * @param {String}
   *          A WKT fragment representing the polygon.
   * @return {jsts.geom.Polygon} A polygon geometry.
   * @private
   */
  'polygon': function(str) {
    if (str === undefined) {
      return this.geometryFactory.createPolygon(null);
    }

    var ring, linestring, linearring;
    var rings = str.trim().split(this.regExes.parenComma);
    var shell;
    var holes = [];
    for ( var i = 0, len = rings.length; i < len; ++i) {
      ring = rings[i].replace(this.regExes.trimParens, '$1');
      linestring = this.parse.linestring.apply(this, [ring]);
      linearring = this.geometryFactory.createLinearRing(linestring.points);
      if (i === 0) {
        shell = linearring;
      } else {
        holes.push(linearring);
      }

    }
    return this.geometryFactory.createPolygon(shell, holes);
  },

  /**
   * Return a multipolygon geometry given a multipolygon WKT fragment.
   * 
   * @param {String}
   *          A WKT fragment representing the multipolygon.
   * @return {jsts.geom.MultiPolygon} A multipolygon geometry.
   * @private
   */
  'multipolygon': function(str) {
    if (str === undefined) {
      return this.geometryFactory.createMultiPolygon(null);
    }

    var polygon;
    var polygons = str.trim().split(this.regExes.doubleParenComma);
    var components = [];
    for ( var i = 0, len = polygons.length; i < len; ++i) {
      polygon = polygons[i].replace(this.regExes.trimParens, '$1');
      components.push(this.parse.polygon.apply(this, [polygon]));
    }
    return this.geometryFactory.createMultiPolygon(components);
  },

  /**
   * Return a geometrycollection given a geometrycollection WKT fragment.
   * 
   * @param {String}
   *          A WKT fragment representing the geometrycollection.
   * @return {jsts.geom.GeometryCollection}
   * @private
   */
  'geometrycollection': function(str) {
    if (str === undefined) {
      return this.geometryFactory.createGeometryCollection(null);
    }

    // separate components of the collection with |
    str = str.replace(/,\s*([A-Za-z])/g, '|$1');
    var wktArray = str.trim().split('|');
    var components = [];
    for ( var i = 0, len = wktArray.length; i < len; ++i) {
      components.push(jsts.io.WKTParser.prototype.read.apply(this,
          [wktArray[i]]));
    }
    return this.geometryFactory.createGeometryCollection(components);
  }

};
