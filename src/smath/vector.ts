import { assert } from "../runtime";


const enum Dimensions {
  Vec2D = 2,
  Vec3D = 3,
  Vec4D = 4,
}


export type math_vec2d = { x: number; y: number };
export type math_vec3d = math_vec2d & { z: number };
export type math_vec4d = math_vec3d & { w: number };


export abstract class Vector {
  #frozen: boolean = false;

  public abstract readonly dimension: number;
  public abstract components(): readonly number[];

  public get isFrozen(): boolean {
    return this.#frozen;
  }
  
  public freeze(): this {
    this.#frozen = true;
    return this;
  }

  public magnitude(): number {
    const sumOfSquares = this.components()
      .reduce((acc, curr) => acc + curr * curr, 0);

    return Math.sqrt(sumOfSquares);
  }

  public length(): number {
    return this.magnitude();
  }

  public clone(): this {
    return new (this.constructor as any)(...this.components());
  }
}


export class Vector2D extends Vector {
  #x: number;
  #y: number;

  public constructor(x: number = 0, y: number = 0) {
    super();

    assert(typeof x === "number" && !isNaN(x));
    assert(typeof y === "number" && !isNaN(y));

    this.#x = x;
    this.#y = y;
  }

  public get dimension(): number {
    return Dimensions.Vec2D;
  }

  public get x(): number {
    return this.#x;
  }

  public set x(value: number) {
    if(!this.isFrozen) {
      assert(typeof value === "number" && !isNaN(value));
      this.#x = value;
    }
  }

  public get y(): number {
    return this.#y;
  }

  public set y(value: number) {
    if(!this.isFrozen) {
      assert(typeof value === "number" && !isNaN(value));
      this.#y = value;
    }
  }

  public add(o: Vector2D): this {
    if(!this.isFrozen) {
      assert(o instanceof Vector && o.dimension === this.dimension);

      this.#x += o.x;
      this.#y += o.y;
    }

    return this;
  }

  public sub(o: Vector2D): this {
    if(!this.isFrozen) {
      assert(o instanceof Vector && o.dimension === this.dimension);

      this.#x -= o.x;
      this.#y -= o.y;
    }

    return this;
  }

  public scale(f: number): this {
    if(!this.isFrozen) {
      assert(typeof f === "number" && !isNaN(f));

      this.#x *= f;
      this.#y *= f;
    }

    return this;
  }

  public dot(o: Vector2D): number {
    assert(o instanceof Vector && o.dimension === this.dimension);
    return this.#x * o.x + this.#y * o.y;
  }

  public normalize(): this {
    const mag = this.magnitude();

    if(!this.isFrozen && mag > 0) {
      this.#x /= mag;
      this.#y /= mag;
    }

    return this;
  }

  public components(): readonly number[] {
    return [this.#x, this.#y];
  }
}

export class Vector3D extends Vector {
  #x: number;
  #y: number;
  #z: number;

  public constructor(x: number = 0, y: number = 0, z: number = 0) {
    super();

    assert(typeof x === "number" && !isNaN(x));
    assert(typeof y === "number" && !isNaN(y));
    assert(typeof z === "number" && !isNaN(z));

    this.#x = x;
    this.#y = y;
    this.#z = z;
  }

  public get dimension(): number {
    return Dimensions.Vec3D;
  }

  public get x(): number {
    return this.#x;
  }

  public set x(value: number) {
    if(!this.isFrozen) {
      assert(typeof value === "number" && !isNaN(value));
      this.#x = value;
    }
  }

  public get y(): number {
    return this.#y;
  }

  public set y(value: number) {
    if(!this.isFrozen) {
      assert(typeof value === "number" && !isNaN(value));
      this.#y = value;
    }
  }

  public get z(): number {
    return this.#z;
  }

  public set z(value: number) {
    if(!this.isFrozen) {
      assert(typeof value === "number" && !isNaN(value));
      this.#z = value;
    }
  }

  public add(o: Vector3D): this {
    if(!this.isFrozen) {
      assert(o instanceof Vector && o.dimension === this.dimension);

      this.#x += o.x;
      this.#y += o.y;
      this.#z += o.z;
    }

    return this;
  }

  public sub(o: Vector3D): this {
    if(!this.isFrozen) {
      assert(o instanceof Vector && o.dimension === this.dimension);

      this.#x -= o.x;
      this.#y -= o.y;
      this.#z -= o.z;
    }

    return this;
  }

  public scale(f: number): this {
    if(!this.isFrozen) {
      assert(typeof f === "number" && !isNaN(f));

      this.#x *= f;
      this.#y *= f;
      this.#z *= f;
    }

    return this;
  }

  public normalize(): this {
    const mag = this.magnitude();

    if(!this.isFrozen && mag > 0) {
      this.#x /= mag;
      this.#y /= mag;
      this.#z /= mag;
    }

    return this;
  }

  public components(): readonly number[] {
    return [this.#x, this.#y, this.#z];
  }
}

export class Vector4D extends Vector {
  #x: number;
  #y: number;
  #z: number;
  #w: number;

  public constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 0) {
    super();

    assert(typeof x === "number" && !isNaN(x));
    assert(typeof y === "number" && !isNaN(y));
    assert(typeof z === "number" && !isNaN(z));
    assert(typeof w === "number" && !isNaN(w));

    this.#x = x;
    this.#y = y;
    this.#z = z;
    this.#w = w;
  }

  public get dimension(): number {
    return Dimensions.Vec4D;
  }

  public get x(): number {
    return this.#x;
  }

  public set x(value: number) {
    if(!this.isFrozen) {
      assert(typeof value === "number" && !isNaN(value));
      this.#x = value;
    }
  }

  public get y(): number {
    return this.#y;
  }

  public set y(value: number) {
    if(!this.isFrozen) {
      assert(typeof value === "number" && !isNaN(value));
      this.#y = value;
    }
  }

  public get z(): number {
    return this.#z;
  }

  public set z(value: number) {
    if(!this.isFrozen) {
      assert(typeof value === "number" && !isNaN(value));
      this.#z = value;
    }
  }

  public get w(): number {
    return this.#w;
  }

  public set w(value: number) {
    if(!this.isFrozen) {
      assert(typeof value === "number" && !isNaN(value));
      this.#w = value;
    }
  }

  public normalize(): this {
    const mag = this.magnitude();

    if(!this.isFrozen && mag > 0) {
      this.#x /= mag;
      this.#y /= mag;
      this.#z /= mag;
      this.#w /= mag;
    }

    return this;
  }

  public components(): readonly number[] {
    return [this.#x, this.#y, this.#z, this.#w];
  }
}
