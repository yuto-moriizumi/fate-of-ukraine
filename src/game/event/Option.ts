import Effect from './effect/Effect';
import DeclareWar from './effect/DeclareWar';
import SetOwner from './effect/SetOwner';
import Annex from './effect/Annex';
import Peace from './effect/Peace';
import ChangeName from './effect/ChangeName';
import GainAccess from './effect/GainAccess';
import EffectCreator from './effect/EffectCreator';

export default class Option {
  private title!: string;
  private _effects: Array<Effect> = new Array<Effect>();

  /**
   * Object.assignで使用するためのセッタ
   * @private
   * @memberof Option
   */
  private set effects(effects: Array<any>) {
    this._effects = effects.map((effect) => EffectCreator.createEffect(effect));
  }

  public takeEffects() {
    this._effects.forEach((effect) => effect.activate());
  }

  public getTitle(): string {
    return this.title;
  }
}
