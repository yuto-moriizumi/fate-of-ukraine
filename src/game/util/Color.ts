// eslint-disable-next-line no-restricted-imports
import { Color as PixiColor, ColorSource } from 'pixi.js';

/** pixi.js/Colorは与えられた配列に対し破壊的変更を行うため、こちらのラッパークラスを通して使用すること */
export class Color extends PixiColor {
  constructor(arg: ColorSource) {
    super(arg instanceof Array ? arg.slice() : arg);
  }
}
