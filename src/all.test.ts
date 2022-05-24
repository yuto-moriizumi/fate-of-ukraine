// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { jest } from '@jest/globals';
import { SaveData } from './game/data/SaveData';
import { GameManager } from './game/GameManager';
import { SAVEDATA_TYPE } from './game/type/JsonType';
import { Observable } from './game/util/Observable';

const testCountry = {
  ABU: { name: 'Abu Dhabi', color: '#717060' },
};
const testCountries = { countries: { ...testCountry } };
const testProvince = {
  '#cce598': { name: 'Sitka', x: 711, y: 1992 },
};
const testProvinces = { provinces: { ...testProvince } };
const testProvinceSaveData = {
  '#cce598': { owner: 'ABU' },
};
const testProvincesSaveData = { provinces: { ...testProvinceSaveData } };

test('国データのロードができる', () => {
  const data = new SaveData(testCountries);
  const countries = data.countries;
  expect(countries.get('ABU')).not.toBeNull();
  expect(countries.get('ABU')?.name).toBe(testCountry.ABU.name);
  expect(data.toJson(SAVEDATA_TYPE.GAMEDATA).countries).toStrictEqual(
    testCountry
  );
  data.loadJson(testProvincesSaveData);
  const provinces = data.provinces;
  const province = provinces.get('#cce598');
  expect(province).not.toBeUndefined();
  if (province == undefined) return;
  // console.log(province.owner);
  // expect(province?.owner).toBe(countries.get('ABU'));
});

test('プロヴィンスのロードができる', () => {
  const data = new SaveData();
  data.loadJson(testProvinces);
  const provinces = data.provinces;
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

test('汎用オブザーバブルのテスト', () => {
  const observable = new Observable(0);
  const myMockFn = jest.fn((num: number) => console.log(num));
  observable.addObserver(myMockFn);
  observable.val = 2;
  expect(observable.val).toBe(2);
  expect(myMockFn).toBeCalledWith(2);
  observable.removeObserver(myMockFn);
  observable.val = 1;
  expect(myMockFn).not.lastCalledWith(1);
});
import * as PIXI from 'pixi.js-legacy';
import { MapViewport } from './game/container/MapViewport';
import { TitleScene } from './game/scene/TitleScene';
import { SelectionScene } from './game/scene/SelectionScene';
import { MainScene } from './game/scene/MainScene';
import exp from 'constants';
PIXI.settings.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT = false;

describe('pixi.jsのテスト', () => {
  GameManager.start({
    glWidth: document.body.offsetWidth,
    glHeight: document.body.offsetHeight,
    backgroundColor: 0x222222,
  });

  test('タイトル画面が表示されている', () => {
    expect(GameManager.instance.scene.val).toBeInstanceOf(TitleScene);
  });

  test('国選択画面をロードできる', () => {
    (GameManager.instance.scene.val as any).onPointerDown();
    expect(GameManager.instance.scene.val).toBeInstanceOf(SelectionScene);
  });

  test('国を選択してメイン画面に遷移する', () => {
    const game = GameManager.instance;
    const scene = game.scene.val;
    expect(scene).toBeInstanceOf(SelectionScene);
    if (!(scene instanceof SelectionScene)) return;
    const data = game.data;
    data.loadJson(testProvinces);
    data.loadJson(testProvincesSaveData);
    data.loadJson(testCountries);
    const selectProvince = game.data.provinces.get('#cce598');
    expect(selectProvince).not.toBeUndefined();
    if (selectProvince == undefined) return;
    scene.selectedProvince.val = selectProvince;
    const owner = selectProvince.owner;
    expect(owner).not.toBeUndefined();
    if (owner == undefined) return;
    expect(owner.id).toBe('ABU');
    scene.play();
    expect(game.scene.val).toBeInstanceOf(MainScene);
  });
});
