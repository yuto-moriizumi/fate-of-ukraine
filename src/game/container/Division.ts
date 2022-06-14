import * as PIXI from 'pixi.js';
import { Country } from '../data/Country';
import { DivisionMovement, MOVE_TYPE } from '../data/DivisionMovement';
import { Province } from '../data/Provice';
import { loader } from '../GameManager';
import { MapViewport } from './MapViewport';

export class Division extends PIXI.Container {
  private static readonly WIDTH = 10;
  private static readonly ICON = 'Light Infantry.png';
  private readonly hp = 100;
  private readonly max_hp = 100;
  private readonly attack = 10;
  private readonly speed = 10;
  private readonly owner: Country;
  private readonly at: Province;
  private movement?: DivisionMovement;

  constructor(owner: Country, at: Province) {
    super();
    this.owner = owner;
    this.at = at;
    this.x = at.x - Division.WIDTH / 2;
    this.y = at.y - Division.WIDTH / 2;
    console.log('created division at', at);

    loader().load(Division.ICON, (resource) => {
      this.addChild(new PIXI.Sprite(resource.texture));
      this.scale.set(Division.WIDTH / this.width);
      MapViewport.instance.addChild(this);
    });
  }

  set destination(destination: Province) {
    this.movement = new DivisionMovement(MOVE_TYPE.MOVE, destination);
  }
}
