import { Dayjs } from 'dayjs';
import { Country } from '../../data/Country';
import { SaveDataType, SAVEDATA_TYPE } from '../../type/JsonType';
import Condition from './Condition';
import ConditionCreator from './ConditionCreator';

export default class Always extends Condition {
  private always = true;
  public isValid(country: Country, date: Dayjs): boolean {
    return this.always;
  }
  public toJson(as: SaveDataType) {
    return { ...super.toJson(as), always: this.always };
  }

  public loadJson(json: any) {
    this.always = json.always;
  }
}
