import { useRequest } from 'ahooks';
import {
  Button,
  Checkbox,
  Col,
  Modal,
  Row,
  Tooltip,
  Typography,
  message,
  Input,
} from 'antd';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { resaveTableConfigApi, saveTableConfigApi } from './service';
import SortList from '../sortList';
import {
  CloseOutlined,
  PushpinFilled,
  PushpinOutlined,
  VerticalAlignTopOutlined,
  AppstoreFilled,
} from '@ant-design/icons';

const { Paragraph } = Typography;

const SettingColumns = ({
  tableId = '',
  columns,
  config = {},
  setConfig,
  tagColumns,
  customIcon,
  ...rest
}) => {
  const [open, setOpen] = useState(false);
  const [currentSelects, setCurrentSelects] = useState([]);
  const [defaultColumns, setDefaultColumns] = useState([]);
  const [searchValue, setSearchValue] = useState([]);
  const [affixColumns, setAffixColumns] = useState([]);
  const [autoColumns, setAutoColumns] = useState([]);

  const { run: saveTableConfig, loading } = useRequest(saveTableConfigApi, {
    manual: true,
    onSuccess: (res) => {
      message.success('应用成功');
      onClose();
    },
  });

  const { run: resaveTableConfig, loading: resaveTableConfigLoading } =
    useRequest(resaveTableConfigApi, {
      manual: true,
      onSuccess: (res) => {
        message.success('恢复默认成功');
        setConfig({});
        onClose();
      },
    });

  const onClose = () => {
    setSearchValue([]);
    setOpen(false);
  };

  const onFinish = () => {
    const arr = [
      ...affixColumns.filter(
        (o) => currentSelects.findIndex((v) => v === o.dataIndex) > -1,
      ),
      ...autoColumns.filter(
        (o) => currentSelects.findIndex((v) => v === o.dataIndex) > -1,
      ),
    ];

    const obj = {};

    defaultColumns.forEach((item, index) => {
      obj[item.dataIndex] = {
        show: arr.findIndex((o) => o.dataIndex === item.dataIndex) > -1,
        order: tagColumns?.length
          ? index
          : arr.findIndex((o) => o.dataIndex === item.dataIndex),
        fixed:
          affixColumns.findIndex((o) => o.dataIndex === item.dataIndex) > -1
            ? 'left'
            : false,
        defaultDisable: item.defaultDisable,
      };
    });

    /* 校验至少选中X个 */
    if (currentSelects.length < rest.vilidateNum) {
      message.error(`至少选中${rest.vilidateNum}项`);
      setConfig(undefined);
      return false;
    }

    if (setConfig) {
      setConfig(obj);
    }

    if (tableId) {
      saveTableConfig({ tableId, ...obj });
    } else {
      message.success('应用成功');
      onClose();
    }
  };

  const initColumns = (type) => {
    const arr = [];
    const initKeys = [];
    // const initSetting = {}
    const affix = [];
    const auto = [];

    const initArr =
      type === 'init'
        ? columns
        : _.orderBy(
            columns.map((item) => ({
              ...item,
              ...config[item.dataIndex],
            })),
            ['order'],
            ['asc'],
          );

    initArr.forEach((item) => {
      if (!item.hideInTable && item.title !== '操作') {
        if (type !== 'init' && config[item.dataIndex]) {
          if (config[item.dataIndex]?.show) {
            initKeys.push(item.dataIndex);
          }
          if (config[item.dataIndex].fixed) {
            affix.push({ ...item, ...config[item.dataIndex] });
          } else {
            auto.push({ ...item, ...config[item.dataIndex] });
          }
        } else {
          initKeys.push(item.dataIndex);
          if (item.fixed) {
            affix.push({ ...item, defaultDisable: !!item.fixed });
          } else {
            auto.push({ ...item, defaultDisable: !!item.fixed });
          }
        }
      }
    });

    columns.forEach((item) => {
      if (!item.hideInTable && item.title !== '操作') {
        if (config[item.dataIndex]) {
          arr.push({ ...item, ...config[item.dataIndex] });
        } else {
          arr.push({ ...item, defaultDisable: !!item.fixed });
        }
      }
    });

    setAffixColumns(affix);
    setAutoColumns(auto);
    setDefaultColumns(arr);
    setCurrentSelects(initKeys);
    // setConfig(initSetting)
  };

  useEffect(() => {
    if (columns && open) {
      initColumns();
    }
  }, [columns, open]);

  const onChange = (checkedValues) => {
    setCurrentSelects(checkedValues);
  };

  const renderLeft = () => (
    <div className={styles.normalBox}>
      <div className={styles.normalTitle}>
        <span>可选列</span>
        {currentSelects.length === defaultColumns.length ? (
          <a style={{ color: 'rgba(0,0,0,0.25)' }}>选择全部</a>
        ) : (
          <a
            onClick={() =>
              onChange([
                ...defaultColumns.map((v) => v.dataIndex),
                ...autoColumns.map((v) => v.dataIndex),
              ])
            }
          >
            选择全部
          </a>
        )}
      </div>
      <div
        style={{
          position: 'relative',
          padding: '0px 12px 20px 20px',
          height: 500,
          overflowY: 'scroll',
        }}
      >
        <div
          style={{
            background: '#fff',
            position: 'sticky',
            top: 0,
            zIndex: 2,
          }}
        >
          <div style={{ height: 12 }}></div>
          <Input
            onChange={(e) => {
              setSearchValue((v) => [e, v[1] || '']);
            }}
            value={searchValue[0]}
            placeholder="请搜索列名称"
          ></Input>
          <div style={{ height: 12 }}></div>
        </div>

        <Checkbox.Group
          value={currentSelects}
          style={{ width: '100%' }}
          onChange={onChange}
        >
          <Row gutter={[8, 16]}>
            {defaultColumns.map((item) => (
              <Col
                style={
                  searchValue[0] && {
                    display:
                      typeof item?.initTitle === 'string' &&
                      item?.initTitle.includes(searchValue[0])
                        ? ''
                        : 'none',
                  }
                }
                key={item.dataIndex}
                span={8}
              >
                <Checkbox disabled={item.defaultDisable} value={item.dataIndex}>
                  {item?.customTitle || item?.initTitle || ''}
                </Checkbox>
              </Col>
            ))}
          </Row>
        </Checkbox.Group>
      </div>
    </div>
  );

  const cancleAll = (v) => {
    const arr = [];
    v.forEach((i) => {
      const obj = defaultColumns.find((o) => o.dataIndex === i);
      if (!obj?.defaultDisable) {
        arr.push(i);
      }
    });
    setCurrentSelects(_.difference(currentSelects, arr));
  };

  const choseAll = (v) => {
    const arr = [...currentSelects, ...v];

    setCurrentSelects(_.uniq(arr));
  };

  const renderLeftGroup = () => (
    <div className={styles.normalBox}>
      <div className={styles.normalTitle}>
        <span>可选列</span>
        {/* {currentSelects.length === defaultColumns.length ? (
          <a style={{ color: 'rgba(0,0,0,0.45' }}>选择全部</a>
        ) : (
          <a
            onClick={() =>
              onChange([...defaultColumns.map((v) => v.dataIndex), ...autoColumns.map((v) => v.dataIndex)])
            }
          >
            选择全部
          </a>
        )} */}
      </div>
      <div
        style={{
          padding: '12px 12px 20px 20px',
          height: 500,
          overflowY: 'scroll',
        }}
      >
        <Input
          onChange={(e) => {
            setSearchValue((v) => [e, v[1] || '']);
          }}
          value={searchValue[0]}
          placeholder="请搜索列名称"
        ></Input>
        <div style={{ height: 12 }}></div>
        <Checkbox.Group
          value={currentSelects}
          style={{ width: '100%' }}
          onChange={onChange}
        >
          {tagColumns.map((item, index) => (
            <div key={item.tagName || index}>
              <div
                style={{ marginBottom: 14, marginTop: index === 0 ? 0 : 34 }}
              >
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    marginRight: 8,
                  }}
                >
                  {item.tagName || '基础信息'}
                </span>
                {_.intersection(currentSelects, item.colSpan).length ===
                item.colSpan.length ? (
                  <a onClick={() => cancleAll(item.colSpan)}>取消选择</a>
                ) : (
                  <a onClick={() => choseAll(item.colSpan)}>选择全部</a>
                )}
              </div>
              <Row gutter={[8, 16]}>
                {item.colSpan.map((i) => {
                  const obj = defaultColumns.find((o) => o.dataIndex === i);
                  return (
                    <Col
                      style={
                        searchValue[0] && {
                          display:
                            typeof obj?.initTitle === 'string' &&
                            obj?.initTitle.includes(searchValue[0])
                              ? ''
                              : 'none',
                        }
                      }
                      key={i}
                      span={6}
                    >
                      <Checkbox disabled={obj?.defaultDisable} value={i}>
                        {obj?.initTitle || obj?.title || ''}
                      </Checkbox>
                    </Col>
                  );
                })}
              </Row>
            </div>
          ))}
        </Checkbox.Group>
      </div>
    </div>
  );

  const onToTop = (value, list, cb) => {
    // console.log(list)
    const arr = [value, ...list.filter((o) => o.dataIndex !== value.dataIndex)];
    cb(arr);
  };

  const onToFix = (value, list, cb) => {
    if (affixColumns.length >= 8) {
      return message.warn('最多固定8项');
    }
    const arr = [...list.filter((o) => o.dataIndex !== value.dataIndex)];
    cb(arr);
    setAffixColumns((v) => [...v, value]);
  };

  const cancleFix = (value, list, cb) => {
    const arr = [...list.filter((o) => o.dataIndex !== value.dataIndex)];
    cb(arr);
    setAutoColumns((v) => [value, ...v]);
  };
  const cancleSelect = (value) => {
    setCurrentSelects((v) => [...v.filter((o) => o !== value.dataIndex)]);
  };

  const renderSortList = (list, callback, type) => {
    const dataScore = list.filter(
      (o) => currentSelects.findIndex((v) => v === o.dataIndex) > -1,
    );

    return (
      <SortList
        onSortEnd={(v) => {
          console.log(v);
        }}
        renderItem={({ value, dom, index }) => (
          <div
            className={`${styles.listItem}`}
            onClick={() => {
              // onChange({ ...params, tableKey: '', portfolioId: value.value })
            }}
          >
            {dom}
            <span className={styles.listLabel}>
              <Paragraph
                style={{ marginBottom: 0 }}
                ellipsis={{
                  rows: 1,
                  tooltip: {
                    overlayInnerStyle: { color: '#000' },
                    color: '#fff',
                    title: value?.title,
                    zIndex: 100000,
                  },
                }}
                title={value?.initTitle || ''}
              >
                {value?.initTitle || ''}
              </Paragraph>
            </span>
            <span className={styles.aitions}>
              {value.defaultDisable ? null : (
                <CloseOutlined
                  onClick={() => cancleSelect(value, [...list], callback)}
                  className={styles.listAction}
                />
              )}
              {index === 0 ? null : (
                <Tooltip getPopupContainer={(e) => e} title={'置顶'}>
                  <VerticalAlignTopOutlined
                    onClick={() => onToTop(value, [...list], callback)}
                    className={styles.listAction}
                  />
                </Tooltip>
              )}

              {type !== 1 && (
                <Tooltip getPopupContainer={(e) => e} title={'固定'}>
                  <PushpinOutlined
                    onClick={() => onToFix(value, [...list], callback)}
                    style={{ marginRight: 0 }}
                    className={styles.listAction}
                  />
                </Tooltip>
              )}
              {type === 1 && (
                <PushpinFilled
                  onClick={() => cancleFix(value, [...list], callback)}
                />
              )}
            </span>
          </div>
        )}
        dataSource={
          searchValue[1]
            ? dataScore.filter((o) => {
                try {
                  return searchValue[1]
                    ? (o?.initTitle || '')?.includes(searchValue[1])
                    : o;
                } catch (error) {
                  return false;
                }
              })
            : dataScore
        }
        setDataSource={callback}
      ></SortList>
    );
  };

  const renderRight = () => (
    <div className={styles.normalBox}>
      <div className={styles.normalTitle}>
        <span>
          已选列{' '}
          <span
            style={{ color: 'rgba(0,0,0,0.45)', fontSize: 12, fontWeight: 400 }}
          >
            (拖动调整顺序，最多固定8项)
          </span>
        </span>
        <a
          onClick={() => {
            onChange([
              ...defaultColumns
                .filter((o) => o.defaultDisable)
                .map((item) => item.dataIndex),
            ]);
          }}
        >
          清空全部
        </a>
      </div>
      <div
        style={{
          position: 'relative',
          padding: '0px 0 12px 0',
          height: 500,
          overflowY: 'scroll',
        }}
      >
        <div
          style={{
            position: 'sticky',
            top: 0,
            padding: '0 12px 0 20px',
            background: '#fff',
          }}
        >
          <div style={{ height: 12 }}></div>
          <Input
            onChange={(e) => {
              setSearchValue((v) => [v[0] || '', e]);
            }}
            value={searchValue[1]}
            placeholder="请搜索列名称"
          ></Input>
          <div style={{ height: 12 }}></div>
        </div>
        {renderSortList(affixColumns, setAffixColumns, 1)}
        {renderSortList(autoColumns, setAutoColumns, 2)}
      </div>
    </div>
  );

  return (
    <span>
      {customIcon ? (
        <div onClick={() => setOpen(true)}>{customIcon}</div>
      ) : (
        <Tooltip color="#000" title={'配置表格字段'}>
          <AppstoreFilled
            onClick={() => setOpen(true)}
            className={styles.spActions}
          ></AppstoreFilled>
        </Tooltip>
      )}
      <Modal
        onCancel={onClose}
        open={open}
        width={tagColumns?.length ? 800 : 1000}
        footer={null}
        title="自定义列"
      >
        <div className={styles.settingBox}>
          {tagColumns?.length ? (
            <Row gutter={16}>
              <Col span={24}>{renderLeftGroup()}</Col>
            </Row>
          ) : (
            <Row gutter={16}>
              <Col span={16}>{renderLeft()}</Col>
              <Col span={8}>{renderRight()}</Col>
            </Row>
          )}

          <div style={{ height: 26 }}></div>
          <Row gutter={[16, 16]} justify="space-between">
            <Col span={16}>
              <Button
                loading={resaveTableConfigLoading}
                onClick={() => {
                  initColumns('init');
                  if (tableId) resaveTableConfig(tableId);
                }}
              >
                恢复默认
              </Button>
            </Col>
            <Col span={8}>
              <div style={{ textAlign: 'right', width: '100%' }}>
                <Button onClick={onClose}>取消</Button>
                &nbsp; &nbsp;
                <Button loading={loading} onClick={onFinish} type="primary">
                  应用
                </Button>
              </div>
            </Col>
          </Row>
        </div>
      </Modal>
    </span>
  );
};
export default SettingColumns;
