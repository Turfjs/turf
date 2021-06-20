# 6.4.0

## 🏅 New Features/Enhancements

- [`@turf/boolean-point-on-line`](boolean-point-on-line) Added an `epislon` option to help in floating point comparison.
  (PR https://github.com/Turfjs/turf/pull/2051 - Author @okcoker)

## 🐛 Bug Fixes

- [`@turf/line-slice-along`](line-slice-along) Fixed a bug where the offset distance equal to the length of the line
  (PR https://github.com/Turfjs/turf/pull/2030 - Author @EricPKerr)

- [`@turf/helpers`](helpers) Fixed the conversion ratio for converting meters to yards and vice-versa
  (PR https://github.com/Turfjs/turf/pull/2046 - Author @anotherhale)

- [`@turf/center-median`](center-median) Fixed a missing TS type import
  (PR https://github.com/Turfjs/turf/pull/2044 - Author @Seairth)

- [`@turf/bezier-spline](bezier-spline) Fix a bug ensuring the spline result reaches the end of the input
  (PR https://github.com/Turfjs/turf/pull/2090 - Author @the-nemz)

## 📖 Documentation
- [`@turf/transform-rotate`](transform-rotate) and [`@turf/ellipse`](ellipse)) Improve documentation for angle parameter
  (PR https://github.com/Turfjs/turf/pull/2016 - Author @pasieronen)

- [`@turf/line-chunk`](line-chunk) Fix an invalid anchor
  (PR https://github.com/Turfjs/turf/pull/2071 - Author @GraxMonzo)

- [`@turf/distance`](distance) Enhance distance doco so supported inputs are clearer
  (PR https://github.com/Turfjs/turf/pull/2032 - Author @rowanwins)

## 🔔 Misc
- [`@turf/concave`](concave) Replace deprecated topojson dependency
  (PR https://github.com/Turfjs/turf/pull/2037 - Author @elliots)

- Work towards enabling TS Strict Mode
  (PR https://github.com/Turfjs/turf/pull/2053 - Author @mfedderly)


# 6.3.0

### Fix issues importing Turf for react-native, webpack 5, and other bundlers
  (PR https://github.com/Turfjs/turf/pull/2004 - Author r0b0t3d)
  (PR https://github.com/Turfjs/turf/pull/2011 - Author mfedderly)

### [`@turf/turf`][turf] expose @turf/boolean-intersect
  (PR https://github.com/Turfjs/turf/pull/2007 - Author rowanwins)

# 6.2.0

After a bit of hiatus, TurfJS is resuming releases.

## ⭐️ Major Updates

- ES Modules available for all packages
- Tree shaking should significantly reduce import size of @turf/turf
- Better support for ESM modules (PR https://github.com/Turfjs/turf/pull/1942 - Author @diachedelic)
- Clean-up of test and benchmark running to make publishing easier
- Enforce styling using Prettier
- Enable ESLint and get rid of unused variables
- Upgrade rollup for more correct javascript module builds
- Only include ES5 code

## 🚀 New Modules

### [`@turf/boolean-touches`][boolean-touches]

Determines if two features touch but do not intersect

### [`@turf/boolean-valid`][boolean-valid]

Checks if the geometry is a valid according to the OGC Simple Feature Specification

### [`@turf/quadrat-analysis`][quadrat-analysis]

Performs a quadrat analysis on a set of points

### [`@turf/rectangle-grid`][rectangle-grid]

Creates a grid of rectangles from a bounding box

### [`@turf/voroni`][voronoi]

Typescript types for the options parameter have been fixed
(PR https://github.com/Turfjs/turf/pull/1424 - Author @stevage)

### [`@turf/points-within-polygon`][points-within-polygon]

Typescript types around the Feature's Properties will now be preserved.
(PR https://github.com/Turfjs/turf/pull/1761 - Author @rugheid)

### [`@turf/rewind`][rewind]

Typescript types for the 'reverse' option are now correct. Previously it was misnamed as 'reversed'.
(PR https://github.com/Turfjs/turf/pull/1786 - Author @jonnycornwell)

### [`@turf/difference`][difference]

No longer publishes an .mjs file.

### [`@turf/meta`][meta]

No longer publishes an .mjs file.

### [`@turf/tag`][tag]

Add MultiPolygon support.
(PR https://github.com/Turfjs/turf/pull/1996 - Author bryceroney)

## 🐛 Bug Fixes

- [`@turf/centroid`](centroid) Don't visit first point twice when calculating centroid
  (PR https://github.com/Turfjs/turf/pull/1894 - Author @rowanwins)

- [`@turf/transform-translate`](transform-translate) Better handling of negative distances
  (PR https://github.com/Turfjs/turf/pull/1895 - Author @rowanwins)

- [`@turf/union`](union), [`@turf/difference`](difference), [`@turf/intersect`](intersect) Use polygon-clipping library to fix correctness issues
  (PR https://github.com/Turfjs/turf/pull/1916 - Authors @mbullington, @ngottlieb)

- [`@turf/buffer`](buffer) Change default number of steps to 8, and actually support the steps option
  (PR https://github.com/Turfjs/turf/pull/1931 - Author stevenchanin)

- [`@turf/buffer`](buffer) Fix projection issues that produce undersized buffers at non-equatorial latitudes
  (PR https://github.com/Turfjs/turf/pull/1956 - Author dyakovlev)

- [`@turf/helpers`](helpers) Add runtime checks to point() method, fixing an API break
  (PR https://github.com/Turfjs/turf/pull/1964)

## 🏅 New Features/Enhancements

- [`@turf/boolean-overlap`](boolean-overlap) Better performance for MultiPoint geometries
  (PR https://github.com/Turfjs/turf/pull/1910 - Author @mfedderly)

- [`@turf/helpers`](helpers) Add hectares to convertArea
  (PR https://github.com/Turfjs/turf/pull/1943 - Author @DanielJDufour)

- [`@turf/great-circle`](great-circle) Update Typescript types to support MultiLineString input
  (PR https://github.com/Turfjs/turf/pull/1928 - Author kronick)

## 📖 Documentation

- [`@turf/square-grid`](square-grid) Clarify inputs
  (PR https://github.com/Turfjs/turf/pull/1885 - Author @raphael-leger)

- [`@turf/greater-circle`](greater-circle) Clarify properties option example
  (PR https://github.com/Turfjs/turf/pull/1888 - Author @chris-catignani)

## ⚠️ Breaking Change

- [`@turf/line-to-polygon`](line-to-polygon) no longer modifies its input unless the mutate option is true
  (PR https://github.com/Turfjs/turf/pull/1879 - Author @MortenBirk)

- [`@turf/unkink-polygon`](unkink-polygon) remove Number.prototype.modulo override
  (PR https://github.com/Turfjs/turf/pull/1978)

# 5.0.0 🎉

## ⭐️ Major Updates

- TurfJS now supports ES Modules ([Related PR's](https://github.com/Turfjs/turf/pulls?q=is%3Apr+modules+is%3Aclosed+label%3Aes-module))
- Optional parameters are now defined as an `Object`.

## 🚀 New Modules

### [`@turf/voronoi`][voronoi]
Takes a FeatureCollection of points, and a bounding box, and returns a FeatureCollection of Voronoi polygons.
(PR https://github.com/Turfjs/turf/pull/1043 - Author @stevage)

### [`@turf/shortest-path`][shortest-path]
Returns the shortest path from start to end without colliding with any feature in obstacles
(PR https://github.com/Turfjs/turf/pull/956 - Author @stebogit)

### [`@turf/boolean-parallel`][boolean-parallel]
Boolean-Parallel returns True if each segment of `line1` is parallel to the correspondent segment of `line2`
(PR https://github.com/Turfjs/turf/pull/941 - Author @stebogit)

### [`@turf/nearest-point-on-line`][nearest-point-on-line]
Takes a {@link Point} and a {@link LineString} and calculates the closest Point on the (Multi)LineString.
(PR https://github.com/Turfjs/turf/pull/939 - Author @stebogit)

## 🏅 New Features/Enhancements
- Updates [`@turf/unkink-polygon`][unkink-polygon] testing & added `flattenEach` instead of using `flatten`.
(PR https://github.com/Turfjs/turf/pull/889)

- Add multi-geomtry support to [`@turf/line-split`](line-split)
(PR https://github.com/Turfjs/turf/pull/1078)

- Improve [`@turf/meta`](meta) `lineEach` method to provide properties, id and bbox
(PR https://github.com/Turfjs/turf/pull/1010)

## 🐛 Bug Fixes
- Fixes [`@turf/helpers`](helpers) earth radius variable
(PR https://github.com/Turfjs/turf/pull/1012)

- Fixes [`@turf/polygon-tangents`](polygon-tangents) bug
(PR https://github.com/Turfjs/turf/pull/1058)

- Fixes [`@turf/line-chunk`](line-chunk) bug when the number of segments is integer
(PR https://github.com/Turfjs/turf/pull/1046)

- Fixes `segmentEach` and `segmentReduce` methods in [`@turf/meta`](meta) to ensure something is returned
(PR https://github.com/Turfjs/turf/pull/968)

## ⚠️ Breaking Change

- Optional parameters are now defined as an `Object`:

**Before**
```js
var from = [-75.343, 39.984];
var to = [-75.534, 39.123];
var units = 'miles';
var distance = turf.distance(from, to, units);
```

**After**
```js
var from = [-75.343, 39.984];
var to = [-75.534, 39.123];
var options = {units: 'miles'};
var distance = turf.distance(from, to, options);
```

- Reworked `@turf/random` PR https://github.com/Turfjs/turf/issues/994
- Deprecate `@turf/idw` Issue https://github.com/Turfjs/turf/issues/887
- Reworked Grid modules `@turf/point-grid/hex/square/triangle` PR https://github.com/Turfjs/turf/pull/1029
- Renamed Modules/Methods
  - [x] `@turf/inside` => `@turf/boolean-point-in-polygon` https://github.com/Turfjs/turf/issues/860#issuecomment-317216235
  - [x] `@turf/within` => `@turf/points-within-polygon` https://github.com/Turfjs/turf/issues/860#issuecomment-317216235
  - [x] [`@turf/bezier`](https://github.com/Turfjs/turf/blob/master/packages/turf-bezier/index.js) => `@turf/bezier-spline` Issue https://github.com/Turfjs/turf/issues/661
  - [x] [`@turf/nearest`](https://github.com/Turfjs/turf/blob/master/packages/turf-nearest/index.js) => `@turf/nearest-point` https://github.com/Turfjs/turf/pull/858#issuecomment-317197295
  - [x] [`@turf/point-on-line`](https://github.com/Turfjs/turf/blob/master/packages/turf-point-on-line/index.js) => `@turf/nearest-point-on-line` https://github.com/Turfjs/turf/pull/858#issuecomment-317197295
  - [x] [`@turf/lineDistance`](https://github.com/Turfjs/turf/blob/master/packages/turf-line-distance/index.js) => `@turf/length` https://github.com/Turfjs/turf/issues/860#issuecomment-317229869
  - [x] [`@turf/helpers`](https://github.com/Turfjs/turf/blob/master/packages/turf-helpers/index.js)
    - [x] `radians2degrees` => `radiansToDegrees`
    - [x] `degrees2radians` => `degreesToRadians`
    - [x] `distanceToDegrees` => `lengthToDegrees`
    - [x] `distanceToRadians` => `lengthToRadians`
    - [x] `radiansToDistance` => `radiansToLength`
    - [x] `bearingToAngle` => `bearingToAzimuth`
    - [x] `convertDistance` => `convertLength`

# 4.7.0

## 🚀 New Modules

### [`@turf/projection`][projection]
- **toMercator**: Converts a WGS84 GeoJSON object into Mercator (EPSG:900913) projection
- **toWgs84**: Converts a Mercator (EPSG:900913) GeoJSON object into WGS84 projection

(PR https://github.com/Turfjs/turf/pull/927 - Author @stebogit)

### [`@turf/point-to-line-distance`][point-to-line-distance]

Returns the minimum distance between a {@link Point} and a {@link LineString}, being the distance from a line the minimum distance between the point and any segment of the `LineString`.

(PR https://github.com/Turfjs/turf/pull/925 - Author @stebogit)

### [`@turf/boolean-within`][boolean-within]

Boolean-within returns true if the first geometry is completely within the second geometry. The interiors of both geometries must intersect and, the interior and boundary of the primary (geometry a) must not intersect the exterior of the secondary (geometry b). Boolean-within returns the exact opposite result of the [`@turf/boolean-contains`][boolean-contains].

(PR https://github.com/Turfjs/turf/pull/924 - Author @rowanwins)

## 🏅 New Features/Enhancements
- Updates [`@turf/unkink-polygon`][unkink-polygon] testing & added `flattenEach` instead of using `flatten`.
(PR https://github.com/Turfjs/turf/pull/889)
- [`@turf/concave`][concave] refactoring, replacing [`@turf/union`][union] with `geojson-dissolve` to increase speed and added support to `null` geometries
(PR https://github.com/Turfjs/turf/pull/907 - Contributor @stebogit @DenisCarriere)
- Adds doc note on [`@turf/polygonize`][polygonize] about "Edges must be correctly noded"
(PR https://github.com/Turfjs/turf/pull/898 - Contributor @stebogit @NickCis)
- Adds support to foreign Members to [`@turf/clone`][clone]
(PR https://github.com/Turfjs/turf/pull/904 - Contributor @DenisCarriere)
- Extends support of any `GeoJSON` to [`@turf/simplify`][simplify]
(PR https://github.com/Turfjs/turf/pull/903 - Contributor @DenisCarriere @stebogit)
- Adds new `isNumber` function and improves type checking for few [`@turf/helpers`][helpers] methods
(PR https://github.com/Turfjs/turf/pull/920 - Contributor @DenisCarriere @stebogit)
- Adds throw errors to invalid `MultiPolygons` for [`@turf/simplify`][simplify]
(PR https://github.com/Turfjs/turf/pull/922 - Contributor @DenisCarriere)

## 🐛 Bug Fixes

- Fixes [`@turf/bbox-clip`](bbox-clip) point intersection handling, adding sanity-checks the lineclip output
(PR https://github.com/Turfjs/turf/pull/886)
- Fixes [`@turf/line-split`][line-split] endpoint case handling applying [`@turf/truncate`][truncate] on `splitter`
(PR https://github.com/Turfjs/turf/pull/892 and https://github.com/Turfjs/turf/pull/855 - Contributor @stebogit)
- Fixes [`@turf/intersect`][intersect] throwing "uncaught exception", adding [`@turf/truncate`][truncate] to inputs and returning `Feature<null>` if no geometry
(PR https://github.com/Turfjs/turf/pull/890 - Contributor @stebogit @vicvolk)
- Fixes [`@turf/hex-grid`][hex-grid] not properly cloning the last ring vertex
(PR https://github.com/Turfjs/turf/pull/897 - Contributor @stebogit @DenisCarriere)
- Fixes [`@turf/boolean-disjoint`][boolean-disjoint] incorrect behaviour where a poly was completely contained within another poly
(PR https://github.com/Turfjs/turf/pull/908 - Contributor @rowanwins)
- Fixes [`@turf/simplify`][simplify] process pending on particular geometries, applying [`@turf/clean-coords`][clean-coords] to input.
(PR https://github.com/Turfjs/turf/pull/903 - Contributor @stebogit @DenisCarriere)
- Fixes `boolean` properties not being translated with [`@turf/clone`][clone]
(PR https://github.com/Turfjs/turf/pull/909 - Contributor @DenisCarriere)
- Fixes [`@turf/boolean-contains`][boolean-contains] incorrect output when checking two polygons
(PR https://github.com/Turfjs/turf/pull/923 - Contributor @rowanwins @DenisCarriere)

# 4.6.0

## 🚀 New Modules

- [`@turf/clean-coords`](https://github.com/Turfjs/turf/tree/master/packages/turf-clean-coords) Removes redundant coordinates from any GeoJSON Geometry.
(PR https://github.com/Turfjs/turf/pull/875 - Author @stebogit)
- [`@turf/interpolate`](https://github.com/Turfjs/turf/tree/master/packages/turf-interpolate) Takes a set of points and estimates their 'property' values on a grid using the [Inverse Distance Weighting (IDW) method.](https://en.wikipedia.org/wiki/Inverse_distance_weighting).
(PR https://github.com/Turfjs/turf/pull/832 - Author @stebogit)
- [`@turf/clusters-dbscan`](https://github.com/Turfjs/turf/tree/master/packages/turf-clusters-dbscan) Takes a set of Points and partition them into clusters according to [DBSCAN's](https://en.wikipedia.org/wiki/DBSCAN) data clustering algorithm.
(PR https://github.com/Turfjs/turf/pull/812 and https://github.com/Turfjs/turf/pull/851 - Author @DenisCarriere)
    > special mention to [this incredibly instructive and fun interactive map](https://github.com/DenisCarriere/turf-example-clusters-dbscan) by @DenisCarriere 😎👏
- [`@turf/clusters`](https://github.com/Turfjs/turf/tree/master/packages/turf-clusters) Provides `getCluster`, `clusterEach`, and `clusterReduce` functions.
(PR https://github.com/Turfjs/turf/pull/847 - Author @DenisCarriere)
- [`@turf/boolean-point-on-line`](https://github.com/Turfjs/turf/tree/master/packages/turf-boolean-point-on-line) Returns true if a point is on a line. Accepts a optional parameter to ignore the start and end vertices of the linestring.
(PR https://github.com/Turfjs/turf/pull/858 - Author @rowanwins)
- [`@turf/boolean-overlap`](https://github.com/Turfjs/turf/tree/master/packages/turf-boolean-overlap) Takes two features and returns true or false whether or not they overlap, i.e. whether any pair of edges on the two polygons intersect. If there
are any edge intersections, the polygons overlap.
(PR https://github.com/Turfjs/turf/pull/856 and https://github.com/Turfjs/turf/pull/868 - Author @stebogit @tcql)
- [`@turf/boolean-equal`](https://github.com/Turfjs/turf/tree/master/packages/turf-boolean-equal) Determine whether two geometries of the same type have identical X,Y coordinate values.
(PR https://github.com/Turfjs/turf/pull/869 - Author @stebogit @tcql)

## 🏅 New Features/Enhancements

- Sets `centered` param default to `true` in [`@turf/point-grid`](https://github.com/Turfjs/turf/tree/master/packages/turf-point-grid)
(PR https://github.com/Turfjs/turf/pull/836 - Contributor @stebogit)
- Adds `MultiLineString` support for [`@turf/point-on-line`](https://github.com/Turfjs/turf/tree/master/packages/turf-point-on-line)
(PR https://github.com/Turfjs/turf/pull/838 - Contributor @stebogit)
- Renames `@turf/clusters` => `@turf/clusters-kmeans`, plus adds deprecated warning message to `@turf/clusters@4.5.2`
(See Issue https://github.com/Turfjs/turf/issues/845)
- Changes output type of `@turf/clusters-kmeans`
(See Issue https://github.com/Turfjs/turf/issues/850 - Contributor @DenisCarriere)
- Adds `segmentEach` and `segmentReduce` functions to `@turf/meta`
(See Issue https://github.com/Turfjs/turf/issues/850 - Contributor @DenisCarriere)
- Adds tests and linting on JSDoc in TurfJS core from `turf-www`; see Issue https://github.com/Turfjs/turf/issues/859
(PR https://github.com/Turfjs/turf/issues/857 + https://github.com/Turfjs/turf/issues/864 + https://github.com/Turfjs/turf/issues/870 - Contributor @DenisCarriere @stebogit)
- Introduces `null` Geometry support across TurfJS modules (See Issue https://github.com/Turfjs/turf/issues/853)
(PR https://github.com/Turfjs/turf/issues/866 - Contributor @DenisCarriere)
- Includes feature(Sub)Index in `coordEach`/`coordReduce` (@turf/meta) 🎉
(PR https://github.com/Turfjs/turf/issues/872 - Contributor @DenisCarriere)
- Adds `bbox` and `id` params plus `geometry` method to `@turf/helpers`
(PR https://github.com/Turfjs/turf/issues/877 - Contributor @DenisCarriere)

## 🐛 Bug Fixes

- Applies `@turf/truncate` to [`@turf/line-split`](https://github.com/Turfjs/turf/tree/master/packages/turf-line-split)
`splitter` input to avoid approximation errors. Fixed #852
(PR https://github.com/Turfjs/turf/pull/855)
- Fixes `@turf-mask` error (See Issue https://github.com/Turfjs/turf/issues/837)
(PR https://github.com/Turfjs/turf/pull/865 - Contributor @thiagoxvo)
- Fixes `create-new-module` script error on `LICENSE` file creation (See Issue https://github.com/Turfjs/turf/issues/861)
(commit [df6986e](https://github.com/Turfjs/turf/commit/df6986ec0a5c353babb60836ec97c21923913e79))
- Fixes `@turf/isobands` error on `commonProperties` (See Issue https://github.com/Turfjs/turf/issues/831)
(commit [1663f07](https://github.com/Turfjs/turf/commit/1663f077c075c8902dbeff4acf68b1c8e0151853))

# 4.5.0

## 🚀 New Modules

- [`@turf/clusters`](https://github.com/Turfjs/turf/tree/master/packages/turf-clusters) Takes a set of points and partition them into clusters using the [k-means clustering](https://en.wikipedia.org/wiki/K-means_clustering) algorithm.
(PR https://github.com/Turfjs/turf/pull/787 - Author @stebogit )

- [`@turf/boolean-disjoint`](https://github.com/Turfjs/turf/tree/master/packages/turf-boolean-disjoint) Boolean-disjoint returns (TRUE) if the intersection of the two geometries is an empty set.
(PR https://github.com/Turfjs/turf/pull/805 - Author @rowanwins)

- [`@turf/boolean-contains`](https://github.com/Turfjs/turf/tree/master/packages/turf-boolean-contains) Boolean-contains returns True if the second geometry is completely contained by the first geometry. The interiors of both geometries must intersect and, the interior and boundary of the secondary (geometry b) must not intersect the exterior of the primary (geometry a). Boolean-contains returns the exact opposite result of the `@turf/boolean-within`.
(PR https://github.com/Turfjs/turf/pull/797 - Author @rowanwins)

- [`@turf/boolean-crosses`](https://github.com/Turfjs/turf/tree/master/packages/turf-boolean-crosses) Boolean-Crosses returns True if the intersection results in a geometry whose dimension is one less than the maximum dimension of the two source geometries and the intersection set is interior to both source geometries.
Boolean-Crosses returns t (TRUE) for only multipoint/polygon, multipoint/linestring, linestring/linestring, linestring/polygon, and linestring/multipolygon comparisons.
(PR https://github.com/Turfjs/turf/pull/796 - Author @rowanwins)

- [`@turf/boolean-clockwise`](https://github.com/Turfjs/turf/tree/master/packages/turf-boolean-clockwise) Takes a ring and return true or false whether or not the ring is clockwise or counter-clockwise.
(PR https://github.com/Turfjs/turf/pull/789 - Authors @morganherlocker @stebogit)

- [`@turf/clone`](https://github.com/Turfjs/turf/tree/master/packages/turf-clone) Prevents GeoJSON coordinates from being mutated, similar to `JSON.parse(JSON.stringify(geojson))`.
Only cloning the coordinates can be 3x-20x faster than the **parse + stringify** approach.
(PR https://github.com/Turfjs/turf/pull/824 - Author @DenisCarriere)

## 🏅 New Features/Enhancements

- [`convertArea`](https://github.com/Turfjs/turf/tree/master/packages/turf-helpers#convertarea) Converts a area to the requested unit. (PR https://github.com/Turfjs/turf/pull/821 - Author @wnordmann)
- Adds mask option to `@turf/point-grid` (PR https://github.com/Turfjs/turf/pull/791)
- New @turf/isolines based on MarchingSquares.js (PR https://github.com/Turfjs/turf/pull/781)
- Use ES6 modules / Add module.js to @turf/turf (PR https://github.com/Turfjs/turf/pull/793)
- Create-new-module script (PR https://github.com/Turfjs/turf/pull/823)

## 🐛 Bug Fixes

- Buffer - Drop circle buffer operation (PR https://github.com/Turfjs/turf/pull/786)
- Fixes `@turf/idw` bad property name #774  (PR https://github.com/Turfjs/turf/pull/800)
- Fix for @turf/polygon-tangents - Resolves #785 (PR https://github.com/Turfjs/turf/pull/792)

# 4.4.0

## 🚀 New Modules

- [`@turf/line-offset`](https://github.com/Turfjs/turf/tree/master/packages/turf-line-offset)
Adds a new lineOffset module as per this issue. Basically takes an input line and returns a new line offset by the distance. (PR https://github.com/Turfjs/turf/pull/729 - Author @rowanwins)
- [`@turf/polygonize`](https://github.com/Turfjs/turf/tree/master/packages/turf-polygonize)
Polygonizes (Multi)LineString(s) into Polygons. Implementation of GEOSPolygonize function (geos::operation::polygonize::Polygonizer). (PR https://github.com/Turfjs/turf/pull/767 - Author @NickCis)
- [`@turf/transform-rotate`](https://github.com/Turfjs/turf/tree/master/packages/turf-transform-rotate)
Rotates any geojson Feature or Geometry of a specified angle, around its centroid or a given pivot point; all rotations follow the right-hand rule. (Issue https://github.com/Turfjs/turf/issues/747 - Author @stebogit)
- [`@turf/transform-translate`](https://github.com/Turfjs/turf/tree/master/packages/turf-transform-translate)
Moves any geojson Feature or Geometry of a specified distance along a Rhumb Line on the provided direction angle. (Issue https://github.com/Turfjs/turf/issues/747 - Author @stebogit)
- [`@turf/transform-scale`](https://github.com/Turfjs/turf/tree/master/packages/turf-transform-scale)
Scale a GeoJSON from a given point by a factor of scaling (ex: factor=2 would make the GeoJSON 200% larger). If a FeatureCollection is provided, the origin point will be calculated based on each individual Feature. (Issue https://github.com/Turfjs/turf/issues/747 - Author @stebogit)

## 🏅 New Features

- Support z-coordinate as input for [`@turf/turf-tin`](https://github.com/Turfjs/turf/tree/master/packages/turf-tin) (PR https://github.com/Turfjs/turf/pull/772)
- Adds properties parameter to [`@turf/centroid`](https://github.com/Turfjs/turf/tree/master/packages/turf-centroid) and [`@turf/center`](https://github.com/Turfjs/turf/tree/master/packages/turf-center) (PR https://github.com/Turfjs/turf/pull/769)
- Include Yarn.lock for all modules & Lerna uses Yarn (Issue https://github.com/Turfjs/turf/issues/704, https://github.com/Turfjs/turf/issues/765, PR https://github.com/Turfjs/turf/pull/766)
- Use `Tap` at root which enables code coverage reports (Issue https://github.com/Turfjs/turf/issues/328 & PR https://github.com/Turfjs/turf/pull/762)
- Support z-coordinate as input for [`@turf/pointplane`](https://github.com/Turfjs/turf/tree/master/packages/turf-planepoint) (PR https://github.com/Turfjs/turf/pull/754)
- Add core tests - file management & package.json rules (PR https://github.com/Turfjs/turf/pull/749 & https://github.com/Turfjs/turf/pull/756)

## 🐛 Bug Fixes

- Website http://turfjs.org is back up and running (Issue https://github.com/Turfjs/turf/issues/777)
- [`@turf/rhumb-destination`](https://github.com/Turfjs/turf/tree/master/packages/turf-planepoint) issue at 180th meridian (Issue https://github.com/Turfjs/turf/issues/770 & PR https://github.com/Turfjs/turf/pull/771)
- Getting too large numbers for Longitude (Issue https://github.com/Turfjs/turf/issues/758 & PR https://github.com/Turfjs/turf/pull/763)
- Throw error if FeatureCollection not array #751 (PR https://github.com/Turfjs/turf/pull/760)
- Change default param coordinates to 3 @turf/truncate (PR https://github.com/Turfjs/turf/pull/757)
- along returns a point that is not found by [`@turf/point-on-line`](https://github.com/Turfjs/turf/tree/master/packages/turf-point-on-line) (Issue https://github.com/Turfjs/turf/issues/691)
- Fix location of intersect point for [`@turf/point-on-line`](https://github.com/Turfjs/turf/tree/master/packages/turf-point-on-line). (PR https://github.com/Turfjs/turf/pull/750)
- Handle empty geometries as undefined [`@turf/buffer`](https://github.com/Turfjs/turf/tree/master/packages/turf-buffer) (PR https://github.com/Turfjs/turf/pull/746)

# 4.3.0

## 🚀 New Modules

- [Rhumb Line](https://en.wikipedia.org/wiki/Rhumb_line) Modules (https://github.com/Turfjs/turf/pull/728)
  - [`@turf/rhumb-bearing`](https://github.com/Turfjs/turf/tree/master/packages/turf-rhumb-bearing)
  - [`@turf/rhumb-distance`](https://github.com/Turfjs/turf/tree/master/packages/turf-rhumb-distance)
  - [`@turf/rhumb-destination`](https://github.com/Turfjs/turf/tree/master/packages/turf-rhumb-destination)
- [`@turf/polygon-tangents`](https://github.com/Turfjs/turf/tree/master/packages/turf-polygon-tangents) Finds the tangents of a (Multi)Polygon from a Point. (https://github.com/Turfjs/turf/pull/708)
- [`@turf/rewind`](https://github.com/Turfjs/turf/tree/master/packages/turf-rewind) Rewind LineString or Polygon outer ring ~clockwise~ counter-clockwise and inner rings ~counterclockwise~ clockwise (https://github.com/Turfjs/turf/pull/700 & https://github.com/Turfjs/turf/issues/66)
- [`@turf/isobands`](https://github.com/Turfjs/turf/tree/master/packages/turf-isobands) - Takes a grid FeatureCollection of Point features with z-values and an array of value breaks and generates filled contour isobands. (https://github.com/Turfjs/turf/pull/619)

## 🏅 New Features

- New function [convertDistance](https://github.com/Turfjs/turf/tree/master/packages/turf-helpers#convertdistance) to [`@turf/helpers`](https://github.com/Turfjs/turf/tree/master/packages/turf-helpers) (https://github.com/Turfjs/turf/pull/732)
- Add ignoreBoundary param [`@turf/inside`](https://github.com/Turfjs/turf/tree/master/packages/turf-inside) (https://github.com/Turfjs/turf/pull/706)
- Add [flattenEach](https://github.com/Turfjs/turf/tree/master/packages/turf-meta#flatteneach)/[flattenReduce](https://github.com/Turfjs/turf/tree/master/packages/turf-meta#flattenreduce) to [`@turf/meta`](https://github.com/Turfjs/turf/tree/master/packages/turf-meta). (https://github.com/Turfjs/turf/pull/712 & https://github.com/Turfjs/turf/issues/692)
- New Feature [`getGeom`](https://github.com/Turfjs/turf/tree/master/packages/turf-invariant#getgeom) & [`getGeomType`](https://github.com/Turfjs/turf/tree/master/packages/turf-invariant#getgeomtype) in [`@turf/invariant`](https://github.com/Turfjs/turf/tree/master/packages/turf-invariant) (https://github.com/Turfjs/turf/pull/720)
- Adds [`round()`](https://github.com/Turfjs/turf/tree/master/packages/turf-helpers#round), [`radians2degrees()`](https://github.com/Turfjs/turf/tree/master/packages/turf-helpers#radians2degrees) and [`degrees2radians()`](https://github.com/Turfjs/turf/tree/master/packages/turf-helpers#degrees2radians) to [`turf-helpers`](https://github.com/Turfjs/turf/tree/master/packages/turf-helpers)
 (https://github.com/Turfjs/turf/pull/715)
- **⭐️ New** Add FeatureCollection & GeometryCollection support to [`@turf/rewind`](https://github.com/Turfjs/turf/tree/master/packages/turf-rewind) (https://github.com/Turfjs/turf/pull/741)

## 🐛 Bug Fixes

- Fix [`@turf/circle`](https://github.com/Turfjs/turf/tree/master/packages/turf-circle) translate properties (https://github.com/Turfjs/turf/pull/717)
- Apply equidistance [`@turf/buffer`](https://github.com/Turfjs/turf/tree/master/packages/turf-buffer) to polygons (https://github.com/Turfjs/turf/issues/660 & https://github.com/Turfjs/turf/pull/718)
- Fix jsts empty (Multi)Polygon error [`@turf/difference`](https://github.com/Turfjs/turf/tree/master/packages/turf-difference) (https://github.com/Turfjs/turf/pull/725)
- Support Geometry Objects & Collection (https://github.com/Turfjs/turf/issues/710)
  - [`@turf/line-intersect`](https://github.com/Turfjs/turf/tree/master/packages/turf-line-intersect) (https://github.com/Turfjs/turf/pull/731)
  - [`@turf/line-chunk`](https://github.com/Turfjs/turf/tree/master/packages/turf-line-chunk) (https://github.com/Turfjs/turf/pull/726)
  - [`@turf/line-segment`](https://github.com/Turfjs/turf/tree/master/packages/turf-line-segment) (https://github.com/Turfjs/turf/pull/727 & https://github.com/Turfjs/turf/pull/711)
  - [`@turf/line-overlap`](https://github.com/Turfjs/turf/tree/master/packages/turf-line-overlap) (https://github.com/Turfjs/turf/pull/711)
- **New** Reverse winding - Polygon CCW & Polygon CW [`@turf/rewind`](https://github.com/Turfjs/turf/tree/master/packages/turf-rewind) (https://github.com/Turfjs/turf/pull/741)
- **⭐️ New** Fix Feature GeometryCollection to [`@turf/buffer`](https://github.com/Turfjs/turf/tree/master/packages/turf-buffer) (https://github.com/Turfjs/turf/pull/739)
- **⭐️ New** Re-enable negative `radius` to [`@turf/buffer`](https://github.com/Turfjs/turf/tree/master/packages/turf-buffer) (https://github.com/Turfjs/turf/pull/736)

# 4.2.0

## New Modules

- [`@turf/sector`](https://github.com/Turfjs/turf/pull/653)
- [`@turf/linestring-to-polygon`](https://github.com/Turfjs/turf/pull/672)

## Enhancements

- [Add mutate param to `@turf/flip`](https://github.com/Turfjs/turf/issues/693)
- [Add Geometry & GeometryCollection support to `@turf/truncate`](https://github.com/Turfjs/turf/pull/677)
- [`@turf/inside` performance increase](https://github.com/Turfjs/turf/pull/675)
- [Add properties param to `@turf/circle`](https://github.com/Turfjs/turf/pull/668)
- [Added `bearingToAngle` method to turf-helpers](https://github.com/Turfjs/turf/pull/663)

## Bug Fixes

- [Fix `@turf/buffer` points in high latitudes](https://github.com/Turfjs/turf/pull/667)
- [lineIntersect returns the same point several times](https://github.com/Turfjs/turf/issues/688)
- [`@turf/flip` incorrect if z-elevation is present](https://github.com/Turfjs/turf/issues/669)

## Changes

- [Change output types `@turf/polygon-to-linestring`](https://github.com/Turfjs/turf/pull/686)

## Documentation

- [Update JSDocs examples](https://github.com/Turfjs/turf/pull/670/files)
- [Include many more AddToMap to modules](https://github.com/Turfjs/turf/pull/664)

# 4.1.0

## New Modules

- [`@turf/line-arc`](https://github.com/Turfjs/turf/pull/657)
- [`@turf/polygon-to-linestring`](https://github.com/Turfjs/turf/pull/646)
- [`@turf/bbox-clip`](https://github.com/Turfjs/turf/pull/652)
- [`@turf/line-overlap`](https://github.com/Turfjs/turf/pull/640)

## Enhancements

- added centered param to point-grid (PR: https://github.com/Turfjs/turf/pull/650)
- Single `module.export` helpers, invariant & meta (Commit: https://github.com/Turfjs/turf/commit/9cebb2100cf545fec49488c80140909ab54358b5)

## Bug Fixes

- Turf.invariant fails on string value as coordinate (PR: https://github.com/Turfjs/turf/pull/643)
- Handle precision=0 turf-truncate (PR: https://github.com/Turfjs/turf/pull/641)
- Added `radiansToDistance`, `distanceToRadians` & `distanceToDegrees` to Turf core library from `@turf/helpers`. (Commit: https://github.com/Turfjs/turf/commit/a88d77a3e7f76860b3c138a716da8b603a407c8e)
- Removed process.hrtime in `@turf/polygon-unkink`(issue: https://github.com/mclaeysb/simplepolygon/issues/5)

# 3.6.4

Typescript definitions `index.d.ts` added to all the packages.

# 3.0.11

Fix turf-line-slice bug with vertical linestrings.

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
An alternative method that merges pairs of features recursively.
With large numbers and similar complexity of input geometries this can speed up run time by factor 10.
Choose depending on your use case.

```js
var union = require('turf-union');
function mergeBin(polygons) {
  var features = polygons.features;

  do {
    var merged = [], len = features.length;
    for (var i = 0; i < len-1; i += 2) {
      merged.push(turf.union(features[i], features[i+1]));
    }
    if (len % 2 !== 0) {
      merged.push(features[len-1]);
    }
    features = merged;
  } while(features.length > 1);

  return features[0];
}
```

**If you were using turf-sum, min, max, average, median, variance, deviation**

The `turf-collect` method provides the core of these statistical methods
and lets you bring your own statistical library, like `simple-statistics`,
`science.js`, or others.

For example, here's how to find the median of matched values with simple-statistics.
Finding other statistics, like variance, mean, and so on simply use other methods
from the statistics library.

```js
var ss = require('simple-statistics');
var turf = require('@turf/turf');

var poly1 = turf.polygon([[[0,0],[10,0],[10,10],[0,10],[0,0]]]);
var poly2 = turf.polygon([[[10,0],[20,10],[20,20],[20,0],[10,0]]]);
var polyFC = turf.featureCollection([poly1, poly2]);
var pt1 = turf.point([5,5], {population: 200});
var pt2 = turf.point([1,3], {population: 600});
var pt3 = turf.point([14,2], {population: 100});
var pt4 = turf.point([13,1], {population: 200});
var pt5 = turf.point([19,7], {population: 300});
var ptFC = turf.featureCollection([pt1, pt2, pt3, pt4, pt5]);

// collects values from matching points into an array called 'values'
var collected = turf.collect(polyFC, ptFC, 'population', 'values');

// finds the median of those values.
collected.features.forEach(function (feature) {
  feature.properties.median = ss.median(feature.properties.values);
});

console.log(JSON.stringify(collected, null, 2));
```

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

**If you were using turf-extent**

turf-extent's name was changed to turf-bbox. It is functionally the same.

```js
turf.bbox(poly) // [minx, miny, maxx, maxy]
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


[along]: https://github.com/Turfjs/turf/tree/master/packages/turf-along
[area]: https://github.com/Turfjs/turf/tree/master/packages/turf-area
[bbox]: https://github.com/Turfjs/turf/tree/master/packages/turf-bbox
[bbox-clip]: https://github.com/Turfjs/turf/tree/master/packages/turf-bbox-clip
[bbox-polygon]: https://github.com/Turfjs/turf/tree/master/packages/turf-bbox-polygon
[bearing]: https://github.com/Turfjs/turf/tree/master/packages/turf-bearing
[bezier-spline]: https://github.com/Turfjs/turf/tree/master/packages/turf-bezier-spline
[boolean-clockwise]: https://github.com/Turfjs/turf/tree/master/packages/turf-boolean-clockwise
[boolean-contains]: https://github.com/Turfjs/turf/tree/master/packages/turf-boolean-contains
[boolean-crosses]: https://github.com/Turfjs/turf/tree/master/packages/turf-boolean-crosses
[boolean-disjoint]: https://github.com/Turfjs/turf/tree/master/packages/turf-boolean-disjoint
[boolean-equal]: https://github.com/Turfjs/turf/tree/master/packages/turf-boolean-equal
[boolean-overlap]: https://github.com/Turfjs/turf/tree/master/packages/turf-boolean-overlap
[boolean-parallel]: https://github.com/Turfjs/turf/tree/master/packages/turf-boolean-parallel
[boolean-point-in-polygon]: https://github.com/Turfjs/turf/tree/master/packages/turf-boolean-point-in-polygon
[boolean-point-on-line]: https://github.com/Turfjs/turf/tree/master/packages/turf-boolean-point-on-line
[boolean-within]: https://github.com/Turfjs/turf/tree/master/packages/turf-boolean-within
[buffer]: https://github.com/Turfjs/turf/tree/master/packages/turf-buffer
[center]: https://github.com/Turfjs/turf/tree/master/packages/turf-center
[center-of-mass]: https://github.com/Turfjs/turf/tree/master/packages/turf-center-of-mass
[centroid]: https://github.com/Turfjs/turf/tree/master/packages/turf-centroid
[circle]: https://github.com/Turfjs/turf/tree/master/packages/turf-circle
[clean-coords]: https://github.com/Turfjs/turf/tree/master/packages/turf-clean-coords
[clone]: https://github.com/Turfjs/turf/tree/master/packages/turf-clone
[clusters]: https://github.com/Turfjs/turf/tree/master/packages/turf-clusters
[clusters-dbscan]: https://github.com/Turfjs/turf/tree/master/packages/turf-clusters-dbscan
[clusters-kmeans]: https://github.com/Turfjs/turf/tree/master/packages/turf-clusters-kmeans
[collect]: https://github.com/Turfjs/turf/tree/master/packages/turf-collect
[combine]: https://github.com/Turfjs/turf/tree/master/packages/turf-combine
[concave]: https://github.com/Turfjs/turf/tree/master/packages/turf-concave
[convex]: https://github.com/Turfjs/turf/tree/master/packages/turf-convex
[destination]: https://github.com/Turfjs/turf/tree/master/packages/turf-destination
[difference]: https://github.com/Turfjs/turf/tree/master/packages/turf-difference
[dissolve]: https://github.com/Turfjs/turf/tree/master/packages/turf-dissolve
[distance]: https://github.com/Turfjs/turf/tree/master/packages/turf-distance
[envelope]: https://github.com/Turfjs/turf/tree/master/packages/turf-envelope
[explode]: https://github.com/Turfjs/turf/tree/master/packages/turf-explode
[flatten]: https://github.com/Turfjs/turf/tree/master/packages/turf-flatten
[flip]: https://github.com/Turfjs/turf/tree/master/packages/turf-flip
[great-circle]: https://github.com/Turfjs/turf/tree/master/packages/turf-great-circle
[helpers]: https://github.com/Turfjs/turf/tree/master/packages/turf-helpers
[hex-grid]: https://github.com/Turfjs/turf/tree/master/packages/turf-hex-grid
[interpolate]: https://github.com/Turfjs/turf/tree/master/packages/turf-interpolate
[intersect]: https://github.com/Turfjs/turf/tree/master/packages/turf-intersect
[invariant]: https://github.com/Turfjs/turf/tree/master/packages/turf-invariant
[isobands]: https://github.com/Turfjs/turf/tree/master/packages/turf-isobands
[isolines]: https://github.com/Turfjs/turf/tree/master/packages/turf-isolines
[kinks]: https://github.com/Turfjs/turf/tree/master/packages/turf-kinks
[length]: https://github.com/Turfjs/turf/tree/master/packages/turf-length
[line-arc]: https://github.com/Turfjs/turf/tree/master/packages/turf-line-arc
[line-chunk]: https://github.com/Turfjs/turf/tree/master/packages/turf-line-chunk
[line-intersect]: https://github.com/Turfjs/turf/tree/master/packages/turf-line-intersect
[line-offset]: https://github.com/Turfjs/turf/tree/master/packages/turf-line-offset
[line-overlap]: https://github.com/Turfjs/turf/tree/master/packages/turf-line-overlap
[line-segment]: https://github.com/Turfjs/turf/tree/master/packages/turf-line-segment
[line-slice]: https://github.com/Turfjs/turf/tree/master/packages/turf-line-slice
[line-slice-along]: https://github.com/Turfjs/turf/tree/master/packages/turf-line-slice-along
[line-split]: https://github.com/Turfjs/turf/tree/master/packages/turf-line-split
[line-to-polygon]: https://github.com/Turfjs/turf/tree/master/packages/turf-line-to-polygon
[mask]: https://github.com/Turfjs/turf/tree/master/packages/turf-mask
[meta]: https://github.com/Turfjs/turf/tree/master/packages/turf-meta
[midpoint]: https://github.com/Turfjs/turf/tree/master/packages/turf-midpoint
[nearest-point]: https://github.com/Turfjs/turf/tree/master/packages/turf-nearest-point
[nearest-point-on-line]: https://github.com/Turfjs/turf/tree/master/packages/turf-nearest-point-on-line
[nearest-point-to-line]: https://github.com/Turfjs/turf/tree/master/packages/turf-nearest-point-to-line
[planepoint]: https://github.com/Turfjs/turf/tree/master/packages/turf-planepoint
[point-grid]: https://github.com/Turfjs/turf/tree/master/packages/turf-point-grid
[point-on-feature]: https://github.com/Turfjs/turf/tree/master/packages/turf-point-on-feature
[point-to-line-distance]: https://github.com/Turfjs/turf/tree/master/packages/turf-point-to-line-distance
[points-within-polygon]: https://github.com/Turfjs/turf/tree/master/packages/turf-points-within-polygon
[polygon-tangents]: https://github.com/Turfjs/turf/tree/master/packages/turf-polygon-tangents
[polygon-to-line]: https://github.com/Turfjs/turf/tree/master/packages/turf-polygon-to-line
[polygonize]: https://github.com/Turfjs/turf/tree/master/packages/turf-polygonize
[projection]: https://github.com/Turfjs/turf/tree/master/packages/turf-projection
[random]: https://github.com/Turfjs/turf/tree/master/packages/turf-random
[rewind]: https://github.com/Turfjs/turf/tree/master/packages/turf-rewind
[rhumb-bearing]: https://github.com/Turfjs/turf/tree/master/packages/turf-rhumb-bearing
[rhumb-destination]: https://github.com/Turfjs/turf/tree/master/packages/turf-rhumb-destination
[rhumb-distance]: https://github.com/Turfjs/turf/tree/master/packages/turf-rhumb-distance
[sample]: https://github.com/Turfjs/turf/tree/master/packages/turf-sample
[sector]: https://github.com/Turfjs/turf/tree/master/packages/turf-sector
[shortest-path]: https://github.com/Turfjs/turf/tree/master/packages/turf-shortest-path
[simplify]: https://github.com/Turfjs/turf/tree/master/packages/turf-simplify
[square]: https://github.com/Turfjs/turf/tree/master/packages/turf-square
[square-grid]: https://github.com/Turfjs/turf/tree/master/packages/turf-square-grid
[tag]: https://github.com/Turfjs/turf/tree/master/packages/turf-tag
[tesselate]: https://github.com/Turfjs/turf/tree/master/packages/turf-tesselate
[tin]: https://github.com/Turfjs/turf/tree/master/packages/turf-tin
[transform-rotate]: https://github.com/Turfjs/turf/tree/master/packages/turf-transform-rotate
[transform-scale]: https://github.com/Turfjs/turf/tree/master/packages/turf-transform-scale
[transform-translate]: https://github.com/Turfjs/turf/tree/master/packages/turf-transform-translate
[triangle-grid]: https://github.com/Turfjs/turf/tree/master/packages/turf-triangle-grid
[truncate]: https://github.com/Turfjs/turf/tree/master/packages/turf-truncate
[union]: https://github.com/Turfjs/turf/tree/master/packages/turf-union
[unkink-polygon]: https://github.com/Turfjs/turf/tree/master/packages/turf-unkink-polygon
[voronoi]: https://github.com/Turfjs/turf/tree/master/packages/turf-voronoi
