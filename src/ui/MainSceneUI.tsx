import React, { useEffect, useState } from 'react';
import './App.css';
import { Row, Col, Button } from 'react-bootstrap';
import { SelectionScene } from '../game/scene/SelectionScene';
import { Province } from '../game/data/Provice';
import DebugSidebar from './DebugSidebar';
import { MainScene } from '../game/scene/MainScene';

export default function MainSceneUI(props: { scene: MainScene }) {
  const [selectedProvince, setSelectedProvince] = useState<Province>();
  const [isDebugSidebarOpen, setIsDebugSidebarOpen] = useState(false);

  useEffect(() => {
    props.scene.selectedProvince.addObserver(setSelectedProvince);
  }, []);

  return (
    <>
      <Row style={{ height: '10%' }} className="clickable bg-danger">
        <Col xs="auto" className="mh-100">
          <img
            src={'./assets/flags/' + props.scene.playAs.id + '.png'}
            className="mh-100"
          ></img>
        </Col>
        <Col className="d-flex align-items-center">
          <h1>{props.scene.playAs.name}</h1>
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
      </Row>
      <Row style={{ height: '85%' }}>
        {isDebugSidebarOpen ? <DebugSidebar province={selectedProvince} /> : ''}
      </Row>
      <Row style={{ height: '5%' }}>FOOTER</Row>
    </>
  );
}
