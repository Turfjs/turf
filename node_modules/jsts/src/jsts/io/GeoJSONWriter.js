/* Copyright (c) 2011, 2012 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

(function() {
    /**
     * Writes the GeoJSON representation of a {@link Geometry}. The
     * The GeoJSON format is defined <A
     * HREF="http://geojson.org/geojson-spec.html">here</A>.
     * <p>
     * The <code>GeoJSONWriter</code> outputs coordinates rounded to the precision
     * model. Only the maximum number of decimal places necessary to represent the
     * ordinates to the required precision will be output.
     * <p>
     *
     * @see WKTReader
     * @constructor
     */
    jsts.io.GeoJSONWriter = function() {
      this.parser = new jsts.io.GeoJSONParser(this.geometryFactory);
    };

    /**
     * Converts a <code>Geometry</code> to its GeoJSON representation.
     *
     * @param {jsts.geom.Geometry}
     *          geometry a <code>Geometry</code> to process.
     * @return {Object} The GeoJSON representation of the Geometry.
     */

    jsts.io.GeoJSONWriter.prototype.write = function(geometry) {
      var geoJson = this.parser.write(geometry);

      return geoJson;
    };
})();
