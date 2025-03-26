/**
 * @license Vector3 v0.0.2 3/26/2025
 * https://github.com/rawify/Vector3.js
 *
 * Copyright (c) 2025, Robert Eisele (https://raw.org/)
 * Licensed under the MIT license.
 **/

function newVector3(x, y, z) {
  const o = Object.create(Vector3.prototype);
  o['x'] = x;
  o['y'] = y;
  o['z'] = z;
  return o;
}

const EPS = 1e-13;

/**
@constructor
*/
function Vector3(x, y, z) {

  let o = this instanceof Vector3 ? this : Object.create(Vector3.prototype);

  if (typeof x === "object") {
    if (x instanceof Array) {
      o['x'] = x[0];
      o['y'] = x[1];
      o['z'] = x[2];
    } else {
      o['x'] = x['x'];
      o['y'] = x['y'];
      o['z'] = x['z'];
    }
  } else if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
    o['x'] = x;
    o['y'] = y;
    o['z'] = z;
  }
  return o;
}

Vector3.prototype = {
  'x': 0,
  'y': 0,
  'z': 0,
  'add': function (v) {
    return newVector3(
      this['x'] + v['x'],
      this['y'] + v['y'],
      this['z'] + v['z']);
  },
  'sub': function (v) {
    return newVector3(
      this['x'] - v['x'],
      this['y'] - v['y'],
      this['z'] - v['z']);
  },
  'neg': function () {
    return newVector3(
      -this['x'],
      -this['y'],
      -this['z']);
  },
  'scale': function (scalar) {
    return newVector3(
      this['x'] * scalar,
      this['y'] * scalar,
      this['z'] * scalar);
  },
  'prod': function (v) { // Hadamard product or Schur product
    return newVector3(this['x'] * v['x'], this['y'] * v['y'], this['z'] * v['z']);
  },
  'dot': function (v) {
    return this['x'] * v['x'] + this['y'] * v['y'] + this['z'] * v['z'];
  },
  'cross': function (v) {
    return newVector3(
      this['y'] * v['z'] - this['z'] * v['y'],
      this['z'] * v['x'] - this['x'] * v['z'],
      this['x'] * v['y'] - this['y'] * v['x']
    );
  },
  'projectTo': function (a) { // Orthogonal project this onto a

    const pct = (this['x'] * a['x'] + this['y'] * a['y'] + this['z'] * a['z']) / (a['x'] * a['x'] + a['y'] * a['y'] + a['z'] * a['z']);

    return newVector3(a['x'] * pct, a['y'] * pct, a['z'] * pct);
  },
  'rejectFrom': function (b) { // Orthogonal reject this from b

    const projection = this['projectTo'](b);
    return this['sub'](projection);
  },
  'reflect': function (b) { // Reflect this across b
    const projection = this['projectTo'](b);
    return projection['scale'](2)['sub'](this);
  },
  'scaleAlongAxis': function (axis, scale) {
    const projected = axis['scale'](this['dot'](axis) / axis['dot'](axis));
    return this['subtract'](projected)['add'](projected['scale'](scale));
  },
  'norm': function () {
    return Math.sqrt(this['x'] * this['x'] + this['y'] * this['y'] + this['z'] * this['z']);
  },
  'norm2': function () {
    return this['x'] * this['x'] + this['y'] * this['y'] + this['z'] * this['z'];
  },
  'normalize': function () {
    const l = this.norm();
    if (l === 0 || l === 1) return this;
    return newVector3(this['x'] / l, this['y'] / l, this['z'] / l);
  },
  'distance': function (v) {
    const x = this['x'] - v['x'];
    const y = this['y'] - v['y'];
    const z = this['z'] - v['z'];
    return Math.sqrt(x * x + y * y + z * z);
  },
  'set': function (v) {
    this['x'] = v['x'];
    this['y'] = v['y'];
    this['z'] = v['z'];
  },
  /**
   * Apply a transformation matrix
   * 
   * @param {Array} M The transformation matrix to be applied
   * @returns 
   */
  'applyMatrix': function (M) {
    M = M['M'] || M;
    // No normalization is applied for homogeneous coordinates, since we only work with Affine Transformations (no Perspective Transformations)
    return newVector3(
      this['x'] * M[0][0] + this['y'] * M[0][1] + this['z'] * M[0][2] + (M[0][3] || 0),
      this['x'] * M[1][0] + this['y'] * M[1][1] + this['z'] * M[1][2] + (M[1][3] || 0),
      this['x'] * M[2][0] + this['y'] * M[2][1] + this['z'] * M[2][2] + (M[2][3] || 0));
  },
  'apply': function (fn, v = { 'x': 0, 'y': 0 }) { // Math.abs, Math.min, Math.max
    return newVector3(fn(this['x'], v['x']), fn(this['y'], v['y']), fn(this['z'], v['z']));
  },
  'toArray': function () {
    return [this['x'], this['y'], this['z']];
  },
  'clone': function () {
    return newVector3(this['x'], this['y'], this['z']);
  },
  'equals': function (vector) {
    return this === vector ||
      Math.abs(this['x'] - vector['x']) < EPS &&
      Math.abs(this['y'] - vector['y']) < EPS &&
      Math.abs(this['z'] - vector['z']) < EPS;
  },
  'isUnit': function () {
    return Math.abs(
      this['x'] * this['x'] +
      this['y'] * this['y'] +
      this['z'] * this['z'] - 1) < EPS;
  },
  'lerp': function (v, t) {
    return newVector3(
      this['x'] + t * (v['x'] - this['x']),
      this['y'] + t * (v['y'] - this['y']),
      this['z'] + t * (v['z'] - this['z']));
  },
  "toString": function () {
    return "(" + this['x'] + ", " + this['y'] + ", " + this['z'] + ")";
  }
};

Vector3['random'] = function () {
  return newVector3(Math.random(), Math.random(), Math.random());
};

Vector3['fromPoints'] = function (a, b) {
  return newVector3(b['x'] - a['x'], b['y'] - a['y'], b['z'] - a['z']);
};

Vector3['fromBarycentric'] = function (A, B, C, u, v) {
  const { x, y, z } = A;

  return newVector3(
    x + (B['x'] - x) * u + (C['x'] - x) * v,
    y + (B['y'] - y) * u + (C['y'] - y) * v,
    z + (B['z'] - z) * u + (C['z'] - z) * v);
}
