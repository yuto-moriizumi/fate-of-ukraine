import * as PIXI from 'pixi.js';
import { SaveData } from './data/SaveData';
import type { Scene } from './scene/Scene';
import { TitleScene } from './scene/TitleScene';
import { Observable } from './util/Observable';
import { Assets } from 'pixi.js';
import { SaveDataJson } from './type/JsonType';

const GAMEDATA_FILE = 'GameData.json';
const SAVEDATA_FILE = 'SaveData.json';
const EVENT_FILE = 'EventData.json';

export class GameManager {
  private static _instance: GameManager;
  public static onLoadEnd: () => void;
  public readonly game: PIXI.Application<HTMLCanvasElement>;
  public readonly data = new SaveData();
  public readonly scene = new Observable<Scene>();

  public static get instance() {
    return this._instance;
  }

  constructor(app: PIXI.Application<HTMLCanvasElement>) {
    if (GameManager.instance) {
      throw new Error('GameManager can be instantiate only once');
    }
    this.game = app;
    Assets.resolver.basePath = './assets';
    Assets.load<SaveDataJson>([GAMEDATA_FILE, SAVEDATA_FILE, EVENT_FILE]).then(
      (data) => {
        Object.values(data).forEach((d) => this.data.loadJson(d));
        this.data.onLoadEnd();
      }
    );

    this.game.ticker.add((delta: number) => {
      this.scene.val.update(delta);
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
    const game = new PIXI.Application<HTMLCanvasElement>({
      width: params.glWidth,
      height: params.glHeight,
      backgroundColor: params.backgroundColor,
    });
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
