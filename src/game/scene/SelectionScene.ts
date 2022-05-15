import { MapViewport } from '../container/MapViewport';
import { Province } from '../data/Provice';
import { Observable } from '../util/Observable';
import { Scene } from './Scene';

export class SelectionScene extends Scene {
  private map: MapViewport;
  private _selectedProvince = new Observable<Province>();

  public get selectedProvince() {
    return this._selectedProvince;
  }

  constructor() {
    super();
    const MAP_SRC = 'assets/provinces.png';
    this.map = new MapViewport(MAP_SRC, this._selectedProvince);
    this.addChild(this.map);
  }

  update() {
    return;
  }
}
