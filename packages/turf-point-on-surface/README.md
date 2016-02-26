# turf-point-on-surface

[![build status](https://secure.travis-ci.org/Turfjs/turf-point-on-surface.png)](http://travis-ci.org/Turfjs/turf-point-on-surface)

turf point-on-surface module


### `turf.point-on-surface(input)`

Takes a feature and returns a Point guaranteed to be on the surface of the feature.

* Given a Polygon, the point will be in the area of the polygon
* Given a LineString, the point will be along the string
* Given a Point, the point will the same as the input


### Parameters

| parameter | type                       | description                    |
| --------- | -------------------------- | ------------------------------ |
| `input`   | Feature\,FeatureCollection | any feature or set of features |


### Example

```js
// create a random polygon
var polygon = turf.random('polygon');

//=polygon

var pointOnPolygon = turf.pointOnSurface(polygon);

var resultFeatures = polygon.features.concat(pointOnPolygon);
var result = {
  "type": "FeatureCollection",
  "features": resultFeatures
};

//=result
```


**Returns** `Feature`, a point on the surface of `input`

## Installation

Requires [nodejs](http://nodejs.org/).

```sh
$ npm install turf-point-on-surface
```

## Tests

```sh
$ npm test
```


