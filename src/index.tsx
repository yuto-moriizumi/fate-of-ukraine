import * as React from 'react';
import ReactDOM from 'react-dom/client';
import './ui/index.css';
import App from './ui/App';
import reportWebVitals from './ui/reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import { GameManager } from './game/GameManager';
import { create } from 'zustand';
import { Scene } from './game/scene/Scene';
import { produce as untypedProduce } from 'immer';
import { Province } from './game/data/Provice';
import { VisibleEvent } from './game/event/VisibleEvent';
import { Country } from './game/data/Country';

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
  const getSetterObject2 = (
    key1: 'country',
    key2: keyof Store[typeof key1]
  ) => ({
    set: (val: Store[typeof key1][typeof key2]['val']) =>
      update(
        produce((state) => {
          state[key1][key2].val = val;
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
      root: getSetterObject2('country', 'root'),
      target: getSetterObject2('country', 'target'),
    },
    events: {
      val: [],
      add: (event) =>
        update(
          produce((state) => {
            state.events.val.push(event);
          })
        ),
      remove: (event) =>
        update(
          produce((state) => {
            state.events.val = state.events.val.filter((e) => e !== event);
          })
        ),
    },
  };
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

window.onload = () => {
  GameManager.start(
    {
      glWidth: document.body.offsetWidth,
      glHeight: document.body.offsetHeight,
      backgroundColor: 0x222222,
    },
    useStore
  );
};
