import React, { useEffect, useState } from 'react';
import './App.css';
import { Container } from 'react-bootstrap';
import { GameManager } from '../game/GameManager';
import { Scene } from '../game/scene/Scene';
import { SelectionScene } from '../game/scene/SelectionScene';
import SelectionSceneUI from './component/SelectionSceneUI';
import MainSceneUI from './component/MainSceneUI';
import { MainScene } from '../game/scene/MainScene';

function App() {
  const [currentScene, setCurrentScene] = useState<Scene>();

  const addSceneObserver = () => {
    GameManager._instance.scene.addObserver(setCurrentScene);
  };

  useEffect(() => {
    if (!GameManager._instance)
      // ゲームのロードが終わって居ない場合はコールバック関数を追加
      GameManager.onLoadEnd = addSceneObserver;
    else addSceneObserver(); // ゲームのロードが終わっている場合は即座にオブザーバを追加
  }, []);

  return (
    <Container fluid className="h-100">
      {currentScene instanceof SelectionScene ? (
        <SelectionSceneUI scene={currentScene} />
      ) : currentScene instanceof MainScene ? (
        <MainSceneUI scene={currentScene} />
      ) : (
        ''
      )}
    </Container>
  );
}

export default App;
