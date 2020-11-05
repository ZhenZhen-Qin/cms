/**
 * 社团分类 
 */
export const COMMUNITY_TYPE = {
  theory_learning: '理论学习类',
  social_welfare: '社会公益类',
  academic_science_and_technology: '学术科技类',
  culture_and_art: '文化艺术类',
  sports_fitness: '体育健身类',
  other_categories: '其他类',
}


// 社团筛选 字段
export const COMMUNITY_SCREEN = {
  ALL: '0', // 全部
  CREATE: '1', // 筛选“我创建的社团”
  MANAGE: '2', // 筛选“我管理的社团"
}



// localStorage 的key 字段 
export const LOCAL_STORAGE_KEYS = {
  USER_NAME: 'userName', // 用于登录的用户名
  NICK_NAME: 'nickName', // 昵称
}



// 审核状态
export const COMMUNITY_STATUS = {
  CANCEL: 0, // 注销
  IN_REVIEW: 1, // 审核中
  PASS: 2, // 审核通过
  NO_PASS: 3, // 审核不通过
}
