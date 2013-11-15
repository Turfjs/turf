# Streaming Shapefile Parser

Based on the [ESRI Shapefile Technical Description](http://www.esri.com/library/whitepapers/pdfs/shapefile.pdf) and [dBASE Table File Format](http://www.digitalpreservation.gov/formats/fdd/fdd000325.shtml).

Caveat emptor: this library is a work in progress and does not currently support all shapefile geometry types (see [shp.js](https://github.com/mbostock/shapefile/blob/master/shp.js) for details). It also only supports dBASE III and has no error checking. Please contribute if you want to help!

## Reading a Shapefile

The main API for reading a shapefile is shapefile.<b>readStream</b>(<i>filename</i>[, <i>options</i>]). The supported options are:

* *encoding* - the DBF encoding (defaults to ISO-8859-1)
* *ignore-properties* - if true, don’t read properties (faster; defaults to false)

This method returns an [event emitter](http://nodejs.org/api/events.html) which emits three types of events:

* *feature* - while reading features from the shapefile
* *end* - when all features have been read
* *error* - if an error occurs

Features are emitted as [GeoJSON features](http://geojson.org/geojson-spec.html#feature-objects), not as shapefile primitives. That’s because GeoJSON objects are the standard representation of geometry in JavaScript, and they are convenient. If you want to access the shapefile primitives directly, use the private [shp](https://github.com/mbostock/shapefile/blob/master/shp.js) and [dbf](https://github.com/mbostock/shapefile/blob/master/dbf.js) classes instead.

See [index-test](https://github.com/mbostock/shapefile/blob/master/test/index-test.js) for an example converting a shapefile to a GeoJSON feature collection.
