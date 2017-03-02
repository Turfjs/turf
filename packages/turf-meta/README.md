# @turf/meta

# coordEach

Iterate over coordinates in any GeoJSON object, similar to Array.forEach()

**Parameters**

-   `layer` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** any GeoJSON object
-   `callback` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** a method that takes (currentCoords, currentIndex)
-   `excludeWrapCoord` **\[[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)]** whether or not to include
    the final coordinate of LinearRings that wraps the ring in its iteration. (optional, default `false`)

**Examples**

```javascript
var features = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [26, 37]
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [36, 53]
      }
    }
  ]
};
turf.coordEach(features, function (currentCoords, currentIndex) {
  //=currentCoords
  //=currentIndex
});
```

# coordReduce

Reduce coordinates in any GeoJSON object, similar to Array.reduce()

**Parameters**

-   `layer` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** any GeoJSON object
-   `callback` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** a method that takes (previousValue, currentCoords, currentIndex)
-   `initialValue` **\[Any]** Value to use as the first argument to the first call of the callback.
-   `excludeWrapCoord` **\[[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)]** whether or not to include
    the final coordinate of LinearRings that wraps the ring in its iteration. (optional, default `false`)

**Examples**

```javascript
var features = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [26, 37]
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [36, 53]
      }
    }
  ]
};
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

-   `layer` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** any GeoJSON object
-   `callback` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** a method that takes (currentProperties, currentIndex)

**Examples**

```javascript
var features = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {"foo": "bar"},
      "geometry": {
        "type": "Point",
        "coordinates": [26, 37]
      }
    },
    {
      "type": "Feature",
      "properties": {"hello": "world"},
      "geometry": {
        "type": "Point",
        "coordinates": [36, 53]
      }
    }
  ]
};
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

-   `layer` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** any GeoJSON object
-   `callback` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** a method that takes (previousValue, currentProperties, currentIndex)
-   `initialValue` **\[Any]** Value to use as the first argument to the first call of the callback.

**Examples**

```javascript
var features = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {"foo": "bar"},
      "geometry": {
        "type": "Point",
        "coordinates": [26, 37]
      }
    },
    {
      "type": "Feature",
      "properties": {"hello": "world"},
      "geometry": {
        "type": "Point",
        "coordinates": [36, 53]
      }
    }
  ]
};
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

-   `layer` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** any GeoJSON object
-   `callback` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** a method that takes (currentFeature, currentIndex)

**Examples**

```javascript
var features = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [26, 37]
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [36, 53]
      }
    }
  ]
};
turf.featureEach(features, function (currentFeature, currentIndex) {
  //=currentFeature
  //=currentIndex
});
```

# featureReduce

Reduce features in any GeoJSON object, similar to Array.reduce().

**Parameters**

-   `layer` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** any GeoJSON object
-   `callback` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** a method that takes (previousValue, currentFeature, currentIndex)
-   `initialValue` **\[Any]** Value to use as the first argument to the first call of the callback.

**Examples**

```javascript
var features = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {"foo": "bar"},
      "geometry": {
        "type": "Point",
        "coordinates": [26, 37]
      }
    },
    {
      "type": "Feature",
      "properties": {"hello": "world"},
      "geometry": {
        "type": "Point",
        "coordinates": [36, 53]
      }
    }
  ]
};
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

-   `layer` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** any GeoJSON object

**Examples**

```javascript
var features = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [26, 37]
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [36, 53]
      }
    }
  ]
};
var coords = turf.coordAll(features);
//=coords
```

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)>>** coordinate position array

# geomEach

Iterate over each geometry in any GeoJSON object, similar to Array.forEach()

**Parameters**

-   `layer` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** any GeoJSON object
-   `callback` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** a method that takes (currentGeometry, currentIndex)

**Examples**

```javascript
var features = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [26, 37]
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [36, 53]
      }
    }
  ]
};
turf.geomEach(features, function (currentGeometry, currentIndex) {
  //=currentGeometry
  //=currentIndex
});
```

# geomReduce

Reduce geometry in any GeoJSON object, similar to Array.reduce().

**Parameters**

-   `layer` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** any GeoJSON object
-   `callback` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** a method that takes (previousValue, currentGeometry, currentIndex)
-   `initialValue` **\[Any]** Value to use as the first argument to the first call of the callback.

**Examples**

```javascript
var features = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {"foo": "bar"},
      "geometry": {
        "type": "Point",
        "coordinates": [26, 37]
      }
    },
    {
      "type": "Feature",
      "properties": {"hello": "world"},
      "geometry": {
        "type": "Point",
        "coordinates": [36, 53]
      }
    }
  ]
};
turf.geomReduce(features, function (previousValue, currentGeometry, currentIndex) {
  //=previousValue
  //=currentGeometry
  //=currentIndex
  return currentGeometry
});
```

Returns **Any** The value that results from the reduction.

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
