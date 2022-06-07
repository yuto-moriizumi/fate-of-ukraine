import { EffectJson } from '../../type/JsonType';
import DeclareWar from './DeclareWar';
import SetOwner from './SetOwner';
import Annex from './Annex';
import Peace from './Peace';
import ChangeName from './ChangeName';
import GainAccess from './GainAccess';
import DispatchEvent from './DispatchEvent';
import Effect from './Effect';

export default class EffectFactory {
  public static fromJson(json: EffectJson): Effect {
    switch (json.type) {
      case 'DeclareWar':
        return new DeclareWar().loadJson(json);
      case 'SetOwner':
        return new SetOwner().loadJson(json);
      case 'Annex':
        return new Annex().loadJson(json);
      case 'Peace':
        return new Peace().loadJson(json);
      case 'ChangeName':
        return new ChangeName().loadJson(json);
      case 'GainAccess':
        return new GainAccess().loadJson(json);
      case 'DispatchEvent':
        return new DispatchEvent().loadJson(json);
    }
  }
}
