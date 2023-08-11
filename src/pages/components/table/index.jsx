import React, { useState, useEffect } from 'react';
import styles from './index.less';
import { ProTable } from '@ant-design/pro-components';
import SettingColumns from '../autoColumns';
import { makeData } from '../mockData';

const Index = ({ tableId }) => {
  useEffect(() => {}, []);
  const [tableConfig, setTableConfig] = useState({});

  const columns = [
    {
      title: 'ID',
      width: 100,
      dataIndex: 'id',
      initTitle: 'grade',
    },
    {
      dataIndex: 'firstName',
      width: 100,
      title: 'firstName',
      initTitle: 'firstName',
    },
    {
      dataIndex: 'age',
      width: 100,
      title: 'age',
      initTitle: 'grade',
    },
    {
      dataIndex: 'grade',
      width: 100,
      title: 'grade',
      initTitle: 'grade',
    },
  ];

  return (
    <div className={styles.container}>
      <ProTable
        size="small"
        search={false}
        scroll={{ y: 500 }}
        cardProps={{
          style: {
            height: 550,
            position: 'relative',
            borderRadius: 4,
          },
        }}
        dataSource={makeData(5)}
        columnsState={{
          value: tableConfig,
          onChange: (value) => {
            setTableConfig(value);
          },
        }}
        toolbar={{
          actions: [
            <SettingColumns
              config={tableConfig}
              setConfig={setTableConfig}
              onChange={(v) => {
                console.log(v);
              }}
              tableId={tableId}
              columns={columns}
            ></SettingColumns>,
          ],
        }}
        columns={columns}
      ></ProTable>
    </div>
  );
};
export default Index;
