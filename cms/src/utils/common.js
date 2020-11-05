import {
  COMMUNITY_TYPE
} from './enum';
/** 
 * 社团分类
 */
export const communityType = [{
    label: '理论学习类',
    value: 'theory_learning'
  }, {
    label: '社会公益类',
    value: 'social_welfare'
  }, {
    label: '学术科技类',
    value: 'academic_science_and_technology'
  },
  {
    label: '文化艺术类',
    value: 'culture_and_art'
  }, {
    label: '体育健身类',
    value: 'sports_fitness'
  }, {
    label: '其他类',
    value: 'other_categories'
  },
]

/** 
 * 社团分类  select框的值
 */
export const communityTypeSelect = {
  'theory_learning': {
    text: '理论学习类',
  },
  'social_welfare': {
    text: '社会公益类',
  },
  'academic_science_and_technology': {
    text: '学术科技类',
  },
  'culture_and_art': {
    text: '文化艺术类',
  },
  'sports_fitness': {
    text: '体育健身类',
  },
  'other_categories': {
    text: '其他类',
  },
}
