import { MapViewport } from '../container/MapViewport';
import { data } from '../GameManager';
import { ProvinceJson, SaveDataType, SAVEDATA_TYPE } from '../type/JsonType';
import { Serializable } from '../util/Serializable';
import { Country } from './Country';

export class Province implements Serializable {
  public readonly id!: string;
  private _name!: string;
  private ownerId!: string | undefined;
  public x = 0;
  public y = 0;
  private _neighbors!: Set<string>;

  constructor(id: string) {
    this.id = id;
  }

  public get owner() {
    if (this.ownerId) return data().countries.get(this.ownerId);
  }

  public set owner(owner: Country | undefined) {
    const prev = this.owner;
    this.ownerId = owner?.id;
    MapViewport.instance.updateMap();
    if (prev && prev.provinces.length === 0) prev.destroy();
  }

  public get name() {
    return this._name;
  }

  public get neighbors() {
    return [...this._neighbors]
      .map((id) => data().provinces.get(id))
      .filter((p) => p !== undefined) as Province[];
  }

  public get outgoingCombats() {
    return [...data().combats].filter((c) => c.attackFrom === this);
  }

  public get incomingCombats() {
    return [...data().combats].filter((c) => c.defenceAt === this);
  }

  public get divisions() {
    return [...data().countries.values()]
      .map((c) => [...c.divisions].filter((d) => d.at === this))
      .reduce((a, b) => a.concat(b));
  }

  public isNextTo(province: Province): boolean {
    return [...this._neighbors].some((p) => p === province.id);
  }

  public toJson(as: SaveDataType): ProvinceJson | undefined {
    switch (as) {
      case SAVEDATA_TYPE.GAMEDATA:
        return {
          name: this._name,
          x: this.x,
          y: this.y,
          neighbors: [...this._neighbors],
        };
      case SAVEDATA_TYPE.SAVEDATA:
        return { owner: this.ownerId };
    }
    return undefined;
  }

  public loadJson(json: ProvinceJson) {
    if ('x' in json) {
      this._name = json.name;
      this.x = json.x;
      this.y = json.y;
      this._neighbors = new Set(json.neighbors);
    } else if ('owner' in json) this.ownerId = json.owner;
    return this;
  }
}
