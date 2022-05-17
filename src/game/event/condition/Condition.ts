import { Dayjs } from 'dayjs';
import { Country } from '../../data/Country';
import {
  ConditionJson,
  CONDITION_TYPE,
  SaveDataType,
} from '../../type/JsonType';
import { Serializable } from '../../util/Serializable';
import DateCondition from './DateCondition';
import EventFired from './EventFired';
import CountryIs from './CountryIs';
import And from './And';
import { Always } from './Always';
import OwnProvince from './OwnProvince';
import { AtWarWith } from './AtWarWith';

export default abstract class Condition implements Serializable {
  readonly type = this.constructor.name;
  public abstract isValid(root: Country, date: Dayjs): boolean;

  public abstract toJson(as: SaveDataType): ConditionJson;

  public abstract loadJson(json: ConditionJson): Condition;

  public static fromJson(json: ConditionJson) {
    switch (json.type) {
      case CONDITION_TYPE.DATE_CONDITION:
        return new DateCondition().loadJson(json);
      case CONDITION_TYPE.EVENT_FIRED:
        return new EventFired().loadJson(json);
      case CONDITION_TYPE.COUNTRY_IS:
        return new CountryIs().loadJson(json);
      case CONDITION_TYPE.AND:
        return new And().loadJson(json);
      case CONDITION_TYPE.ALWAYS:
        return new Always().loadJson(json);
      case CONDITION_TYPE.OWN_PROVINCE:
        return new OwnProvince().loadJson(json);
      case CONDITION_TYPE.AT_WAR_WITH:
        return new AtWarWith().loadJson(json);
    }
  }
}
