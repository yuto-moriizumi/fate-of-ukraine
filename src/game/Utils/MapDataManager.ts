import JsonConverter from "./JsonConverter";
import JsonObject from "./JsonObject";
import DataManager from "../DataManager";
import JsonType from "./JsonType";

/**
 * Mapの拡張クラスです
 * データロードの順番が重要になる場合に使用します
 * @export
 * @class MapDataManager
 * @template T
 * @template U
 */
export default class MapDataManager<T, U> extends DataManager {
  private map = new Map<T, U>();

  public set(id: T, item: U) {
    return this.map.set(id, item);
  }

  public safeGet(id: T, onload: (item: U) => void) {
    if (this.__isLoaded) onload(this.map.get(id));
    this.__onLoaded.push(() => {
      onload(this.map.get(id));
    });
  }

  /**
   * 値を返します
   * ロードが確実に完了している場合にのみ使用して下さい
   * @param {T} id
   * @returns
   * @memberof MapDataManager
   */
  public get(id: T) {
    if (!this.__isLoaded)
      throw new Error("ロード完了前にgetが呼び出されました");
    return this.map.get(id);
  }

  public forEach(callback: (item: U) => void) {
    if (!this.__isLoaded)
      throw new Error("ロード完了前にforeachが呼び出されました");
    this.map.forEach(callback);
  }

  public get size(): number {
    return this.map.size;
  }

  public some(callback: (item: U) => boolean): boolean {
    return Array.from(this.map.values()).some(callback);
  }

  /**
   * 保留していた関数を実行します
   * データのロードが終わったときに必ず呼び出してください
   * @memberof MapDataManager
   */

  toJsonObject(type: JsonType): object {
    const map = Object.fromEntries(this.map);
    for (const key in map) {
      if (map[key] instanceof JsonObject)
        map[key] = map[key].toJsonObject(type);
    }
    return map;
  }
}
