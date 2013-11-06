var _ = require('underscore')
  , obj = { foo: 'bar' };

console.log('hello guys, I got underscore', _);
document
  .getElementById('underscore-invert')
  .textContent =  '[{ foo: bar}.foo = ' + { foo: 'bar' }.foo 
      + '] and [ _.invert({ foo: bar }).bar = ' + _.invert({ foo: 'bar' }).bar + ']';
