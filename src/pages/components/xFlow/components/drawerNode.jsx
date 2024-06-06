import { Input, Tabs } from 'antd';
import React, { useState } from 'react';
import DataPreViewTable from './dataPreViewTable';
import styles from './index.module.less';

const drawerOptions = {
  in: [
    {
      key: 0,
      label: '数据预览',
      document: ({ list = [] }) => (
        <div className={styles.dataPreview}>
          <DataPreViewTable list={list}></DataPreViewTable>
        </div>
      ),
    },
    {
      key: 1,
      label: '节点备注',
      document: ({ list = [] }) => (
        <div className={styles.dataPreview}>
          <Input.TextArea></Input.TextArea>
        </div>
      ),
    },
  ],
  out: [
    {
      key: 0,
      label: '数据预览',
      document: ({ list = [] }) => (
        <div className={styles.dataPreview}>
          <DataPreViewTable list={list}></DataPreViewTable>
        </div>
      ),
    },
    {
      key: 1,
      label: '节点备注',
      document: ({ list = [] }) => (
        <div className={styles.dataPreview}>
          <Input.TextArea></Input.TextArea>
        </div>
      ),
    },
  ],
};

const Index = ({ nodeData }) => {
  const [tabsKey, setTabsKey] = useState(
    drawerOptions?.[nodeData?.type][0]?.key,
  );

  console.log('tabsKey', tabsKey);

  return (
    <div className={styles.drawerBox}>
      <div style={{ position: 'absolute', top: 5, left: 130, zIndex: 10 }}>
        <Tabs
          activeKey={tabsKey}
          items={drawerOptions?.[nodeData?.type]}
          onChange={setTabsKey}
        />
      </div>
      {drawerOptions?.[nodeData?.type]?.[tabsKey]?.document({ list: [] })}
    </div>
  );
};
export default Index;
