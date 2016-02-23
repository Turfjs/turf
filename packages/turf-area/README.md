# turf-area

[![build status](https://secure.travis-ci.org/Turfjs/turf-area.png)](http://travis-ci.org/Turfjs/turf-area)

calculate the area of a polygon or multipolygon feature


### `turf.area(input)`

Takes a one or more features and returns their area
in square meters.


### Parameters

| parameter | type                       | description    |
| --------- | -------------------------- | -------------- |
| `input`   | Feature\,FeatureCollection | input features |


### Example

```js
var polygons = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-67.031021, 10.458102],
          [-67.031021, 10.53372],
          [-66.929397, 10.53372],
          [-66.929397, 10.458102],
          [-67.031021, 10.458102]
        ]]
      }
    }, {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-66.919784, 10.397325],
          [-66.919784, 10.513467],
          [-66.805114, 10.513467],
          [-66.805114, 10.397325],
          [-66.919784, 10.397325]
        ]]
      }
    }
  ]
};

var area = turf.area(polygons);

//=area
```


**Returns** `Number`, area in square meters

## Installation

Requires [nodejs](http://nodejs.org/).

```sh
$ npm install turf-area
```

## Tests

```sh
$ npm test
```


