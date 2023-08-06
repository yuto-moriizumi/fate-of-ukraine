import { Container } from 'pixi.js';

export abstract class Scene extends Container {
  elapsedFrameCount = 0;
  //GameManagerによって、requestAnimationFrame毎に呼び出されるメソッド
  public update(delta: number) {
    this.elapsedFrameCount++;
  }
}
