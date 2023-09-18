import { Button, Col, Container, ProgressBar, Row } from 'react-bootstrap';
import { MAX_SPEED, useStore } from '../../../../store';

export default function Timer() {
  const { current, speed, pause } = useStore((state) => state.timer);

  return (
    <Container fluid>
      <Row>
        <Col xs={2}>
          <Button onClick={speed.decrease}>
            <h3>-</h3>
          </Button>
        </Col>
        <Button
          variant="outline-light col-8"
          className="border-0"
          onClick={pause.toggle}
        >
          <Row>
            <Col xs={12}>
              <h3>{current.val?.format('YYYY/MM/DD HH:00')}</h3>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <ProgressBar
                now={(speed.val / MAX_SPEED) * 100}
                animated={pause.val}
                variant={pause.val ? 'warning' : 'success'}
              />
            </Col>
          </Row>
        </Button>
        <Col xs={2}>
          <Button onClick={speed.increase}>
            <h3>+</h3>
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
