# turf-meta

# coordEach

Iterate over coordinates in any GeoJSON object, similar to
Array.forEach.

**Parameters**

-   `layer` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** any GeoJSON object
-   `callback` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** a method that takes (value)
-   `excludeWrapCoord` **\[[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)]** whether or not to include
    the final coordinate of LinearRings that wraps the ring in its iteration.

**Examples**

```javascript
var point = { type: 'Point', coordinates: [0, 0] };
coordEach(point, function(coords) {
  // coords is equal to [0, 0]
});
```

# coordReduce

Reduce coordinates in any GeoJSON object into a single value,
similar to how Array.reduce works. However, in this case we lazily run
the reduction, so an array of all coordinates is unnecessary.

**Parameters**

-   `layer` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** any GeoJSON object
-   `callback` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** a method that takes (memo, value) and returns
    a new memo
-   `memo` **Any** the starting value of memo: can be any type.
-   `excludeWrapCoord` **\[[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)]** whether or not to include
    the final coordinate of LinearRings that wraps the ring in its iteration.

Returns **Any** combined value

# propEach

Iterate over property objects in any GeoJSON object, similar to
Array.forEach.

**Parameters**

-   `layer` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** any GeoJSON object
-   `callback` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** a method that takes (value)

**Examples**

```javascript
var point = { type: 'Feature', geometry: null, properties: { foo: 1 } };
propEach(point, function(props) {
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

Returns **Any** combined value

# featureEach

Iterate over features in any GeoJSON object, similar to
Array.forEach.

**Parameters**

-   `layer` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** any GeoJSON object
-   `callback` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** a method that takes (value)

**Examples**

```javascript
var feature = { type: 'Feature', geometry: null, properties: {} };
featureEach(feature, function(feature) {
  // feature == feature
});
```

# coordAll

Get all coordinates from any GeoJSON object, returning an array of coordinate
arrays.

**Parameters**

-   `layer` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** any GeoJSON object

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)>>** coordinate position array

---

This module is part of the [Turfjs project](http://turfjs.org/), an open source
module collection dedicated to geographic algorithms. It is maintained in the
[Turfjs/turf](https://github.com/Turfjs/turf) repository, where you can create
PRs and issues.

### Installation

Install this module individually:

```sh
$ npm install turf-meta
```

Or install the Turf module that includes it as a function:

```sh
$ npm install turf
```
