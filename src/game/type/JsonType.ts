export const SAVEDATA_TYPE = {
  GAMEDATA: 'GameData',
  SAVEDATA: 'SaveData',
} as const;

// type SizeType = "small" | "medium" | "large"
export type SaveDataType = typeof SAVEDATA_TYPE[keyof typeof SAVEDATA_TYPE];

export type Json =
  | SaveDataJson
  | DictJson
  | CountryJson
  | SaveDataProvinceJson
  | ProvinceJson;

export type SaveDataJson = {
  provinces?: Dict<ProvinceJson>;
  countries?: Dict<CountryJson>;
  events?: Dict<EventJson>;
};

export type ProvinceJson = GameDataProvinceJson | SaveDataProvinceJson;

export type GameDataProvinceJson = {
  name: string;
  x: number;
  y: number;
};

export type SaveDataProvinceJson = {
  owner?: string;
};

export type Dict<T> = {
  [id: string]: T;
};

export type DictJson = Dict<ProvinceJson> | Dict<CountryJson> | Dict<EventJson>;

export type CountryJson = GameDataCountryJson | SaveDataCountryJson;

export type GameDataCountryJson = {
  name: string;
  color: string;
};

export type SaveDataCountryJson = {
  money: number;
};

export type EventJson = {
  title: string;
  desc: string;
  hidden: boolean;
  triggeredOnly: boolean;
  fired: boolean;
  condition: ConditionJson[];
  immediate: EffectJson[];
  options: OptionJson[];
};

export type ConditionJson =
  | AlwaysJson
  | AndJson
  | AtWarWithJson
  | CountryIsJson
  | DateConditionJson
  | EventFiredJson
  | OwnProvinceJson;

export type AlwaysJson = {
  type: 'Always';
  always: boolean;
};

export type AndJson = {
  type: 'And';
  conditions: ConditionJson[];
};

export type AtWarWithJson = {
  type: 'AtWarWith';
  country: string;
};

export type CountryIsJson = {
  type: 'CountryIs';
  country: string;
};

export type DateConditionJson = {
  type: 'DateCondition';
  date: string;
};

export type EventFiredJson = {
  type: 'EventFired';
  id: string;
};

export type OwnProvinceJson = {
  type: 'OwnProvince';
  province: string;
};

export type EffectJson =
  | AnnexJson
  | ChangeNameJson
  | DeclareWarJson
  | DispatchEventJson
  | GainAccessJson
  | PeaceJson
  | SetOwnerJson;

export type AnnexJson = {
  type: 'Annex';
  root: string;
  target: string;
};

export type ChangeNameJson = {
  type: 'ChangeName';
  country: string;
  name: string;
};

export type DeclareWarJson = {
  type: 'DeclareWar';
  root: string;
  target: string;
};

export type DispatchEventJson = {
  type: 'DispatchEvent';
  id: string;
  time2happen: number;
};

export type GainAccessJson = {
  type: 'GainAccess';
  root: string;
  target: string;
};

export type PeaceJson = {
  type: 'Peace';
  root: string;
  target: string;
};

export type SetOwnerJson = {
  type: 'SetOwner';
  root: string;
  provinces: string[];
};

export type OptionJson = {
  type: 'Option';
  title: string;
  effects: EffectJson[];
};

export type DiplomacyJson = {
  type: 'Access' | 'Alliance' | 'War';
  root: string;
  target: string;
  active: boolean;
};
