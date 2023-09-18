import { useEffect, useState } from 'react';
import { Button, Col, Image, Row } from 'react-bootstrap';
import { Country } from '../../../../../game/data/Country';
import { data } from '../../../../../game/GameManager';
import { BsXLg } from 'react-icons/bs';
import WarFlagContainer from './WarFlagContainer';
import AllyFlagContainer from './AllyFlagContainer';
import AccessFlagsContainer from './AccessFlagsContainer';

export default function DiplomacySidebar(props: {
  root: Country;
  target: Country;
  close: () => void;
}) {
  const { root, target, close } = props;
  const [rootHasWar, setRootHasWar] = useState(false);

  useEffect(() => {
    const diplomacy = data().diplomacy;
    const observer = () => setRootHasWar(root.hasWar(target));
    diplomacy.addObserver(observer);
    observer();
    return () => {
      diplomacy.removeObserver(observer);
    };
  }, []);
  if (!target) return null;
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
      {!rootHasWar && (
        <Button onClick={() => root.declareWar(target)} className="col-12 mt-4">
          宣戦布告
        </Button>
      )}
      <WarFlagContainer target={target} className="mt-2" />
      <AllyFlagContainer target={target} className="mt-2" />
      <AccessFlagsContainer target={target} className="mt-2" isOut={true} />
      <AccessFlagsContainer target={target} className="mt-2" isOut={false} />
    </Col>
  );
}
