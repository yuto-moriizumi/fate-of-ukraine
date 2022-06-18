import * as PIXI from 'pixi.js';
import { Country } from '../data/Country';
import { DivisionMovement, MOVE_TYPE } from '../data/DivisionMovement';
import { Province } from '../data/Provice';
import { GameManager, loader } from '../GameManager';
import { MainScene } from '../scene/MainScene';
import { MapViewport } from './MapViewport';

export class Division extends PIXI.Container {
  private static readonly WIDTH = 10;
  private static readonly ICON = 'Light Infantry.png';
  private readonly hp = 100;
  private readonly max_hp = 100;
  private readonly attack = 10;
  private readonly speed = 10;
  private readonly owner: Country;
  private _at!: Province;
  private movement?: DivisionMovement;

  constructor(owner: Country, at: Province) {
    super();
    this.owner = owner;
    this.at = at;
    console.log('created division at', at);
    this.interactive = true;
    this.sortableChildren = true;

    loader().load(Division.ICON, (resource) => {
      const sprite = new PIXI.Sprite(resource.texture);
      sprite.anchor.set(0.5);
      this.addChild(sprite);
      sprite.scale.set(Division.WIDTH / this.width);
      MapViewport.instance.addChild(this);
    });

    this.on('click', () => {
      const scene = GameManager.instance.scene;
      if (!(scene.val instanceof MainScene)) return;
      scene.val.selectedDivision = this;
    });
  }

  set destination(destination: Province | undefined) {
    if (this.movement) {
      if (this.movement.destination === destination) return;
      this.movement.destroy();
    }
    this.movement =
      destination === undefined
        ? undefined
        : new DivisionMovement(this, MOVE_TYPE.MOVE, destination);
  }

  set at(at: Province) {
    this._at = at;
    this.x = at.x;
    this.y = at.y;
  }

  get at() {
    return this._at;
  }

  public update() {
    this.movement?.update();
  }
}
