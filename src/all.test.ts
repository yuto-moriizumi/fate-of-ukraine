import jest from 'jest';
import { SaveData } from './game/data/SaveData';
import { Test } from './game/Test';
// import * as PIXI from 'pixi.js-legacy';

test('fizzbuzzのユニットテスト', () => {
  expect(Test.test(1)).toBe(2);
});

test('国データのロードができる', () => {
  const data = new SaveData();
  const testCountry = {
    ABU: { name: 'Abu Dhabi', color: '#717060' },
  };
  data.loadJson({ countries: { ...testCountry } });
  const countries = data.getCountries();
  expect(countries.get('ABU')).not.toBeNull();
  expect(countries.get('ABU')?.name).toBe(testCountry.ABU.name);
});

test('プロヴィンスのロードができる', () => {
  const data = new SaveData();
  const testProvince = {
    '#cce598': { name: 'Sitka', x: 711, y: 1992 },
  };
  data.loadJson({ provinces: { ...testProvince } });
  const countries = data.getProvinces();
  expect(countries.get('#cce598')).not.toBeNull();
  expect(countries.get('#cce598')?.name).toBe(testProvince['#cce598'].name);
});
