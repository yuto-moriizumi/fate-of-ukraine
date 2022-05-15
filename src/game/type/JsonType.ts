export const SAVEDATA_TYPE = {
  GAMEDATA: 'GameData',
  SAVEDATA: 'SaveData',
} as const;

// type SizeType = "small" | "medium" | "large"
export type SaveDataType = typeof SAVEDATA_TYPE[keyof typeof SAVEDATA_TYPE];

export type SaveDataJson = {
  provinces?: ProvinceDictJson;
  countries?: CountryDictJson;
};

export type ProvinceDictJson = {
  [id: string]: ProvinceJson;
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

export type CountryDictJson = {
  [id: string]: CountryJson;
};

export type CountryJson = GameDataCountryJson | SaveDataCountryJson;

export type GameDataCountryJson = {
  name: string;
  color: string;
};

export type SaveDataCountryJson = {
  money: number;
};
