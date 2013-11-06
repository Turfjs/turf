[![build status](https://secure.travis-ci.org/jmreidy/grunt-browserify.png)](http://travis-ci.org/jmreidy/grunt-browserify)
# grunt-browserify

Grunt task for node-browserify. Current version: [![NPM version](https://badge.fury.io/js/grunt-browserify.png)](http://badge.fury.io/js/grunt-browserify)

## Getting Started
This plugin requires [Grunt](https://gruntjs.com) `~0.4.0` and Node `>=0.10.x`.

Install this grunt plugin with:
```shell
npm install grunt-browserify --save-dev
```

Then add this line to your project's `grunt.js` Gruntfile:

```javascript
grunt.loadNpmTasks('grunt-browserify');
```

## In the Wild
Most simply, Browserify is a tool for taking your CommonJS-style Javascript
code and packaging it for use in the browser. Grunt-Browserify provides the
glue to better integrate Browserify into your development workflow.

For JavaScripters unfamiliar with CJS-style code and the Node ecosystem, moving
to Browserify can be a bit confusing. Writing your client-side code as CJS
modules allows for smaller, easier to understand files that perform one task
well. These modules, because of their simplicity, will be significantly easier
to use across projects. CJS modules also help to expose the dependency graph
inherent in your code, allowing you to write cleaner, more-maintainable
modules. As [Alex MacCaw writes](http://spinejs.com/docs/commonjs):
>CommonJS modules are one of the best solutions to JavaScript dependency
>management.

>CommonJS modules solve JavaScript scope issues by making sure each module is
>executed in its own namespace. Modules have to explicitly export variables
>they want to expose to other modules, and explicitly import other modules; in
>other words, there's no global namespace.

(A note to AMD fans that the benefits above are not unique to the CJS
style of writing JavaScript modules, but the ease-of-interoperality with
Node.JS code is a plus of CJS.)

As you begin to write your client-side code in small, reusable modules, you
start to have a lot more files to manage. At the same time, you need to
integrate these files with other client-side libraries, some of which do not
play particularly nicely with a CJS module system. The simplicity provided by
CJS modules can be lost as build complexity is increased and Browserify
compilation time gets out of control.

Grunt-Browserify is here to make your life easier. There's a number of examples
provided in the `examples` directory of different real-world uses of
Grunt-Browserify. Those examples, plus the example of the project's own
Gruntfile, should provide clarity into how to get started. This project's
author and contributors are happy to answer any specific questions on Twitter.

In addition to the examples mentioned above, there are some specific pieces of advice that
may prove helpful:

* Be careful with entry modules. Entry modules are any files passed directly to Browserify's
`require` method. Anything specified in Grunt-Browserify's `src` will be interpreted as an entry file.
Keep in mind that Browserify walks a dependency tree, so theoretically a single
"main" entry file could be enough for all of your client side code. The reason
for caution is that entry files are interpretted at *load time*, unlike
traditionally required modules, which are interpretted like any CJS module -
when they are required. Anything in an entry file is run as soon as the
Browserified bundle is loaded on a web page. See the inline comments in the
`simple` example directory for further details.

* Break vendored libs into their own Browserify build. Libs like jQuery, Angular, D3, etc. are large files that can
greatly slow down Browserify compilation time. They also aren't changing with the same frequency
as your own client source code. By breaking these vendored files into their own Grunt-Browserify
task, then making them externally available via an alias, you can make build
times signficantly shorter. See the `complex` example folder for a use case.
You can concatenate each Browserified bundled to a single JS file, which
should handle any concerns with browser latency.

* Transforms are your friend. You can perform some pretty complex magic with
Browserify-transforms. Check out [deamdify](https://github.com/jaredhanson/deamdify)
and [coffeeify](https://github.com/substack/coffeeify) for some useful
examples.

* The more modular the code, the more likely you are to share modules across
client and server. Grunt-Browserify can help you manage the complexity around
keeping your client-side code in different folder paths. (For example,
`client/script` and `shared`.) Take a look at the `aliasMappings` capability,
which also has a corresponding setup in the examples folder.


## Documentation
Run this task with the `grunt browserify` command. As with other Grunt plugins, the `src` and `dest` properties are most important: `src` will use the Grunt glob pattern to specify files for inclusion in the browserified package, and `dest` will specify the outfile for the compiled module.

### Options
#### ignore
Type: `[String]`

Specifies files to be ignored in the browserify bundle.

#### noParse
Type: `[String]`

Array of file paths that Browserify should not attempt to parse for `require()`
statements, which should improve compilation time for large library files that
do not need to be parsed. (The Browserify docs provide the example of jQuery, although I
think it would probably be more useful to shim such libraries than to compile
them with noParse).

#### alias
Type: `[String:String]` or comma-separated `String`

Browserify can alias files or modules to a certain name. For example, `require(‘./foo’)`
can be aliased to be used as `require(‘foo’)`. Aliases should be specified as
`fileName:alias`.  A couple notes:

* fileNames are parsed into their full paths with `path.resolve`.

* Any aliases are automatically externalized by Browserify. That means an alias in one bundle is requireable from another.

* If you leave the second half of an alias blank, it will just externalize the target. For example: `alias: ['events:']` will
alias the events module as 'events' inside and outside of the bundle.

#### aliasMappings
Type: `[Object || Array]`

Like the `alias` option described above, but accepts mapping patterns as described in [Building the files object dynamically](http://gruntjs.com/configuring-tasks#building-the-files-object-dynamically) to enable aliasing of entire
directories and sets of files. Note that the `expand` option is set to `true` for you,
so you can omit that from your configuration.

#### external
Type: `[String]`

Specifies files to be loaded from a previously loaded, “common” bundle.


#### transform
Type: `[String || Function]`

Specifies a pipeline of functions (or modules) through which the browserified bundle will be run. The [browserify docs themselves](https://github.com/substack/node-browserify#btransformtr) explain transform well, but below is an example of transform used with `grunt-browserify` to automatically compile coffeescript files for use in a bundle:

```javascript
browserify: {
  dist: {
    files: {
      'build/module.js': ['client/scripts/**/*.js', 'client/scripts/**/*.coffee'],
    },
    options: {
      transform: ['coffeeify']
    }
  }
}
```

#### debug
Type: `Boolean`

Enable source map support.

#### shim
Type: `Object`

Provide a config object to be used with
[browserify-shim](https://github.com/thlorenz/browserify-shim). Note that
shimmed modules are essentially `alias`ed as well (with the alias being
the Object key of the shim).

#### postBundleCB
Type: `Function (err, src, next)`

An optional callback function, which will be called after bundle completion and
before writing of the bundle. The `err` and `src` arguments are provided
directly from browserify. The `next` callback should be called with `(err,
modifiedSrc)`; the `modifiedSrc` is what will be written to the output file.

#### Other Options

Any other options you provide will be passed through to browserify. This is useful for setting things like `standalone` or `ignoreGlobals`.

###Usage
To get things running, add the following entry to `grunt.initConfig()`:

```javascript
browserify: {
  dist: {
    files: {
      'build/module.js': ['client/scripts/**/*.js']
    }
  }
}
```
More complicated use cases can be found within this projects own `Gruntfile`.


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using `grunt`.

## Release History

### v0.1.0
  - Initial release

### v0.1.1
  - Properly support compact and full grunt task syntax

### v0.2.0
  - Add support for Browserify 2

### v0.2.4
  - Add externalize option, to expose modules to external bundles
  - Add browserify-shim support
  - Completely rewrote and significantly improved tests
  - Various fixes

### v0.2.5
  - Update externalize to expose npm modules to external bundles

### v1.0.0
  - Really should've been released at v0.2, but better late than never!

### v1.0.2
  - Move away from browserify-stream to callback approach

### v1.0.3
  - Add new aliasMappings functionality

### v1.0.4
  - Adding directory support for `external` parameter

### v1.0.5
  - Bumping to latest Browserify (2.18.x)

### v1.1.0
  - Added support for noParse option
  - Change browserify() call to pass files as opts.entries

### v1.1.1
  - Fix regression where shimmed modules not being parsed

### v1.2
  - `Externalize` has been deprecated in favor of `alias` (#69)
  - Allow `external` to use module names, in addition to file paths (#68). Waiting on Browserify changes for this to actually work.
  - Much improved docs (#67)
  - Allow non-files to be ignored (#50), via @joshuarubin

### v1.2.1
  - Bumping dependency versions

### v1.2.2
  - Change `alias` destination behavior to only treat the destination as a
    filepath if it exists

### v1.2.3
  - Allow aliasing with arbitrary ids. For example, you could alias `./vendor/client/jquery/jquery.js` to `/vendor/jquery`
  for consumption by other bundles. See the updated `complex` and `externals` examples

### v1.2.4
  - Flatten options arrays, to prevent any weird behavior (via @joeybaker)

### v1.2.5
  - Documentation fix (via @alanshaw)
  - Allow aliasing inner modules (via @bananushka)
  - Fix multitask shim bug (via @byronmwong)

### v1.2.6
  - Move browserify to a peer dependency, to allow custom versions (via @nrn)
  - Add support for browserify extension flag (from browserify v2.31)

### v1.2.7
  - Fix bug in sharing shimmed files across bundles (#89)

### v1.2.8
  - Add postBundle callback support (via @Bockit)

### v1.2.9
  - Fix peerDependency version requirements

### v1.2.10
  - Fix #106

### v1.2.11
  - Move to browserify 2.35 for upstream dedupe fix


## Frequent Contributors
  - Ben Clinkinbeard ([@bclinkinbeard](https://github.com/bclinkinbeard))
  - Kyle Robinson Young ([@shama](https://github.com/shama))

## License
Copyright (c) 2013 Justin Reidy
Licensed under the MIT license.



