/* eslint-disable @typescript-eslint/no-namespace, no-inner-declarations */

import RGB from "./rgb";
import { RuntimeException } from "../core";

export * from "./core";

export { default as RGB } from "./rgb";


export namespace Color {
  export function hsl(h: number, s: number, l: number, a: number = 1): RGB {
    h = h % 360;
    s = s / 100;
    l = l / 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;

    let r: number = 0;
    let g: number = 0;
    let b: number = 0;

    if(h < 60) {
      [r, g, b] = [c, x, 0];
    } else if(h < 120) {
      [r, g, b] = [x, c, 0];
    } else if(h < 180) {
      [r, g, b] = [0, c, x];
    } else if(h < 240) {
      [r, g, b] = [0, x, c];
    } else {
      [r, g, b] = [c, 0, x];
    }

    return new RGB(r + m, g + m, b + m, a);
  }

  export function rgba(r: number, g: number, b: number, a: number = 1): RGB {
    return new RGB(r / 255, g / 255, b / 255, a);
  }

  export function hex(t: string): RGB {
    const raw = t.trim().replace(/^#/, "");

    let r: number = 0;
    let g: number = 0;
    let b: number = 0;
    let a: number = 1;

    if(raw.length === 3) {
      r = parseInt(raw[0] + raw[0], 16);
      g = parseInt(raw[1] + raw[1], 16);
      b = parseInt(raw[2] + raw[2], 16);
    } else if(raw.length === 6) {
      r = parseInt(raw.substring(0, 2), 16);
      g = parseInt(raw.substring(2, 4), 16);
      b = parseInt(raw.substring(4, 6), 16);
    } else if(raw.length === 8) {
      r = parseInt(raw.substring(0, 2), 16);
      g = parseInt(raw.substring(2, 4), 16);
      b = parseInt(raw.substring(4, 6), 16);
      a = parseInt(raw.substring(6, 8), 16) / 255;
    } else {
      throw new RuntimeException(`Invalid hex color "${t}"`, "ERR_INVALID_TYPE");
    }

    return new RGB(r / 255, g / 255, b / 255, a);
  }

  export function parse(s: string): RGB {
    const text = s.trim().toLowerCase();

    if(/^#?([a-f0-9]{3}|[a-f0-9]{6}|[a-f0-9]{8})$/i.test(text))
      return hex(text);

    // eslint-disable-next-line no-useless-escape
    const rgbMatch = text.match(/^rgba?\(([^\)]+)\)$/i);

    if(rgbMatch != null) {
      const parts = rgbMatch[1]
        .split(",").map(p => parseFloat(p.trim()));

      if(parts.length === 3 || parts.length === 4) {
        const [r, g, b, a = 1] = parts;
        return rgba(r, g, b, a);
      }
    }

    // eslint-disable-next-line no-useless-escape
    const hslMatch = text.match(/^hsla?\(([^\)]+)\)$/i);

    if(hslMatch != null) {
      const parts = hslMatch[1]
        .split(",").map(p => p.trim());

      const h = parseFloat(parts[0]);
      const s = parseFloat(parts[1].replace("%", ""));
      const l = parseFloat(parts[2].replace("%", ""));

      const a = typeof parts[3] === "string" && parts[3].length > 0 ?
        parseFloat(parts[3]) : 1;

      return hsl(h, s, l, a);
    }

    throw new RuntimeException("Unsupported color format \"${s}\"", "ERR_INVALID_TYPE");
  }
}
