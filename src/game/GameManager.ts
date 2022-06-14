import * as PIXI from 'pixi.js';
import { SaveData } from './data/SaveData';
import type { Scene } from './scene/Scene';
import { TitleScene } from './scene/TitleScene';
import { Observable } from './util/Observable';
import { ResourceLoader } from './util/ResourceLoader';

export class GameManager {
  private static _instance: GameManager;
  public static onLoadEnd: () => void;
  public readonly game: PIXI.Application;
  public readonly data = new SaveData();
  public readonly scene = new Observable<Scene>();
  public readonly loader: ResourceLoader;

  public static get instance() {
    return this._instance;
  }

  constructor(app: PIXI.Application) {
    if (GameManager.instance) {
      throw new Error('GameManager can be instantiate only once');
    }
    this.game = app;

    //ゲームデータのロード
    const GAMEDATA_FILE = 'GameData.json';
    const SAVEDATA_FILE = 'SaveData.json';
    const EVENT_FILE = 'EventData.json';
    const loader = app.loader;
    this.loader = new ResourceLoader(loader);
    loader
      .add(GAMEDATA_FILE)
      .add(SAVEDATA_FILE)
      .add(EVENT_FILE)
      .load(() => {
        this.data
          .loadJson(loader.resources[GAMEDATA_FILE].data)
          .loadJson(loader.resources[SAVEDATA_FILE].data)
          .loadJson(loader.resources[EVENT_FILE].data);
        console.log(this.data);
      });

    this.game.ticker.add((delta: number) => {
      if (this.scene) this.scene.val.update(delta);
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
    GameManager._instance = new GameManager(game);
    //Reactに初期イベントを通知
    if (GameManager.onLoadEnd) GameManager.onLoadEnd();
    //タイトル画面をロード
    GameManager.instance.loadScene(new TitleScene());
  }

  public loadScene(newScene: Scene): void {
    if (this.scene.val) {
      this.scene.val.destroy();
    }
    this.scene.val = newScene;
    this.game.stage.addChild(newScene);
  }
}

export const data = () => {
  return GameManager.instance.data;
};

export const loader = () => {
  return GameManager.instance.loader;
};
