import React, { useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { BsXLg } from 'react-icons/bs';
import { Country } from '../../../game/data/Country';
import { Province } from '../../../game/data/Provice';
import { data } from '../../../game/GameManager';
import { SAVEDATA_TYPE } from '../../../game/type/JsonType';

export default function DebugSidebar(props: {
  province: Province | undefined;
  close: () => void;
}) {
  const [selectedCountry, setSelectedCountry] = useState<Country>();

  return (
    <Col className="bg-warning clickable" xs={2}>
      <Row>
        <h5 className="col-auto">選択中の国</h5>
        <Button
          variant="danger"
          className="col-auto ms-auto m-1 py-2"
          onClick={props.close}
        >
          <BsXLg />
        </Button>
      </Row>
      <p>{selectedCountry?.name}</p>
      <Col xs={12} className="d-grid mb-2">
        <Button onClick={() => setSelectedCountry(props.province?.owner)}>
          この国を選択
        </Button>
      </Col>
      <h5>プロヴィンス</h5>
      <p>
        {props.province?.id}:{props.province?.name}
      </p>
      <Col xs={12} className="d-grid mb-2">
        <Button
          onClick={() => {
            if (props.province) props.province.owner = selectedCountry;
          }}
        >
          このプロヴィンスを領有
        </Button>
      </Col>
      <Col xs={12} className="d-grid mb-2">
        <Button onClick={() => data().download(SAVEDATA_TYPE.GAMEDATA)}>
          ゲームデータのダウンロード
        </Button>
      </Col>
      <Col xs={12} className="d-grid mb-2">
        <Button onClick={() => data().download(SAVEDATA_TYPE.SAVEDATA)}>
          セーブデータのダウンロード
        </Button>
      </Col>
      <Col xs={12} className="d-grid mb-2">
        <Button onClick={() => data().download(SAVEDATA_TYPE.EVENTDATA)}>
          イベントデータのダウンロード
        </Button>
      </Col>
    </Col>
  );
}
