import { DictJson, Json, SaveDataType } from '../type/JsonType';
import { Serializable } from './Serializable';

export abstract class SerializableMap<
    V extends unknown & Serializable,
    J extends Json
  >
  extends Map<string, V>
  implements Serializable
{
  public toJson(as: SaveDataType): Json {
    return Object.fromEntries(
      Array.from(this).map(([k, v]: [string, V]) => {
        return [k, v.toJson(as)];
      })
    );
  }

  public abstract loadJson(json: DictJson): this;
}
