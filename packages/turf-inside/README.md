# turf-inside

[![build status](https://secure.travis-ci.org/Turfjs/turf-inside.png)](http://travis-ci.org/Turfjs/turf-inside)

turf inside module


### `turf.inside(point, polygon)`

Takes a Point and a Polygon or MultiPolygon and determines if the point resides inside the polygon. The polygon can
be convex or concave. The function accounts for holes.


### Parameters

| parameter | type                              | description                   |
| --------- | --------------------------------- | ----------------------------- |
| `point`   | Feature\.\<Point\>                | input point                   |
| `polygon` | Feature\.\<Polygon|MultiPolygon\> | input polygon or multipolygon |


### Example

```js
var pt1 = {
  "type": "Feature",
  "properties": {
    "marker-color": "#f00"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [-111.467285, 40.75766]
  }
};
var pt2 = {
  "type": "Feature",
  "properties": {
    "marker-color": "#0f0"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [-111.873779, 40.647303]
  }
};
var poly = {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "Polygon",
    "coordinates": [[
      [-112.074279, 40.52215],
      [-112.074279, 40.853293],
      [-111.610107, 40.853293],
      [-111.610107, 40.52215],
      [-112.074279, 40.52215]
    ]]
  }
};

var features = {
  "type": "FeatureCollection",
  "features": [pt1, pt2, poly]
};

//=features

var isInside1 = turf.inside(pt1, poly);
//=isInside1

var isInside2 = turf.inside(pt2, poly);
//=isInside2
```


**Returns** `Boolean`, `true` if the Point is inside the Polygon; `false` if the Point is not inside the Polygon

## Installation

Requires [nodejs](http://nodejs.org/).

```sh
$ npm install turf-inside
```

## Tests

```sh
$ npm test
```


