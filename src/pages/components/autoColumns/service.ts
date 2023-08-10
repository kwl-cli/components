import { request } from 'umi';

const getSetting = (data: any) => request('/api/getList', { data });
const saveTableConfigApi = (data: any) => request('/api/getList', { data });
const resaveTableConfigApi = (data: any) => request('/api/getList', { data });

export { getSetting, saveTableConfigApi, resaveTableConfigApi };
