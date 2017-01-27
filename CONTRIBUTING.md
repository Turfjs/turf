### :bug: [How to report a bug](http://polite.technology/reportabug.html)

## How To Contribute

- Most work happens in sub modules. These are modules prefixed with "turf-". 
- If you would like to propose a new feature, open an issue in Turfjs/turf.
- Always include tests. We use [tape](https://github.com/substack/tape).
- Turf modules are small, containing a single exported function. 
- GeoJSON is the lingua franca of Turf. It should be used as the data structure for anything that can be represented as geography.
- Avoid large dependencies at all costs.
- Turf is used in a wide range of places. Make sure that your code can run in the browser (ie: don't make calls to external services, don't hit the filesystem, etc.).
- The `README.md` files in `packages/` are automatically generated from comments in `.js`. Please modify those comments instead of modifying the `README.md` files directly.

## Code Style

To ensure code style at the `turf` module level, run

```sh
$ npm test
```

* Follow the [AirBNB JavaScript code style](https://github.com/airbnb/javascript).
* Turf aims to use ES5 features where rational. We do not use ES6 features.

## Structure of a turf module

```
turf-hello
	|
	|-tests
		|
		|-fixtures
			|
			|-points.geojson
		|-test.js
	|-index.js
	|-README.md
```

## Publishing

Install lerna:

    npm install -g lerna@2.0.0-beta.34

Publish a test release:

   lerna publish --canary
