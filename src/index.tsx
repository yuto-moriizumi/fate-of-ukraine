import * as React from 'react';
import ReactDOM from 'react-dom/client';
import './ui/index.css';
import App from './ui/App';
import reportWebVitals from './ui/reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import { GameManager } from './game/GameManager';

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
  GameManager.start({
    glWidth: document.body.offsetWidth,
    glHeight: document.body.offsetHeight,
    backgroundColor: 0x222222,
  });
};
