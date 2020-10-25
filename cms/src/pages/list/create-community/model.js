import { message } from 'antd';
import communityService from './service';
const Model = {
  namespace: 'create_community',
  state: {},
  effects: {
    *submitRegularForm({ payload }, { call }) {
      yield call(fakeSubmitForm, payload);
      message.success('提交成功');
    },
    
    // 创建社团
    *addCommunity({ payload }, { call }) {
      const result = yield call(communityService.addCommunity, payload);
      return result;
    },
  },
};
export default Model;
