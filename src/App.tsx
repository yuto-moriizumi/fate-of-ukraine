import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Container, Button, Row, Col } from 'react-bootstrap';

function App() {
  return (
    <Container fluid className="h-100 bg-warning">
      <Row className="h-100">
        <Col className="bg-danger" xs={12}>
          HEADER
          <Button>test2</Button>
        </Col>
        <Col className="bg-danger align-self-end" xs={12}>
          FOOTER
        </Col>
      </Row>
    </Container>
  );
}

export default App;
