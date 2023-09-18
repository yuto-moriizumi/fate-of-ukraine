import { SaveData } from './data/SaveData';
import type { Scene } from './scene/Scene';
import { TitleScene } from './scene/TitleScene';
import { Assets, Application } from 'pixi.js';
import { SaveDataJson } from './type/JsonType';
import { StoreApi, UseBoundStore } from 'zustand';
import { Store } from '../store';

const GAMEDATA_FILE = 'GameData.json';
const SAVEDATA_FILE = 'SaveData.json';
const EVENT_FILE = 'EventData.json';

export class GameManager {
  private static _instance: GameManager;
  public static onLoadEnd: () => void;
  public readonly game: Application<HTMLCanvasElement>;
  public readonly data = new SaveData();
  public readonly store: UseBoundStore<StoreApi<Store>>;
  private scene?: Scene;

  public static get instance() {
    return this._instance;
  }

  constructor(
    app: Application<HTMLCanvasElement>,
    store: UseBoundStore<StoreApi<Store>>
  ) {
    if (GameManager.instance) {
      throw new Error('GameManager can be instantiate only once');
    }
    this.game = app;
    this.store = store;
    Assets.resolver.basePath = './assets';
    Assets.load<SaveDataJson>([GAMEDATA_FILE, SAVEDATA_FILE, EVENT_FILE]).then(
      (data) => {
        Object.values(data).forEach((d) => this.data.loadJson(d));
        this.data.onLoadEnd();
      }
    );

    this.game.ticker.add(() => this.scene?.update());

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

  public static start(
    params: {
      glWidth: number;
      glHeight: number;
      backgroundColor: number;
    },
    store: UseBoundStore<StoreApi<Store>>
  ): void {
    const game = new Application<HTMLCanvasElement>({
      width: params.glWidth,
      height: params.glHeight,
      backgroundColor: params.backgroundColor,
    });
    GameManager._instance = new GameManager(game, store);
    //Reactに初期イベントを通知
    if (GameManager.onLoadEnd) GameManager.onLoadEnd();
    //タイトル画面をロード
    GameManager.instance.loadScene(new TitleScene());
  }

  public loadScene(newScene: Scene): void {
    if (this.scene) {
      this.scene.destroy();
    }
    this.scene = newScene;
    this.game.stage.addChild(newScene);
    this.store.getState().scene.set(newScene);
  }
}

export const data = () => GameManager.instance.data;
export const getStore = () => GameManager.instance.store.getState();
