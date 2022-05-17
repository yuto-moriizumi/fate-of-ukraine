import { AlwaysJson } from '../../type/JsonType';
import Condition from './Condition';

export class Always extends Condition {
  private always = true;
  public isValid(): boolean {
    return this.always;
  }
  public toJson(): AlwaysJson {
    return { type: 'Always', always: this.always };
  }

  public loadJson(json: AlwaysJson) {
    this.always = json.always;
    return this;
  }
}
