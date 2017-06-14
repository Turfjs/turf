turf-isClockwise
================
[![Build Status](https://travis-ci.org/Turfjs/turf-isClockwise.svg?branch=master)](https://travis-ci.org/Turfjs/turf-isClockwise)

Takes a ring and return true or false whether or not the ring is clockwise or counter-clockwise.

###Install

```sh
npm install turf-is-clockwise
```

###Parameters

|name|description|
|---|---|
|ring|an array of coordinates|

###Usage

```js
isClockwise(ring)
```

###Example

```js
var isClockwise = require('turf-is-clockwise')

var clockwiseRing = [[0,0],[1,1],[1,0],[0,0]]
var counterClockwiseRing = [[0,0],[1,0],[1,1],[0,0]]

var isCW = isClockwise(clockwiseRing)
var counterCW = isClockwise(counterClockwiseRing)

console.log(isCW) // true
console.log(counterCW) // false
```