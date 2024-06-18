import { NormalModal as Modal } from '@src/components/allCompontents/modalContent';
import { Button, Drawer, Form, Input } from 'antd';
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
  const { onOk, changeNode } = props;

  const [form] = Form.useForm();
  const [nodeData, setNodeData] = useState({});
  const nodeRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [openDraw, setOpenDraw] = useState(false);
  const [nodeLabel, setNodeLabel] = useState('');

  const onClose = (type) => {
    if (type === 'modal') {
      form.resetFields();
      setOpen(false);
      return;
    }
    setOpen(false);
    setOpenDraw(false);
  };
  const onOpen = (v, node) => {
    nodeRef.current = node;

    setNodeLabel(v.label);

    setNodeData(v);

    if (v?.config) {
      form.setFieldValue('data', v?.config);
    }
    if (v?.type === 'in' && !v?.config) {
      setOpen(true);
    } else {
      setOpenDraw(true);
    }
  };

  const openModal = () => {
    setTimeout(() => {
      if (nodeData?.config) {
        form.setFieldValue('data', nodeData?.config);
      }
      setOpen(true);
    }, 10);
  };

  const onFinish = () => {
    const { data } = form.getFieldsValue();
    onClose('modal');
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
        onCancel={() => onClose('modal')}
        forceRender
        bodyStyle={{ padding: '20px 20px 0 20px' }}
        footer={[
          <Button key="back" onClick={() => onClose('modal')}>
            取消
          </Button>,
          <Button type="primary" key="confirm" onClick={onFinish}>
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
        height={400}
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
                if (!nodeLabel) setNodeLabel(nodeData.label);
                changeNode(
                  { label: nodeLabel || nodeData.label },
                  nodeData,
                  nodeRef.current,
                );
              }}
              onBlur={() => {
                if (!nodeLabel) setNodeLabel(nodeData.label);
                changeNode(
                  { label: nodeLabel || nodeData.label },
                  nodeData,
                  nodeRef.current,
                );
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
        <DrawerNode
          changeNode={(v) => changeNode(v, nodeData, nodeRef.current)}
          openModal={openModal}
          nodeData={nodeData}
        ></DrawerNode>
      </Drawer>
    </>
  );
};

export default forwardRef(NodeConfig);
