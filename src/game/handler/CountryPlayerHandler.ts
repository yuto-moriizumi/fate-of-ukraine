import { CountryHandler } from './CountryHandler';
import { EventBase } from '../event/EventBase';

export class CountryPlayerHandler extends CountryHandler {
  onEvent(event: EventBase) {
    // event.showDialog();
  }
}
