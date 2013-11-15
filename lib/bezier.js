// code modded from here:
//https://github.com/leszekr/bezier-spline-js/blob/master/bezier-spline.js
var t = {}
var _ = require('lodash')
t.linestring = require('./linestring')

module.exports = function(line, resolution, intensity, done){
  var lineOut = t.linestring([])
  lineOut.properties = line.properties
  pts = []
  _.each(line.geometry.coordinates, function(pt){
    pts.push({x: pt[0], y: pt[1]})
  })

  var spline = new Spline({
    points: pts,
    duration: resolution,
    sharpness: intensity,
    //stepLength: distance_between_points_to_cache
  });
  for(var i=0; i<spline.duration; i+=10){
    var pos = spline.pos(i); //bezier(i/max,p1, c1, c2, p2);
    if(Math.floor(i/100)%2==0) lineOut.geometry.coordinates.push([pos.x, pos.y]);
    //else ctx.moveTo(pos.x, pos.y);
  }
  done(null, lineOut)
}


 /**
   * BezierSpline 
   * http://leszekr.github.com/
   *
   * @copyright
   * Copyright (C) 2012 Leszek Rybicki.
   *
   * @license
   * This file is part of BezierSpline
   * 
   * BezierSpline is free software: you can redistribute it and/or modify
   * it under the terms of the GNU Lesser General Public License as published by
   * the Free Software Foundation, either version 3 of the License, or
   * (at your option) any later version.
   * 
   * BezierSpline is distributed in the hope that it will be useful,
   * but WITHOUT ANY WARRANTY; without even the implied warranty of
   * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   * GNU General Public License for more details.
   * 
   * You should have received a copy of the GNU General Public License
   * along with BezierSpline.  If not, see <http://www.gnu.org/copyleft/lesser.html>.
   */


  /*
  Usage:

    var spline = new Spline({
      points: array_of_control_points,
      duration: time_in_miliseconds,
      sharpness: how_curvy,
      stepLength: distance_between_points_to_cache
    });

  */
  Spline = function(options){
    this.points = options.points || [];
    this.duration = options.duration || 10000;
    this.sharpness = options.sharpness || 0.85;
    this.centers = [];
    this.controls = [];
    this.stepLength = options.stepLength || 60;
    this.length = this.points.length;
    this.delay = 0;
    // this is to ensure compatibility with the 2d version
    for(var i=0; i<this.length; i++) this.points[i].z = this.points[i].z || 0;
    for(var i=0; i<this.length-1; i++){
      var p1 = this.points[i];
      var p2 = this.points[i+1];
      this.centers.push({x:(p1.x+p2.x)/2, y:(p1.y+p2.y)/2, z:(p1.z+p2.z)/2});
    }
    this.controls.push([this.points[0],this.points[0]]);
    for(var i=0; i<this.centers.length-1; i++){
      var p1 = this.centers[i];
      var p2 = this.centers[i+1];
      var dx = this.points[i+1].x-(this.centers[i].x+this.centers[i+1].x)/2;
      var dy = this.points[i+1].y-(this.centers[i].y+this.centers[i+1].y)/2;
      var dz = this.points[i+1].z-(this.centers[i].y+this.centers[i+1].z)/2;
      this.controls.push([{
        x:(1.0-this.sharpness)*this.points[i+1].x+this.sharpness*(this.centers[i].x+dx),
        y:(1.0-this.sharpness)*this.points[i+1].y+this.sharpness*(this.centers[i].y+dy),
        z:(1.0-this.sharpness)*this.points[i+1].z+this.sharpness*(this.centers[i].z+dz)},
      {
        x:(1.0-this.sharpness)*this.points[i+1].x+this.sharpness*(this.centers[i+1].x+dx),
        y:(1.0-this.sharpness)*this.points[i+1].y+this.sharpness*(this.centers[i+1].y+dy),
        z:(1.0-this.sharpness)*this.points[i+1].z+this.sharpness*(this.centers[i+1].z+dz)}]);
    }
    this.controls.push([this.points[this.length-1],this.points[this.length-1]]);
    this.steps = this.cacheSteps(this.stepLength);
    return this;
  }

  /*
    Caches an array of equidistant (more or less) points on the curve.
  */
  Spline.prototype.cacheSteps = function(mindist){
    var steps = [];
    var laststep = this.pos(0);
    steps.push(0);
    for(var t=0; t<this.duration; t+=10){
      var step = this.pos(t);
      var dist = Math.sqrt((step.x-laststep.x)*(step.x-laststep.x)+(step.y-laststep.y)*(step.y-laststep.y)+(step.z-laststep.z)*(step.z-laststep.z));
      if(dist>mindist){
        steps.push(t);
        laststep = step;
      }
    }
    return steps;
  }

  /*
    returns angle and speed in the given point in the curve
  */
  Spline.prototype.vector = function(t){
    var p1 = this.pos(t+10);
    var p2 = this.pos(t-10);
    return {
      angle:180*Math.atan2(p1.y-p2.y, p1.x-p2.x)/3.14,
      speed:Math.sqrt((p2.x-p1.x)*(p2.x-p1.x)+(p2.y-p1.y)*(p2.y-p1.y)+(p2.z-p1.z)*(p2.z-p1.z))
    }
  }

  /*
    Draws the control points
  */
  Spline.prototype.drawControlPoints = function(ctx, color){
    ctx.fillStyle = color||"#f60";
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2; 
    for(var i=0; i<this.length; i++){
      var p = this.points[i];
      var c1 = this.controls[i][0];
      var c2 = this.controls[i][1];

      ctx.beginPath();
      ctx.moveTo(c1.x,c1.y);
      ctx.lineTo(p.x,p.y);
      ctx.lineTo(c2.x,c2.y);
      ctx.stroke();
            
      ctx.beginPath();
      ctx.arc(c1.x, c1.y, 3, 0, 2 * Math.PI, false);
      ctx.fill();
      ctx.stroke();
      
      /*ctx.beginPath();
      ctx.arc(this.centers[i].x, this.centers[i].y, 5, 0, 2 * Math.PI, false);
      ctx.fill();
      ctx.stroke();*/
      
      ctx.beginPath();
      ctx.arc(c2.x, c2.y, 3, 0, 2 * Math.PI, false);
      ctx.fill();
      ctx.stroke();
      

      ctx.beginPath();
      ctx.arc(p.x, p.y, 7, 0, 2 * Math.PI, false);
      ctx.fill();
      ctx.stroke();
    }
    return this;
  }

  /*
    Gets the position of the point, given time.

    WARNING: The speed is not constant. The time it takes between control points is constant.

    For constant speed, use Spline.steps[i];
  */
  Spline.prototype.pos = function(time){

    function bezier(t, p1, c1, c2, p2){
      var B = function(t) { 
        var t2=t*t, t3=t2*t;
        return [(t3),(3*t2*(1-t)),(3*t*(1-t)*(1-t)),((1-t)*(1-t)*(1-t))]
      }
      var b = B(t)
      var pos = {
        x : p2.x * b[0] + c2.x * b[1] +c1.x * b[2] + p1.x * b[3],
        y : p2.y * b[0] + c2.y * b[1] +c1.y * b[2] + p1.y * b[3],
        z : p2.z * b[0] + c2.z * b[1] +c1.z * b[2] + p1.z * b[3]
      }
      return pos; 
    }
    var t = time-this.delay;
    if(t<0) t=0;
    if(t>this.duration) t=this.duration-1;
    //t = t-this.delay;
    var t2 = (t)/this.duration;
    if(t2>=1) return this.points[this.length-1];

    var n = Math.floor((this.points.length-1)*t2);
    var t1 = (this.length-1)*t2-n;
    return bezier(t1,this.points[n],this.controls[n][1],this.controls[n+1][0],this.points[n+1]);
  }

  /*
    Draws the line
  */
  Spline.prototype.draw = function(ctx,color){
    ctx.strokeStyle = color || "#7e5e38"; // line color
    ctx.lineWidth = 14;
    ctx.beginPath();
    var pos;
    for(var i=0; i<this.duration; i+=10){
      pos = this.pos(i); //bezier(i/max,p1, c1, c2, p2);
      if(Math.floor(i/100)%2==0) ctx.lineTo(pos.x, pos.y);
      else ctx.moveTo(pos.x, pos.y);
    }
    ctx.stroke();
    return this;
  }