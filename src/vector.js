module.exports = exports = {
  rotate: rotate,
  dotProduct: dotProduct,
  magnitude: magnitude,
  normalize: normalize,
  subtract: subtract,
  perpendicular: perpendicular,
  findAxes: findAxes,
  project: project
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

/**
 * Subtract two vectors
 * 
 * @param {Vector} a, the first vector
 * @param {Vector} b, the second vector
 * @returns Vector
 */
function subtract(a, b) {
    return {
        x: a.x - b.x,
        y: a.y - b.y
    }
}

/**
 * Find a perpendicular vector
 * 
 * @param {Vector} a
 * @returns Vector perpendicular to a
 */
function perpendicular(a) {
    return {
        x: -a.y,
        y: a.x
    }
}

/**
 * 
 * 
 * @param {any} shape
 * @returns
 */
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

/**
 * 
 * 
 * @param {any} shape
 * @param {any} axis
 * @returns
 */
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
