import styles from './index.less';
import Table from './components/table';
import { Tabs } from 'antd';
import ResizableTable from './components/customTable/index';
import AliReactTable from './components/aliReactTable/index';
import SortTabs from './components/sortTabs';
import VxeTable from './components/vxeTable';
import DragList from './components/dragList/example';
// import 'vxe-table/lib/style.css'

export default function IndexPage() {
  const items = [
    { label: '项目 12', key: 'item-11', children: <DragList></DragList> }, // 务必填写 key
    { label: '项目 1', key: 'item-1', children: <Table></Table> }, // 务必填写 key
    {
      label: '项目 2',
      key: 'item-2',
      children: <ResizableTable></ResizableTable>,
    },
    {
      label: '项目 3',
      key: 'item-3',
      children: <AliReactTable></AliReactTable>,
    },
    {
      label: '可拖拽tabs',
      key: 'item-4',
      children: <SortTabs></SortTabs>,
    },
    {
      label: 'vxeTable',
      key: 'item-5',
      children: <VxeTable></VxeTable>,
    },
  ];
  return (
    <div>
      <Tabs items={items}></Tabs>
    </div>
  );
}
