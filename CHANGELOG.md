# 3.0.1

This is a big change in Turf! 3.0.0 is a release that targets the development
cycle of Turf, letting us work on it more and release more often.

**Monorepo**

Turf 3.x and forward is a **monorepo** project. We publish lots of little modules
as usual, but there's one repo - turfjs/turf - that contains all the code
and the issues for the Turf source code. We use [lerna](https://lernajs.io/)
to link these packages together and make sure they work.

Why? We already had internal turf modules, like `turf-meta`, and development
was harder and harder - we had a bunch of custom scripts to do releases and
tests, and these were just written for Turf. Lerna is from the very popular
and very well-maintained [babel](http://www.babeljs.io) project, and it
works really well, and reduces maintainer sadness.

**Simplicity**

Turf grew a bunch of modules that weren't totally necessary, or were
expressing only a line or two of JavaScript. We want to make things easier,
but these modules didn't make code more expressive and they hid complexity
where it didn't need to be hidden. Turf 3.x focuses on the core
functionalities we need, making sure they're tested and performant.

turf-erase has been renamed turf-difference to make its name more similar to the equivalents in other libraries.

Removed modules: merge, sum, min, max, average, median, variance, deviation, filter, remove, jenks, quantile.
See the upgrade guide below for replacements.

**Upgrading from v2**

**If you were using turf-merge**

turf-merge repeatedly called turf-union on an array of polygons. Here's
how to implement the same thing without the special module

```js
var clone = require('clone');
var union = require('turf-union');
function merge(polygons) {
  var merged = clone(polygons.features[0]), features = polygons.features;
  for (var i = 0, len = features.length; i < len; i++) {
    var poly = features[i];
    if (poly.geometry) merged = union(merged, poly);
  }
  return merged;
}
```

**If you were using turf-sum, min, max, average, median, variance, deviation**

The `turf-collect` method provides the core of these statistical methods
and lets you bring your own statistical library, like `simple-statistics`,
`science.js`, or others.

**If you were using turf-filter, turf-remove**

These modules were thin wrappers around native JavaScript methods: use
[Array.filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) instead:

```js
var filteredFeatures = features.filter(function(feature) {
  return feature.properties.value > 10;
});
```

**If you were using turf-jenks, turf-quantile**

Use Array.map to get values, and then bring your own statistical calculation,
like simple-statistics or science.js.

```js
var values = features.map(function(feature) {
  return feature.properties.value;
});
```

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
