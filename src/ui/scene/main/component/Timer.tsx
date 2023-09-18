import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Button, Col, Container, ProgressBar, Row } from 'react-bootstrap';
import { MainScene } from '../../../../game/scene/MainScene';

export default function Timer(props: { scene: MainScene }) {
  const { scene } = props;
  const [datetime, setDatetime] = useState<dayjs.Dayjs>(scene.datetime.val);
  const [speed, setSpeed] = useState(3);
  const [pause, setPause] = useState(true);

  useEffect(() => {
    scene.datetime.addObserver(setDatetime);
    scene.speed.addObserver(setSpeed);
    scene.pause.addObserver(setPause);
  }, []);

  return (
    <Container fluid>
      <Row>
        <Col xs={2}>
          <Button
            onClick={() => (scene.speed.val = Math.max(1, speed - 1))}
            disabled={scene.speed.val == 1}
          >
            <h3>-</h3>
          </Button>
        </Col>
        <Button
          variant="outline-light col-8"
          className="border-0"
          onClick={() => (scene.pause.val = !pause)}
        >
          <Row>
            <Col xs={12}>
              <h3>{datetime?.format('YYYY/MM/DD HH:00')}</h3>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <ProgressBar
                now={(speed / scene.MAX_SPEED) * 100}
                animated={pause}
                variant={pause ? 'warning' : 'success'}
              />
            </Col>
          </Row>
        </Button>
        <Col xs={2}>
          <Button
            onClick={() =>
              (scene.speed.val = Math.min(scene.MAX_SPEED, speed + 1))
            }
            disabled={scene.speed.val == scene.MAX_SPEED}
          >
            <h3>+</h3>
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
