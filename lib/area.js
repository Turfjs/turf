//http://www.mathopenref.com/coordpolygonarea2.html

var _ = require('lodash')

module.exports = function(feature, done){
  //transform geometries into x & y arrays
  //foreach ring, add the area to an accumulating area sum


}


function polygonArea(X, Y, numPoints) 
{ 
  area = 0;         // Accumulates area in the loop
  j = numPoints-1;  // The last vertex is the 'previous' one to the first

  for (i=0; i<numPoints; i++)
    { area = area +  (X[j]+X[i]) * (Y[j]-Y[i]); 
      j = i;  //j is previous vertex to i
    }
  return area/2;
}