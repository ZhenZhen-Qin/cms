import { history } from 'umi';
import { message } from 'antd';
import { parse } from 'qs';
import { fakeAccountLogin, getFakeCaptcha } from './service';
import { LOCAL_STORAGE_KEYS } from '../../../utils/enum';
export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}
export function setAuthority(authority) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  localStorage.setItem('antd-pro-authority', JSON.stringify(proAuthority)); // hard code
  // reload Authorized component

  try {
    if (window.reloadAuthorized) {
      window.reloadAuthorized();
    }
  } catch (error) {
    // do not need do anything
  }

  return authority;
}
const Model = {
  namespace: 'userAndlogin',
  state: {
    status: undefined,
  },
  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      console.log(response);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      }); // Login successfully

      if (response.status === 'ok') {
        message.success('登录成功！');
        // 暂存用户昵称和用户名
        window._USER_INFO = {
          userName: response.userName,
          nickName: response.nickName,
        };

        localStorage.setItem(LOCAL_STORAGE_KEYS.USER_NAME, response.userName);
        localStorage.setItem(LOCAL_STORAGE_KEYS.NICK_NAME, response.nickName);
        localStorage.setItem(LOCAL_STORAGE_KEYS.HEAD_IMG, response.headImg);
        localStorage.setItem(LOCAL_STORAGE_KEYS.currentAuthority, response.currentAuthority);

        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;

        if (redirect) {
          const redirectUrlParams = new URL(redirect);

          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);

            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }

        if(response.currentAuthority !== 'sysadmin'){
          history.replace(redirect || '/student/look-community');
        }else{
          history.replace(redirect || '/list/audit-list');
        }
      }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
export default Model;
