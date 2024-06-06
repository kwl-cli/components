import Icon from '@ant-design/icons';
import React from 'react';
import file from './icon_file.svg';
import folder from './icon_folder.svg';
import folderOpen from './icon_folderOpen.svg';
import nodeExport from './icon_node_export.svg';
import nodeImport from './icon_node_import.svg';

export const IconNodeImport = (props) => (
  <Icon component={nodeImport} {...props} />
);
export const IconNodeExport = (props) => (
  <Icon component={nodeExport} {...props} />
);
export const IconFolderOpen = (props) => (
  <Icon component={folderOpen} {...props} />
);
export const IconFolder = (props) => <Icon component={folder} {...props} />;
export const IconFile = (props) => <Icon component={file} {...props} />;
