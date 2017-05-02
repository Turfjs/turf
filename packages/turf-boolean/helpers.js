function checkIfDeepCoordArraysMatch(array1, array2) {
    if (!array1 instanceof Array && !array2 instanceof Array) {
        return false;
    }
    if (array1.length !== array2.length) {
        return false;
    }

    for (var i = 0, l = array1.length; i < l; i++) {
        if (array1[i] instanceof Array && array2[i] instanceof Array) {
            if (!checkIfDeepCoordArraysMatch(array1[i], array2[i])) {
                return false;
            }
        } else if (array1[i] !== array2[i]) {
            return false;
        }
    }
    return true;
}

function checkIfCoordArraysMatch(coordPair1, coordPair2) {
    return coordPair1[0] === coordPair2[0] && coordPair1[1] === coordPair2[1];
}

function isPointOnLineSegment(LineSegmentStart, LineSegmentEnd, Point) {
    var dxc = Point[0] - LineSegmentStart[0];
    var dyc = Point[1] - LineSegmentStart[1];
    var dxl = LineSegmentEnd[0] - LineSegmentStart[0];
    var dyl = LineSegmentEnd[1] - LineSegmentStart[1];
    var cross = dxc * dyl - dyc * dxl;
    if (cross !== 0) {
        return false;
    }
    if (Math.abs(dxl) >= Math.abs(dyl)) {
        return dxl > 0 ? LineSegmentStart[0] <= Point[0] && Point[0] <= LineSegmentEnd[0] : LineSegmentEnd[0] <= Point[0] && Point[0] <= LineSegmentStart[0];
    } else {
        return dyl > 0 ? LineSegmentStart[1] <= Point[1] && Point[1] <= LineSegmentEnd[1] : LineSegmentEnd[1] <= Point[1] && Point[1] <= LineSegmentStart[1];
    }
}

module.exports = {
    checkIfCoordArraysMatch: checkIfCoordArraysMatch,
    checkIfDeepCoordArraysMatch: checkIfDeepCoordArraysMatch,
    isPointOnLineSegment: isPointOnLineSegment
};
