import request from 'umi-request';
export async function queryCurrent() {
  return request('/api/currentUser');
}
export async function queryProvince() {
  return request('/api/geographic/province');
}
export async function queryCity(province) {
  return request(`/api/geographic/city/${province}`);
}
export async function query() {
  return request('/api/users');
}


// 图片上传
export async function uploads(params) {
  return request('/api/uploads/imgs', {
    method: 'POST',
    data: { ...params },
  });
}
// 获取个人用户信息
export async function getUserInfo(params) {
  return request('/api/user/getUserInfo', {
    method: 'POST',
    data: { ...params },
  });
}
// 修改个人用户信息
export async function updateUserInfo(params) {
  return request('/api/user/update', {
    method: 'POST',
    data: { ...params },
  });
}
