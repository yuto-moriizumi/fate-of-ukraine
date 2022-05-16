import { Country } from '../../data/Country';
import { Event } from '../Event';

export abstract class CountryHandler {
  country!: Country;
  update() {
    this.dispatchEvents();
  }

  public getCountry() {
    return this.country;
  }

  abstract dispatchEvents(): void;

  abstract onEvent(event: Event): void;
}
