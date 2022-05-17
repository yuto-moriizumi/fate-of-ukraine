import { Dayjs } from 'dayjs';
import { Country } from '../../data/Country';
import { ConditionBaseJson, ConditionJson, CountryJson, SaveDataType } from '../../type/JsonType';
import { Serializable } from '../../util/Serializable';

export default abstract class Condition implements Serializable {
  readonly type = this.constructor.name;
  public abstract isValid(root: Country, date: Dayjs): boolean;

  public abstract toJson(as: SaveDataType): ConditionJson;

  public abstract loadJson(json: ConditionJson): Condition;
}
