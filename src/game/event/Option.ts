import Effect from './effect/Effect';
import { Serializable } from '../util/Serializable';
import { EffectJson, OptionJson, SaveDataType } from '../type/JsonType';
import EffectFactory from './effect/EffectFactory';

export default class Option implements Serializable {
  private _title!: string;
  private effects: Array<Effect> = new Array<Effect>();

  public get title() {
    return this._title;
  }

  public takeEffects() {
    this.effects.forEach((effect) => effect.activate());
  }

  public toJson(as: SaveDataType): OptionJson {
    return {
      title: this._title,
      effects: this.effects.map((e) => e.toJson(as)),
    };
  }

  public loadJson(json: OptionJson) {
    this._title = json.title;
    this.effects = json.effects.map((effect: EffectJson) =>
      EffectFactory.fromJson(effect)
    );
    return this;
  }
}
