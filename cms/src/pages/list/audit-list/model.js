import { message } from 'antd';
import { getCommunityList,addCommunityInfo } from './service';

import { extend, getTableSorter } from '../../../utils/utils';

const stateData = {
  list: [],
  details: {},
  pagination: {},
};

const Model =  {
  namespace: 'audit',
  state: {},
  effects: {
    // 初始化state
    *initState({ payload = {} }, { put }) {
      yield put({
        type: 'save',
        payload: extend(true, {}, stateData),
      });
    },

    *fetch({ payload  }, { put, call }) {
    console.log(payload,getCommunityList);

      let params = payload || {};
      const data = {
        list: [],
      };
      // const pagination = {
      //   current: params.current ? parseInt(params.current) : 1,
      //   pageSize: params.pageSize ? parseInt(params.pageSize) : 10,
      // };

      const options = {
        current: params.current ? parseInt(params.current) : 1,
        pageSize: params.pageSize ? parseInt(params.pageSize) : 10,
      };

      const result = yield call(getCommunityList, options);
      if (result && result.returnValue && result.returnValue.content) {
        const list = result.returnValue.content;
        data.list = list;
        data.pagination = {
          ...pagination,
          total: result.returnValue.total,
        };
      }

      yield put({
        type: 'save',
        payload: data,
      });
      return data;
    },

    *submitRegularForm({ payload }, { call }) {
      yield call(fakeSubmitForm, payload);
      message.success('提交成功');
    },

    // 创建社团
    *addCommunityInfo({ payload }, { call }) {
      const result = yield call(addCommunityInfo, payload);
      return result;
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};

export default Model;
