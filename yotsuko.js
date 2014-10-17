
define(function(){
var Calculator = function(){};
var C = Calculator.prototype;
C.process = function(img, w, h){
    var data = this.extractData(img, w, h);
    var coords = this.getCoords(data);
    return this.createBoxes(coords);
};
C.extractData = function(img, w, h){
    if (img instanceof Image){
        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        w = img.width;
        h = img.height;
        img = ctx;
    }
    return img.getImageData(0, 0, w, h);
};
function horizontal(col, row, w, h, match){
    if (col>=w || row>=h)
        return [];
    var offset = w*row;
    var next_row = w*(row+1);
    var points = [];
    for (var idx=col; idx<w; ++idx){
        if (!match(offset+idx))
            break; // line finished
        if (match(next_row+idx))
            points.push([idx, row]);
    }
    return points;
}
function vertical(col, row, w, h, match){
    if (col>=w || row>=h)
        return [];
    var points = [];
    for (var idx=row; idx<h; ++idx){
        var cur = idx*w+col;
        if (!match(cur))
            break; // column finished
        if (match(cur+1) || !match(cur+w))
            points.push([col, idx]);
    }
    return points;
}
C.getCoords = function(data){
    var components = 4;
    var d = data.data;
    var w = data.width, h = data.height, t = w*h;
    function match(offset){
        if (offset>=t)
            return false;
        offset *= components;
        for (var i=0; i<components; ++i)
            if (d[i] != d[offset+i])
                return false;
        return true;
    }
    var fpoints = {};
    function filter(points){
        var arr = [];
        points.forEach(function(p){
            var sp = fpoints[p[0]] = fpoints[p[0]]||{};
            if (p[1] in sp)
                return;
            sp[p[1]] = true;
            arr.push(p);
        });
        return arr;
    }
    var hpoints = [];
    var points = [];
    var vpoints = horizontal(0, 0, w, h, match);
    while (vpoints.length || hpoints.length){
        var vpoint = vpoints.shift();
        var hpoint = hpoints.shift();
        if (vpoint){
            points.push(vpoint);
            hpoints.push.apply(hpoints, filter(vertical(
                vpoint[0], vpoint[1]+1, w, h, match)));
        }
        if (hpoint){
            points.push(hpoint);
            vpoints.push.apply(vpoints, filter(horizontal(
                hpoint[0]+1, hpoint[1], w, h, match)));
        }
    }
    return points;
};
function s(x, y){
    return x - y; }
function sorter(c1, c2, p1, p2){
    return s(p1[c1], p2[c1]) || s(p1[c2], p2[c2]); }
function next_point(arr, c, point){
    if (!point)
        return;
    var ix = arr.indexOf(point);
    if (ix>=0 && ix<arr.length-1){
        var next = arr[ix+1];
        if (next[c] == point[c])
            return next;
    }
}
function box(nx, ny, p){
    for (var ix = nx(p); ix; ix = nx(ix)){
        for (var iy = ny(p); iy; iy = ny(iy)){
            var lastx = ix;
            while((lastx = ny(lastx))){
                var lasty = iy;
                while((lasty = nx(lasty))){
                    if (lastx == lasty)
                        return [p, ix, iy, lastx];
                }
            }
        }
    }
    return [];
}
C.createBoxes = function(coords){
    var sx = coords.slice(0), sy = coords.slice(0);
    sx.sort(sorter.bind(null, 0, 1));
    sy.sort(sorter.bind(null, 1, 0));
    var nx = next_point.bind(null, sx, 0);
    var ny = next_point.bind(null, sy, 1);
    var boxes = sx.map(box.bind(null, nx, ny)
        ).filter(function(b){ return !!b.length; });
    // Can be done by switching map arguments
    boxes.sort(function(b1, b2){
        return s(b1[0][1], b2[0][1]) ||
            s(b1[0][0], b2[0][0]); });
    return boxes;
};

return new Calculator();
});
