import { VxeTable, VxeColumn } from 'vxe-table';
import React from 'react';
import './index.css';
import { Form, Input, Button } from 'antd';
// import styles from './index.less'
// import 'vxe-table/styles/table.scss'
import { makeData } from '../mockData';

import { applyVueInReact } from 'veaury';

export default () => {
  const BasicWithNormal = applyVueInReact(VxeTable);
  const BasicVxeColumn = applyVueInReact(VxeColumn);

  const dataSource = makeData(1000);

  const columns = [
    {
      dataIndex: 'id',
      title: 'first',
      render: (r, rc) => {
        console.log('rc', rc);
        return (
          <Form.Item name={[rc.firstName, 'first']}>
            <Input></Input>
          </Form.Item>
        );
      },
      width: 100,
      fixed: 'left',
    },
    {
      dataIndex: 'id',
      title: 'first1',
      render: (r, rc) => <>123123</>,
      width: 100,
    },
    {
      dataIndex: 'id',
      title: 'first2',
      render: (r, rc) => <>123123</>,
      width: 100,
    },
    {
      dataIndex: 'id',
      title: 'first3',
      render: (r, rc) => <>123123</>,
      width: 100,
    },
    {
      dataIndex: 'id',
      title: 'first4',
      render: (r, rc) => <>123123</>,
      width: 400,
    },
    {
      dataIndex: 'id',
      title: 'first5',
      render: (r, rc) => <>123123</>,
      width: 200,
      fixed: 'right',
    },
  ];

  return (
    <Form
      onFinish={(r) => {
        console.log('res', r);
      }}
    >
      <BasicWithNormal
        scrollY={{ enabled: true }}
        height={400}
        data={dataSource}
        columnConfig={{ resizable: true, minWidth: 30 }}
      >
        {columns.map((item) => (
          <BasicVxeColumn
            key={item.dataIndex}
            field={item.dataIndex}
            title={item.title}
            width={item.width}
            {...item}
          >
            {item?.render
              ? (row) => item?.render(row.row?.[item.dataIndex], row.row)
              : null}
          </BasicVxeColumn>
        ))}
      </BasicWithNormal>
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
