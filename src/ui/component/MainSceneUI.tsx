import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Row, Col, Button, Image } from 'react-bootstrap';
import { Province } from '../../game/data/Provice';
import DebugSidebar from './sidebar/DebugSidebar';
import { MainScene } from '../../game/scene/MainScene';
import Timer from './Timer';
import { eventHandler } from '../../game/handler/CountryPlayerHandler';
import { Country } from '../../game/data/Country';
import DiplomacySidebar from './sidebar/DiplomacySidebar';
import { SIDEBAR, Sidebar } from './sidebar/sidebar';
import ProductionSidebar from './sidebar/ProductionSidebar';

export default function MainSceneUI(props: {
  scene: MainScene;
  onEvent: eventHandler;
}) {
  const { scene, onEvent } = props;

  const [selectedProvince, setSelectedProvince] = useState<Province>();
  const [currentSidebar, setCurrentSidebar] = useState<Sidebar>(SIDEBAR.NONE);
  const [myCountry, setMyCountry] = useState(scene.playAs);

  const close = useCallback(() => setCurrentSidebar(SIDEBAR.NONE), []);

  useEffect(() => {
    scene.selectedProvince.addObserver(setSelectedProvince);
    scene.eventHandler = onEvent;
  }, []);

  useEffect(() => {
    selectedProvince?.owner !== undefined &&
      setCurrentSidebar(SIDEBAR.DIPLOMACY);
  }, [myCountry, selectedProvince]);

  const sidebar = useMemo(() => {
    switch (currentSidebar) {
      case SIDEBAR.DEBUG:
        return <DebugSidebar province={selectedProvince} close={close} />;
      case SIDEBAR.PRODUCTION:
        return <ProductionSidebar country={myCountry} close={close} />;
      case SIDEBAR.DIPLOMACY:
        if (selectedProvince?.owner)
          return (
            <DiplomacySidebar
              root={myCountry}
              target={selectedProvince.owner}
              close={close}
            />
          );
    }
    return <></>;
  }, [currentSidebar, selectedProvince]);

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
            onClick={() => setCurrentSidebar(SIDEBAR.PRODUCTION)}
          >
            PRODUCTION
          </Button>
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
      <Row style={{ height: '85%' }}>{sidebar}</Row>
      <Row style={{ height: '5%' }}>FOOTER</Row>
    </>
  );
}
