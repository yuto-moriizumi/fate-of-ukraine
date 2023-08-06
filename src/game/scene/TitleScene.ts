import * as PIXI from 'pixi.js';
import { GameManager } from '../GameManager';
import { Scene } from './Scene';
import { SelectionScene } from './SelectionScene';

export class TitleScene extends Scene {
  private text!: PIXI.Text;

  constructor() {
    super();
    this.onResourceLoaded();
  }

  //リソースがロードされたときのコールバック
  protected onResourceLoaded(): void {
    const renderer = GameManager.instance.game.renderer;

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
  }

  private onPointerDown() {
    //次のシーン
    GameManager.instance.loadScene(new SelectionScene());
  }

  public update(delta: number) {
    super.update(delta);
  }
}
