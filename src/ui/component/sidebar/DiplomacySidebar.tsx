import React, { useState } from 'react';
import { Button, Col } from 'react-bootstrap';
import { Country } from '../../../game/data/Country';
import { Province } from '../../../game/data/Provice';
import { data } from '../../../game/GameManager';
import { SAVEDATA_TYPE } from '../../../game/type/JsonType';

export default function DiplomacySidebar(props: {
  root: Country;
  target: Country;
}) {
  const [selectedCountry, setSelectedCountry] = useState<Country>();

  return (
    <Col className="bg-warning clickable" xs={2}>
      <h5>選択中の国</h5>
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