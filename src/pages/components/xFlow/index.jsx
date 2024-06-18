import { Graph, Shape } from '@antv/x6';
import { Dnd } from '@antv/x6-plugin-dnd';
import { Keyboard } from '@antv/x6-plugin-keyboard';
import { Selection } from '@antv/x6-plugin-selection';
import { register } from '@antv/x6-react-shape';
import SpInput from '@src/components/commonComp/submitSearch/SpInput';
import { useFullscreen } from 'ahooks';
import { nanoid } from 'nanoid';
import React, { useEffect, useRef, useState } from 'react';
import Actions from './components/actions';
import NodeConfig from './components/nodeConfig';
import styles from './index.module.less';
import { nodeConfig, validataForEdge } from './validata';

const AlgoNode = (props) => {
  const { node, ...rest } = props;
  const data = node?.getData();
  // 鼠标进入矩形主区域的时候显示连接桩
  const onMainMouseEnter = () => {
    if (node?.getPorts) {
      // 获取该节点下的所有连接桩
      const ports = node.getPorts() || [];
      ports.forEach((port) => {
        node.setPortProp(port.id, 'attrs/circle', {
          stroke: '#1677FF',
        });
      });
    }
  };

  // 鼠标离开矩形主区域的时候隐藏连接桩
  const onMainMouseLeave = () => {
    if (node?.getPorts) {
      // 获取该节点下的所有连接桩
      const ports = node.getPorts() || [];
      ports.forEach((port) => {
        node.setPortProp(port.id, 'attrs/circle', {
          fill: 'transparent',
          stroke: 'transparent',
        });
      });
    }
  };

  return (
    <div
      style={
        data?.status === 'error'
          ? {
              background: '#FFF1F0',
              border: '1px solid #FFA39E',
            }
          : {}
      }
      onMouseEnter={onMainMouseEnter}
      onMouseLeave={onMainMouseLeave}
      className="node-item"
    >
      {nodeConfig[data?.type || rest?.data?.type]?.icon}
      <span className={`node-label`}>{data?.label || rest?.data?.label}</span>
    </div>
  );
};

const arrNode = [
  {
    title: '输入输出',
    type: 'title',
    searchValue: '输入@输出',
    isDrag: false,
  },
  {
    title: '输入',
    type: 'in',
  },
  {
    title: '输出',
    type: 'out',
  },
];

register({
  shape: 'custom-input',
  width: 160,
  height: 40,
  component: AlgoNode,
  ports: {
    groups: {
      left: {
        position: 'left',
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: 'transparent',
            strokeWidth: 2,
            fill: 'transparent',
          },
        },
      },
      right: {
        position: 'right',
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: 'transparent',
            strokeWidth: 2,
            fill: 'transparent',
          },
        },
      },
    },
  },
});

const initNodes = [
  {
    shape: 'custom-input',
    label: '输入',
    id: 'in',
    type: 'in',
    x: 290,
    y: 110,
    data: {
      label: '输入',
      type: 'in',
      id: 'in',
    },
    ports: {
      items: [
        {
          id: 'in',
          group: 'right',
        },
      ],
    },
  },
  {
    shape: 'custom-input',
    id: 'out',
    label: '输出',
    x: 590,
    y: 110,
    type: 'out',
    data: {
      label: '输出',
      id: 'out',
      type: 'out',
    },
    ports: {
      items: [
        {
          id: 'out',
          group: 'left',
        },
      ],
    },
  },
];

const Index = () => {
  const ref = useRef();
  const nodeRef = useRef();
  const graphRef = useRef();
  const dndRef = useRef();
  const dndContainerRef = useRef();
  const fullRef = useRef(null);
  const [isFullscreen, { enterFullscreen, exitFullscreen }] =
    useFullscreen(fullRef);

  const [cArrNodeList, setCArrNodeList] = useState(arrNode);
  const [currentCells, setCurrentCells] = useState({});

  const initCells = (data) => {
    const arr = [];
    const obj = {
      edge: [],
    };
    data.forEach((item) => {
      if (item.shape === 'custom-input') {
        if (obj[item.type]?.length) {
          obj[item.type].push({ type: item.type, id: item.id });
        } else {
          obj[item.type] = [{ type: item.type, id: item.id }];
        }
        arr.push(graphRef.current.createNode(item));
      } else {
        obj.edge.push({
          id: item.id || nanoid(4),
          source: item.source,
          target: item.target,
        });
        arr.push(graphRef.current.createEdge(item));
      }
    });
    setCurrentCells(obj);
    graphRef.current.resetCells(arr);
  };

  // 删除元素
  const deleteCells = (graph) => {
    const cells = graph.getSelectedCells();

    if (cells.length) {
      const edgeArr = cells.filter((o) => o.isEdge());
      // 删除边时，去掉来源和目标的内部数据
      if (edgeArr.length) {
        edgeArr.forEach((i) => {
          console.log('first', i.getAttrs());
        });
      }
      const arr = cells.map((i) => i.getData()).filter((o) => o);

      setCurrentCells((v) => {
        const obj = { ...v };
        arr.forEach((o) => {
          if (obj[o.type]) {
            obj[o.type] = obj[o.type].filter((i) => i.id !== o.id);
          }
        });
        return obj;
      });

      graph.removeCells(cells);
    }
  };
  const initFlow = () => {
    const graph = new Graph({
      container: ref.current,
      autoResize: true,
      mousewheel: true,
      panning: true,
      background: {
        color: '#F2F3F5',
      },

      connecting: {
        allowNode: false,
        allowBlank: false,
        highlight: true,
        router: 'manhattan',
        connector: {
          name: 'rounded',
          args: {
            radius: 8,
          },
        },
        anchor: 'center',
        connectionPoint: 'anchor',
        snap: {
          radius: 20,
        },

        createEdge() {
          return new Shape.Edge({
            attrs: {
              line: {
                stroke: '#A2B1C3',
                strokeWidth: 2,
                targetMarker: {
                  name: 'block',
                  width: 12,
                  height: 8,
                },
              },
            },
            zIndex: 0,
          });
        },
        validateMagnet({ magnet }) {
          // 节点左侧方的连接桩无法创建连线
          return magnet.getAttribute('port-group') !== 'left';
        },
        validateConnection({
          sourceCell,
          targetCell,
          sourceMagnet,
          targetMagnet,
        }) {
          // 不能连接自身
          if (sourceCell === targetCell) {
            return false;
          }
          // 只能从 left 连接桩开始连接，连接到 right 连接桩
          if (
            !sourceMagnet ||
            sourceMagnet.getAttribute('port-group') === 'left'
          ) {
            return false;
          }
          if (
            !targetMagnet ||
            targetMagnet.getAttribute('port-group') !== 'left'
          ) {
            return false;
          }

          // 不能重复连线
          const edges = this.getEdges();
          const portId = targetMagnet.getAttribute('port');
          const sourceCellData = sourceCell.getData();

          const valid = validataForEdge(
            sourceCellData,
            sourceCellData?.config || {},
            sourceCell,
          );
          if (!valid) {
            return false;
          }
          // 输出节点只能连一条线
          if (
            portId.includes('out') &&
            edges.find((edge) => edge.getTargetPortId() === portId)
          ) {
            return false;
          }

          // 连线成功，记录一下 来源、去向 数组
          const targetCellData = targetCell.getData();

          sourceCell.prop('data', {
            ...sourceCellData,
            targerObjs: [
              ...new Set([
                ...(sourceCellData?.targerObjs || []),
                targetCellData.id,
              ]),
            ],
          });

          targetCell.prop('data', {
            ...targetCellData,
            sourceObjs: [
              ...new Set([
                ...(targetCellData?.sourceObjs || []),
                sourceCellData.id,
              ]),
            ],
          });

          return true;
        },
      },
      highlighting: {
        // 连接桩可以被连接时在连接桩外围围渲染一个包围框
        magnetAvailable: {
          name: 'stroke',
          args: {
            attrs: {
              fill: '#fff',
              stroke: '#A4DEB1',
              strokeWidth: 4,
            },
          },
        },
        // 连接桩吸附连线时在连接桩外围围渲染一个包围框
        magnetAdsorbed: {
          name: 'stroke',
          args: {
            attrs: {
              fill: '#fff',
              stroke: '#31d0c6',
              strokeWidth: 4,
            },
          },
        },
      },
    });

    // 点击节点
    graph.on('node:click', ({ node }) => {
      const data = node?.getData();
      nodeRef.current.showModal(data, node);
    });
    // 点击空白的地方
    graph.on('blank:click', () => {
      nodeRef.current.closeModal();
    });

    // 启用框选
    graph
      .use(
        new Selection({
          enabled: true,
          multiple: false,
          rubberband: false,
          movable: true,
          showNodeSelectionBox: true,
        }),
      )
      .use(new Keyboard());

    graph.bindKey('backspace', () => {
      deleteCells(graph);
    });

    graphRef.current = graph;

    initCells(initNodes);
  };

  const bindDnd = () => {
    const obj = isFullscreen ? { draggingContainer: fullRef.current } : {};

    const dnd = new Dnd({
      target: graphRef.current,
      ...obj,
      getDropNode: (draggingNode) => {
        const { id, type } = draggingNode.getData();
        setCurrentCells((v) => ({
          ...v,
          [type]: [
            ...(v[type] || []),
            {
              id,
              type,
            },
          ],
        }));

        return draggingNode.clone({ keepId: true });
      },
    });

    dndRef.current = dnd;
  };

  const startDrag = (e, item) => {
    const id = nanoid(4).replace('-', '');
    const data = {
      shape: 'custom-input',
      label: item.title,
      id: `${item.type}_${id}`,
      data: {
        label: item.title,
        type: item.type,
        id: `${item.type}_${id}`,
      },
      ports: {
        items: nodeConfig[item?.type]?.ports.map((i) => ({
          id: `port_${i}_${item.type}_${id}`,
          group: i,
        })),
      },
    };
    // 该 node 为拖拽的节点，默认也是放置到画布上的节点，可以自定义任何属性
    const node = graphRef.current.createNode(data);
    dndRef.current.start(node, e.nativeEvent);
  };

  useEffect(() => {
    initFlow();
  }, []);

  useEffect(() => {
    if (graphRef.current) bindDnd();
  }, [isFullscreen]);

  return (
    <div
      ref={fullRef}
      className={styles.container}
      style={{ width: '100%', height: '100%', display: 'flex' }}
    >
      <div className={styles.dndContainer} ref={dndContainerRef}>
        <div
          style={{
            width: '240px',
            padding: '8px 20px',
            borderTopLeftRadius: 4,
            borderBottom: '1px solid #E5E5E5',
            marginBottom: 8,
          }}
        >
          <SpInput
            placeholder="搜索组件"
            onChange={(v) => {
              if (v) {
                setCArrNodeList(
                  arrNode.filter((i) =>
                    (i?.searchValue || i.title).includes(v),
                  ),
                );
              } else {
                setCArrNodeList(arrNode);
              }
            }}
            style={{ width: 200 }}
          ></SpInput>
        </div>
        {cArrNodeList.map((i) =>
          i?.type === 'title' ? (
            <div className={styles.titleItem} key={i.title}>
              {i.title}
            </div>
          ) : i.type === 'out' && currentCells?.out?.length > 0 ? (
            <div className={styles.dedItemDisabled}>
              {nodeConfig[i?.type]?.icon}
              <span className={`node-label`}>{i?.title}</span>
            </div>
          ) : (
            <div
              key={i.title}
              data-type="rect"
              className={styles.dedItem}
              onMouseDown={
                i?.isDrag === false ? () => {} : (e) => startDrag(e, i)
              }
            >
              <AlgoNode data={{ label: i.title, type: i.type }}></AlgoNode>
            </div>
          ),
        )}
      </div>
      <div style={{ flex: 1, width: 0, height: '100%', position: 'relative' }}>
        <Actions
          graphRef={graphRef}
          isFullscreen={isFullscreen}
          exitFullscreen={exitFullscreen}
          enterFullscreen={enterFullscreen}
          deleteCells={deleteCells}
        ></Actions>
        <div ref={ref}></div>
        <NodeConfig
          changeNode={(nodeLabel, nodeData, node) => {
            node.prop('data', { ...nodeData, ...nodeLabel });
          }}
          onOk={(va, nod) => {
            const da = nod.getData();
            if (va?.label)
              nod.prop('data', {
                ...da,
                config: va,
                label: va?.label,
                status: '',
              });
          }}
          ref={nodeRef}
        ></NodeConfig>
      </div>
    </div>
  );
};
export default Index;
