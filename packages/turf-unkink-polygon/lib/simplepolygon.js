import isects from './geojson-polygon-self-intersections';
import area from '@turf/area';
import { featureCollection, polygon } from '@turf/helpers';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import rbush from 'rbush';

/**
 * Takes a complex (i.e. self-intersecting) geojson polygon, and breaks it down into its composite simple, non-self-intersecting one-ring polygons.
 *
 * @module simplepolygon
 * @param {Feature} feature Input polygon. This polygon may be unconform the {@link https://en.wikipedia.org/wiki/Simple_Features|Simple Features standard} in the sense that it's inner and outer rings may cross-intersect or self-intersect, that the outer ring must not contain the optional inner rings and that the winding number must not be positive for the outer and negative for the inner rings.
 * @return {FeatureCollection} Feature collection containing the simple, non-self-intersecting one-ring polygon features that the complex polygon is composed of. These simple polygons have properties such as their parent polygon, winding number and net winding number.
 *
 * @example
 * var poly = {
 *   "type": "Feature",
 *   "geometry": {
 *     "type": "Polygon",
 *     "coordinates": [[[0,0],[2,0],[0,2],[2,2],[0,0]]]
 *   }
 * };
 *
 * var result = simplepolygon(poly);
 *
 * // =result
 * // which will be a featureCollection of two polygons, one with coordinates [[[0,0],[2,0],[1,1],[0,0]]], parent -1, winding 1 and net winding 1, and one with coordinates [[[1,1],[0,2],[2,2],[1,1]]], parent -1, winding -1 and net winding -1
 */
export default function (feature) {
    // Check input
    if (feature.type != 'Feature') throw new Error('The input must a geojson object of type Feature');
    if ((feature.geometry === undefined) || (feature.geometry == null)) throw new Error('The input must a geojson object with a non-empty geometry');
    if (feature.geometry.type != 'Polygon') throw new Error('The input must be a geojson Polygon');

    // Process input
    var numRings = feature.geometry.coordinates.length;
    var vertices = [];
    for (var i = 0; i < numRings; i++) {
        var ring = feature.geometry.coordinates[i];
        if (!equalArrays(ring[0], ring[ring.length - 1])) {
            ring.push(ring[0]); // Close input ring if it is not
        }
        vertices.push.apply(vertices, ring.slice(0, ring.length - 1));
    }
    if (!isUnique(vertices)) throw new Error('The input polygon may not have duplicate vertices (except for the first and last vertex of each ring)');
    var numvertices = vertices.length; // number of input ring vertices, with the last closing vertices not counted

    // Compute self-intersections
    var selfIsectsData = isects(feature, function filterFn(isect, ring0, edge0, start0, end0, frac0, ring1, edge1, start1, end1, frac1, unique) {
        return [isect, ring0, edge0, start0, end0, frac0, ring1, edge1, start1, end1, frac1, unique];
    });
    var numSelfIsect = selfIsectsData.length;

    // If no self-intersections are found, the input rings are the output rings. Hence, we must only compute their winding numbers, net winding numbers and (since ohers rings could lie outside the first ring) parents.
    if (numSelfIsect == 0) {
        var outputFeatureArray = [];
        for (var i = 0; i < numRings; i++) {
            outputFeatureArray.push(polygon([feature.geometry.coordinates[i]], {parent: -1, winding: windingOfRing(feature.geometry.coordinates[i])}));
        }
        var output = featureCollection(outputFeatureArray);
        determineParents();
        setNetWinding();

        return output;
    }

    // If self-intersections are found, we will compute the output rings with the help of two intermediate variables
    // First, we build the pseudo vertex list and intersection list
    // The Pseudo vertex list is an array with for each ring an array with for each edge an array containing the pseudo-vertices (as made by their constructor) that have this ring and edge as ringAndEdgeIn, sorted for each edge by their fractional distance on this edge. It's length hence equals numRings.
    var pseudoVtxListByRingAndEdge = [];
    // The intersection list is an array containing intersections (as made by their constructor). First all numvertices ring-vertex-intersections, then all self-intersections (intra- and inter-ring). The order of the latter is not important but is permanent once given.
    var isectList = [];
    // Adding ring-pseudo-vertices to pseudoVtxListByRingAndEdge and ring-vertex-intersections to isectList
    for (var i = 0; i < numRings; i++) {
        pseudoVtxListByRingAndEdge.push([]);
        for (var j = 0; j < feature.geometry.coordinates[i].length - 1; j++) {
            // Each edge will feature one ring-pseudo-vertex in its array, on the last position. i.e. edge j features the ring-pseudo-vertex of the ring vertex j+1, which has ringAndEdgeIn = [i,j], on the last position.
            pseudoVtxListByRingAndEdge[i].push([new PseudoVtx(feature.geometry.coordinates[i][(j + 1).modulo(feature.geometry.coordinates[i].length - 1)], 1, [i, j], [i, (j + 1).modulo(feature.geometry.coordinates[i].length - 1)], undefined)]);
            // The first numvertices elements in isectList correspond to the ring-vertex-intersections
            isectList.push(new Isect(feature.geometry.coordinates[i][j], [i, (j - 1).modulo(feature.geometry.coordinates[i].length - 1)], [i, j], undefined, undefined, false, true));
        }
    }
    // Adding intersection-pseudo-vertices to pseudoVtxListByRingAndEdge and self-intersections to isectList
    for (var i = 0; i < numSelfIsect; i++) {
    // Adding intersection-pseudo-vertices made using selfIsectsData to pseudoVtxListByRingAndEdge's array corresponding to the incomming ring and edge
        pseudoVtxListByRingAndEdge[selfIsectsData[i][1]][selfIsectsData[i][2]].push(new PseudoVtx(selfIsectsData[i][0], selfIsectsData[i][5], [selfIsectsData[i][1], selfIsectsData[i][2]], [selfIsectsData[i][6], selfIsectsData[i][7]], undefined));
        // selfIsectsData contains double mentions of each intersection, but we only want to add them once to isectList
        if (selfIsectsData[i][11]) isectList.push(new Isect(selfIsectsData[i][0], [selfIsectsData[i][1], selfIsectsData[i][2]], [selfIsectsData[i][6], selfIsectsData[i][7]], undefined, undefined, true, true));
    }
    var numIsect = isectList.length;
    // Sort edge arrays of pseudoVtxListByRingAndEdge by the fractional distance 'param'
    for (var i = 0; i < pseudoVtxListByRingAndEdge.length; i++) {
        for (var j = 0; j < pseudoVtxListByRingAndEdge[i].length; j++) {
            pseudoVtxListByRingAndEdge[i][j].sort(function (a, b) { return (a.param < b.param) ? -1 : 1; });
        }
    }

    // Make a spatial index of intersections, in preperation for the following two steps
    var allIsectsAsIsectRbushTreeItem = [];
    for (var i = 0; i < numIsect; i++) {
        allIsectsAsIsectRbushTreeItem.push({minX: isectList[i].coord[0], minY: isectList[i].coord[1], maxX: isectList[i].coord[0], maxY: isectList[i].coord[1], index: i}); // could pass isect: isectList[i], but not necessary
    }
    var isectRbushTree = rbush();
    isectRbushTree.load(allIsectsAsIsectRbushTreeItem);

    // Now we will teach each intersection in isectList which is the next intersection along both it's [ring, edge]'s, in two steps.
    // First, we find the next intersection for each pseudo-vertex in pseudoVtxListByRingAndEdge:
    // For each pseudovertex in pseudoVtxListByRingAndEdge (3 loops) look at the next pseudovertex on that edge and find the corresponding intersection by comparing coordinates
    for (var i = 0; i < pseudoVtxListByRingAndEdge.length; i++) {
        for (var j = 0; j < pseudoVtxListByRingAndEdge[i].length; j++) {
            for (var k = 0; k < pseudoVtxListByRingAndEdge[i][j].length; k++) {
                var coordToFind;
                if (k == pseudoVtxListByRingAndEdge[i][j].length - 1) { // If it's the last pseudoVertex on that edge, then the next pseudoVertex is the first one on the next edge of that ring.
                    coordToFind = pseudoVtxListByRingAndEdge[i][(j + 1).modulo(feature.geometry.coordinates[i].length - 1)][0].coord;
                } else {
                    coordToFind = pseudoVtxListByRingAndEdge[i][j][k + 1].coord;
                }
                var IsectRbushTreeItemFound = isectRbushTree.search({minX: coordToFind[0], minY: coordToFind[1], maxX: coordToFind[0], maxY: coordToFind[1]})[0]; // We can take [0] of the result, because there is only one isect correponding to a pseudo-vertex
                pseudoVtxListByRingAndEdge[i][j][k].nxtIsectAlongEdgeIn = IsectRbushTreeItemFound.index;
            }
        }
    }

    // Second, we port this knowledge of the next intersection over to the intersections in isectList, by finding the intersection corresponding to each pseudo-vertex and copying the pseudo-vertex' knownledge of the next-intersection over to the intersection
    for (var i = 0; i < pseudoVtxListByRingAndEdge.length; i++) {
        for (var j = 0; j < pseudoVtxListByRingAndEdge[i].length; j++) {
            for (var k = 0; k < pseudoVtxListByRingAndEdge[i][j].length; k++) {
                var coordToFind = pseudoVtxListByRingAndEdge[i][j][k].coord;
                var IsectRbushTreeItemFound = isectRbushTree.search({minX: coordToFind[0], minY: coordToFind[1], maxX: coordToFind[0], maxY: coordToFind[1]})[0]; // We can take [0] of the result, because there is only one isect correponding to a pseudo-vertex
                var l = IsectRbushTreeItemFound.index;
                if (l < numvertices) { // Special treatment at ring-vertices: we correct the misnaming that happened in the previous block, since ringAndEdgeOut = ringAndEdge2 for ring vertices.
                    isectList[l].nxtIsectAlongRingAndEdge2 = pseudoVtxListByRingAndEdge[i][j][k].nxtIsectAlongEdgeIn;
                } else { // Port the knowledge of the next intersection from the pseudo-vertices to the intersections, depending on how the edges are labeled in the pseudo-vertex and intersection.
                    if (equalArrays(isectList[l].ringAndEdge1, pseudoVtxListByRingAndEdge[i][j][k].ringAndEdgeIn)) {
                        isectList[l].nxtIsectAlongRingAndEdge1 = pseudoVtxListByRingAndEdge[i][j][k].nxtIsectAlongEdgeIn;
                    } else {
                        isectList[l].nxtIsectAlongRingAndEdge2 = pseudoVtxListByRingAndEdge[i][j][k].nxtIsectAlongEdgeIn;
                    }
                }
            }
        }
    }
    // This explains why, eventhough when we will walk away from an intersection, we will walk way from the corresponding pseudo-vertex along edgeOut, pseudo-vertices have the property 'nxtIsectAlongEdgeIn' in stead of some propery 'nxtPseudoVtxAlongEdgeOut'. This is because this property (which is easy to find out) is used in the above for nxtIsectAlongRingAndEdge1 and nxtIsectAlongRingAndEdge2!

    // Before we start walking over the intersections to build the output rings, we prepare a queue that stores information on intersections we still have to deal with, and put at least one intersection in it.
    // This queue will contain information on intersections where we can start walking from once the current walk is finished, and its parent output ring (the smallest output ring it lies within, -1 if no parent or parent unknown yet) and its winding number (which we can already determine).
    var queue = [];
    // For each output ring, add the ring-vertex-intersection with the smalles x-value (i.e. the left-most) as a start intersection. By choosing such an extremal intersections, we are sure to start at an intersection that is a convex vertex of its output ring. By adding them all to the queue, we are sure that no rings will be forgotten. If due to ring-intersections such an intersection will be encountered while walking, it will be removed from the queue.
    var i = 0;
    for (var j = 0; j < numRings; j++) {
        var leftIsect = i;
        for (var k = 0; k < feature.geometry.coordinates[j].length - 1; k++) {
            if (isectList[i].coord[0] < isectList[leftIsect].coord[0]) {
                leftIsect = i;
            }
            i++;
        }
        // Compute winding at this left-most ring-vertex-intersection. We thus this by using our knowledge that this extremal vertex must be a convex vertex.
        // We first find the intersection before and after it, and then use them to determine the winding number of the corresponding output ring, since we know that an extremal vertex of a simple, non-self-intersecting ring is always convex, so the only reason it would not be is because the winding number we use to compute it is wrong
        var isectAfterLeftIsect = isectList[leftIsect].nxtIsectAlongRingAndEdge2;
        for (var k = 0; k < isectList.length; k++) {
            if ((isectList[k].nxtIsectAlongRingAndEdge1 == leftIsect) || (isectList[k].nxtIsectAlongRingAndEdge2 == leftIsect)) {
                var isectBeforeLeftIsect = k;
                break;
            }
        }
        var windingAtIsect = isConvex([isectList[isectBeforeLeftIsect].coord, isectList[leftIsect].coord, isectList[isectAfterLeftIsect].coord], true) ? 1 : -1;

        queue.push({isect: leftIsect, parent: -1, winding: windingAtIsect});
    }
    // Sort the queue by the same criterion used to find the leftIsect: the left-most leftIsect must be last in the queue, such that it will be popped first, such that we will work from out to in regarding input rings. This assumtion is used when predicting the winding number and parent of a new queue member.
    queue.sort(function (a, b) { return (isectList[a.isect].coord > isectList[b.isect].coord) ? -1 : 1; });

    // Initialise output
    var outputFeatureArray = [];

    // While the queue is not empty, take the last object (i.e. its intersection) out and start making an output ring by walking in the direction that has not been walked away over yet.
    while (queue.length > 0) {
    // Get the last object out of the queue
        var popped = queue.pop();
        var startIsect = popped.isect;
        var currentOutputRingParent = popped.parent;
        var currentOutputRingWinding = popped.winding;
        // Make new output ring and add vertex from starting intersection
        var currentOutputRing = outputFeatureArray.length;
        var currentOutputRingCoords = [isectList[startIsect].coord];
        // Set up the variables used while walking over intersections: 'currentIsect', 'nxtIsect' and 'walkingRingAndEdge'
        var currentIsect = startIsect;
        if (isectList[startIsect].ringAndEdge1Walkable) {
            var walkingRingAndEdge = isectList[startIsect].ringAndEdge1;
            var nxtIsect = isectList[startIsect].nxtIsectAlongRingAndEdge1;
        } else {
            var walkingRingAndEdge = isectList[startIsect].ringAndEdge2;
            var nxtIsect = isectList[startIsect].nxtIsectAlongRingAndEdge2;
        }
        // While we have not arrived back at the same intersection, keep walking
        while (!equalArrays(isectList[startIsect].coord, isectList[nxtIsect].coord)) {
            currentOutputRingCoords.push(isectList[nxtIsect].coord);
            // If the next intersection is queued, we can remove it, because we will go there now.
            var nxtIsectInQueue = undefined;
            for (var i = 0; i < queue.length; i++) { if (queue[i].isect == nxtIsect) { nxtIsectInQueue = i; break; } }
            if (nxtIsectInQueue != undefined) {
                queue.splice(nxtIsectInQueue, 1);
            }
            // Arriving at this new intersection, we know which will be our next walking ring and edge (if we came from 1 we will walk away from 2 and vice versa),
            // So we can set it as our new walking ring and intersection and remember that we (will) have walked over it
            // If we have never walked away from this new intersection along the other ring and edge then we will soon do, add the intersection (and the parent wand winding number) to the queue
            // (We can predict the winding number and parent as follows: if the edge is convex, the other output ring started from there will have the alternate winding and lie outside of the current one, and thus have the same parent ring as the current ring. Otherwise, it will have the same winding number and lie inside of the current ring. We are, however, only sure of this of an output ring started from there does not enclose the current ring. This is why the initial queue's intersections must be sorted such that outer ones come out first.)
            // We then update the other two walking variables.
            if (equalArrays(walkingRingAndEdge, isectList[nxtIsect].ringAndEdge1)) {
                walkingRingAndEdge = isectList[nxtIsect].ringAndEdge2;
                isectList[nxtIsect].ringAndEdge2Walkable = false;
                if (isectList[nxtIsect].ringAndEdge1Walkable) {
                    var pushing = {isect: nxtIsect};
                    if (isConvex([isectList[currentIsect].coord, isectList[nxtIsect].coord, isectList[isectList[nxtIsect].nxtIsectAlongRingAndEdge2].coord], currentOutputRingWinding == 1)) {
                        pushing.parent = currentOutputRingParent;
                        pushing.winding = -currentOutputRingWinding;
                    } else {
                        pushing.parent = currentOutputRing;
                        pushing.winding = currentOutputRingWinding;
                    }
                    queue.push(pushing);
                }
                currentIsect = nxtIsect;
                nxtIsect = isectList[nxtIsect].nxtIsectAlongRingAndEdge2;
            } else {
                walkingRingAndEdge = isectList[nxtIsect].ringAndEdge1;
                isectList[nxtIsect].ringAndEdge1Walkable = false;
                if (isectList[nxtIsect].ringAndEdge2Walkable) {
                    var pushing = {isect: nxtIsect};
                    if (isConvex([isectList[currentIsect].coord, isectList[nxtIsect].coord, isectList[isectList[nxtIsect].nxtIsectAlongRingAndEdge1].coord], currentOutputRingWinding == 1)) {
                        pushing.parent = currentOutputRingParent;
                        pushing.winding = -currentOutputRingWinding;
                    } else {
                        pushing.parent = currentOutputRing;
                        pushing.winding = currentOutputRingWinding;
                    }
                    queue.push(pushing);
                }
                currentIsect = nxtIsect;
                nxtIsect = isectList[nxtIsect].nxtIsectAlongRingAndEdge1;
            }
        }
        // Close output ring
        currentOutputRingCoords.push(isectList[nxtIsect].coord);
        // Push output ring to output
        outputFeatureArray.push(polygon([currentOutputRingCoords], {index: currentOutputRing, parent: currentOutputRingParent, winding: currentOutputRingWinding, netWinding: undefined}));
    }

    var output = featureCollection(outputFeatureArray);

    determineParents();

    setNetWinding();

    // These functions are also used if no intersections are found
    function determineParents() {
        var featuresWithoutParent = [];
        for (var i = 0; i < output.features.length; i++) {
            if (output.features[i].properties.parent == -1) featuresWithoutParent.push(i);
        }
        if (featuresWithoutParent.length > 1) {
            for (var i = 0; i < featuresWithoutParent.length; i++) {
                var parent = -1;
                var parentArea = Infinity;
                for (var j = 0; j < output.features.length; j++) {
                    if (featuresWithoutParent[i] == j) continue;
                    if (booleanPointInPolygon(output.features[featuresWithoutParent[i]].geometry.coordinates[0][0], output.features[j], {ignoreBoundary: true})) {
                        if (area(output.features[j]) < parentArea) {
                            parent = j;
                        }
                    }
                }
                output.features[featuresWithoutParent[i]].properties.parent = parent;
            }
        }
    }

    function setNetWinding() {
        for (var i = 0; i < output.features.length; i++) {
            if (output.features[i].properties.parent == -1) {
                var netWinding = output.features[i].properties.winding;
                output.features[i].properties.netWinding = netWinding;
                setNetWindingOfChildren(i, netWinding);
            }
        }
    }

    function setNetWindingOfChildren(parent, ParentNetWinding) {
        for (var i = 0; i < output.features.length; i++) {
            if (output.features[i].properties.parent == parent) {
                var netWinding = ParentNetWinding + output.features[i].properties.winding;
                output.features[i].properties.netWinding = netWinding;
                setNetWindingOfChildren(i, netWinding);
            }
        }
    }


    return output;
};



// Constructor for (ring- or intersection-) pseudo-vertices.
var PseudoVtx = function (coord, param, ringAndEdgeIn, ringAndEdgeOut, nxtIsectAlongEdgeIn) {
    this.coord = coord; // [x,y] of this pseudo-vertex
    this.param = param; // fractional distance of this intersection on incomming edge
    this.ringAndEdgeIn = ringAndEdgeIn; // [ring index, edge index] of incomming edge
    this.ringAndEdgeOut = ringAndEdgeOut; // [ring index, edge index] of outgoing edge
    this.nxtIsectAlongEdgeIn = nxtIsectAlongEdgeIn; // The next intersection when following the incomming edge (so not when following ringAndEdgeOut!)
};

// Constructor for an intersection. There are two intersection-pseudo-vertices per self-intersection and one ring-pseudo-vertex per ring-vertex-intersection. Their labels 1 and 2 are not assigned a particular meaning but are permanent once given.
var Isect = function (coord, ringAndEdge1, ringAndEdge2, nxtIsectAlongRingAndEdge1, nxtIsectAlongRingAndEdge2, ringAndEdge1Walkable, ringAndEdge2Walkable) {
    this.coord = coord; // [x,y] of this intersection
    this.ringAndEdge1 = ringAndEdge1; // first edge of this intersection
    this.ringAndEdge2 = ringAndEdge2; // second edge of this intersection
    this.nxtIsectAlongRingAndEdge1 = nxtIsectAlongRingAndEdge1; // the next intersection when following ringAndEdge1
    this.nxtIsectAlongRingAndEdge2 = nxtIsectAlongRingAndEdge2; // the next intersection when following ringAndEdge2
    this.ringAndEdge1Walkable = ringAndEdge1Walkable; // May we (still) walk away from this intersection over ringAndEdge1?
    this.ringAndEdge2Walkable = ringAndEdge2Walkable; // May we (still) walk away from this intersection over ringAndEdge2?
};

// Function to determine if three consecutive points of a simple, non-self-intersecting ring make up a convex vertex, assuming the ring is right- or lefthanded
function isConvex(pts, righthanded) {
    // 'pts' is an [x,y] pair
    // 'righthanded' is a boolean
    if (typeof (righthanded) === 'undefined') righthanded = true;
    if (pts.length != 3) throw new Error('This function requires an array of three points [x,y]');
    var d = (pts[1][0] - pts[0][0]) * (pts[2][1] - pts[0][1]) - (pts[1][1] - pts[0][1]) * (pts[2][0] - pts[0][0]);
    return (d >= 0) == righthanded;
}

// Function to compute winding of simple, non-self-intersecting ring
function windingOfRing(ring) {
    // 'ring' is an array of [x,y] pairs with the last equal to the first
    // Compute the winding number based on the vertex with the smallest x-value, it precessor and successor. An extremal vertex of a simple, non-self-intersecting ring is always convex, so the only reason it is not is because the winding number we use to compute it is wrong
    var leftVtx = 0;
    for (var i = 0; i < ring.length - 1; i++) { if (ring[i][0] < ring[leftVtx][0]) leftVtx = i; }
    if (isConvex([ring[(leftVtx - 1).modulo(ring.length - 1)], ring[leftVtx], ring[(leftVtx + 1).modulo(ring.length - 1)]], true)) {
        var winding = 1;
    } else {
        var winding = -1;
    }
    return winding;
}

// Function to compare Arrays of numbers. From http://stackoverflow.com/questions/7837456/how-to-compare-arrays-in-javascript
function equalArrays(array1, array2) {
    // if the other array is a falsy value, return
    if (!array1 || !array2)
        return false;

    // compare lengths - can save a lot of time
    if (array1.length != array2.length)
        return false;

    for (var i = 0, l = array1.length; i < l; i++) {
        // Check if we have nested arrays
        if (array1[i] instanceof Array && array2[i] instanceof Array) {
            // recurse into the nested arrays
            if (!equalArrays(array1[i], array2[i]))
                return false;
        } else if (array1[i] != array2[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}

// Fix Javascript modulo for negative number. From http://stackoverflow.com/questions/4467539/javascript-modulo-not-behaving
Number.prototype.modulo = function (n) {
    return ((this % n) + n) % n;
};

// Function to get array with only unique elements. From http://stackoverflow.com/questions/1960473/unique-values-in-an-array
function getUnique(array) {
    var u = {}, a = [];
    for (var i = 0, l = array.length; i < l; ++i) {
        if (u.hasOwnProperty(array[i])) {
            continue;
        }
        a.push(array[i]);
        u[array[i]] = 1;
    }
    return a;
}

// Function to check if array is unique (i.e. all unique elements, i.e. no duplicate elements)
function isUnique(array) {
    var u = {}, a = [];
    var isUnique = 1;
    for (var i = 0, l = array.length; i < l; ++i) {
        if (u.hasOwnProperty(array[i])) {
            isUnique = 0;
            break;
        }
        u[array[i]] = 1;
    }
    return isUnique;
}
