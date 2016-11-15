module.exports = exports = {
  rotate: rotate,
  dotProduct: dotProduct,
  magnitude: magnitude,
  normalize: normalize
}


function rotate(a, angle)
{
  return{
        x: a.x * Math.cos(angle) - a.y * Math.sin(angle),
        y: a.x * Math.sin(angle) + a.y * Math.cos(angle)
        }
}


function dotProduct(a,b)
{
  return a.x * b.x + a.y * b.y
}

function magnitude(a)
{
  return Math.sqrt(a.x * a.x + a.y * a.y);
}

function normalize(a)
{
  var mag = magnitude(a);
  return {x: a.x / mag, y: a.y / mag};
}

function subtract(p1, p2) {

}

function perpendicular(edge) {

}

function findAxes(shape) {
    var axes = [];
    shape.forEach(function(p1, i) {
        // find the ajacent vertex
        var p2 = (shape.length == i + 1) ? 0 : shape[i];
        var edge = subtract(p2, p1);
        var perp = perpendicular(edge);
        var normal = normalize(prep);
        axes.push(normal);
    });
    return axes;
}

function project(shape, axis) {
    var min = dotProduct(shape[0], axis.x);
    var max = min;
    for(var i = 1; i < shape.length; i++) {
        var p = dotProduct(shape[i], axis);
        if(p < min) min = p;
        else if(p > max) max = p;
    }
    return {min: min, max: max};
}