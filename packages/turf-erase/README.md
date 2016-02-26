# turf-difference

[![build status](https://secure.travis-ci.org/Turfjs/turf-difference.png)](http://travis-ci.org/Turfjs/turf-difference)

[Turf](http://turfjs.org/) difference module


### `turf.difference(poly1, poly2)`

Finds the difference between two Polygon|polygons by clipping the second
polygon from the first.


### Parameters

| parameter | type                 | description                                |
| --------- | -------------------- | ------------------------------------------ |
| `poly1`   | Feature\.\<Polygon\> | input Polygon feaure                       |
| `poly2`   | Feature\.\<Polygon\> | Polygon feature to difference from `poly1` |


### Example

```js
var poly1 = {
  "type": "Feature",
  "properties": {
    "fill": "#0f0"
  },
  "geometry": {
    "type": "Polygon",
    "coordinates": [[
      [-46.738586, -23.596711],
      [-46.738586, -23.458207],
      [-46.560058, -23.458207],
      [-46.560058, -23.596711],
      [-46.738586, -23.596711]
    ]]
  }
};
var poly2 = {
  "type": "Feature",
  "properties": {
    "fill": "#00f"
  },
  "geometry": {
    "type": "Polygon",
    "coordinates": [[
      [-46.650009, -23.631314],
      [-46.650009, -23.5237],
      [-46.509246, -23.5237],
      [-46.509246, -23.631314],
      [-46.650009, -23.631314]
    ]]
  }
};

var differenced = turf.difference(poly1, poly2);
differenced.properties.fill = '#f00';

var polygons = {
  "type": "FeatureCollection",
  "features": [poly1, poly2]
};

//=polygons

//=differenced
```


**Returns** `Feature.<Polygon>`, a Polygon feature showing the area of `poly1` excluding the area of `poly2`

## Installation

Requires [nodejs](http://nodejs.org/).

```sh
$ npm install turf-difference
```

## Tests

```sh
$ npm test
```


