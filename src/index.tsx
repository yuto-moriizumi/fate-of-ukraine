import * as React from 'react';
import ReactDOM from 'react-dom/client';
import './ui/index.css';
import App from './ui/App';
import reportWebVitals from './ui/reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import { GameManager } from './game/GameManager';
import { create } from 'zustand';
import { Scene } from './game/scene/Scene';
import { produce } from 'immer';
import { Province } from './game/data/Provice';

type SettableValue<T> = {
  val?: T;
  set: (val: T) => void;
};

export type Store = {
  scene: SettableValue<Scene>;
  province: SettableValue<Province>;
};

export const useStore = create<Store>((update) => {
  const getSetterObject = (key: keyof Store) => ({
    set: (val: Store[typeof key]['val']) =>
      update(
        produce((state: Store) => {
          state[key].val = val;
        })
      ),
  });
  return {
    scene: getSetterObject('scene'),
    province: getSetterObject('province'),
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
