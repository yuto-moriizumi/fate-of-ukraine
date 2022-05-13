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

export type ProvinceJson = {
  name: string;
  x: number;
  y: number;
};

export type CountryDictJson = {
  [id: string]: CountryJson;
};

export type CountryJson = {
  name: string;
  color: string;
};
