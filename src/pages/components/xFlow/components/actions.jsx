import {
  CompressOutlined,
  DeleteOutlined,
  ExpandOutlined,
  GatewayOutlined,
  ReadOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons';
import { Badge, Divider, Popover, Space, Tooltip } from 'antd';
import React, { useRef, useState } from 'react';
import styles from './index.module.less';

const Index = ({
  graphRef,
  isFullscreen,
  exitFullscreen,
  enterFullscreen,
  deleteCells,
}) => {
  const [isMultipleSelection, setIsMultipleSelection] = useState(false);
  const [isOpenRead, setIsOpenRead] = useState(false);
  const ref = useRef();
  return (
    <div ref={ref} className={styles.actions}>
      <Space size={16}>
        <Tooltip
          getPopupContainer={() => ref.current}
          placement="bottom"
          title="缩小"
        >
          <div
            onClick={() => {
              graphRef.current.zoom(-0.2);
            }}
            className={styles.actionsZoom}
          >
            <ZoomOutOutlined />
          </div>
        </Tooltip>
        <Tooltip
          getPopupContainer={() => ref.current}
          placement="bottom"
          title="放大"
        >
          <div
            onClick={() => {
              graphRef.current.zoom(0.2);
            }}
            className={styles.actionsZoom}
          >
            <ZoomInOutlined />
          </div>
        </Tooltip>
        <Tooltip
          getPopupContainer={() => ref.current}
          placement="bottom"
          title="开始框选"
        >
          <div
            onClick={() => {
              setIsMultipleSelection((v) => !v);
              if (isMultipleSelection) {
                graphRef.current.enablePanning();
                graphRef.current.disableMultipleSelection();
                graphRef.current.disableRubberband();
              } else {
                graphRef.current.disablePanning();
                graphRef.current.enableMultipleSelection();
                graphRef.current.enableRubberband();
              }
            }}
            style={
              isMultipleSelection
                ? { color: '#1890ff', background: 'rgba(22,119,255,0.1)' }
                : {}
            }
            className={styles.actionsZoom}
          >
            <GatewayOutlined />
          </div>
        </Tooltip>
        <Tooltip
          getPopupContainer={() => ref.current}
          placement="bottom"
          title={isFullscreen ? '退出全屏' : '全屏'}
        >
          <div
            onClick={() => {
              if (isFullscreen) {
                exitFullscreen();
              } else {
                enterFullscreen();
              }
            }}
            className={styles.actionsZoom}
          >
            {isFullscreen ? <CompressOutlined /> : <ExpandOutlined />}
          </div>
        </Tooltip>
        <Divider style={{ margin: 0, height: 16 }} type="vertical"></Divider>
        <Tooltip
          getPopupContainer={() => ref.current}
          placement="bottom"
          title="删除"
        >
          <div
            onClick={() => {
              deleteCells(graphRef.current);
            }}
            className={styles.actionsZoom}
          >
            <DeleteOutlined />
          </div>
        </Tooltip>
      </Space>
      <Space size={16}>
        <Tooltip
          getPopupContainer={() => ref.current}
          placement="bottom"
          title={isOpenRead ? '' : '操作引导'}
        >
          <Popover
            overlayStyle={{ padding: 0 }}
            showArrow={false}
            open={isOpenRead}
            placement="bottomRight"
            content={
              <div style={{ width: 197 }}>
                <Space direction="vertical" size={4}>
                  <div style={{ color: 'rgba(0,0,0,0.45)' }}>
                    数据流操作引导
                  </div>
                  <Badge color="#1677FF" text="为「输入」节点添加数据源" />
                  <Badge color="#1677FF" text="拖拽添加「数据处理」节点" />
                  <Badge color="#1677FF" text="给任意两个节点添加连线" />
                  <Badge color="#1677FF" text="配置「数据处理」节点" />
                  <Badge color="#1677FF" text="连接「数据处理」和「输出」" />
                  <Badge color="#1677FF" text="保存数据流" />
                </Space>
              </div>
            }
            trigger="click"
            getPopupContainer={() => ref.current}
          >
            <div
              onClick={() => {
                setIsOpenRead((v) => !v);
              }}
              className={styles.actionsZoom}
              style={
                isOpenRead
                  ? { color: '#1890ff', background: 'rgba(22,119,255,0.1)' }
                  : {}
              }
            >
              <ReadOutlined />
            </div>
          </Popover>
        </Tooltip>
      </Space>
    </div>
  );
};
export default Index;
