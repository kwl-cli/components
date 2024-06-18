import Table from '@src/components/commonComp/resizeableTitle/resizeableAntdTable';
import { commidityEnum, typeEnum } from '@src/pages/leftPages/container';
import { useRequest } from 'ahooks';
import React, { useEffect, useState } from 'react';
import { IconFile } from '../icon';
import { getSurviceList } from '../service';
import styles from './index.module.less';

const LeftContentRender = ({ name, columns, openModal }) => (
  <div className={styles.inPreviewLeft}>
    <span style={{ color: 'rgba(0,0,0,0.45)' }}>
      输入源
      <a onClick={openModal} style={{ marginLeft: 8 }}>
        更改
      </a>
    </span>
    <div style={{ margin: '8px 0 20px 0' }}>
      <IconFile style={{ marginRight: 10 }}></IconFile>
      {name?.label}
    </div>

    <div
      style={{ color: 'rgba(0,0,0,0.45)', fontWeight: 500, marginBottom: 8 }}
    >
      已选字段
    </div>

    <div style={{ flex: 1, overflow: 'auto' }}>
      {columns.map((i) => (
        <div
          style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}
          key={i?.name}
        >
          <span
            style={{
              color: '#9A9A9A',
              marginRight: -4,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {typeEnum[i.type]?.tag}
          </span>
          {i?.title}
        </div>
      ))}
    </div>
  </div>
);

const Index = ({ noLeft, list = [], instanceId = '22', openModal, name }) => {
  const [columns, setColumns] = useState([]);
  const [dataSource, setDataSource] = useState([]);

  const { run, loading } = useRequest(getSurviceList, {
    manual: true,
    cacheKey: instanceId,
    onSuccess: (res) => {
      setDataSource(
        res.data.rows.map((i) => ({ ...i, ...JSON.parse(i?.resultJsonStr) })),
      );
    },
  });

  useEffect(() => {
    run({ instanceId });
  }, []);

  const handleColumns = (lists) => {
    const arr = [];

    lists.forEach((item) => {
      if (item.type === 'goodsComponent') {
        item.field.showAttrList.forEach((i) => {
          arr.push({
            type: 'input',
            dataIndex: i,
            title: commidityEnum[i].text,
            width: commidityEnum[i].width,
            render: (r, rc) =>
              commidityEnum[i].render(rc?.[item.name]?.[i], rc),
            hideInSearch: true,
          });
        });
      } else {
        try {
          const typeId = item.name.split('_');
          arr.push({
            type: typeId[1],
            title: item.label,
            dataIndex: item.name,
            width: typeEnum[typeId[1]].width,
            render: (r, rc) => typeEnum[typeId[1]].render(r, rc, item.name),
            hideInSearch: true,
          });
        } catch (error) {
          const typeId = item.name.split('-');

          arr.push({
            type: typeId[1],
            title: item.label,
            dataIndex: item.name,
            width: typeEnum[typeId[1]].width,
            render: (r, rc) => typeEnum[typeId[1]].render(r, rc, item.name),
            hideInSearch: true,
          });
        }
      }
    });

    setColumns(arr);
  };
  useEffect(() => {
    handleColumns(list);
  }, [list.map((i) => i.name).join(',')]);

  return (
    <div key={columns.length} className={styles.tableBox}>
      {noLeft ? null : (
        <LeftContentRender
          name={name}
          openModal={openModal}
          columns={columns}
        ></LeftContentRender>
      )}
      <div className={styles.tableContent}>
        <Table
          pagination={false}
          loading={loading}
          dataSource={dataSource}
          scroll={{ y: 310 }}
          columns={columns}
          size="small"
        ></Table>
      </div>
    </div>
  );
};
export default Index;
