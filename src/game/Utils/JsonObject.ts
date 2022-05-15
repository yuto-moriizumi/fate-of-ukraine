import JsonType from "./JsonType";

/**
 * JSON出力可能なオブジェクトの親オブジェクトです
 * @export
 * @class JsonObject
 */
export default abstract class JsonObject {
  /**
   * JSON文字列のベースになるobjectを生成します
   * Json.stringify()で利用します
   * @returns {object}
   * @memberof JsonObject
   */
  replacer(key: string, value: any, type: JsonType) {
    return [key, value];
  }

  toJsonObject(type: JsonType): object {
    return Object.fromEntries(
      Object.entries(this).map(([key, value]) => {
        if (key.startsWith("__")) return [];
        if (key.startsWith("_")) key = key.substr(1);
        [key, value] = this.replacer(key, value, type);
        if (value instanceof Map) {
          value = Object.fromEntries(value); //key={subkey:value,subkey2:value2...} 形式
          for (const key in value) {
            if (value[key] instanceof JsonObject)
              value[key] = value[key].toJsonObject(type);
          }
        }
        if (value instanceof Array) {
          for (const i in value)
            if (value[i] instanceof JsonObject)
              value[i] = value[i].toJsonObject(type);
        }
        if (value instanceof JsonObject) value = value.toJsonObject(type);
        return [key, value];
      })
    );
  }
}
