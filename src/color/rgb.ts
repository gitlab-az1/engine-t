import { ColorObject } from "./core";


class RGB extends ColorObject {
  public constructor(r: number, g: number, b: number, a: number = 1) {
    super(r, g, b, a);
  }

  public lerp(target: ColorObject, t: number): RGB {
    return new RGB(
      this._red + (target.r - this._red) * t,
      this._green + (target.g - this._green) * t,
      this._blue + (target.b - this._blue) * t,
      this._alpha + (target.a - this._alpha) * t // eslint-disable-line comma-dangle
    );
  }

  public multiply(f: number): ColorObject {
    return new RGB(
      this._red * f,
      this._green * f,
      this._blue * f,
      this._alpha // eslint-disable-line comma-dangle
    );
  }
}

export default RGB;
