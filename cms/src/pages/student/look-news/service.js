import request from 'umi-request';

export async function queryFakeList(params) {
  return request('/api/news/find', {
    method: 'POST',
    data: {
      ...params
    },
  });
}

export async function join(params) {
  return request('/api/news/add', {
    method: 'POST',
    data: {
      ...params
    },
  });
}

// 获取所有社团
export async function getAllCommunityList() {
  return request('/api/active/find', {
    method: 'POST',
    data: {
      "current":1,
      "pageSize":1000,
      "sorter":{},
      "filter":{},
      "communityScreen":"0",
    }
  });
}
