/**
 * @license Vector3 v0.0.6 8/16/2025
 * https://github.com/rawify/Vector3.js
 *
 * Copyright (c) 2025, Robert Eisele (https://raw.org/)
 * Licensed under the MIT license.
 **/

function newVector3(x, y, z) {
  // Single hidden class: Object.create with preset prototype
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
    const ax = this['x'], ay = this['y'], az = this['z'];
    const vx = v['x'], vy = v['y'], vz = v['z'];
    return newVector3(
      ay * vz - az * vy,
      az * vx - ax * vz,
      ax * vy - ay * vx
    );
  },
  /**
    * @see https://raw.org/book/linear-algebra/dot-product/
    */
  'projectTo': function (a) { // Orthogonal projection of this onto a
    const ax = a['x'], ay = a['y'], az = a['z'];
    const pct = (this['x'] * ax + this['y'] * ay + this['z'] * az) / (ax * ax + ay * ay + az * az);
    return newVector3(ax * pct, ay * pct, az * pct);
  },
  /**
   * @see https://raw.org/book/linear-algebra/dot-product/
   */
  'rejectFrom': function (b) { // Orthogonal rejection of this from b
    // this - proj_b(this)
    const ax = b['x'], ay = b['y'], az = b['z'];
    const t = (this['x'] * ax + this['y'] * ay + this['z'] * az) / (ax * ax + ay * ay + az * az);
    return newVector3(this['x'] - ax * t, this['y'] - ay * t, this['z'] - az * t);
  },
  /**
   * @see https://raw.org/book/linear-algebra/dot-product/
   */
  'reflect': function (b) { // Reflect this across b
    const ax = b['x'], ay = b['y'], az = b['z'];
    const t = (this['x'] * ax + this['y'] * ay + this['z'] * az) / (ax * ax + ay * ay + az * az);
    const px = ax * t, py = ay * t, pz = az * t;
    return newVector3(2 * px - this['x'], 2 * py - this['y'], 2 * pz - this['z']);
  },
  /**
   * @see https://raw.org/book/linear-algebra/dot-product/
   */
  'refract': function (normal, eta) { // Unit this across unit normal n; η = η_in / η_out
    const dot = this['x'] * normal['x'] + this['y'] * normal['y'] + this['z'] * normal['z'];
    const k = 1 - eta * eta * (1 - dot * dot); // = cos^2 θ_t
    if (k < 0) return null; // total internal reflection
    const t = eta * dot + Math.sqrt(k);
    return newVector3(
      eta * this['x'] - t * normal['x'],
      eta * this['y'] - t * normal['y'],
      eta * this['z'] - t * normal['z']);
  },
  'scaleAlongAxis': function (axis, s) {
    // Decompose this into parallel + perpendicular, then scale the parallel component
    const ax = axis['x'], ay = axis['y'], az = axis['z'];
    const denom = ax * ax + ay * ay + az * az;
    const t = (this['x'] * ax + this['y'] * ay + this['z'] * az) / denom;
    const px = ax * t, py = ay * t, pz = az * t;
    // (this - p) + s * p
    return newVector3(this['x'] - px + s * px, this['y'] - py + s * py, this['z'] - pz + s * pz);
  },
  'norm': function () {
    const ax = this['x'], ay = this['y'], az = this['z'];
    return Math.sqrt(ax * ax + ay * ay + az * az);
  },
  'norm2': function () {
    const ax = this['x'], ay = this['y'], az = this['z'];
    return ax * ax + ay * ay + az * az;
  },
  'normalize': function () {
    const ax = this['x'], ay = this['y'], az = this['z'];
    const l2 = ax * ax + ay * ay + az * az;
    if (l2 === 0 || l2 === 1) return this; // unit or zero: return self to avoid alloc
    const inv = 1 / Math.sqrt(l2);
    return newVector3(ax * inv, ay * inv, az * inv);
  },
  'distance': function (v) {
    const dx = this['x'] - v['x'], dy = this['y'] - v['y'], dz = this['z'] - v['z'];
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  },
  'set': function (v) {
    this['x'] = v['x'];
    this['y'] = v['y'];
    this['z'] = v['z'];
  },
  'rotateX': function (angle) {
    const cos = Math.cos(angle), sin = Math.sin(angle);
    const y = this['y'] * cos - this['z'] * sin;
    const z = this['z'] * cos + this['y'] * sin;
    return newVector3(this['x'], y, z);
  },
  'rotateY': function (angle) {
    const cos = Math.cos(angle), sin = Math.sin(angle);
    const x = this['x'] * cos + this['z'] * sin;
    const z = this['z'] * cos - this['x'] * sin;
    return newVector3(x, this['y'], z);
  },
  'rotateZ': function (angle) {
    const cos = Math.cos(angle), sin = Math.sin(angle);
    const x = this['x'] * cos - this['y'] * sin;
    const y = this['y'] * cos + this['x'] * sin;
    return newVector3(x, y, this['z']);
  },
  /**
   * Apply a 3x3 or 4x4 (row-major) matrix.
   * 
   * @param {Array} M The transformation matrix to be applied
   * @returns 
   */
  'applyMatrix': function (M) {
    M = M['M'] || M;
    const ax = this['x'], ay = this['y'], az = this['z'];
    // No normalization is applied for homogeneous coordinates, since we only work with Affine Transformations (no Perspective Transformations)
    return newVector3(
      ax * M[0][0] + ay * M[0][1] + az * M[0][2] + (M[0][3] || 0),
      ax * M[1][0] + ay * M[1][1] + az * M[1][2] + (M[1][3] || 0),
      ax * M[2][0] + ay * M[2][1] + az * M[2][2] + (M[2][3] || 0));
  },
  'apply': function (fn, v = { 'x': 0, 'y': 0, 'z': 0 }) { // Math.abs, Math.min, Math.max
    return newVector3(fn(this['x'], v['x']), fn(this['y'], v['y']), fn(this['z'], v['z']));
  },
  'toArray': function () {
    return [this['x'], this['y'], this['z']];
  },
  'clone': function () {
    return newVector3(this['x'], this['y'], this['z']);
  },
  'equals': function (vector) {
    return this === vector || (
      Math.abs(this['x'] - vector['x']) < EPS &&
      Math.abs(this['y'] - vector['y']) < EPS &&
      Math.abs(this['z'] - vector['z']) < EPS);
  },
  'isUnit': function () {
    return Math.abs(
      this['x'] * this['x'] +
      this['y'] * this['y'] +
      this['z'] * this['z'] - 1) < EPS;
  },
  'lerp': function (v, t) {
    const ax = this['x'], ay = this['y'], az = this['z'];
    return newVector3(
      ax + t * (v['x'] - ax),
      ay + t * (v['y'] - ay),
      az + t * (v['z'] - az));
  },
  'toString': function () {
    return "(" + this['x'] + ", " + this['y'] + ", " + this['z'] + ")";
  },

  // -------- In-place ops (mutating, suffix `$`) --------
  // Useful to avoid allocations in tight loops.

  'add$': function (v) { this['x'] += v['x']; this['y'] += v['y']; this['z'] += v['z']; return this; },
  'sub$': function (v) { this['x'] -= v['x']; this['y'] -= v['y']; this['z'] -= v['z']; return this; },
  'neg$': function () { this['x'] = -this['x']; this['y'] = -this['y']; this['z'] = -this['z']; return this; },
  'scale$': function (s) { this['x'] *= s; this['y'] *= s; this['z'] *= s; return this; },
  'prod$': function (v) { this['x'] *= v['x']; this['y'] *= v['y']; this['z'] *= v['z']; return this; },
  'normalize$': function () {
    const l2 = this['x'] * this['x'] + this['y'] * this['y'] + this['z'] * this['z'];
    if (l2 === 0 || l2 === 1) return this;
    const inv = 1 / Math.sqrt(l2);
    this['x'] *= inv; this['y'] *= inv; this['z'] *= inv;
    return this;
  }
};

Vector3['random'] = function () {
  return newVector3(Math.random(), Math.random(), Math.random());
};

Vector3['fromPoints'] = function (a, b) {
  return newVector3(b['x'] - a['x'], b['y'] - a['y'], b['z'] - a['z']);
};

Vector3['fromBarycentric'] = function (A, B, C, u, v) {
  const x = A['x'], y = A['y'], z = A['z'];
  return newVector3(
    x + (B['x'] - x) * u + (C['x'] - x) * v,
    y + (B['y'] - y) * u + (C['y'] - y) * v,
    z + (B['z'] - z) * u + (C['z'] - z) * v);
}
