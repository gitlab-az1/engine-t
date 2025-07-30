import { assert } from "../runtime";
import { type math_vec2d } from "../smath";
import { RuntimeException, shortId } from "../core";
import { AbstractRenderingComponent2D, ComponentOptions } from "./core-2d";

import {
  type RenderingContext2D,
  RenderingContext2DForHTMLCanvas,
} from "./context-2d";


export interface CanvasOptions extends ComponentOptions {
  allowRandomUniqueId?: boolean;
  className?: string;
  id?: string;
  size?: (math_vec2d & { autoresize?: boolean }) | "full-static" | "full-resizable";
}

const defaultOptions: Partial<CanvasOptions> = {
  allowRandomUniqueId: false,
  className: "et-canvas",
  size: { x: 720, y: 480 },
};


export class Canvas extends AbstractRenderingComponent2D {
  public static new(o?: CanvasOptions): Canvas {
    const el = window.document.createElement("canvas");
    const eid = o?.id?.trim();

    if(eid && eid.length > 0) {
      el.id = eid.trim();
    }

    if(o?.className) {
      el.className = [ ...new Set<string>([
        ...o.className.split(" "),
        ...(defaultOptions.className?.split(" ") ?? []),
      ])].map(x => x.trim()).join(" ");
    }

    return new Canvas(el, o);
  }
  
  readonly #HtmlCanvas: HTMLCanvasElement;
  #Context: RenderingContext2D | null;
  #Options: CanvasOptions;

  readonly #State: {
    cleanup: (() => unknown)[],
    disposed: boolean;
    size: [number, number];
  };

  private constructor(
    _htmlCanvasElement: HTMLCanvasElement,
    _options?: CanvasOptions // eslint-disable-line comma-dangle
  ) {
    assert(_htmlCanvasElement instanceof HTMLCanvasElement);
    super();
    
    this.#Context = null;
    this.#HtmlCanvas = _htmlCanvasElement;
    this.#Options = { ...defaultOptions, ..._options };

    this.#State = {
      cleanup: [],
      disposed: false,
      size: [
        window.innerWidth,
        window.innerHeight,
      ],
    };

    if(this.#Options.size === "full-resizable") {
      const rcb = () => {
        this.#State.size = [
          window.innerWidth,
          window.innerHeight,
        ];
      };

      window.addEventListener("resize", rcb);

      this.#State.cleanup.push(() => {
        window.removeEventListener("resize", rcb);
      });
    } else if(
      typeof this.#Options.size === "object" &&
      "x" in this.#Options.size && "y" in this.#Options.size
    ) {
      this.#State.size = [
        this.#Options.size.x,
        this.#Options.size.y,
      ];

      if(this.#Options.size.autoresize) {
        const rcb = () => {
          this.#State.size = [
            window.innerWidth,
            window.innerHeight,
          ];
        };

        window.addEventListener("resize", rcb);

        this.#State.cleanup.push(() => {
          window.removeEventListener("resize", rcb);
        });
      }
    }

    if(!this.#HtmlCanvas.id && this.#Options.allowRandomUniqueId) {
      this.#HtmlCanvas.id = this.#GenerateRandomId("el");
    }

    this.#HtmlCanvas.width = this.#State.size[0];
    this.#HtmlCanvas.height = this.#State.size[1];
  }

  public get context(): CanvasRenderingContext2D | null {
    this.#EnsureNotDisposed();
    return this.#HtmlCanvas.getContext("2d");
  }

  public get classList(): DOMTokenList {
    this.#EnsureNotDisposed();
    return this.#HtmlCanvas.classList;
  }

  public get $element(): HTMLCanvasElement {
    this.#EnsureNotDisposed();
    return this.#HtmlCanvas;
  }

  public getContext(): RenderingContext2D {
    this.#EnsureNotDisposed();

    if(this.#Context == null) {
      const ctx = this.#HtmlCanvas.getContext("2d");
      this.#Context = ctx ? new RenderingContext2DForHTMLCanvas(ctx) : null;
    }

    if(this.#Context == null) {
      const id = this.#GetElementIdentifier();
      throw new RuntimeException(`Unable to get rendering context of canvas {${id}}`);
    }

    return this.#Context;
  }

  public getElementIdentifier(): string {
    this.#EnsureNotDisposed();
    return this.#GetElementIdentifier();
  }

  public cleanup(): void {
    this.#EnsureNotDisposed();
    
    for(let i = 0; i < this.#State.cleanup.length; i++) {
      this.#State.cleanup[i]?.();
    }

    this.#State.cleanup = [];
  }

  public dispose(): void {
    super.dispose();

    if(!this.#State.disposed) {
      this.#State.disposed = true;

      for(let i = 0; i < this.#State.cleanup.length; i++) {
        this.#State.cleanup[i]?.();
      }

      this.#State.cleanup = null!;
      this.#State.size = null!;
    }
  }

  #GenerateRandomId(f?: string): string {
    if(!f) return shortId();
    let cached = this._resourcesMap.get(f) as string | undefined;

    if(!cached) {
      this._resourcesMap.set(f, (cached = shortId()));
    }

    return cached;
  }

  #GetElementIdentifier(): string {
    if(this.#HtmlCanvas.id.trim().length > 0)
      return `#${this.#HtmlCanvas.id.trim()}`;

    return [ ...this.#HtmlCanvas.classList ]
      .map(x => `.${x}`)
      .join(" ");
  }

  #EnsureNotDisposed(): void {
    if(this.#State.disposed) {
      throw new RuntimeException("This Canvas instance is already disposed and cannot be used anymore", "ERR_RESOURCE_DISPOSED");
    }
  }
}
