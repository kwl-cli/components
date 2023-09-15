export interface ColumnConfig {
  /**
   * 是否需要为每一列的 VNode 设置 key 属性
   */
  useKey?: boolean;
  /**
   * 当鼠标点击列头时，是否要高亮当前列
   */
  isCurrent?: boolean;
  /**
   * 当鼠标移到列头时，是否要高亮当前头
   */
  isHover?: boolean;
  /**
   * 每一列是否启用列宽调整
   */
  resizable?: boolean;
  /**
   * 每一列的宽度
   */
  width?: number;
  /**
   * 每一列的最小宽度
   */
  minWidth?: number;
  /**
   * 每一列的最大宽度
   */
  maxWidth?: number;
  /**
   * 固定列允许设置的最大数量（如果是分组，则一个分组算一个）
   */
  maxFixedSize?: number;
  /**
   * 每一列的自定义表头单元格数据导出方法，返回自定义的标题
   */
  headerExportMethod?: (params: any) => string | number;
  /**
   * 每一列的自定义单元格数据导出方法，返回自定义的值
   */
  exportMethod?: (params: any) => string | number;
  /**
   * 每一列的自定义表尾单元格数据导出方法，返回自定义的值
   */
  footerExportMethod?: (params: any) => string | number;
}

export type VxeTableProps = {
  size?: null | '' | 'medium' | 'small' | 'mini';
  /**
   * 唯一标识
   * 当使用某个特定功能时，需要设置才能生效
   */
  id?: string;
  /**
   * 表格数据
   * 与 loadData 行为一致，更新数据是不会重置状态
   */
  data?: any[];
  /**
   * 表格的高度；支持铺满父容器或者固定高度，如果设置 auto 为铺满父容器（如果设置为 auto，则必须确保存在父节点且不允许存在相邻元素）
   */
  height?: number;
  /**
   * 表格最小高度
   */
  minHeight?: number;
  /**
   * max-height
   */
  maxHeight?: number;
  /**
   * 是否带有斑马纹（需要注意的是，在可编辑表格场景下，临时插入的数据不会有斑马纹样式）
   */
  stripe?: boolean;
  /**
   * 是否为圆角边框
   */
  round?: boolean;
  /**
   * 是否带有边框
   */
  border?: boolean;
  /**
   * 表格是否显示加载中
   */
  loading?: boolean;
  /**
   * 所有的列对齐方式
   */
  align?: 'left' | 'center' | 'right' | '' | null;
  /**
   * 所有的表头列的对齐方式
   */
  headerAlign?: 'left' | 'center' | 'right' | '' | null;
  /**
   * 所有的表尾列的对齐方式
   */
  footerAlign?: 'left' | 'center' | 'right' | '' | null;
  /**
   * 是否显示表头
   */
  showHeader?: boolean;
  /**
   * 是否显示表尾
   */
  showFooter?: boolean;
  /**
   * 表尾的数据获取方法，返回一个二维数组
   */
  footerMethod?: {
    columns: any[];
    data: any[];
  };
  /**
   * 给行附加 className
   */
  rowClassName?: Record<string, any>;
  /**
   * 给单元格附加 className
   */
  cellClassName?: Record<string, any>;
  /**
   * 给表头的行附加 className
   */
  headerRowClassName?: Record<string, any>;
  /**
   * 给表头的单元格附加 className
   */
  headerCellClassName?: Record<string, any>;
  /**
   * 给表尾的行附加 className
   */
  footerRowClassName?: Record<string, any>;
  /**
   * 给表尾的单元格附加 className
   */
  footerCellClassName?: Record<string, any>;
  /**
   * 给单元格附加样式
   */
  cellStyle?: Record<string, any>;
  /**
   * 给行附加样式，也可以是函数
   */
  rowStyle?: Record<string, any>;
  /**
   * 给表头单元格附加样式
   */
  headerCellStyle?: Record<string, any>;
  /**
   * 给表头行附加样式
   */
  headerRowStyle?: Record<string, any>;
  /**
   * 给表尾行附加样式
   */
  footerRowStyle?: Record<string, any>;
  /**
   * 给表尾单元格附加样式
   */
  footerCellStyle?: Record<string, any>;
  /**
   * 临时合并指定的单元格 (不能用于展开行，不建议用于固定列、树形结构)
   */
  mergeCells?: Record<string, any>;
  /**
   * 临时合并表尾 (不能用于展开行，不建议用于固定列、树形结构)
   */
  mergeFooterItems?: Record<string, any>;
  /**
   * 自定义合并函数，返回计算后的值 (不能用于虚拟滚动、展开行，不建议用于固定列、树形结构)
   */
  spanMethod?: (params: any) => void;
  /**
   * 表尾合并行或列，返回计算后的值 (不能用于虚拟滚动、展开行，不建议用于固定列、树形结构)
   */
  footerSpanMethod?: (params: any) => void;
  /**
   * 设置所有内容过长时显示为省略号（如果是固定列建议设置该值，提升渲染速度）
   */
  showOverflow?: boolean;
  /**
   * 设置表头所有内容过长时显示为省略号
   */
  showHeaderOverflow?: boolean;
  /**
   * 设置表尾所有内容过长时显示为省略号
   */
  showFooterOverflow?: boolean;
  /**
   * 保持原始值的状态，被某些功能所依赖，比如编辑状态、还原数据等
   */
  keepSource?: boolean;
  /**
   * 自动监听父元素的变化去重新计算表格（对于父元素可能存在动态变化、显示隐藏的容器中、列宽异常等场景中的可能会用到）
   */
  autoResize?: boolean;
  /**
   * 自动跟随某个属性的变化去重新计算表格，和手动调用 recalculate 方法是一样的效果（对于通过某个属性来控制显示/隐藏切换时可能会用到）
   */
  syncResize?: boolean;
  /**
   * 列配置信息
   */
  columnConfig?: ColumnConfig;
  /**
   * 行配置信息
   */
  rowConfig?: any;
  /**
   * 个性化信息配置项
   */
  customConfig?: any;
  /**
   * 响应式布局配置项
   */
};

export type VxeColumnProps<D = VxeTableDataRow> = {
  colId?: VxeColumnPropTypes.ColId;
  /**
   * 渲染类型
   */
  type?: VxeColumnPropTypes.Type;
  /**
   * 列字段名
   */
  field?: VxeColumnPropTypes.Field;
  /**
   * 列标题
   */
  title?: VxeColumnPropTypes.Title;
  /**
   * 列宽度
   */
  width?: VxeColumnPropTypes.Width;
  /**
   * 列最小宽度，把剩余宽度按比例分配
   */
  minWidth?: VxeColumnPropTypes.MinWidth;
  /**
   * 列最大宽度
   */
  maxWidth?: VxeColumnPropTypes.MaxWidth;
  /**
   * 是否允许拖动列宽调整大小
   */
  resizable?: VxeColumnPropTypes.Resizable;
  /**
   * 将列固定在左侧或者右侧
   */
  fixed?: VxeColumnPropTypes.Fixed;
  /**
   * 列对其方式
   */
  align?: VxeColumnPropTypes.Align;
  /**
   * 表头对齐方式
   */
  headerAlign?: VxeColumnPropTypes.HeaderAlign;
  /**
   * 表尾列的对齐方式
   */
  footerAlign?: VxeColumnPropTypes.FooterAlign;
  /**
   * 当内容过长时显示为省略号
   */
  showOverflow?: VxeColumnPropTypes.ShowOverflow;
  /**
   * 当表头内容过长时显示为省略号
   */
  showHeaderOverflow?: VxeColumnPropTypes.ShowHeaderOverflow;
  /**
   * 当表尾内容过长时显示为省略号
   */
  showFooterOverflow?: VxeColumnPropTypes.ShowFooterOverflow;
  /**
   * 给单元格附加 className
   */
  className?: VxeColumnPropTypes.ClassName<D>;
  /**
   * 给表头单元格附加 className
   */
  headerClassName?: VxeColumnPropTypes.HeaderClassName<D>;
  /**
   * 给表尾单元格附加 className
   */
  footerClassName?: VxeColumnPropTypes.FooterClassName<D>;
  /**
   * 格式化显示内容
   */
  formatter?: VxeColumnPropTypes.Formatter<D>;
  /**
   * 是否允许排序
   */
  sortable?: VxeColumnPropTypes.Sortable;
  /**
   * 自定义排序的属性
   */
  sortBy?: VxeColumnPropTypes.SortBy<D>;
  /**
   * 排序的字段类型，比如字符串转数值等
   */
  sortType?: VxeColumnPropTypes.SortType;
  /**
   * 配置筛选条件数组
   */
  filters?: VxeColumnPropTypes.Filter[];
  /**
   * 筛选是否允许多选
   */
  filterMultiple?: VxeColumnPropTypes.FilterMultiple;
  /**
   * 自定义筛选方法
   */
  filterMethod?: VxeColumnPropTypes.FilterMethod<D>;
  /**
   * 筛选模板配置项
   */
  filterRender?: VxeColumnPropTypes.FilterRender;
  /**
   * 指定为树节点
   */
  treeNode?: VxeColumnPropTypes.TreeNode;
  /**
   * 是否可视
   */
  visible?: VxeColumnPropTypes.Visible;
  /**
   * 自定义表尾单元格数据导出方法
   */
  headerExportMethod?: VxeColumnPropTypes.HeaderExportMethod<D>;
  /**
   * 自定义单元格数据导出方法
   */
  exportMethod?: VxeColumnPropTypes.ExportMethod<D>;
  /**
   * 自定义表尾单元格数据导出方法
   */
  footerExportMethod?: VxeColumnPropTypes.FooterExportMethod<D>;
  /**
   * 已废弃，被 titlePrefix 替换
   * @deprecated
   */
  titleHelp?: VxeColumnPropTypes.TitleHelp;
  /**
   * 标题帮助图标配置项
   */
  titlePrefix?: VxeColumnPropTypes.TitlePrefix;
  /**
   * 单元格值类型
   */
  cellType?: VxeColumnPropTypes.CellType;
  /**
   * 单元格渲染配置项
   */
  cellRender?: VxeColumnPropTypes.CellRender<D>;
  /**
   * 单元格编辑渲染配置项
   */
  editRender?: VxeColumnPropTypes.EditRender<D>;
  /**
   * 内容渲染配置项
   */
  contentRender?: VxeColumnPropTypes.ContentRender;
  /**
   * 额外的参数
   */
  params?: VxeColumnPropTypes.Params;
};
