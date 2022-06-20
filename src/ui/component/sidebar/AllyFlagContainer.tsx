import React, { useCallback, useEffect, useState } from 'react';
import { Col, Image } from 'react-bootstrap';
import { GiFlyingFlag } from 'react-icons/gi';
import { Country } from '../../../game/data/Country';
import { Alliance } from '../../../game/diplomacy/Alliance';
import { data } from '../../../game/GameManager';

export default function AllyFlagContainer(props: {
  target: Country;
  className: string;
}) {
  const { target, className } = props;
  const [diplomacy, setDiplomacy] = useState<Alliance[]>([]);
  const update = useCallback(
    () =>
      setDiplomacy(
        Array.from(target.diplomacy).filter(
          (d) => d instanceof Alliance
        ) as Alliance[]
      ),
    [target]
  );
  useEffect(() => {
    data().diplomacy.addObserver(update);
    update();
  }, [target]);
  if (diplomacy.length === 0) return <></>;
  return (
    <Col xs={12} style={{ height: '2rem' }} className={className}>
      <GiFlyingFlag size={28} className="me-1" />
      {diplomacy.map((d, i) => (
        <Image
          src={'./assets/flags/' + d.getOpponent(target)?.id + '.png'}
          key={i}
          className="mh-100"
        />
      ))}
    </Col>
  );
}
