import DateCondition from './DateCondition';
import EventFired from './EventFired';
import CountryIs from './CountryIs';
import And from './And';
import { Always } from './Always';
import OwnProvince from './OwnProvince';
import { AtWarWith } from './AtWarWith';

export default abstract class ConditionCreator {
  public static createCondition(condition: { type: string }) {
    switch (condition['type']) {
      case 'DateCondition':
        return Object.assign(new DateCondition(), condition);
      case 'EventFired':
        return Object.assign(new EventFired(), condition);
      case 'CountryIs':
        return Object.assign(new CountryIs(), condition);
      case 'And':
        return Object.assign(new And(), condition);
      case 'Always':
        return Object.assign(new Always(), condition);
      case 'OwnProvince':
        return Object.assign(new OwnProvince(), condition);
      case 'AtWarWith':
        return Object.assign(new AtWarWith(), condition);
      default:
        console.log(condition);

        throw new Error(
          '一致する条件クラスが見つかりませんでした:' + condition['type']
        );
    }
  }
}
