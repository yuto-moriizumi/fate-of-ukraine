import { Country } from '../../data/Country';
import { EventBase } from '../EventBase';

export abstract class CountryHandler {
  country!: Country;
  update() {
    this.dispatchEvents();
  }

  public getCountry() {
    return this.country;
  }

  abstract dispatchEvents(): void;

  abstract onEvent(event: EventBase): void;
}
