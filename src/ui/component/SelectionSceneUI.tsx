import { useEffect, useState } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { SelectionScene } from '../../game/scene/SelectionScene';
import { Province } from '../../game/data/Provice';
import DebugSidebar from './sidebar/DebugSidebar';

export default function SelectionSceneUI(props: { scene: SelectionScene }) {
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
            src={
              './assets/flags/' +
              (selectedProvince ? selectedProvince.owner?.id : 'Rebels') +
              '.png'
            }
            className="mh-100"
          ></img>
        </Col>
        <Col className="d-flex align-items-center">
          <h1>{selectedProvince?.owner?.name.val}</h1>
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
          <Button
            size="lg"
            className="ms-auto"
            onClick={() => props.scene.play()}
          >
            START
          </Button>
        </Col>
      </Row>
      <Row style={{ height: '85%' }}>
        {isDebugSidebarOpen && (
          <DebugSidebar
            province={selectedProvince}
            close={() => setIsDebugSidebarOpen(false)}
          />
        )}
      </Row>
      <Row style={{ height: '5%' }}>FOOTER</Row>
    </>
  );
}
