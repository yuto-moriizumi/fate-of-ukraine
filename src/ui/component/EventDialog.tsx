import React from 'react';
import { Button, Container, Modal, Row } from 'react-bootstrap';

export default function EventDialog() {
  return (
    <Container fluid className="h-100 d-flex">
      <Modal.Dialog className="align-self-center">
        <Modal.Header closeButton>
          <Modal.Title>Modal title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Modal body text goes here.</p>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="primary">Save changes</Button>
        </Modal.Footer>
      </Modal.Dialog>
    </Container>
  );
}
