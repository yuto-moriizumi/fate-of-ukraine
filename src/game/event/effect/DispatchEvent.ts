import { data } from '../../GameManager';
import Effect from './Effect';

export default class DispatchEvent extends Effect {
  private type = this.constructor.name;
  private id!: string;
  private time2happen!: number;

  public activate() {
    // const event = data().getEvents().get(this.id);
    // event.setTime2happen(this.time2happen);
    console.log('dispatch event:', this.id, 'in', this.time2happen, 'days');
  }
}
