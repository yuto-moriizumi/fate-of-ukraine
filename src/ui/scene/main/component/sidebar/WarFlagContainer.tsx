import { useCallback, useEffect, useState } from 'react';
import { Col, Image } from 'react-bootstrap';
import { GiCrossedSwords } from 'react-icons/gi';
import { Country } from '../../../../../game/data/Country';
import { War } from '../../../../../game/diplomacy/War';
import { data } from '../../../../../game/GameManager';

export default function WarFlagContainer(props: {
  target: Country;
  className: string;
}) {
  const { target, className } = props;
  const [diplomacy, setDiplomacy] = useState<War[]>([]);
  const update = useCallback(() => {
    setDiplomacy(
      Array.from(target.diplomacy).filter((d) => d instanceof War) as War[]
    );
    console.log('warflag updated');
  }, [target]);
  useEffect(() => {
    data().diplomacy.addObserver(update);
    update();
    return () => data().diplomacy.removeObserver(update);
  }, [target]);
  if (!target.hasWar()) return <></>;

  return (
    <Col xs={12} style={{ height: '2rem' }} className={className}>
      <GiCrossedSwords size={28} className="me-1" />
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
