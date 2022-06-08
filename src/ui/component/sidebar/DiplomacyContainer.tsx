import React from 'react';
import { Col, Image } from 'react-bootstrap';
import { GiCrossedSwords } from 'react-icons/gi';
import { Country } from '../../../game/data/Country';
import { Diplomacy } from '../../../game/diplomacy/Diplomacy';
import { War } from '../../../game/diplomacy/War';

export default function DiplomacyContainer<T extends Diplomacy>(props: {
  target: Country;
}) {
  const { target } = props;
  return (
    <Col xs={12} style={{ height: '2rem' }}>
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
  );
}
