import { useState } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { SelectionScene } from '../../game/scene/SelectionScene';
import DebugSidebar from '../component/DebugSidebar';
import { useStore } from '../../store';

export default function SelectionSceneUI(props: { scene: SelectionScene }) {
  const [isDebugSidebarOpen, setIsDebugSidebarOpen] = useState(false);
  const province = useStore((state) => state.province.val);
  const target = useStore((state) => state.country.target.val);

  return (
    <>
      <Row style={{ height: '10%' }} className="clickable bg-danger">
        <Col xs="auto" className="mh-100">
          <img
            src={'./assets/flags/' + (target?.id ?? 'Rebels') + '.png'}
            className="mh-100"
          ></img>
        </Col>
        <Col className="d-flex align-items-center">
          <h1>{target?.name}</h1>
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
            province={province}
            close={() => setIsDebugSidebarOpen(false)}
          />
        )}
      </Row>
      <Row style={{ height: '5%' }}>FOOTER</Row>
    </>
  );
}
