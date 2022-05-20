import * as PIXI from 'pixi.js';
import { Country } from './data/Country';
import { SaveData } from './data/SaveData';
import { Scene } from './scene/Scene';
import { TitleScene } from './scene/TitleScene';
import { Observable } from './util/Observable';

export class GameManager {
  public static instance: GameManager;
  public static onLoadEnd: () => void;
  public game!: PIXI.Application;
  public countries!: Set<Country>;
  private _scene = new Observable<Scene>();
  private _data = new SaveData();

  public get scene() {
    return this._scene;
  }

  public get data() {
    return this._data;
  }

  constructor(app: PIXI.Application) {
    if (GameManager.instance) {
      throw new Error('GameManager can be instantiate only once');
    }
    this.game = app;

    //ゲームデータのロード
    const GAMEDATA_FILE = 'GameData.json';
    const SAVEDATA_FILE = 'SaveData.json';
    const loader = app.loader;
    loader
      .add(GAMEDATA_FILE)
      .add(SAVEDATA_FILE)
      .load(() => {
        this._data = this._data
          .loadJson(loader.resources[GAMEDATA_FILE].data)
          .loadJson(loader.resources[SAVEDATA_FILE].data);
        console.log(this._data);
      });

    this.game.ticker.add((delta: number) => {
      if (this._scene) this._scene.val.update(delta);
    });

    //右クリックのデフォ動作を力技で止める
    document.body.addEventListener(
      'contextmenu',
      function (ev) {
        ev.preventDefault();
        return false;
      },
      false
    );

    //HTMLにcanvasを追加
    document.body.appendChild(this.game.view);
  }

  public static start(params: {
    glWidth: number;
    glHeight: number;
    backgroundColor: number;
  }): void {
    const game = new PIXI.Application({
      width: params.glWidth,
      height: params.glHeight,
      backgroundColor: params.backgroundColor,
    });
    //PIXI.ApplicationインスタンスのloaderプロパティにbaseUrlを設定
    game.loader.baseUrl = 'assets/';
    GameManager.instance = new GameManager(game);
    //Reactに初期イベントを通知
    if (GameManager.onLoadEnd) GameManager.onLoadEnd();
    //タイトル画面をロード
    GameManager.instance.loadScene(new TitleScene());
  }

  public loadScene(newScene: Scene): void {
    if (this._scene.val) {
      this._scene.val.destroy();
    }
    this._scene.val = newScene;
    this.game.stage.addChild(newScene);
  }
}

export const data = () => {
  return GameManager.instance.data;
};
