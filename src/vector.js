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
