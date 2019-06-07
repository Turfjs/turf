const helper = require('@turf/helpers');

let boundingL = 1000.0;
let screenL = 1.0;

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

let min_coord = new Point(0,0);
let max_coord = new Point(1,1);

module.exports = function(points, edges) {
    return delaunay({
        vert: points.features,
        con_edge: edges
    });
};

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

    console.log("Avg hops: " + (nhops_total/N));
    removeBoundaryTriangles(meshData);

    printToLog("Created " + triangles.length + " triangles.");
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

        //console.log("i: " + i + ": " + scaled_x.toFixed(3) + ", " + scaled_y.toFixed(3) + ", ind: " + ind_i + ", " + ind_j + ", bin:" + bin_id);
    }

    console.log("nBins: " + nBins);

    //Add super-triangle vertices (far away)
    const D = boundingL;
    scaledverts.push(new Point(-D+0.5, -D/Math.sqrt(3) + 0.5));
    scaledverts.push(new Point( D+0.5, -D/Math.sqrt(3) + 0.5));
    scaledverts.push(new Point(   0.5, 2*D/Math.sqrt(3) + 0.5));

    for (let i = nVertex; i < nVertex+3; i++)
        meshData.vert.push(new Point(screenL*scaledverts[i].x + min_coord.x, screenL*scaledverts[i].y + min_coord.y));

//  scaledverts.push(new Point(-D+0.5, -D+0.5));
//  scaledverts.push(new Point( D+0.5, -D+0.5));
//  scaledverts.push(new Point( D+0.5,  D+0.5));
//  scaledverts.push(new Point(-D+0.5,  D+0.5));
//  meshData.vert.push(new Point(screenL*(-D+0.5) + min_coord.x, screenL*(-D+0.5) + min_coord.y));
//  meshData.vert.push(new Point(screenL*( D+0.5) + min_coord.x, screenL*(-D+0.5) + min_coord.y));
//  meshData.vert.push(new Point(screenL*( D+0.5) + min_coord.x, screenL*( D+0.5) + min_coord.y));
//  meshData.vert.push(new Point(screenL*(-D+0.5) + min_coord.x, screenL*( D+0.5) + min_coord.y));

    //Sort the vertices in ascending bin order
    bin_index.sort(binSorter);

    //for(let i = 0; i < bin_index.length; i++)
    //  console.log("i: " + bin_index[i].ind + ", " + bin_index[i].bin);

    meshData.scaled_vert = scaledverts;
    meshData.bin = bin_index;

    //Super-triangle connectivity
    meshData.tri = [[nVertex, (nVertex+1), (nVertex+2)]];
    meshData.adj = [[-1, -1, -1]];

    //Super-quad connectivity
//  meshData.tri = [[nVertex, (nVertex+1), (nVertex+3)],
//                  [(nVertex+2), (nVertex+3), (nVertex+1)]];
//  meshData.adj = [[1, -1, -1],
//                  [0, -1, -1]];

    meshData.vert_to_tri = [];
}

function binSorter(a, b)
{
    if (a.bin == b.bin) {
        return 0;
    } else {
        return a.bin < b.bin ? -1 : 1;
    }
}

function removeBoundaryTriangles(meshData)
{
    console.log(meshData);
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
        printToLog("Failed to locate triangle containing vertex (" +
            target_vertex.x.toFixed(4) + ", " + target_vertex.y.toFixed(4) + "). "
            + "Input vertices may be too close to each other.");

        console.log("nhops: " + (nhops-1));
        point_loc_search_path = path;
        renderCanvas(true);
        throw "Could not locate the triangle that encloses (" + target_vertex.x + ", " + target_vertex.y + ")!";
    }

    return [ind_tri_cur, (nhops-1)];
}

function getPointOrientation(edge, p)
{
    const vec_edge01 = edge[1].sub(edge[0]);
    const vec_edge0_to_p = p.sub(edge[0]);
    return cross(vec_edge01, vec_edge0_to_p);
    // if (area > 0)
    //   return 1;
    // else if (area < 0)
    //   return -1;
    // else
    //   return 0;
}

function cross(vec0, vec1)
{
    return (vec0.x*vec1.y - vec0.y*vec1.x);
}
