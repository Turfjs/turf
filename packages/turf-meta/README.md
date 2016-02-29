# turf-meta

[![build status](https://secure.travis-ci.org/Turfjs/turf-meta.png)](http://travis-ci.org/Turfjs/turf-meta)

Functional helpers for Turf modules.

**Why?** Because many turf modules have a similar pattern of running some operation
over every coordinate or property object, etc. This module unifies those patterns
into one structure and make sure that turf is able to handle unusual structures
(geometry roots, null geometries, geometrycollections, and so on). It's also
quite fast - it uses monomorphic functions as much as possible and avoids copying
data unnecessarily.

## coordEach(layer, callback)

Lazily iterate over coordinates in any GeoJSON object, similar to Array.forEach.

* `layer` (`Object`): any GeoJSON object
* `callback` (`Function`): a method that takes (value)

```js
var point = { type: 'Point', coordinates: [0, 0] };
coordEach(point, function(coords) {
  // coords is equal to [0, 0]
});
```

## coordReduce(layer, callback, memo)

Lazily reduce coordinates in any GeoJSON object into a single value, similar to how Array.reduce works. However, in this case we lazily runthe reduction, so an array of all coordinates is unnecessary.

* `layer` (`Object`): any GeoJSON object
* `callback` (`Function`): a method that takes (memo, value) and returns a new memo
* `memo` (``): the starting value of memo: can be any type.

## propEach(layer, callback)

Lazily iterate over property objects in any GeoJSON object, similar to Array.forEach.

* `layer` (`Object`): any GeoJSON object
* `callback` (`Function`): a method that takes (value)

```js
var point = { type: 'Feature', geometry: null, properties: { foo: 1 } };
propEach(point, function(props) {
  // props is equal to { foo: 1}
});
```


## propReduce(layer, callback, memo)

Lazily reduce properties in any GeoJSON object into a single value, similar to how Array.reduce works. However, in this case we lazily runthe reduction, so an array of all properties is unnecessary.

* `layer` (`Object`): any GeoJSON object
* `callback` (`Function`): a method that takes (memo, coord) and returns a new memo
* `memo` (``): the starting value of memo: can be any type.
