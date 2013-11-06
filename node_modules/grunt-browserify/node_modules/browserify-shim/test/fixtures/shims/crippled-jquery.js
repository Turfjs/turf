// The stripped down version just for testing. Don't want to overload github and npm with jquery copies ;)
(function( window, undefined ) {
var
  // A central reference to the root jQuery(document)
  rootjQuery,

  // The deferred used on DOM ready
  readyList,

  // Map over jQuery in case of overwrite
  _jQuery = window.jQuery,

  // Map over the $ in case of overwrite
  _$ = window.$,

  jQuery = function( selector, context ) {
    return jQuery.fn;
  };

  jQuery.fn = jQuery.prototype = {
    // The current version of jQuery being used
    jquery: "1.8.3",
  };

// help with testing
window.require = require;

// Expose jQuery to the global object
window.jQuery = window.$ = jQuery;

if ( typeof define === "function" && define.amd && define.amd.jQuery ) {
  define( "jquery", [], function () { return jQuery; } );
}

})( window );

if(this !== window) throw new Error('this should be window');
