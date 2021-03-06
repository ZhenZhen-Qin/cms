import request from '../../../utils/request';

/**    
 * 创建社团
 */
// 添加社团
export async function addCommunityInfo(params) {
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
  return request('/api/community/getCommunityList', {
    method: 'POST',
    data: {
      ...params
    },
  });
}


// 获取社团管理员列表
export async function getCommunityAdminList(params) {
  return request('/api/admin/getCommunityAdminList', {
    method: 'POST',
    data: {
      ...params
    },
  });
}


// 添加社团管理员
export async function addCommunityAdmin(params) {
  return request('/api/admin/addCommunityAdmin', {
    method: 'POST',
    data: {
      ...params
    },
  });
}

// 添加社团管理员
export async function removeCommunityAdmin(params) {
  return request('/api/admin/delete', {
    method: 'POST',
    data: {
      ...params
    },
  });
}

// 添加社团管理员
export async function updateStatus(params) {
  return request('/api/admin/updateStatus', {
    method: 'POST',
    data: {
      ...params
    },
  });
}


// 查找所有用户
export async function getAllUserList(params) {
  return request('/api/user/getUserList', {
    method: 'POST',
    data: {
      ...params
    },
  });
}
