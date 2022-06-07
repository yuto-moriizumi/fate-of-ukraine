import React, { useEffect, useState } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { Province } from '../../game/data/Provice';
import DebugSidebar from './DebugSidebar';
import { MainScene } from '../../game/scene/MainScene';
import Timer from './Timer';
import { eventHandler } from '../../game/handler/CountryPlayerHandler';

export default function MainSceneUI(props: {
  scene: MainScene;
  onEvent: eventHandler;
}) {
  const [selectedProvince, setSelectedProvince] = useState<Province>();
  const [isDebugSidebarOpen, setIsDebugSidebarOpen] = useState(false);

  const { scene, onEvent } = props;

  useEffect(() => {
    scene.selectedProvince.addObserver(setSelectedProvince);
    scene.eventHandler = onEvent;
  }, []);

  return (
    <>
      <Row style={{ height: '10%' }} className="clickable bg-danger">
        <Col xs="auto" className="mh-100">
          <img
            src={'./assets/flags/' + scene.playAs.id + '.png'}
            className="mh-100"
          ></img>
        </Col>
        <Col className="d-flex align-items-center">
          <h1>{scene.playAs.name}</h1>
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
          <Timer scene={scene}></Timer>
        </Col>
      </Row>
      <Row style={{ height: '85%' }}>
        {isDebugSidebarOpen ? <DebugSidebar province={selectedProvince} /> : ''}
      </Row>
      <Row style={{ height: '5%' }}>FOOTER</Row>
    </>
  );
}
