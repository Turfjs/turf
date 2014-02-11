var Canvas = require('canvas'),
    fs = require('fs'),
    ss = require('../');

var ans = JSON.parse(fs.readFileSync('../data/anscombe_quartet.json'));

var c = new Canvas(640, 280);
var ctx = c.getContext('2d');

ctx.fillStyle = '#fff';
ctx.fillRect(0, 0, 640, 280);
ctx.fillStyle = '#000';

function s(x) {
    return x * 8;
}

ctx.fillStyle = '#111';
ctx.strokeStyle = '#888';

for (var quart = 0; quart < ans.length; quart++) {
    ctx.fillRect((quart * 160), 160, 160, 1);
    ctx.fillRect((quart * 160), 0, 1, 280);
    var lin = ss.linear_regression().data(ans[quart]).line();
    for (var pt = 0; pt < ans[quart].length; pt++) {
        ctx.beginPath();
        ctx.moveTo((quart * 160),  ~~s(lin(0)));
        ctx.lineTo(((1 + quart) * 160), ~~s(lin(20)));
        ctx.closePath();
        ctx.stroke();
        ctx.fillRect((quart * 160) + ~~s(ans[quart][pt][0]), ~~s(ans[quart][pt][1]), 3, 3);
    }
}

fs.writeFileSync('anscombe.png', c.toBuffer());
