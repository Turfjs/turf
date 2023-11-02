
# Changelog

## 3.1.0 - 2018-02-05

- Improve coverage testing to 100%
- Support Array of Features to `.load()` method
- Allow strict Typing when defining Tree (ex: `const tree = rbush<Polygon>()`)
- Update documentation
- Add `equals` param to `.remove()` method
- Drop BBox from search/remove methods
- Add support for 6 position BBox

## 3.0.0 - 2018-02-04

- Update Typescript definition
- Drop ES Modules in favor of Typescript

## 2.2.0 - 2017-11-22

- Clean up Rollup build

## 2.1.0 - 2017-10-16

- Added Rollup to build CommonJS (`main.js`)

## 2.0.4 - 2017-10-10

- ~Drop Rollup~
- Update Typescript definition

## 2.0.0 - 2017-10-01

- Support ES modules

## 1.1.1 - 2017-07-15

- Replaced `const` with `var` for pure ES5 compatibility

## 1.1.0 - 2017-06-01

- Add `bbox` support as valid input
- Drop rollup build (ES5 npm package is plenty)

## 1.0.0 - 2017-03-20

- Initialize GeoJSON RBush from https://github.com/Turfjs/turf/pull/609