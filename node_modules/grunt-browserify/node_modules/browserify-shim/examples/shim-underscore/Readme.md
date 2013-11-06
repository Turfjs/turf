# Browserify-Shim underscore Example

This example demonstrates that shims are no longer (since `browserify v2.0`) necessary for commonJS compatible modules like underscore.

Instead `require(fullPath, { expose: 'underscore' })` can be used now.

It is a bit contrived since an underscore npm module exists, but lets assume you converted a codebase to use
browserify, i.e. via [browserify-ftw](https://github.com/thlorenz/browserify-ftw) and just want to use the underscore
that is in the `js/vendor` directory already.

The main part where it all happens is this snippet:

```js
browserify()
  .require(require.resolve('./js/vendor/underscore-min.js'), { expose: 'underscore' })
  .require(require.resolve('./js/entry.js'), { entry: true })
  .bundle(function (err, src) {
    if (err) return console.error(err);

    fs.writeFileSync(builtFile, src);
    console.log('Build succeeded, open index.html to see the result.');
  });
```

To run this example:

    npm install browserify-shim
    npm explore browserify-shim

Then:

    npm run shim-underscore

Or if you enjoy typing a lot:

    cd examples/shim-underscore

    npm install
    node build.js
    open index.html
