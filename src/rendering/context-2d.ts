import { assert } from "../runtime";
import { type math_vec2d } from "../smath";
import { Color, ColorObject } from "../color";


type ColorArgument = string | ColorObject;

export interface SmartDrawOptions {
  circle: {
    position?: math_vec2d;
    color?: ColorArgument;
    fillMode?: "fill" | "stroke";
  };

  line: {
    position?: math_vec2d;
    color?: ColorArgument;
  }
}


export interface RenderingContext2D {
  drawLine(points: math_vec2d, options?: SmartDrawOptions["line"]): void;
}


export class RenderingContext2DForHTMLCanvas implements RenderingContext2D {
  #ctx: CanvasRenderingContext2D;

  public constructor(context: CanvasRenderingContext2D) {
    assert(context instanceof CanvasRenderingContext2D);
    this.#ctx = context;
  }

  public drawLine(points: math_vec2d, options?: SmartDrawOptions["line"]): void {
    this.#ctx.beginPath();
    this.#ctx.moveTo(options?.position?.x ?? 0, options?.position?.y ?? 0);

    this.#ctx.lineTo(points.x, points.y);
    this.#ctx.strokeStyle = this.#ParseColor(options?.color ?? Color.hex("#0f0f0f"));
    
    this.#ctx.stroke();
  }

  #ParseColor(arg: ColorArgument): string {
    if(!(arg instanceof ColorObject)) {
      arg = Color.parse(arg);
    }

    return arg.toHex(true, false);
  }
}
