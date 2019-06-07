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
    //var pc = new Point(xc, yc);
    //var r = Math.sqrt(pc.sqDistanceTo(p0));

    return new Point(xc, yc); //[pc, r];
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

//Some variables for rendering
var canvas_width = 600;
var canvas_height = 600;
var canvas_L = canvas_width;

var min_coord = new Point(0,0);
var max_coord = new Point(1,1);
var screenL = 1.0;
var zoom_scale = 0.8;
var last_canvas_coord = new Point(0,0);
var mouse_down_coord = new Point(0,0);
var canvas_translation = new Point(0,0);
var prev_canvas_translation = new Point(0,0);
var isMouseDown = false;
var last_mousedown_time = 0;
var last_render_time = 0;
var render_dt = 1000.0/30.0; //30 FPS

var selected_vertex_index = -1;
var selected_triangle_index = -1;
var render_vertices_flag = true;

var boundingL = 1000.0;

//Color definitions
const colorVertex = "#222222";
const colorTriangle = "#EEEEEE";
const colorEdge = "#555555";
const colorConstrainedEdge = "#FF7777";

const colorHighlightedVertex = "#FF0000";
const colorHighlightedTriangle = "#4DA6FF";
const colorHighlightedAdjTriangle = "#B3D9FF";

const edgeWidth = 2;

var is_rand_spare_ready = false;
var rand_spare = 0;

//Data structure for storing triangulation info
var globalMeshData =
    {
        vert: [],
        scaled_vert: [],
        bin: [],
        tri: [],
        adj: [],
        con_edge: [],
        vert_to_tri: []
    };

var point_loc_search_path = [];

/*window.onload = function()
{
    resizeCanvas();

    //Register canvas event handlers
    var canvas = document.getElementById("main_canvas");
    canvas.onmousedown = function(e) { onCanvasMouseDown(canvas, e); };
    canvas.onmousemove = function(e) { onCanvasMouseMove(canvas, e); };
    canvas.onmouseup = function(e) { onCanvasMouseUp(canvas, e); };
    canvas.onwheel = function(e) { onCanvasMouseWheel(canvas, e); };

    var checkshowvertices = document.getElementById("checkboxShowVertices");
    checkshowvertices.onclick = function ()
    {
        render_vertices_flag = checkshowvertices.checked;
        renderCanvas(true);
    };
};

window.onresize = function()
{
    resizeCanvas();
};*/

function resizeCanvas()
{
    var canvas = document.getElementById("main_canvas");
    console.log("Canvas width: " + canvas.offsetWidth + " x " + canvas.offsetHeight)
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    canvas_width = canvas.width;
    canvas_height = canvas.height;
    canvas_L = Math.min(canvas_width, canvas_height);

    var div_controls = document.getElementById("div_controls");
    var div_content = document.getElementById("div_content");
    var div_infopanel = document.getElementById("div_infopanel");
    const max_height = Math.max(div_controls.offsetHeight, div_content.offsetHeight);
    div_controls.style.height = max_height + 'px';
    div_infopanel.style.height = (max_height - canvas_height) + 'px';

    renderCanvas(true);
}

function readVertices()
{
    var file = document.getElementById("filevertex").files[0];
    if (file) {
        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = function (evt) {
            document.getElementById("txtvertices").value = evt.target.result;

            //Clear any previous edges
            var txtedges = document.getElementById("txtedges");
            txtedges.value = "";
            loadInputData();
        }
        reader.onerror = function (evt) {
            document.getElementById("txtvertices").value = "Error reading file!";
        }
    }
}

function readEdges()
{
    var file = document.getElementById("fileedge").files[0];
    if (file) {
        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = function (evt) {
            document.getElementById("txtedges").value = evt.target.result;
            loadInputData();
        }
        reader.onerror = function (evt) {
            document.getElementById("txtedges").value = "Error reading file!";
        }
    }
}

function loadVertices()
{
    var txt = document.getElementById("txtvertices");
    if (txt.value === "Vertices...\n")
        return;

    var txtlines = txt.value.split("\n");

    globalMeshData.vert = [];

    min_coord = new Point(Number.MAX_VALUE, Number.MAX_VALUE);
    max_coord = new Point(-Number.MAX_VALUE, -Number.MAX_VALUE);

    for(let i = 0; i < txtlines.length; i++)
    {
        if (txtlines[i].length > 0)
        {
            let coords_str = txtlines[i].trim().split(/[ ,]+/);

            if (coords_str.length != 2)
            {
                alert("Vertex " + i + " does not have 2 coordinates!");
                globalMeshData.vert = [];
                break;
            }

            let coords = new Point(Number(coords_str[0]), Number(coords_str[1]));

            // let coincides = false;
            // for (let j = 0; j < globalMeshData.vert.length; j++)
            // {
            //   const dist = Math.sqrt(coords.sqDistanceTo(globalMeshData.vert[j]));
            //   if (dist < 1e-10)
            //   {
            //     alert("Vertices " + i + " and " + j + " coincide or are too close to each other.");
            //     globalMeshData.vert = [];
            //     coincides = true;
            //     break;
            //   }
            // }
            // if (coincides)
            //   break;

            globalMeshData.vert.push(coords);

            min_coord.x = Math.min(min_coord.x, coords.x);
            min_coord.y = Math.min(min_coord.y, coords.y);
            max_coord.x = Math.max(max_coord.x, coords.x);
            max_coord.y = Math.max(max_coord.y, coords.y);
        }
    }

    screenL = Math.max(max_coord.x - min_coord.x, max_coord.y - min_coord.y);

    //console.log("min_coord: " + min_coord.x + ", " + min_coord.y);
    //console.log("max_coord: " + max_coord.x + ", " + max_coord.y);
    //console.log("screenL: " + screenL);

    document.getElementById("vertexinfo").innerHTML = "Vertex list: " + globalMeshData.vert.length + " vertices";
}


function loadEdges()
{
    var txt = document.getElementById("txtedges");
    if (txt.value === "Edges...\n")
        return;

    var txtlines = txt.value.split("\n");
    var nVertex = globalMeshData.vert.length;

    globalMeshData.con_edge = [];

    for(let i = 0; i < txtlines.length; i++)
    {
        if (txtlines[i].length > 0)
        {
            let edge_str = txtlines[i].trim().split(/[ ,]+/);

            if (edge_str.length != 2)
            {
                alert("Edge " + i + " does not have 2 node indices!");
                globalMeshData.con_edge = [];
                break;
            }

            let edge = [Number(edge_str[0]), Number(edge_str[1])];

            if (!Number.isInteger(edge[0]) || !Number.isInteger(edge[1]))
            {
                alert("Vertex indices of edge " + i + " need to be integers.");
                globalMeshData.con_edge = [];
                break;
            }

            if (edge[0] < 0 || edge[0] >= nVertex ||
                edge[1] < 0 || edge[1] >= nVertex)
            {
                alert("Vertex indices of edge " + i + " need to be non-negative and less than the number of input vertices.");
                globalMeshData.con_edge = [];
                break;
            }

            if (edge[0] === edge[1])
            {
                alert("Edge " + i + " is degenerate!");
                globalMeshData.con_edge = [];
                break;
            }

            if (!isEdgeValid(edge, globalMeshData.con_edge, globalMeshData.vert))
            {
                alert("Edge " + i + " already exists or intersects with an existing edge!");
                globalMeshData.con_edge = [];
                break;
            }

            globalMeshData.con_edge.push([edge[0], edge[1]]);
        }
    }

    document.getElementById("edgeinfo").innerHTML = "Constrained edge list: " + globalMeshData.con_edge.length + " edges";
}

function loadInputData()
{
    loadVertices();
    loadEdges();

    printToLog("Loaded " + globalMeshData.vert.length + " vertices and " +
        globalMeshData.con_edge.length + " constrained edges.");

    globalMeshData.tri = [];
    globalMeshData.adj = [];

    selected_vertex_index = -1;
    selected_triangle_index = -1;
    point_loc_search_path = [];

    renderCanvas(true);
}

function genRandVertices()
{
    var txt = document.getElementById("txtnumrandvertex");
    const nVert = txt.value;
    if (nVert < 3)
    {
        alert("Require at least 3 vertices.");
        return;
    }

    var txtvertices = document.getElementById("txtvertices");
    var content = "";

    if (document.getElementById("radiouniform").checked)
    {
        for (let i = 0; i < nVert; i++)
            content += Math.random().toFixed(10) + ", " + Math.random().toFixed(10) + "\n";
    }
    else
    {
        for (let i = 0; i < nVert; i++)
            content += randn(0,1).toFixed(10) + ", " + randn(0,1).toFixed(10) + "\n";
    }

    txtvertices.innerHTML = content;
    txtvertices.value = content;

    //Clear any previous edges
    var txtedges = document.getElementById("txtedges");
    txtedges.innerHTML = "";
    txtedges.value = "";

    loadInputData();
}

function genRandEdges()
{
    var nVertex = globalMeshData.vert.length;
    if (nVertex == 0)
    {
        alert("Require at least 3 vertices.");
        return;
    }

    var txt = document.getElementById("txtnumrandedges");
    var txtedges = document.getElementById("txtedges");

    var nEdgeMax = nVertex*(nVertex - 1) / 2;
    if (txt.value > nEdgeMax)
    {
        alert("The maximum number of constrained edges possible between " + nVertex + " points is " + nEdgeMax + ".");
        return;
    }

    var edge_list = [];
    var maxIter = 5*nEdgeMax;
    var iter = 0;
    while (edge_list.length < txt.value && iter < maxIter)
    {
        iter++;
        let new_edge = [Math.floor(nVertex*Math.random()), Math.floor(nVertex*Math.random())];

        if (new_edge[0] === new_edge[1])
            continue;

        if (!isEdgeValid(new_edge, edge_list, globalMeshData.vert))
            continue;

        edge_list.push(new_edge);
    }

    var content = "";
    for (let i = 0; i < edge_list.length; i++)
        content += edge_list[i][0] + ", " + edge_list[i][1] + "\n";

    txtedges.innerHTML = content;
    txtedges.value = content;
    loadInputData();
}

function isEdgeValid(newEdge, edgeList, vertices)
{
    var new_edge_verts = [vertices[newEdge[0]], vertices[newEdge[1]]];

    for (let i = 0; i < edgeList.length; i++)
    {
        //Not valid if edge already exists
        if ( (edgeList[i][0] == newEdge[0] && edgeList[i][1] == newEdge[1]) ||
            (edgeList[i][0] == newEdge[1] && edgeList[i][1] == newEdge[0]) )
            return false;

        let hasCommonNode = (edgeList[i][0] == newEdge[0] || edgeList[i][0] == newEdge[1] ||
            edgeList[i][1] == newEdge[0] || edgeList[i][1] == newEdge[1]);

        let edge_verts = [vertices[edgeList[i][0]], vertices[edgeList[i][1]]];

        if (!hasCommonNode && isEdgeIntersecting(edge_verts, new_edge_verts))
            return false;
    }

    return true;
}

function printToLog(str)
{
    /*var div_log = document.getElementById("div_log");
    div_log.innerHTML += "> " + str + "<br/>";

    div_log.scrollTop = div_log.scrollHeight;*/
}

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

        //console.log("i: " + i + ": " + scaled_x.toFixed(3) + ", " + scaled_y.toFixed(3) + ", ind: " + ind_i + ", " + ind_j + ", bin:" + bin_id);
    }

    //console.log("nBins: " + nBins);

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

    //console.log("Avg hops: " + (nhops_total/N));
    removeBoundaryTriangles(meshData);

    printToLog("Created " + triangles.length + " triangles.");
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

//Uses Barycentric coordinates
function findEnclosingTriangleOld(target_vertex, meshData, ind_tri_cur)
{
    var vertices = meshData.scaled_vert;
    var triangles = meshData.tri;
    var adjacency = meshData.adj;
    const max_hops = Math.max(10, adjacency.length);

    var found_tri = false;
    var nhops = 0;
    var path = [];
    while (!found_tri && nhops < max_hops)
    {
        if (ind_tri_cur === -1)
        {
            found_tri = true; //target is outside triangulation
            break;
        }

        const tri_cur = triangles[ind_tri_cur];

        const bary_coord = barycentericCoordTriangle(target_vertex,
            vertices[tri_cur[0]], vertices[tri_cur[1]], vertices[tri_cur[2]]);

        if (bary_coord.s < 0.0)
        {
            ind_tri_cur = adjacency[ind_tri_cur][1]; //should move to the triangle opposite edge1
            path[nhops] = vertices[tri_cur[2]].add(vertices[tri_cur[0]]).scale(0.5);
        }
        else if (bary_coord.t < 0.0)
        {
            ind_tri_cur = adjacency[ind_tri_cur][2]; //should move to the triangle opposite edge2
            path[nhops] = vertices[tri_cur[0]].add(vertices[tri_cur[1]]).scale(0.5);
        }
        else if (bary_coord.u < 0.0)
        {
            ind_tri_cur = adjacency[ind_tri_cur][0]; //should move to the triangle opposite edge0
            path[nhops] = vertices[tri_cur[1]].add(vertices[tri_cur[2]]).scale(0.5);
        }
        else if (bary_coord.s >= 0.0 &&
            bary_coord.t >= 0.0 &&
            bary_coord.u >= 0.0)
        {
            found_tri = true;
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
        renderCanvas();
        throw "Could not locate the triangle that encloses (" + target_vertex.x + ", " + target_vertex.y + ")!";
    }

    return [ind_tri_cur, (nhops-1)];
}

function findEnclosingTriangleSlow(target_vertex, meshData, ind_tri_cur)
{
    var vertices = meshData.scaled_vert;
    var triangles = meshData.tri;

    for (let ind_tri = 0; ind_tri < triangles.length; ind_tri++)
    {
        const tri_cur = triangles[ind_tri];

        //Skip triangle if target is to the right of any of the edges
        if (getPointOrientation([vertices[tri_cur[0]],  vertices[tri_cur[1]]], target_vertex) < 0)
            continue;

        if (getPointOrientation([vertices[tri_cur[1]],  vertices[tri_cur[2]]], target_vertex) < 0)
            continue;

        if (getPointOrientation([vertices[tri_cur[2]],  vertices[tri_cur[0]]], target_vertex) < 0)
            continue;

        //Point is inside triangle if it reaches here
        return [ind_tri, ind_tri+1];

//    const bary_coord = barycentericCoordTriangle(target_vertex,
//                          vertices[tri_cur[0]],  vertices[tri_cur[1]], vertices[tri_cur[2]]);
//
//    if (bary_coord.s >= 0.0 && bary_coord.t >= 0.0 && bary_coord.u >= 0.0)
//    {
//      return [ind_tri, ind_tri+1];
//   }
    }

    throw "Could not locate the triangle that encloses (" + target_vertex.x + ", " + target_vertex.y + ")!";
    return [-1, triangles.length];
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

function isDelaunay(v_tri, p)
{
    const vec02 = v_tri[0].sub(v_tri[2]); //v_tri[0] - v_tri[2]
    const vec12 = v_tri[1].sub(v_tri[2]);
    const vec0p = v_tri[0].sub(p);
    const vec1p = v_tri[1].sub(p);

    const cos_a = vec02.x*vec12.x + vec02.y*vec12.y;
    const cos_b = vec1p.x*vec0p.x + vec1p.y*vec0p.y;

    if (cos_a >= 0 && cos_b >= 0)
        return true;
    else if (cos_a < 0 && cos_b < 0)
        return false;

    const sin_ab = (vec02.x*vec12.y - vec12.x*vec02.y)*cos_b
        +(vec1p.x*vec0p.y - vec0p.x*vec1p.y)*cos_a;

    if (sin_ab < 0)
        return false;
    else
        return true;
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

function printTriangles(meshData)
{
    var txttri = document.getElementById("txttriangles");
    var content = "";
    for (let i = 0; i < meshData.tri.length; i++)
        content += meshData.tri[i][0] + ", " + meshData.tri[i][1] + ", " + meshData.tri[i][2] + "\n";

    txttri.innerHTML = content;
    txttri.value = content;

    document.getElementById("tri_list_info").innerHTML = "Triangle list: " + meshData.tri.length + " triangles";
}

function constrainEdges(meshData)
{
    if (meshData.con_edge.length == 0)
        return;

    buildVertexConnectivity(meshData);

    var con_edges = meshData.con_edge;
    var triangles = meshData.tri;
    var verts = meshData.scaled_vert;
    var adjacency = meshData.adj;
    var vert2tri = meshData.vert_to_tri;

    var newEdgeList = [];

    for (let iedge = 0; iedge < con_edges.length; iedge++)
    {
        let intersections = getEdgeIntersections(meshData, iedge);

        let iter = 0;
        const maxIter = Math.max(intersections.length, 1);
        while (intersections.length > 0 && iter < maxIter)
        {
            fixEdgeIntersections(meshData, intersections, iedge, newEdgeList);
            intersections = getEdgeIntersections(meshData, iedge);
            iter++;
        }

        if (intersections.length > 0)
            throw "Could not add edge " + iedge + " to triangulation after " + maxIter + " iterations!";

    } //loop over constrained edges


    //Restore Delaunay
    while (true)
    {
        let num_diagonal_swaps = 0;
        for (let iedge = 0; iedge < newEdgeList.length; iedge++)
        {
            const new_edge_nodes = newEdgeList[iedge];

            //Check if the new edge is a constrained edge
            let is_con_edge = false
            for (let jedge = 0; jedge < con_edges.length; jedge++)
            {
                if (isSameEdge(new_edge_nodes, con_edges[jedge]))
                {
                    is_con_edge = true;
                    break;
                };
            }

            if (is_con_edge)
                continue; //cannot change this edge if it's constrained

            const tri_around_v0 = vert2tri[new_edge_nodes[0]];
            let tri_count = 0;
            let tri_ind_pair = [-1, -1]; //indices of the triangles on either side of this edge
            for (let itri = 0; itri < tri_around_v0.length; itri++)
            {
                const cur_tri = triangles[tri_around_v0[itri]];
                if (cur_tri[0] == new_edge_nodes[1] || cur_tri[1] == new_edge_nodes[1] || cur_tri[2] == new_edge_nodes[1])
                {
                    tri_ind_pair[tri_count] = tri_around_v0[itri];
                    tri_count++;

                    if (tri_count == 2)
                        break; //found both neighboring triangles
                }
            }

            if (tri_ind_pair[0] == -1)
                continue; //this edge no longer exists, so nothing to do.

            const triA_verts = [verts[triangles[tri_ind_pair[0]][0]],
                verts[triangles[tri_ind_pair[0]][1]],
                verts[triangles[tri_ind_pair[0]][2]]];

            const outer_nodeB_ind = adjacency[tri_ind_pair[1]].indexOf(tri_ind_pair[0]);
            const triB_vert = verts[triangles[tri_ind_pair[1]][outer_nodeB_ind]];

            if (!isDelaunay2(triA_verts, triB_vert))
            {
                const outer_nodeA_ind = adjacency[tri_ind_pair[0]].indexOf(tri_ind_pair[1]);

                //Swap the diagonal between the pair of triangles
                swapDiagonal(meshData, tri_ind_pair[0], tri_ind_pair[1]);
                num_diagonal_swaps++;

                //Replace current new edge with the new diagonal
                newEdgeList[iedge] = [triangles[tri_ind_pair[0]][outer_nodeA_ind],
                    triangles[tri_ind_pair[1]][outer_nodeB_ind]];
            }

        } //loop over new edges

        if (num_diagonal_swaps == 0)
            break; //no further swaps, we're done.
    }
}

function buildVertexConnectivity(meshData)
{
    var triangles = meshData.tri;
    meshData.vert_to_tri = [];
    var vConnectivity = meshData.vert_to_tri;

    for (let itri = 0; itri < triangles.length; itri++)
    {
        for (let node = 0; node < 3; node++)
        {
            if (vConnectivity[triangles[itri][node]] == undefined)
                vConnectivity[triangles[itri][node]] = [itri];
            else
                vConnectivity[triangles[itri][node]].push(itri);
        }
    }
}

function getEdgeIntersections(meshData, iedge)
{
    var triangles = meshData.tri;
    var verts = meshData.scaled_vert;
    var adjacency = meshData.adj;
    var con_edges = meshData.con_edge;
    var vert2tri = meshData.vert_to_tri;

    const edge_v0_ind = con_edges[iedge][0];
    const edge_v1_ind = con_edges[iedge][1];
    const edge_coords = [verts[edge_v0_ind], verts[edge_v1_ind]];

    const tri_around_v0 = vert2tri[edge_v0_ind];

    let edge_in_triangulation = false;

    //stores the index of tri that intersects current edge,
    //and the edge-index of intersecting edge in triangle
    let intersections = [];

    for (let itri = 0; itri < tri_around_v0.length; itri++)
    {
        const cur_tri = triangles[tri_around_v0[itri]];
        const v0_node = cur_tri.indexOf(edge_v0_ind);
        const v0p1_node = (v0_node+1) % 3;
        const v0p2_node = (v0_node+2) % 3;

        if ( edge_v1_ind == cur_tri[v0p1_node] )
        {
            //constrained edge is an edge of the current tri (node v0_node to v0_node+1)
            edge_in_triangulation = true;
            break;
        }
        else if ( edge_v1_ind == cur_tri[v0p2_node] )
        {
            //constrained edge is an edge of the current tri (node v0_node to v0_node+2)
            edge_in_triangulation = true;
            break;
        }

        const opposite_edge_coords = [verts[cur_tri[v0p1_node]], verts[cur_tri[v0p2_node]]];
        if (isEdgeIntersecting(edge_coords, opposite_edge_coords))
        {
            intersections.push([tri_around_v0[itri], v0_node]);
            break;
        }
    }

    if (!edge_in_triangulation)
    {
        if (intersections.length == 0)
            throw "Cannot have no intersections!";

        while (true)
        {
            const prev_intersection = intersections[intersections.length - 1]; //[tri ind][node ind for edge]
            const tri_ind = adjacency[prev_intersection[0]][prev_intersection[1]];

            if ( triangles[tri_ind][0] == edge_v1_ind ||
                triangles[tri_ind][1] == edge_v1_ind ||
                triangles[tri_ind][2] == edge_v1_ind )
            {
                break; //found the end node of the edge
            }

            //Find the index of the edge from which we came into this triangle
            let prev_edge_ind = adjacency[tri_ind].indexOf(prev_intersection[0]);
            if (prev_edge_ind == -1)
                throw "Could not find edge!";

            const cur_tri = triangles[tri_ind];

            //Loop over the other two edges in this triangle,
            //and check if they intersect the constrained edge
            for (let offset = 1; offset < 3; offset++)
            {
                const v0_node = (prev_edge_ind+offset+1) % 3;
                const v1_node = (prev_edge_ind+offset+2) % 3;
                const cur_edge_coords = [verts[cur_tri[v0_node]], verts[cur_tri[v1_node]]];

                if (isEdgeIntersecting(edge_coords, cur_edge_coords))
                {
                    intersections.push([tri_ind, (prev_edge_ind+offset) % 3]);
                    break;
                }
            }

        } //while intersections not found
    } //if edge not in triangulation

    return intersections;
}

function fixEdgeIntersections(meshData, intersectionList, con_edge_ind, newEdgeList)
{
    var triangles = meshData.tri;
    var verts = meshData.scaled_vert;
    var adjacency = meshData.adj;
    var con_edges = meshData.con_edge;

    //Node indices and endpoint coords of current constrained edge
    var con_edge_nodes = con_edges[con_edge_ind];
    var cur_con_edge_coords = [verts[con_edge_nodes[0]], verts[con_edge_nodes[1]]];

    var nIntersections = intersectionList.length;
    for (let i = 0; i < nIntersections; i++)
    {
        //Looping in reverse order is important since then the
        //indices in intersectionList remain unaffected by any diagonal swaps
        const tri0_ind = intersectionList[nIntersections - 1 - i][0];
        const tri0_node = intersectionList[nIntersections - 1 - i][1];

        const tri1_ind = adjacency[tri0_ind][tri0_node];
        const tri1_node = adjacency[tri1_ind].indexOf(tri0_ind);

        const quad_v0 = verts[triangles[tri0_ind][tri0_node]];
        const quad_v1 = verts[triangles[tri0_ind][(tri0_node + 1) % 3]];
        const quad_v2 = verts[triangles[tri1_ind][tri1_node]];
        const quad_v3 = verts[triangles[tri0_ind][(tri0_node + 2) % 3]];

        const isConvex = isQuadConvex(quad_v0, quad_v1, quad_v2, quad_v3);

        if (isConvex)
        {
            swapDiagonal(meshData, tri0_ind, tri1_ind);

            const newDiagonal_nodes = [triangles[tri0_ind][tri0_node], triangles[tri1_ind][tri1_node]];

            const newDiagonal_coords = [quad_v0, quad_v2];
            const hasCommonNode = (newDiagonal_nodes[0] == con_edge_nodes[0] || newDiagonal_nodes[0] == con_edge_nodes[1] ||
                newDiagonal_nodes[1] == con_edge_nodes[0] || newDiagonal_nodes[1] == con_edge_nodes[1]);
            if (hasCommonNode || !isEdgeIntersecting(cur_con_edge_coords, newDiagonal_coords))
            {
                newEdgeList.push([newDiagonal_nodes[0], newDiagonal_nodes[1]]);
            }

        } //is convex

    } //loop over intersections
}

function checkCDT()
{
    const t0 = performance.now();

    var triangles = globalMeshData.tri;
    var verts = globalMeshData.scaled_vert;
    var adjacency = globalMeshData.adj;
    var con_edges = globalMeshData.con_edge;

    buildVertexConnectivity(globalMeshData);
    var vert2tri = globalMeshData.vert_to_tri;

    for (let iedge = 0; iedge < con_edges.length; iedge++)
    {
        const edge_v0_ind = con_edges[iedge][0];
        const edge_v1_ind = con_edges[iedge][1];

        const tri_around_v0 = vert2tri[edge_v0_ind];

        let edge_in_triangulation = false;

        for (let itri = 0; itri < tri_around_v0.length; itri++)
        {
            const cur_tri = triangles[tri_around_v0[itri]];
            const v0_node = cur_tri.indexOf(edge_v0_ind);
            const v0p1_node = (v0_node+1) % 3;
            const v0p2_node = (v0_node+2) % 3;

            if ( edge_v1_ind == cur_tri[v0p1_node] || edge_v1_ind == cur_tri[v0p2_node] )
            {
                //constrained edge is an edge of the current tri
                edge_in_triangulation = true;
                break;
            }
        }

        if (!edge_in_triangulation)
            throw "Edge " + iedge + " is not in the triangulation!"
    }

    for (let itri = 0; itri < triangles.length; itri++)
    {
        const cur_tri = triangles[itri];
        const tri_verts = [verts[cur_tri[0]], verts[cur_tri[1]], verts[cur_tri[2]]];

        const ccenter = getCircumcenter(tri_verts[0], tri_verts[1], tri_verts[2]);
        const rsq = ccenter.sqDistanceTo(tri_verts[0]);

        for (let indv = 0; indv < verts.length; indv++)
        {
            if (indv == cur_tri[0] || indv == cur_tri[1] || indv == cur_tri[2])
                continue;

            if (ccenter.sqDistanceTo(verts[indv]) > rsq)
                continue; //skip points outside circumcircle

            let is_vert_blocked = false; //true if any node of triangle can't see vertex indv

            for (let edge_t = 0; edge_t < 3; edge_t++)
            {
                const tri_edge_node0 = cur_tri[(edge_t + 1) % 3];
                const tri_edge_node1 = cur_tri[(edge_t + 2) % 3];
                const tri_edge_verts = [ tri_verts[(edge_t + 1) % 3], tri_verts[(edge_t + 2) % 3] ];

                if (getPointOrientation(tri_edge_verts, verts[indv]) >= 0)
                    continue; //skip edge if vertex if on left (triangle edges go anticlockwise)

                const edge0_to_vert = [tri_edge_verts[0], verts[indv]];
                const edge1_to_vert = [tri_edge_verts[1], verts[indv]];

                let is_blocked_by_con_edge = false;
                for (let edge_c = 0; edge_c < con_edges.length; edge_c++)
                {
                    if ( isSameEdge(con_edges[edge_c], [tri_edge_node0, tri_edge_node1]) )
                    {
                        is_blocked_by_con_edge = true;
                        break;
                    }

                    const con_edge_verts = [verts[con_edges[edge_c][0]], verts[con_edges[edge_c][1]]];

                    const edge0_invisible_to_vert = isEdgeIntersecting(edge0_to_vert, con_edge_verts) &&
                        !isEdgeIntersectingAtEndpoint(edge0_to_vert, con_edge_verts);

                    const edge1_invisible_to_vert = isEdgeIntersecting(edge1_to_vert, con_edge_verts) &&
                        !isEdgeIntersectingAtEndpoint(edge1_to_vert, con_edge_verts);

                    if ( (con_edges[edge_c][0] != tri_edge_node0) && (con_edges[edge_c][1] != tri_edge_node0) &&
                        (con_edges[edge_c][0] != tri_edge_node1) && (con_edges[edge_c][1] != tri_edge_node1) )
                    {
                        if (edge0_invisible_to_vert || edge1_invisible_to_vert)
                        {
                            is_blocked_by_con_edge = true;
                            //console.log("tri" + itri + ", edge" + edge_t + ": vert" + indv + " blocked by conedge(a)" + edge_c);
                            break;
                        }
                    }

                    //If con_edge is connected to tri_edge_node0, then check if tri_edge_node1 can see the vertex indv
                    if ( (con_edges[edge_c][0] == tri_edge_node0 || con_edges[edge_c][1] == tri_edge_node0)
                        && edge1_invisible_to_vert )
                    {
                        is_blocked_by_con_edge = true;
                        //console.log("tri" + itri + ", edge" + edge_t + ": vert" + indv + " blocked by conedge(b)" + edge_c);
                        break;
                    }

                    //If con_edge is connected to tri_edge_node1, then check if tri_edge_node0 can see the vertex indv
                    if ( (con_edges[edge_c][0] == tri_edge_node1 || con_edges[edge_c][1] == tri_edge_node1)
                        && edge0_invisible_to_vert )
                    {
                        is_blocked_by_con_edge = true;
                        //console.log("tri" + itri + ", edge" + edge_t + ": vert" + indv + " blocked by conedge(c)" + edge_c);
                        break;
                    }

                } //loop over con edges

                if (is_blocked_by_con_edge) //one of the nodes of this edge can't see vertex i
                {
                    is_vert_blocked = true;
                    continue;
                }

            } //loop over triangle edges

            if (!is_vert_blocked && !isDelaunay2(tri_verts, verts[indv]))
                console.log("Triangle " + itri + " and vertex " + indv + " are not Delaunay!");

        } //loop over verts
    } //loop over triangles

    var t1 = performance.now();
    console.log("CDT check completed in " + (t1 - t0).toFixed(2) + " ms.");
}

function randn(mean, stddev)
{
    if (is_rand_spare_ready)
    {
        is_rand_spare_ready = false;
        return (mean + rand_spare*stddev);
    }
    else
    {
        let u, v, s;
        do {
            u = Math.random() * 2 - 1;
            v = Math.random() * 2 - 1;
            s = u*u + v*v;
        } while (s >= 1 || s == 0);
        const mul = Math.sqrt(-2.0 * Math.log(s) / s);
        rand_spare = v*mul;
        is_rand_spare_ready = true;
        return (mean + stddev*u*mul);
    }
}

function benchmark()
{
    const nrepeat = 50;
    const ncase = 1; //50;
    const nwarmup = 5;

    let t_bench = 0;
    let n = 0;
    for (let i = 0; i < ncase; i++)
    {
        //Clear mesh data
        globalMeshData.vert = [];
        globalMeshData.scaled_vert = [];
        globalMeshData.bin = [];
        globalMeshData.tri = [];
        globalMeshData.adj = [];
        globalMeshData.con_edge = [];
        globalMeshData.vert_to_tri = [];

        genRandVertices();
        genRandEdges();

        let t_avg = 0;
        for (let j = 0; j < nrepeat + nwarmup; j++)
        {
            const tb0 = performance.now();
            delaunay(globalMeshData);
            constrainEdges(globalMeshData);
            const dt = performance.now() - tb0;

            console.log("Delaunay triangulation in " + dt.toFixed(2) + " ms.");
            if (j >= nwarmup)
                t_avg += dt;
        }
        t_avg /= nrepeat;
        console.log("Avg time: " + t_avg.toFixed(2) + " ms.");

        t_bench += t_avg;
    }

    t_bench /= ncase;
    console.log("Avg bench time: " + t_bench);


}