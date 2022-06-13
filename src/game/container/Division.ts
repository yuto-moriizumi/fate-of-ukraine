import * as PIXI from 'pixi.js';
import { Country } from '../data/Country';
import { Province } from '../data/Provice';
import { MapViewport } from './MapViewport';

export class Division extends PIXI.Container {
  private readonly hp = 100;
  private readonly max_hp = 100;
  private readonly attack = 10;
  private readonly speed = 10;
  private readonly owner: Country;
  private readonly at: Province;
  constructor(owner: Country, at: Province) {
    super();
    this.owner = owner;
    this.at = at;
    this.x = at.x;
    this.y = at.y;
    console.log('created division at', at);
    this.addChild(PIXI.Sprite.from('./assets/Light Infantry.png'));
    MapViewport.instance.addChild(this);
  }
}
