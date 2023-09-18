import { Country } from '../data/Country';
import {
  DivisionMovement,
  MoveType,
  MOVE_TYPE,
} from '../data/DivisionMovement';
import { Province } from '../data/Provice';
import { data } from '../GameManager';
import Util from '../util/Util';
import { MapViewport } from './MapViewport';
import { Assets, Container, Texture, Sprite } from 'pixi.js';

export class Division extends Container {
  private static readonly WIDTH = 10;
  private static readonly ICON = 'Light Infantry.png';
  private _hp = 100;
  private readonly max_hp = 100;
  private readonly offense = 4;
  public readonly speed = 10;
  public readonly owner: Country;
  private _at!: Province;
  private _movement?: DivisionMovement;

  constructor(owner: Country, at: Province) {
    super();
    this.owner = owner;
    this.at = at;
    this.interactive = true;
    this.sortableChildren = true;

    Assets.load<Texture>(Division.ICON).then((resource) => {
      const sprite = new Sprite(resource);
      sprite.anchor.set(0.5);
      this.addChild(sprite);
      sprite.scale.set(Division.WIDTH / this.width);
      MapViewport.instance.addChild(this);
    });

    this.on('click', () => {
      // const scene = GameManager.instance.scene;
      // if (!(scene.val instanceof MainScene)) return;
      // scene.val.selectedDivision = this;
      // TODO: 師団選択をストアに突っ込む
    });
  }

  set at(at: Province) {
    this._at = at;
    this.x = at.x;
    this.y = at.y;
    if (at.owner?.hasWar(this.owner)) at.owner = this.owner;
    // 新規位置で防衛戦が発生している場合は参加
    at.incomingCombats.forEach((c) => c.addDefender(this));
  }

  get at() {
    return this._at;
  }

  get hp() {
    return this._hp;
  }

  get combats() {
    return [...data().combats].filter((c) => c.contains(this));
  }

  get movement() {
    return this._movement;
  }

  get isRetreating() {
    return (
      this._movement !== undefined && this._movement.type === MOVE_TYPE.RETREAT
    );
  }

  public update() {
    if (this.movement) this.movement.update();
    if (
      this.movement?.type === MOVE_TYPE.RETREAT ||
      this.movement === undefined
    )
      this._hp = Math.min(this.max_hp, this._hp + this.max_hp * 0.1);
  }

  public stop() {
    this._movement?.destroy();
    this._movement = undefined;
  }

  public setDestination(province: Province, type: MoveType) {
    if (this._movement) {
      if (this._movement.destination === province) return;
      this._movement.destroy();
    }
    this._movement = new DivisionMovement(this, type, province);
  }

  public retreat() {
    const destinationCandidates = [...this._at.neighbors].filter(
      (p) => p.owner !== undefined && this.owner.hasAccessTo(p.owner, true)
    );
    if (destinationCandidates.length === 0) {
      this.destroy();
      return;
    }
    const destination = Util.getRandom(destinationCandidates);
    if (destination === undefined) {
      console.error('retreat destination not found', this);
      return;
    }
    this.setDestination(destination, MOVE_TYPE.RETREAT);
  }

  public attack(division: Division, weight: number) {
    division._hp -= this.offense * weight;
  }

  public destroy() {
    super.destroy();
    this.owner.divisions.delete(this);
  }
}
