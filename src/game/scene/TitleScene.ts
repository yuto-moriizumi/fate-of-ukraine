import { TextStyle, Text } from 'pixi.js';
import { GameManager } from '../GameManager';
import { Scene } from './Scene';
import { SelectionScene } from './SelectionScene';

export class TitleScene extends Scene {
  constructor() {
    super();
    const renderer = GameManager.instance.game.renderer;
    const title = new Text(
      'ウクライナ人民共和国ゲーム',
      new TextStyle({
        fontFamily: 'MisakiGothic',
        fontSize: 80,
        fill: 0xffffff,
        padding: 12,
        dropShadow: true,
      })
    );
    title.anchor.set(0.5, 0.5);
    title.position.set(renderer.width * 0.5, renderer.height * 0.4);
    this.addChild(title);

    const button = new Text(
      'TOUCH TO START',
      new TextStyle({
        fontFamily: 'MisakiGothic',
        fontSize: 64,
        fill: 0xffffff,
        padding: 12,
      })
    );
    button.anchor.set(0.5, 0.5);
    button.position.set(renderer.width * 0.5, renderer.height * 0.6);
    this.addChild(button);
    this.interactive = true;
    this.cursor = 'pointer';
    this.on('pointerdown', () => this.onPointerDown());
  }

  private async onPointerDown() {
    //次のシーン
    GameManager.instance.loadScene(await SelectionScene.create());
  }

  public update() {
    super.update();
  }
}
