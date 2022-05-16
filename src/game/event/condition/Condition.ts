import { Dayjs } from 'dayjs';
import { Country } from '../../data/Country';
import { CountryJson, SaveDataType } from '../../type/JsonType';
import { Serializable } from '../../util/Serializable';

export default abstract class Condition implements Serializable {
  readonly type = this.constructor.name;
  public abstract isValid(root: Country, date: Dayjs): boolean;

  public toJson(as: SaveDataType): any {
    return { type: this.constructor.name };
  }

  public abstract loadJson(json: CountryJson): any;
}
