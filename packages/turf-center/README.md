# turf-center

[![build status](https://secure.travis-ci.org/Turfjs/turf-center.png)](http://travis-ci.org/Turfjs/turf-center)

turf center module


### `turf.center(features)`

Takes a FeatureCollection and returns the absolute center point of all features.


### Parameters

| parameter  | type              | description    |
| ---------- | ----------------- | -------------- |
| `features` | FeatureCollection | input features |


### Example

```js
var features = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [-97.522259, 35.4691]
      }
    }, {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [-97.502754, 35.463455]
      }
    }, {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [-97.508269, 35.463245]
      }
    }, {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [-97.516809, 35.465779]
      }
    }, {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [-97.515372, 35.467072]
      }
    }, {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [-97.509363, 35.463053]
      }
    }, {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [-97.511123, 35.466601]
      }
    }, {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [-97.518547, 35.469327]
      }
    }, {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [-97.519706, 35.469659]
      }
    }, {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [-97.517839, 35.466998]
      }
    }, {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [-97.508678, 35.464942]
      }
    }, {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [-97.514914, 35.463453]
      }
    }
  ]
};

var centerPt = turf.center(features);
centerPt.properties['marker-size'] = 'large';
centerPt.properties['marker-color'] = '#000';

var resultFeatures = features.features.concat(centerPt);
var result = {
  "type": "FeatureCollection",
  "features": resultFeatures
};

//=result
```


**Returns** `Feature.<Point>`, a Point feature at the absolute center point of all input features

## Installation

Requires [nodejs](http://nodejs.org/).

```sh
$ npm install turf-center
```

## Tests

```sh
$ npm test
```


