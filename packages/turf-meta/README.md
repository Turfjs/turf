# @turf/meta

# coordEach

Iterate over coordinates in any GeoJSON object, similar to
Array.forEach.

**Parameters**

-   `layer` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** any GeoJSON object
-   `callback` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** a method that takes (coords, index)
-   `excludeWrapCoord` **\[[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)]** whether or not to include
    the final coordinate of LinearRings that wraps the ring in its iteration.

**Examples**

```javascript
var point = { type: 'Point', coordinates: [0, 0] };
turfMeta.coordEach(point, function(coords, index) {
  // coords is equal to [0, 0]
  // index is equal to 0
});
```

# coordReduce

Reduce coordinates in any GeoJSON object into a single value,
similar to how Array.reduce works. However, in this case we lazily run
the reduction, so an array of all coordinates is unnecessary.

**Parameters**

-   `layer` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** any GeoJSON object
-   `callback` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** a method that takes (memo, coords, index)
-   `memo` **\[Any]** Value to use as the first argument to the first call of the callback.
-   `excludeWrapCoord` **\[[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)]** whether or not to include
    the final coordinate of LinearRings that wraps the ring in its iteration.

Returns **Any** The value that results from the reduction.

# propEach

Iterate over property objects in any GeoJSON object, similar to
Array.forEach.

**Parameters**

-   `layer` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** any GeoJSON object
-   `callback` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** a method that takes (value)

**Examples**

```javascript
var point = { type: 'Feature', geometry: null, properties: { foo: 1 } };
turfMeta.propEach(point, function(props) {
  // props is equal to { foo: 1}
});
```

# propReduce

Reduce properties in any GeoJSON object into a single value,
similar to how Array.reduce works. However, in this case we lazily run
the reduction, so an array of all properties is unnecessary.

**Parameters**

-   `layer` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** any GeoJSON object
-   `callback` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** a method that takes (memo, coord) and returns
    a new memo
-   `memo` **Any** the starting value of memo: can be any type.

**Examples**

```javascript
// an example of an even more advanced function that gives you the
// javascript type of each property of every feature
function propTypes (layer) {
  opts = opts || {}
  return turfMeta.propReduce(layer, function (prev, props) {
    for (var prop in props) {
      if (prev[prop]) continue
      prev[prop] = typeof props[prop]
    }
  }, {})
}
```

Returns **Any** combined value

# featureEach

Iterate over features in any GeoJSON object, similar to
Array.forEach.

**Parameters**

-   `layer` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** any GeoJSON object
-   `callback` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** a method that takes (feature, index)

**Examples**

```javascript
var feature = { type: 'Feature', geometry: null, properties: {} };
turfMeta.featureEach(feature, function(feature) {
  // feature == feature
});
```

# coordAll

Get all coordinates from any GeoJSON object, returning an array of coordinate
arrays.

**Parameters**

-   `layer` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** any GeoJSON object

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)>>** coordinate position array

# geomEach

Iterate over each geometry in any GeoJSON object, similar to
Array.forEach.

**Parameters**

-   `layer` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** any GeoJSON object
-   `callback` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** a method that takes (value)

**Examples**

```javascript
var point = {
  type: 'Feature',
  geometry: { type: 'Point', coordinates: [0, 0] },
  properties: {}
};
turfMeta.geomEach(point, function(geom) {
  // geom is the point geometry
});
```

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
