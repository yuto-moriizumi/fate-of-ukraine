// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { jest } from '@jest/globals';
import { SaveData } from './game/data/SaveData';
import { GameManager } from './game/GameManager';
import { Dict, EventJson, SAVEDATA_TYPE } from './game/type/JsonType';
import { Observable } from './game/util/Observable';

const testCountry = {
  ABU: { name: 'Abu Dhabi', color: '#717060' },
  ADE: { name: 'Aden', color: '#ff1111' },
};
const testCountries = { countries: { ...testCountry } };
const testProvince = {
  '#cce598': { name: 'Sitka', x: 711, y: 1992, neighbors: [] },
  '#ccb399': { name: 'Yakutat', x: 669, y: 2017, neighbors: [] },
  '#ccb400': { name: 'Yakuta2', x: 670, y: 2017, neighbors: [] },
};
const testProvinces = { provinces: { ...testProvince } };
const testProvinceSaveData = {
  '#cce598': { owner: 'ABU' },
  '#ccb399': { owner: 'ADE' },
  '#ccb400': { owner: 'ABU' },
};
const testProvincesSaveData = {
  provinces: { ...testProvinceSaveData },
};
const testEvent: Dict<EventJson> = {
  russian_civilwar_begins: {
    triggeredOnly: false,
    condition: {
      type: 'And',
      conditions: [
        { type: 'DateCondition', date: '1917-11-07 01:00' },
        { type: 'CountryIs', country: 'ADE' },
      ],
    },
    title: '白軍への攻撃',
    desc: 'ロシアの各地には、反革命分子が潜んでいる。ただちに攻撃し、全ロシアを解放するのだ！',
    options: [
      {
        title: 'ブルジョワに死を！',
        effects: [
          { type: 'DeclareWar', root: 'ADE', target: 'ABU' },
          // {
          //   type: 'DispatchEvent',
          //   id: 'russian_civilwar_begins_news',
          //   hours2happen: 3,
          // },
        ],
      },
    ],
  },
  silent: {
    triggeredOnly: false,
    condition: {
      type: 'And',
      conditions: [
        { type: 'CountryIs', country: 'ADE' },
        { type: 'AtWarWith', country: 'ABU' },
        { type: 'Always', always: true },
      ],
    },
    immediate: [
      { type: 'Peace', root: 'ADE', target: 'ABU' },
      { type: 'GainAccess', root: 'ADE', target: 'ABU' },
    ],
  },
  silent2: {
    triggeredOnly: false,
    condition: {
      type: 'And',
      conditions: [{ type: 'EventFired', id: 'silent' }],
    },
    immediate: [{ type: 'SetOwner', root: 'ADE', provinces: ['#cce598'] }],
  },
};

const testEvents = {
  events: { ...testEvent },
};
// const testEventSaveData = {
//   russian_civilwar_begins: { fired: false },
// };
// const testEventsSaveData = { events: { ...testEventSaveData } };

test('国データのロードができる', () => {
  const data = new SaveData(testCountries);
  const countries = data.countries;
  expect(countries.get('ABU')).not.toBeNull();
  expect(countries.get('ABU')?.name.val).toBe(testCountry.ABU.name);
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

test('イベントのロードができる', () => {
  const data = new SaveData(testEvents);
  const events = data.events;
  expect(events.get('russian_civilwar_begins')).not.toBeUndefined();
});

describe('データのダウンロード', () => {
  window.URL.createObjectURL = jest.fn<typeof window.URL.createObjectURL>();

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

import { TitleScene } from './game/scene/TitleScene';
import { SelectionScene } from './game/scene/SelectionScene';
import { MainScene } from './game/scene/MainScene';
import dayjs from 'dayjs';
import { InvisibleEvent } from './game/event/InvisibleEvent';
// PIXI.settings.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT = false;

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
    data.loadJson(testEvents);
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

  test('メイン画面を1フレーム更新する', () => {
    const game = GameManager.instance;
    const scene = game.scene.val;
    expect(scene).toBeInstanceOf(MainScene);
    if (!(scene instanceof MainScene)) return;
    const data = GameManager.instance.data;
    data.onLoadEnd();
    scene.pause.val = false;
    while (scene.datetime.val.isBefore(dayjs('1917-11-07 03:00'))) {
      scene.update(1);
    }
    const event = data.events.get('russian_civilwar_begins');
    expect(event).not.toBeUndefined();
    if (event == undefined) return;
    expect(event.fired).toBe(true);
    console.log(data.diplomacy);
    const ADE = data.countries.get('ADE');
    expect(ADE).not.toBeUndefined();
    if (ADE == undefined) return;
    event.dispatch(ADE, dayjs('1917-11-07 03:00'));
    expect(ADE.hasWar(data.countries.get('ABU'))).toBe(true);
    // expect()
    while (scene.datetime.val.isBefore(dayjs('1917-11-07 05:00'))) {
      scene.update(1);
    }
    const slientEvent = data.events.get('silent');
    expect(slientEvent).toBeInstanceOf(InvisibleEvent);
    if (slientEvent == undefined) return;
    expect(slientEvent.fired).toBe(true);
    while (scene.datetime.val.isBefore(dayjs('1917-11-07 04:00'))) {
      scene.update(1);
    }
    const slientEvent2 = data.events.get('silent2');
    expect(slientEvent2).toBeInstanceOf(InvisibleEvent);
    if (slientEvent2 == undefined) return;
    expect(slientEvent2.fired).toBe(true);
  });
});
