import * as PIXI from 'pixi.js';
import { Country } from '../data/Country';
import { DivisionMovement, MOVE_TYPE } from '../data/DivisionMovement';
import { Province } from '../data/Provice';
import { data, GameManager, loader } from '../GameManager';
import { MainScene } from '../scene/MainScene';
import Util from '../util/Util';
import { MapViewport } from './MapViewport';

export class Division extends PIXI.Container {
  private static readonly WIDTH = 10;
  private static readonly ICON = 'Light Infantry.png';
  private _hp = 100;
  private readonly max_hp = 100;
  private readonly offense = 10;
  private readonly speed = 10;
  private readonly owner: Country;
  private _at!: Province;
  private _movement?: DivisionMovement;

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

  set at(at: Province) {
    this._at = at;
    this.x = at.x;
    this.y = at.y;
  }

  get at() {
    return this._at;
  }

  get hp() {
    return this._hp;
  }

  get combats() {
    return [...data().combats].filter(
      (c) => c.attackers.has(this) || c.defenders.has(this)
    );
  }

  get movement() {
    return this._movement;
  }

  public update() {
    this._movement?.update();
  }

  public setDestination(destination: Province | undefined) {
    if (this._movement) {
      if (this._movement.destination === destination) return;
      this._movement.destroy();
    }
    this._movement =
      destination === undefined
        ? undefined
        : new DivisionMovement(this, MOVE_TYPE.MOVE, destination);
  }

  public retreat() {
    const destinationCandidates = [...this._at.neighbors].filter(
      (p) => p.owner !== undefined && this.owner.hasAccessTo(p.owner)
    );
    if (destinationCandidates.length === 0) {
      this.destroy();
      this.owner.divisions.delete(this);
      return;
    }
    const destination = Util.getRandom(destinationCandidates);
    if (destination === undefined) {
      console.error('retreat destination not found', this);
      return;
    }
    this._movement = new DivisionMovement(this, MOVE_TYPE.RETREAT, destination);
  }

  public attack(division: Division, weight: number) {
    division._hp -= this.offense / weight;
  }
}
