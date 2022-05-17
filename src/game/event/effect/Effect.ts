import { EffectJson, SaveDataType } from '../../type/JsonType';
import { Serializable } from '../../util/Serializable';
import DeclareWar from './DeclareWar';
import SetOwner from './SetOwner';
import Annex from './Annex';
import Peace from './Peace';
import ChangeName from './ChangeName';
import GainAccess from './GainAccess';
import DispatchEvent from './DispatchEvent';

export default abstract class Effect implements Serializable {
  public abstract activate(): void;
  public abstract toJson(as: SaveDataType): EffectJson;

  public abstract loadJson(json: EffectJson): Effect;
}
