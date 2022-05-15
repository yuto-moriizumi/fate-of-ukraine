import JsonObject from "./JsonObject";
import JsonType from "./JsonType";

export default class ExtendedSet<T> extends JsonObject {
  private set = new Set<T>();

  constructor(array?: any) {
    super();
    if (array) this.set = new Set<T>(array);
  }

  public add(value: T) {
    this.set.add(value);
  }

  public delete(value: T) {
    return this.set.delete(value);
  }

  public has(value: T) {
    return this.set.has(value);
  }

  public forEach(callback: (value: T) => void) {
    this.set.forEach(callback);
  }

  public some(callback: (value: T) => boolean) {
    return Array.from(this.set).some(callback);
  }

  public filter(callback: (value: T) => boolean) {
    return Array.from(this.set).filter(callback);
  }

  public get size(): number {
    return this.set.size;
  }

  toJsonObject(type: JsonType): object {
    return Array.from(this.set);
  }
}
