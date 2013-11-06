# Browser altenatives to built-in node.js modules

This is used by `browserify` module. Initially these files were in `node-browser-resolve`
but [disappeared in v1.0.1](https://github.com/shtylman/node-browser-resolve/commit/2799bcc316052a53fdafecd39576e14673a47ab0)
which broke `browserify` dependency. This module is that missing dependency.

## Browser support

* Safari: latest
* Chrome: latest
* Firefox: latest
* Opera: latest
* Internet Explore: 8, 9, 10

## Documentation

Requireing this module gives you a simple map between the modulename and a
filepath to the module containing the shim. You can then point to these files
in your pseudo-node implementation. Note that beyond the nodecore modules
there is also a process module, there mimics `global.process` in node.

```javascript
require('browser-builtins');
```

```javascript
{
  assert: '/user/node_modules/browser-builtins/builtin/assert.js',
  child_process: '/user/node_modules/browser-builtins/builtin/child_process.js',
  cluster: '/user/node_modules/browser-builtins/builtin/cluster.js',
  dgram: '/user/node_modules/browser-builtins/builtin/dgram.js',
  dns: '/user/node_modules/browser-builtins/builtin/dns.js',
  domain: '/user/node_modules/browser-builtins/builtin/domain.js',
  events: '/user/node_modules/browser-builtins/builtin/events.js',
  fs: '/user/node_modules/browser-builtins/builtin/fs.js',
  https: '/user/node_modules/browser-builtins/builtin/https.js',
  net: '/user/node_modules/browser-builtins/builtin/net.js',
  path: '/user/node_modules/browser-builtins/builtin/path.js',
  process: '/user/node_modules/browser-builtins/builtin/process.js',
  querystring: '/user/node_modules/browser-builtins/builtin/querystring.js',
  readline: '/user/node_modules/browser-builtins/builtin/readline.js',
  repl: '/user/node_modules/browser-builtins/builtin/repl.js',
  stream: '/user/node_modules/browser-builtins/builtin/stream.js',
  string_decoder: '/user/node_modules/browser-builtins/builtin/string_decoder.js',
  sys: '/user/node_modules/browser-builtins/builtin/sys.js',
  timers: '/user/node_modules/browser-builtins/builtin/timers.js',
  tls: '/user/node_modules/browser-builtins/builtin/tls.js',
  tty: '/user/node_modules/browser-builtins/builtin/tty.js',
  url: '/user/node_modules/browser-builtins/builtin/url.js',
  util: '/user/node_modules/browser-builtins/builtin/util.js',
  punycode: '/user/node_modules/browser-builtins/node_modules/punycode/punycode.js',
  http: '/user/node_modules/browser-builtins/node_modules/http-browserify/index.js',
  vm: '/user/node_modules/browser-builtins/node_modules/vm-browserify/index.js',
  crypto: '/user/node_modules/browser-builtins/node_modules/crypto-browserify/index.js',
  console: '/user/node_modules/browser-builtins/node_modules/console-browserify/index.js',
  zlib: '/user/node_modules/browser-builtins/node_modules/zlib-browserify/index.js',
  buffer: '/user/node_modules/browser-builtins/node_modules/buffer-browserify/index.js',
  constants: '/user/node_modules/browser-builtins/node_modules/constants-browserify/constants.json',
  os: '/user/node_modules/browser-builtins/node_modules/os-browserify/browser.js'
}
```

## Contribute

When you find a bug in this module and want to fix it its a good idea to follow these steps:

> On a general note, please try to fix all issues either by coping from nodecore
> or by fixing it with a shim in the `_shims` file.
>
> Also since this module isn't just for browserify, you should always require
> the `Buffer` module and avoid using the `process` object.

1. Add a test (preferably in a new file) with the name `{modulename}-{issue}.js` in the `test/browser/` directory.
2. Check if the bug exists in node.js, if true `goto` _bug in nodecore_
3. Check if the module is outdated, if true `goto` _outdated module_
4. Check if the issue can be shimed, if true `goto` _fix with shims_
5. Sorry, as of this date all issues could be fixed with shims, you are on your own

#### bug in nodecore

1. Fix it in [nodecore](https://github.com/joyent/node)
2. When merged in nodecore `goto` _outdated module_

#### outdated module

1. Before you copy the module search for `shims` in the outdated module file. 
2. Copypast the **entire** module from [nodecore](https://github.com/joyent/node) (checkout a stable branch).
3. Reimplement the `shims` from the outdated module file, `git diff` can help.
4. `goto` _test in browsers_

#### fix with shims

In the `builtin` directory there is a `_shims.js` file this contain all the
currently necessary shims. Most of these are incomple and writen specific
for this module collection. If you find that the current implementation is
insufficient try to improve it. If it lacks a feature just added that shim,
but try to keep the implementation at a minimum. Usually `TypeError` and
similar can be omitted.

#### test in browsers

This module is currently not integrated with testling-ci, but you can run testling
locally in order to run the tests.

1. First install: `npm install -g testling` and `npm install -g browserify`
2. `cd` intro this module directory
3. Run `browserify --transform ./test/browserify-transform.js test/browser/* | testling -u`
4. This gives you a url, go to that url in a modern browser (just not IE, even IE 10).
5. This will run the tests, if there was an issue you should fix it now
6. Run the tests again in IE 10, then IE 9 and at last IE 8 and fix any issues (see: _fix with shims_)
7. Test in the remaining supported browser, there shouldn't be any issues
8. You are done, make the Pull Request :+1:

## History

1. "Forked" from `node-browser-resolve`, originally written by Roman Shtylman (@shtylman).
2. Major update to node v0.10 and tests (@AndreasMadsen)
