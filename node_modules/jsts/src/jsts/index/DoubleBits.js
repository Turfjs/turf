/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * DoubleBits manipulates Double numbers by using bit manipulation and bit-field
 * extraction. For some operations (such as determining the exponent) this is
 * more accurate than using mathematical operations (which suffer from round-off
 * error).
 * <p>
 * The algorithms and constants in this class apply only to IEEE-754
 * double-precision floating point format.
 *
 * NOTE: Since the only numberformat in JavaScript is IEEE-754 the code in
 * DoubleBits could not be easily ported.
 *
 * Instead, using algorithms found here:
 * http://www.merlyn.demon.co.uk/js-exact.htm
 *
 * @constructor
 */
jsts.index.DoubleBits = function() {

};


/**
 * Calculates the power of two for a number
 *
 * @param {Number}
 *          exp value to pow.
 * @return {Number} the pow'ed value.
 */
jsts.index.DoubleBits.powerOf2 = function(exp) {
  // TODO: Make sure the accuracy of this is sufficient (why else would JTS have
  // this in DoubleBits?)
  return Math.pow(2, exp);
};


/**
 * Calculates the exponent-part of the bit-pattern for a number
 *
 * @param {Number}
 *          d the IEEE-754-value to calculate the exponent for.
 * @return {Number} the exponent part of the bit-mask.
 */
jsts.index.DoubleBits.exponent = function(d) {
  return jsts.index.DoubleBits.CVTFWD(64, d) - 1023;
};


/**
 * Calculates the exponent of the bit-pattern for a number. Uses code from:
 * http://www.merlyn.demon.co.uk/js-exact.htm
 *
 * @param {Number}
 *          NumW 32 or 64 to denote the number of bits.
 * @param {Number}
 *          Qty the number to calculate the bit pattern for.
 * @return {Number} The integer value of the exponent.
 */
jsts.index.DoubleBits.CVTFWD = function(NumW, Qty) {
  var Sign, Expo, Mant, Bin, nb01 = ''; // , OutW = NumW/4
  var Inf = {
    32: {
      d: 0x7F,
      c: 0x80,
      b: 0,
      a: 0
    },
    64: {
      d: 0x7FF0,
      c: 0,
      b: 0,
      a: 0
    }
  };
  var ExW = {
    32: 8,
    64: 11
  }[NumW], MtW = NumW - ExW - 1;

  if (!Bin) {
    Sign = Qty < 0 || 1 / Qty < 0; // OK for +-0
    if (!isFinite(Qty)) {
      Bin = Inf[NumW];
      if (Sign) {
        Bin.d += 1 << (NumW / 4 - 1);
      }
      Expo = Math.pow(2, ExW) - 1;
      Mant = 0;
    }
  }

  if (!Bin) {
    Expo = {
      32: 127,
      64: 1023
    }[NumW];
    Mant = Math.abs(Qty);
    while (Mant >= 2) {
      Expo++;
      Mant /= 2;
    }
    while (Mant < 1 && Expo > 0) {
      Expo--;
      Mant *= 2;
    }
    if (Expo <= 0) {
      Mant /= 2;
      nb01 = 'Zero or Denormal';
    }
    if (NumW === 32 && Expo > 254) {
      nb01 = 'Too big for Single';
      Bin = {
        d: Sign ? 0xFF : 0x7F,
        c: 0x80,
        b: 0,
        a: 0
      };
      Expo = Math.pow(2, ExW) - 1;
      Mant = 0;
    }
  }

  return Expo;
};
