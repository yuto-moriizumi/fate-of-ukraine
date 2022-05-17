export const SAVEDATA_TYPE = {
  GAMEDATA: 'GameData',
  SAVEDATA: 'SaveData',
} as const;

export type SaveDataType = typeof SAVEDATA_TYPE[keyof typeof SAVEDATA_TYPE];

export type Json =
  | SaveDataJson
  | DictJson
  | CountryJson
  | SaveDataProvinceJson
  | ProvinceJson
  | EventJson
  | ConditionJson
  | EffectJson
  | OptionJson;

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

export type EventJson = GameDataEventJson | SaveDataEventJson;

export type GameDataEventJson = {
  title: string;
  desc: string;
  hidden: boolean;
  triggeredOnly: boolean;
  condition: ConditionJson;
  immediate: EffectJson[];
  options: OptionJson[];
};

export type SaveDataEventJson = {
  fired: boolean;
};

export type ConditionJson =
  | ConditionBaseJson
  | AlwaysJson
  | AndJson
  | AtWarWithJson
  | CountryIsJson
  | DateConditionJson
  | EventFiredJson
  | OwnProvinceJson;

export const CONDITION_TYPE = {
  ALWAYS: 'Always',
  AND: 'And',
  AT_WAR_WITH: 'AtWarWith',
  COUNTRY_IS: 'CountryIs',
  DATE_CONDITION: 'DateCondition',
  EVENT_FIRED: 'EventFired',
  OWN_PROVINCE: 'OwnProvince',
} as const;

export type ConditionType = typeof CONDITION_TYPE[keyof typeof CONDITION_TYPE];

export type ConditionBaseJson = {
  type: ConditionType;
};

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

export const EFFECT_TYPE = {
  ANNEX: 'Annex',
  CHANGE_NAME: 'ChangeName',
  DECLARE_WAR: 'DeclareWar',
  DISPATCH_EVENT: 'DispatchEvent',
  GAIN_ACCESS: 'GainAccess',
  PEACE: 'Peace',
  SET_OWNER: 'SetOwner',
} as const;

export type EffectType = typeof EFFECT_TYPE[keyof typeof EFFECT_TYPE];

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
  title: string;
  effects: EffectJson[];
};

export type DiplomacyJson = {
  type: 'Access' | 'Alliance' | 'War';
  root: string;
  target: string;
  active: boolean;
};
