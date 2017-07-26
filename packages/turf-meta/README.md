# @turf/meta

# coordEach

Iterate over coordinates in any GeoJSON object, similar to Array.forEach()

**Parameters**

-   `geojson` **([FeatureCollection](http://geojson.org/geojson-spec.html#feature-collection-objects) \| [Geometry](http://geojson.org/geojson-spec.html#geometry) \| [Feature](http://geojson.org/geojson-spec.html#feature-objects)&lt;any>)** any GeoJSON object
-   `callback` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** a method that takes (currentCoords, currentIndex)
-   `excludeWrapCoord` **\[[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)]** whether or not to include the final coordinate of LinearRings that wraps the ring in its iteration. (optional, default `false`)

**Examples**

```javascript
var features = turf.featureCollection([
  turf.point([26, 37], {"foo": "bar"}),
  turf.point([36, 53], {"hello": "world"})
]);
turf.coordEach(features, function (currentCoords, currentIndex) {
  //=currentCoords
  //=currentIndex
});
```

# coordReduce

Reduce coordinates in any GeoJSON object, similar to Array.reduce()

**Parameters**

-   `geojson` **([FeatureCollection](http://geojson.org/geojson-spec.html#feature-collection-objects) \| [Geometry](http://geojson.org/geojson-spec.html#geometry) \| [Feature](http://geojson.org/geojson-spec.html#feature-objects)&lt;any>)** any GeoJSON object
-   `callback` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** a method that takes (previousValue, currentCoords, currentIndex)
-   `initialValue` **\[Any]** Value to use as the first argument to the first call of the callback.
-   `excludeWrapCoord` **\[[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)]** whether or not to include the final coordinate of LinearRings that wraps the ring in its iteration. (optional, default `false`)

**Examples**

```javascript
var features = turf.featureCollection([
  turf.point([26, 37], {"foo": "bar"}),
  turf.point([36, 53], {"hello": "world"})
]);

turf.coordReduce(features, function (previousValue, currentCoords, currentIndex) {
  //=previousValue
  //=currentCoords
  //=currentIndex
  return currentCoords;
});
```

Returns **Any** The value that results from the reduction.

# propEach

Iterate over properties in any GeoJSON object, similar to Array.forEach()

**Parameters**

-   `geojson` **([FeatureCollection](http://geojson.org/geojson-spec.html#feature-collection-objects) \| [Feature](http://geojson.org/geojson-spec.html#feature-objects)&lt;any>)** any GeoJSON object
-   `callback` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** a method that takes (currentProperties, currentIndex)

**Examples**

```javascript
var features = turf.featureCollection([
    turf.point([26, 37], {foo: 'bar'}),
    turf.point([36, 53], {hello: 'world'})
]);

turf.propEach(features, function (currentProperties, currentIndex) {
  //=currentProperties
  //=currentIndex
});
```

# propReduce

Reduce properties in any GeoJSON object into a single value,
similar to how Array.reduce works. However, in this case we lazily run
the reduction, so an array of all properties is unnecessary.

**Parameters**

-   `geojson` **([FeatureCollection](http://geojson.org/geojson-spec.html#feature-collection-objects) \| [Feature](http://geojson.org/geojson-spec.html#feature-objects)&lt;any>)** any GeoJSON object
-   `callback` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** a method that takes (previousValue, currentProperties, currentIndex)
-   `initialValue` **\[Any]** Value to use as the first argument to the first call of the callback.

**Examples**

```javascript
var features = turf.featureCollection([
    turf.point([26, 37], {foo: 'bar'}),
    turf.point([36, 53], {hello: 'world'})
]);
turf.propReduce(features, function (previousValue, currentProperties, currentIndex) {
  //=previousValue
  //=currentProperties
  //=currentIndex
  return currentProperties
});
```

Returns **Any** The value that results from the reduction.

# featureEach

Iterate over features in any GeoJSON object, similar to
Array.forEach.

**Parameters**

-   `geojson` **([Geometry](http://geojson.org/geojson-spec.html#geometry) \| [FeatureCollection](http://geojson.org/geojson-spec.html#feature-collection-objects) \| [Feature](http://geojson.org/geojson-spec.html#feature-objects)&lt;any>)** any GeoJSON object
-   `callback` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** a method that takes (currentFeature, currentIndex)

**Examples**

```javascript
var features = turf.featureCollection([
  turf.point([26, 37], {foo: 'bar'}),
  turf.point([36, 53], {hello: 'world'})
]);

turf.featureEach(features, function (currentFeature, currentIndex) {
  //=currentFeature
  //=currentIndex
});
```

# featureReduce

Reduce features in any GeoJSON object, similar to Array.reduce().

**Parameters**

-   `geojson` **([Geometry](http://geojson.org/geojson-spec.html#geometry) \| [FeatureCollection](http://geojson.org/geojson-spec.html#feature-collection-objects) \| [Feature](http://geojson.org/geojson-spec.html#feature-objects)&lt;any>)** any GeoJSON object
-   `callback` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** a method that takes (previousValue, currentFeature, currentIndex)
-   `initialValue` **\[Any]** Value to use as the first argument to the first call of the callback.

**Examples**

```javascript
var features = turf.featureCollection([
  turf.point([26, 37], {foo: 'bar'}),
  turf.point([36, 53], {hello: 'world'})
]);

turf.featureReduce(features, function (previousValue, currentFeature, currentIndex) {
  //=previousValue
  //=currentFeature
  //=currentIndex
  return currentFeature
});
```

Returns **Any** The value that results from the reduction.

# coordAll

Get all coordinates from any GeoJSON object.

**Parameters**

-   `geojson` **([Geometry](http://geojson.org/geojson-spec.html#geometry) \| [FeatureCollection](http://geojson.org/geojson-spec.html#feature-collection-objects) \| [Feature](http://geojson.org/geojson-spec.html#feature-objects)&lt;any>)** any GeoJSON object

**Examples**

```javascript
var features = turf.featureCollection([
  turf.point([26, 37], {foo: 'bar'}),
  turf.point([36, 53], {hello: 'world'})
]);

var coords = turf.coordAll(features);
//= [[26, 37], [36, 53]]
```

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)>>** coordinate position array

# geomEach

Iterate over each geometry in any GeoJSON object, similar to Array.forEach()

**Parameters**

-   `geojson` **([Geometry](http://geojson.org/geojson-spec.html#geometry) \| [FeatureCollection](http://geojson.org/geojson-spec.html#feature-collection-objects) \| [Feature](http://geojson.org/geojson-spec.html#feature-objects)&lt;any>)** any GeoJSON object
-   `callback` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** a method that takes (currentGeometry, currentIndex, currentProperties)

**Examples**

```javascript
var features = turf.featureCollection([
    turf.point([26, 37], {foo: 'bar'}),
    turf.point([36, 53], {hello: 'world'})
]);

turf.geomEach(features, function (currentGeometry, currentIndex, currentProperties) {
  //=currentGeometry
  //=currentIndex
  //=currentProperties
});
```

# geomReduce

Reduce geometry in any GeoJSON object, similar to Array.reduce().

**Parameters**

-   `geojson` **([Geometry](http://geojson.org/geojson-spec.html#geometry) \| [FeatureCollection](http://geojson.org/geojson-spec.html#feature-collection-objects) \| [Feature](http://geojson.org/geojson-spec.html#feature-objects)&lt;any>)** any GeoJSON object
-   `callback` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** a method that takes (previousValue, currentGeometry, currentIndex, currentProperties)
-   `initialValue` **\[Any]** Value to use as the first argument to the first call of the callback.

**Examples**

```javascript
var features = turf.featureCollection([
    turf.point([26, 37], {foo: 'bar'}),
    turf.point([36, 53], {hello: 'world'})
]);

turf.geomReduce(features, function (previousValue, currentGeometry, currentIndex) {
  //=previousValue
  //=currentGeometry
  //=currentIndex
  return currentGeometry
});
```

Returns **Any** The value that results from the reduction.

# flattenEach

Iterate over flattened features in any GeoJSON object, similar to
Array.forEach.

**Parameters**

-   `geojson` **([Geometry](http://geojson.org/geojson-spec.html#geometry) \| [FeatureCollection](http://geojson.org/geojson-spec.html#feature-collection-objects) \| [Feature](http://geojson.org/geojson-spec.html#feature-objects)&lt;any>)** any GeoJSON object
-   `callback` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** a method that takes (currentFeature, currentIndex, currentSubIndex)

**Examples**

```javascript
var features = turf.featureCollection([
    turf.point([26, 37], {foo: 'bar'}),
    turf.multiPoint([[40, 30], [36, 53]], {hello: 'world'})
]);

turf.flattenEach(features, function (currentFeature, currentIndex, currentSubIndex) {
  //=currentFeature
  //=currentIndex
  //=currentSubIndex
});
```

# flattenReduce

Reduce flattened features in any GeoJSON object, similar to Array.reduce().

**Parameters**

-   `geojson` **([Geometry](http://geojson.org/geojson-spec.html#geometry) \| [FeatureCollection](http://geojson.org/geojson-spec.html#feature-collection-objects) \| [Feature](http://geojson.org/geojson-spec.html#feature-objects)&lt;any>)** any GeoJSON object
-   `callback` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** a method that takes (previousValue, currentFeature, currentIndex, currentSubIndex)
-   `initialValue` **\[Any]** Value to use as the first argument to the first call of the callback.

**Examples**

```javascript
var features = turf.featureCollection([
    turf.point([26, 37], {foo: 'bar'}),
    turf.multiPoint([[40, 30], [36, 53]], {hello: 'world'})
]);

turf.flattenReduce(features, function (previousValue, currentFeature, currentIndex, currentSubIndex) {
  //=previousValue
  //=currentFeature
  //=currentIndex
  //=currentSubIndex
  return currentFeature
});
```

Returns **Any** The value that results from the reduction.

# segmentEachCallback

Callback for segmentEach

**Parameters**

-   `currentSegment` **\[[Feature](http://geojson.org/geojson-spec.html#feature-objects)&lt;[LineString](http://geojson.org/geojson-spec.html#linestring)>]** The current segment being processed.
-   `currentIndex` **\[[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)]** The index of the current element being processed in the array, starts at index 0.
-   `geojson`  
-   `callback`  

Returns **void** 

# segmentEach

Iterate over 2-vertex line segment in any GeoJSON object, similar to Array.forEach()
(Multi)Point geometries do not contain segments therefore they are ignored during this operation.

**Parameters**

-   `geojson` **([FeatureCollection](http://geojson.org/geojson-spec.html#feature-collection-objects) \| [Feature](http://geojson.org/geojson-spec.html#feature-objects) \| [Geometry](http://geojson.org/geojson-spec.html#geometry))** any GeoJSON
-   `callback` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** a method that takes (currentSegment, currentIndex)

**Examples**

```javascript
var polygon = turf.polygon([[[-50, 5], [-40, -10], [-50, -10], [-40, 5], [-50, 5]]]);

// Iterate over GeoJSON by 2-vertex segments
turf.segmentEach(polygon, function (currentSegment, currentIndex) {
  //= currentSegment
  //= currentIndex
});

// Calculate the total number of segments
var total = 0;
var initialValue = 0;
turf.segmentEach(polygon, function () {
    total++;
}, initialValue);
```

Returns **void** 

# segmentReduceCallback

Callback for segmentReduce

The first time the callback function is called, the values provided as arguments depend
on whether the reduce method has an initialValue argument.

If an initialValue is provided to the reduce method:

-   The previousValue argument is initialValue.
-   The currentValue argument is the value of the first element present in the array.

If an initialValue is not provided:

-   The previousValue argument is the value of the first element present in the array.
-   The currentValue argument is the value of the second element present in the array.

**Parameters**

-   `previousValue` **\[Any]** The accumulated value previously returned in the last invocation
    of the callback, or initialValue, if supplied.
-   `currentSegment` **\[[Feature](http://geojson.org/geojson-spec.html#feature-objects)&lt;[LineString](http://geojson.org/geojson-spec.html#linestring)>]** The current segment being processed.
-   `currentIndex` **\[[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)]** The index of the current element being processed in the
    array. Starts at index 0, if an initialValue is provided, and at index 1 otherwise.
-   `geojson`  
-   `callback`  
-   `initialValue`  

# segmentReduce

Reduce 2-vertex line segment in any GeoJSON object, similar to Array.reduce()
(Multi)Point geometries do not contain segments therefore they are ignored during this operation.

**Parameters**

-   `geojson` **([FeatureCollection](http://geojson.org/geojson-spec.html#feature-collection-objects) \| [Feature](http://geojson.org/geojson-spec.html#feature-objects) \| [Geometry](http://geojson.org/geojson-spec.html#geometry))** any GeoJSON
-   `callback` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** a method that takes (previousValue, currentSegment, currentIndex)
-   `initialValue` **\[Any]** Value to use as the first argument to the first call of the callback.

**Examples**

```javascript
var polygon = turf.polygon([[[-50, 5], [-40, -10], [-50, -10], [-40, 5], [-50, 5]]]);

// Iterate over GeoJSON by 2-vertex segments
turf.segmentReduce(polygon, function (previousSegment, currentSegment, currentIndex) {
  //= previousSegment
  //= currentSegment
  //= currentIndex
  return currentSegment
});

// Calculate the total number of segments
var initialValue = 0
var total = turf.segmentReduce(polygon, function (previousValue) {
    previousValue++;
    return previousValue;
}, initialValue);
```

Returns **void** 

<!-- This file is automatically generated. Please don't edit it directly:
if you find an error, edit the source file (likely index.js), and re-run
./scripts/generate-readmes in the turf project. -->

---

This module is part of the [Turfjs project](http://turfjs.org/), an open source
module collection dedicated to geographic algorithms. It is maintained in the
[Turfjs/turf](https://github.com/Turfjs/turf) repository, where you can create
PRs and issues.

### Installation

Install this module individually:

```sh
$ npm install @turf/meta
```

Or install the Turf module that includes it as a function:

```sh
$ npm install @turf/turf
```
