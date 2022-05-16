import { Country } from '../../data/Country';
import { data } from '../../GameManager';
import Condition from './Condition';

export default class EventFired extends Condition {
  private id!: string;

  public isValid(country: Country, date: Date): boolean {
    const ans = false;
    // data().getEvents().forEach((event) => {
    //   if (event.getId() != this.id) return;
    //   ans = event.isFired();
    // });
    return ans;
  }
}
