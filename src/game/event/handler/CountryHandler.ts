import { Country } from '../../data/Country';

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
