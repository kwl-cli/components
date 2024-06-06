import { message } from 'antd';
import React from 'react';
import { IconNodeExport, IconNodeImport } from './icon';

export const validataForEdge = (node, config, sourceCell) => {
  if (node.type === 'in' && !config?.selectedKey) {
    // 更改节点数据
    message.error({ key: 'error', content: '请先完成节点配置，再绘制连线' });
    sourceCell.prop('data', { ...node, status: 'error' });
    return false;
  }
  return true;
};

export const validataForNode = (node, config) => {
  console.log('node, config', node, config);
};

export const nodeConfig = {
  in: {
    icon: <IconNodeImport></IconNodeImport>,
    data: {
      label: '输入',
      type: 'in',
    },
    ports: ['right'],
  },
  out: {
    icon: <IconNodeExport></IconNodeExport>,
    data: {
      label: '输出',
      type: 'out',
    },
    ports: ['left'],
  },
};
