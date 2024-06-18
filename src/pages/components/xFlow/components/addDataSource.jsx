import SpInput from '@src/components/commonComp/submitSearch/SpInput';
import { useRequest, useSelections } from 'ahooks';
import { Checkbox, Col, Empty, Row, Spin, Tree, Typography } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { IconFile, IconFolder, IconFolderOpen } from '../icon';
import { getTemplateDetail } from '../service';

import styles from './index.module.less';

const { Paragraph } = Typography;

const iconFontStyle = { fontSize: '16px' };

const EmptyTreeNode = ({ description }) => (
  <div
    style={{
      height: 460,
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={description || '请先选择输入源'}
    />
  </div>
);

const defaultD = [
  {
    title: 'parent 0',
    key: '0-0',
    children: [
      {
        title: 'leaf 0-0啊实打实肯德基粉红色科技合法刷卡机合法看手机发货是',
        key: '0-0-0',
        isLeaf: true,
      },
      {
        title: 'leaf 0-1',
        key: '0-0-1',
        isLeaf: true,
      },
    ],
  },
  {
    title: 'parent 1',
    key: '0-1',
    children: [
      {
        title: 'leaf 1-0',
        key: '0-1-0',
        isLeaf: true,
      },
      {
        title: 'leaf 1-1',
        key: '0-1-1',
        isLeaf: true,
      },
    ],
  },
];

const Index = ({ onChange: changeValue, value: initValue }) => {
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [checkoutList, setCheckoutList] = useState([]);
  const [checkoutAllList, setCheckoutAllList] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [defaultData, setDefaultData] = useState(defaultD);

  const { run: getTemplateDetailRun, loading: getTemplateDetailLoading } =
    useRequest(getTemplateDetail, {
      manual: true,
      onSuccess: (res) => {
        try {
          const templateJson = JSON.parse(res.data.templateJsonStr).map(
            (i) => ({
              label: i.label,
              value: i.name,
              config: i,
            }),
          );
          setCheckoutList(templateJson);
          setCheckoutAllList(templateJson);
        } catch (error) {
          console.log('error', error);
        }
      },
    });

  const list = useMemo(
    () => (checkoutList || []).map((i) => i?.value),
    [checkoutList],
  );

  const {
    selected,
    allSelected,
    isSelected,
    setSelected,
    toggle,
    toggleAll,
    partiallySelected,
  } = useSelections(list);

  const changeFormDataValue = (value) => {
    changeValue({
      ...initValue,
      ...value,
    });
  };

  useEffect(() => {
    if (selectedKeys.length) {
      getTemplateDetailRun('22');
    }
  }, [selectedKeys.join(',')]);

  useEffect(() => {
    if (initValue?.cloumns?.length) {
      setSelected((initValue?.cloumns || []).map((i) => i.value));
    }
    if (initValue?.value) {
      setSelectedKeys([initValue?.value]);
    }
  }, [JSON.stringify(initValue)]);

  useEffect(() => {
    changeFormDataValue({
      cloumns: checkoutAllList.filter((o) => selected.includes(o.value)),
    });
  }, [selected.join(',')]);

  useEffect(() => {
    setExpandedKeys(defaultD?.length ? [defaultD[0]?.key] : []);
    setDefaultData(defaultD);
  }, []);

  const rebuildData = (value, arr) => {
    if (!arr) {
      return [];
    }
    const newArr = [];
    arr.forEach((item) => {
      if (item.title.indexOf(value) > -1) {
        const ab = rebuildData(value, item.children || []);
        const obj = {
          ...item,
          children: ab,
        };
        newArr.push(obj);
      } else if (item.children && item.children.length) {
        const ab = rebuildData(value, item.children);
        const obj = {
          ...item,
          children: ab,
        };
        if (ab && ab.length) {
          newArr.push(obj);
        }
      }
    });
    return newArr;
  };

  const treeData = useMemo(() => {
    const loop = (data = []) => rebuildData(searchValue, data);
    const arr = loop(defaultData);
    setExpandedKeys(arr?.length ? [arr[0]?.key] : []);

    return arr;
  }, [searchValue]);

  const onExpand = (newExpandedKeys) => {
    setExpandedKeys(newExpandedKeys);
  };

  const treeOnSelect = (keys, { node }) => {
    if (node?.children.length) {
      if (expandedKeys.indexOf(node.key) > -1) {
        setExpandedKeys(expandedKeys.filter((item) => item !== node.key));
      } else {
        setExpandedKeys((v) => [...v, node.key]);
      }
    } else if (keys.length) {
      changeFormDataValue({ label: node?.title, value: node?.key });
      setSelectedKeys(keys);
    }
  };
  return (
    <div className={styles.add_dataSource}>
      <div className={styles.treeBox}>
        <div className={styles.title}>1. 选择输入源</div>
        <div className={styles.searchBox}>
          <SpInput onChange={setSearchValue} placeholder="搜索数据源"></SpInput>
        </div>
        <div style={{ height: 460 }}>
          {treeData?.length ? (
            <Tree
              switcherIcon={(r) => (
                <div>
                  {r?.expanded ? (
                    <IconFolderOpen style={iconFontStyle}></IconFolderOpen>
                  ) : (
                    <IconFolder style={iconFontStyle}></IconFolder>
                  )}
                </div>
              )}
              titleRender={(node) => (
                <div className={styles.tree_title_box}>
                  {node?.children?.length ? null : (
                    <IconFile
                      style={{ ...iconFontStyle, marginRight: 8 }}
                    ></IconFile>
                  )}
                  <span className={styles.tree_title}>{node.title}</span>
                </div>
              )}
              height={460}
              onExpand={onExpand}
              expandedKeys={expandedKeys}
              selectedKeys={selectedKeys}
              onSelect={treeOnSelect}
              treeData={treeData}
            />
          ) : (
            <EmptyTreeNode description={'暂无数据'}></EmptyTreeNode>
          )}
        </div>
      </div>
      <div className={styles.fontBox}>
        <div className={styles.title}>2. 选择字段</div>
        <div className={styles.searchBox}>
          <SpInput
            onChange={(va) => {
              if (va) {
                setCheckoutList((v) => v.filter((o) => o.label.includes(va)));
              } else {
                setCheckoutList(checkoutAllList);
              }
            }}
            placeholder="搜索字段"
          ></SpInput>
        </div>
        <Spin spinning={getTemplateDetailLoading}>
          <div style={{ height: 460, overflowY: 'auto' }}>
            {checkoutList?.length ? (
              <Row gutter={[20, 8]}>
                <Col span={24}>
                  <Checkbox
                    checked={allSelected}
                    onClick={toggleAll}
                    indeterminate={partiallySelected}
                  >
                    全选
                  </Checkbox>
                </Col>
                {checkoutList.map((i) => (
                  <Col key={i.value} span={12}>
                    <Checkbox
                      checked={isSelected(i.value)}
                      onClick={() => toggle(i.value)}
                      value={i.value}
                    >
                      <div style={{ width: '200px' }}>
                        <Paragraph
                          style={{ marginBottom: 0 }}
                          ellipsis={{
                            tooltip: {
                              title: '',
                              color: '#fff',
                              overlayInnerStyle: {
                                color: '#000',
                              },
                            },
                          }}
                        >
                          {i.label}
                        </Paragraph>
                      </div>
                    </Checkbox>
                  </Col>
                ))}
              </Row>
            ) : (
              <EmptyTreeNode
                description={checkoutAllList?.length ? '暂无数据' : ''}
              ></EmptyTreeNode>
            )}
          </div>
        </Spin>
      </div>
    </div>
  );
};
export default Index;
