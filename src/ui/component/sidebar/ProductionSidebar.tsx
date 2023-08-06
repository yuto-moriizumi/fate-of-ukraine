import { Button, Col, Row } from 'react-bootstrap';
import { BsXLg } from 'react-icons/bs';
import { Country } from '../../../game/data/Country';

export default function ProductionSidebar(props: {
  country: Country;
  close: () => void;
}) {
  const { country, close } = props;
  return (
    <Col className="bg-warning clickable" xs={2}>
      <Row>
        <h5 className="col-auto">ユニット生産</h5>
        <Button
          variant="danger"
          className="col-auto ms-auto m-1 py-2"
          onClick={close}
        >
          <BsXLg />
        </Button>
      </Row>
      <Col xs={12} className="d-grid mb-2">
        <Button onClick={() => country.buildDivision()}>民兵</Button>
      </Col>
    </Col>
  );
}
