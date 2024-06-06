import React, { useState } from 'react';
import DragList from './index';

const Example = () => {
  const [cards, setCards] = useState([]);
  return (
    <DragList
      rightConfig={{
        renderComponent: <div>test</div>,
        style: {},
      }}
      centerConfig={{
        // gutter: [],
        renderCard: (va) => (
          <div style={{ width: 100, height: 10, background: '#F0F0F0' }}>
            {123}
          </div>
        ),
        setCards,
        cards,
        style: {
          width: '100%',
          overflowY: 'auto',
          padding: '20px',
          borderRight: '1px solid #E5E5E5',
          height: 'calc(100vh - 210px)',
        },
      }}
      leftConfig={{
        onDragEnd: (v) => {
          console.log(v);
          //   currentInfoChange(v);
        },
        boxList: [
          { id: 1, name: '12', document: <>12</> },
          { id: 12, name: '121', document: <div>121</div> },
          { id: 13, name: '122', document: <div>122</div> },
          { id: 14, name: '123', document: <div>123</div> },
        ],
        style: {
          overflowY: 'auto',
          padding: '8px 20px',
          borderRight: '1px solid #E5E5E5',
          height: 'calc(100vh - 210px)',
          background: '#FAFAFA',
          borderBottomLeftRadius: 4,
        },
      }}
    ></DragList>
  );
};

export default Example;
