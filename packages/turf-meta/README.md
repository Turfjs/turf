# @turf/meta

# coordEachCallback

Callback for coordEach

**Parameters**

-   `currentCoord` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)>** The current coordinate being processed.
-   `coordIndex` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** The current index of the coordinate being processed.
    Starts at index 0.
-   `featureIndex` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** The current index of the feature being processed.
-   `featureSubIndex` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** The current subIndex of the feature being processed.
-   `geojson`  
-   `callback`  
-   `excludeWrapCoord`  

# coordEach

Iterate over coordinates in any GeoJSON object, similar to Array.forEach()

**Parameters**

-   `geojson` **([FeatureCollection](http://geojson.org/geojson-spec.html#feature-collection-objects) \| [Feature](http://geojson.org/geojson-spec.html#feature-objects) \| [Geometry](http://geojson.org/geojson-spec.html#geometry))** any GeoJSON object
-   `callback` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** a method that takes (currentCoord, coordIndex, featureIndex, featureSubIndex)
-   `excludeWrapCoord` **\[[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)]** whether or not to include the final coordinate of LinearRings that wraps the ring in its iteration. (optional, default `false`)

**Examples**

```javascript
var features = turf.featureCollection([
  turf.point([26, 37], {"foo": "bar"}),
  turf.point([36, 53], {"hello": "world"})
]);

turf.coordEach(features, function (currentCoord, coordIndex, featureIndex, featureSubIndex) {
  //=currentCoord
  //=coordIndex
  //=featureIndex
  //=featureSubIndex
});
```

# coordReduce

Reduce coordinates in any GeoJSON object, similar to Array.reduce()

**Parameters**

-   `geojson` **([FeatureCollection](http://geojson.org/geojson-spec.html#feature-collection-objects) \| [Geometry](http://geojson.org/geojson-spec.html#geometry) \| [Feature](http://geojson.org/geojson-spec.html#feature-objects))** any GeoJSON object
-   `callback` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** a method that takes (previousValue, currentCoord, coordIndex)
-   `initialValue` **\[Any]** Value to use as the first argument to the first call of the callback.
-   `excludeWrapCoord` **\[[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)]** whether or not to include the final coordinate of LinearRings that wraps the ring in its iteration. (optional, default `false`)

**Examples**

```javascript
var features = turf.featureCollection([
  turf.point([26, 37], {"foo": "bar"}),
  turf.point([36, 53], {"hello": "world"})
]);

turf.coordReduce(features, function (previousValue, currentCoord, coordIndex, featureIndex, featureSubIndex) {
  //=previousValue
  //=currentCoord
  //=coordIndex
  //=featureIndex
  //=featureSubIndex
  return currentCoord;
});
```

Returns **Any** The value that results from the reduction.

# coordReduceCallback

Callback for coordReduce

The first time the callback function is called, the values provided as arguments depend
on whether the reduce method has an initialValue argument.

If an initialValue is provided to the reduce method:

-   The previousValue argument is initialValue.
-   The currentValue argument is the value of the first element present in the array.

If an initialValue is not provided:

-   The previousValue argument is the value of the first element present in the array.
-   The currentValue argument is the value of the second element present in the array.

**Parameters**

-   `previousValue` **Any** The accumulated value previously returned in the last invocation
    of the callback, or initialValue, if supplied.
-   `currentCoord` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)>** The current coordinate being processed.
-   `coordIndex` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** The current index of the coordinate being processed.
    Starts at index 0, if an initialValue is provided, and at index 1 otherwise.
-   `featureIndex` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** The current index of the feature being processed.
-   `featureSubIndex` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** The current subIndex of the feature being processed.
-   `geojson`  
-   `callback`  
-   `initialValue`  
-   `excludeWrapCoord`  

# propEach

Iterate over properties in any GeoJSON object, similar to Array.forEach()

**Parameters**

-   `geojson` **([FeatureCollection](http://geojson.org/geojson-spec.html#feature-collection-objects) \| [Feature](http://geojson.org/geojson-spec.html#feature-objects))** any GeoJSON object
-   `callback` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** a method that takes (currentProperties, featureIndex)

**Examples**

```javascript
var features = turf.featureCollection([
    turf.point([26, 37], {foo: 'bar'}),
    turf.point([36, 53], {hello: 'world'})
]);

turf.propEach(features, function (currentProperties, featureIndex) {
  //=currentProperties
  //=featureIndex
});
```

# propEachCallback

Callback for propEach

**Parameters**

-   `currentProperties` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** The current properties being processed.
-   `featureIndex` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** The index of the current element being processed in the
    array.Starts at index 0, if an initialValue is provided, and at index 1 otherwise.
-   `geojson`  
-   `callback`  

# propReduceCallback

Callback for propReduce

The first time the callback function is called, the values provided as arguments depend
on whether the reduce method has an initialValue argument.

If an initialValue is provided to the reduce method:

-   The previousValue argument is initialValue.
-   The currentValue argument is the value of the first element present in the array.

If an initialValue is not provided:

-   The previousValue argument is the value of the first element present in the array.
-   The currentValue argument is the value of the second element present in the array.

**Parameters**

-   `previousValue` **Any** The accumulated value previously returned in the last invocation
    of the callback, or initialValue, if supplied.
-   `currentProperties` **Any** The current properties being processed.
-   `featureIndex` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** The index of the current element being processed in the
    array.Starts at index 0, if an initialValue is provided, and at index 1 otherwise.
-   `geojson`  
-   `callback`  
-   `initialValue`  

# propReduce

Reduce properties in any GeoJSON object into a single value,
similar to how Array.reduce works. However, in this case we lazily run
the reduction, so an array of all properties is unnecessary.

**Parameters**

-   `geojson` **([FeatureCollection](http://geojson.org/geojson-spec.html#feature-collection-objects) \| [Feature](http://geojson.org/geojson-spec.html#feature-objects))** any GeoJSON object
-   `callback` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** a method that takes (previousValue, currentProperties, featureIndex)
-   `initialValue` **\[Any]** Value to use as the first argument to the first call of the callback.

**Examples**

```javascript
var features = turf.featureCollection([
    turf.point([26, 37], {foo: 'bar'}),
    turf.point([36, 53], {hello: 'world'})
]);

turf.propReduce(features, function (previousValue, currentProperties, featureIndex) {
  //=previousValue
  //=currentProperties
  //=featureIndex
  return currentProperties
});
```

Returns **Any** The value that results from the reduction.

# featureEachCallback

Callback for featureEach

**Parameters**

-   `currentFeature` **[Feature](http://geojson.org/geojson-spec.html#feature-objects)&lt;any>** The current feature being processed.
-   `featureIndex` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** The index of the current element being processed in the
    array.Starts at index 0, if an initialValue is provided, and at index 1 otherwise.
-   `geojson`  
-   `options`  
-   `callback`  

# featureEach

Iterate over features in any GeoJSON object, similar to
Array.forEach.

**Parameters**

-   `geojson` **([FeatureCollection](http://geojson.org/geojson-spec.html#feature-collection-objects) \| [Feature](http://geojson.org/geojson-spec.html#feature-objects) \| [Geometry](http://geojson.org/geojson-spec.html#geometry))** any GeoJSON object
-   `options` **\[[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)]** Extra options, if not provided, this param defaults as callback.
    -   `options.allowNull` **\[[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)]** exclude or include null geometries from callback (optional, default `false`)
-   `callback` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** a method that takes (currentFeature, featureIndex)

**Examples**

```javascript
var features = turf.featureCollection([
  turf.point([26, 37], {foo: 'bar'}),
  turf.point([36, 53], {hello: 'world'})
]);

turf.featureEach(features, function (currentFeature, featureIndex) {
  //=currentFeature
  //=featureIndex
});
```

# featureReduceCallback

Callback for featureReduce

The first time the callback function is called, the values provided as arguments depend
on whether the reduce method has an initialValue argument.

If an initialValue is provided to the reduce method:

-   The previousValue argument is initialValue.
-   The currentValue argument is the value of the first element present in the array.

If an initialValue is not provided:

-   The previousValue argument is the value of the first element present in the array.
-   The currentValue argument is the value of the second element present in the array.

**Parameters**

-   `previousValue` **Any** The accumulated value previously returned in the last invocation
    of the callback, or initialValue, if supplied.
-   `currentFeature` **[Feature](http://geojson.org/geojson-spec.html#feature-objects)** The current Feature being processed.
-   `featureIndex` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** The index of the current element being processed in the
    array.Starts at index 0, if an initialValue is provided, and at index 1 otherwise.
-   `geojson`  
-   `options`  
-   `callback`  
-   `initialValue`  

# featureReduce

Reduce features in any GeoJSON object, similar to Array.reduce().

**Parameters**

-   `geojson` **([FeatureCollection](http://geojson.org/geojson-spec.html#feature-collection-objects) \| [Feature](http://geojson.org/geojson-spec.html#feature-objects) \| [Geometry](http://geojson.org/geojson-spec.html#geometry))** any GeoJSON object
-   `options` **\[[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)]** Extra options, if not provided, this param defaults as callback.
    -   `options.allowNull` **\[[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)]** exclude or include null geometries from callback (optional, default `false`)
-   `callback` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** a method that takes (previousValue, currentFeature, featureIndex)
-   `initialValue` **\[Any]** Value to use as the first argument to the first call of the callback.

**Examples**

```javascript
var features = turf.featureCollection([
  turf.point([26, 37], {"foo": "bar"}),
  turf.point([36, 53], {"hello": "world"})
]);

turf.featureReduce(features, function (previousValue, currentFeature, featureIndex) {
  //=previousValue
  //=currentFeature
  //=featureIndex
  return currentFeature
});
```

Returns **Any** The value that results from the reduction.

# coordAll

Get all coordinates from any GeoJSON object.

**Parameters**

-   `geojson` **([FeatureCollection](http://geojson.org/geojson-spec.html#feature-collection-objects) \| [Feature](http://geojson.org/geojson-spec.html#feature-objects) \| [Geometry](http://geojson.org/geojson-spec.html#geometry))** any GeoJSON object

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

# geomEachCallback

Callback for geomEach

**Parameters**

-   `currentGeometry` **[Geometry](http://geojson.org/geojson-spec.html#geometry)** The current geometry being processed.
-   `currentIndex` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** The index of the current element being processed in the
    array. Starts at index 0, if an initialValue is provided, and at index 1 otherwise.
-   `currentProperties` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** The current feature properties being processed.
-   `geojson`  
-   `options`  
-   `callback`  

# geomEach

Iterate over each geometry in any GeoJSON object, similar to Array.forEach()

**Parameters**

-   `geojson` **([FeatureCollection](http://geojson.org/geojson-spec.html#feature-collection-objects) \| [Feature](http://geojson.org/geojson-spec.html#feature-objects) \| [Geometry](http://geojson.org/geojson-spec.html#geometry))** any GeoJSON object
-   `options` **\[[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)]** Extra options, if not provided, this param defaults as callback.
    -   `options.allowNull` **\[[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)]** exclude or include null geometries from callback (optional, default `false`)
-   `callback` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** a method that takes (currentGeometry, featureIndex, currentProperties)

**Examples**

```javascript
var features = turf.featureCollection([
    turf.point([26, 37], {foo: 'bar'}),
    turf.point([36, 53], {hello: 'world'})
]);

turf.geomEach(features, function (currentGeometry, featureIndex, currentProperties) {
  //=currentGeometry
  //=featureIndex
  //=currentProperties
});
```

# geomReduceCallback

Callback for geomReduce

The first time the callback function is called, the values provided as arguments depend
on whether the reduce method has an initialValue argument.

If an initialValue is provided to the reduce method:

-   The previousValue argument is initialValue.
-   The currentValue argument is the value of the first element present in the array.

If an initialValue is not provided:

-   The previousValue argument is the value of the first element present in the array.
-   The currentValue argument is the value of the second element present in the array.

**Parameters**

-   `previousValue` **Any** The accumulated value previously returned in the last invocation
    of the callback, or initialValue, if supplied.
-   `currentGeometry` **[Geometry](http://geojson.org/geojson-spec.html#geometry)** The current Feature being processed.
-   `currentIndex` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** The index of the current element being processed in the
    array.Starts at index 0, if an initialValue is provided, and at index 1 otherwise.
-   `currentProperties` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** The current feature properties being processed.
-   `geojson`  
-   `options`  
-   `callback`  
-   `initialValue`  

# geomReduce

Reduce geometry in any GeoJSON object, similar to Array.reduce().

**Parameters**

-   `geojson` **([FeatureCollection](http://geojson.org/geojson-spec.html#feature-collection-objects) \| [Feature](http://geojson.org/geojson-spec.html#feature-objects) \| [Geometry](http://geojson.org/geojson-spec.html#geometry))** any GeoJSON object
-   `options` **\[[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)]** Extra options, if not provided, this param defaults as callback.
    -   `options.allowNull` **\[[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)]** exclude or include null geometries from callback (optional, default `false`)
-   `callback` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** a method that takes (previousValue, currentGeometry, featureIndex, currentProperties)
-   `initialValue` **\[Any]** Value to use as the first argument to the first call of the callback.

**Examples**

```javascript
var features = turf.featureCollection([
    turf.point([26, 37], {foo: 'bar'}),
    turf.point([36, 53], {hello: 'world'})
]);

turf.geomReduce(features, function (previousValue, currentGeometry, featureIndex, currentProperties) {
  //=previousValue
  //=currentGeometry
  //=featureIndex
  //=currentProperties
  return currentGeometry
});
```

Returns **Any** The value that results from the reduction.

# flattenEachCallback

Callback for flattenEach

**Parameters**

-   `currentFeature` **[Feature](http://geojson.org/geojson-spec.html#feature-objects)** The current flattened feature being processed.
-   `featureIndex` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** The index of the current element being processed in the
    array. Starts at index 0, if an initialValue is provided, and at index 1 otherwise.
-   `featureSubIndex` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** The subindex of the current element being processed in the
    array. Starts at index 0 and increases if the flattened feature was a multi-geometry.
-   `geojson`  
-   `options`  
-   `callback`  

# flattenEach

Iterate over flattened features in any GeoJSON object, similar to
Array.forEach.

**Parameters**

-   `geojson` **([FeatureCollection](http://geojson.org/geojson-spec.html#feature-collection-objects) \| [Feature](http://geojson.org/geojson-spec.html#feature-objects) \| [Geometry](http://geojson.org/geojson-spec.html#geometry))** any GeoJSON object
-   `options` **\[[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)]** Extra options, if not provided, this param defaults as callback.
    -   `options.allowNull` **\[[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)]** exclude or include null geometries from callback (optional, default `false`)
-   `callback` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** a method that takes (currentFeature, featureIndex, featureSubIndex)

**Examples**

```javascript
var features = turf.featureCollection([
    turf.point([26, 37], {foo: 'bar'}),
    turf.multiPoint([[40, 30], [36, 53]], {hello: 'world'})
]);

turf.flattenEach(features, function (currentFeature, featureIndex, featureSubIndex) {
  //=currentFeature
  //=featureIndex
  //=featureSubIndex
});
```

# flattenReduceCallback

Callback for flattenReduce

The first time the callback function is called, the values provided as arguments depend
on whether the reduce method has an initialValue argument.

If an initialValue is provided to the reduce method:

-   The previousValue argument is initialValue.
-   The currentValue argument is the value of the first element present in the array.

If an initialValue is not provided:

-   The previousValue argument is the value of the first element present in the array.
-   The currentValue argument is the value of the second element present in the array.

**Parameters**

-   `previousValue` **Any** The accumulated value previously returned in the last invocation
    of the callback, or initialValue, if supplied.
-   `currentFeature` **[Feature](http://geojson.org/geojson-spec.html#feature-objects)** The current Feature being processed.
-   `featureIndex` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** The index of the current element being processed in the
    array.Starts at index 0, if an initialValue is provided, and at index 1 otherwise.
-   `featureSubIndex` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** The subindex of the current element being processed in the
    array. Starts at index 0 and increases if the flattened feature was a multi-geometry.
-   `geojson`  
-   `options`  
-   `callback`  
-   `initialValue`  

# flattenReduce

Reduce flattened features in any GeoJSON object, similar to Array.reduce().

**Parameters**

-   `geojson` **([FeatureCollection](http://geojson.org/geojson-spec.html#feature-collection-objects) \| [Feature](http://geojson.org/geojson-spec.html#feature-objects) \| [Geometry](http://geojson.org/geojson-spec.html#geometry))** any GeoJSON object
-   `options` **\[[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)]** Extra options, if not provided, this param defaults as callback.
    -   `options.allowNull` **\[[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)]** exclude or include null geometries from callback (optional, default `false`)
-   `callback` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** a method that takes (previousValue, currentFeature, featureIndex, featureSubIndex)
-   `initialValue` **\[Any]** Value to use as the first argument to the first call of the callback.

**Examples**

```javascript
var features = turf.featureCollection([
    turf.point([26, 37], {foo: 'bar'}),
    turf.multiPoint([[40, 30], [36, 53]], {hello: 'world'})
]);

turf.flattenReduce(features, function (previousValue, currentFeature, featureIndex, featureSubIndex) {
  //=previousValue
  //=currentFeature
  //=featureIndex
  //=featureSubIndex
  return currentFeature
});
```

Returns **Any** The value that results from the reduction.

# segmentEachCallback

Callback for segmentEach

**Parameters**

-   `currentSegment` **[Feature](http://geojson.org/geojson-spec.html#feature-objects)&lt;[LineString](http://geojson.org/geojson-spec.html#linestring)>** The current segment being processed.
-   `featureIndex` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** The index of the current element being processed in the array, starts at index 0.
-   `featureSubIndex` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** The subindex of the current element being processed in the
    array. Starts at index 0 and increases for each iterating line segment.
-   `geojson`  
-   `callback`  

Returns **void** 

# segmentEach

Iterate over 2-vertex line segment in any GeoJSON object, similar to Array.forEach()
(Multi)Point geometries do not contain segments therefore they are ignored during this operation.

**Parameters**

-   `geojson` **([FeatureCollection](http://geojson.org/geojson-spec.html#feature-collection-objects) \| [Feature](http://geojson.org/geojson-spec.html#feature-objects) \| [Geometry](http://geojson.org/geojson-spec.html#geometry))** any GeoJSON
-   `callback` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** a method that takes (currentSegment, featureIndex, featureSubIndex)

**Examples**

```javascript
var polygon = turf.polygon([[[-50, 5], [-40, -10], [-50, -10], [-40, 5], [-50, 5]]]);

// Iterate over GeoJSON by 2-vertex segments
turf.segmentEach(polygon, function (currentSegment, featureIndex, featureSubIndex) {
  //= currentSegment
  //= featureIndex
  //= featureSubIndex
});

// Calculate the total number of segments
var total = 0;
turf.segmentEach(polygon, function () {
    total++;
});
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
-   `currentSubIndex` **\[[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)]** The subindex of the current element being processed in the
    array. Starts at index 0 and increases for each iterating line segment.
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
turf.segmentReduce(polygon, function (previousSegment, currentSegment, currentIndex, currentSubIndex) {
  //= previousSegment
  //= currentSegment
  //= currentIndex
  //= currentSubIndex
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

# lineEachCallback

Callback for lineEach

**Parameters**

-   `currentLine` **[Feature](http://geojson.org/geojson-spec.html#feature-objects)&lt;[LineString](http://geojson.org/geojson-spec.html#linestring)>** The current LineString|LinearRing being processed.
-   `lineIndex` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** The index of the current element being processed in the array, starts at index 0.
-   `lineSubIndex` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** The sub-index of the current line being processed at index 0
-   `geojson`  
-   `callback`  

# lineEach

Iterate over line or ring coordinates in LineString, Polygon, MultiLineString, MultiPolygon Features or Geometries,
similar to Array.forEach.

**Parameters**

-   `geojson` **([Geometry](http://geojson.org/geojson-spec.html#geometry) \| [Feature](http://geojson.org/geojson-spec.html#feature-objects)&lt;([LineString](http://geojson.org/geojson-spec.html#linestring) \| [Polygon](http://geojson.org/geojson-spec.html#polygon) \| [MultiLineString](http://geojson.org/geojson-spec.html#multilinestring) \| [MultiPolygon](http://geojson.org/geojson-spec.html#multipolygon))>)** object
-   `callback` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** a method that takes (currentLine, lineIndex, lineSubIndex)

**Examples**

```javascript
var mtLn = turf.multiLineString([
  turf.lineString([[26, 37], [35, 45]]),
  turf.lineString([[36, 53], [38, 50], [41, 55]])
]);

turf.lineEach(mtLn, function (currentLine, lineIndex) {
  //=currentLine
  //=lineIndex
});
```

# lineReduceCallback

Callback for lineReduce

The first time the callback function is called, the values provided as arguments depend
on whether the reduce method has an initialValue argument.

If an initialValue is provided to the reduce method:

-   The previousValue argument is initialValue.
-   The currentValue argument is the value of the first element present in the array.

If an initialValue is not provided:

-   The previousValue argument is the value of the first element present in the array.
-   The currentValue argument is the value of the second element present in the array.

**Parameters**

-   `previousValue` **Any** The accumulated value previously returned in the last invocation
    of the callback, or initialValue, if supplied.
-   `currentLine` **[Feature](http://geojson.org/geojson-spec.html#feature-objects)&lt;[LineString](http://geojson.org/geojson-spec.html#linestring)>** The current LineString|LinearRing being processed.
-   `lineIndex` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** The index of the current element being processed in the
    array. Starts at index 0, if an initialValue is provided, and at index 1 otherwise.
-   `lineSubIndex` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** The sub-index of the current line being processed at index 0
-   `geojson`  
-   `callback`  
-   `initialValue`  

# lineReduce

Reduce features in any GeoJSON object, similar to Array.reduce().

**Parameters**

-   `geojson` **([Geometry](http://geojson.org/geojson-spec.html#geometry) \| [Feature](http://geojson.org/geojson-spec.html#feature-objects)&lt;([LineString](http://geojson.org/geojson-spec.html#linestring) \| [Polygon](http://geojson.org/geojson-spec.html#polygon) \| [MultiLineString](http://geojson.org/geojson-spec.html#multilinestring) \| [MultiPolygon](http://geojson.org/geojson-spec.html#multipolygon))>)** object
-   `callback` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** a method that takes (previousValue, currentFeature, featureIndex)
-   `initialValue` **\[Any]** Value to use as the first argument to the first call of the callback.

**Examples**

```javascript
var mtp = turf.multiPolygon([
  turf.polygon([[[12,48],[2,41],[24,38],[12,48]], [[9,44],[13,41],[13,45],[9,44]]]),
  turf.polygon([[[5, 5], [0, 0], [2, 2], [4, 4], [5, 5]]])
]);

turf.lineReduce(mtp, function (previousValue, currentLine, lineIndex, lineSubIndex) {
  //=previousValue
  //=currentLine
  //=lineIndex
  //=lineSubIndex
  return currentLine
}, 2);
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
