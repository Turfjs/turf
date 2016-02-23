# turf-kinks

[![build status](https://secure.travis-ci.org/Turfjs/turf-kinks.png)](http://travis-ci.org/Turfjs/turf-kinks)

turf kinks module


### `turf.kinks(polygon)`

Takes a Polygon|polygon and returns Point|points at all self-intersections.


### Parameters

| parameter | type                 | description   |
| --------- | -------------------- | ------------- |
| `polygon` | Feature\.\<Polygon\> | input polygon |


### Example

```js
var poly = {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "Polygon",
    "coordinates": [[
      [-12.034835, 8.901183],
      [-12.060413, 8.899826],
      [-12.03638, 8.873199],
      [-12.059383, 8.871418],
      [-12.034835, 8.901183]
    ]]
  }
};

var kinks = turf.kinks(poly);

var resultFeatures = kinks.intersections.features.concat(poly);
var result = {
  "type": "FeatureCollection",
  "features": resultFeatures
};

//=result
```


**Returns** `FeatureCollection.<Point>`, self-intersections

## Installation

Requires [nodejs](http://nodejs.org/).

```sh
$ npm install turf-kinks
```

## Tests

```sh
$ npm test
```


