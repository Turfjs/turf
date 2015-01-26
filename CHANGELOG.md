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
