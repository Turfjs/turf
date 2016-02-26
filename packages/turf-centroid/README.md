# turf-centroid

[![build status](https://secure.travis-ci.org/Turfjs/turf-centroid.png)](http://travis-ci.org/Turfjs/turf-centroid)

turf centroid module


### `turf.centroid(features)`

Takes one or more features and calculates the centroid using the arithmetic mean of all vertices.
This lessens the effect of small islands and artifacts when calculating
the centroid of a set of polygons.


### Parameters

| parameter  | type                       | description    |
| ---------- | -------------------------- | -------------- |
| `features` | Feature\,FeatureCollection | input features |


### Example

```js
var poly = {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "Polygon",
    "coordinates": [[
      [105.818939,21.004714],
      [105.818939,21.061754],
      [105.890007,21.061754],
      [105.890007,21.004714],
      [105.818939,21.004714]
    ]]
  }
};

var centroidPt = turf.centroid(poly);

var result = {
  "type": "FeatureCollection",
  "features": [poly, centroidPt]
};

//=result
```


**Returns** `Feature.<Point>`, the centroid of the input features

## Installation

Requires [nodejs](http://nodejs.org/).

```sh
$ npm install turf-centroid
```

## Tests

```sh
$ npm test
```


