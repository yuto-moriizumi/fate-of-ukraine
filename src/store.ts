import { create } from 'zustand';
import { Country } from './game/data/Country';
import { Province } from './game/data/Provice';
import { VisibleEvent } from './game/event/VisibleEvent';
import { Scene } from './game/scene/Scene';
import { produce as untypedProduce } from 'immer';
import dayjs, { Dayjs } from 'dayjs';

const START_DATE = '1917/11/07 1:00';
export const MAX_SPEED = 5;
const MIN_SPEED = 1;

type SettableValue<T> = {
  val?: T;
  set: (val: T) => void;
};

export type Store = {
  scene: SettableValue<Scene>;
  province: SettableValue<Province>;
  country: {
    /** プレイ中の国。MainScene以降は必ず値が入る */
    root: SettableValue<Country>;
    /** 選択中の国 */
    target: SettableValue<Country>;
  };
  events: {
    val: VisibleEvent[];
    add: (event: VisibleEvent) => void;
    remove: (event: VisibleEvent) => void;
  };
  timer: {
    current: {
      val: Dayjs;
      set: (val: Dayjs) => void;
    };
    pause: {
      val: boolean;
      toggle: () => void;
    };
    speed: {
      val: number;
      increase: () => void;
      decrease: () => void;
    };
  };
};

const produce = untypedProduce<(state: Store) => unknown>;

export const useStore = create<Store>((update) => {
  const getSetterObject1 = (key: 'scene' | 'province') => ({
    set: (val: Store[typeof key]['val']) =>
      update(
        produce((state) => {
          state[key].val = val;
        })
      ),
  });
  const getSetterObject2 = <
    K1 extends 'country' | 'timer',
    K2 extends keyof Store[K1],
    K3 extends keyof Store[K1][K2]
  >(
    key1: K1,
    key2: K2,
    key3: K3
  ) => ({
    set: (val: Store[K1][K2][K3]) =>
      update(
        produce((state) => {
          state[key1][key2][key3] = val;
        })
      ),
  });
  return {
    scene: getSetterObject1('scene'),
    province: {
      set: (val) =>
        update(
          produce((state) => {
            state.province.val = val;
            state.country.target.val = val.owner;
          })
        ),
    },
    country: {
      root: {
        set: (val) =>
          update(
            produce(({ country }) => {
              country.root.val = val;
            })
          ),
      },
      target: getSetterObject2('country', 'target', 'val'),
    },
    events: {
      val: [],
      add: (event) =>
        update(
          produce(({ events }) => {
            events.val.push(event);
          })
        ),
      remove: (event) =>
        update(
          produce(({ events }) => {
            events.val = events.val.filter((e) => e !== event);
          })
        ),
    },
    timer: {
      current: {
        ...getSetterObject2('timer', 'current', 'val'),
        val: dayjs(START_DATE),
      },
      pause: {
        val: true,
        toggle: () =>
          update(
            produce(({ timer }) => {
              timer.pause.val = !timer.pause.val;
            })
          ),
      },
      speed: {
        val: 3,
        increase: () =>
          update(
            produce(({ timer }) => {
              timer.speed.val = Math.min(timer.speed.val + 1, MAX_SPEED);
            })
          ),
        decrease: () =>
          update(
            produce(({ timer }) => {
              timer.speed.val = Math.max(timer.speed.val - 1, MIN_SPEED);
            })
          ),
      },
    },
  };
});
