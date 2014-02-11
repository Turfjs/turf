javascript.util is a port of selected parts of java.util to JavaScript which
main purpose is to ease porting Java code to JavaScript.

javascript.util can be used in browsers or as a node js module.

// TODO: describe "selected parts"
// TODO: generate API docs

Usage
=====

Browsers
--------

Simply include javascript.util.js in your page.

Node JS
-------

Using NPM a trunk version of javascript.util can be installed with the following:

```bash
    npm install git://github.com/bjornharrtell/javascript.util.git
```

A simple code example using javascript.util:

```javascript
	var ArrayList = require("javascript.util").ArrayList;
	var array = new ArrayList();
	array.add(1);
```

Development environment
=======================

Ubuntu or similar is assumed.

Dependencies
------------

* nodejs
* npm
* browserify
* uglify-js
* jasmine-node

Unit tests
----------

Can be run in browser using /test/SpecRunner-release.html or /test/SpecRunner-debug.html

Can be run at command line using jasmine-node. Included runtests.sh script will run all tests.

NOTE: jasmine-node trunk version is required at the moment.
