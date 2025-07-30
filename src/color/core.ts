import { clamp } from "../smath";


export abstract class ColorObject {
  protected readonly _red: number;
  protected readonly _green: number;
  protected readonly _blue: number;
  protected readonly _alpha: number;

  public constructor(
    _red: number,
    _green: number,
    _blue: number,
    _alpha: number = 1 // eslint-disable-line comma-dangle
  ) {
    this._red = clamp(_red, 0, 1);
    this._green = clamp(_green, 0, 1);
    this._blue = clamp(_blue, 0, 1);
    this._alpha = clamp(_alpha, 0, 1);
  }

  public get r(): number {
    return this._red;
  }

  public get g(): number {
    return this._green;
  }

  public get b(): number {
    return this._blue;
  }

  public get a(): number {
    return this._alpha;
  }

  public abstract lerp(target: ColorObject, t: number): ColorObject;
  public abstract multiply(f: number): ColorObject;

  public toHex(a: boolean = true, sh: boolean = false): string {
    const r = Math.round(this._red * 255)
      .toString(16)
      .padStart(2, "0");

    const g = Math.round(this._green * 255)
      .toString(16)
      .padStart(2, "0");

    const b = Math.round(this._blue * 255)
      .toString(16)
      .padStart(2, "0");

    const alpha = a ?
      Math.round(this._alpha * 255)
        .toString(16)
        .padStart(2, "0") :
      "";

    return `${sh ? "#" : ""}${r}${g}${b}${alpha}`;
  }

  public toString(): string {
    const r = Math.round(this._red * 255);
    const g = Math.round(this._green * 255);
    const b = Math.round(this._blue * 255);

    return (
      this._alpha < 1 ? 
        `rgba(${r}, ${g}, ${b}, ${this._alpha.toFixed(3)})` : 
        `rgb(${r}, ${g}, ${b})`
    );
  }

  public getComponents(): readonly [number, number, number, number] {
    return Object.freeze([
      this._red,
      this._green,
      this._blue,
      this._alpha,
    ]);
  }

  public clone(): ColorObject {
    return new (this.constructor as any)(...this.getComponents());
  }
}
