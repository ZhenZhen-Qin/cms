import { message } from 'antd';
import { addCommunityInfo, } from './service';
const Model = {
  namespace: 'create_community',
  state: {},
  effects: {
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
};
export default Model;
