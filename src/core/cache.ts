import { clamp } from "../smath";
import { LinkedMap, Touch } from "./map";
import { IDisposable } from "./disposable";
import { RuntimeException } from "./except";
import { assertUnsignedInteger } from "../runtime";


abstract class Cache<K, V> extends LinkedMap<K, V> implements IDisposable {
  protected _limit: number;
  protected _ratio: number;
  private _disposed: boolean;

  public constructor(limit: number, ratio: number = 1) {
    super();

    assertUnsignedInteger(limit);

    this._disposed = false;
    this._limit = limit;
    this._ratio = clamp(ratio, 0, 1);
  }

  public get limit(): number {
    this._ensureNotDisposed();
    return this._limit;
  }

  public set limit(value: number) {
    this._ensureNotDisposed();
    assertUnsignedInteger(value);

    this._limit = value;
    this._checkTrim();
  }

  public get ratio(): number {
    this._ensureNotDisposed();
    return this._ratio;
  }

  public set ratio(value: number) {
    this._ensureNotDisposed();
    assertUnsignedInteger(value);

    this._ratio = clamp(value, 0, 1);
    this._checkTrim();
  }

  protected get _isDisposed(): boolean {
    return this._disposed;
  }

  public override get(key: K, touch: Touch = Touch.AsNew): V | undefined {
    this._ensureNotDisposed();
    return super.get(key, touch);
  }

  public peek(key: K): V | undefined {
    this._ensureNotDisposed();
    return super.get(key, Touch.None);
  }

  public dispose(): void {
    if(!this._disposed) {
      this.clear();
      this._disposed = true;
    }
  }

  protected _checkTrim(): void {
    this._ensureNotDisposed();
    
    if(this.size > this._limit) {
      this._trimNew(Math.round(this._limit * this._ratio));
    }
  }

  protected abstract _trim(size: number): void;

  protected _ensureNotDisposed(): void {
    if(this._disposed) {
      throw new RuntimeException("This cache object is already disposed", "ERR_RESOURCE_DISPOSED");
    }
  }
}


export class LRUCache<K, V> extends Cache<K, V> {
  protected override _trim(size: number): void {
    this._ensureNotDisposed();
    this._trimOld(size);
  }

  public override set(key: K, value: V): this {
    this._ensureNotDisposed();

    super.set(key, value);
    this._checkTrim();

    return this;
  }
}


export class MRUCache<K, V> extends Cache<K, V> {
  protected override _trim(size: number): void {
    this._ensureNotDisposed();
    this._trimNew(size);
  }

  public override set(key: K, value: V): this {
    this._ensureNotDisposed();
    
    if(this._limit <= this.size && !this.has(key)) {
      this._trim(Math.round(this._limit * this._ratio) - 1);
    }

    super.set(key, value);
    return this;
  }
}


export default Cache;
