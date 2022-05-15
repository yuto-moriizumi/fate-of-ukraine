import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { GameManager } from '../game/GameManager';
import { Scene } from '../game/scene/Scene';
import { SelectionScene } from '../game/scene/SelectionScene';
import { Province } from '../game/data/Provice';
import DebugSidebar from './DebugSidebar';

function App() {
  const [currentScene, setCurrentScene] = useState<Scene>();
  const [selectedProvince, setSelectedProvince] = useState<Province>();
  const [isDebugSidebarOpen, setIsDebugSidebarOpen] = useState(false);

  const addSceneObserver = () => {
    GameManager.instance.scene.addObserver(setCurrentScene);
  };

  useEffect(() => {
    if (!GameManager.instance)
      // ゲームのロードが終わって居ない場合はコールバック関数を追加
      GameManager.onLoadEnd = addSceneObserver;
    else addSceneObserver(); // ゲームのロードが終わっている場合は即座にオブザーバを追加
  }, []);

  useEffect(() => {
    if (currentScene instanceof SelectionScene) {
      currentScene.selectedProvince.addObserver(setSelectedProvince);
    }
  }, [currentScene]);

  return (
    <Container fluid className="h-100">
      <Row style={{ height: '10%' }} className="clickable bg-danger">
        {currentScene instanceof SelectionScene ? (
          <>
            <Col xs="auto" className="mh-100">
              <img
                src={
                  './assets/flags/' +
                  (selectedProvince ? selectedProvince.owner?.id : 'Rebels') +
                  '.png'
                }
                className="mh-100"
              ></img>
            </Col>
            <Col className="d-flex align-items-center">
              <h1>{selectedProvince?.owner?.name}</h1>
            </Col>
            <Col className="d-flex align-items-center" xs="auto">
              <Button
                size="lg"
                className="ms-auto"
                onClick={() => setIsDebugSidebarOpen(!isDebugSidebarOpen)}
              >
                DEBUG
              </Button>
            </Col>
            <Col className="d-flex align-items-center" xs="auto">
              <Button size="lg" className="ms-auto">
                START
              </Button>
            </Col>
          </>
        ) : (
          ''
        )}
      </Row>
      <Row style={{ height: '85%' }}>
        {isDebugSidebarOpen ? <DebugSidebar province={selectedProvince} /> : ''}
      </Row>
      <Row style={{ height: '5%' }}>FOOTER</Row>
    </Container>
  );
}

export default App;
