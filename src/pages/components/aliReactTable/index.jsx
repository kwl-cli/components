import React, { useState, useEffect } from 'react';
import styles from './index.less';
import { BaseTable, useTablePipeline, features } from 'ali-react-table';
import * as fusion from '@alifd/next';
import { makeData } from '../mockData';

const Index = () => {
  useEffect(() => {}, []);
  // const dataSource = assets.biz.dataSource6
  // const columns = assets.biz.columns6

  const dataSource = makeData(0);

  const columns = [
    { code: 'prov', name: '省份', width: 150 },
    { code: 'confirmed', name: '确诊', width: 100, align: 'right' },
    { code: 'cured', name: '治愈', width: 100, align: 'right' },
    { code: 'dead', name: '死亡', width: 100, align: 'right' },
    { code: 't', name: '最后更新时间', width: 180 },
  ];

  const pipeline = useTablePipeline({ components: fusion })
    .input({ dataSource, columns })
    .use(
      features.columnResize({
        fallbackSize: 120,
        handleBackground: '#ddd',
        handleHoverBackground: '#aaa',
        handleActiveBackground: '#89bff7',
      }),
    );

  return (
    <div className={styles.container}>
      <BaseTable
        {...pipeline.getProps()}
        style={{ width: 500, height: 300, overflow: 'auto' }}
      />
    </div>
  );
};
export default Index;
