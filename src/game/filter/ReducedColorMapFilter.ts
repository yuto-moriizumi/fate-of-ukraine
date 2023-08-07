import { Filter } from '@pixi/core';
import { hex2rgb, rgb2hex } from '@pixi/utils';
import { TextureSource, Texture, SCALE_MODES, MIPMAP_MODES } from 'pixi.js';

type Color = number | number[] | Float32Array;

type ColorMapSource = TextureSource | Texture | null;

/**
 * Filter for replacing a color with another color. Similar to ColorReplaceFilter, but support multiple
 * colors.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/multi-color-replace.png)
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-multi-color-replace|@pixi/filter-multi-color-replace}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 *
 * @example
 *  // replaces pure red with pure blue, and replaces pure green with pure white
 *  someSprite.filters = [new MultiColorReplaceFilter(
 *    [
 *      [0xFF0000, 0x0000FF],
 *      [0x00FF00, 0xFFFFFF]
 *    ],
 *    0.001
 *  )];
 *
 *  You also could use [R, G, B] as the color
 *  someOtherSprite.filters = [new MultiColorReplaceFilter(
 *    [
 *      [ [1,0,0], [0,0,1] ],
 *      [ [0,1,0], [1,1,1] ]
 *    ],
 *    0.001
 *  )];
 *
 */
export class ReducedColorMapFilter extends Filter {
  private _replacements: Array<[Color, Color]> = [];
  private _maxColors = 0;
  private _colorMap: Texture | null = null;
  private _size = 0;
  private _sliceSize = 0;
  private _slicePixelSize = 0;
  private _sliceInnerSize = 0;
  private _nearest = false;
  private _scaleMode: SCALE_MODES | null = null;

  /**
   * @param {Array<Array>} replacements - The collection of replacement items. Each item is color-pair
   *        (an array length is 2). In the pair, the first value is original color , the second value
   *        is target color.
   * @param {number} [epsilon=0.05] - Tolerance of the floating-point comparison between colors
   *        (lower = more exact, higher = more inclusive)
   * @param {number} [maxColors] - The maximum number of replacements filter is able to use. Because the
   *        fragment is only compiled once, this cannot be changed after construction.
   *        If omitted, the default value is the length of `replacements`.
   */
  constructor(
    // replacements: Array<[Color, Color]>,
    // epsilon = 0.05,
    // maxColors: number = replacements.length
    colorMap: ColorMapSource
  ) {
    super(vert, frag);
    this.colorMap = colorMap;
    // this.epsilon = epsilon;
    // this._maxColors = maxColors;
    // this.uniforms.originalColors = new Float32Array(maxColors * 3);
    // this.uniforms.targetColors = new Float32Array(maxColors * 3);
    // this.uniforms.testColors = new Float32Array(3);
    // this.replacements = replacements;
  }

  /**
   * the colorMap texture
   * @member {PIXI.Texture}
   */
  get colorMap(): ColorMapSource {
    return this._colorMap;
  }
  set colorMap(colorMap: ColorMapSource) {
    if (!colorMap) {
      return;
    }
    if (!(colorMap instanceof Texture)) {
      colorMap = Texture.from(colorMap);
    }
    if ((colorMap as Texture)?.baseTexture) {
      colorMap.baseTexture.scaleMode = this._scaleMode as SCALE_MODES;
      colorMap.baseTexture.mipmap = MIPMAP_MODES.OFF;

      this._size = colorMap.height;
      this._sliceSize = 1 / this._size;
      this._slicePixelSize = this._sliceSize / this._size;
      this._sliceInnerSize = this._slicePixelSize * (this._size - 1);

      this.uniforms._size = this._size;
      this.uniforms._sliceSize = this._sliceSize;
      this.uniforms._slicePixelSize = this._slicePixelSize;
      this.uniforms._sliceInnerSize = this._sliceInnerSize;

      this.uniforms.colorMap = colorMap;
    }

    this._colorMap = colorMap;
  }

  /**
   * If the colorMap is based on canvas , and the content of canvas has changed,
   *   then call `updateColorMap` for update texture.
   */
  updateColorMap(): void {
    const texture = this._colorMap;

    if (texture && texture.baseTexture) {
      texture._updateID++;
      texture.baseTexture.emit('update', texture.baseTexture);

      this.colorMap = texture;
    }
  }

  /**
   * Destroys this filter
   *
   * @param {boolean} [destroyBase=false] - Whether to destroy the base texture of colorMap as well
   */
  destroy(destroyBase = false): void {
    if (this._colorMap) {
      this._colorMap.destroy(destroyBase);
    }
    super.destroy();
  }

  /**
   * The source and target colors for replacement. See constructor for information on the format.
   *
   * @member {Array<Array>}
   */
  set replacements(replacements: Array<[Color, Color]>) {
    const originals = this.uniforms.originalColors;
    const targets = this.uniforms.targetColors;
    const tests = this.uniforms.testColors;
    const colorCount = replacements.length;

    if (colorCount > this._maxColors) {
      throw new Error(
        `Length of replacements (${colorCount}) exceeds the maximum colors length (${this._maxColors})`
      );
    }

    tests[0] = 1;
    tests[1] = 0;
    tests[2] = 0;

    // Fill with negative values
    originals[colorCount * 3] = -1;

    for (let i = 0; i < colorCount; i++) {
      const pair = replacements[i];

      // for original colors
      let color = pair[0];

      if (typeof color === 'number') {
        color = hex2rgb(color);
      } else {
        pair[0] = rgb2hex(color);
      }

      originals[i * 3] = color[0];
      originals[i * 3 + 1] = color[1];
      originals[i * 3 + 2] = color[2];

      // for target colors
      let targetColor = pair[1];

      if (typeof targetColor === 'number') {
        targetColor = hex2rgb(targetColor);
      } else {
        pair[1] = rgb2hex(targetColor);
      }

      targets[i * 3] = targetColor[0];
      targets[i * 3 + 1] = targetColor[1];
      targets[i * 3 + 2] = targetColor[2];
    }

    this._replacements = replacements;
  }
  get replacements(): Array<[Color, Color]> {
    return this._replacements;
  }

  /**
   * Should be called after changing any of the contents of the replacements.
   * This is a convenience method for resetting the `replacements`.
   */
  refresh(): void {
    this.replacements = this._replacements;
  }

  /**
   * The maximum number of color replacements supported by this filter. Can be changed
   * _only_ during construction.
   * @readonly
   */
  get maxColors(): number {
    return this._maxColors;
  }

  /**
   * Tolerance of the floating-point comparison between colors (lower = more exact, higher = more inclusive)
   * @default 0.05
   */
  set epsilon(value: number) {
    this.uniforms.epsilon = value;
  }
  get epsilon(): number {
    return this.uniforms.epsilon;
  }
}

const vert = `attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

void main(void)
{
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    vTextureCoord = aTextureCoord;
}`;

const frag = `varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform sampler2D colorMap;

void main(void)
{
    vec4 indexColor = texture2D(uSampler, vTextureCoord);
    gl_FragColor = texture2D(colorMap, indexColor.rg * 255.0 / 256.0 + vec2(0.001953125, 0.001953125));
}`;
