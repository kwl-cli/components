import { Input, Tabs } from 'antd';
import React, { useState } from 'react';
import { emptyIcon } from '../icon';
import DataPreViewTable from './dataPreViewTable';
import styles from './index.module.less';

const RenderArea = ({ changeNode, value }) => (
  <div
    style={{
      padding: 20,
    }}
  >
    <Input.TextArea
      style={{ minHeight: 310 }}
      autoSize={{ maxRows: 16 }}
      value={value}
      placeholder="请输入备注"
      onChange={(e) => changeNode(e.target.value)}
    ></Input.TextArea>
  </div>
);

const EmptyContent = ({ children, style }) => (
  <div
    style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      ...style,
    }}
  >
    {children}
  </div>
);

const drawerOptions = {
  in: [
    {
      key: 0,
      label: '数据预览',
      document: ({ list = [], openModal, label }) => (
        <div className={styles.dataPreview}>
          <DataPreViewTable
            name={{ label }}
            openModal={openModal}
            list={list}
          ></DataPreViewTable>
        </div>
      ),
    },
    {
      key: 1,
      label: '节点备注',
      document: ({ changeNode, remark }) => (
        <div className={styles.dataPreview}>
          <RenderArea
            value={remark}
            changeNode={(v) => changeNode({ remark: v })}
          ></RenderArea>
        </div>
      ),
    },
  ],
  out: [
    {
      key: 0,
      label: '数据预览',
      document: ({ list = [], nodeData }) => (
        <div className={styles.dataPreview}>
          {nodeData?.sourceObjs?.length ? (
            <DataPreViewTable noLeft list={list}></DataPreViewTable>
          ) : (
            <EmptyContent style={{ fontSize: 345 }}>
              {emptyIcon[nodeData?.type]()}
            </EmptyContent>
          )}
        </div>
      ),
    },
    {
      key: 1,
      label: '节点备注',
      document: ({ changeNode, remark }) => (
        <div className={styles.dataPreview}>
          <RenderArea
            value={remark}
            changeNode={(v) => changeNode({ remark: v })}
          ></RenderArea>
        </div>
      ),
    },
  ],
};

const Index = ({ changeNode, nodeData, openModal }) => {
  const [tabsKey, setTabsKey] = useState(
    drawerOptions?.[nodeData?.type][0]?.key,
  );

  console.log('nodesDatasnodesDatasnodesDatas', nodeData);
  return (
    <div className={styles.drawerBox}>
      <div style={{ position: 'absolute', top: 5, left: 130, zIndex: 10 }}>
        <Tabs
          activeKey={tabsKey}
          items={drawerOptions?.[nodeData?.type]}
          onChange={setTabsKey}
        />
      </div>
      {drawerOptions?.[nodeData?.type]?.[tabsKey]?.document({
        changeNode,
        openModal,
        nodeData,
        remark: nodeData?.config?.remark,
        label: nodeData?.config?.label,
        list: (nodeData?.config?.cloumns || []).map((i) => i.config),
      })}
    </div>
  );
};
export default Index;
