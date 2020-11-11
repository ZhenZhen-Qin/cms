import {
  queryCity,
  queryCurrent,
  queryProvince,
  query as queryUsers,
  getUserInfo,
  updateUserInfo,
} from './service';
const Model = {
  namespace: 'accountAndsettings',
  state: {
    currentUser: {},
    userInfo: {},
    province: [],
    city: [],
    isLoading: false,
  },
  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },

    *fetchProvince(_, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryProvince);
      yield put({
        type: 'setProvince',
        payload: response,
      });
    },

    *fetchCity({ payload }, { call, put }) {
      const response = yield call(queryCity, payload);
      yield put({
        type: 'setCity',
        payload: response,
      });
    },

    *getUserInfo({ payload }, { call, put }) {
      const response = yield call(getUserInfo, payload);
    
      yield put({
        type: 'setUserInfo',
        payload: response,
      });
      return response;
    },

    *update({ payload }, { call, put }) {
      const response = yield call(updateUserInfo, payload);
      return response;
    },
  },
  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },

    changeNotifyCount(state = {}, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },

    setProvince(state, action) {
      return {
        ...state,
        province: action.payload,
      };
    },

    setCity(state, action) {
      return {
        ...state,
        city: action.payload,
      };
    },

    setUserInfo(state, action) {
      return {
        ...state,
        userInfo: (action.payload && action.payload.data && action.payload.data[0]) || {},
      };
    },

    changeLoading(state, action) {
      return {
        ...state,
        isLoading: action.payload,
      };
    },
  },
};
export default Model;
