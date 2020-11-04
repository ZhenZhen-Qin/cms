import request from '../../../utils/request';

/**    
 * 创建社团
 */
// 添加社团
export async function addCommunityInfo(params) {
  console.log(params)
  if (params._id) {
    return request('/api/community/updateCommunityInfo', {
      method: 'POST',
      data: {
        ...params
      },
    });
  }
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
