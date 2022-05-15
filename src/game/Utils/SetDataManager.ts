import JsonConverter from "./JsonConverter";
import JsonObject from "./JsonObject";
import DataManager from "../DataManager";
import ExtendedSet from "./ExtendedSet";
import JsonType from "./JsonType";

/**
 * Setの拡張クラスです
 * データロードの順番が重要になる場合に使用します
 * @export
 * @class MapDataManager
 * @template T
 * @template U
 */
export default class SetDataManager<T> extends DataManager {
  private set = new ExtendedSet<T>();

  constructor() {
    super();
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

  public get size() {
    return this.set.size;
  }

  public setCollection(collection: any) {
    this.set = new ExtendedSet<T>(collection);
  }

  toJsonObject(type: JsonType): object {
    return this.set.toJsonObject(type);
  }
}
