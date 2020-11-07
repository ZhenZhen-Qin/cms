import { getCommunityList,joinCommunity } from './service';
const Model = {
  namespace: 'lookCommunity',
  state: {
    list: [],
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getCommunityList, payload);
      yield put({
        type: 'queryList',
        payload: response && response.data || [],
      });
    },

    *join({ payload }, { call, put }) {
      const response = yield call(joinCommunity, payload);
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
