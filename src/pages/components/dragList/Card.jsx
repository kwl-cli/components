import { Col, Empty, Row } from 'antd';
import update from 'immutability-helper';
import React, { useCallback, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

// import  from "./DragScrollLayer";

const Card = ({
  cardInfo,
  document,
  renderCard,
  style,
  type = 'card',
  id,
  name,
  index,
  moveCard,
}) => {
  const ref = useRef(null);

  const [{ handlerId }, drop] = useDrop({
    accept: type,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item?.index;
      const hoverIndex = index;

      //   // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      const clientOffset = monitor.getClientOffset();

      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      //   // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      //   // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);
      if (item.index !== undefined) {
        // eslint-disable-next-line no-param-reassign
        item.index = hoverIndex;
      }

      //   // Note: we're mutating the monitor item here!
      //   // Generally it's better to avoid mutations,
      //   // but it's good here for the sake of performance
      //   // to avoid expensive index searches.
    },
  });
  const [{ isDragging }, drag] = useDrag({
    type,
    item: () => ({ id, index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  const childnode = document || name;

  return (
    <div
      className="drag_list_card_item"
      ref={ref}
      style={{ ...style, opacity }}
      data-handler-id={handlerId}
    >
      {renderCard && id !== -1 ? renderCard({ ...cardInfo, id }) : childnode}
    </div>
  );
};

const Container = ({
  gutter = [12, 12],
  renderCard,
  type = 'card',
  style,
  updateDragAndDrop,
  cardList,
}) => {
  const [, drop] = useDrop({
    accept: type,

    canDrop: () => true,
    collect: (monitor) => ({
      canDrop: !!monitor.canDrop(),
    }),
  });

  const moveCard = useCallback(
    (dragIndex, hoverIndex) => {
      // 从外部拖入的没有index
      if (dragIndex === undefined) {
        updateDragAndDrop((preCardList) => {
          const lessIndex = preCardList.findIndex((i) => i.id === -1);

          return update(preCardList, {
            $splice: [
              [lessIndex, 1],
              [hoverIndex, 0, preCardList[lessIndex]],
            ],
          });
        });
        return;
      }
      updateDragAndDrop((preCardList) =>
        update(preCardList, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, preCardList[dragIndex]],
          ],
        }),
      );
    },
    [cardList, updateDragAndDrop],
  );

  return (
    <div ref={drop} style={style}>
      {cardList?.length ? (
        <Row gutter={gutter}>
          {cardList.map((card, index) => (
            <Col key={card.id} span={card?.span || 24}>
              <Card
                cardInfo={card}
                renderCard={renderCard}
                key={card.id}
                index={index}
                {...card}
                moveCard={moveCard}
              />
            </Col>
          ))}
        </Row>
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Empty
            description="拖拽左侧组件添加至主体，开始配置"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          ></Empty>
        </div>
      )}
    </div>
  );
};

export default Container;
