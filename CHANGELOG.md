# 2.0.0

* turf-grid renamed turf-point-grid (turf.grid => turf.pointGrid)
* turf-hex renamed turf-hex-grid (turf.hex => turf.hexGrid)
* turf-hex-grid now has a required `unit` parameter
* remove turf-isobands; use turf-isolines instead
* added turf-square-grid (turf.squareGrid)
* added turf-triangle-grid (turf.triangleGrid)
* constrain turf-point-grid to the bbox

# 1.4.0

* update all module dependencies to master
* add support for features in turf.intersection
* fix issues with turf.polygon coordinate wrapping inconsistencies
* add `unit` parameter to turf.concave

# 1.3.5

* harmonize turf-tin dependency tree

# 1.3.4

* fixes bug in turf-along

# 1.3.3

* added turf-line-slice for segmenting LineStrings with Points
* turf-point-on-line for calculating the closest Point from a Point to a LineString

# 1.3.2

* [tin ~7x faster](https://github.com/Turfjs/turf-tin/commit/595f732435b3b7bd977cdbe996bce60cbfc490e7)
* Fix mutability issues with `flip`, `erase`: data passed to Turf should
  never be changed in place.
* added turf-line-distance for geodesic measuring of LineStrings
* added turf-along for calculating a the location of a Point x distance along a LineString
* added turf-area for calculating the area of a given feature
