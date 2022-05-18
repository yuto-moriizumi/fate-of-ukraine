import React, { useEffect, useState } from 'react';
import './App.css';
import { Container } from 'react-bootstrap';
import { GameManager } from '../game/GameManager';
import { Scene } from '../game/scene/Scene';
import { SelectionScene } from '../game/scene/SelectionScene';
import SelectionSceneUI from './component/SelectionSceneUI';
import MainSceneUI from './component/MainSceneUI';
import { MainScene } from '../game/scene/MainScene';
import EventDialog from './component/EventDialog';
import { VisibleEvent } from '../game/event/VisibleEvent';

function App() {
  const [currentScene, setCurrentScene] = useState<Scene>();
  const [events, setEvents] = useState<VisibleEvent[]>([]);

  const addSceneObserver = () => {
    GameManager._instance.scene.addObserver(setCurrentScene);
  };

  useEffect(() => {
    if (!GameManager._instance)
      // ゲームのロードが終わって居ない場合はコールバック関数を追加
      GameManager.onLoadEnd = addSceneObserver;
    else addSceneObserver(); // ゲームのロードが終わっている場合は即座にオブザーバを追加
  }, []);

  const addEvent = (e: VisibleEvent) => {
    setEvents(events.concat([e]));
    console.log('App');
  };

  return (
    <>
      <Container fluid className="h-100">
        {currentScene instanceof SelectionScene ? (
          <SelectionSceneUI scene={currentScene} />
        ) : currentScene instanceof MainScene ? (
          <MainSceneUI scene={currentScene} onEvent={addEvent} />
        ) : (
          ''
        )}
      </Container>
      {events.map((e) => {
        <EventDialog
          event={e}
          onClose={() => setEvents(events.filter((d) => d != e))}
        ></EventDialog>;
      })}
    </>
  );
}

export default App;
