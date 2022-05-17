import Effect from './effect/Effect';
import { Serializable } from '../util/Serializable';
import { EffectJson, OptionJson, SaveDataType } from '../type/JsonType';
import EffectFactory from './effect/EffectFactory';

export default class Option implements Serializable {
  private title!: string;
  private effects: Array<Effect> = new Array<Effect>();

  public takeEffects() {
    this.effects.forEach((effect) => effect.activate());
  }

  public getTitle(): string {
    return this.title;
  }

  public toJson(as: SaveDataType): OptionJson {
    return {
      title: this.title,
      effects: this.effects.map((e) => e.toJson(as)),
    };
  }

  public loadJson(json: OptionJson) {
    this.title = json.title;
    this.effects = json.effects.map((effect: EffectJson) =>
      EffectFactory.fromJson(effect)
    );
    return this;
  }
}
