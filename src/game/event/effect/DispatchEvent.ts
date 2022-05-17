import {
  DispatchEventJson,
  EFFECT_TYPE,
} from '../../type/JsonType';
import Effect from './Effect';

export default class DispatchEvent extends Effect {
  private id!: string;
  private time2happen!: number;

  public activate() {
    // const event = data().getEvents().get(this.id);
    // event.setTime2happen(this.time2happen);
    console.log('dispatch event:', this.id, 'in', this.time2happen, 'days');
  }

  public toJson(): DispatchEventJson {
    return {
      type: EFFECT_TYPE.DISPATCH_EVENT,
      id: this.id,
      time2happen: this.time2happen,
    };
  }

  public loadJson(json: DispatchEventJson) {
    this.id = json.id;
    this.time2happen = json.time2happen;
    return this;
  }
}
