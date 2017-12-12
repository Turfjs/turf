/**
 * @license GNU Affero General Public License.
 * Copyright (c) 2015, 2015 Ronny Lorenz <ronny@tbi.univie.ac.at>
 * v. 1.2.0
 * https://github.com/RaumZeit/MarchingSquares.js
 */

/**
 * Compute the isocontour(s) of a scalar 2D field given
 * a certain threshold by applying the Marching Squares
 * Algorithm. The function returns a list of path coordinates
 */
var defaultSettings = {
    successCallback: null,
    verbose: false
};

var settings = {};

export default function isoContours(data, threshold, options) {
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
        console.log('MarchingSquaresJS-isoContours: computing isocontour for ' + threshold);

    var ret = contourGrid2Paths(computeContourGrid(data, threshold));

    if (typeof settings.successCallback === 'function')
        settings.successCallback(ret);

    return ret;
}

/*
  Thats all for the public interface, below follows the actual
  implementation
*/

/*
################################
Isocontour implementation below
################################
*/

/* assume that x1 == 1 &&  x0 == 0 */
function interpolateX(y, y0, y1) {
    return (y - y0) / (y1 - y0);
}

/* compute the isocontour 4-bit grid */
function computeContourGrid(data, threshold) {
    var rows = data.length - 1;
    var cols = data[0].length - 1;
    var ContourGrid = { rows: rows, cols: cols, cells: [] };

    for (var j = 0; j < rows; ++j) {
        ContourGrid.cells[j] = [];
        for (var i = 0; i < cols; ++i) {
            /* compose the 4-bit corner representation */
            var cval = 0;

            var tl = data[j + 1][i];
            var tr = data[j + 1][i + 1];
            var br = data[j][i + 1];
            var bl = data[j][i];

            if (isNaN(tl) || isNaN(tr) || isNaN(br) || isNaN(bl)) {
                continue;
            }
            cval |= ((tl >= threshold) ? 8 : 0);
            cval |= ((tr >= threshold) ? 4 : 0);
            cval |= ((br >= threshold) ? 2 : 0);
            cval |= ((bl >= threshold) ? 1 : 0);

            /* resolve ambiguity for cval == 5 || 10 via averaging */
            var flipped = false;
            if (cval === 5 || cval === 10) {
                var average = (tl + tr + br + bl) / 4;
                if (cval === 5 && (average < threshold)) {
                    cval = 10;
                    flipped = true;
                } else if (cval === 10 && (average < threshold)) {
                    cval = 5;
                    flipped = true;
                }
            }

            /* add cell to ContourGrid if it contains edges */
            if (cval !== 0 && cval !== 15) {
                var top, bottom, left, right;
                top = bottom = left = right = 0.5;
                /* interpolate edges of cell */
                if (cval === 1) {
                    left    = 1 - interpolateX(threshold, tl, bl);
                    bottom  = 1 - interpolateX(threshold, br, bl);
                } else if (cval === 2) {
                    bottom  = interpolateX(threshold, bl, br);
                    right   = 1 - interpolateX(threshold, tr, br);
                } else if (cval === 3) {
                    left    = 1 - interpolateX(threshold, tl, bl);
                    right   = 1 - interpolateX(threshold, tr, br);
                } else if (cval === 4) {
                    top     = interpolateX(threshold, tl, tr);
                    right   = interpolateX(threshold, br, tr);
                } else if (cval === 5) {
                    top     = interpolateX(threshold, tl, tr);
                    right   = interpolateX(threshold, br, tr);
                    bottom  = 1 - interpolateX(threshold, br, bl);
                    left    = 1 - interpolateX(threshold, tl, bl);
                } else if (cval === 6) {
                    bottom  = interpolateX(threshold, bl, br);
                    top     = interpolateX(threshold, tl, tr);
                } else if (cval === 7) {
                    left    = 1 - interpolateX(threshold, tl, bl);
                    top     = interpolateX(threshold, tl, tr);
                } else if (cval === 8) {
                    left    = interpolateX(threshold, bl, tl);
                    top     = 1 - interpolateX(threshold, tr, tl);
                } else if (cval === 9) {
                    bottom  = 1 - interpolateX(threshold, br, bl);
                    top     = 1 - interpolateX(threshold, tr, tl);
                } else if (cval === 10) {
                    top     = 1 - interpolateX(threshold, tr, tl);
                    right   = 1 - interpolateX(threshold, tr, br);
                    bottom  = interpolateX(threshold, bl, br);
                    left    = interpolateX(threshold, bl, tl);
                } else if (cval === 11) {
                    top     = 1 - interpolateX(threshold, tr, tl);
                    right   = 1 - interpolateX(threshold, tr, br);
                } else if (cval === 12) {
                    left    = interpolateX(threshold, bl, tl);
                    right   = interpolateX(threshold, br, tr);
                } else if (cval === 13) {
                    bottom  = 1 - interpolateX(threshold, br, bl);
                    right   = interpolateX(threshold, br, tr);
                } else if (cval === 14) {
                    left    = interpolateX(threshold, bl, tl);
                    bottom  = interpolateX(threshold, bl, br);
                } else {
                    console.log('MarchingSquaresJS-isoContours: Illegal cval detected: ' + cval);
                }
                ContourGrid.cells[j][i] = {
                    cval: cval,
                    flipped: flipped,
                    top: top,
                    right: right,
                    bottom: bottom,
                    left: left
                };
            }

        }
    }

    return ContourGrid;
}

function isSaddle(cell) {
    return cell.cval === 5 || cell.cval === 10;
}

function isTrivial(cell) {
    return cell.cval === 0 || cell.cval === 15;
}

function clearCell(cell) {
    if ((!isTrivial(cell)) && (cell.cval !== 5) && (cell.cval !== 10)) {
        cell.cval = 15;
    }
}

function getXY(cell, edge) {
    if (edge === 'top') {
        return [cell.top, 1.0];
    } else if (edge === 'bottom') {
        return [cell.bottom, 0.0];
    } else if (edge === 'right') {
        return [1.0, cell.right];
    } else if (edge === 'left') {
        return [0.0, cell.left];
    }
}

function contourGrid2Paths(grid) {
    var paths = [];
    var path_idx = 0;
    var rows = grid.rows;
    var cols = grid.cols;
    var epsilon = 1e-7;

    grid.cells.forEach(function (g, j) {
        g.forEach(function (gg, i) {
            if ((typeof gg !== 'undefined') && (!isSaddle(gg)) && (!isTrivial(gg))) {
                var p = tracePath(grid.cells, j, i);
                var merged = false;
                /* we may try to merge paths at this point */
                if (p.info === 'mergeable') {
                    /*
            search backwards through the path array to find an entry
            that starts with where the current path ends...
          */
                    var x = p.path[p.path.length - 1][0],
                        y = p.path[p.path.length - 1][1];

                    for (var k = path_idx - 1; k >= 0; k--) {
                        if ((Math.abs(paths[k][0][0] - x) <= epsilon) && (Math.abs(paths[k][0][1] - y) <= epsilon)) {
                            for (var l = p.path.length - 2; l >= 0; --l) {
                                paths[k].unshift(p.path[l]);
                            }
                            merged = true;
                            break;
                        }
                    }
                }
                if (!merged)
                    paths[path_idx++] = p.path;
            }
        });
    });

    return paths;
}

/*
  construct consecutive line segments from starting cell by
  walking arround the enclosed area clock-wise
  */
function tracePath(grid, j, i) {
    var maxj = grid.length;
    var p = [];
    var dxContour = [0, 0, 1, 1, 0, 0, 0, 0, -1, 0, 1, 1, -1, 0, -1, 0];
    var dyContour = [0, -1, 0, 0, 1, 1, 1, 1, 0, -1, 0, 0, 0, -1, 0, 0];
    var dx, dy;
    var startEdge = ['none', 'left', 'bottom', 'left', 'right', 'none', 'bottom', 'left', 'top', 'top', 'none', 'top', 'right', 'right', 'bottom', 'none'];
    var nextEdge  = ['none', 'bottom', 'right', 'right', 'top', 'top', 'top', 'top', 'left', 'bottom', 'right', 'right', 'left', 'bottom', 'left', 'none'];
    var edge;

    var startCell   = grid[j][i];
    var currentCell = grid[j][i];

    var cval = currentCell.cval;
    var edge = startEdge[cval];

    var pt = getXY(currentCell, edge);

    /* push initial segment */
    p.push([i + pt[0], j + pt[1]]);
    edge = nextEdge[cval];
    pt = getXY(currentCell, edge);
    p.push([i + pt[0], j + pt[1]]);
    clearCell(currentCell);

    /* now walk arround the enclosed area in clockwise-direction */
    var k = i + dxContour[cval];
    var l = j + dyContour[cval];
    var prev_cval = cval;

    while ((k >= 0) && (l >= 0) && (l < maxj) && ((k != i) || (l != j))) {
        currentCell = grid[l][k];
        if (typeof currentCell === 'undefined') { /* path ends here */
            //console.log(k + " " + l + " is undefined, stopping path!");
            break;
        }
        cval = currentCell.cval;
        if ((cval === 0) || (cval === 15)) {
            return { path: p, info: 'mergeable' };
        }
        edge  = nextEdge[cval];
        dx    = dxContour[cval];
        dy    = dyContour[cval];
        if ((cval === 5) || (cval === 10)) {
            /* select upper or lower band, depending on previous cells cval */
            if (cval === 5) {
                if (currentCell.flipped) { /* this is actually a flipped case 10 */
                    if (dyContour[prev_cval] === -1) {
                        edge  = 'left';
                        dx    = -1;
                        dy    = 0;
                    } else {
                        edge  = 'right';
                        dx    = 1;
                        dy    = 0;
                    }
                } else { /* real case 5 */
                    if (dxContour[prev_cval] === -1) {
                        edge  = 'bottom';
                        dx    = 0;
                        dy    = -1;
                    }
                }
            } else if (cval === 10) {
                if (currentCell.flipped) { /* this is actually a flipped case 5 */
                    if (dxContour[prev_cval] === -1) {
                        edge  = 'top';
                        dx    = 0;
                        dy    = 1;
                    } else {
                        edge  = 'bottom';
                        dx    = 0;
                        dy    = -1;
                    }
                } else {  /* real case 10 */
                    if (dyContour[prev_cval] === 1) {
                        edge  = 'left';
                        dx    = -1;
                        dy    = 0;
                    }
                }
            }
        }
        pt = getXY(currentCell, edge);
        p.push([k + pt[0], l + pt[1]]);
        clearCell(currentCell);
        k += dx;
        l += dy;
        prev_cval = cval;
    }

    return { path: p, info: 'closed' };
}
