# Browserify-Shim jquery Example

This example demonstrates using a shim fo jquery.

The main part where it all happens is this snippet:

```js
  shim(browserify(), {
      jquery: { path: './js/vendor/jquery.js', exports: '$' }
  })
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

    npm run shim-jquery

Or if you enjoy typing a lot:

    cd examples/shim-jquery

    npm install
    node build.js
    open index.html
