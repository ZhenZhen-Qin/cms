import request from 'umi-request';
export async function queryFakeList(params) {
  return request('/api/fake_list', {
    params,
  });
}

// 获取社团列表
export async function getCommunityList(params) {
  return request('/api/community/getCommunityList', {
    method: 'POST',
    data: {
      ...params
    },
  });
}

// 申请加入该社团
export async function joinCommunity(params) {
  return request('/api/join/joinCommunity', {
    method: 'POST',
    data: {
      ...params
    },
  });
}