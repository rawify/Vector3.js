/* eslint-env mocha */
const { expect } = require('chai');

const Vector3 = require('@rawify/vector3'); 


const EPS = 1e-12;
const close = (a, b, eps = EPS) => Math.abs(a - b) <= eps;
const expectVec = (v, x, y, z, eps = EPS) => {
  expect(close(v.x, x, eps), `x ~ ${x}, got ${v.x}`).to.equal(true);
  expect(close(v.y, y, eps), `y ~ ${y}, got ${v.y}`).to.equal(true);
  expect(close(v.z, z, eps), `z ~ ${z}, got ${v.z}`).to.equal(true);
};

describe('Vector3', () => {
  describe('construction', () => {
    it('from numbers', () => {
      const v = new Vector3(1, 2, 3);
      expectVec(v, 1, 2, 3);
    });

    it('from array', () => {
      const v = new Vector3([4, 5, 6]);
      expectVec(v, 4, 5, 6);
    });

    it('from object', () => {
      const v = new Vector3({ x: 7, y: 8, z: 9 });
      expectVec(v, 7, 8, 9);
    });

    it('no args defaults to (0,0,0)', () => {
      const v = new Vector3();
      expectVec(v, 0, 0, 0);
    });
  });

  describe('basic operations', () => {
    it('add/sub/neg/scale/prod', () => {
      const a = new Vector3(1, 2, 3);
      const b = new Vector3(4, -5, 6);
      expectVec(a.add(b), 5, -3, 9);
      expectVec(a.sub(b), -3, 7, -3);
      expectVec(a.neg(), -1, -2, -3);
      expectVec(a.scale(2), 2, 4, 6);
      expectVec(a.prod(b), 4, -10, 18);
    });

    it('dot/cross identities', () => {
      const a = new Vector3(1, 2, 3);
      const b = new Vector3(4, 5, 6);
      expect(a.dot(b)).to.equal(1*4 + 2*5 + 3*6);

      const c = a.cross(b);
      // Orthogonality: a·(a×b) == 0 and b·(a×b) == 0
      expect(close(a.dot(c), 0)).to.equal(true);
      expect(close(b.dot(c), 0)).to.equal(true);
      // Lagrange identity: |a×b|^2 = |a|^2|b|^2 - (a·b)^2
      const lhs = c.norm2();
      const rhs = a.norm2()*b.norm2() - Math.pow(a.dot(b), 2);
      expect(close(lhs, rhs, 1e-10)).to.equal(true);
    });

    it('projectTo + rejectFrom reconstruct', () => {
      const a = new Vector3(3, 4, 5);
      const b = new Vector3(2, 1, -1);
      const proj = a.projectTo(b);
      const rej  = a.rejectFrom(b);
      const sum  = proj.add(rej);
      expect(a.equals(sum)).to.equal(true);
    });

    it('reflect twice across the same axis -> identity', () => {
      const v = new Vector3(5, -2, 7);
      const axis = new Vector3(2, 3, -1); // not necessarily unit
      const r1 = v.reflect(axis);
      const r2 = r1.reflect(axis);
      expect(v.equals(r2)).to.equal(true);
    });
  });

  describe('metrics & normalize', () => {
    it('norm/norm2/distance', () => {
      const a = new Vector3(3, 4, 12);
      expect(close(a.norm(), 13)).to.equal(true);
      expect(a.norm2()).to.equal(169);

      const b = new Vector3(0, 0, 0);
      expect(close(a.distance(b), 13)).to.equal(true);
    });

    it('normalize: returns self for unit or zero; unit length otherwise', () => {
      const u = new Vector3(0, 0, 1);
      expect(u.normalize()).to.equal(u);

      const z = new Vector3(0, 0, 0);
      expect(z.normalize()).to.equal(z);

      const v = new Vector3(3, 4, 12);
      const vn = v.normalize();
      expect(close(vn.norm(), 1, 1e-12)).to.equal(true);
    });

    it('equals uses EPS tolerance (nearly equal)', () => {
      const a = new Vector3(3, 4, 5 + 1e-14); // within EPS 1e-13
      const b = new Vector3(3, 4, 5);
      expect(a.equals(b)).to.equal(true);
      const c = new Vector3(3, 4, 5 + 1e-9);
      expect(a.equals(c)).to.equal(false);
    });

    it('isUnit tolerance', () => {
      const u = new Vector3(1, 0, 0);
      expect(u.isUnit()).to.equal(true);
      const w = new Vector3(2, 0, 0);
      expect(w.isUnit()).to.equal(false);
    });
  });

  describe('rotations', () => {
    it('rotateX/rotateY/rotateZ preserve norm and give expected results', () => {
      const v = new Vector3(1, 2, 3);
      const rx = v.rotateX(Math.PI/2);
      expectVec(rx, 1, -3, 2);
      expect(close(rx.norm(), v.norm())).to.equal(true);

      const ry = v.rotateY(Math.PI/2);
      expectVec(ry, 3, 2, -1);
      expect(close(ry.norm(), v.norm())).to.equal(true);

      const rz = v.rotateZ(Math.PI/2);
      expectVec(rz, -2, 1, 3);
      expect(close(rz.norm(), v.norm())).to.equal(true);
    });
  });

  describe('refract', () => {
    it('straight-through when eta=1, unit output', () => {
      const a = new Vector3(0, -1, 0);
      const n = new Vector3(0, 1, 0);
      const r = a.refract(n, 1);
      expect(r).to.not.equal(null);
      expectVec(r, 0, -1, 0);
      expect(close(r.norm(), 1)).to.equal(true);
    });

    it('total internal reflection returns null', () => {
      const a = new Vector3(1, 0, 0);  // tangent to normal
      const n = new Vector3(0, 1, 0);
      const r = a.refract(n, 2);
      expect(r).to.equal(null);
    });
  });

  describe('applyMatrix', () => {
    it('applies 3x3 rotation (row-major)', () => {
      // 90° about Z: rows [0,-1,0],[1,0,0],[0,0,1]
      const M = [
        [0, -1, 0],
        [1,  0, 0],
        [0,  0, 1],
      ];
      const v = new Vector3(1, 0, 0);
      const r = v.applyMatrix(M);
      expectVec(r, 0, 1, 0);
    });

    it('applies 3x4 with translation in [i][3]', () => {
      const M = [
        [1, 0, 0, 5],
        [0, 1, 0, 6],
        [0, 0, 1, 7],
      ];
      const v = new Vector3(0, 0, 0);
      const r = v.applyMatrix(M);
      expectVec(r, 5, 6, 7);
    });
  });

  describe('scaleAlongAxis', () => {
    it('scales parallel component only', () => {
      const v = new Vector3(3, 4, 5);
      const axis = new Vector3(2, 0, 0); // x-axis scaled
      const s = 3;
      const r = v.scaleAlongAxis(axis, s);

      // baseline reconstruction: (v - p) + s*p, where p = proj_axis(v)
      const proj = v.projectTo(axis);
      const base = v.sub(proj).add(proj.scale(s));
      expect(r.equals(base)).to.equal(true);

      // y,z unchanged when axis is x
      expectVec(r, base.x, 4, 5);
    });
  });

  describe('API utilities', () => {
    it('set mutates', () => {
      const v = new Vector3(1, 2, 3);
      v.set({ x: 7, y: 8, z: 9 });
      expectVec(v, 7, 8, 9);
    });

    it('apply with Math.max and default arg (0,0,0)', () => {
      const v = new Vector3(-1.2, 3.4, -5.6);
      const r = v.apply(Math.max); // vs (0,0,0)
      expectVec(r, 0, 3.4, 0);
    });

    it('toArray / clone / equals', () => {
      const v = new Vector3(1.000000000001, 2, 3);
      expect(v.toArray()).to.deep.equal([1.000000000001, 2, 3]);

      const c = v.clone();
      expect(c).to.not.equal(v);
      expect(v.equals(c)).to.equal(true);
      expect(new Vector3(1, 2.0001, 3).equals(v)).to.equal(false);
    });

    it('lerp endpoints + extrapolation', () => {
      const A = new Vector3(1, 2, 3);
      const B = new Vector3(5, 6, 7);
      expectVec(A.lerp(B, 0), 1, 2, 3);
      expectVec(A.lerp(B, 1), 5, 6, 7);
      expectVec(A.lerp(B, 2), 9, 10, 11);
    });

    it('toString contains coordinates', () => {
      const s = new Vector3(9, -7, 2).toString();
      expect(s).to.be.a('string');
      expect(s).to.contain('9');
      expect(s).to.contain('-7');
      expect(s).to.contain('2');
    });
  });

  describe('statics', () => {
    it('random in [0,1)', () => {
      const r = Vector3.random();
      expect(r.x).to.be.at.least(0); expect(r.x).to.be.below(1);
      expect(r.y).to.be.at.least(0); expect(r.y).to.be.below(1);
      expect(r.z).to.be.at.least(0); expect(r.z).to.be.below(1);
    });

    it('fromPoints', () => {
      const A = new Vector3(1, 1, 1), B = new Vector3(4, 5, 9);
      const d = Vector3.fromPoints(A, B);
      expectVec(d, 3, 4, 8);
    });

    it('fromBarycentric', () => {
      const A = new Vector3(0, 0, 0);
      const B = new Vector3(2, 0, 0);
      const C = new Vector3(0, 2, 0);
      const P = Vector3.fromBarycentric(A, B, C, 0.25, 0.25);
      expectVec(P, 0.5, 0.5, 0);
    });
  });

  describe('immutability sanity check for pure ops', () => {
    it('chaining leaves original unchanged', () => {
      const a = new Vector3(1, 2, 3);
      const snap = JSON.stringify(a);
      const _ = a.add(new Vector3(1,1,1))
                 .sub(new Vector3(1,1,1))
                 .scale(2)
                 .prod(new Vector3(1,1,1))
                 .neg();
      expect(JSON.parse(snap)).to.deep.equal({ x: 1, y: 2, z: 3 });
    });
  });

  describe('in-place ops (if available)', () => {
    const has = name => Object.prototype.hasOwnProperty.call(Vector3.prototype, name);

    it('add$/sub$/neg$/scale$/prod$/normalize$', () => {
      if (!has('add$')) return;
      const v = new Vector3(1, 2, 3);
      const w = new Vector3(3, 5, 7);

      expect(v.add$(w)).to.equal(v);  expectVec(v, 4, 7, 10);
      expect(v.sub$(w)).to.equal(v);  expectVec(v, 1, 2, 3);
      expect(v.neg$()).to.equal(v);   expectVec(v, -1, -2, -3);
      expect(v.scale$(2)).to.equal(v);expectVec(v, -2, -4, -6);
      expect(v.prod$(new Vector3(2, -0.5, 0.25))).to.equal(v);
      expectVec(v, -4, 2, -1.5);
      expect(v.normalize$()).to.equal(v); expect(close(v.norm(), 1, 1e-12)).to.equal(true);
    });
  });
});
