import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Container, Button, Row, Col } from 'react-bootstrap';

function App() {
  return (
    <Container fluid className="h-100">
      <Row className="h-100">
        <Col xs={12}>
          <Row>
            <Col xs={12} className="clickable bg-danger">
              HEADER
              <Button onClick={() => alert('test')}>test2</Button>
            </Col>
          </Row>
        </Col>
        <Col className="bg-danger align-self-end clickable" xs={12}>
          FOOTER
        </Col>
      </Row>
    </Container>
  );
}

export default App;
