import Option from './Option';
import Condition from './condition/Condition';
import MainScene from '../Scenes/MainScene';
import GameManager from '../GameManager';
import * as PIXI from 'pixi.js';
import Button from '../UI/Button';
import Sound from '../Sound';
import Resource from '../Resources';
import CountryHandler from '../CountryHandler';
import Country from '../Country';
import ConditionCreator from './condition/ConditionCreator';
import JsonObject from '../Utils/JsonObject';
import JsonType from '../Utils/JsonType';

export default class Event {
  private id: string;
  private title: string;
  private desc: string;
  private picture: string;
  private fired = false;
  private _condition: Condition;
  private _options: Array<Option> = new Array<Option>();
  private time2happen: number;
  private triggeredOnly = false;
  private hidden = false;
  private _immediate: Option;
  /**
   * グローバルイベントであるかどうか
   * グローバルイベントは、いずれかの国で発火されたときに、全ての国で発火します
   * ニュース的イベントに使用して下さい
   * @private
   * @memberof Event
   */
  private isGlobal = false;

  public isDispatchable(country: Country, date: Date): boolean {
    if (this.fired) return false;

    if (this.time2happen == NaN) {
      //time2happenがセットされていない場合
      if (this.triggeredOnly) return false; //受動的イベントなら発火しない
      if (this._condition.isValid(country, date)) return true; //受動的イベントではなく、条件を満たしている場合は発火
    } else {
      //time2happenがセットされている場合
      if (this.time2happen <= 0) return true; //発火期限であれば条件に関係なく発火
      if (this.triggeredOnly) return false; //発火期限でなく、受動的イベントなら発火しない
      if (this._condition.isValid(country, date)) return true; //発火期限でなく、受動的イベントでないなら条件を満たしている場合は発火
    }
    return false; //基本は発火しない
  }

  public dispatch(dispatcher: CountryHandler, date: Date) {
    if (!this.isDispatchable(dispatcher.getCountry(), date)) return; //発火可能でないなら発火しない
    this.fired = true;
    console.log('event dispatched', this.__id);
    if (this._immediate) this._immediate.takeEffects();

    if (this.isGlobal) {
      //グローバルイベントの場合は全ての国で発火します
      GameManager.instance.data
        .getCountries()
        .forEach((country) => country.onEvent(this));
    } else dispatcher.onEvent(this); //そうでない場合は発火国でのみ発火します
  }

  set condition(condition: object) {
    this._condition = ConditionCreator.createCondition(condition);
  }

  set options(options: Array<any>) {
    this._options = options.map((option) =>
      Object.assign(new Option(), option)
    );
  }

  public getOptions() {
    return this._options;
  }

  public getId() {
    return this.__id;
  }

  public setTime2happen(time2happen) {
    this.time2happen =
      this.time2happen == NaN || this.time2happen == undefined
        ? time2happen
        : Math.min(this.time2happen, time2happen);
  }

  public countFoward() {
    if (!this.fired && this.time2happen) this.time2happen -= 1; //未発火ならカウントを進める
  }

  public isFired() {
    return this.fired;
  }

  public getDesc() {
    return this.desc;
  }

  public getTitle() {
    return this.title;
  }

  public showDialog() {
    if (this.hidden) return; //隠しイベントであれば表示しない
    const dialog = new PIXI.Graphics();
    dialog.beginFill(0x2f2f2f);
    const renderer = GameManager.instance.game.renderer;

    //内容テキスト
    const message = new PIXI.Text(
      this.desc,
      new PIXI.TextStyle({
        fill: 0xffffff,
        fontSize: 20,
        breakWords: true,
        wordWrap: true,
        wordWrapWidth: renderer.width * 0.4,
      })
    );
    dialog.addChild(message);

    //タイトルテキスト
    const title = new PIXI.Text(
      this.title,
      new PIXI.TextStyle({ fill: 0xffffff })
    );

    //サイズ決め
    const width = message.width + 20;
    const height = Math.max(
      message.height +
        title.height +
        10 +
        10 +
        10 +
        (title.height + 5) * this._options.length,
      renderer.height * 0.2
    );
    dialog.position.set(
      renderer.width * 0.5 - width * 0.5,
      renderer.height * 0.5 - height * 0.5
    );
    dialog.drawRect(0, 0, width, height);

    //タイトルテキスト設定
    title.anchor.set(0.5, 0);
    title.position.set(width / 2, 5);
    title.width = Math.min(dialog.width - 10, title.width);

    //ヘッダ
    const header = new PIXI.Graphics();
    header.beginFill(0x3f3f3f);
    header.drawRect(0, 0, dialog.width, title.height + 10);
    header.addChild(title);
    dialog.addChild(header);

    //内容テキスト位置決め
    message.anchor.set(0.5, 0);
    message.position.set(width * 0.5, header.y + header.height + 5);

    //オプションボタン
    this._options.forEach((option: Option, index: number) => {
      const button = new Button(option.getTitle(), dialog.width * 0.8);
      button.position.set(
        dialog.width * 0.1,
        message.height + title.height + 10 + 10 + 5 + (title.height + 5) * index
      );
      button.on('click', () => {
        option.takeEffects();
        dialog.destroy();

        //SE再生
        const sound = new Sound(
          (
            GameManager.instance.game.loader.resources[
              Resource.se.click_ok
            ] as any
          ).buffer
        );
        sound.volume = 0.5;
        sound.play(false);
      });
      dialog.addChild(button);
    });

    MainScene.instance.addChild(dialog);

    //クリック判定が貫通しないようにする
    dialog.interactive = true;

    //SE再生
    const sound = new Sound(
      (
        GameManager.instance.game.loader.resources[Resource.se.news] as any
      ).buffer
    );
    sound.volume = 0.25;
    sound.play(false);
  }

  private set immediate(immediate: object) {
    this._immediate = Object.assign(new Option(), immediate);
  }

  replacer(key: string, value: any, type: JsonType) {
    switch (type) {
      case JsonType.GameData:
        if (key === 'fired') return []; //除外リスト
        return [key, value];
      case JsonType.SaveData:
        if (key !== 'fired') return []; //除外リスト fired以外全部除外
        return [key, value];
      default:
        throw new Error('Invalid type:' + type);
    }
  }
}
