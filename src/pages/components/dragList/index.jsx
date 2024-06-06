import { Empty } from 'antd';
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Box from './Box';
import Card from './Card';

const Index = ({
  /**
   * list: [],
   * 列表数据 : { id, name,document: (v) => {}, // v 是否处于拖拽中 ,   * style: {},
   * options: {},
   * onEnd: (v) => {}, // 结束回调，用于处理数据
   *  }
   */
  leftConfig = {},
  centerConfig = {},
  rightConfig = {},
}) => {
  const { cards, setCards, renderCard } = centerConfig;

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: 'flex' }}>
        {(leftConfig?.boxList || []).length ? (
          <div style={{ width: 240, ...(leftConfig?.style || {}) }}>
            {(leftConfig?.boxList || []).map((item) => (
              <Box
                onDragEnd={leftConfig?.onDragEnd}
                updateDragAndDrop={setCards}
                cardList={cards}
                key={item.id}
                {...item}
              ></Box>
            ))}
          </div>
        ) : (
          <div
            style={{
              width: 240,
              ...(leftConfig?.style || {}),
            }}
          >
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}></Empty>
          </div>
        )}
        <div style={{ flex: 1, width: 0 }}>
          <Card
            gutter={centerConfig?.gutter}
            renderCard={renderCard}
            style={{ height: 300, ...centerConfig?.style }}
            updateDragAndDrop={setCards}
            cardList={cards}
          ></Card>
        </div>
        <div style={{ width: 346, ...rightConfig?.style }}>
          {rightConfig?.renderComponent}
        </div>
      </div>
    </DndProvider>
  );
};
export default Index;
