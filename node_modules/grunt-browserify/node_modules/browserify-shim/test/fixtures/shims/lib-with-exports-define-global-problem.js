 /*
  * Reproducing problem here: https://github.com/mhemesath/r2d3/blob/master/r2d3.v2.js
  * If module.exports or define is present, it never attaches itself to the window.
  * This is a problem since browserify defines module.exports.
  * If it is not a clean separate module like the one mentioned this becomes a problem.
  * 
  * In this specific case eve is not attached to the window since module.exports is present. 
  * However the included module, Raphael, expects it to be attached.
  * Obviously a bad case of concetenating libs together, but we need to deal with this since,
  * its out there.
  */

(function init(glob) {

 var eve = 'loves adam';

 // this horrible case of nested ternaries came straight from: https://github.com/mhemesath/r2d3/blob/master/r2d3.v2.js#L222
  (typeof module != "undefined" && module.exports) 
    ? (module.exports = eve) 
    : (typeof define != "undefined" 
      ? (define("eve", [], function() { return eve; })) 
      : (glob.eve = eve));
})(this);
