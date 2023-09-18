import { useCallback, useEffect, useState } from 'react';
import { Row, Col, Button, Image } from 'react-bootstrap';
import DebugSidebar from '../../component/DebugSidebar';
import { MainScene } from '../../../game/scene/MainScene';
import Timer from './component/Timer';
import DiplomacySidebar from './component/sidebar/DiplomacySidebar';
import { SIDEBAR, Sidebar } from './component/sidebar/sidebar';
import ProductionSidebar from './component/sidebar/ProductionSidebar';
import { useStore } from '../../..';

export default function MainSceneUI(props: { scene: MainScene }) {
  const { scene } = props;
  const [currentSidebar, setCurrentSidebar] = useState<Sidebar>(SIDEBAR.NONE);
  const [myCountry] = useState(scene.playAs);
  const [name, setName] = useState(myCountry.name.val);
  const province = useStore((state) => state.province.val);

  const close = useCallback(() => setCurrentSidebar(SIDEBAR.NONE), []);

  useEffect(() => {
    const nameObserver = () => setName(myCountry.name.val);
    myCountry.name.addObserver(nameObserver);
    return () => myCountry.name.removeObserver(nameObserver);
  }, []);

  useEffect(() => {
    province?.owner !== undefined && setCurrentSidebar(SIDEBAR.DIPLOMACY);
  }, [myCountry, province]);

  const sidebar = () => {
    switch (currentSidebar) {
      case SIDEBAR.DEBUG:
        return <DebugSidebar province={province} close={close} />;
      case SIDEBAR.PRODUCTION:
        return <ProductionSidebar country={myCountry} close={close} />;
      case SIDEBAR.DIPLOMACY:
        if (province?.owner)
          return (
            <DiplomacySidebar
              root={myCountry}
              target={province.owner}
              close={close}
            />
          );
        break;
      case SIDEBAR.NONE:
        return <></>;
      default: {
        const _exhaustiveCheck: never = currentSidebar;
        return _exhaustiveCheck;
      }
    }
  };

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
          <h1>{name}</h1>
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
      <Row style={{ height: '85%' }}>{sidebar()}</Row>
      <Row style={{ height: '5%' }}>FOOTER</Row>
    </>
  );
}
