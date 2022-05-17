import { EffectJson, SaveDataType } from '../../type/JsonType';
import { Serializable } from '../../util/Serializable';
import JsonObject from '../../Utils/JsonObject';

export default abstract class Effect implements Serializable {
  public abstract activate(): void;
  public abstract toJson(as: SaveDataType): EffectJson;

  public abstract loadJson(json: EffectJson): Effect;
}
