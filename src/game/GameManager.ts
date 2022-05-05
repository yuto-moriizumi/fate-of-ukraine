import * as PIXI from 'pixi.js';

export default class GameManager {
  public static instance: GameManager;
  public game!: PIXI.Application;

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

    const stage = GameManager.instance.game.stage;
    const renderer = GameManager.instance.game.renderer;
    stage.on('click', (e: any) => {
      console.log('clicked!');
    });
    stage.addListener('click', (e: any) => {
      console.log('clicked!');
    });
    let num = 0;
    const text = new PIXI.Text(
      num.toString(),
      new PIXI.TextStyle({
        fontSize: 80,
        fill: 0xffffff,
        padding: 12,
        dropShadow: true,
      })
    );
    text.anchor.set(0.5, 0.5);
    text.position.set(renderer.width * 0.5, renderer.height * 0.7);
    text.interactive = true;
    text.on('click', (e: any) => {
      num += 1;
      text.text = num.toString();
    });
    stage.addChild(text);

    const background = new PIXI.Graphics();
    background.beginFill(0x286b1e);
    background.drawRect(0, 0, 100, 800);
    background.interactive = true;
    // background.
    background.on('click', (e: any) => {
      console.log('clicked!');
    });
    stage.addChild(background);

    document.body.appendChild(game.view);
    // game.ticker.add((delta: number) => {
    //   if (this.instance.currentScene) {
    //     this.instance.currentScene.update(delta);
    //   }
    // });

    //右クリックのデフォ動作を力技で止める
    document.body.addEventListener(
      'contextmenu',
      function (ev) {
        ev.preventDefault();
        return false;
      },
      false
    );
  }
}
