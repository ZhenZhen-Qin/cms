// import request from 'umi-request';
import request from '../../utils/request';
export async function queryRule(params) {
  const res = request('/api/rule', {
    params,
  });

  console.log(res)
  return res;

}
export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete'
    },
  });
}
export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'post'
    },
  });
}
export async function updateRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'update'
    },
  });
}


// 添加社团
export async function addCommunityInfo(params) {
  console.log(params)
  return request('/api/community/addCommunityInfo', {
    method: 'POST',
    data: {
      ...params
    },
  });
}

// 获取社团列表
export async function getCommunityList(params) {
  console.log(params)
  return request('/api/community/getCommunityList', {
    method: 'POST',
    data: {
      ...params
    },
  });
}
