import { Button, Drawer, Form, Input, Modal } from 'antd';
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { nodeConfig } from '../validata';
import AddDataSource from './addDataSource';
import DrawerNode from './drawerNode';
import styles from './index.module.less';

const NodeConfig = (props, modalRef) => {
  const { onOk, nodesDatas } = props;

  const [form] = Form.useForm();
  const [nodeData, setNodeData] = useState({});
  const nodeRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [openDraw, setOpenDraw] = useState(false);
  const [nodeLabel, setNodeLabel] = useState('');

  const onClose = () => {
    setOpen(false);
    setOpenDraw(false);
    form.resetFields();
  };
  const onOpen = (v, node) => {
    nodeRef.current = node;

    setNodeLabel(v.label);

    setNodeData(v);

    if (nodesDatas[v.id]) {
      form.setFieldValue('data', nodesDatas[v.id]);
    }
    if (v?.type === 'in' && !nodesDatas[v.id]) {
      setOpen(true);
    } else {
      setOpenDraw(true);
    }
  };

  const onFinish = () => {
    const { data } = form.getFieldsValue();
    onClose();
    if (onOk) {
      onOk(data, nodeRef.current);
    }
  };

  useImperativeHandle(modalRef, () => ({
    showModal: onOpen,
    closeModal: onClose,
  }));

  return (
    <>
      <Modal
        title={'添加输入源'}
        width={800}
        destroyOnClose
        open={open}
        onCancel={onClose}
        forceRender
        bodyStyle={{ padding: '20px 20px 0 20px' }}
        footer={[
          <Button key="back" onClick={onClose}>
            取消
          </Button>,
          <Button type="primary" key="back" onClick={onFinish}>
            确认
          </Button>,
        ]}
      >
        <Form form={form}>
          <Form.Item name="data" noStyle>
            <AddDataSource></AddDataSource>
          </Form.Item>
        </Form>
      </Modal>
      <Drawer
        style={{ position: 'relative' }}
        bodyStyle={{ padding: 0 }}
        destroyOnClose
        closeIcon={null}
        mask={false}
        extra={
          <div style={{ width: 300, textAlign: 'right' }}>
            节点名称：
            <Input
              onPressEnter={() => {
                nodeRef.current.prop('data', { ...nodeData, label: nodeLabel });
              }}
              onBlur={() => {
                nodeRef.current.prop('data', { ...nodeData, label: nodeLabel });
              }}
              value={nodeLabel}
              onChange={(v) => {
                const va = v.target.value;
                setNodeLabel(va);
              }}
              style={{ width: 160 }}
            ></Input>
          </div>
        }
        placement="bottom"
        title={
          <div className={styles.drawerTitle}>
            <div className={styles.drawerTitleIcon}>
              {nodeConfig[nodeData.type]?.icon}
            </div>
            {nodeConfig[nodeData.type]?.data?.label}
          </div>
        }
        open={openDraw}
        getContainer={false}
      >
        <DrawerNode nodeData={nodeData}></DrawerNode>
      </Drawer>
    </>
  );
};

export default forwardRef(NodeConfig);
