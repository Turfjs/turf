# turf-invariant

# getCoord

Unwrap a coordinate from a Feature with a Point geometry, a Point
geometry, or a single coordinate.

**Parameters**

-   `obj` **Any** any value

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)>** a coordinate

# geojsonType

Enforce expectations about types of GeoJSON objects for Turf.

**Parameters**

-   `value` **GeoJSON** any GeoJSON object
-   `type` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** expected GeoJSON type
-   `name` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** name of calling function


-   Throws **[Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)** if value is not the expected type.

# featureOf

Enforce expectations about types of [Feature](Feature) inputs for Turf.
Internally this uses [geojsonType](geojsonType) to judge geometry types.

**Parameters**

-   `feature` **Feature** a feature with an expected geometry type
-   `type` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** expected GeoJSON type
-   `name` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** name of calling function


-   Throws **[Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)** error if value is not the expected type.

# collectionOf

Enforce expectations about types of [FeatureCollection](FeatureCollection) inputs for Turf.
Internally this uses [geojsonType](geojsonType) to judge geometry types.

**Parameters**

-   `featurecollection` **FeatureCollection** a featurecollection for which features will be judged
-   `type` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** expected GeoJSON type
-   `name` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** name of calling function


-   Throws **[Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)** if value is not the expected type.

---

This module is part of the [Turfjs project](http://turfjs.org/), an open source
module collection dedicated to geographic algorithms. It is maintained in the
[Turfjs/turf](https://github.com/Turfjs/turf) repository, where you can create
PRs and issues.

### Installation

Install this module individually:

```sh
$ npm install turf-invariant
```

Or install the Turf module that includes it as a function:

```sh
$ npm install turf
```
