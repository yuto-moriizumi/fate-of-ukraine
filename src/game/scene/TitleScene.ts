import * as PIXI from 'pixi.js';
import { GameManager } from '../GameManager';
import { Scene } from './Scene';
import { SelectionScene } from './SelectionScene';

export class TitleScene extends Scene {
  private text!: PIXI.Text;
  private readonly textAppealDuration: number = 150;

  constructor() {
    super();
    this.onResourceLoaded();
    //onResourceLoadedは本来、Pixi.jsが提供するリソースローダがロード終わったときにリソースが呼び出される想定です。
    //ただここでは簡便のためシーンインスタンス生成時に直接呼び出しています。
  }

  //リソースリストを作成し返却する
  createInitialResourceList() {
    // const assets = super.createInitialResourceList();
    //assets.push(staticResource.Audio.Bgm.Title);
    // assets.push(Resource.Title.Bg);
    // assets.push(Resource.gamedata);
    // assets.push(Resource.savedata);
    //console.log(assets);
    // return assets;
  }

  //リソースがロードされたときのコールバック
  protected onResourceLoaded(): void {
    // GameManager.instance.game.loader.add('$Hime.png').load(setup);

    // super.onResourceLoaded();
    const resources = GameManager._instance.game.loader.resources;
    const renderer = GameManager._instance.game.renderer;

    //背景
    // const sprite = new PIXI.Sprite(resources[Resource.Title.Bg].texture);
    // sprite.width = renderer.width;
    // sprite.height = renderer.height;
    // this.addChild(sprite);

    const text = new PIXI.Text(
      'ウクライナ人民共和国ゲーム',
      new PIXI.TextStyle({
        fontFamily: 'MisakiGothic',
        fontSize: 80,
        fill: 0xffffff,
        padding: 12,
        dropShadow: true,
      })
    );
    text.anchor.set(0.5, 0.5);
    text.position.set(renderer.width * 0.5, renderer.height * 0.4);
    this.addChild(text);

    this.text = new PIXI.Text(
      'TOUCH TO START',
      new PIXI.TextStyle({
        fontFamily: 'MisakiGothic',
        fontSize: 64,
        fill: 0xffffff,
        padding: 12,
      })
    );
    this.text.anchor.set(0.5, 0.5);
    this.text.position.set(renderer.width * 0.5, renderer.height * 0.6);
    this.addChild(this.text);
    this.interactive = true;
    this.buttonMode = true;
    this.on('pointerdown', () => this.onPointerDown());

    //セーブデータ読み込み
    // GameManager.instance.data.load(resources[Resource.gamedata].data);
    // GameManager.instance.data.load(resources[Resource.savedata].data);
  }

  private onPointerDown() {
    //次のシーン
    GameManager._instance.loadScene(new SelectionScene());
  }

  public update(delta: number) {
    super.update(delta);
  }
}
