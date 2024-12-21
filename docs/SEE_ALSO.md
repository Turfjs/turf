## Ports of Turf.js

Turf has been ported to several other languages, listed below.

- [Java](https://github.com/mapbox/mapbox-java/tree/master/services-turf/src/main/java/com/mapbox/turf) (Android, Java SE)
  - > [The current to-do list for porting to Java](https://github.com/mapbox/mapbox-java/blob/master/docs/turf-port.md)
- [Swift](https://github.com/mapbox/turf-swift/) (iOS, macOS, tvOS, watchOS, Linux)
  - > Turf for Swift is **experimental** and its public API is subject to change. Please use with care.
- [Dart/Flutter](https://github.com/dartclub/turf_dart) (Dart Web, Dart Native; Flutter for iOS, Android, macOS, Windows, Linux, Web)
  - > The Turf for Dart port is still in progress, the implementation status can be found in the [README](https://github.com/dartclub/turf_dart#components).

## Other Geospatial Analysis Software

Below are other geospatial options that aren't specifically ports of Turf.

### Python

* [Shapely](https://pypi.python.org/pypi/Shapely) is a friendly Python binding to GEOS
* [geopandas](https://geopandas.org/) is a layer on top of Shapely and Fiona for PostGIS-like tasks

### C++

* [GEOS](https://libgeos.org/) is a port of JTS to C++

### JavaScript

* [jsts](https://github.com/bjornharrtell/jsts) is a port of JTS to JavaScript

### Java

* [JTS](https://www.tsusiatsoftware.net/jts/main.html)

### Go

* [gogeos](https://paulsmith.github.io/gogeos/) is a Go binding to GEOS
* [go.geo](https://github.com/paulmach/go.geo) is a pure-Go implementation of some geometry operations and primitives

### Postgres

* [PostGIS](https://postgis.net/) provides geospatial operations within the Postgres database. Advanced operations rely on GEOS.
