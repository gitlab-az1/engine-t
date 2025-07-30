import { LRUCache } from "../core/cache";
import { Disposable } from "../core/disposable";
import { type RenderingContext2D } from "./context-2d";


const RenderingComponentDefaults = {
  ResourcesLruSize: 16,
  CacheSize: 16,
} as const;


export interface ComponentOptions {
  resourcesMapSize?: number;
  defaultCacheSize?: number;
}

export abstract class AbstractRenderingComponent2D extends Disposable {
  #iDisposed: boolean;

  protected readonly _resourcesMap: LRUCache<string, unknown>;
  protected readonly _cache: LRUCache<string, unknown>;

  public constructor(o?: ComponentOptions) {
    super();

    this._resourcesMap = new LRUCache(o?.resourcesMapSize ?? RenderingComponentDefaults.ResourcesLruSize);
    this._cache = new LRUCache(o?.defaultCacheSize ?? RenderingComponentDefaults.CacheSize);

    this.#iDisposed = false;
  }
  
  public abstract getContext(): RenderingContext2D;

  public dispose(): void {
    super.dispose();

    if(!this.#iDisposed) {
      this.#iDisposed = true;

      this._resourcesMap.clear();
      this._resourcesMap.dispose();

      this._cache.clear();
      this._cache.dispose();
    }
  }
}
