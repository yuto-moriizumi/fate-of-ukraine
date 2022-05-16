import { Dayjs } from 'dayjs';
import { Country } from '../../data/Country';
import { data } from '../../GameManager';
import { EventBase } from '../EventBase';

export abstract class CountryHandler {
  country!: Country;
  update(date: Dayjs) {
    this.dispatchEvents(date);
  }

  public getCountry() {
    return this.country;
  }

  dispatchEvents(date: Dayjs) {
    Array.from(data().events.values()).forEach((event: EventBase) => {
      event.dispatch(this.country, date);
    });
  }

  abstract onEvent(event: EventBase): void;
}
