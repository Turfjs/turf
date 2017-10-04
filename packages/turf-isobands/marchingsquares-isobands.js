/*!
* @license GNU Affero General Public License.
* Copyright (c) 2015, 2015 Ronny Lorenz <ronny@tbi.univie.ac.at>
* v. 1.2.0
* https://github.com/RaumZeit/MarchingSquares.js
*/

var defaultSettings = {
    successCallback: null,
    verbose: false,
    polygons: false
};

var settings = {};

/*
  Compute isobands(s) of a scalar 2D field given a certain
  threshold and a bandwidth by applying the Marching Squares
  Algorithm. The function returns a list of path coordinates
  either for individual polygons within each grid cell, or the
  outline of connected polygons.
*/
export default function isoBands(data, minV, bandwidth, options) {
    /* process options */
    options = options ? options : {};

    var optionKeys = Object.keys(defaultSettings);

    for (var i = 0; i < optionKeys.length; i++) {
        var key = optionKeys[i];
        var val = options[key];
        val = ((typeof val !== 'undefined') && (val !== null)) ? val : defaultSettings[key];

        settings[key] = val;
    }

    if (settings.verbose)
        console.log('MarchingSquaresJS-isoBands: computing isobands for [' + minV + ':' + (minV + bandwidth) + ']');

    var grid = computeBandGrid(data, minV, bandwidth);

    var ret;
    if (settings.polygons) {
        if (settings.verbose)
            console.log('MarchingSquaresJS-isoBands: returning single polygons for each grid cell');
        ret = BandGrid2Areas(grid);
    } else {
        if (settings.verbose)
            console.log('MarchingSquaresJS-isoBands: returning polygon paths for entire data grid');
        ret = BandGrid2AreaPaths(grid);
    }

    if (typeof settings.successCallback === 'function')
        settings.successCallback(ret);

    return ret;
}

/*
  Thats all for the public interface, below follows the actual
  implementation
*/

/* Some private variables */
var Node0 = 64,
    Node1 = 16,
    Node2 = 4,
    Node3 = 1;

/*
  The look-up tables for tracing back the contour path
  of isoBands
*/

var isoBandNextXTL = [];
var isoBandNextYTL = [];
var isoBandNextOTL = [];

var isoBandNextXTR = [];
var isoBandNextYTR = [];
var isoBandNextOTR = [];

var isoBandNextXRT = [];
var isoBandNextYRT = [];
var isoBandNextORT = [];

var isoBandNextXRB = [];
var isoBandNextYRB = [];
var isoBandNextORB = [];

var isoBandNextXBL = [];
var isoBandNextYBL = [];
var isoBandNextOBL = [];

var isoBandNextXBR = [];
var isoBandNextYBR = [];
var isoBandNextOBR = [];

var isoBandNextXLT = [];
var isoBandNextYLT = [];
var isoBandNextOLT = [];

var isoBandNextXLB = [];
var isoBandNextYLB = [];
var isoBandNextOLB = [];

isoBandNextXRT[85] = isoBandNextXRB[85] = -1;
isoBandNextYRT[85] = isoBandNextYRB[85] = 0;
isoBandNextORT[85] = isoBandNextORB[85] = 1;
isoBandNextXLT[85] = isoBandNextXLB[85] = 1;
isoBandNextYLT[85] = isoBandNextYLB[85] = 0;
isoBandNextOLT[85] = isoBandNextOLB[85] = 1;

isoBandNextXTL[85] = isoBandNextXTR[85] = 0;
isoBandNextYTL[85] = isoBandNextYTR[85] = -1;
isoBandNextOTL[85] = isoBandNextOBL[85] = 0;
isoBandNextXBR[85] = isoBandNextXBL[85] = 0;
isoBandNextYBR[85] = isoBandNextYBL[85] = 1;
isoBandNextOTR[85] = isoBandNextOBR[85] = 1;


/* triangle cases */
isoBandNextXLB[1] = isoBandNextXLB[169] = 0;
isoBandNextYLB[1] = isoBandNextYLB[169] = -1;
isoBandNextOLB[1] = isoBandNextOLB[169] = 0;
isoBandNextXBL[1] = isoBandNextXBL[169] = -1;
isoBandNextYBL[1] = isoBandNextYBL[169] = 0;
isoBandNextOBL[1] = isoBandNextOBL[169] = 0;

isoBandNextXRB[4] = isoBandNextXRB[166] = 0;
isoBandNextYRB[4] = isoBandNextYRB[166] = -1;
isoBandNextORB[4] = isoBandNextORB[166] = 1;
isoBandNextXBR[4] = isoBandNextXBR[166] = 1;
isoBandNextYBR[4] = isoBandNextYBR[166] = 0;
isoBandNextOBR[4] = isoBandNextOBR[166] = 0;

isoBandNextXRT[16] = isoBandNextXRT[154] = 0;
isoBandNextYRT[16] = isoBandNextYRT[154] = 1;
isoBandNextORT[16] = isoBandNextORT[154] = 1;
isoBandNextXTR[16] = isoBandNextXTR[154] = 1;
isoBandNextYTR[16] = isoBandNextYTR[154] = 0;
isoBandNextOTR[16] = isoBandNextOTR[154] = 1;

isoBandNextXLT[64] = isoBandNextXLT[106] = 0;
isoBandNextYLT[64] = isoBandNextYLT[106] = 1;
isoBandNextOLT[64] = isoBandNextOLT[106] = 0;
isoBandNextXTL[64] = isoBandNextXTL[106] = -1;
isoBandNextYTL[64] = isoBandNextYTL[106] = 0;
isoBandNextOTL[64] = isoBandNextOTL[106] = 1;

/* single trapezoid cases */
isoBandNextXLT[2] = isoBandNextXLT[168] = 0;
isoBandNextYLT[2] = isoBandNextYLT[168] = -1;
isoBandNextOLT[2] = isoBandNextOLT[168] = 1;
isoBandNextXLB[2] = isoBandNextXLB[168] = 0;
isoBandNextYLB[2] = isoBandNextYLB[168] = -1;
isoBandNextOLB[2] = isoBandNextOLB[168] = 0;
isoBandNextXBL[2] = isoBandNextXBL[168] = -1;
isoBandNextYBL[2] = isoBandNextYBL[168] = 0;
isoBandNextOBL[2] = isoBandNextOBL[168] = 0;
isoBandNextXBR[2] = isoBandNextXBR[168] = -1;
isoBandNextYBR[2] = isoBandNextYBR[168] = 0;
isoBandNextOBR[2] = isoBandNextOBR[168] = 1;

isoBandNextXRT[8] = isoBandNextXRT[162] = 0;
isoBandNextYRT[8] = isoBandNextYRT[162] = -1;
isoBandNextORT[8] = isoBandNextORT[162] = 0;
isoBandNextXRB[8] = isoBandNextXRB[162] = 0;
isoBandNextYRB[8] = isoBandNextYRB[162] = -1;
isoBandNextORB[8] = isoBandNextORB[162] = 1;
isoBandNextXBL[8] = isoBandNextXBL[162] = 1;
isoBandNextYBL[8] = isoBandNextYBL[162] = 0;
isoBandNextOBL[8] = isoBandNextOBL[162] = 1;
isoBandNextXBR[8] = isoBandNextXBR[162] = 1;
isoBandNextYBR[8] = isoBandNextYBR[162] = 0;
isoBandNextOBR[8] = isoBandNextOBR[162] = 0;

isoBandNextXRT[32] = isoBandNextXRT[138] = 0;
isoBandNextYRT[32] = isoBandNextYRT[138] = 1;
isoBandNextORT[32] = isoBandNextORT[138] = 1;
isoBandNextXRB[32] = isoBandNextXRB[138] = 0;
isoBandNextYRB[32] = isoBandNextYRB[138] = 1;
isoBandNextORB[32] = isoBandNextORB[138] = 0;
isoBandNextXTL[32] = isoBandNextXTL[138] = 1;
isoBandNextYTL[32] = isoBandNextYTL[138] = 0;
isoBandNextOTL[32] = isoBandNextOTL[138] = 0;
isoBandNextXTR[32] = isoBandNextXTR[138] = 1;
isoBandNextYTR[32] = isoBandNextYTR[138] = 0;
isoBandNextOTR[32] = isoBandNextOTR[138] = 1;

isoBandNextXLB[128] = isoBandNextXLB[42] = 0;
isoBandNextYLB[128] = isoBandNextYLB[42] = 1;
isoBandNextOLB[128] = isoBandNextOLB[42] = 1;
isoBandNextXLT[128] = isoBandNextXLT[42] = 0;
isoBandNextYLT[128] = isoBandNextYLT[42] = 1;
isoBandNextOLT[128] = isoBandNextOLT[42] = 0;
isoBandNextXTL[128] = isoBandNextXTL[42] = -1;
isoBandNextYTL[128] = isoBandNextYTL[42] = 0;
isoBandNextOTL[128] = isoBandNextOTL[42] = 1;
isoBandNextXTR[128] = isoBandNextXTR[42] = -1;
isoBandNextYTR[128] = isoBandNextYTR[42] = 0;
isoBandNextOTR[128] = isoBandNextOTR[42] = 0;

/* single rectangle cases */
isoBandNextXRB[5] = isoBandNextXRB[165] = -1;
isoBandNextYRB[5] = isoBandNextYRB[165] = 0;
isoBandNextORB[5] = isoBandNextORB[165] = 0;
isoBandNextXLB[5] = isoBandNextXLB[165] = 1;
isoBandNextYLB[5] = isoBandNextYLB[165] = 0;
isoBandNextOLB[5] = isoBandNextOLB[165] = 0;

isoBandNextXBR[20] = isoBandNextXBR[150] = 0;
isoBandNextYBR[20] = isoBandNextYBR[150] = 1;
isoBandNextOBR[20] = isoBandNextOBR[150] = 1;
isoBandNextXTR[20] = isoBandNextXTR[150] = 0;
isoBandNextYTR[20] = isoBandNextYTR[150] = -1;
isoBandNextOTR[20] = isoBandNextOTR[150] = 1;

isoBandNextXRT[80] = isoBandNextXRT[90] = -1;
isoBandNextYRT[80] = isoBandNextYRT[90] = 0;
isoBandNextORT[80] = isoBandNextORT[90] = 1;
isoBandNextXLT[80] = isoBandNextXLT[90] = 1;
isoBandNextYLT[80] = isoBandNextYLT[90] = 0;
isoBandNextOLT[80] = isoBandNextOLT[90] = 1;

isoBandNextXBL[65] = isoBandNextXBL[105] = 0;
isoBandNextYBL[65] = isoBandNextYBL[105] = 1;
isoBandNextOBL[65] = isoBandNextOBL[105] = 0;
isoBandNextXTL[65] = isoBandNextXTL[105] = 0;
isoBandNextYTL[65] = isoBandNextYTL[105] = -1;
isoBandNextOTL[65] = isoBandNextOTL[105] = 0;

isoBandNextXRT[160] = isoBandNextXRT[10] = -1;
isoBandNextYRT[160] = isoBandNextYRT[10] = 0;
isoBandNextORT[160] = isoBandNextORT[10] = 1;
isoBandNextXRB[160] = isoBandNextXRB[10] = -1;
isoBandNextYRB[160] = isoBandNextYRB[10] = 0;
isoBandNextORB[160] = isoBandNextORB[10] = 0;
isoBandNextXLB[160] = isoBandNextXLB[10] = 1;
isoBandNextYLB[160] = isoBandNextYLB[10] = 0;
isoBandNextOLB[160] = isoBandNextOLB[10] = 0;
isoBandNextXLT[160] = isoBandNextXLT[10] = 1;
isoBandNextYLT[160] = isoBandNextYLT[10] = 0;
isoBandNextOLT[160] = isoBandNextOLT[10] = 1;

isoBandNextXBR[130] = isoBandNextXBR[40] = 0;
isoBandNextYBR[130] = isoBandNextYBR[40] = 1;
isoBandNextOBR[130] = isoBandNextOBR[40] = 1;
isoBandNextXBL[130] = isoBandNextXBL[40] = 0;
isoBandNextYBL[130] = isoBandNextYBL[40] = 1;
isoBandNextOBL[130] = isoBandNextOBL[40] = 0;
isoBandNextXTL[130] = isoBandNextXTL[40] = 0;
isoBandNextYTL[130] = isoBandNextYTL[40] = -1;
isoBandNextOTL[130] = isoBandNextOTL[40] = 0;
isoBandNextXTR[130] = isoBandNextXTR[40] = 0;
isoBandNextYTR[130] = isoBandNextYTR[40] = -1;
isoBandNextOTR[130] = isoBandNextOTR[40] = 1;

/* single hexagon cases */
isoBandNextXRB[37] = isoBandNextXRB[133] = 0;
isoBandNextYRB[37] = isoBandNextYRB[133] = 1;
isoBandNextORB[37] = isoBandNextORB[133] = 1;
isoBandNextXLB[37] = isoBandNextXLB[133] = 0;
isoBandNextYLB[37] = isoBandNextYLB[133] = 1;
isoBandNextOLB[37] = isoBandNextOLB[133] = 0;
isoBandNextXTL[37] = isoBandNextXTL[133] = -1;
isoBandNextYTL[37] = isoBandNextYTL[133] = 0;
isoBandNextOTL[37] = isoBandNextOTL[133] = 0;
isoBandNextXTR[37] = isoBandNextXTR[133] = 1;
isoBandNextYTR[37] = isoBandNextYTR[133] = 0;
isoBandNextOTR[37] = isoBandNextOTR[133] = 0;

isoBandNextXBR[148] = isoBandNextXBR[22] = -1;
isoBandNextYBR[148] = isoBandNextYBR[22] = 0;
isoBandNextOBR[148] = isoBandNextOBR[22] = 0;
isoBandNextXLB[148] = isoBandNextXLB[22] = 0;
isoBandNextYLB[148] = isoBandNextYLB[22] = -1;
isoBandNextOLB[148] = isoBandNextOLB[22] = 1;
isoBandNextXLT[148] = isoBandNextXLT[22] = 0;
isoBandNextYLT[148] = isoBandNextYLT[22] = 1;
isoBandNextOLT[148] = isoBandNextOLT[22] = 1;
isoBandNextXTR[148] = isoBandNextXTR[22] = -1;
isoBandNextYTR[148] = isoBandNextYTR[22] = 0;
isoBandNextOTR[148] = isoBandNextOTR[22] = 1;

isoBandNextXRT[82] = isoBandNextXRT[88] = 0;
isoBandNextYRT[82] = isoBandNextYRT[88] = -1;
isoBandNextORT[82] = isoBandNextORT[88] = 1;
isoBandNextXBR[82] = isoBandNextXBR[88] = 1;
isoBandNextYBR[82] = isoBandNextYBR[88] = 0;
isoBandNextOBR[82] = isoBandNextOBR[88] = 1;
isoBandNextXBL[82] = isoBandNextXBL[88] = -1;
isoBandNextYBL[82] = isoBandNextYBL[88] = 0;
isoBandNextOBL[82] = isoBandNextOBL[88] = 1;
isoBandNextXLT[82] = isoBandNextXLT[88] = 0;
isoBandNextYLT[82] = isoBandNextYLT[88] = -1;
isoBandNextOLT[82] = isoBandNextOLT[88] = 0;

isoBandNextXRT[73] = isoBandNextXRT[97] = 0;
isoBandNextYRT[73] = isoBandNextYRT[97] = 1;
isoBandNextORT[73] = isoBandNextORT[97] = 0;
isoBandNextXRB[73] = isoBandNextXRB[97] = 0;
isoBandNextYRB[73] = isoBandNextYRB[97] = -1;
isoBandNextORB[73] = isoBandNextORB[97] = 0;
isoBandNextXBL[73] = isoBandNextXBL[97] = 1;
isoBandNextYBL[73] = isoBandNextYBL[97] = 0;
isoBandNextOBL[73] = isoBandNextOBL[97] = 0;
isoBandNextXTL[73] = isoBandNextXTL[97] = 1;
isoBandNextYTL[73] = isoBandNextYTL[97] = 0;
isoBandNextOTL[73] = isoBandNextOTL[97] = 1;

isoBandNextXRT[145] = isoBandNextXRT[25] = 0;
isoBandNextYRT[145] = isoBandNextYRT[25] = -1;
isoBandNextORT[145] = isoBandNextORT[25] = 0;
isoBandNextXBL[145] = isoBandNextXBL[25] = 1;
isoBandNextYBL[145] = isoBandNextYBL[25] = 0;
isoBandNextOBL[145] = isoBandNextOBL[25] = 1;
isoBandNextXLB[145] = isoBandNextXLB[25] = 0;
isoBandNextYLB[145] = isoBandNextYLB[25] = 1;
isoBandNextOLB[145] = isoBandNextOLB[25] = 1;
isoBandNextXTR[145] = isoBandNextXTR[25] = -1;
isoBandNextYTR[145] = isoBandNextYTR[25] = 0;
isoBandNextOTR[145] = isoBandNextOTR[25] = 0;

isoBandNextXRB[70] = isoBandNextXRB[100] = 0;
isoBandNextYRB[70] = isoBandNextYRB[100] = 1;
isoBandNextORB[70] = isoBandNextORB[100] = 0;
isoBandNextXBR[70] = isoBandNextXBR[100] = -1;
isoBandNextYBR[70] = isoBandNextYBR[100] = 0;
isoBandNextOBR[70] = isoBandNextOBR[100] = 1;
isoBandNextXLT[70] = isoBandNextXLT[100] = 0;
isoBandNextYLT[70] = isoBandNextYLT[100] = -1;
isoBandNextOLT[70] = isoBandNextOLT[100] = 1;
isoBandNextXTL[70] = isoBandNextXTL[100] = 1;
isoBandNextYTL[70] = isoBandNextYTL[100] = 0;
isoBandNextOTL[70] = isoBandNextOTL[100] = 0;

/* single pentagon cases */
isoBandNextXRB[101] = isoBandNextXRB[69] = 0;
isoBandNextYRB[101] = isoBandNextYRB[69] = 1;
isoBandNextORB[101] = isoBandNextORB[69] = 0;
isoBandNextXTL[101] = isoBandNextXTL[69] = 1;
isoBandNextYTL[101] = isoBandNextYTL[69] = 0;
isoBandNextOTL[101] = isoBandNextOTL[69] = 0;

isoBandNextXLB[149] = isoBandNextXLB[21] = 0;
isoBandNextYLB[149] = isoBandNextYLB[21] = 1;
isoBandNextOLB[149] = isoBandNextOLB[21] = 1;
isoBandNextXTR[149] = isoBandNextXTR[21] = -1;
isoBandNextYTR[149] = isoBandNextYTR[21] = 0;
isoBandNextOTR[149] = isoBandNextOTR[21] = 0;

isoBandNextXBR[86] = isoBandNextXBR[84] = -1;
isoBandNextYBR[86] = isoBandNextYBR[84] = 0;
isoBandNextOBR[86] = isoBandNextOBR[84] = 1;
isoBandNextXLT[86] = isoBandNextXLT[84] = 0;
isoBandNextYLT[86] = isoBandNextYLT[84] = -1;
isoBandNextOLT[86] = isoBandNextOLT[84] = 1;

isoBandNextXRT[89] = isoBandNextXRT[81] = 0;
isoBandNextYRT[89] = isoBandNextYRT[81] = -1;
isoBandNextORT[89] = isoBandNextORT[81] = 0;
isoBandNextXBL[89] = isoBandNextXBL[81] = 1;
isoBandNextYBL[89] = isoBandNextYBL[81] = 0;
isoBandNextOBL[89] = isoBandNextOBL[81] = 1;

isoBandNextXRT[96] = isoBandNextXRT[74] = 0;
isoBandNextYRT[96] = isoBandNextYRT[74] = 1;
isoBandNextORT[96] = isoBandNextORT[74] = 0;
isoBandNextXRB[96] = isoBandNextXRB[74] = -1;
isoBandNextYRB[96] = isoBandNextYRB[74] = 0;
isoBandNextORB[96] = isoBandNextORB[74] = 1;
isoBandNextXLT[96] = isoBandNextXLT[74] = 1;
isoBandNextYLT[96] = isoBandNextYLT[74] = 0;
isoBandNextOLT[96] = isoBandNextOLT[74] = 0;
isoBandNextXTL[96] = isoBandNextXTL[74] = 1;
isoBandNextYTL[96] = isoBandNextYTL[74] = 0;
isoBandNextOTL[96] = isoBandNextOTL[74] = 1;

isoBandNextXRT[24] = isoBandNextXRT[146] = 0;
isoBandNextYRT[24] = isoBandNextYRT[146] = -1;
isoBandNextORT[24] = isoBandNextORT[146] = 1;
isoBandNextXBR[24] = isoBandNextXBR[146] = 1;
isoBandNextYBR[24] = isoBandNextYBR[146] = 0;
isoBandNextOBR[24] = isoBandNextOBR[146] = 1;
isoBandNextXBL[24] = isoBandNextXBL[146] = 0;
isoBandNextYBL[24] = isoBandNextYBL[146] = 1;
isoBandNextOBL[24] = isoBandNextOBL[146] = 1;
isoBandNextXTR[24] = isoBandNextXTR[146] = 0;
isoBandNextYTR[24] = isoBandNextYTR[146] = -1;
isoBandNextOTR[24] = isoBandNextOTR[146] = 0;

isoBandNextXRB[6] = isoBandNextXRB[164] = -1;
isoBandNextYRB[6] = isoBandNextYRB[164] = 0;
isoBandNextORB[6] = isoBandNextORB[164] = 1;
isoBandNextXBR[6] = isoBandNextXBR[164] = -1;
isoBandNextYBR[6] = isoBandNextYBR[164] = 0;
isoBandNextOBR[6] = isoBandNextOBR[164] = 0;
isoBandNextXLB[6] = isoBandNextXLB[164] = 0;
isoBandNextYLB[6] = isoBandNextYLB[164] = -1;
isoBandNextOLB[6] = isoBandNextOLB[164] = 1;
isoBandNextXLT[6] = isoBandNextXLT[164] = 1;
isoBandNextYLT[6] = isoBandNextYLT[164] = 0;
isoBandNextOLT[6] = isoBandNextOLT[164] = 0;

isoBandNextXBL[129] = isoBandNextXBL[41] = 0;
isoBandNextYBL[129] = isoBandNextYBL[41] = 1;
isoBandNextOBL[129] = isoBandNextOBL[41] = 1;
isoBandNextXLB[129] = isoBandNextXLB[41] = 0;
isoBandNextYLB[129] = isoBandNextYLB[41] = 1;
isoBandNextOLB[129] = isoBandNextOLB[41] = 0;
isoBandNextXTL[129] = isoBandNextXTL[41] = -1;
isoBandNextYTL[129] = isoBandNextYTL[41] = 0;
isoBandNextOTL[129] = isoBandNextOTL[41] = 0;
isoBandNextXTR[129] = isoBandNextXTR[41] = 0;
isoBandNextYTR[129] = isoBandNextYTR[41] = -1;
isoBandNextOTR[129] = isoBandNextOTR[41] = 0;

isoBandNextXBR[66] = isoBandNextXBR[104] = 0;
isoBandNextYBR[66] = isoBandNextYBR[104] = 1;
isoBandNextOBR[66] = isoBandNextOBR[104] = 0;
isoBandNextXBL[66] = isoBandNextXBL[104] = -1;
isoBandNextYBL[66] = isoBandNextYBL[104] = 0;
isoBandNextOBL[66] = isoBandNextOBL[104] = 1;
isoBandNextXLT[66] = isoBandNextXLT[104] = 0;
isoBandNextYLT[66] = isoBandNextYLT[104] = -1;
isoBandNextOLT[66] = isoBandNextOLT[104] = 0;
isoBandNextXTL[66] = isoBandNextXTL[104] = 0;
isoBandNextYTL[66] = isoBandNextYTL[104] = -1;
isoBandNextOTL[66] = isoBandNextOTL[104] = 1;

isoBandNextXRT[144] = isoBandNextXRT[26] = -1;
isoBandNextYRT[144] = isoBandNextYRT[26] = 0;
isoBandNextORT[144] = isoBandNextORT[26] = 0;
isoBandNextXLB[144] = isoBandNextXLB[26] = 1;
isoBandNextYLB[144] = isoBandNextYLB[26] = 0;
isoBandNextOLB[144] = isoBandNextOLB[26] = 1;
isoBandNextXLT[144] = isoBandNextXLT[26] = 0;
isoBandNextYLT[144] = isoBandNextYLT[26] = 1;
isoBandNextOLT[144] = isoBandNextOLT[26] = 1;
isoBandNextXTR[144] = isoBandNextXTR[26] = -1;
isoBandNextYTR[144] = isoBandNextYTR[26] = 0;
isoBandNextOTR[144] = isoBandNextOTR[26] = 1;

isoBandNextXRB[36] = isoBandNextXRB[134] = 0;
isoBandNextYRB[36] = isoBandNextYRB[134] = 1;
isoBandNextORB[36] = isoBandNextORB[134] = 1;
isoBandNextXBR[36] = isoBandNextXBR[134] = 0;
isoBandNextYBR[36] = isoBandNextYBR[134] = 1;
isoBandNextOBR[36] = isoBandNextOBR[134] = 0;
isoBandNextXTL[36] = isoBandNextXTL[134] = 0;
isoBandNextYTL[36] = isoBandNextYTL[134] = -1;
isoBandNextOTL[36] = isoBandNextOTL[134] = 1;
isoBandNextXTR[36] = isoBandNextXTR[134] = 1;
isoBandNextYTR[36] = isoBandNextYTR[134] = 0;
isoBandNextOTR[36] = isoBandNextOTR[134] = 0;

isoBandNextXRT[9] = isoBandNextXRT[161] = -1;
isoBandNextYRT[9] = isoBandNextYRT[161] = 0;
isoBandNextORT[9] = isoBandNextORT[161] = 0;
isoBandNextXRB[9] = isoBandNextXRB[161] = 0;
isoBandNextYRB[9] = isoBandNextYRB[161] = -1;
isoBandNextORB[9] = isoBandNextORB[161] = 0;
isoBandNextXBL[9] = isoBandNextXBL[161] = 1;
isoBandNextYBL[9] = isoBandNextYBL[161] = 0;
isoBandNextOBL[9] = isoBandNextOBL[161] = 0;
isoBandNextXLB[9] = isoBandNextXLB[161] = 1;
isoBandNextYLB[9] = isoBandNextYLB[161] = 0;
isoBandNextOLB[9] = isoBandNextOLB[161] = 1;

/* 8-sided cases */
isoBandNextXRT[136] = 0;
isoBandNextYRT[136] = 1;
isoBandNextORT[136] = 1;
isoBandNextXRB[136] = 0;
isoBandNextYRB[136] = 1;
isoBandNextORB[136] = 0;
isoBandNextXBR[136] = -1;
isoBandNextYBR[136] = 0;
isoBandNextOBR[136] = 1;
isoBandNextXBL[136] = -1;
isoBandNextYBL[136] = 0;
isoBandNextOBL[136] = 0;
isoBandNextXLB[136] = 0;
isoBandNextYLB[136] = -1;
isoBandNextOLB[136] = 0;
isoBandNextXLT[136] = 0;
isoBandNextYLT[136] = -1;
isoBandNextOLT[136] = 1;
isoBandNextXTL[136] = 1;
isoBandNextYTL[136] = 0;
isoBandNextOTL[136] = 0;
isoBandNextXTR[136] = 1;
isoBandNextYTR[136] = 0;
isoBandNextOTR[136] = 1;

isoBandNextXRT[34] = 0;
isoBandNextYRT[34] = -1;
isoBandNextORT[34] = 0;
isoBandNextXRB[34] = 0;
isoBandNextYRB[34] = -1;
isoBandNextORB[34] = 1;
isoBandNextXBR[34] = 1;
isoBandNextYBR[34] = 0;
isoBandNextOBR[34] = 0;
isoBandNextXBL[34] = 1;
isoBandNextYBL[34] = 0;
isoBandNextOBL[34] = 1;
isoBandNextXLB[34] = 0;
isoBandNextYLB[34] = 1;
isoBandNextOLB[34] = 1;
isoBandNextXLT[34] = 0;
isoBandNextYLT[34] = 1;
isoBandNextOLT[34] = 0;
isoBandNextXTL[34] = -1;
isoBandNextYTL[34] = 0;
isoBandNextOTL[34] = 1;
isoBandNextXTR[34] = -1;
isoBandNextYTR[34] = 0;
isoBandNextOTR[34] = 0;

isoBandNextXRT[35] = 0;
isoBandNextYRT[35] = 1;
isoBandNextORT[35] = 1;
isoBandNextXRB[35] = 0;
isoBandNextYRB[35] = -1;
isoBandNextORB[35] = 1;
isoBandNextXBR[35] = 1;
isoBandNextYBR[35] = 0;
isoBandNextOBR[35] = 0;
isoBandNextXBL[35] = -1;
isoBandNextYBL[35] = 0;
isoBandNextOBL[35] = 0;
isoBandNextXLB[35] = 0;
isoBandNextYLB[35] = -1;
isoBandNextOLB[35] = 0;
isoBandNextXLT[35] = 0;
isoBandNextYLT[35] = 1;
isoBandNextOLT[35] = 0;
isoBandNextXTL[35] = -1;
isoBandNextYTL[35] = 0;
isoBandNextOTL[35] = 1;
isoBandNextXTR[35] = 1;
isoBandNextYTR[35] = 0;
isoBandNextOTR[35] = 1;

/* 6-sided cases */
isoBandNextXRT[153] = 0;
isoBandNextYRT[153] = 1;
isoBandNextORT[153] = 1;
isoBandNextXBL[153] = -1;
isoBandNextYBL[153] = 0;
isoBandNextOBL[153] = 0;
isoBandNextXLB[153] = 0;
isoBandNextYLB[153] = -1;
isoBandNextOLB[153] = 0;
isoBandNextXTR[153] = 1;
isoBandNextYTR[153] = 0;
isoBandNextOTR[153] = 1;

isoBandNextXRB[102] = 0;
isoBandNextYRB[102] = -1;
isoBandNextORB[102] = 1;
isoBandNextXBR[102] = 1;
isoBandNextYBR[102] = 0;
isoBandNextOBR[102] = 0;
isoBandNextXLT[102] = 0;
isoBandNextYLT[102] = 1;
isoBandNextOLT[102] = 0;
isoBandNextXTL[102] = -1;
isoBandNextYTL[102] = 0;
isoBandNextOTL[102] = 1;

isoBandNextXRT[155] = 0;
isoBandNextYRT[155] = -1;
isoBandNextORT[155] = 0;
isoBandNextXBL[155] = 1;
isoBandNextYBL[155] = 0;
isoBandNextOBL[155] = 1;
isoBandNextXLB[155] = 0;
isoBandNextYLB[155] = 1;
isoBandNextOLB[155] = 1;
isoBandNextXTR[155] = -1;
isoBandNextYTR[155] = 0;
isoBandNextOTR[155] = 0;

isoBandNextXRB[103] = 0;
isoBandNextYRB[103] = 1;
isoBandNextORB[103] = 0;
isoBandNextXBR[103] = -1;
isoBandNextYBR[103] = 0;
isoBandNextOBR[103] = 1;
isoBandNextXLT[103] = 0;
isoBandNextYLT[103] = -1;
isoBandNextOLT[103] = 1;
isoBandNextXTL[103] = 1;
isoBandNextYTL[103] = 0;
isoBandNextOTL[103] = 0;

/* 7-sided cases */
isoBandNextXRT[152] = 0;
isoBandNextYRT[152] = 1;
isoBandNextORT[152] = 1;
isoBandNextXBR[152] = -1;
isoBandNextYBR[152] = 0;
isoBandNextOBR[152] = 1;
isoBandNextXBL[152] = -1;
isoBandNextYBL[152] = 0;
isoBandNextOBL[152] = 0;
isoBandNextXLB[152] = 0;
isoBandNextYLB[152] = -1;
isoBandNextOLB[152] = 0;
isoBandNextXLT[152] = 0;
isoBandNextYLT[152] = -1;
isoBandNextOLT[152] = 1;
isoBandNextXTR[152] = 1;
isoBandNextYTR[152] = 0;
isoBandNextOTR[152] = 1;

isoBandNextXRT[156] = 0;
isoBandNextYRT[156] = -1;
isoBandNextORT[156] = 1;
isoBandNextXBR[156] = 1;
isoBandNextYBR[156] = 0;
isoBandNextOBR[156] = 1;
isoBandNextXBL[156] = -1;
isoBandNextYBL[156] = 0;
isoBandNextOBL[156] = 0;
isoBandNextXLB[156] = 0;
isoBandNextYLB[156] = -1;
isoBandNextOLB[156] = 0;
isoBandNextXLT[156] = 0;
isoBandNextYLT[156] = 1;
isoBandNextOLT[156] = 1;
isoBandNextXTR[156] = -1;
isoBandNextYTR[156] = 0;
isoBandNextOTR[156] = 1;

isoBandNextXRT[137] = 0;
isoBandNextYRT[137] = 1;
isoBandNextORT[137] = 1;
isoBandNextXRB[137] = 0;
isoBandNextYRB[137] = 1;
isoBandNextORB[137] = 0;
isoBandNextXBL[137] = -1;
isoBandNextYBL[137] = 0;
isoBandNextOBL[137] = 0;
isoBandNextXLB[137] = 0;
isoBandNextYLB[137] = -1;
isoBandNextOLB[137] = 0;
isoBandNextXTL[137] = 1;
isoBandNextYTL[137] = 0;
isoBandNextOTL[137] = 0;
isoBandNextXTR[137] = 1;
isoBandNextYTR[137] = 0;
isoBandNextOTR[137] = 1;

isoBandNextXRT[139] = 0;
isoBandNextYRT[139] = 1;
isoBandNextORT[139] = 1;
isoBandNextXRB[139] = 0;
isoBandNextYRB[139] = -1;
isoBandNextORB[139] = 0;
isoBandNextXBL[139] = 1;
isoBandNextYBL[139] = 0;
isoBandNextOBL[139] = 0;
isoBandNextXLB[139] = 0;
isoBandNextYLB[139] = 1;
isoBandNextOLB[139] = 0;
isoBandNextXTL[139] = -1;
isoBandNextYTL[139] = 0;
isoBandNextOTL[139] = 0;
isoBandNextXTR[139] = 1;
isoBandNextYTR[139] = 0;
isoBandNextOTR[139] = 1;

isoBandNextXRT[98] = 0;
isoBandNextYRT[98] = -1;
isoBandNextORT[98] = 0;
isoBandNextXRB[98] = 0;
isoBandNextYRB[98] = -1;
isoBandNextORB[98] = 1;
isoBandNextXBR[98] = 1;
isoBandNextYBR[98] = 0;
isoBandNextOBR[98] = 0;
isoBandNextXBL[98] = 1;
isoBandNextYBL[98] = 0;
isoBandNextOBL[98] = 1;
isoBandNextXLT[98] = 0;
isoBandNextYLT[98] = 1;
isoBandNextOLT[98] = 0;
isoBandNextXTL[98] = -1;
isoBandNextYTL[98] = 0;
isoBandNextOTL[98] = 1;

isoBandNextXRT[99] = 0;
isoBandNextYRT[99] = 1;
isoBandNextORT[99] = 0;
isoBandNextXRB[99] = 0;
isoBandNextYRB[99] = -1;
isoBandNextORB[99] = 1;
isoBandNextXBR[99] = 1;
isoBandNextYBR[99] = 0;
isoBandNextOBR[99] = 0;
isoBandNextXBL[99] = -1;
isoBandNextYBL[99] = 0;
isoBandNextOBL[99] = 1;
isoBandNextXLT[99] = 0;
isoBandNextYLT[99] = -1;
isoBandNextOLT[99] = 0;
isoBandNextXTL[99] = 1;
isoBandNextYTL[99] = 0;
isoBandNextOTL[99] = 1;

isoBandNextXRB[38] = 0;
isoBandNextYRB[38] = -1;
isoBandNextORB[38] = 1;
isoBandNextXBR[38] = 1;
isoBandNextYBR[38] = 0;
isoBandNextOBR[38] = 0;
isoBandNextXLB[38] = 0;
isoBandNextYLB[38] = 1;
isoBandNextOLB[38] = 1;
isoBandNextXLT[38] = 0;
isoBandNextYLT[38] = 1;
isoBandNextOLT[38] = 0;
isoBandNextXTL[38] = -1;
isoBandNextYTL[38] = 0;
isoBandNextOTL[38] = 1;
isoBandNextXTR[38] = -1;
isoBandNextYTR[38] = 0;
isoBandNextOTR[38] = 0;

isoBandNextXRB[39] = 0;
isoBandNextYRB[39] = 1;
isoBandNextORB[39] = 1;
isoBandNextXBR[39] = -1;
isoBandNextYBR[39] = 0;
isoBandNextOBR[39] = 0;
isoBandNextXLB[39] = 0;
isoBandNextYLB[39] = -1;
isoBandNextOLB[39] = 1;
isoBandNextXLT[39] = 0;
isoBandNextYLT[39] = 1;
isoBandNextOLT[39] = 0;
isoBandNextXTL[39] = -1;
isoBandNextYTL[39] = 0;
isoBandNextOTL[39] = 1;
isoBandNextXTR[39] = 1;
isoBandNextYTR[39] = 0;
isoBandNextOTR[39] = 0;


/*
  Define helper functions for the polygon_table
  */

/* triangle cases */
var p00 = function (cell) {
    return [[cell.bottomleft, 0], [0, 0], [0, cell.leftbottom]];
};
var p01 = function (cell) {
    return [[1, cell.rightbottom], [1, 0], [cell.bottomright, 0]];
};
var p02 = function (cell) {
    return [[cell.topright, 1], [1, 1], [1, cell.righttop]];
};
var p03 = function (cell) {
    return [[0, cell.lefttop], [0, 1], [cell.topleft, 1]];
};
/* trapezoid cases */
var p04 = function (cell) {
    return [[cell.bottomright, 0], [cell.bottomleft, 0], [0, cell.leftbottom], [0, cell.lefttop]];
};
var p05 = function (cell) {
    return [[cell.bottomright, 0], [cell.bottomleft, 0], [1, cell.righttop], [1, cell.rightbottom]];
};
var p06 = function (cell) {
    return [[1, cell.righttop], [1, cell.rightbottom], [cell.topleft, 1], [cell.topright, 1]];
};
var p07 = function (cell) {
    return [[0, cell.leftbottom], [0, cell.lefttop], [cell.topleft, 1], [cell.topright, 1]];
};
/* rectangle cases */
var p08 = function (cell) {
    return [[0, 0], [0, cell.leftbottom], [1, cell.rightbottom], [1, 0]];
};
var p09 = function (cell) {
    return [[1, 0], [cell.bottomright, 0], [cell.topright, 1], [1, 1]];
};
var p10 = function (cell) {
    return [[1, 1], [1, cell.righttop], [0, cell.lefttop], [0, 1]];
};
var p11 = function (cell) {
    return [[cell.bottomleft, 0], [0, 0], [0, 1], [cell.topleft, 1]];
};
var p12 = function (cell) {
    return [[1, cell.righttop], [1, cell.rightbottom], [0, cell.leftbottom], [0, cell.lefttop]];
};
var p13 = function (cell) {
    return [[cell.topleft, 1], [cell.topright, 1], [cell.bottomright, 0], [cell.bottomleft, 0]];
};
/* square case */
var p14 = function () {
    return [[0, 0], [0, 1], [1, 1], [1, 0]];
};
/* pentagon cases */
var p15 = function (cell) {
    return [[1, cell.rightbottom], [1, 0], [0, 0], [0, 1], [cell.topleft, 1]];
};
/* 1211 || 1011 */
var p16 = function (cell) {
    return [[cell.topright, 1], [1, 1], [1, 0], [0, 0], [0, cell.leftbottom]];
};
/* 2111 || 0111 */
var p17 = function (cell) {
    return [[1, 0], [cell.bottomright, 0], [0, cell.lefttop], [0, 1], [1, 1]];
};
/* 1112 || 1110 */
var p18 = function (cell) {
    return [[1, 1], [1, cell.righttop], [cell.bottomleft, 0], [0, 0], [0, 1]];
};
/* 1121 || 1101 */
var p19 = function (cell) {
    return [[1, cell.righttop], [1, cell.rightbottom], [0, cell.lefttop], [0, 1], [cell.topleft, 1]];
};
/* 1200 || 1022 */
var p20 = function (cell) {
    return [[1, 1], [1, cell.righttop], [cell.bottomright, 0], [cell.bottomleft, 0], [cell.topright, 1]];
};
/* 0120 || 2102 */
var p21 = function (cell) {
    return [[1, cell.rightbottom], [1, 0], [cell.bottomright, 0], [0, cell.leftbottom], [0, cell.lefttop]];
};
/* 0012 || 2210 */
var p22 = function (cell) {
    return [[cell.topright, 1], [cell.bottomleft, 0], [0, 0], [0, cell.leftbottom], [cell.topleft, 1]];
};
/* 2001 || 0221 */
var p23 = function (cell) {
    return [[cell.bottomright, 0], [cell.bottomleft, 0], [0, cell.lefttop], [0, 1], [cell.topleft, 1]];
};
/* 1002 || 1220 */
var p24 = function (cell) {
    return [[1, 1], [1, cell.righttop], [0, cell.leftbottom], [0, cell.lefttop], [cell.topright, 1]];
};
/* 2100 || 0122 */
var p25 = function (cell) {
    return [[1, cell.rightbottom], [1, 0], [cell.bottomright, 0], [cell.topleft, 1], [cell.topright, 1]];
};
/* 0210 || 2012 */
var p26 = function (cell) {
    return [[1, cell.righttop], [1, cell.rightbottom], [cell.bottomleft, 0], [0, 0], [0, cell.leftbottom]];
};
/* 0021 || 2201 */
/*hexagon cases */
var p27 = function (cell) {
    return [[1, cell.rightbottom], [1, 0], [0, 0], [0, cell.leftbottom], [cell.topleft, 1], [cell.topright, 1]];
};
/* 0211 || 2011 */
var p28 = function (cell) {
    return [[1, 1], [1, 0], [cell.bottomright, 0], [0, cell.leftbottom], [0, cell.lefttop], [cell.topright, 1]];
};
/* 2110 || 0112 */
var p29 = function (cell) {
    return [[1, 1], [1, cell.righttop], [cell.bottomright, 0], [cell.bottomleft, 0], [0, cell.lefttop], [0, 1]];
};
/* 1102 || 1120 */
var p30 = function (cell) {
    return [[1, cell.righttop], [1, cell.rightbottom], [cell.bottomleft, 0], [0, 0], [0, 1], [cell.topleft, 1]];
};
/* 1021 || 1201 */
var p31 = function (cell) {
    return [[1, 1], [1, cell.righttop], [cell.bottomleft, 0], [0, 0], [0, cell.leftbottom], [cell.topright, 1]];
};
/* 2101 || 0121 */
var p32 = function (cell) {
    return [[1, cell.rightbottom], [1, 0], [cell.bottomright, 0], [0, cell.lefttop], [0, 1], [cell.topleft, 1]];
};
/* 1012 || 1210 */
/* 8-sided cases */
var p33 = function (cell) {
    return [[1, cell.righttop], [1, cell.rightbottom], [cell.bottomright, 0], [cell.bottomleft, 0], [0, cell.leftbottom], [0, cell.lefttop], [cell.topleft, 1], [cell.topright, 1]];
};
/* flipped == 1 state for 0202 and 2020 */
/* 6-sided cases */
var p34 = function (cell) {
    return [[1, 1], [1, cell.righttop], [cell.bottomleft, 0], [0, 0], [0, cell.leftbottom], [cell.topright, 1]];
};
/* 0101 with flipped == 1 || 2121 with flipped == 1 */
var p35 = function (cell) {
    return [[1, cell.rightbottom], [1, 0], [cell.bottomright, 0], [0, cell.lefttop], [0, 1], [cell.topleft, 1]];
};
/* 1010 with flipped == 1 || 1212 with flipped == 1 */
/* 7-sided cases */
var p36 = function (cell) {
    return [[1, 1], [1, cell.righttop], [cell.bottomright, 0], [cell.bottomleft, 0], [0, cell.leftbottom], [0, cell.lefttop], [cell.topright, 1]];
};
/* 2120 with flipped == 1 || 0102 with flipped == 1 */
var p37 = function (cell) {
    return [[1, cell.righttop], [1, cell.rightbottom], [cell.bottomleft, 0], [0, 0], [0, cell.leftbottom], [cell.topleft, 1], [cell.topright, 1]];
};
/* 2021 with flipped == 1 || 0201 with flipped == 1 */
var p38 = function (cell) {
    return [[1, cell.righttop], [1, cell.rightbottom], [cell.bottomright, 0], [cell.bottomleft, 0], [0, cell.lefttop], [0, 1], [cell.topleft, 1]];
};
/* 1202 with flipped == 1 || 1020 with flipped == 1 */
var p39 = function (cell) {
    return [[1, cell.rightbottom], [1, 0], [cell.bottomright, 0], [0, cell.leftbottom], [0, cell.lefttop], [cell.topleft, 1], [cell.topright, 1]];
};
/* 0212 with flipped == 1 || 2010 with flipped == 1 */



/*
  The lookup tables for edge number given the polygon
  is entered at a specific location
*/

var isoBandEdgeRT = [];
var isoBandEdgeRB = [];
var isoBandEdgeBR = [];
var isoBandEdgeBL = [];
var isoBandEdgeLB = [];
var isoBandEdgeLT = [];
var isoBandEdgeTL = [];
var isoBandEdgeTR = [];

/* triangle cases */
isoBandEdgeBL[1]    = isoBandEdgeLB[1]    = 18;
isoBandEdgeBL[169]  = isoBandEdgeLB[169]  = 18;
isoBandEdgeBR[4]    = isoBandEdgeRB[4]    = 12;
isoBandEdgeBR[166]  = isoBandEdgeRB[166]  = 12;
isoBandEdgeRT[16]   = isoBandEdgeTR[16]   = 4;
isoBandEdgeRT[154]  = isoBandEdgeTR[154]  = 4;
isoBandEdgeLT[64]   = isoBandEdgeTL[64]   = 22;
isoBandEdgeLT[106]  = isoBandEdgeTL[106]  = 22;

/* trapezoid cases */
isoBandEdgeBR[2]    = isoBandEdgeLT[2]    = 17;
isoBandEdgeBL[2]    = isoBandEdgeLB[2]    = 18;
isoBandEdgeBR[168]  = isoBandEdgeLT[168]  = 17;
isoBandEdgeBL[168]  = isoBandEdgeLB[168]  = 18;
isoBandEdgeRT[8]    = isoBandEdgeBL[8]    = 9;
isoBandEdgeRB[8]    = isoBandEdgeBR[8]    = 12;
isoBandEdgeRT[162]  = isoBandEdgeBL[162]  = 9;
isoBandEdgeRB[162]  = isoBandEdgeBR[162]  = 12;
isoBandEdgeRT[32]   = isoBandEdgeTR[32]   = 4;
isoBandEdgeRB[32]   = isoBandEdgeTL[32]   = 1;
isoBandEdgeRT[138]  = isoBandEdgeTR[138]  = 4;
isoBandEdgeRB[138]  = isoBandEdgeTL[138]  = 1;
isoBandEdgeLB[128]  = isoBandEdgeTR[128]  = 21;
isoBandEdgeLT[128]  = isoBandEdgeTL[128]  = 22;
isoBandEdgeLB[42]   = isoBandEdgeTR[42]   = 21;
isoBandEdgeLT[42]   = isoBandEdgeTL[42]   = 22;

/* rectangle cases */
isoBandEdgeRB[5] = isoBandEdgeLB[5] = 14;
isoBandEdgeRB[165] = isoBandEdgeLB[165] = 14;
isoBandEdgeBR[20] = isoBandEdgeTR[20] = 6;
isoBandEdgeBR[150] = isoBandEdgeTR[150] = 6;
isoBandEdgeRT[80] = isoBandEdgeLT[80] = 11;
isoBandEdgeRT[90] = isoBandEdgeLT[90] = 11;
isoBandEdgeBL[65] = isoBandEdgeTL[65] = 3;
isoBandEdgeBL[105] = isoBandEdgeTL[105] = 3;
isoBandEdgeRT[160] = isoBandEdgeLT[160] = 11;
isoBandEdgeRB[160] = isoBandEdgeLB[160] = 14;
isoBandEdgeRT[10] = isoBandEdgeLT[10] = 11;
isoBandEdgeRB[10] = isoBandEdgeLB[10] = 14;
isoBandEdgeBR[130] = isoBandEdgeTR[130] = 6;
isoBandEdgeBL[130] = isoBandEdgeTL[130] = 3;
isoBandEdgeBR[40] = isoBandEdgeTR[40] = 6;
isoBandEdgeBL[40] = isoBandEdgeTL[40] = 3;

/* pentagon cases */
isoBandEdgeRB[101] = isoBandEdgeTL[101] = 1;
isoBandEdgeRB[69] = isoBandEdgeTL[69] = 1;
isoBandEdgeLB[149] = isoBandEdgeTR[149] = 21;
isoBandEdgeLB[21] = isoBandEdgeTR[21] = 21;
isoBandEdgeBR[86] = isoBandEdgeLT[86] = 17;
isoBandEdgeBR[84] = isoBandEdgeLT[84] = 17;
isoBandEdgeRT[89] = isoBandEdgeBL[89] = 9;
isoBandEdgeRT[81] = isoBandEdgeBL[81] = 9;
isoBandEdgeRT[96] = isoBandEdgeTL[96] = 0;
isoBandEdgeRB[96] = isoBandEdgeLT[96] = 15;
isoBandEdgeRT[74] = isoBandEdgeTL[74] = 0;
isoBandEdgeRB[74] = isoBandEdgeLT[74] = 15;
isoBandEdgeRT[24] = isoBandEdgeBR[24] = 8;
isoBandEdgeBL[24] = isoBandEdgeTR[24] = 7;
isoBandEdgeRT[146] = isoBandEdgeBR[146] = 8;
isoBandEdgeBL[146] = isoBandEdgeTR[146] = 7;
isoBandEdgeRB[6] = isoBandEdgeLT[6] = 15;
isoBandEdgeBR[6] = isoBandEdgeLB[6] = 16;
isoBandEdgeRB[164] = isoBandEdgeLT[164] = 15;
isoBandEdgeBR[164] = isoBandEdgeLB[164] = 16;
isoBandEdgeBL[129] = isoBandEdgeTR[129] = 7;
isoBandEdgeLB[129] = isoBandEdgeTL[129] = 20;
isoBandEdgeBL[41] = isoBandEdgeTR[41] = 7;
isoBandEdgeLB[41] = isoBandEdgeTL[41] = 20;
isoBandEdgeBR[66] = isoBandEdgeTL[66] = 2;
isoBandEdgeBL[66] = isoBandEdgeLT[66] = 19;
isoBandEdgeBR[104] = isoBandEdgeTL[104] = 2;
isoBandEdgeBL[104] = isoBandEdgeLT[104] = 19;
isoBandEdgeRT[144] = isoBandEdgeLB[144] = 10;
isoBandEdgeLT[144] = isoBandEdgeTR[144] = 23;
isoBandEdgeRT[26] = isoBandEdgeLB[26] = 10;
isoBandEdgeLT[26] = isoBandEdgeTR[26] = 23;
isoBandEdgeRB[36] = isoBandEdgeTR[36] = 5;
isoBandEdgeBR[36] = isoBandEdgeTL[36] = 2;
isoBandEdgeRB[134] = isoBandEdgeTR[134] = 5;
isoBandEdgeBR[134] = isoBandEdgeTL[134] = 2;
isoBandEdgeRT[9] = isoBandEdgeLB[9] = 10;
isoBandEdgeRB[9] = isoBandEdgeBL[9] = 13;
isoBandEdgeRT[161] = isoBandEdgeLB[161] = 10;
isoBandEdgeRB[161] = isoBandEdgeBL[161] = 13;

/* hexagon cases */
isoBandEdgeRB[37] = isoBandEdgeTR[37] = 5;
isoBandEdgeLB[37] = isoBandEdgeTL[37] = 20;
isoBandEdgeRB[133] = isoBandEdgeTR[133] = 5;
isoBandEdgeLB[133] = isoBandEdgeTL[133] = 20;
isoBandEdgeBR[148] = isoBandEdgeLB[148] = 16;
isoBandEdgeLT[148] = isoBandEdgeTR[148] = 23;
isoBandEdgeBR[22] = isoBandEdgeLB[22] = 16;
isoBandEdgeLT[22] = isoBandEdgeTR[22] = 23;
isoBandEdgeRT[82] = isoBandEdgeBR[82] = 8;
isoBandEdgeBL[82] = isoBandEdgeLT[82] = 19;
isoBandEdgeRT[88] = isoBandEdgeBR[88] = 8;
isoBandEdgeBL[88] = isoBandEdgeLT[88] = 19;
isoBandEdgeRT[73] = isoBandEdgeTL[73] = 0;
isoBandEdgeRB[73] = isoBandEdgeBL[73] = 13;
isoBandEdgeRT[97] = isoBandEdgeTL[97] = 0;
isoBandEdgeRB[97] = isoBandEdgeBL[97] = 13;
isoBandEdgeRT[145] = isoBandEdgeBL[145] = 9;
isoBandEdgeLB[145] = isoBandEdgeTR[145] = 21;
isoBandEdgeRT[25] = isoBandEdgeBL[25] = 9;
isoBandEdgeLB[25] = isoBandEdgeTR[25] = 21;
isoBandEdgeRB[70] = isoBandEdgeTL[70] = 1;
isoBandEdgeBR[70] = isoBandEdgeLT[70] = 17;
isoBandEdgeRB[100] = isoBandEdgeTL[100] = 1;
isoBandEdgeBR[100] = isoBandEdgeLT[100] = 17;

/* 8-sided cases */
isoBandEdgeRT[34] = isoBandEdgeBL[34] = 9;
isoBandEdgeRB[34] = isoBandEdgeBR[34] = 12;
isoBandEdgeLB[34] = isoBandEdgeTR[34] = 21;
isoBandEdgeLT[34] = isoBandEdgeTL[34] = 22;
isoBandEdgeRT[136] = isoBandEdgeTR[136] = 4;
isoBandEdgeRB[136] = isoBandEdgeTL[136] = 1;
isoBandEdgeBR[136] = isoBandEdgeLT[136] = 17;
isoBandEdgeBL[136] = isoBandEdgeLB[136] = 18;
isoBandEdgeRT[35] = isoBandEdgeTR[35] = 4;
isoBandEdgeRB[35] = isoBandEdgeBR[35] = 12;
isoBandEdgeBL[35] = isoBandEdgeLB[35] = 18;
isoBandEdgeLT[35] = isoBandEdgeTL[35] = 22;

/* 6-sided cases */
isoBandEdgeRT[153] = isoBandEdgeTR[153] = 4;
isoBandEdgeBL[153] = isoBandEdgeLB[153] = 18;
isoBandEdgeRB[102] = isoBandEdgeBR[102] = 12;
isoBandEdgeLT[102] = isoBandEdgeTL[102] = 22;
isoBandEdgeRT[155] = isoBandEdgeBL[155] = 9;
isoBandEdgeLB[155] = isoBandEdgeTR[155] = 23;
isoBandEdgeRB[103] = isoBandEdgeTL[103] = 1;
isoBandEdgeBR[103] = isoBandEdgeLT[103] = 17;

/* 7-sided cases */
isoBandEdgeRT[152] = isoBandEdgeTR[152] = 4;
isoBandEdgeBR[152] = isoBandEdgeLT[152] = 17;
isoBandEdgeBL[152] = isoBandEdgeLB[152] = 18;
isoBandEdgeRT[156] = isoBandEdgeBR[156] = 8;
isoBandEdgeBL[156] = isoBandEdgeLB[156] = 18;
isoBandEdgeLT[156] = isoBandEdgeTR[156] = 23;
isoBandEdgeRT[137] = isoBandEdgeTR[137] = 4;
isoBandEdgeRB[137] = isoBandEdgeTL[137] = 1;
isoBandEdgeBL[137] = isoBandEdgeLB[137] = 18;
isoBandEdgeRT[139] = isoBandEdgeTR[139] = 4;
isoBandEdgeRB[139] = isoBandEdgeBL[139] = 13;
isoBandEdgeLB[139] = isoBandEdgeTL[139] = 20;
isoBandEdgeRT[98] = isoBandEdgeBL[98] = 9;
isoBandEdgeRB[98] = isoBandEdgeBR[98] = 12;
isoBandEdgeLT[98] = isoBandEdgeTL[98] = 22;
isoBandEdgeRT[99] = isoBandEdgeTL[99] = 0;
isoBandEdgeRB[99] = isoBandEdgeBR[99] = 12;
isoBandEdgeBL[99] = isoBandEdgeLT[99] = 19;
isoBandEdgeRB[38] = isoBandEdgeBR[38] = 12;
isoBandEdgeLB[38] = isoBandEdgeTR[38] = 21;
isoBandEdgeLT[38] = isoBandEdgeTL[38] = 22;
isoBandEdgeRB[39] = isoBandEdgeTR[39] = 5;
isoBandEdgeBR[39] = isoBandEdgeLB[39] = 16;
isoBandEdgeLT[39] = isoBandEdgeTL[39] = 22;

/*
  The lookup tables for all different polygons that
  may appear within a grid cell
*/

var polygon_table = [];

/* triangle cases */
polygon_table[1] = polygon_table[169] = p00; /* 2221 || 0001 */
polygon_table[4] = polygon_table[166] = p01; /* 2212 || 0010 */
polygon_table[16] = polygon_table[154] = p02; /* 2122 || 0100 */
polygon_table[64] = polygon_table[106] = p03; /* 1222 || 1000 */

/* trapezoid cases */
polygon_table[168] = polygon_table[2] = p04; /* 2220 || 0002 */
polygon_table[162] = polygon_table[8] = p05; /* 2202 || 0020 */
polygon_table[138] = polygon_table[32] = p06; /* 2022 || 0200 */
polygon_table[42] = polygon_table[128] = p07; /* 0222 || 2000 */

/* rectangle cases */
polygon_table[5] = polygon_table[165] = p08; /* 0011 || 2211 */
polygon_table[20] = polygon_table[150] = p09; /* 0110 || 2112 */
polygon_table[80] = polygon_table[90] = p10; /* 1100 || 1122 */
polygon_table[65] = polygon_table[105] = p11; /* 1001 || 1221 */
polygon_table[160] = polygon_table[10] = p12; /* 2200 || 0022 */
polygon_table[130] = polygon_table[40] = p13; /* 2002 || 0220 */

/* square case */
polygon_table[85] = p14; /* 1111 */

/* pentagon cases */
polygon_table[101] = polygon_table[69] = p15; /* 1211 || 1011 */
polygon_table[149] = polygon_table[21] = p16; /* 2111 || 0111 */
polygon_table[86] = polygon_table[84] = p17; /* 1112 || 1110 */
polygon_table[89] = polygon_table[81] = p18; /* 1121 || 1101 */
polygon_table[96] = polygon_table[74] = p19; /* 1200 || 1022 */
polygon_table[24] = polygon_table[146] = p20; /* 0120 || 2102 */
polygon_table[6] = polygon_table[164] = p21; /* 0012 || 2210 */
polygon_table[129] = polygon_table[41] = p22; /* 2001 || 0221 */
polygon_table[66] = polygon_table[104] = p23; /* 1002 || 1220 */
polygon_table[144] = polygon_table[26] = p24; /* 2100 || 0122 */
polygon_table[36] = polygon_table[134] = p25; /* 0210 || 2012 */
polygon_table[9] = polygon_table[161] = p26; /* 0021 || 2201 */

/* hexagon cases */
polygon_table[37] = polygon_table[133] = p27; /* 0211 || 2011 */
polygon_table[148] = polygon_table[22] = p28; /* 2110 || 0112 */
polygon_table[82] = polygon_table[88] = p29; /* 1102 || 1120 */
polygon_table[73] = polygon_table[97] = p30; /* 1021 || 1201 */
polygon_table[145] = polygon_table[25] = p31; /* 2101 || 0121 */
polygon_table[70] = polygon_table[100] = p32; /* 1012 || 1210 */

/* 8-sided cases */
polygon_table[34] = function (c) { return [p07(c), p05(c)]; }; /* 0202 || 2020 with flipped == 0 */
polygon_table[35] = p33; /* flipped == 1 state for 0202 and 2020 */
polygon_table[136] = function (c) { return [p06(c), p04(c)]; }; /* 2020 || 0202 with flipped == 0 */

/* 6-sided cases */
polygon_table[153] = function (c) { return [p02(c), p00(c)]; }; /* 0101 with flipped == 0 || 2121 with flipped == 2 */
polygon_table[102] = function (c) { return [p01(c), p03(c)]; }; /* 1010 with flipped == 0 || 1212 with flipped == 2 */
polygon_table[155] = p34; /* 0101 with flipped == 1 || 2121 with flipped == 1 */
polygon_table[103] = p35; /* 1010 with flipped == 1 || 1212 with flipped == 1 */

/* 7-sided cases */
polygon_table[152] = function (c) { return [p02(c), p04(c)]; }; /* 2120 with flipped == 2 || 0102 with flipped == 0 */
polygon_table[156] = p36; /* 2120 with flipped == 1 || 0102 with flipped == 1 */
polygon_table[137] = function (c) { return [p06(c), p00(c)]; }; /* 2021 with flipped == 2 || 0201 with flipped == 0 */
polygon_table[139] = p37; /* 2021 with flipped == 1 || 0201 with flipped == 1 */
polygon_table[98] = function (c) { return [p05(c), p03(c)]; }; /* 1202 with flipped == 2 || 1020 with flipped == 0 */
polygon_table[99] = p38; /* 1202 with flipped == 1 || 1020 with flipped == 1 */
polygon_table[38] = function (c) { return [p01(c), p07(c)]; }; /* 0212 with flipped == 2 || 2010 with flipped == 0 */
polygon_table[39] = p39; /* 0212 with flipped == 1 || 2010 with flipped == 1 */


/*
####################################
Some small helper functions
####################################
*/

/* assume that x1 == 1 &&  x0 == 0 */
function interpolateX(y, y0, y1) {
    return (y - y0) / (y1 - y0);
}

function isArray(myArray) {
    return myArray.constructor.toString().indexOf('Array') > -1;
}

/*
####################################
Below is the actual Marching Squares implementation
####################################
*/

function computeBandGrid(data, minV, bandwidth) {
    var rows = data.length - 1;
    var cols = data[0].length - 1;
    var BandGrid = { rows: rows, cols: cols, cells: [] };

    var maxV = minV + Math.abs(bandwidth);

    for (var j = 0; j < rows; ++j) {
        BandGrid.cells[j] = [];
        for (var i = 0; i < cols; ++i) {
            /*  compose the 4-trit corner representation */
            var cval = 0;

            var tl = data[j + 1][i];
            var tr = data[j + 1][i + 1];
            var br = data[j][i + 1];
            var bl = data[j][i];

            if (isNaN(tl) || isNaN(tr) || isNaN(br) || isNaN(bl)) {
                continue;
            }

            cval |= (tl < minV) ? 0 : (tl > maxV) ? 128 : 64;
            cval |= (tr < minV) ? 0 : (tr > maxV) ? 32 : 16;
            cval |= (br < minV) ? 0 : (br > maxV) ? 8 : 4;
            cval |= (bl < minV) ? 0 : (bl > maxV) ? 2 : 1;

            var cval_real = +cval;

            /* resolve ambiguity via averaging */
            var flipped = 0;
            if ((cval === 17)  || /* 0101 */
          (cval === 18)  || /* 0102 */
          (cval === 33)  || /* 0201 */
          (cval === 34)  || /* 0202 */
          (cval === 38)  || /* 0212 */
          (cval === 68)  || /* 1010 */
          (cval === 72)  || /* 1020 */
          (cval === 98)  || /* 1202 */
          (cval === 102)  || /* 1212 */
          (cval === 132)  || /* 2010 */
          (cval === 136)  || /* 2020 */
          (cval === 137)  || /* 2021 */
          (cval === 152)  || /* 2120 */
          (cval === 153) /* 2121 */
            ) {
                var average = (tl + tr + br + bl) / 4;
                /* set flipped state */
                flipped = (average > maxV) ? 2 : (average < minV) ? 0 : 1;

                /* adjust cval for flipped cases */

                /* 8-sided cases */
                if (cval === 34) {
                    if (flipped === 1) {
                        cval = 35;
                    } else if (flipped === 0) {
                        cval = 136;
                    }
                } else if (cval === 136) {
                    if (flipped === 1) {
                        cval = 35;
                        flipped = 4;
                    } else if (flipped === 0) {
                        cval = 34;
                    }
                }

                /* 6-sided polygon cases */
                else if (cval === 17) {
                    if (flipped === 1) {
                        cval = 155;
                        flipped = 4;
                    } else if (flipped === 0) {
                        cval = 153;
                    }
                } else if (cval === 68) {
                    if (flipped === 1) {
                        cval = 103;
                        flipped = 4;
                    } else if (flipped === 0) {
                        cval = 102;
                    }
                } else if (cval === 153) {
                    if (flipped === 1)
                        cval = 155;
                } else if (cval === 102) {
                    if (flipped === 1)
                        cval = 103;
                }

                /* 7-sided polygon cases */
                else if (cval === 152) {
                    if (flipped < 2) {
                        cval    = 156;
                        flipped = 1;
                    }
                } else if (cval === 137) {
                    if (flipped < 2) {
                        cval = 139;
                        flipped = 1;
                    }
                } else if (cval === 98) {
                    if (flipped < 2) {
                        cval    = 99;
                        flipped = 1;
                    }
                } else if (cval === 38) {
                    if (flipped < 2) {
                        cval    = 39;
                        flipped = 1;
                    }
                } else if (cval === 18) {
                    if (flipped > 0) {
                        cval = 156;
                        flipped = 4;
                    } else {
                        cval = 152;
                    }
                } else if (cval === 33) {
                    if (flipped > 0) {
                        cval = 139;
                        flipped = 4;
                    } else {
                        cval = 137;
                    }
                } else if (cval === 72) {
                    if (flipped > 0) {
                        cval = 99;
                        flipped = 4;
                    } else {
                        cval = 98;
                    }
                } else if (cval === 132) {
                    if (flipped > 0) {
                        cval = 39;
                        flipped = 4;
                    } else {
                        cval = 38;
                    }
                }
            }

            /* add cell to BandGrid if it contains at least one polygon-side */
            if ((cval != 0) && (cval != 170)) {
                var topleft, topright, bottomleft, bottomright,
                    righttop, rightbottom, lefttop, leftbottom;

                topleft = topright = bottomleft = bottomright = righttop =
                rightbottom = lefttop = leftbottom = 0.5;

                var edges = [];

                /* do interpolation here */
                /* 1st Triangles */
                if (cval === 1) { /* 0001 */
                    bottomleft = 1 - interpolateX(minV, br, bl);
                    leftbottom = 1 - interpolateX(minV, tl, bl);
                    edges.push(isoBandEdgeBL[cval]);
                } else if (cval === 169) { /* 2221 */
                    bottomleft = interpolateX(maxV, bl, br);
                    leftbottom = interpolateX(maxV, bl, tl);
                    edges.push(isoBandEdgeBL[cval]);
                } else if (cval === 4) { /* 0010 */
                    rightbottom = 1 - interpolateX(minV, tr, br);
                    bottomright = interpolateX(minV, bl, br);
                    edges.push(isoBandEdgeRB[cval]);
                } else if (cval === 166) { /* 2212 */
                    rightbottom = interpolateX(maxV, br, tr);
                    bottomright = 1 - interpolateX(maxV, br, bl);
                    edges.push(isoBandEdgeRB[cval]);
                } else if (cval === 16) { /* 0100 */
                    righttop = interpolateX(minV, br, tr);
                    topright = interpolateX(minV, tl, tr);
                    edges.push(isoBandEdgeRT[cval]);
                } else if (cval === 154) { /* 2122 */
                    righttop = 1 - interpolateX(maxV, tr, br);
                    topright = 1 - interpolateX(maxV, tr, tl);
                    edges.push(isoBandEdgeRT[cval]);
                } else if (cval === 64) { /* 1000 */
                    lefttop = interpolateX(minV, bl, tl);
                    topleft = 1 - interpolateX(minV, tr, tl);
                    edges.push(isoBandEdgeLT[cval]);
                } else if (cval === 106) { /* 1222 */
                    lefttop = 1 - interpolateX(maxV, tl, bl);
                    topleft = interpolateX(maxV, tl, tr);
                    edges.push(isoBandEdgeLT[cval]);
                }
                /* 2nd Trapezoids */
                else if (cval === 168) { /* 2220 */
                    bottomright = interpolateX(maxV, bl, br);
                    bottomleft = interpolateX(minV, bl, br);
                    leftbottom = interpolateX(minV, bl, tl);
                    lefttop = interpolateX(maxV, bl, tl);
                    edges.push(isoBandEdgeBR[cval]);
                    edges.push(isoBandEdgeBL[cval]);
                } else if (cval === 2) { /* 0002 */
                    bottomright = 1 - interpolateX(minV, br, bl);
                    bottomleft = 1 - interpolateX(maxV, br, bl);
                    leftbottom = 1 - interpolateX(maxV, tl, bl);
                    lefttop = 1 - interpolateX(minV, tl, bl);
                    edges.push(isoBandEdgeBR[cval]);
                    edges.push(isoBandEdgeBL[cval]);
                } else if (cval === 162) { /* 2202 */
                    righttop = interpolateX(maxV, br, tr);
                    rightbottom = interpolateX(minV, br, tr);
                    bottomright = 1 - interpolateX(minV, br, bl);
                    bottomleft = 1 - interpolateX(maxV, br, bl);
                    edges.push(isoBandEdgeBR[cval]);
                    edges.push(isoBandEdgeBL[cval]);
                } else if (cval === 8) { /* 0020 */
                    righttop = 1 - interpolateX(minV, tr, br);
                    rightbottom = 1 - interpolateX(maxV, tr, br);
                    bottomright = interpolateX(maxV, bl, br);
                    bottomleft = interpolateX(minV, bl, br);
                    edges.push(isoBandEdgeRT[cval]);
                    edges.push(isoBandEdgeRB[cval]);
                } else if (cval === 138) { /* 2022 */
                    righttop = 1 - interpolateX(minV, tr, br);
                    rightbottom = 1 - interpolateX(maxV, tr, br);
                    topleft = 1 - interpolateX(maxV, tr, tl);
                    topright = 1 - interpolateX(minV, tr, tl);
                    edges.push(isoBandEdgeRT[cval]);
                    edges.push(isoBandEdgeRB[cval]);
                } else if (cval === 32) { /* 0200 */
                    righttop = interpolateX(maxV, br, tr);
                    rightbottom = interpolateX(minV, br, tr);
                    topleft = interpolateX(minV, tl, tr);
                    topright = interpolateX(maxV, tl, tr);
                    edges.push(isoBandEdgeRT[cval]);
                    edges.push(isoBandEdgeRB[cval]);
                } else if (cval === 42) { /* 0222 */
                    leftbottom = 1 - interpolateX(maxV, tl, bl);
                    lefttop = 1 - interpolateX(minV, tl, bl);
                    topleft = interpolateX(minV, tl, tr);
                    topright = interpolateX(maxV, tl, tr);
                    edges.push(isoBandEdgeLB[cval]);
                    edges.push(isoBandEdgeLT[cval]);
                } else if (cval === 128) { /* 2000 */
                    leftbottom = interpolateX(minV, bl, tl);
                    lefttop = interpolateX(maxV, bl, tl);
                    topleft = 1 - interpolateX(maxV, tr, tl);
                    topright = 1 - interpolateX(minV, tr, tl);
                    edges.push(isoBandEdgeLB[cval]);
                    edges.push(isoBandEdgeLT[cval]);
                }

                /* 3rd rectangle cases */
                if (cval === 5) { /* 0011 */
                    rightbottom = 1 - interpolateX(minV, tr, br);
                    leftbottom = 1 - interpolateX(minV, tl, bl);
                    edges.push(isoBandEdgeRB[cval]);
                } else if (cval === 165) { /* 2211 */
                    rightbottom = interpolateX(maxV, br, tr);
                    leftbottom = interpolateX(maxV, bl, tl);
                    edges.push(isoBandEdgeRB[cval]);
                } else if (cval === 20) { /* 0110 */
                    bottomright = interpolateX(minV, bl, br);
                    topright = interpolateX(minV, tl, tr);
                    edges.push(isoBandEdgeBR[cval]);
                } else if (cval === 150) { /* 2112 */
                    bottomright = 1 - interpolateX(maxV, br, bl);
                    topright = 1 - interpolateX(maxV, tr, tl);
                    edges.push(isoBandEdgeBR[cval]);
                } else if (cval === 80) { /* 1100 */
                    righttop = interpolateX(minV, br, tr);
                    lefttop = interpolateX(minV, bl, tl);
                    edges.push(isoBandEdgeRT[cval]);
                } else if (cval === 90) { /* 1122 */
                    righttop = 1 - interpolateX(maxV, tr, br);
                    lefttop = 1 - interpolateX(maxV, tl, bl);
                    edges.push(isoBandEdgeRT[cval]);
                } else if (cval === 65) { /* 1001 */
                    bottomleft = 1 - interpolateX(minV, br, bl);
                    topleft = 1 - interpolateX(minV, tr, tl);
                    edges.push(isoBandEdgeBL[cval]);
                } else if (cval === 105) { /* 1221 */
                    bottomleft = interpolateX(maxV, bl, br);
                    topleft = interpolateX(maxV, tl, tr);
                    edges.push(isoBandEdgeBL[cval]);
                } else if (cval === 160) { /* 2200 */
                    righttop = interpolateX(maxV, br, tr);
                    rightbottom = interpolateX(minV, br, tr);
                    leftbottom = interpolateX(minV, bl, tl);
                    lefttop = interpolateX(maxV, bl, tl);
                    edges.push(isoBandEdgeRT[cval]);
                    edges.push(isoBandEdgeRB[cval]);
                } else if (cval === 10) { /* 0022 */
                    righttop = 1 - interpolateX(minV, tr, br);
                    rightbottom = 1 - interpolateX(maxV, tr, br);
                    leftbottom = 1 - interpolateX(maxV, tl, bl);
                    lefttop = 1 - interpolateX(minV, tl, bl);
                    edges.push(isoBandEdgeRT[cval]);
                    edges.push(isoBandEdgeRB[cval]);
                } else if (cval === 130) { /* 2002 */
                    bottomright = 1 - interpolateX(minV, br, bl);
                    bottomleft = 1 - interpolateX(maxV, br, bl);
                    topleft = 1 - interpolateX(maxV, tr, tl);
                    topright = 1 - interpolateX(minV, tr, tl);
                    edges.push(isoBandEdgeBR[cval]);
                    edges.push(isoBandEdgeBL[cval]);
                } else if (cval === 40) { /* 0220 */
                    bottomright = interpolateX(maxV, bl, br);
                    bottomleft = interpolateX(minV, bl, br);
                    topleft = interpolateX(minV, tl, tr);
                    topright = interpolateX(maxV, tl, tr);
                    edges.push(isoBandEdgeBR[cval]);
                    edges.push(isoBandEdgeBL[cval]);
                }

                /* 4th single pentagon cases */
                else if (cval === 101) { /* 1211 */
                    rightbottom = interpolateX(maxV, br, tr);
                    topleft = interpolateX(maxV, tl, tr);
                    edges.push(isoBandEdgeRB[cval]);
                } else if (cval === 69) { /* 1011 */
                    rightbottom = 1 - interpolateX(minV, tr, br);
                    topleft = 1 - interpolateX(minV, tr, tl);
                    edges.push(isoBandEdgeRB[cval]);
                } else if (cval === 149) { /* 2111 */
                    leftbottom = interpolateX(maxV, bl, tl);
                    topright = 1 - interpolateX(maxV, tr, tl);
                    edges.push(isoBandEdgeLB[cval]);
                } else if (cval === 21) { /* 0111 */
                    leftbottom = 1 - interpolateX(minV, tl, bl);
                    topright = interpolateX(minV, tl, tr);
                    edges.push(isoBandEdgeLB[cval]);
                } else if (cval === 86) { /* 1112 */
                    bottomright = 1 - interpolateX(maxV, br, bl);
                    lefttop = 1 - interpolateX(maxV, tl, bl);
                    edges.push(isoBandEdgeBR[cval]);
                } else if (cval === 84) { /* 1110 */
                    bottomright = interpolateX(minV, bl, br);
                    lefttop = interpolateX(minV, bl, tl);
                    edges.push(isoBandEdgeBR[cval]);
                } else if (cval === 89) { /* 1121 */
                    righttop = 1 - interpolateX(maxV, tr, br);
                    bottomleft = interpolateX(maxV, bl, br);
                    edges.push(isoBandEdgeBL[cval]);
                } else if (cval === 81) { /* 1101 */
                    righttop = interpolateX(minV, br, tr);
                    bottomleft = 1 - interpolateX(minV, br, bl);
                    edges.push(isoBandEdgeBL[cval]);
                } else if (cval === 96) { /* 1200 */
                    righttop = interpolateX(maxV, br, tr);
                    rightbottom = interpolateX(minV, br, tr);
                    lefttop = interpolateX(minV, bl, tl);
                    topleft = interpolateX(maxV, tl, tr);
                    edges.push(isoBandEdgeRT[cval]);
                    edges.push(isoBandEdgeRB[cval]);
                } else if (cval === 74) { /* 1022 */
                    righttop = 1 - interpolateX(minV, tr, br);
                    rightbottom = 1 - interpolateX(maxV, tr, br);
                    lefttop = 1 - interpolateX(maxV, tl, bl);
                    topleft = 1 - interpolateX(minV, tr, tl);
                    edges.push(isoBandEdgeRT[cval]);
                    edges.push(isoBandEdgeRB[cval]);
                } else if (cval === 24) { /* 0120 */
                    righttop = 1 - interpolateX(maxV, tr, br);
                    bottomright = interpolateX(maxV, bl, br);
                    bottomleft = interpolateX(minV, bl, br);
                    topright = interpolateX(minV, tl, tr);
                    edges.push(isoBandEdgeRT[cval]);
                    edges.push(isoBandEdgeBL[cval]);
                } else if (cval === 146) { /* 2102 */
                    righttop = interpolateX(minV, br, tr);
                    bottomright = 1 - interpolateX(minV, br, bl);
                    bottomleft = 1 - interpolateX(maxV, br, bl);
                    topright = 1 - interpolateX(maxV, tr, tl);
                    edges.push(isoBandEdgeRT[cval]);
                    edges.push(isoBandEdgeBL[cval]);
                } else if (cval === 6) { /* 0012 */
                    rightbottom = 1 - interpolateX(minV, tr, br);
                    bottomright = 1 - interpolateX(maxV, br, bl);
                    leftbottom = 1 - interpolateX(maxV, tl, bl);
                    lefttop = 1 - interpolateX(minV, tl, bl);
                    edges.push(isoBandEdgeRB[cval]);
                    edges.push(isoBandEdgeBR[cval]);
                } else if (cval === 164) { /* 2210 */
                    rightbottom = interpolateX(maxV, br, tr);
                    bottomright = interpolateX(minV, bl, br);
                    leftbottom = interpolateX(minV, bl, tl);
                    lefttop = interpolateX(maxV, bl, tl);
                    edges.push(isoBandEdgeRB[cval]);
                    edges.push(isoBandEdgeBR[cval]);
                } else if (cval === 129) { /* 2001 */
                    bottomleft = 1 - interpolateX(minV, br, bl);
                    leftbottom = interpolateX(maxV, bl, tl);
                    topleft = 1 - interpolateX(maxV, tr, tl);
                    topright = 1 - interpolateX(minV, tr, tl);
                    edges.push(isoBandEdgeBL[cval]);
                    edges.push(isoBandEdgeLB[cval]);
                } else if (cval === 41) { /* 0221 */
                    bottomleft = interpolateX(maxV, bl, br);
                    leftbottom = 1 - interpolateX(minV, tl, bl);
                    topleft = interpolateX(minV, tl, tr);
                    topright = interpolateX(maxV, tl, tr);
                    edges.push(isoBandEdgeBL[cval]);
                    edges.push(isoBandEdgeLB[cval]);
                } else if (cval === 66) { /* 1002 */
                    bottomright = 1 - interpolateX(minV, br, bl);
                    bottomleft = 1 - interpolateX(maxV, br, bl);
                    lefttop = 1 - interpolateX(maxV, tl, bl);
                    topleft = 1 - interpolateX(minV, tr, tl);
                    edges.push(isoBandEdgeBR[cval]);
                    edges.push(isoBandEdgeBL[cval]);
                } else if (cval === 104) { /* 1220 */
                    bottomright = interpolateX(maxV, bl, br);
                    bottomleft = interpolateX(minV, bl, br);
                    lefttop = interpolateX(minV, bl, tl);
                    topleft = interpolateX(maxV, tl, tr);
                    edges.push(isoBandEdgeBL[cval]);
                    edges.push(isoBandEdgeTL[cval]);
                } else if (cval === 144) { /* 2100 */
                    righttop = interpolateX(minV, br, tr);
                    leftbottom = interpolateX(minV, bl, tl);
                    lefttop = interpolateX(maxV, bl, tl);
                    topright = 1 - interpolateX(maxV, tr, tl);
                    edges.push(isoBandEdgeRT[cval]);
                    edges.push(isoBandEdgeLT[cval]);
                } else if (cval === 26) { /* 0122 */
                    righttop = 1 - interpolateX(maxV, tr, br);
                    leftbottom = 1 - interpolateX(maxV, tl, bl);
                    lefttop = 1 - interpolateX(minV, tl, bl);
                    topright = interpolateX(minV, tl, tr);
                    edges.push(isoBandEdgeRT[cval]);
                    edges.push(isoBandEdgeLT[cval]);
                } else if (cval === 36) { /* 0210 */
                    rightbottom = interpolateX(maxV, br, tr);
                    bottomright = interpolateX(minV, bl, br);
                    topleft = interpolateX(minV, tl, tr);
                    topright = interpolateX(maxV, tl, tr);
                    edges.push(isoBandEdgeRB[cval]);
                    edges.push(isoBandEdgeBR[cval]);
                } else if (cval === 134) { /* 2012 */
                    rightbottom = 1 - interpolateX(minV, tr, br);
                    bottomright = 1 - interpolateX(maxV, br, bl);
                    topleft = 1 - interpolateX(maxV, tr, tl);
                    topright = 1 - interpolateX(minV, tr, tl);
                    edges.push(isoBandEdgeRB[cval]);
                    edges.push(isoBandEdgeBR[cval]);
                } else if (cval === 9) { /* 0021 */
                    righttop = 1 - interpolateX(minV, tr, br);
                    rightbottom = 1 - interpolateX(maxV, tr, br);
                    bottomleft = interpolateX(maxV, bl, br);
                    leftbottom = 1 - interpolateX(minV, tl, bl);
                    edges.push(isoBandEdgeRT[cval]);
                    edges.push(isoBandEdgeRB[cval]);
                } else if (cval === 161) { /* 2201 */
                    righttop = interpolateX(maxV, br, tr);
                    rightbottom = interpolateX(minV, br, tr);
                    bottomleft = 1 - interpolateX(minV, br, bl);
                    leftbottom = interpolateX(maxV, bl, tl);
                    edges.push(isoBandEdgeRT[cval]);
                    edges.push(isoBandEdgeRB[cval]);
                }

                /* 5th single hexagon cases */
                else if (cval === 37) { /* 0211 */
                    rightbottom = interpolateX(maxV, br, tr);
                    leftbottom = 1 - interpolateX(minV, tl, bl);
                    topleft = interpolateX(minV, tl, tr);
                    topright = interpolateX(maxV, tl, tr);
                    edges.push(isoBandEdgeRB[cval]);
                    edges.push(isoBandEdgeLB[cval]);
                } else if (cval === 133) { /* 2011 */
                    rightbottom = 1 - interpolateX(minV, tr, br);
                    leftbottom = interpolateX(maxV, bl, tl);
                    topleft = 1 - interpolateX(maxV, tr, tl);
                    topright = 1 - interpolateX(minV, tr, tl);
                    edges.push(isoBandEdgeRB[cval]);
                    edges.push(isoBandEdgeLB[cval]);
                } else if (cval === 148) { /* 2110 */
                    bottomright = interpolateX(minV, bl, br);
                    leftbottom = interpolateX(minV, bl, tl);
                    lefttop = interpolateX(maxV, bl, tl);
                    topright = 1 - interpolateX(maxV, tr, tl);
                    edges.push(isoBandEdgeBR[cval]);
                    edges.push(isoBandEdgeLT[cval]);
                } else if (cval === 22) { /* 0112 */
                    bottomright = 1 - interpolateX(maxV, br, bl);
                    leftbottom = 1 - interpolateX(maxV, tl, bl);
                    lefttop = 1 - interpolateX(minV, tl, bl);
                    topright = interpolateX(minV, tl, tr);
                    edges.push(isoBandEdgeBR[cval]);
                    edges.push(isoBandEdgeLT[cval]);
                } else if (cval === 82) { /* 1102 */
                    righttop = interpolateX(minV, br, tr);
                    bottomright = 1 - interpolateX(minV, br, bl);
                    bottomleft = 1 - interpolateX(maxV, br, bl);
                    lefttop = 1 - interpolateX(maxV, tl, bl);
                    edges.push(isoBandEdgeRT[cval]);
                    edges.push(isoBandEdgeBL[cval]);
                } else if (cval === 88) { /* 1120 */
                    righttop = 1 - interpolateX(maxV, tr, br);
                    bottomright = interpolateX(maxV, bl, br);
                    bottomleft = interpolateX(minV, bl, br);
                    lefttop = interpolateX(minV, bl, tl);
                    edges.push(isoBandEdgeRT[cval]);
                    edges.push(isoBandEdgeBL[cval]);
                } else if (cval === 73) { /* 1021 */
                    righttop = 1 - interpolateX(minV, tr, br);
                    rightbottom = 1 - interpolateX(maxV, tr, br);
                    bottomleft = interpolateX(maxV, bl, br);
                    topleft = 1 - interpolateX(minV, tr, tl);
                    edges.push(isoBandEdgeRT[cval]);
                    edges.push(isoBandEdgeRB[cval]);
                } else if (cval === 97) { /* 1201 */
                    righttop = interpolateX(maxV, br, tr);
                    rightbottom = interpolateX(minV, br, tr);
                    bottomleft = 1 - interpolateX(minV, br, bl);
                    topleft = interpolateX(maxV, tl, tr);
                    edges.push(isoBandEdgeRT[cval]);
                    edges.push(isoBandEdgeRB[cval]);
                } else if (cval === 145) { /* 2101 */
                    righttop = interpolateX(minV, br, tr);
                    bottomleft = 1 - interpolateX(minV, br, bl);
                    leftbottom = interpolateX(maxV, bl, tl);
                    topright = 1 - interpolateX(maxV, tr, tl);
                    edges.push(isoBandEdgeRT[cval]);
                    edges.push(isoBandEdgeLB[cval]);
                } else if (cval === 25) { /* 0121 */
                    righttop = 1 - interpolateX(maxV, tr, br);
                    bottomleft = interpolateX(maxV, bl, br);
                    leftbottom = 1 - interpolateX(minV, tl, bl);
                    topright = interpolateX(minV, tl, tr);
                    edges.push(isoBandEdgeRT[cval]);
                    edges.push(isoBandEdgeLB[cval]);
                } else if (cval === 70) { /* 1012 */
                    rightbottom = 1 - interpolateX(minV, tr, br);
                    bottomright = 1 - interpolateX(maxV, br, bl);
                    lefttop = 1 - interpolateX(maxV, tl, bl);
                    topleft = 1 - interpolateX(minV, tr, tl);
                    edges.push(isoBandEdgeRB[cval]);
                    edges.push(isoBandEdgeBR[cval]);
                } else if (cval === 100) { /* 1210 */
                    rightbottom = interpolateX(maxV, br, tr);
                    bottomright = interpolateX(minV, bl, br);
                    lefttop = interpolateX(minV, bl, tl);
                    topleft = interpolateX(maxV, tl, tr);
                    edges.push(isoBandEdgeRB[cval]);
                    edges.push(isoBandEdgeBR[cval]);
                }

                /* 8-sided cases */
                else if (cval === 34) { /* 0202 || 2020 with flipped == 0 */
                    if (flipped === 0) {
                        righttop = 1 - interpolateX(minV, tr, br);
                        rightbottom = 1 - interpolateX(maxV, tr, br);
                        bottomright = interpolateX(maxV, bl, br);
                        bottomleft = interpolateX(minV, bl, br);
                        leftbottom = interpolateX(minV, bl, tl);
                        lefttop = interpolateX(maxV, bl, tl);
                        topleft = 1 - interpolateX(maxV, tr, tl);
                        topright = 1 - interpolateX(minV, tr, tl);
                    } else {
                        righttop = interpolateX(maxV, br, tr);
                        rightbottom = interpolateX(minV, br, tr);
                        bottomright = 1 - interpolateX(minV, br, bl);
                        bottomleft = 1 - interpolateX(maxV, br, bl);
                        leftbottom = 1 - interpolateX(maxV, tl, bl);
                        lefttop = 1 - interpolateX(minV, tl, bl);
                        topleft = interpolateX(minV, tl, tr);
                        topright = interpolateX(maxV, tl, tr);
                    }
                    edges.push(isoBandEdgeRT[cval]);
                    edges.push(isoBandEdgeRB[cval]);
                    edges.push(isoBandEdgeLB[cval]);
                    edges.push(isoBandEdgeLT[cval]);
                } else if (cval === 35) { /* flipped == 1 state for 0202, and 2020 with flipped == 4*/
                    if (flipped === 4) {
                        righttop = 1 - interpolateX(minV, tr, br);
                        rightbottom = 1 - interpolateX(maxV, tr, br);
                        bottomright = interpolateX(maxV, bl, br);
                        bottomleft = interpolateX(minV, bl, br);
                        leftbottom = interpolateX(minV, bl, tl);
                        lefttop = interpolateX(maxV, bl, tl);
                        topleft = 1 - interpolateX(maxV, tr, tl);
                        topright = 1 - interpolateX(minV, tr, tl);
                    } else {
                        righttop = interpolateX(maxV, br, tr);
                        rightbottom = interpolateX(minV, br, tr);
                        bottomright = 1 - interpolateX(minV, br, bl);
                        bottomleft = 1 - interpolateX(maxV, br, bl);
                        leftbottom = 1 - interpolateX(maxV, tl, bl);
                        lefttop = 1 - interpolateX(minV, tl, bl);
                        topleft = interpolateX(minV, tl, tr);
                        topright = interpolateX(maxV, tl, tr);
                    }
                    edges.push(isoBandEdgeRT[cval]);
                    edges.push(isoBandEdgeRB[cval]);
                    edges.push(isoBandEdgeBL[cval]);
                    edges.push(isoBandEdgeLT[cval]);
                } else if (cval === 136) { /* 2020 || 0202 with flipped == 0 */
                    if (flipped === 0) {
                        righttop = interpolateX(maxV, br, tr);
                        rightbottom = interpolateX(minV, br, tr);
                        bottomright = 1 - interpolateX(minV, br, bl);
                        bottomleft = 1 - interpolateX(maxV, br, bl);
                        leftbottom = 1 - interpolateX(maxV, tl, bl);
                        lefttop = 1 - interpolateX(minV, tl, bl);
                        topleft = interpolateX(minV, tl, tr);
                        topright = interpolateX(maxV, tl, tr);
                    } else {
                        righttop = 1 - interpolateX(minV, tr, br);
                        rightbottom = 1 - interpolateX(maxV, tr, br);
                        bottomright = interpolateX(maxV, bl, br);
                        bottomleft = interpolateX(minV, bl, br);
                        leftbottom = interpolateX(minV, bl, tl);
                        lefttop = interpolateX(maxV, bl, tl);
                        topleft = 1 - interpolateX(maxV, tr, tl);
                        topright = 1 - interpolateX(minV, tr, tl);
                    }
                    edges.push(isoBandEdgeRT[cval]);
                    edges.push(isoBandEdgeRB[cval]);
                    edges.push(isoBandEdgeLB[cval]);
                    edges.push(isoBandEdgeLT[cval]);
                }

                /* 6-sided polygon cases */
                else if (cval === 153) { /* 0101 with flipped == 0 || 2121 with flipped == 2 */
                    if (flipped === 0) {
                        righttop = interpolateX(minV, br, tr);
                        bottomleft = 1 - interpolateX(minV, br, bl);
                        leftbottom = 1 - interpolateX(minV, tl, bl);
                        topright = interpolateX(minV, tl, tr);
                    } else {
                        righttop = 1 - interpolateX(maxV, tr, br);
                        bottomleft = interpolateX(maxV, bl, br);
                        leftbottom = interpolateX(maxV, bl, tl);
                        topright = 1 - interpolateX(maxV, tr, tl);
                    }
                    edges.push(isoBandEdgeRT[cval]);
                    edges.push(isoBandEdgeBL[cval]);
                } else if (cval === 102) { /* 1010 with flipped == 0 || 1212 with flipped == 2 */
                    if (flipped === 0) {
                        rightbottom = 1 - interpolateX(minV, tr, br);
                        bottomright = interpolateX(minV, bl, br);
                        lefttop = interpolateX(minV, bl, tl);
                        topleft = 1 - interpolateX(minV, tr, tl);
                    } else {
                        rightbottom = interpolateX(maxV, br, tr);
                        bottomright = 1 - interpolateX(maxV, br, bl);
                        lefttop = 1 - interpolateX(maxV, tl, bl);
                        topleft = interpolateX(maxV, tl, tr);
                    }
                    edges.push(isoBandEdgeRB[cval]);
                    edges.push(isoBandEdgeLT[cval]);
                } else if (cval === 155) { /* 0101 with flipped == 4 || 2121 with flipped == 1 */
                    if (flipped === 4) {
                        righttop = interpolateX(minV, br, tr);
                        bottomleft = 1 - interpolateX(minV, br, bl);
                        leftbottom = 1 - interpolateX(minV, tl, bl);
                        topright = interpolateX(minV, tl, tr);
                    } else {
                        righttop = 1 - interpolateX(maxV, tr, br);
                        bottomleft = interpolateX(maxV, bl, br);
                        leftbottom = interpolateX(maxV, bl, tl);
                        topright = 1 - interpolateX(maxV, tr, tl);
                    }
                    edges.push(isoBandEdgeRT[cval]);
                    edges.push(isoBandEdgeLB[cval]);
                } else if (cval === 103) { /* 1010 with flipped == 4 || 1212 with flipped == 1 */
                    if (flipped === 4) {
                        rightbottom = 1 - interpolateX(minV, tr, br);
                        bottomright = interpolateX(minV, bl, br);
                        lefttop = interpolateX(minV, bl, tl);
                        topleft = 1 - interpolateX(minV, tr, tl);
                    } else {
                        rightbottom = interpolateX(maxV, br, tr);
                        bottomright = 1 - interpolateX(maxV, br, bl);
                        lefttop = 1 - interpolateX(maxV, tl, bl);
                        topleft = interpolateX(maxV, tl, tr);
                    }
                    edges.push(isoBandEdgeRB[cval]);
                    edges.push(isoBandEdgeBR[cval]);
                }

                /* 7-sided polygon cases */
                else if (cval === 152) { /* 2120 with flipped == 2 || 0102 with flipped == 0 */
                    if (flipped === 0) {
                        righttop = interpolateX(minV, br, tr);
                        bottomright = 1 - interpolateX(minV, br, bl);
                        bottomleft = 1 - interpolateX(maxV, br, bl);
                        leftbottom = 1 - interpolateX(maxV, tl, bl);
                        lefttop = 1 - interpolateX(minV, tl, bl);
                        topright = interpolateX(minV, tl, tr);
                    } else {
                        righttop = 1 - interpolateX(maxV, tr, br);
                        bottomright = interpolateX(maxV, bl, br);
                        bottomleft = interpolateX(minV, bl, br);
                        leftbottom = interpolateX(minV, bl, tl);
                        lefttop = interpolateX(maxV, bl, tl);
                        topright = 1 - interpolateX(maxV, tr, tl);
                    }
                    edges.push(isoBandEdgeRT[cval]);
                    edges.push(isoBandEdgeBR[cval]);
                    edges.push(isoBandEdgeBL[cval]);
                } else if (cval === 156) { /* 2120 with flipped == 1 || 0102 with flipped == 4 */
                    if (flipped === 4) {
                        righttop = interpolateX(minV, br, tr);
                        bottomright = 1 - interpolateX(minV, br, bl);
                        bottomleft = 1 - interpolateX(maxV, br, bl);
                        leftbottom = 1 - interpolateX(maxV, tl, bl);
                        lefttop = 1 - interpolateX(minV, tl, bl);
                        topright = interpolateX(minV, tl, tr);
                    } else {
                        righttop = 1 - interpolateX(maxV, tr, br);
                        bottomright = interpolateX(maxV, bl, br);
                        bottomleft = interpolateX(minV, bl, br);
                        leftbottom = interpolateX(minV, bl, tl);
                        lefttop = interpolateX(maxV, bl, tl);
                        topright = 1 - interpolateX(maxV, tr, tl);
                    }
                    edges.push(isoBandEdgeRT[cval]);
                    edges.push(isoBandEdgeBL[cval]);
                    edges.push(isoBandEdgeLT[cval]);
                } else if (cval === 137) { /* 2021 with flipped == 2 || 0201 with flipped == 0 */
                    if (flipped === 0) {
                        righttop = interpolateX(maxV, br, tr);
                        rightbottom = interpolateX(minV, br, tr);
                        bottomleft = 1 - interpolateX(minV, br, bl);
                        leftbottom = 1 - interpolateX(minV, tl, bl);
                        topleft = interpolateX(minV, tl, tr);
                        topright = interpolateX(maxV, tl, tr);
                    } else {
                        righttop = 1 - interpolateX(minV, tr, br);
                        rightbottom = 1 - interpolateX(maxV, tr, br);
                        bottomleft = interpolateX(maxV, bl, br);
                        leftbottom = interpolateX(maxV, bl, tl);
                        topleft = 1 - interpolateX(maxV, tr, tl);
                        topright = 1 - interpolateX(minV, tr, tl);
                    }
                    edges.push(isoBandEdgeRT[cval]);
                    edges.push(isoBandEdgeRB[cval]);
                    edges.push(isoBandEdgeBL[cval]);
                } else if (cval === 139) { /* 2021 with flipped == 1 || 0201 with flipped == 4 */
                    if (flipped === 4) {
                        righttop = interpolateX(maxV, br, tr);
                        rightbottom = interpolateX(minV, br, tr);
                        bottomleft = 1 - interpolateX(minV, br, bl);
                        leftbottom = 1 - interpolateX(minV, tl, bl);
                        topleft = interpolateX(minV, tl, tr);
                        topright = interpolateX(maxV, tl, tr);
                    } else {
                        righttop = 1 - interpolateX(minV, tr, br);
                        rightbottom = 1 - interpolateX(maxV, tr, br);
                        bottomleft = interpolateX(maxV, bl, br);
                        leftbottom = interpolateX(maxV, bl, tl);
                        topleft = 1 - interpolateX(maxV, tr, tl);
                        topright = 1 - interpolateX(minV, tr, tl);
                    }
                    edges.push(isoBandEdgeRT[cval]);
                    edges.push(isoBandEdgeRB[cval]);
                    edges.push(isoBandEdgeLB[cval]);
                } else if (cval === 98) { /* 1202 with flipped == 2 || 1020 with flipped == 0 */
                    if (flipped === 0) {
                        righttop = 1 - interpolateX(minV, tr, br);
                        rightbottom = 1 - interpolateX(maxV, tr, br);
                        bottomright = interpolateX(maxV, bl, br);
                        bottomleft = interpolateX(minV, bl, br);
                        lefttop = interpolateX(minV, bl, tl);
                        topleft = 1 - interpolateX(minV, tr, tl);
                    } else {
                        righttop = interpolateX(maxV, br, tr);
                        rightbottom = interpolateX(minV, br, tr);
                        bottomright = 1 - interpolateX(minV, br, bl);
                        bottomleft = 1 - interpolateX(maxV, br, bl);
                        lefttop = 1 - interpolateX(maxV, tl, bl);
                        topleft = interpolateX(maxV, tl, tr);
                    }
                    edges.push(isoBandEdgeRT[cval]);
                    edges.push(isoBandEdgeRB[cval]);
                    edges.push(isoBandEdgeLT[cval]);
                } else if (cval === 99) { /* 1202 with flipped == 1 || 1020 with flipped == 4 */
                    if (flipped === 4) {
                        righttop = 1 - interpolateX(minV, tr, br);
                        rightbottom = 1 - interpolateX(maxV, tr, br);
                        bottomright = interpolateX(maxV, bl, br);
                        bottomleft = interpolateX(minV, bl, br);
                        lefttop = interpolateX(minV, bl, tl);
                        topleft = 1 - interpolateX(minV, tr, tl);
                    } else {
                        righttop = interpolateX(maxV, br, tr);
                        rightbottom = interpolateX(minV, br, tr);
                        bottomright = 1 - interpolateX(minV, br, bl);
                        bottomleft = 1 - interpolateX(maxV, br, bl);
                        lefttop = 1 - interpolateX(maxV, tl, bl);
                        topleft = interpolateX(maxV, tl, tr);
                    }
                    edges.push(isoBandEdgeRT[cval]);
                    edges.push(isoBandEdgeRB[cval]);
                    edges.push(isoBandEdgeBL[cval]);
                } else if (cval === 38) { /* 0212 with flipped == 2 || 2010 with flipped == 0 */
                    if (flipped === 0) {
                        rightbottom = 1 - interpolateX(minV, tr, br);
                        bottomright = interpolateX(minV, bl, br);
                        leftbottom = interpolateX(minV, bl, tl);
                        lefttop = interpolateX(maxV, bl, tl);
                        topleft = 1 - interpolateX(maxV, tr, tl);
                        topright = 1 - interpolateX(minV, tr, tl);
                    } else {
                        rightbottom = interpolateX(maxV, br, tr);
                        bottomright = 1 - interpolateX(maxV, br, bl);
                        leftbottom = 1 - interpolateX(maxV, tl, bl);
                        lefttop = 1 - interpolateX(minV, tl, bl);
                        topleft = interpolateX(minV, tl, tr);
                        topright = interpolateX(maxV, tl, tr);
                    }
                    edges.push(isoBandEdgeRB[cval]);
                    edges.push(isoBandEdgeLB[cval]);
                    edges.push(isoBandEdgeLT[cval]);
                } else if (cval === 39) { /* 0212 with flipped == 1 || 2010 with flipped == 4 */
                    if (flipped === 4) {
                        rightbottom = 1 - interpolateX(minV, tr, br);
                        bottomright = interpolateX(minV, bl, br);
                        leftbottom = interpolateX(minV, bl, tl);
                        lefttop = interpolateX(maxV, bl, tl);
                        topleft = 1 - interpolateX(maxV, tr, tl);
                        topright = 1 - interpolateX(minV, tr, tl);
                    } else {
                        rightbottom = interpolateX(maxV, br, tr);
                        bottomright = 1 - interpolateX(maxV, br, bl);
                        leftbottom = 1 - interpolateX(maxV, tl, bl);
                        lefttop = 1 - interpolateX(minV, tl, bl);
                        topleft = interpolateX(minV, tl, tr);
                        topright = interpolateX(maxV, tl, tr);
                    }
                    edges.push(isoBandEdgeRB[cval]);
                    edges.push(isoBandEdgeBR[cval]);
                    edges.push(isoBandEdgeLT[cval]);
                } else if (cval === 85) {
                    righttop = 1;
                    rightbottom = 0;
                    bottomright = 1;
                    bottomleft = 0;
                    leftbottom = 0;
                    lefttop = 1;
                    topleft = 0;
                    topright = 1;
                }

                if (topleft < 0 || topleft > 1 || topright < 0 || topright > 1 || righttop < 0 || righttop > 1 || bottomright < 0 || bottomright > 1 || leftbottom < 0 || leftbottom > 1 || lefttop < 0 || lefttop > 1) {
                    console.log('MarchingSquaresJS-isoBands: ' + cval + ' ' + cval_real + ' ' + tl + ',' + tr + ',' + br + ',' + bl + ' ' + flipped + ' ' + topleft + ' ' + topright + ' ' + righttop + ' ' + rightbottom + ' ' + bottomright + ' ' + bottomleft + ' ' + leftbottom + ' ' + lefttop);
                }

                BandGrid.cells[j][i] = {
                    cval: cval,
                    cval_real: cval_real,
                    flipped: flipped,
                    topleft: topleft,
                    topright: topright,
                    righttop: righttop,
                    rightbottom: rightbottom,
                    bottomright: bottomright,
                    bottomleft: bottomleft,
                    leftbottom: leftbottom,
                    lefttop: lefttop,
                    edges: edges
                };
            }
        }
    }

    return BandGrid;
}

function BandGrid2AreaPaths(grid) {
    var areas = [];
    var rows = grid.rows;
    var cols = grid.cols;
    var currentPolygon = [];

    for (var j = 0; j < rows; j++) {
        for (var i = 0; i < cols; i++) {
            if ((typeof grid.cells[j][i] !== 'undefined') && (grid.cells[j][i].edges.length > 0)) {
                /* trace back polygon path starting from this cell */

                var cell = grid.cells[j][i];

                /* get start coordinates */

                var prev  = getStartXY(cell),
                    next  = null,
                    p     = i,
                    q     = j;

                if (prev !== null) {
                    currentPolygon.push([prev.p[0] + p, prev.p[1] + q]);
                    //console.log(cell);
                    //console.log("coords: " + (prev.p[0] + p) + " " + (prev.p[1] + q));
                }

                do {
                    //console.log(p + "," + q);
                    //console.log(grid.cells[q][p]);
                    //console.log(grid.cells[q][p].edges);
                    //console.log("from : " + prev.x + " " + prev.y + " " + prev.o);

                    next = getExitXY(grid.cells[q][p], prev.x, prev.y, prev.o);
                    if (next !== null) {
                        //console.log("coords: " + (next.p[0] + p) + " " + (next.p[1] + q));
                        currentPolygon.push([next.p[0] + p, next.p[1] + q]);
                        p += next.x;
                        q += next.y;
                        prev = next;
                    } else {
                        //console.log("getExitXY() returned null!");
                        break;
                    }
                    //console.log("to : " + next.x + " " + next.y + " " + next.o);
                    /* special case, where we've reached the grid boundaries */
                    if ((q < 0) || (q >= rows) || (p < 0) || (p >= cols) || (typeof grid.cells[q][p] === 'undefined')) {
                        /* to create a closed path, we need to trace our way
                arround the missing data, until we find an entry
                point again
            */

                        /* set back coordinates of current cell */
                        p -= next.x;
                        q -= next.y;

                        //console.log("reached boundary at " + p + " " + q);

                        var missing = traceOutOfGridPath(grid, p, q, next.x, next.y, next.o);
                        if (missing !== null) {
                            missing.path.forEach(function (pp) {
                                //console.log("coords: " + (pp[0]) + " " + (pp[1]));
                                currentPolygon.push(pp);
                            });
                            p = missing.i;
                            q = missing.j;
                            prev = missing;
                        } else {
                            break;
                        }
                        //console.log(grid.cells[q][p]);
                    }
                } while ((typeof grid.cells[q][p] !== 'undefined') &&
                  (grid.cells[q][p].edges.length > 0));

                areas.push(currentPolygon);
                //console.log("next polygon");
                //console.log(currentPolygon);
                currentPolygon = [];
                if (grid.cells[j][i].edges.length > 0)
                    i--;
            }
        }
    }
    return areas;
}

function traceOutOfGridPath(grid, i, j, d_x, d_y, d_o) {
    var cell = grid.cells[j][i];
    var cval = cell.cval_real;
    var p = i + d_x,
        q = j + d_y;
    var path = [];
    var closed = false;

    while (!closed) {
    //console.log("processing cell " + p + "," + q + " " + d_x + " " + d_y + " " + d_o);
        if ((typeof grid.cells[q] === 'undefined') || (typeof grid.cells[q][p] === 'undefined')) {
            //console.log("which is undefined");
            /* we can't move on, so we have to change direction to proceed further */

            /* go back to previous cell */
            q -= d_y;
            p -= d_x;
            cell = grid.cells[q][p];
            cval = cell.cval_real;

            /* check where we've left defined cells of the grid... */
            if (d_y === -1) { /* we came from top */
                if (d_o === 0) {  /* exit left */
                    if (cval & Node3) { /* lower left node is within range, so we move left */
                        path.push([p, q]);
                        d_x = -1;
                        d_y = 0;
                        d_o = 0;
                    } else if (cval & Node2) { /* lower right node is within range, so we move right */
                        path.push([p + 1, q]);
                        d_x = 1;
                        d_y = 0;
                        d_o = 0;
                    } else { /* close the path */
                        path.push([p + cell.bottomright, q]);
                        d_x = 0;
                        d_y = 1;
                        d_o = 1;
                        closed = true;
                        break;
                    }
                } else if (cval & Node3) {
                    path.push([p, q]);
                    d_x = -1;
                    d_y = 0;
                    d_o = 0;
                } else if (cval & Node2) {
                    path.push([p + cell.bottomright, q]);
                    d_x = 0;
                    d_y = 1;
                    d_o = 1;
                    closed = true;
                    break;
                } else {
                    path.push([p + cell.bottomleft, q]);
                    d_x = 0;
                    d_y = 1;
                    d_o = 0;
                    closed = true;
                    break;
                }
            } else if (d_y === 1) { /* we came from bottom */
                //console.log("we came from bottom and hit a non-existing cell " + (p + d_x) + "," + (q + d_y) + "!");
                if (d_o === 0) { /* exit left */
                    if (cval & Node1) { /* top right node is within range, so we move right */
                        path.push([p + 1, q + 1]);
                        d_x = 1;
                        d_y = 0;
                        d_o = 1;
                    } else if (!(cval & Node0)) { /* found entry within same cell */
                        path.push([p + cell.topright, q + 1]);
                        d_x = 0;
                        d_y = -1;
                        d_o = 1;
                        closed = true;
                        //console.log("found entry from bottom at " + p + "," + q);
                        break;
                    } else {
                        path.push([p + cell.topleft, q + 1]);
                        d_x = 0;
                        d_y = -1;
                        d_o = 0;
                        closed = true;
                        break;
                    }
                } else if (cval & Node1) {
                    path.push([p + 1, q + 1]);
                    d_x = 1;
                    d_y = 0;
                    d_o = 1;
                } else { /* move right */
                    path.push([p + 1, q + 1]);
                    d_x = 1;
                    d_y = 0;
                    d_o = 1;
                    //console.log("wtf");
                    //break;
                }
            } else if (d_x === -1) { /* we came from right */
                //console.log("we came from right and hit a non-existing cell at " + (p + d_x) + "," + (q + d_y) + "!");
                if (d_o === 0) {
                    //console.log("continue at bottom");
                    if (cval & Node0) {
                        path.push([p, q + 1]);
                        d_x = 0;
                        d_y = 1;
                        d_o = 0;
                        //console.log("moving upwards to " + (p + d_x) + "," + (q + d_y) + "!");
                    } else if (!(cval & Node3)) { /* there has to be an entry into the regular grid again! */
                        //console.log("exiting top");
                        path.push([p, q + cell.lefttop]);
                        d_x = 1;
                        d_y = 0;
                        d_o = 1;
                        closed = true;
                        break;
                    } else {
                        //console.log("exiting bottom");
                        path.push([p, q + cell.leftbottom]);
                        d_x = 1;
                        d_y = 0;
                        d_o = 0;
                        closed = true;
                        break;
                    }
                } else {
                    //console.log("continue at top");
                    if (cval & Node0) {
                        path.push([p, q + 1]);
                        d_x = 0;
                        d_y = 1;
                        d_o = 0;
                        //console.log("moving upwards to " + (p + d_x) + "," + (q + d_y) + "!");
                    } else { /* */
                        console.log('MarchingSquaresJS-isoBands: wtf');
                        break;
                    }
                }
            } else if (d_x === 1) { /* we came from left */
                //console.log("we came from left and hit a non-existing cell " + (p + d_x) + "," + (q + d_y) + "!");
                if (d_o === 0) { /* exit bottom */
                    if (cval & Node2) {
                        path.push([p + 1, q]);
                        d_x = 0;
                        d_y = -1;
                        d_o = 1;
                    } else {
                        path.push([p + 1, q + cell.rightbottom]);
                        d_x = -1;
                        d_y = 0;
                        d_o = 0;
                        closed = true;
                        break;
                    }
                } else { /* exit top */
                    if (cval & Node2) {
                        path.push([p + 1, q]);
                        d_x = 0;
                        d_y = -1;
                        d_o = 1;
                    } else if (!(cval & Node1)) {
                        path.push([p + 1, q + cell.rightbottom]);
                        d_x = -1;
                        d_y = 0;
                        d_o = 0;
                        closed = true;
                        break;
                    } else {
                        path.push([p + 1, q + cell.righttop]);
                        d_x = -1;
                        d_y = 0;
                        d_o = 1;
                        break;
                    }
                }
            } else { /* we came from the same cell */
                console.log('MarchingSquaresJS-isoBands: we came from nowhere!');
                break;
            }

        } else { /* try to find an entry into the regular grid again! */
            cell = grid.cells[q][p];
            cval = cell.cval_real;
            //console.log("which is defined");

            if (d_x === -1) {
                if (d_o === 0) {
                    /* try to go downwards */
                    if ((typeof grid.cells[q - 1] !== 'undefined') && (typeof grid.cells[q - 1][p] !== 'undefined')) {
                        d_x = 0;
                        d_y = -1;
                        d_o = 1;
                    } else if (cval & Node3) { /* proceed searching in x-direction */
                        //console.log("proceeding in x-direction!");
                        path.push([p, q]);
                    } else { /* we must have found an entry into the regular grid */
                        path.push([p + cell.bottomright, q]);
                        d_x = 0;
                        d_y = 1;
                        d_o = 1;
                        closed = true;
                        //console.log("found entry from bottom at " + p + "," + q);
                        break;
                    }
                } else if (cval & Node0) { /* proceed searchin in x-direction */
                    console.log('MarchingSquaresJS-isoBands: proceeding in x-direction!');
                } else { /* we must have found an entry into the regular grid */
                    console.log('MarchingSquaresJS-isoBands: found entry from top at ' + p + ',' + q);
                    break;
                }
            } else if (d_x === 1) {
                if (d_o === 0) {
                    console.log('MarchingSquaresJS-isoBands: wtf');
                    break;
                } else {
                    /* try to go upwards */
                    if ((typeof grid.cells[q + 1] !== 'undefined') && (typeof grid.cells[q + 1][p] !== 'undefined')) {
                        d_x = 0;
                        d_y = 1;
                        d_o = 0;
                    } else if (cval & Node1) {
                        path.push([p + 1, q + 1]);
                        d_x = 1;
                        d_y = 0;
                        d_o = 1;
                    } else { /* found an entry point into regular grid! */
                        path.push([p + cell.topleft, q + 1]);
                        d_x = 0;
                        d_y = -1;
                        d_o = 0;
                        closed = true;
                        //console.log("found entry from bottom at " + p + "," + q);
                        break;
                    }
                }
            } else if (d_y === -1) {
                if (d_o === 1) {
                    /* try to go right */
                    if (typeof grid.cells[q][p + 1] !== 'undefined') {
                        d_x = 1;
                        d_y = 0;
                        d_o = 1;
                    } else if (cval & Node2) {
                        path.push([p + 1, q]);
                        d_x = 0;
                        d_y = -1;
                        d_o = 1;
                    } else { /* found entry into regular grid! */
                        path.push([p + 1, q + cell.righttop]);
                        d_x = -1;
                        d_y = 0;
                        d_o = 1;
                        closed = true;
                        //console.log("found entry from top at " + p + "," + q);
                        break;
                    }
                } else {
                    console.log('MarchingSquaresJS-isoBands: wtf');
                    break;
                }
            } else if (d_y === 1) {
                if (d_o === 0) {
                    //console.log("we came from bottom left and proceed to the left");
                    /* try to go left */
                    if (typeof grid.cells[q][p - 1] !== 'undefined') {
                        d_x = -1;
                        d_y = 0;
                        d_o = 0;
                    } else if (cval & Node0) {
                        path.push([p, q + 1]);
                        d_x = 0;
                        d_y = 1;
                        d_o = 0;
                    } else { /* found an entry point into regular grid! */
                        path.push([p, q + cell.leftbottom]);
                        d_x = 1;
                        d_y = 0;
                        d_o = 0;
                        closed = true;
                        //console.log("found entry from bottom at " + p + "," + q);
                        break;
                    }
                } else {
                    //console.log("we came from bottom right and proceed to the right");
                    console.log('MarchingSquaresJS-isoBands: wtf');
                    break;
                }
            } else {
                console.log('MarchingSquaresJS-isoBands: where did we came from???');
                break;
            }

        }

        p += d_x;
        q += d_y;
        //console.log("going on to  " + p + "," + q + " via " + d_x + " " + d_y + " " + d_o);

        if ((p === i) && (q === j)) { /* bail out, once we've closed a circle path */
            break;
        }

    }

    //console.log("exit with " + p + "," + q + " " + d_x + " " + d_y + " " + d_o);
    return { path: path, i: p, j: q, x: d_x, y: d_y, o: d_o };
}

function deleteEdge(cell, edgeIdx) {
    delete cell.edges[edgeIdx];
    for (var k = edgeIdx + 1; k < cell.edges.length; k++) {
        cell.edges[k - 1] = cell.edges[k];
    }
    cell.edges.pop();
}

function getStartXY(cell) {

    if (cell.edges.length > 0) {
        var e = cell.edges[cell.edges.length - 1];
        //console.log("starting with edge " + e);
        var cval = cell.cval_real;
        switch (e) {
        case 0:   if (cval & Node1) { /* node 1 within range */
            return {p: [1, cell.righttop], x: -1, y: 0, o: 1};
        } else { /* node 1 below or above threshold */
            return {p: [cell.topleft, 1], x: 0, y: -1, o: 0};
        }
        case 1:   if (cval & Node2) {
            return {p: [cell.topleft, 1], x: 0, y: -1, o: 0};
        } else {
            return {p: [1, cell.rightbottom], x: -1, y: 0, o: 0};
        }
        case 2:   if (cval & Node2) {
            return {p: [cell.bottomright, 0], x: 0, y: 1, o: 1};
        } else {
            return {p: [cell.topleft, 1], x: 0, y: -1, o: 0};
        }
        case 3:   if (cval & Node3) {
            return {p: [cell.topleft, 1], x: 0, y: -1, o: 0};
        } else {
            return {p: [cell.bottomleft, 0], x: 0, y: 1, o: 0};
        }
        case 4:   if (cval & Node1) {
            return {p: [1, cell.righttop], x: -1, y: 0, o: 1};
        } else {
            return {p: [cell.topright, 1], x: 0, y: -1, o: 1};
        }
        case 5:   if (cval & Node2) {
            return {p: [cell.topright, 1], x: 0, y: -1, o: 1};
        } else {
            return {p: [1, cell.rightbottom], x: -1, y: 0, o: 0};
        }
        case 6:   if (cval & Node2) {
            return {p: [cell.bottomright, 0], x: 0, y: 1, o: 1};
        } else {
            return {p: [cell.topright, 1], x: 0, y: -1, o: 1};
        }
        case 7:   if (cval & Node3) {
            return {p: [cell.topright, 1], x: 0, y: -1, o: 1};
        } else {
            return {p: [cell.bottomleft, 0], x: 0, y: 1, o: 0};
        }
        case 8:   if (cval & Node2) {
            return {p: [cell.bottomright, 0], x: 0, y: 1, o: 1};
        } else {
            return {p: [1, cell.righttop], x: -1, y: 0, o: 1};
        }
        case 9:   if (cval & Node3) {
            return {p: [1, cell.righttop], x: -1, y: 0, o: 1};
        } else {
            return {p: [cell.bottomleft, 0], x: 0, y: 1, o: 0};
        }
        case 10:  if (cval & Node3) {
            return {p: [0, cell.leftbottom], x: 1, y: 0, o: 0};
        } else {
            return {p: [1, cell.righttop], x: -1, y: 0, o: 1};
        }
        case 11:  if (cval & Node0) {
            return {p: [1, cell.righttop], x: -1, y: 0, o: 1};
        } else {
            return {p: [0, cell.lefttop], x: 1, y: 0, o: 1};
        }
        case 12:  if (cval & Node2) {
            return {p: [cell.bottomright, 0], x: 0, y: 1, o: 1};
        } else {
            return {p: [1, cell.rightbottom], x: -1, y: 0, o: 0};
        }
        case 13:  if (cval & Node3) {
            return {p: [1, cell.rightbottom], x: -1, y: 0, o: 0};
        } else {
            return {p: [cell.bottomleft, 0], x: 0, y: 1, o: 0};
        }
        case 14:  if (cval & Node3) {
            return {p: [0, cell.leftbottom], x: 1, y: 0, o: 0};
        } else {
            return {p: [1, cell.rightbottom], x: -1, y: 0, o: 0};
        }
        case 15:  if (cval & Node0) {
            return {p: [1, cell.rightbottom], x: -1, y: 0, o: 0};
        } else {
            return {p: [0, cell.lefttop], x: 1, y: 0, o: 1};
        }
        case 16:  if (cval & Node2) {
            return {p: [cell.bottomright, 0], x: 0, y: 1, o: 1};
        } else {
            return {p: [0, cell.leftbottom], x: 1, y: 0, o: 0};
        }
        case 17:  if (cval & Node0) {
            return {p: [cell.bottomright, 0], x: 0, y: 1, o: 1};
        } else {
            return {p: [0, cell.lefttop], x: 1, y: 0, o: 1};
        }
        case 18:  if (cval & Node3) {
            return {p: [0, cell.leftbottom], x: 1, y: 0, o: 0};
        } else {
            return {p: [cell.bottomleft, 0], x: 0, y: 1, o: 0};
        }
        case 19:  if (cval & Node0) {
            return {p: [cell.bottomleft, 0], x: 0, y: 1, o: 0};
        } else {
            return {p: [0, cell.lefttop], x: 1, y: 0, o: 1};
        }
        case 20:  if (cval & Node0) {
            return {p: [cell.topleft, 1], x: 0, y: -1, o: 0};
        } else {
            return {p: [0, cell.leftbottom], x: 1, y: 0, o: 0};
        }
        case 21:  if (cval & Node1) {
            return {p: [0, cell.leftbottom], x: 1, y: 0, o: 0};
        } else {
            return {p: [cell.topright, 1], x: 0, y: -1, o: 1};
        }
        case 22:  if (cval & Node0) {
            return {p: [cell.topleft, 1], x: 0, y: -1, o: 0};
        } else {
            return {p: [0, cell.lefttop], x: 1, y: 0, o: 1};
        }
        case 23:  if (cval & Node1) {
            return {p: [0, cell.lefttop], x: 1, y: 0, o: 1};
        } else {
            return {p: [cell.topright, 1], x: 0, y: -1, o: 1};
        }
        default:  console.log('MarchingSquaresJS-isoBands: edge index out of range!');
            console.log(cell);
            break;
        }
    }

    return null;
}

function getExitXY(cell, x, y, o) {

    var e, id_x, d_x, d_y, cval = cell.cval;
    var d_o;

    switch (x) {
    case -1:  switch (o) {
    case 0:   e = isoBandEdgeRB[cval];
        d_x = isoBandNextXRB[cval];
        d_y = isoBandNextYRB[cval];
        d_o = isoBandNextORB[cval];
        break;
    default:  e = isoBandEdgeRT[cval];
        d_x = isoBandNextXRT[cval];
        d_y = isoBandNextYRT[cval];
        d_o = isoBandNextORT[cval];
        break;
        }
        break;
    case 1:   switch (o) {
    case 0:   e = isoBandEdgeLB[cval];
        d_x = isoBandNextXLB[cval];
        d_y = isoBandNextYLB[cval];
        d_o = isoBandNextOLB[cval];
        break;
    default:  e = isoBandEdgeLT[cval];
        d_x = isoBandNextXLT[cval];
        d_y = isoBandNextYLT[cval];
        d_o = isoBandNextOLT[cval];
        break;
        }
        break;
    default:  switch (y) {
    case -1:  switch (o) {
    case 0:   e = isoBandEdgeTL[cval];
        d_x = isoBandNextXTL[cval];
        d_y = isoBandNextYTL[cval];
        d_o = isoBandNextOTL[cval];
        break;
    default:  e = isoBandEdgeTR[cval];
        d_x = isoBandNextXTR[cval];
        d_y = isoBandNextYTR[cval];
        d_o = isoBandNextOTR[cval];
        break;
        }
        break;
    case 1:   switch (o) {
    case 0:   e = isoBandEdgeBL[cval];
        d_x = isoBandNextXBL[cval];
        d_y = isoBandNextYBL[cval];
        d_o = isoBandNextOBL[cval];
        break;
    default:  e = isoBandEdgeBR[cval];
        d_x = isoBandNextXBR[cval];
        d_y = isoBandNextYBR[cval];
        d_o = isoBandNextOBR[cval];
        break;
        }
        break;
    default:  break;
        }
        break;
    }

    id_x = cell.edges.indexOf(e);
    if (typeof cell.edges[id_x] !== 'undefined') {
        deleteEdge(cell, id_x);
    } else {
    //console.log("wrong edges...");
    //console.log(x + " " + y + " " + o);
    //console.log(cell);
        return null;
    }

    cval = cell.cval_real;

    switch (e) {
    case 0:   if (cval & Node1) { /* node 1 within range */
        x = cell.topleft;
        y = 1;
    } else { /* node 1 below or above threshold */
        x = 1;
        y = cell.righttop;
    }
        break;
    case 1:   if (cval & Node2) {
        x = 1;
        y = cell.rightbottom;
    } else {
        x = cell.topleft;
        y = 1;
    }
        break;
    case 2:   if (cval & Node2) {
        x = cell.topleft;
        y = 1;
    } else {
        x = cell.bottomright;
        y = 0;
    }
        break;
    case 3:   if (cval & Node3) {
        x = cell.bottomleft;
        y = 0;
    } else {
        x = cell.topleft;
        y = 1;
    }
        break;
    case 4:   if (cval & Node1) {
        x = cell.topright;
        y = 1;
    } else {
        x = 1;
        y = cell.righttop;
    }
        break;
    case 5:   if (cval & Node2) {
        x = 1;
        y = cell.rightbottom;
    } else {
        x = cell.topright;
        y = 1;
    }
        break;
    case 6:   if (cval & Node2) {
        x = cell.topright;
        y = 1;
    } else {
        x = cell.bottomright;
        y = 0;
    }
        break;
    case 7:   if (cval & Node3) {
        x = cell.bottomleft;
        y = 0;
    } else {
        x = cell.topright;
        y = 1;
    }
        break;
    case 8:   if (cval & Node2) {
        x = 1;
        y = cell.righttop;
    } else {
        x = cell.bottomright;
        y = 0;
    }
        break;
    case 9:   if (cval & Node3) {
        x = cell.bottomleft;
        y = 0;
    } else {
        x = 1;
        y = cell.righttop;
    }
        break;
    case 10:  if (cval & Node3) {
        x = 1;
        y = cell.righttop;
    } else {
        x = 0;
        y = cell.leftbottom;
    }
        break;
    case 11:  if (cval & Node0) {
        x = 0;
        y = cell.lefttop;
    } else {
        x = 1;
        y = cell.righttop;
    }
        break;
    case 12:  if (cval & Node2) {
        x = 1;
        y = cell.rightbottom;
    } else {
        x = cell.bottomright;
        y = 0;
    }
        break;
    case 13:  if (cval & Node3) {
        x = cell.bottomleft;
        y = 0;
    } else {
        x = 1;
        y = cell.rightbottom;
    }
        break;
    case 14:  if (cval & Node3) {
        x = 1;
        y = cell.rightbottom;
    } else {
        x = 0;
        y = cell.leftbottom;
    }
        break;
    case 15:  if (cval & Node0) {
        x = 0;
        y = cell.lefttop;
    } else {
        x = 1;
        y = cell.rightbottom;
    }
        break;
    case 16:  if (cval & Node2) {
        x = 0;
        y = cell.leftbottom;
    } else {
        x = cell.bottomright;
        y = 0;
    }
        break;
    case 17:  if (cval & Node0) {
        x = 0;
        y = cell.lefttop;
    } else {
        x = cell.bottomright;
        y = 0;
    }
        break;
    case 18:  if (cval & Node3) {
        x = cell.bottomleft;
        y = 0;
    } else {
        x = 0;
        y = cell.leftbottom;
    }
        break;
    case 19:  if (cval & Node0) {
        x = 0;
        y = cell.lefttop;
    } else {
        x = cell.bottomleft;
        y = 0;
    }
        break;
    case 20:  if (cval & Node0) {
        x = 0;
        y = cell.leftbottom;
    } else {
        x = cell.topleft;
        y = 1;
    }
        break;
    case 21:  if (cval & Node1) {
        x = cell.topright;
        y = 1;
    } else {
        x = 0;
        y = cell.leftbottom;
    }
        break;
    case 22:  if (cval & Node0) {
        x = 0;
        y = cell.lefttop;
    } else {
        x = cell.topleft;
        y = 1;
    }
        break;
    case 23:  if (cval & Node1) {
        x = cell.topright;
        y = 1;
    } else {
        x = 0;
        y = cell.lefttop;
    }
        break;
    default:  console.log('MarchingSquaresJS-isoBands: edge index out of range!');
        console.log(cell);
        return null;
    }

    if ((typeof x === 'undefined') || (typeof y === 'undefined') ||
      (typeof d_x === 'undefined') || (typeof d_y === 'undefined') ||
      (typeof d_o === 'undefined')) {
        console.log('MarchingSquaresJS-isoBands: undefined value!');
        console.log(cell);
        console.log(x + ' ' + y + ' ' + d_x + ' ' + d_y + ' ' + d_o);
    }
    return {p: [x, y], x: d_x, y: d_y, o: d_o};
}

function BandGrid2Areas(grid) {
    var areas = [];
    var area_idx = 0;

    grid.cells.forEach(function (g, j) {
        g.forEach(function (gg, i) {
            if (typeof gg !== 'undefined') {
                var a = polygon_table[gg.cval](gg);
                if ((typeof a === 'object') && isArray(a)) {
                    if ((typeof a[0] === 'object') && isArray(a[0])) {
                        if ((typeof a[0][0] === 'object') && isArray(a[0][0])) {
                            a.forEach(function (aa) {
                                aa.forEach(function (aaa) {
                                    aaa[0] += i;
                                    aaa[1] += j;
                                });
                                areas[area_idx++] = aa;
                            });
                        } else {
                            a.forEach(function (aa) {
                                aa[0] += i;
                                aa[1] += j;
                            });
                            areas[area_idx++] = a;
                        }
                    } else {
                        console.log('MarchingSquaresJS-isoBands: bandcell polygon with malformed coordinates');
                    }
                } else {
                    console.log('MarchingSquaresJS-isoBands: bandcell polygon with null coordinates');
                }
            }
        });
    });

    return areas;
}
