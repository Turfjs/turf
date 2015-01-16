The examples and API documentation for Turf live on [turfjs.org](http://turfjs.org), which has its own repo ([turf-www](http://github.com/turf/turf-www)). They are built slightly differently.

## Building Documentation

Documentation for turf is written using [JSDoc](http://usejsdoc.org/) comments
in individual modules. The `turf-www` project loads turf as a dependency
in its [package.json](https://github.com/Turfjs/turf-www/blob/master/package.json) file and looks through each turf module,
sending it to jsdoc.

* We use the [turf-jsdoc](https://github.com/turfjs/turf-jsdoc) template to style
  our docs.
* This project provides [geojson.js](https://github.com/Turfjs/turf-www/blob/master/geojson.js), a set of [typedef tags](http://usejsdoc.org/tags-typedef.html)
  that let all modules use shorthand like `{Point}` for [GeoJSON Point](http://geojson.org/geojson-spec.html#point)
  geometries and so on - each uppercase value of the `type` property of a GeoJSON
  type should be included.

### Structure

This is all built with modules:

* turf-www is the website and the part that generates docs from turf
* turf-www **requires** turf so that it has code to generate documentation from

### Setup for Editing Documentation

Documentation should be added and edited as comments inside of individual Turf modules. To set this up, clone the `turf-www` repository and run the following:

```sh
$ npm install
$ cd node_modules/turf
$ npm install -g turf-runner
$ turf-modules-as-clones
```

This checks out all of the turf modules as git repos in the `turf-modules` directory (`/node_modules/turf/turf_modules/`). Documentation should be added as comments in the `index.js` file for each module.

### Writing Documentation

* Documentation for Turf modules is written as comments in `index.js` of each module. The format and conventions are as follows:
  * Description:
  	* Use active voice ('generates' instead of 'generate')
  	* Mention what the module takes as input and what it creates as output
  	* Whenever possible, use typedef tags as defined in `geojson.js`
	* Module:
		* `@module turf/[module name]`
	* Parameters:
		* `@param {[type]} [parameter name] - [parameter description]`
		* Each parameter gets its own line
		* For arrays, be specific about type and nesting
			* e.g. `number[][]` is a nested array of arrays with number values
	* Return:
		* `@return {[type]} [return value description]`
	* Example:
		* `@example` and then the example on subsequent lines
		* Examples use hosted version of the latest deploy of turf.js; no `require` necessary
		* Examples use [rpl-www](http://github.com/tmcw/rpl-www) to allow editability and display output. To output a valueuse `//=output`. If the output is mappable, it will appear on a map; if not, it will appear as text.

Example of documentation:

```
/**
 * Generates a new {@link Point} feature, given coordinates
 * and, optionally, properties.
 *
 * @module turf/point
 * @param {number} longitude - position west to east in decimal degrees
 * @param {number} latitude - position south to north in decimal degrees
 * @param {Object} properties
 * @return {Point} output
 * @example
 * var pt1 = turf.point(-75.343, 39.984);
 * //=pt1
 */
 ```

### Building and Testing Documentation

The turf-www project exposes two useful scripts that you'll use for testing & deploying new documentation:

* `npm run build` builds & rebuilds changes as necessary and runs a local web server so you can review them
* `npm run build-production` builds the site once to get it ready to be pushed into production.

To build docs, in the root of `turf-www`, run:

```sh
$ npm install
$ npm run build
```

This will build docs to the `/docs` directory in this website. Docs _do not use Jekyll_:
they're just static files once baked. You can then test them in your browser.

### Keeping Documentation Up to Date

When you come back to edit a second time, you should make sure that you have the latest versions of everthing. To pull down updates from individual modules and build documentation, navigate to `/node_modules/turf` and run the following:

```sh
$ turf-modules-update
$ npm run build
```

You can then see the built documentation in your browser.

## Deploying Documentation

Once tested, you can push to a branch and make a pull request to the individual module from that module's directory at `node_modules/turf/turf_modules/[module name]`, as it is just a clone of the individual module.

To deploy documentation to the site: We manage **source** in the `master` branch and treat `gh-pages` as a
produced artifact _only_. Run the following in the root of `turf-www`:

```sh
npm install
npm run build-production
./deploy.sh
```
