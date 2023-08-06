import { useState } from 'react';

const Test = () => {
  const [list, setList] = useState(['リスト ']);

  /* ↓関数を追加 */
  const listUp = () => {
    setList([...list, 'リスト ']);
  };

  return (
    <>
      <div>{list}</div>
      <button onClick={listUp} className="clickable">
        追加
      </button>
    </>
  );
};

export default Test;
