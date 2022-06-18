import type { Dayjs } from 'dayjs';
import type { Country } from '../data/Country';
import type { EventBase } from '../event/EventBase';
import { data } from '../GameManager';

export abstract class CountryHandler {
  readonly country: Country;
  constructor(country: Country) {
    this.country = country;
  }

  update(date: Dayjs) {
    this.dispatchEvents(date);
    this.country.divisions.forEach((d) => d.update());
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
