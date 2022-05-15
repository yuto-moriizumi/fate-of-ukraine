import DeclareWar from "./DeclareWar";
import SetOwner from "./SetOwner";
import Annex from "./Annex";
import Peace from "./Peace";
import ChangeName from "./ChangeName";
import GainAccess from "./GainAccess";
import Effect from "./Effect";
import DispatchEvent from "./DispatchEvent";

export default class EffectCreator {
  public static createEffect(effect: any): Effect {
    switch (effect.type) {
      case "DeclareWar":
        return Object.assign(new DeclareWar(), effect);
      case "SetOwner":
        return Object.assign(new SetOwner(), effect);
      case "Annex":
        return Object.assign(new Annex(), effect);
      case "Peace":
        return Object.assign(new Peace(), effect);
      case "ChangeName":
        return Object.assign(new ChangeName(), effect);
      case "GainAccess":
        return Object.assign(new GainAccess(), effect);
      case "DispatchEvent":
        return Object.assign(new DispatchEvent(), effect);
      default:
        console.log(effect);

        throw new Error(
          "一致する効果クラスが見つかりませんでした:" + effect.type
        );
    }
  }
}
