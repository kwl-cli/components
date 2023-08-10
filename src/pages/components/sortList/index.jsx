import React from 'react';
import { arrayMoveImmutable } from 'array-move';
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from 'react-sortable-hoc';
import styles from './index.less';
import { BorderInnerOutlined } from '@ant-design/icons';

const Index = ({
  setDataSource,
  dataSource = [],
  renderItem,
  onSortEnd: hanleSortEnd,
  style,
}) => {
  const DragHandle = SortableHandle(() => (
    <BorderInnerOutlined
      style={{ cursor: 'grab', color: '#999', fontSize: 17 }}
    />
  ));

  const SortableItem = SortableElement(({ value, order }) =>
    renderItem ? (
      renderItem({ value, dom: <DragHandle></DragHandle>, index: order })
    ) : (
      <tr
        style={{
          height: 30,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <DragHandle></DragHandle>
        &nbsp;&nbsp;
        {value.label}
      </tr>
    ),
  );

  const SortableList = SortableContainer((props) => (
    <tbody style={{ width: '100%', display: 'inline-block' }}>
      {props.items.map((value, index) => (
        <SortableItem
          key={`item-${value?.value || value?.dataIndex || index}`}
          index={index}
          value={value}
          order={index}
        />
      ))}
    </tbody>
  ));

  const onSortEnd = ({ oldIndex, newIndex }) => {
    if (hanleSortEnd) hanleSortEnd({ oldIndex, newIndex });
    setDataSource(arrayMoveImmutable(dataSource, oldIndex, newIndex));
  };
  return (
    <div style={{ width: '100%', ...style }}>
      <SortableList
        helperClass={styles.dragging}
        useDragHandle
        items={dataSource}
        onSortEnd={onSortEnd}
      />
    </div>
  );
};
export default Index;
