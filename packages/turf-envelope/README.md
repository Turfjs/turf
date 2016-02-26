# turf-envelope

[![build status](https://secure.travis-ci.org/Turfjs/turf-envelope.png)](http://travis-ci.org/Turfjs/turf-envelope)

turf envelope module


### `turf.envelope(fc)`

Takes any number of features and returns a rectangular Polygon that encompasses all vertices.


### Parameters

| parameter | type              | description    |
| --------- | ----------------- | -------------- |
| `fc`      | FeatureCollection | input features |


### Example

```js
var fc = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "Location A"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [-75.343, 39.984]
      }
    }, {
      "type": "Feature",
      "properties": {
        "name": "Location B"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [-75.833, 39.284]
      }
    }, {
      "type": "Feature",
      "properties": {
        "name": "Location C"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [-75.534, 39.123]
      }
    }
  ]
};

var enveloped = turf.envelope(fc);

var resultFeatures = fc.features.concat(enveloped);
var result = {
  "type": "FeatureCollection",
  "features": resultFeatures
};

//=result
```


**Returns** `Feature.<Polygon>`, a rectangular Polygon feature that encompasses all vertices

## Installation

Requires [nodejs](http://nodejs.org/).

```sh
$ npm install turf-envelope
```

## Tests

```sh
$ npm test
```


