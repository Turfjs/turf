/**
 * Polyfill for IE support
 */
Math.trunc =
  Math.trunc ||
  function (x) {
    return x < 0 ? Math.ceil(x) : Math.floor(x);
  };
/* Polyfill service v3.13.0
 * For detailed credits and licence information see http://github.com/financial-times/polyfill-service
 *
 * - Array.prototype.fill, License: CC0 */

if (!("fill" in Array.prototype)) {
  Object.defineProperty(Array.prototype, "fill", {
    configurable: true,
    value: function fill(value) {
      if (this === undefined || this === null) {
        throw new TypeError(this + " is not an object");
      }

      var arrayLike = Object(this);

      var length =
        Math.max(Math.min(arrayLike.length, 9007199254740991), 0) || 0;

      var relativeStart =
        1 in arguments ? parseInt(Number(arguments[1]), 10) || 0 : 0;

      relativeStart =
        relativeStart < 0
          ? Math.max(length + relativeStart, 0)
          : Math.min(relativeStart, length);

      var relativeEnd =
        2 in arguments && arguments[2] !== undefined
          ? parseInt(Number(arguments[2]), 10) || 0
          : length;

      relativeEnd =
        relativeEnd < 0
          ? Math.max(length + arguments[2], 0)
          : Math.min(relativeEnd, length);

      while (relativeStart < relativeEnd) {
        arrayLike[relativeStart] = value;

        ++relativeStart;
      }

      return arrayLike;
    },
    writable: true,
  });
}

/**
 * Polyfill for IE support
 */
Number.isInteger =
  Number.isInteger ||
  function (val) {
    return typeof val === "number" && isFinite(val) && Math.floor(val) === val;
  };
