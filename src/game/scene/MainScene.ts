import { MapViewport } from '../container/MapViewport';
import { Country } from '../data/Country';
import { Province } from '../data/Provice';
import { GameManager } from '../GameManager';
import { Observable } from '../util/Observable';
import { Scene } from './Scene';

export class MainScene extends Scene {
  private map: MapViewport;
  public readonly playAs: Country;
  private _selectedProvince = new Observable<Province>();

  public get selectedProvince() {
    return this._selectedProvince;
  }

  constructor(playAs: Country) {
    super();
    this.playAs = playAs;
    this.map = new MapViewport(this._selectedProvince);
    this.addChild(this.map);
  }

  update() {
    return;
  }
}
