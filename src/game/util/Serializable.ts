import { DataType } from '../type/DataType';

export interface Serializable {
  toJson(as: DataType): string;
  loadJson(json: object): string;
}
