# turf-sample

[![build status](https://secure.travis-ci.org/Turfjs/turf-sample.png)](http://travis-ci.org/Turfjs/turf-sample)

turf sample module


### `turf.sample(features, n)`

Takes a FeatureCollection and returns a FeatureCollection with given number of Feature|features at random.


### Parameters

| parameter  | type              | description                  |
| ---------- | ----------------- | ---------------------------- |
| `features` | FeatureCollection | set of input features        |
| `n`        | Number            | number of features to select |


### Example

```js
var points = turf.random('points', 1000);

//=points

var sample = turf.sample(points, 10);

//=sample
```


**Returns** `FeatureCollection`, a FeatureCollection with `n` features

## Installation

Requires [nodejs](http://nodejs.org/).

```sh
$ npm install turf-sample
```

## Tests

```sh
$ npm test
```


