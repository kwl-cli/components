import React, { memo, useMemo, useState } from 'react';

import { Typography } from 'antd';
import ResizableTable from './components/resizableTable';

const CustomTable = () => {
  const [list, setList] = useState([
    {
      id: '1',
      accountName: '支付宝',
      bankCardNo: '437582937549323345',
      accountHolder: '云天河',
      accountAmount: '80000',
      remark: '我是备注',
    },
  ]);

  const columns = useMemo(
    () => [
      {
        title: '账户名称',
        dataIndex: 'accountName',
        key: 'accountName',
        width: 200,
      },
      {
        title: '关联银行账号',
        dataIndex: 'bankCardNo',
        key: 'bankCardNo',
        width: 200,
        render: (_) => (
          <div style={{ width: '100%' }}>
            <Typography.Paragraph
              ellipsis={{
                rows: 1,
                tooltip: {
                  title: _,
                },
                onEllipsis: () => {},
              }}
              style={{ width: '100%', margin: 0 }}
            >
              {_}
            </Typography.Paragraph>
          </div>
        ),
      },
      {
        title: '开户人',
        dataIndex: 'accountHolder',
        key: 'accountHolder',
        width: 200,
      },
      {
        title: '账户余额',
        dataIndex: 'accountAmount',
        key: 'accountAmount',
        width: 200,
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        width: 200,
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        // align: 'center',
        fixed: 'right',
        // width: 100,
      },
    ],
    [list],
  );
  return (
    <ResizableTable
      columns={columns}
      dataSource={list}
      rowKey="id"
    ></ResizableTable>
  );
};

export default CustomTable;
