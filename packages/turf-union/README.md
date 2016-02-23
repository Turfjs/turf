# turf-union

[![build status](https://secure.travis-ci.org/Turfjs/turf-union.png)](http://travis-ci.org/Turfjs/turf-union)

find the union of geographic features


### `turf.union(poly1, poly2)`

Takes two Polygon|polygons and returns a combined polygon. If the input polygons are not contiguous, this function returns a MultiPolygon feature.


### Parameters

| parameter | type                 | description           |
| --------- | -------------------- | --------------------- |
| `poly1`   | Feature\.\<Polygon\> | input polygon         |
| `poly2`   | Feature\.\<Polygon\> | another input polygon |


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
      [-82.574787, 35.594087],
      [-82.574787, 35.615581],
      [-82.545261, 35.615581],
      [-82.545261, 35.594087],
      [-82.574787, 35.594087]
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
      [-82.560024, 35.585153],
      [-82.560024, 35.602602],
      [-82.52964, 35.602602],
      [-82.52964, 35.585153],
      [-82.560024, 35.585153]
    ]]
  }
};
var polygons = {
  "type": "FeatureCollection",
  "features": [poly1, poly2]
};

var union = turf.union(poly1, poly2);

//=polygons

//=union
```


**Returns** `Feature.<Polygon|MultiPolygon>`, a combined Polygon or MultiPolygon feature

## Installation

Requires [nodejs](http://nodejs.org/).

```sh
$ npm install turf-union
```

## Tests

```sh
$ npm test
```


