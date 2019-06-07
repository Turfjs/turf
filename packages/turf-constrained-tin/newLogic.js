const helper = require('@turf/helpers');

module.exports = function(points, edges) {
    var ret = {
        vert: points.features.map(function(point) {
            const xy = point.geometry.coordinates;
            return new Point(xy[0], xy[1]);
        }),
        con_edge: edges
    };
    delaunay(ret);
    return helper.featureCollection(ret.tri.map(function(indices) {
        const coords = indices.map(function(index) {
            return [ret.vert[index].x, ret.vert[index].y];
        })
        coords[3] = coords[0];
        return helper.polygon([coords]);
    }));
};

class Point
{
    constructor(x,y)
    {
        this.x = x;
        this.y = y;
    }

    dot(p1)
    {
        return (this.x*p1.x + this.y*p1.y);
    }

    add(p1)
    {
        return new Point(this.x + p1.x, this.y + p1.y);
    }

    sub(p1)
    {
        return new Point(this.x - p1.x, this.y - p1.y);
    }

    scale(s)
    {
        return new Point(this.x*s, this.y*s);
    }

    sqDistanceTo(p1)
    {
        return (this.x - p1.x)*(this.x - p1.x) + (this.y - p1.y)*(this.y - p1.y);
    }

    toStr()
    {
        return "(" + this.x.toFixed(3) + ", " + this.y.toFixed(3) + ")";
    }

    copyFrom(p)
    {
        this.x = p.x;
        this.y = p.y;
    }
}

function cross(vec0, vec1)
{
    return (vec0.x*vec1.y - vec0.y*vec1.x);
}

function barycentericCoordTriangle(p, pt0, pt1, pt2)
{
    var vec0 = pt1.sub(pt0);
    var vec1 = pt2.sub(pt0);
    var vec2 = p.sub(pt0);

    var d00 = vec0.dot(vec0);
    var d01 = vec0.dot(vec1);
    var d11 = vec1.dot(vec1);
    var d20 = vec2.dot(vec0);
    var d21 = vec2.dot(vec1);
    var denom = d00*d11 - d01*d01;
    var s = (d11 * d20 - d01 * d21) / denom;
    var t = (d00 * d21 - d01 * d20) / denom;
    var u = 1.0 - s - t;

    return {s:s, t:t, u:u};
}

function isEdgeIntersecting(edgeA, edgeB)
{
    var vecA0A1 = edgeA[1].sub(edgeA[0]);
    var vecA0B0 = edgeB[0].sub(edgeA[0]);
    var vecA0B1 = edgeB[1].sub(edgeA[0]);

    var AxB0 = cross(vecA0A1, vecA0B0);
    var AxB1 = cross(vecA0A1, vecA0B1);

    //Check if the endpoints of edgeB are on the same side of edgeA
    if ((AxB0 > 0 && AxB1 > 0) || (AxB0 < 0 && AxB1 < 0))
        return false;

    var vecB0B1 = edgeB[1].sub(edgeB[0]);
    var vecB0A0 = edgeA[0].sub(edgeB[0]);
    var vecB0A1 = edgeA[1].sub(edgeB[0]);

    var BxA0 = cross(vecB0B1, vecB0A0);
    var BxA1 = cross(vecB0B1, vecB0A1);

    //Check if the endpoints of edgeA are on the same side of edgeB
    if ((BxA0 > 0 && BxA1 > 0) || (BxA0 < 0 && BxA1 < 0))
        return false;

    //Special case of colinear edges
    if (Math.abs(AxB0) < 1e-14 && Math.abs(AxB1) < 1e-14)
    {
        //Separated in x
        if ( (Math.max(edgeB[0].x, edgeB[1].x) < Math.min(edgeA[0].x, edgeA[1].x)) ||
            (Math.min(edgeB[0].x, edgeB[1].x) > Math.max(edgeA[0].x, edgeA[1].x)) )
            return false;

        //Separated in y
        if ( (Math.max(edgeB[0].y, edgeB[1].y) < Math.min(edgeA[0].y, edgeA[1].y)) ||
            (Math.min(edgeB[0].y, edgeB[1].y) > Math.max(edgeA[0].y, edgeA[1].y)) )
            return false;
    }

    return true;
}

function isEdgeIntersectingAtEndpoint(edgeA, edgeB)
{
    const rsq_tol = 1e-13;
    if (edgeA[0].sqDistanceTo(edgeB[0]) < rsq_tol)
        return true;

    if (edgeA[0].sqDistanceTo(edgeB[1]) < rsq_tol)
        return true;

    if (edgeA[1].sqDistanceTo(edgeB[0]) < rsq_tol)
        return true;

    if (edgeA[1].sqDistanceTo(edgeB[1]) < rsq_tol)
        return true;

    return false;
}

function isQuadConvex(p0, p1, p2, p3)
{
    var diag0 = [p0, p2];
    var diag1 = [p1, p3];

    return isEdgeIntersecting(diag0, diag1);
}

function isSameEdge(edge0, edge1)
{
    return ((edge0[0] == edge1[0] && edge0[1] == edge1[1]) ||
        (edge0[1] == edge1[0] && edge0[0] == edge1[1]))
}

function getCircumcenter(p0, p1, p2)
{
    var d = 2*(p0.x*(p1.y - p2.y) + p1.x*(p2.y - p0.y) + p2.x*(p0.y - p1.y));

    var p0_mag = p0.x*p0.x + p0.y*p0.y;
    var p1_mag = p1.x*p1.x + p1.y*p1.y;
    var p2_mag = p2.x*p2.x + p2.y*p2.y;

    var xc = (p0_mag*(p1.y - p2.y) + p1_mag*(p2.y - p0.y) + p2_mag*(p0.y - p1.y)) / d;
    var yc = (p0_mag*(p2.x - p1.x) + p1_mag*(p0.x - p2.x) + p2_mag*(p1.x - p0.x)) / d;

    return new Point(xc, yc); //[pc, r];
}

function getPointOrientation(edge, p)
{
    const vec_edge01 = edge[1].sub(edge[0]);
    const vec_edge0_to_p = p.sub(edge[0]);
    return cross(vec_edge01, vec_edge0_to_p);
}

//Some variables for rendering

var min_coord = new Point(0,0);

var screenL = 1.0;

var boundingL = 1000.0;

var is_rand_spare_ready = false;
var rand_spare = 0;

var point_loc_search_path = [];

function binSorter(a, b)
{
    if (a.bin == b.bin) {
        return 0;
    } else {
        return a.bin < b.bin ? -1 : 1;
    }
}

function setupDelaunay(meshData)
{
    const nVertex = meshData.vert.length;
    const nBinsX = Math.round(Math.pow(nVertex, 0.25));
    const nBins = nBinsX*nBinsX;

    //Compute scaled vertex coordinates and assign each vertex to a bin
    var scaledverts = [];
    var bin_index = [];
    for(let i = 0; i < nVertex; i++)
    {
        const scaled_x = (meshData.vert[i].x - min_coord.x)/screenL;
        const scaled_y = (meshData.vert[i].y - min_coord.y)/screenL;
        scaledverts.push(new Point(scaled_x, scaled_y));

        const ind_i = Math.round((nBinsX-1)*scaled_x);
        const ind_j = Math.round((nBinsX-1)*scaled_y);

        let bin_id;
        if (ind_j % 2 === 0)
        {
            bin_id = ind_j*nBinsX + ind_i;
        }
        else
        {
            bin_id = (ind_j+1)*nBinsX - ind_i - 1;
        }
        bin_index.push({ind:i,bin:bin_id});
    }


    //Add super-triangle vertices (far away)
    const D = boundingL;
    scaledverts.push(new Point(-D+0.5, -D/Math.sqrt(3) + 0.5));
    scaledverts.push(new Point( D+0.5, -D/Math.sqrt(3) + 0.5));
    scaledverts.push(new Point(   0.5, 2*D/Math.sqrt(3) + 0.5));

    for (let i = nVertex; i < nVertex+3; i++)
        meshData.vert.push(new Point(screenL*scaledverts[i].x + min_coord.x, screenL*scaledverts[i].y + min_coord.y));

    //Sort the vertices in ascending bin order
    bin_index.sort(binSorter);

    meshData.scaled_vert = scaledverts;
    meshData.bin = bin_index;

    //Super-triangle connectivity
    meshData.tri = [[nVertex, (nVertex+1), (nVertex+2)]];
    meshData.adj = [[-1, -1, -1]];

    meshData.vert_to_tri = [];
}

//Function for computing the unconstrained Delaunay triangulation
function delaunay(meshData)
{
    //Sort input vertices and setup super-triangle
    setupDelaunay(meshData);

    var verts = meshData.scaled_vert;
    var bins = meshData.bin;
    var triangles = meshData.tri;
    var adjacency = meshData.adj;

    const N = verts.length - 3; //vertices includes super-triangle nodes

    var ind_tri = 0; //points to the super-triangle
    var nhops_total = 0;

    for (let i = 0; i < N; i++)
    {
        const new_i = bins[i].ind;

        const res = findEnclosingTriangle(verts[new_i], meshData, ind_tri);
        ind_tri = res[0];
        nhops_total += res[1];

        if (ind_tri === -1)
            throw "Could not find a triangle containing the new vertex!";

        let cur_tri = triangles[ind_tri]; //vertex indices of triangle containing new point
        let new_tri0 = [cur_tri[0], cur_tri[1], new_i];
        let new_tri1 = [new_i, cur_tri[1], cur_tri[2]];
        let new_tri2 = [cur_tri[0], new_i, cur_tri[2]];

        //Replace the triangle containing the point with new_tri0, and
        //fix its adjacency
        triangles[ind_tri] = new_tri0;

        const N_tri = triangles.length;
        const cur_tri_adj = adjacency[ind_tri]; //neighbors of cur_tri
        adjacency[ind_tri] = [N_tri, N_tri+1, cur_tri_adj[2]];

        //Add the other two new triangles to the list
        triangles.push(new_tri1); //triangle index N_tri
        triangles.push(new_tri2); //triangle index (N_tri+1)

        adjacency.push([cur_tri_adj[0], N_tri+1, ind_tri]); //adj for triangle N_tri
        adjacency.push([N_tri, cur_tri_adj[1], ind_tri]); //adj for triangle (N_tri+1)

        //stack of triangles which need to be checked for Delaunay condition
        //each element contains: [index of tri to check, adjncy index to goto triangle that contains new point]
        let stack = [];

        if (cur_tri_adj[2] >= 0) //if triangle cur_tri's neighbor exists
        {
            //Find the index for cur_tri in the adjacency of the neighbor
            const neigh_adj_ind = adjacency[cur_tri_adj[2]].indexOf(ind_tri);

            //No need to update adjacency, but push the neighbor on to the stack
            stack.push([cur_tri_adj[2], neigh_adj_ind]);
        }
        if (cur_tri_adj[0] >= 0) //if triangle N_tri's neighbor exists
        {
            //Find the index for cur_tri in the adjacency of the neighbor
            const neigh_adj_ind = adjacency[cur_tri_adj[0]].indexOf(ind_tri);
            adjacency[cur_tri_adj[0]][neigh_adj_ind] = N_tri;
            stack.push([cur_tri_adj[0], neigh_adj_ind]);
        }

        if (cur_tri_adj[1] >= 0) //if triangle (N_tri+1)'s neighbor exists
        {
            //Find the index for cur_tri in the adjacency of the neighbor
            const neigh_adj_ind = adjacency[cur_tri_adj[1]].indexOf(ind_tri);
            adjacency[cur_tri_adj[1]][neigh_adj_ind] = N_tri+1;
            stack.push([cur_tri_adj[1], neigh_adj_ind]);
        }

        restoreDelaunay(new_i, meshData, stack);

    } //loop over vertices

    removeBoundaryTriangles(meshData);
}

//Uses edge orientations - based on Peter Brown's Technical Report 1997
function findEnclosingTriangle(target_vertex, meshData, ind_tri_cur)
{
    var vertices = meshData.scaled_vert;
    var triangles = meshData.tri;
    var adjacency = meshData.adj;
    const max_hops = Math.max(10, adjacency.length);

    var nhops = 0;
    var found_tri = false;
    var path = [];

    while (!found_tri && nhops < max_hops)
    {
        if (ind_tri_cur === -1) //target is outside triangulation
            return [ind_tri_cur, nhops];

        var tri_cur = triangles[ind_tri_cur];

        //Orientation of target wrt each edge of triangle (positive if on left of edge)
        const orients = [getPointOrientation([vertices[tri_cur[1]],  vertices[tri_cur[2]]], target_vertex),
            getPointOrientation([vertices[tri_cur[2]],  vertices[tri_cur[0]]], target_vertex),
            getPointOrientation([vertices[tri_cur[0]],  vertices[tri_cur[1]]], target_vertex)];

        if (orients[0] >= 0 && orients[1] >= 0 && orients[2] >= 0) //target is to left of all edges, so inside tri
            return [ind_tri_cur, nhops];

        var base_ind = -1;
        for (let iedge = 0; iedge < 3; iedge++)
        {
            if (orients[iedge] >= 0)
            {
                base_ind = iedge;
                break;
            }
        }
        const base_p1_ind = (base_ind + 1) % 3;
        const base_p2_ind = (base_ind + 2) % 3;

        if (orients[base_p1_ind] >= 0 && orients[base_p2_ind] < 0)
        {
            ind_tri_cur = adjacency[ind_tri_cur][base_p2_ind]; //should move to the triangle opposite base_p2_ind
            path[nhops] = vertices[tri_cur[base_ind]].add(vertices[tri_cur[base_p1_ind]]).scale(0.5);
        }
        else if (orients[base_p1_ind] < 0 && orients[base_p2_ind] >= 0)
        {
            ind_tri_cur = adjacency[ind_tri_cur][base_p1_ind]; //should move to the triangle opposite base_p1_ind
            path[nhops] = vertices[tri_cur[base_p2_ind]].add(vertices[tri_cur[base_ind]]).scale(0.5);
        }
        else
        {
            const vec0 = vertices[tri_cur[base_p1_ind]].sub(vertices[tri_cur[base_ind]]); //vector from base_ind to base_p1_ind
            const vec1 = target_vertex.sub(vertices[tri_cur[base_ind]]); //vector from base_ind to target_vertex
            if (vec0.dot(vec1) > 0)
            {
                ind_tri_cur = adjacency[ind_tri_cur][base_p2_ind]; //should move to the triangle opposite base_p2_ind
                path[nhops] = vertices[tri_cur[base_ind]].add(vertices[tri_cur[base_p1_ind]]).scale(0.5);
            }
            else
            {
                ind_tri_cur = adjacency[ind_tri_cur][base_p1_ind]; //should move to the triangle opposite base_p1_ind
                path[nhops] = vertices[tri_cur[base_p2_ind]].add(vertices[tri_cur[base_ind]]).scale(0.5);
            }
        }

        nhops++;
    }

    if(!found_tri)
    {
        point_loc_search_path = path;
        throw "Could not locate the triangle that encloses (" + target_vertex.x + ", " + target_vertex.y + ")!";
    }

    return [ind_tri_cur, (nhops-1)];
}

function restoreDelaunay(ind_vert, meshData, stack)
{
    var vertices = meshData.scaled_vert;
    var triangles = meshData.tri;
    var adjacency = meshData.adj;
    var v_new = vertices[ind_vert];

    while(stack.length > 0)
    {
        const ind_tri_pair = stack.pop(); //[index of tri to check, adjncy index to goto triangle that contains new point]
        const ind_tri = ind_tri_pair[0];

        const ind_tri_vert = triangles[ind_tri]; //vertex indices of the triangle
        let v_tri = [];
        for (let i = 0; i < 3; i++)
            v_tri[i] = vertices[ind_tri_vert[i]];

        if (!isDelaunay2(v_tri, v_new))
        {
            //v_new lies inside the circumcircle of the triangle, so need to swap diagonals

            const outernode_tri = ind_tri_pair[1]; // [0,1,2] node-index of vertex that's not part of the common edge
            const ind_tri_neigh = adjacency[ind_tri][outernode_tri];

            if (ind_tri_neigh < 0)
                throw "negative index";

            //Swap the diagonal between the adjacent triangles
            swapDiagonal(meshData, ind_tri, ind_tri_neigh);

            //Add the triangles opposite the new vertex to the stack
            const new_node_ind_tri = triangles[ind_tri].indexOf(ind_vert);
            const ind_tri_outerp2 = adjacency[ind_tri][new_node_ind_tri];
            if (ind_tri_outerp2 >= 0)
            {
                const neigh_node = adjacency[ind_tri_outerp2].indexOf(ind_tri);
                stack.push([ind_tri_outerp2, neigh_node]);
            }

            const new_node_ind_tri_neigh = triangles[ind_tri_neigh].indexOf(ind_vert);
            const ind_tri_neigh_outer = adjacency[ind_tri_neigh][new_node_ind_tri_neigh];
            if (ind_tri_neigh_outer >= 0)
            {
                const neigh_node = adjacency[ind_tri_neigh_outer].indexOf(ind_tri_neigh);
                stack.push([ind_tri_neigh_outer, neigh_node]);
            }

        } //is not Delaunay
    }
}

//Swaps the diagonal of adjacent triangles A and B
function swapDiagonal(meshData, ind_triA, ind_triB)
{
    var triangles = meshData.tri;
    var adjacency = meshData.adj;
    var vert2tri = meshData.vert_to_tri;

    //Find the node index of the outer vertex in each triangle
    const outernode_triA = adjacency[ind_triA].indexOf(ind_triB);
    const outernode_triB = adjacency[ind_triB].indexOf(ind_triA);

    //Indices of nodes after the outernode (i.e. nodes of the common edge)
    const outernode_triA_p1 = (outernode_triA + 1) % 3;
    const outernode_triA_p2 = (outernode_triA + 2) % 3;

    const outernode_triB_p1 = (outernode_triB + 1) % 3;
    const outernode_triB_p2 = (outernode_triB + 2) % 3;

    //Update triangle nodes
    triangles[ind_triA][outernode_triA_p2] = triangles[ind_triB][outernode_triB];
    triangles[ind_triB][outernode_triB_p2] = triangles[ind_triA][outernode_triA];

    //Update adjacencies for triangle opposite outernode
    adjacency[ind_triA][outernode_triA] = adjacency[ind_triB][outernode_triB_p1];
    adjacency[ind_triB][outernode_triB] = adjacency[ind_triA][outernode_triA_p1];

    //Update adjacency of neighbor opposite triangle A's (outernode+1) node
    const ind_triA_neigh_outerp1 = adjacency[ind_triA][outernode_triA_p1];
    if (ind_triA_neigh_outerp1 >= 0)
    {
        const neigh_node = adjacency[ind_triA_neigh_outerp1].indexOf(ind_triA);
        adjacency[ind_triA_neigh_outerp1][neigh_node] = ind_triB;
    }

    //Update adjacency of neighbor opposite triangle B's (outernode+1) node
    const ind_triB_neigh_outerp1 = adjacency[ind_triB][outernode_triB_p1];
    if (ind_triB_neigh_outerp1 >= 0)
    {
        const neigh_node = adjacency[ind_triB_neigh_outerp1].indexOf(ind_triB);
        adjacency[ind_triB_neigh_outerp1][neigh_node] = ind_triA;
    }

    //Update adjacencies for triangles opposite the (outernode+1) node
    adjacency[ind_triA][outernode_triA_p1] = ind_triB;
    adjacency[ind_triB][outernode_triB_p1] = ind_triA;

    //Update vertex to triangle connectivity, if data structure exists
    if (vert2tri.length > 0)
    {
        //The original outernodes will now be part of both triangles
        vert2tri[triangles[ind_triA][outernode_triA]].push(ind_triB);
        vert2tri[triangles[ind_triB][outernode_triB]].push(ind_triA);

        //Remove triangle B from the triangle set of outernode_triA_p1
        let local_ind = vert2tri[triangles[ind_triA][outernode_triA_p1]].indexOf(ind_triB);
        vert2tri[triangles[ind_triA][outernode_triA_p1]].splice(local_ind, 1);

        //Remove triangle A from the triangle set of outernode_triB_p1
        local_ind = vert2tri[triangles[ind_triB][outernode_triB_p1]].indexOf(ind_triA);
        vert2tri[triangles[ind_triB][outernode_triB_p1]].splice(local_ind, 1);
    }
}

function removeBoundaryTriangles(meshData)
{
    var verts = meshData.scaled_vert;
    var triangles = meshData.tri;
    var adjacency = meshData.adj;
    const N = verts.length - 3;

    var del_count = 0;
    var indmap = [];
    for (let i = 0; i < triangles.length; i++)
    {
        let prev_del_count = del_count;
        for (let j = i; j < triangles.length; j++)
        {
            if (triangles[j][0] < N && triangles[j][1] < N && triangles[j][2] < N)
            {
                indmap[i+del_count] = i;
                break;
            }
            else
            {
                indmap[i+del_count] = -1;
                del_count++;
            }
        }

        let del_length = del_count - prev_del_count;
        if (del_length > 0)
        {
            triangles.splice(i, del_length);
            adjacency.splice(i, del_length);
        }
    }

    //Update adjacencies
    for (let i = 0; i < adjacency.length; i++)
        for (let j = 0; j < 3; j++)
            adjacency[i][j] = indmap[adjacency[i][j]];

    //Delete super-triangle nodes
    meshData.scaled_vert.splice(-3,3);
    meshData.vert.splice(-3,3);
}

function isDelaunay2(v_tri, p)
{
    const vecp0 = v_tri[0].sub(p);
    const vecp1 = v_tri[1].sub(p);
    const vecp2 = v_tri[2].sub(p);

    const p0_sq = vecp0.x*vecp0.x + vecp0.y*vecp0.y;
    const p1_sq = vecp1.x*vecp1.x + vecp1.y*vecp1.y;
    const p2_sq = vecp2.x*vecp2.x + vecp2.y*vecp2.y;

    const det = vecp0.x * (vecp1.y * p2_sq - p1_sq * vecp2.y)
        -vecp0.y * (vecp1.x * p2_sq - p1_sq * vecp2.x)
        + p0_sq  * (vecp1.x * vecp2.y - vecp1.y * vecp2.x);

    if (det > 0) //p is inside circumcircle of v_tri
        return false;
    else
        return true;
}