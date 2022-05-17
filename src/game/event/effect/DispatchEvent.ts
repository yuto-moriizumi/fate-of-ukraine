import { data } from '../../GameManager';
import { DispatchEventJson, EFFECT_TYPE } from '../../type/JsonType';
import Effect from './Effect';

export default class DispatchEvent extends Effect {
  private id!: string;
  private hours2happen: number | undefined;

  public activate() {
    const event = data().events.get(this.id);
    if (event) event.hours2happen = this.hours2happen;
    console.log('event timer set:', this.id, 'in', this.hours2happen, 'days');
  }

  public toJson(): DispatchEventJson {
    return {
      type: EFFECT_TYPE.DISPATCH_EVENT,
      id: this.id,
      hours2happen: this.hours2happen,
    };
  }

  public loadJson(json: DispatchEventJson) {
    this.id = json.id;
    this.hours2happen = json.hours2happen;
    return this;
  }
}
