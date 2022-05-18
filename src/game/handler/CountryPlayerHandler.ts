import { CountryHandler } from './CountryHandler';
import { EventBase } from '../event/EventBase';
import { VisibleEvent } from '../event/VisibleEvent';
import { InvisibleEvent } from '../event/InvisibleEvent';
import { Country } from '../data/Country';

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
