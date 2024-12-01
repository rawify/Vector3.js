
declare module 'Vector3';

declare class Vector3 {
    x: number;
    y: number;
    z: number;
    constructor(a: number | number[] | Vector3, b: number, c: number);
    add(v: Vector3): Vector3;
    sub(v: Vector3): Vector3;
    neg(): Vector3;
    scale(s: number): Vector3;
    prod(v: Vector3): Vector3;
    dot(v: Vector3): number;
    cross(v: Vector3): number;
    projectTo(a: Vector3): Vector3;
    rejectFrom(a: Vector3): Vector3;
    reflect(a: Vector3): Vector3;
    norm(): number;
    norm2(): number;
    normalize(): Vector3;
    distance(v: Vector3): number;
    set(v: Vector3): void;
    applyMatrix(M: any[]): Vector3;
    apply(fn: Function, v?: {
        x: number;
        y: number;
        z: number;
    }): Vector3;
    toArray(): number[];
    clone(): Vector3;
    equals(vector: Vector3): boolean;
    isUnit(): boolean;
    lerp(v: Vector3, t: number): Vector3;
    toString(): string;
    static random(): Vector3;
    static fromPoints(a: Vector3, b: Vector3): Vector3;
    static fromBarycentric(A: Vector3, B: Vector3, C: Vector3, u: number, v: number): Vector3;
}

export { Vector3 as default, Vector3 };
