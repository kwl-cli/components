import { axiosGet, axiosPost } from '@src/service/axios';

export const getTemplateDetail = (id) =>
  axiosGet(`/api/survey/instance/query?id=${id}`);
export const getSurviceList = (data) =>
  axiosPost(`/api/survey/result/page`, data);
