import { SaveDataType } from '../../type/JsonType';
import { Serializable } from '../../util/Serializable';
import JsonObject from '../../Utils/JsonObject';

export default abstract class Effect implements Serializable {
  public abstract activate(): void;
  public toJson(as: SaveDataType): any {
    return { type: this.constructor.name };
  }

  public abstract loadJson(json: any): any;
}
