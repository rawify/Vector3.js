# Vector3.js

[![NPM Package](https://img.shields.io/npm/v/@rawify/vector3.svg?style=flat)](https://www.npmjs.com/package/@rawify/vector3 "View this project on npm")
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

Vector3.js is a 3D vector library for JavaScript, providing a variety of vector operations used in 3D graphics, physics simulations, and geometric computations.

## Features

- Basic vector operations: addition, subtraction, scaling, negation
- Geometric functions: dot product, cross product, projection
- Utility functions: normalization, magnitude, distance, linear interpolation (lerp)
- Matrix transformations and function applications on vectors
- Support for creating vectors from arrays or objects

## Installation

You can install `Vector3.js` via npm:

```bash
npm install @rawify/vector3
```

Or with yarn:

```bash
yarn add @rawify/vector3
```

Alternatively, download or clone the repository:

```bash
git clone https://github.com/rawify/Vector3.js
```

## Usage

Include the `vector3.min.js` file in your project:

```html
<script src="path/to/vector3.min.js"></script>
```

Or in a Node.js project:

```javascript
const Vector3 = require('@rawify/vector3');
```

or 

```javascript
import Vector3 from '@rawify/vector3';
```


### Creating a Vector

Vectors can be created using `new Vector3` or the `Vector3` function:

```javascript
let v1 = Vector3(1, 2, 3);
let v2 = new Vector3(4, 5, 6);
```

You can also initialize vectors from arrays or objects:

```javascript
let v3 = new Vector3([1, 2, 3]);
let v4 = new Vector3({ x: 4, y: 5, z: 6 });
```

## Methods

### `add(v)`

Adds the vector `v` to the current vector.

```javascript
let v1 = new Vector3(1, 2, 3);
let v2 = new Vector3(4, 5, 6);
let result = v1.add(v2); // {x: 5, y: 7, z: 9}
```

### `sub(v)`

Subtracts the vector `v` from the current vector.

```javascript
let result = v1.sub(v2); // {x: -3, y: -3, z: -3}
```

### `neg()`

Negates the current vector (flips the direction).

```javascript
let result = v1.neg(); // {x: -1, y: -2, z: -3}
```

### `scale(s)`

Scales the current vector by a scalar `s`.

```javascript
let result = v1.scale(2); // {x: 2, y: 4, z: 6}
```

### `prod(v)`

Calculates the Hadamard (element-wise) product of the current vector and `v`.

```javascript
let result = v1.prod(v2); // {x: 4, y: 10, z: 18}
```

### `dot(v)`

Computes the [dot product](https://raw.org/book/linear-algebra/dot-product/) between the current vector and `v`.

```javascript
let result = v1.dot(v2); // 32
```

### `cross(v)`

Calculates the [3D cross product](https://raw.org/book/linear-algebra/3d-cross-product/) between the current vector and `v`.

```javascript
let result = v1.cross(v2); // {x: -3, y: 6, z: -3}
```

### `projectTo(v)`

Projects the current vector onto the vector `v` using [vector projection](https://raw.org/book/linear-algebra/dot-product/).

```javascript
let result = v1.projectTo(v2); // Projection of v1 onto v2
```

### `rejectFrom(v)`

Finds the orthogonal [vector rejection](https://raw.org/book/linear-algebra/dot-product/#reject) of the current vector from the vector `v`.

### `reflect(v)`

Determines the [vector reflection](https://raw.org/book/linear-algebra/dot-product/#reflect) of the current vector across the vector `n`.

### `refract(n, eta)`

Determines the [vector refraction](https://raw.org/book/linear-algebra/dot-product/#refract) of the current **unit vector** across a surface with **unit normal** `n`, using the index ratio `eta = η_in / η_out` (like from air η_in=1.0 to water η_out=1.33).

```javascript
let n = new Vector3(0, 1, 0);       // Surface normal pointing up
let eta = 1.0 / 1.33;             // Air to glass
let result = v1.refract(n, eta); // Refraction of v1 across n
```

Returns a new unit vector representing the **refracted direction**, or `null` if **total internal reflection** occurs.

### `norm()`

Returns the magnitude or length (Euclidean norm) of the current vector.

```javascript
let result = v1.norm(); // 3.741
```

### `norm2()`

Returns the squared magnitude or length (norm squared) of the current vector.

```javascript
let result = v1.norm2(); // 14
```

### `normalize()`

Returns a normalized vector (unit vector) of the current vector.

```javascript
let result = v1.normalize(); // {x: 0.267, y: 0.534, z: 0.801}
```

### `distance(v)`

Calculates the Euclidean distance between the current vector and `v`.

```javascript
let result = v1.distance(v2); // 5.196
```

### `set(v)`

Sets the values of the current vector to match the vector `v`.

```javascript
v1.set(v2); // v1 is now {x: 4, y: 5, z: 6}
```

### `rotateX(angle)`

Rotates the vector around the **X-axis** by the given angle (in radians):

```javascript
let v = new Vector3(1, 2, 3);
v.rotateX(Math.PI / 2); // Rotates v 90° around the X-axis
```

### `rotateY(angle)`

Rotates the vector around the **Y-axis** by the given angle (in radians):

```javascript
let v = new Vector3(1, 2, 3);
v.rotateY(Math.PI / 2); // Rotates v 90° around the Y-axis
```

### `rotateZ(angle)`

Rotates the vector around the **Z-axis** by the given angle (in radians):

```javascript
let v = new Vector3(1, 2, 3);
v.rotateZ(Math.PI / 2); // Rotates v 90° around the Z-axis
```

### `applyMatrix(M)`

Applies a transformation matrix `M` to the current vector.

```javascript
let matrix = [
  [1, 0, 0, 0],
  [0, 1, 0, 0],
  [0, 0, 1, 0]
];
let result = v1.applyMatrix(matrix); // Applies matrix transformation
```

If you need to make more CSS related matrix transforms, have a look at [UnifiedTransform.js](https://github.com/rawify/UnifiedTransform.js).

### `apply(fn, v)`

Applies a function `fn` (such as `Math.abs`, `Math.min`, `Math.max`) to the components of the current vector and an optional vector `v`.

```javascript
let result1 = v1.apply(Math.min, v2); // Determines the minimum of v1 and v2 on each component
let result2 = v1.apply(Math.max, v2); // Determines the maximum of v1 and v2 on each component
let result3 = v1.apply(Math.round); // Rounds the components of the vector
let result4 = v1.apply(Math.floor); // Floors the components of the vector
let result4 = v1.apply(x => Math.min(upper, Math.max(lower, x))); // Clamps the component to the interval [lower, upper]
```

### `toArray()`

Returns the current vector as an array `[x, y, z]`.

```javascript
let result = v1.toArray(); // [1, 2, 3]
```

### `clone()`

Returns a clone of the current vector.

```javascript
let result = v1.clone(); // A new vector with the same x, y, and z values as v1
```

### `equals(v)`

Checks if the current vector is equal to the vector `v`.

```javascript
let result = v1.equals(v2); // false
```

### `isUnit()`

Determines if the current vector is a normalized unit vector.

### `lerp(v, t)`

Performs a linear interpolation between the current vector and `v` by the factor `t`.

```javascript
let result = v1.lerp(v2, 0.5); // {x: 2.5, y: 3.5, z: 4.5}
```

### `toString()`

Gets a string representation of the current vector.

## Static Methods

### `Vector3.random()`

Generates a vector with random x, y, and z values between 0 and 1.

```javascript
let randomVector = Vector3.random(); // {x: 0.67, y: 0.45, z: 0.12}
```

### `Vector3.fromPoints(a, b)`

Creates a vector from two points `a` and `b`.

```javascript
let result = Vector3.fromPoints({x: 1, y: 1, z: 1}, {x: 4, y: 5, z: 6}); // {x: 3, y: 4, z: 5}
```

### `Vector3.fromBarycentric(A, B, C, u, v)`

Given a triangle (A, B, C) and a barycentric coordinate (u, v[, w = 1 - u - v]) calculate the cartesian coordinate in R^3.

## Coding Style

Like all my libraries, Vector3.js is written to minimize size after compression with Google Closure Compiler in advanced mode. The code style is optimized to maximize compressibility. If you extend the library, please preserve this style.

## Building the library

After cloning the Git repository run:

```
npm install
npm run build
```

## Run a test

Testing the source against the shipped test suite is as easy as

```
npm run test
```

## Copyright and Licensing

Copyright (c) 2025, [Robert Eisele](https://raw.org/)
Licensed under the MIT license.
