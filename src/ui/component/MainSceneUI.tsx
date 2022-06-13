import React, { useCallback, useEffect, useState } from 'react';
import { Row, Col, Button, Image } from 'react-bootstrap';
import { Province } from '../../game/data/Provice';
import DebugSidebar from './sidebar/DebugSidebar';
import { MainScene } from '../../game/scene/MainScene';
import Timer from './Timer';
import { eventHandler } from '../../game/handler/CountryPlayerHandler';
import { Country } from '../../game/data/Country';
import DiplomacySidebar from './sidebar/DiplomacySidebar';
import { SIDEBAR, Sidebar } from './sidebar/sidebar';

export default function MainSceneUI(props: {
  scene: MainScene;
  onEvent: eventHandler;
}) {
  const [selectedProvince, setSelectedProvince] = useState<Province>();
  const [currentSidebar, setCurrentSidebar] = useState<Sidebar>(SIDEBAR.NONE);
  const [myCountry, setMyCountry] = useState<Country>();

  const { scene, onEvent } = props;

  const close = useCallback(() => setCurrentSidebar(SIDEBAR.NONE), []);

  useEffect(() => {
    scene.selectedProvince.addObserver(setSelectedProvince);
    scene.eventHandler = onEvent;
    setMyCountry(scene.playAs);
  }, []);

  useEffect(() => {
    myCountry !== undefined &&
      selectedProvince?.owner !== undefined &&
      setCurrentSidebar(SIDEBAR.DIPLOMACY);
  }, [myCountry, selectedProvince]);

  return (
    <>
      <Row style={{ height: '10%' }} className="clickable bg-danger">
        <Col xs="auto" className="mh-100">
          <Image
            src={'./assets/flags/' + scene.playAs.id + '.png'}
            className="mh-100"
          />
        </Col>
        <Col className="d-flex align-items-center">
          <h1>{scene.playAs.name}</h1>
        </Col>
        <Col className="d-flex align-items-center" xs="auto">
          <Button
            size="lg"
            className="ms-auto"
            onClick={() => setCurrentSidebar(SIDEBAR.DEBUG)}
          >
            DEBUG
          </Button>
        </Col>
        <Col className="d-flex align-items-center" xs="auto">
          <Timer scene={scene}></Timer>
        </Col>
      </Row>
      <Row style={{ height: '85%' }}>
        {currentSidebar == SIDEBAR.DEBUG ? (
          <DebugSidebar province={selectedProvince} close={close} />
        ) : (
          currentSidebar === SIDEBAR.DIPLOMACY &&
          myCountry &&
          selectedProvince?.owner && (
            <DiplomacySidebar
              root={myCountry}
              target={selectedProvince.owner}
              close={close}
            />
          )
        )}
      </Row>
      <Row style={{ height: '5%' }}>FOOTER</Row>
    </>
  );
}
