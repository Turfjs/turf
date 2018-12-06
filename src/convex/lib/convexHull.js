// Internalise convexhulljs
// https://github.com/indy256/convexhull-js
// MIT licensed

export function convexHull(points) {
    points.sort(function (a, b) {
        return a[1] !== b[1] ? a[1] - b[1] : a[0] - b[0];
    });

    const n = points.length;
    const hull = [];

    for (let i = 0; i < 2 * n; i++) {
        const j = i < n ? i : 2 * n - 1 - i;
        while (hull.length >= 2 && removeMiddle(hull[hull.length - 2], hull[hull.length - 1], points[j]))
            hull.pop();
        hull.push(points[j]);
    }

    hull.pop();
    return hull;
}

function removeMiddle(a, b, c) {
    const cross = (a[1] - b[1]) * (c[0] - b[0]) - (a[0] - b[0]) * (c[1] - b[1]);
    const dot = (a[1] - b[1]) * (c[1] - b[1]) + (a[0] - b[0]) * (c[0] - b[0]);
    return cross < 0 || cross === 0 && dot <= 0;
}
