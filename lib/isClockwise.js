module.exports = function(ring){
  var sum = 0;
  var i = -1;
  var len = ring.length;
  var prev,cur;
  while(i++<len){
    prev = cur||ring[0];
    cur = ring[i];
    //console.log(ring[i])
//console.log(';;;;;')
    console.log(((cur[0]-prev[0])*(cur[1]+prev[1])))
    sum += ((cur[0]-prev[0])*(cur[1]+prev[1]));
  }
  console.log(';;;;;')
  console.log(sum)
  return sum > 0;
}