import type { Country } from '../data/Country';
import { InvisibleEvent } from '../event/InvisibleEvent';
import { VisibleEvent } from '../event/VisibleEvent';
import { CountryHandler } from './handlers';

export class CountryPlayerHandler extends CountryHandler {
  private eventHandler: eventHandler;
  constructor(country: Country, handler: eventHandler) {
    super(country);
    this.eventHandler = handler;
  }
  onEvent(event: VisibleEvent | InvisibleEvent) {
    if (event instanceof VisibleEvent) this.eventHandler(event);
    // event.showDialog();
  }
}

export type eventHandler = (e: VisibleEvent) => void;
