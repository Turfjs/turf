//set when this module is required
window.test = 'test';

//called when the exported module function is required AND invoked
module.exports = function () {
  alert('Hello World!');
}
