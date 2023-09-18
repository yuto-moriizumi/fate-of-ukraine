import { useCallback, useEffect, useState } from 'react';
import { Col, Image } from 'react-bootstrap';
import { FaRoad } from 'react-icons/fa';
import { Country } from '../../../../../game/data/Country';
import { Access } from '../../../../../game/diplomacy/Access';
import { data } from '../../../../../game/GameManager';

export default function AccessFlagsContainer(props: {
  target: Country;
  isOut: boolean;
  className: string;
}) {
  const { target, isOut, className } = props;
  const [diplomacy, setDiplomacy] = useState<Access[]>([]);
  const update = useCallback(
    () =>
      setDiplomacy(
        Array.from(target.diplomacy).filter(
          (d) =>
            d instanceof Access &&
            (isOut ? d.root === target : d.target === target)
        ) as Access[]
      ),
    []
  );
  useEffect(() => {
    data().diplomacy.addObserver(update);
    update();
  }, []);
  if (diplomacy.length === 0) return <></>;
  return (
    <Col xs={12} style={{ height: '2rem' }} className={className}>
      <FaRoad size={28} className="me-1" />
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
