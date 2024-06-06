import React, { useEffect, useState } from 'react';
import styles from './index.module.less';
import { Table } from 'antd';

const Index = ({ list = [] }) => {
  const [columns, setColumns] = useState([]);

  const handleColumns = () => {
    const arr = [];

    setColumns(arr);
  };
  useEffect(() => {
    handleColumns(list);
  }, [list.map((i) => i.name).join(',')]);

  return (
    <div className={styles.tableBox}>
      <Table columns={columns} size="small"></Table>
    </div>
  );
};
export default Index;
