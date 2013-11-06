# detective

find all calls to `require()` by walking the AST

[![build status](https://secure.travis-ci.org/substack/node-detective.png)](http://travis-ci.org/substack/node-detective)

# example

## strings

strings_src.js:

``` js
var a = require('a');
var b = require('b');
var c = require('c');
```

strings.js:

``` js
var detective = require('detective');
var fs = require('fs');

var src = fs.readFileSync(__dirname + '/strings_src.js');
var requires = detective(src);
console.dir(requires);
```

output:

```
$ node examples/strings.js
[ 'a', 'b', 'c' ]
```

# methods

``` js
var detective = require('detective');
```

## detective(src, opts)

Give some source body `src`, return an array of all the `require()` calls with
string arguments.

The options parameter `opts` is passed along to `detective.find()`.

## detective.find(src, opts)

Give some source body `src`, return an object with "strings" and "expressions"
arrays for each of the require() calls.

The "expressions" array will contain the stringified expressions.

Optionally you can specify a different function besides `"require"` to analyze
with `opts.word`.

You can also specify `opts.nodes = true` in order to include a "nodes" array 
which contains an AST node for each of the require() calls.

# install

With [npm](https://npmjs.org) do:

```
npm install detective
```

# license

MIT
