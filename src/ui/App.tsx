import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { GameManager } from '../game/GameManager';
import { Scene } from '../game/scene/Scene';
import { SelectionScene } from '../game/scene/SelectionScene';
import { Province } from '../game/data/Provice';

function App() {
  const [currentScene, setCurrentScene] = useState<Scene>();
  const [selectedProvince, setSelectedProvince] = useState<Province>();

  useEffect(() => {
    GameManager.onLoadEnd = () => {
      GameManager.instance.scene.addObserver(setCurrentScene);
    };
  }, []);

  useEffect(() => {
    if (currentScene instanceof SelectionScene) {
      currentScene.selectedProvince.addObserver(setSelectedProvince);
    }
  }, [currentScene]);

  return (
    <Container fluid className="h-100">
      <Row className="h-100">
        <Col xs={12}>
          <Row>
            <Col xs={12} className="clickable bg-danger">
              {currentScene instanceof SelectionScene ? (
                <Row>
                  <Col xs="auto">
                    <img
                      src={
                        './assets/flags/' + selectedProvince?.owner?.id + '.png'
                      }
                      height="100rem"
                    ></img>
                  </Col>
                  <Col className="d-flex align-items-center">
                    <h1>{selectedProvince?.owner?.name}</h1>
                    <Button size="lg" className="ms-auto">
                      START
                    </Button>
                  </Col>
                </Row>
              ) : (
                ''
              )}
            </Col>
          </Row>
        </Col>
        <Col className="bg-danger align-self-end clickable" xs={12}>
          FOOTER
        </Col>
      </Row>
    </Container>
  );
}

export default App;
