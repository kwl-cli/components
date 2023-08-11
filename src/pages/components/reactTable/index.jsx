import React, { useState, useEffect } from 'react';
import styles from './index.less';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { makeData } from '../mockData';
import styled from '@emotion/styled';

const Index = () => {
  useEffect(() => {}, []);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return <div className={styles.tableBox}></div>;
};
export default Index;
