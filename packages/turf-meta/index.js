const loader = require('@std/esm')(module, {cjs: true, esm: 'js'});
module.exports = loader('./index.mjs').default;
