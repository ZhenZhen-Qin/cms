import { queryFakeList,join } from './service';
const Model = {
  namespace: 'lookNews',
  state: {
    list: [],
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryFakeList, payload);
      console.log(response)
      yield put({
        type: 'queryList',
        payload: response && Array.isArray(response.data) ? response.data : [],
      });
    },

    *join({ payload }, { call, put }) {
      const response = yield call(join, payload);
      return response;
    },
  },
  reducers: {
    queryList(state, action) {
      return { ...state, list: action.payload };
    },
  },
};
export default Model;
