import request from '../../../utils/request';

/**    
 * 创建社团
 */
// 添加社团
export async function addCommunityInfo(params) {
  console.log(params)
  if (params._id) {
    return request('/api/news/update', {
      method: 'POST',
      data: {
        ...params
      },
    });
  }
  return request('/api/news/add', {
    method: 'POST',
    data: {
      ...params
    },
  });
}


// 获取资讯列表
export async function getActiveList(params) {
  console.log(params)
  return request('/api/news/find', {
    method: 'POST',
    data: {
      ...params
    },
  });
}

// 删除活动
export async function deleteActive(params) {
  console.log(params)
  return request('/api/news/delete', {
    method: 'POST',
    data: {
      ...params
    },
  });
}


// 获取社团列表
export async function getCommunityList(params) {
  console.log(params)
  return request('/api/active/find', {
    method: 'POST',
    data: {
      ...params
    },
  });
}


// 添加社团管理员
export async function addCommunityAdmin(params) {
  console.log(params)
  return request('/api/admin/addCommunityAdmin', {
    method: 'POST',
    data: {
      ...params
    },
  });
}

// 添加社团管理员
export async function removeCommunityAdmin(params) {
  console.log(params)
  return request('/api/admin/delete', {
    method: 'POST',
    data: {
      ...params
    },
  });
}


// 查找所有用户
export async function getAllUserList(params) {
  console.log(params)
  return request('/api/user/getUserList', {
    method: 'POST',
    data: {
      ...params
    },
  });
}
