import React, { useMemo, memo, useState, useEffect } from 'react';

import { useAntdResizableHeader } from '@minko-fe/use-antd-resizable-header';

import { Button, Table, Typography, Tooltip } from 'antd';

import '@minko-fe/use-antd-resizable-header/dist/index.css';

const STYLE = { color: '#1890FF', cursor: 'pointer' };

const ResizableTable = (props) => {
  const { dataSource, columns = [], ...rest } = props;

  const [cloneColumns, setCloneColumns] = useState([]);

  // useEffect(() => {
  //   if (columns.length) {
  //     columns?.map((item: any) => {
  //       if (!item.render) {
  //         item.render = (text: number) => (text === 0 ? text : text || '-');
  //       }
  //       // 省略号
  //       if (item.isEllipsis) {
  //         item.render = (_: string) => (
  //           <div style={{ width: '100%', minWidth: 60 }}>
  //             <Typography.Paragraph
  //               ellipsis={{
  //                 rows: 1,
  //                 tooltip: {
  //                   title: _,
  //                 },
  //               }}
  //               style={{ width: 'calc(100% - 10px)', margin: 0 }}
  //               // style={item.link ? STYLE : {}}
  //               // onClick={() => {
  //               //   if (item.link) {
  //               //     history.push(item.link);
  //               //   }
  //               // }}
  //             >
  //               {_}
  //             </Typography.Paragraph>
  //           </div>
  //         );
  //       }
  //       // 当 link 存在时
  //       if (!item.isEllipsis && item.link) {
  //         item.render = (_: string) => <Link to={item.link}>{_}</Link>;
  //       }
  //     });
  //     setCloneColumns(columns);
  //   }
  // }, [columns]);

  const { components, resizableColumns, tableWidth, resetColumns } =
    useAntdResizableHeader({
      columns: columns,
      minConstraints: 50,
      onResizeEnd: (width) => {
        console.log(width, 'width');
      },
    });

  return (
    <div>
      <Table
        columns={resizableColumns}
        components={components}
        dataSource={dataSource}
        scroll={{ x: tableWidth }}
        {...rest}
      />
      <Button onClick={() => resetColumns()}>重置宽度</Button>
    </div>
  );
};

export default ResizableTable;
