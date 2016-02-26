# turf-within

[![build status](https://secure.travis-ci.org/Turfjs/turf-within.png)](http://travis-ci.org/Turfjs/turf-within)

turf within module


### `turf.within(points, polygons)`

Takes a set of Point|points and a set of Polygon|polygons and returns the points that fall within the polygons.


### Parameters

| parameter  | type                           | description    |
| ---------- | ------------------------------ | -------------- |
| `points`   | FeatureCollection\.\<Point\>   | input points   |
| `polygons` | FeatureCollection\.\<Polygon\> | input polygons |


### Example

```js
var searchWithin = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-46.653,-23.543],
          [-46.634,-23.5346],
          [-46.613,-23.543],
          [-46.614,-23.559],
          [-46.631,-23.567],
          [-46.653,-23.560],
          [-46.653,-23.543]
        ]]
      }
    }
  ]
};
var points = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [-46.6318, -23.5523]
      }
    }, {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [-46.6246, -23.5325]
      }
    }, {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [-46.6062, -23.5513]
      }
    }, {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [-46.663, -23.554]
      }
    }, {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [-46.643, -23.557]
      }
    }
  ]
};

var ptsWithin = turf.within(points, searchWithin);

//=points

//=searchWithin

//=ptsWithin
```


**Returns** `FeatureCollection.<Point>`, points that land within at least one polygon

## Installation

Requires [nodejs](http://nodejs.org/).

```sh
$ npm install turf-within
```

## Tests

```sh
$ npm test
```


