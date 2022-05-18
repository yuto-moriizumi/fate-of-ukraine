import React from 'react';
import { Button, Container, Modal, Row } from 'react-bootstrap';
import { VisibleEvent } from '../../game/event/VisibleEvent';

export default function EventDialog(props: {
  event: VisibleEvent;
  onClose: () => void;
}) {
  const { event, onClose } = props;
  return (
    <Container fluid className="h-100 d-flex">
      <Modal.Dialog className="align-self-center">
        <Modal.Header
          closeButton
          onClick={() => {
            onClose();
          }}
        >
          <Modal.Title>{event.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{event.desc}</p>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Container fluid>
            {event.options.map((o, i) => (
              <Row key={i}>
                <Button variant="primary" onClick={o.takeEffects}>
                  {o.title}
                </Button>
              </Row>
            ))}
          </Container>
        </Modal.Footer>
      </Modal.Dialog>
    </Container>
  );
}
