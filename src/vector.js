"use strict";

/**
 * @module exports a library for vector Calculations
 */
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

/**
 * @function rotate
 * Scales a vector
 * @param {Vector} a - the vector to scale
 * @param {float} scale - the scalar to multiply the vector by
 * @returns a new vector representing the scaled original
 */
function scale(a, scale) {
 return {x: a.x * scale, y: a.y * scale};
}

/**
 * Find the roatation of a vector to an angle
 *
 * @param {a} Vector a
 * @param {angle} An angle to rotate about
 * @return The rotated vector
 */
function rotate(a, angle)
{
  return{
        x: a.x * Math.cos(angle) - a.y * Math.sin(angle),
        y: a.x * Math.sin(angle) + a.y * Math.cos(angle)
        }
}

/**
 * Calculates the dot product of two vectors
 *
 * @param {a} Vector a
 * @param {b} Vector b
 * @return The result of the dot product
 */
function dotProduct(a,b)
{
  return a.x * b.x + a.y * b.y
}

/**
 * Calculates the magnitude of a vector
 *
 * @param {a} Vector a
 * @return The magnitude of vector a
 */
function magnitude(a)
{
  return Math.sqrt(a.x * a.x + a.y * a.y);
}

/**
 * Calculates the normal of a vector
 *
 * @param {a} Vector a
 * @return The normalized vector of a
 */
function normalize(a)
{
  var mag = magnitude(a);
  return {x: a.x / mag, y: a.y / mag};
}

/**
 * Subtract two vectors
 *
 * @param {a} Vector a
 * @param {b} Vector b
 * @returns Vector result from vector subtraction
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
 * @param {a} Vector a
 * @returns Vector perpendicular to a
 */
function perpendicular(a) {
    return {
        x: -a.y,
        y: a.x
    }
}

/**
 * Finds an axis
 *
 * @param {shape} An array of points defining the shape
 * @returns An axes array
 */
function findAxes(shape) {
    var axes = [];
    shape.forEach(function(p1, i) {
        // find the ajacent vertex
        var p2 = (shape.length == i + 1) ? 0 : shape[i];
        var edge = subtract(p2, p1);
        var perp = perpendicular(edge);
        var normal = normalize(perp);
        axes.push(normal);
    });
    return axes;
}

/**
 * Finds the projection of a shape onto an axis
 *
 * @param {shape} An array of points defining the shape
 * @param {axes} The axis of intercection
 * @returns
 */
function project(shape, axes) {
    var min = dotProduct(shape[0], axes);
    var max = min;
    for(var i = 1; i < shape.length; i++) {
        var p = dotProduct(shape[i], axes);
        if(p < min) min = p;
        else if(p > max) max = p;
    }
    return {min: min, max: max};
}
