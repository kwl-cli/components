import React, { useCallback, useEffect, useRef } from 'react';
import { useDragLayer } from 'react-dnd';

/** 获取 offsetTop 值，因为 layout 使用了 overflow 所以需要冒泡获取 */
export function getOffsetTop(element) {
  let offsetTop = 0;
  while (element) {
    offsetTop += element.offsetTop;
    // eslint-disable-next-line no-param-reassign
    element = element.offsetParent;
  }
  return offsetTop;
}

/**
 * 支持 dnd 拖拽并滚动
 * 主要用于无限滚动的 table 列表的拖拽排序。
 */
const DragScrollLayer = ({ style, children, scrollWrapRef, onDrag }) => {
  const { isDragging, initialOffset, currentOffset } = useDragLayer(
    (monitor) => ({
      item: monitor.getItem(),
      itemType: monitor.getItemType(),
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging(),
    }),
  );
  const offsetTopRef = useRef(0);

  useEffect(() => {
    if (scrollWrapRef?.current) {
      offsetTopRef.current = getOffsetTop(scrollWrapRef.current);
    }
  }, []);

  const onScroll = useCallback(() => {
    if (!isDragging || !currentOffset) {
      return;
    }

    if (scrollWrapRef?.current) {
      const { y } = currentOffset;
      const offsetTop = offsetTopRef.current;
      const offsetY = y - offsetTop;
      if (offsetY < 0) {
        const scrollTop = offsetY > 50 ? 60 : 30;
        // eslint-disable-next-line no-param-reassign
        scrollWrapRef.current.scrollTop -= scrollTop;
      } else if (offsetY > scrollWrapRef.current.clientHeight) {
        const scrollTop =
          offsetY + scrollWrapRef.current.clientHeight > 50 ? 60 : 30;
        // eslint-disable-next-line no-param-reassign
        scrollWrapRef.current.scrollTop += scrollTop;
      }
    }

    onDrag?.({ isDragging, initialOffset, currentOffset });
  }, [isDragging, initialOffset, currentOffset]);

  useEffect(() => {
    if (isDragging) {
      const interval = setInterval(onScroll, 100);
      return () => clearInterval(interval);
    }
  }, [isDragging, onScroll]);

  return <div style={{ ...style }}>{children}</div>;
};

export default DragScrollLayer;
