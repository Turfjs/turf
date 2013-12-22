/* Copyright (c) 2011, 2012 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Class for reading and writing Well-Known Text.
 *
 * NOTE: Adapted from OpenLayers 2.11 implementation.
 */

(function() {
    /**
     * Create a new parser for GeoJSON
     *
     * @param {GeometryFactory}
     *          geometryFactory
     * @return An instance of GeoJsonParser.
     */
    jsts.io.GeoJSONParser = function(geometryFactory) {
        this.geometryFactory = geometryFactory || new jsts.geom.GeometryFactory();
        this.geometryTypes = ['Point', 'MultiPoint', 'LineString', 'MultiLineString', 'Polygon', 'MultiPolygon'];
    };

    /**
     * Deserialize a GeoJSON object and return the Geometry or Feature(Collection) with JSTS Geometries
     *
     * @param {}
     *          A GeoJSON object.
     * @return {} A Geometry instance or object representing a Feature(Collection) with Geometry instances.
     */
    jsts.io.GeoJSONParser.prototype.read = function(json) {
        var obj;
        if (typeof json === 'string') {
            obj = JSON.parse(json);
        } else {
            obj = json;
        }

        var type = obj.type;

        if (!this.parse[type]) {
            throw new Error('Unknown GeoJSON type: ' + obj.type);
        }

        if (this.geometryTypes.indexOf(type) != -1) {
            return this.parse[type].apply(this, [obj.coordinates]);
        } else if (type === 'GeometryCollection') {
            return this.parse[type].apply(this, [obj.geometries]);
        }

        // feature or feature collection
        return this.parse[type].apply(this, [obj]);
    };

    jsts.io.GeoJSONParser.prototype.parse = {
        /**
         * Parse a GeoJSON Feature object
         *
         * @param {Object}
         *          obj Object to parse.
         *
         * @return {Object} Feature with geometry/bbox converted to JSTS Geometries.
         */
        'Feature': function(obj) {
            var feature = {};

            // copy features
            for (var key in obj) {
                feature[key] = obj[key];
            }

            // parse geometry
            if (obj.geometry) {
                var type = obj.geometry.type;
                if (!this.parse[type]) {
                    throw new Error('Unknown GeoJSON type: ' + obj.type);
                }
                feature.geometry = this.read(obj.geometry);
            }

            // bbox
            if (obj.bbox) {
                feature.bbox = this.parse.bbox.apply(this, [obj.bbox]);
            }

            return feature;
        },

        /**
         * Parse a GeoJSON FeatureCollection object
         *
         * @param {Object}
         *          obj Object to parse.
         *
         * @return {Object} FeatureCollection with geometry/bbox converted to JSTS Geometries.
         */
        'FeatureCollection': function(obj) {
            var featureCollection = {};

            if (obj.features) {
                featureCollection.features = [];

                for (var i = 0; i < obj.features.length; ++i) {
                    featureCollection.features.push(this.read(obj.features[i]));
                }
            }

            if (obj.bbox) {
                featureCollection.bbox = this.parse.bbox.apply(this, [obj.bbox]);
            }

            return featureCollection;
        },


        /**
         * Convert the ordinates in an array to an array of jsts.geom.Coordinates
         *
         * @param {Array}
         *          array Array with {Number}s.
         *
         * @return {Array} Array with jsts.geom.Coordinates.
         */
        'coordinates': function(array) {
            var coordinates = [];

            for (var i = 0; i < array.length; ++i) {
                var sub = array[i];
                coordinates.push(new jsts.geom.Coordinate(sub[0], sub[1]));
            }

            return coordinates;
        },

        /**
         * Convert the bbox to a jsts.geom.LinearRing
         *
         * @param {Array}
         *          array Array with [xMin, yMin, xMax, yMax].
         *
         * @return {Array} Array with jsts.geom.Coordinates.
         */
        'bbox': function(array) {
            return this.geometryFactory.createLinearRing([
                new jsts.geom.Coordinate(array[0], array[1]),
                new jsts.geom.Coordinate(array[2], array[1]),
                new jsts.geom.Coordinate(array[2], array[3]),
                new jsts.geom.Coordinate(array[0], array[3]),
                new jsts.geom.Coordinate(array[0], array[1])
            ]);
        },


        /**
         * Convert an Array with ordinates to a jsts.geom.Point
         *
         * @param {Array}
         *          array Array with ordinates.
         *
         * @return {jsts.geom.Point} Point.
         */
        'Point': function(array) {
            var coordinate = new jsts.geom.Coordinate(array[0], array[1]);
            return this.geometryFactory.createPoint(coordinate);
        },

        /**
         * Convert an Array with coordinates to a jsts.geom.MultiPoint
         *
         * @param {Array}
         *          array Array with coordinates.
         *
         * @return {jsts.geom.MultiPoint} MultiPoint.
         */
        'MultiPoint': function(array) {
            var points = [];

            for (var i = 0; i < array.length; ++i) {
                points.push(this.parse.Point.apply(this, [array[i]]));
            }

            return this.geometryFactory.createMultiPoint(points);
        },

        /**
         * Convert an Array with coordinates to a jsts.geom.LineString
         *
         * @param {Array}
         *          array Array with coordinates.
         *
         * @return {jsts.geom.LineString} LineString.
         */
        'LineString': function(array) {
            var coordinates = this.parse.coordinates.apply(this, [array]);
            return this.geometryFactory.createLineString(coordinates);
        },

        /**
         * Convert an Array with coordinates to a jsts.geom.MultiLineString
         *
         * @param {Array}
         *          array Array with coordinates.
         *
         * @return {jsts.geom.MultiLineString} MultiLineString.
         */
        'MultiLineString': function(array) {
            var lineStrings = [];

            for (var i = 0; i < array.length; ++i) {
                lineStrings.push(this.parse.LineString.apply(this, [array[i]]));
            }

            return this.geometryFactory.createMultiLineString(lineStrings);
        },

        /**
         * Convert an Array to a jsts.geom.Polygon
         *
         * @param {Array}
         *          array Array with shell and holes.
         *
         * @return {jsts.geom.Polygon} Polygon.
         */
        'Polygon': function(array) {
            // shell
            var shellCoordinates = this.parse.coordinates.apply(this, [array[0]]);
            var shell = this.geometryFactory.createLinearRing(shellCoordinates);

            // holes
            var holes = [];
            for (var i = 1; i < array.length; ++i) {
                var hole = array[i];
                var coordinates = this.parse.coordinates.apply(this, [hole]);
                var linearRing = this.geometryFactory.createLinearRing(coordinates);
                holes.push(linearRing);
            }

            return this.geometryFactory.createPolygon(shell, holes);
        },

        /**
         * Convert an Array to a jsts.geom.MultiPolygon
         *
         * @param {Array}
         *          array Array of arrays with shell and rings.
         *
         * @return {jsts.geom.MultiPolygon} MultiPolygon.
         */
        'MultiPolygon': function(array) {
            var polygons = [];

            for (var i = 0; i < array.length; ++i) {
                var polygon = array[i];
                polygons.push(this.parse.Polygon.apply(this, [polygon]));
            }

            return this.geometryFactory.createMultiPolygon(polygons);
        },

        /**
         * Convert an Array to a jsts.geom.GeometryCollection
         *
         * @param {Array}
         *          array Array of GeoJSON geometries.
         *
         * @return {jsts.geom.GeometryCollection} GeometryCollection.
         */
        'GeometryCollection': function(array) {
            var geometries = [];

            for (var i = 0; i < array.length; ++i) {
                var geometry = array[i];
                geometries.push(this.read(geometry));
            }

            return this.geometryFactory.createGeometryCollection(geometries);
        }
    };

    /**
     * Serialize a Geometry object into GeoJSON
     *
     * @param {jsts.geom.geometry}
     *          geometry A Geometry or array of Geometries.
     * @return {Object} A GeoJSON object represting the input Geometry/Geometries.
     */
    jsts.io.GeoJSONParser.prototype.write = function(geometry) {
        var type = geometry.CLASS_NAME.slice(10);

        if (!this.extract[type]) {
            throw new Error('Geometry is not supported');
        }

        return this.extract[type].apply(this, [geometry]);
    };

    jsts.io.GeoJSONParser.prototype.extract = {
        /**
         * Convert a jsts.geom.Coordinate to an Array
         *
         * @param {jsts.geom.Coordinate}
         *          coordinate Coordinate to convert.
         *
         * @return {Array} Array of ordinates.
         */
        'coordinate': function(coordinate) {
            return [coordinate.x, coordinate.y];
        },

        /**
         * Convert a jsts.geom.Point to a GeoJSON object
         *
         * @param {jsts.geom.Point}
         *          point Point to convert.
         *
         * @return {Array} Array of 2 ordinates (paired to a coordinate).
         */
        'Point': function(point) {
            var array = this.extract.coordinate.apply(this, [point.coordinate]);

            return {
                type: 'Point',
                coordinates: array
            };
        },

        /**
         * Convert a jsts.geom.MultiPoint to a GeoJSON object
         *
         * @param {jsts.geom.MultiPoint}
         *          multipoint MultiPoint to convert.
         *
         * @return {Array} Array of coordinates.
         */
        'MultiPoint': function(multipoint) {
            var array = [];

            for (var i = 0; i < multipoint.geometries.length; ++i) {
                var point = multipoint.geometries[i];
                var geoJson = this.extract.Point.apply(this, [point]);
                array.push(geoJson.coordinates);
            }

            return {
                type: 'MultiPoint',
                coordinates: array
            };
        },

        /**
         * Convert a jsts.geom.LineString to a GeoJSON object
         *
         * @param {jsts.geom.LineString}
         *          linestring LineString to convert.
         *
         * @return {Array} Array of coordinates.
         */
        'LineString': function(linestring) {
            var array = [];

            for (var i = 0; i < linestring.points.length; ++i) {
                var coordinate = linestring.points[i];
                array.push(this.extract.coordinate.apply(this, [coordinate]));
            }

            return {
                type: 'LineString',
                coordinates: array
            };
        },

        /**
         * Convert a jsts.geom.MultiLineString to a GeoJSON object
         *
         * @param {jsts.geom.MultiLineString}
         *          multilinestring MultiLineString to convert.
         *
         * @return {Array} Array of Array of coordinates.
         */
        'MultiLineString': function(multilinestring) {
            var array = [];

            for (var i = 0; i < multilinestring.geometries.length; ++i) {
                var linestring = multilinestring.geometries[i];
                var geoJson = this.extract.LineString.apply(this, [linestring]);
                array.push(geoJson.coordinates);
            }

            return {
                type: 'MultiLineString',
                coordinates: array
            };
        },

        /**
         * Convert a jsts.geom.Polygon to a GeoJSON object
         *
         * @param {jsts.geom.Polygon}
         *          polygon Polygon to convert.
         *
         * @return {Array} Array with shell, holes.
         */
        'Polygon': function(polygon) {
            var array = [];

            // shell
            var shellGeoJson = this.extract.LineString.apply(this, [polygon.shell]);
            array.push(shellGeoJson.coordinates);

            // holes
            for (var i = 0; i < polygon.holes.length; ++i) {
                var hole = polygon.holes[i];
                var holeGeoJson = this.extract.LineString.apply(this, [hole]);
                array.push(holeGeoJson.coordinates);
            }

            return {
                type: 'Polygon',
                coordinates: array
            };
        },

        /**
         * Convert a jsts.geom.MultiPolygon to a GeoJSON object
         *
         * @param {jsts.geom.MultiPolygon}
         *          multipolygon MultiPolygon to convert.
         *
         * @return {Array} Array of polygons.
         */
        'MultiPolygon': function(multipolygon) {
            var array = [];

            for (var i = 0; i < multipolygon.geometries.length; ++i) {
                var polygon = multipolygon.geometries[i];
                var geoJson = this.extract.Polygon.apply(this, [polygon]);
                array.push(geoJson.coordinates);
            }

            return {
                type: 'MultiPolygon',
                coordinates: array
            };
        },

        /**
         * Convert a jsts.geom.GeometryCollection to a GeoJSON object
         *
         * @param {jsts.geom.GeometryCollection}
         *          collection GeometryCollection to convert.
         *
         * @return {Array} Array of geometries.
         */
        'GeometryCollection': function(collection) {
            var array = [];

            for (var i = 0; i < collection.geometries.length; ++i) {
                var geometry = collection.geometries[i];
                var type = geometry.CLASS_NAME.slice(10);
                array.push(this.extract[type].apply(this, [geometry]));
            }

            return {
                type: 'GeometryCollection',
                geometries: array
            };
        }
    };
})();
