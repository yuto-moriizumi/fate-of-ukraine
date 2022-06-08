import React from 'react';
import { Button, Col, Image, Row } from 'react-bootstrap';
import { Country } from '../../../game/data/Country';
import { War } from '../../../game/diplomacy/War';
import { data } from '../../../game/GameManager';
import { BsXLg } from 'react-icons/bs';
import { GiCrossedSwords } from 'react-icons/gi';
export default function DiplomacySidebar(props: {
  root: Country;
  target: Country;
  close: () => void;
}) {
  const { root, target, close } = props;
  return (
    <Col className="bg-warning clickable" xs={2}>
      <Row>
        <h2 className="col-auto">{target.name}</h2>
        <Button
          variant="danger"
          className="col-auto ms-auto m-1 py-2"
          onClick={close}
        >
          <BsXLg />
        </Button>
      </Row>
      <Image
        src={'./assets/flags/' + target.id + '.png'}
        fluid
        className="w-100"
      />
      {!root.hasWar(target) && (
        <Button
          onClick={() => {
            data().diplomacy.add(new War(root.id, target.id));
          }}
          className="col-12 mt-4"
        >
          宣戦布告
        </Button>
      )}
      <Col xs={12} style={{ height: '2rem' }} className="mt-2">
        <GiCrossedSwords size={28} className="me-1" />
        {Array.from(target.diplomacy)
          .filter((d) => d instanceof War)
          .map((d, i) => (
            <Image
              src={'./assets/flags/' + d.getOpponent(target)?.id + '.png'}
              key={i}
              className="mh-100"
            />
          ))}
      </Col>
    </Col>
  );
}
