import { nanoid } from 'nanoid';
import React, { useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import PreviewBox from './previewBox';

const Box = ({
  onDragEnd,
  previewDocument,
  isDrag = true,
  updateDragAndDrop,
  document,
  name,
  boxstyle,
  type = 'card',
  valueType,
  ...rest
}) => {
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type,
    item: () => {
      // 在拖动操作开始时触发
      // 拖拽开始时，向 cardList 数据源中插入一个占位的元素，如果占位元素已经存在，不再重复插入
      updateDragAndDrop((preCardList) => [
        ...preCardList,
        {
          id: -1,
          span: rest?.span || 24,
          document: <div style={{ height: 80 }}></div>,
        },
      ]);

      return { ...rest, name, document, valueType };
    },
    end: (_, monitor) => {
      /**
       * 拖拽结束时，判断是否将拖拽元素放入了目标接收组件中
       *  1、如果是，则使用真正传入的 box 元素代替占位元素
       *  2、如果否，则将占位元素删除
       */

      updateDragAndDrop((preCardList) => {
        if (monitor.didDrop()) {
          const id = nanoid(3);
          onDragEnd({ ...rest, name, document, valueType, id });
          const arr = preCardList.map((i) =>
            i.id === -1 ? { ...monitor.getItem(), id } : i,
          );
          return arr;
        }
        return preCardList.filter((i) => i.id !== -1);
      });
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true }); // 隐藏拖拽dom
  }, []);

  return (
    <div>
      {isDrag ? (
        <div
          ref={drag}
          style={{ ...boxstyle, position: 'relative', cursor: 'move' }}
          data-testid={`box`}
        >
          {document || name}
        </div>
      ) : (
        <div>{document || name}</div>
      )}

      {isDragging ? (
        <PreviewBox document={previewDocument || document || name}></PreviewBox>
      ) : null}
    </div>
  );
};

export default Box;
