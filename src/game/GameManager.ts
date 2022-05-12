import * as PIXI from 'pixi.js';
import { Country } from './data/Country';
import { SaveData } from './data/SaveData';
import { Scene } from './scene/Scene';
import { TitleScene } from './scene/TitleScene';

export class GameManager {
  public static instance: GameManager;
  public game!: PIXI.Application;
  public countries!: Set<Country>;
  private scene!: Scene;
  public data!: SaveData;

  constructor(app: PIXI.Application) {
    if (GameManager.instance) {
      throw new Error('GameManager can be instantiate only once');
    }
    this.game = app;
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

    game.ticker.add((delta: number) => {
      if (this.instance.scene) {
        this.instance.scene.update(delta);
      }
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
    document.body.appendChild(game.view);

    //タイトル画面をロード
    this.instance.loadScene(new TitleScene());

    //ゲームデータのロード
    const PROVINCES_FILE = 'assets/provinces.json';
    const loader = PIXI.Loader.shared;
    loader.add(PROVINCES_FILE).load(() => {
      this.instance.data = new SaveData(loader.resources[PROVINCES_FILE].data);
      console.log(this.instance.data);
    });
  }

  public loadScene(newScene: Scene): void {
    if (this.scene) {
      this.scene.destroy();
    }
    this.scene = newScene;
    this.game.stage.addChild(newScene);
  }
}
