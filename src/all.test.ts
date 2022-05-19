// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { jest } from '@jest/globals';
import { SaveData } from './game/data/SaveData';
import { SAVEDATA_TYPE } from './game/type/JsonType';

const testCountry = {
  ABU: { name: 'Abu Dhabi', color: '#717060' },
};
const testCountries = { countries: { ...testCountry } };
const testProvince = {
  '#cce598': { name: 'Sitka', x: 711, y: 1992 },
};
const testProvinces = { provinces: { ...testProvince } };

test('国データのロードができる', () => {
  const data = new SaveData(testCountries);
  const countries = data.getCountries();
  expect(countries.get('ABU')).not.toBeNull();
  expect(countries.get('ABU')?.name).toBe(testCountry.ABU.name);
  expect(data.toJson(SAVEDATA_TYPE.GAMEDATA).countries).toStrictEqual(
    testCountry
  );
});

test('プロヴィンスのロードができる', () => {
  const data = new SaveData();
  data.loadJson(testProvinces);
  const provinces = data.getProvinces();
  expect(provinces.get('#cce598')).not.toBeNull();
  expect(provinces.get('#cce598')?.name).toBe(testProvince['#cce598'].name);
  const output = data.toJson(SAVEDATA_TYPE.GAMEDATA);
  expect(output.provinces).toStrictEqual(testProvince);
});

describe('データのダウンロード', () => {
  window.URL.createObjectURL = jest.fn();

  afterEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window.URL.createObjectURL as any).mockReset();
  });

  test('データのダウンロード', () => {
    new SaveData({ ...testCountries, ...testProvince }).download(
      SAVEDATA_TYPE.GAMEDATA
    );
  });
});
