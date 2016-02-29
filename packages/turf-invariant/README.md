# turf-invariant

[![build status](https://secure.travis-ci.org/Turfjs/turf-invariant.png)](http://travis-ci.org/Turfjs/turf-invariant)

enforce expectations about inputs to turf


### `geojsonType(value, type, name)`

Enforce expectations about types of GeoJSON objects for Turf.


### Parameters

| parameter | type    | description              |
| --------- | ------- | ------------------------ |
| `value`   | GeoJSON | any GeoJSON object       |
| `type`    | string  | expected GeoJSON type    |
| `name`    | String  | name of calling function |



### `featureOf(feature, types, name)`

Enforce expectations about types of Feature inputs for Turf.
Internally this uses geojsonType to judge geometry types.


### Parameters

| parameter | type    | description                              |
| --------- | ------- | ---------------------------------------- |
| `feature` | Feature | a feature with an expected geometry type |
| `types`   | string  | expected GeoJSON type                    |
| `name`    | String  | name of calling function                 |



### `collectionOf(featurecollection, type, name)`

Enforce expectations about types of FeatureCollection inputs for Turf.
Internally this uses geojsonType to judge geometry types.


### Parameters

| parameter           | type              | description                                           |
| ------------------- | ----------------- | ----------------------------------------------------- |
| `featurecollection` | FeatureCollection | a featurecollection for which features will be judged |
| `type`              | string            | expected GeoJSON type                                 |
| `name`              | String            | name of calling function                              |


## Installation

Requires [nodejs](http://nodejs.org/).

```sh
$ npm install turf-invariant
```

## Tests

```sh
$ npm test
```

