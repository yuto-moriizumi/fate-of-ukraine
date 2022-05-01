import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Container, Button, Row, Col } from 'react-bootstrap';

function App() {
  return (
    <Container fluid className="h-100">
      <Row className="h-100">
        <Col className="bg-danger clickable" xs={12}>
          HEADER
          <Button onClick={() => alert('test')}>test2</Button>
        </Col>
        <Col className="bg-danger align-self-end clickable" xs={12}>
          FOOTER
        </Col>
      </Row>
    </Container>
  );
}

export default App;
