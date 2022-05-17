import { CountryHandler } from './CountryHandler';
import { EventBase } from '../event/EventBase';
import { VisibleEvent } from '../event/VisibleEvent';
import { InvisibleEvent } from '../event/InvisibleEvent';

export class CountryPlayerHandler extends CountryHandler {
  onEvent(event: VisibleEvent | InvisibleEvent) {
    // event.showDialog();
  }
}
