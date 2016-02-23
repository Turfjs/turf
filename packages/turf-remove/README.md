# turf-remove

[![build status](https://secure.travis-ci.org/Turfjs/turf-remove.png)](http://travis-ci.org/Turfjs/turf-remove)

turf remove module


### `turf.remove(features, property, value)`

Takes a FeatureCollection of any type, a property, and a value and
returns a FeatureCollection with features matching that
property-value pair removed.


### Parameters

| parameter  | type              | description            |
| ---------- | ----------------- | ---------------------- |
| `features` | FeatureCollection | set of input features  |
| `property` | String            | the property to filter |
| `value`    | String            | the value to filter    |


### Example

```js
var points = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        'marker-color': '#00f'
      },
      "geometry": {
        "type": "Point",
        "coordinates": [-0.235004, 5.551918]
      }
    }, {
      "type": "Feature",
      "properties": {
        'marker-color': '#f00'
      },
      "geometry": {
        "type": "Point",
        "coordinates": [-0.209598, 5.56439]
      }
    }, {
      "type": "Feature",
      "properties": {
        'marker-color': '#00f'
      },
      "geometry": {
        "type": "Point",
        "coordinates": [-0.197753, 5.556018]
      }
    }, {
      "type": "Feature",
      "properties": {
        'marker-color': '#000'
      },
      "geometry": {
        "type": "Point",
        "coordinates": [-0.217323, 5.549526]
      }
    }, {
      "type": "Feature",
      "properties": {
        'marker-color': '#0f0'
      },
      "geometry": {
        "type": "Point",
        "coordinates": [-0.211315, 5.543887]
      }
    }, {
      "type": "Feature",
      "properties": {
        'marker-color': '#00f'
      },
      "geometry": {
        "type": "Point",
        "coordinates": [-0.202217, 5.547134]
      }
    }, {
      "type": "Feature",
      "properties": {
        'marker-color': '#0f0'
      },
      "geometry": {
        "type": "Point",
        "coordinates": [-0.231227, 5.56644]
      }
    }
  ]
};

//=points

var filtered = turf.remove(points, 'marker-color', '#00f');

//=filtered
```


**Returns** `FeatureCollection`, the resulting FeatureCollection without features that match the property-value pair

## Installation

Requires [nodejs](http://nodejs.org/).

```sh
$ npm install turf-remove
```

## Tests

```sh
$ npm test
```


