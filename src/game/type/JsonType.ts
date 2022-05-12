export type JsonType = 'GameData' | 'SaveData';

export type GameDataJson = {
  provinces?: ProvinceJson;
  countries?: CountryJson;
};

export type ProvinceJson = {
  [id: string]: { name: string; x: number; y: number };
};

export type CountryJson = {
  [id: string]: { name: string; color: string };
};
