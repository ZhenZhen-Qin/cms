// https://umijs.org/config/
import {
  defineConfig
} from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
const {
  REACT_APP_ENV
} = process.env;
export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    // default true, when it is true, will use `navigator.language` overwrite default
    antd: true,
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [{
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [{
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [{
            path: '/user',
            redirect: '/user/login',
          },
          {
            name: '登录',
            icon: 'smile',
            path: '/user/login',
            component: './user/login',
          },
          {
            name: '注册结果',
            icon: 'smile',
            path: '/user/register-result',
            component: './user/register-result',
          },
          {
            name: '注册',
            icon: 'smile',
            path: '/user/register',
            component: './user/register',
          },
          {
            component: '404',
          },
        ],
      },
      {
        path: '/',
        component: '../layouts/BasicLayout',
        // Routes: ['src/pages/Authorized'],
        // authority: ['admin', 'user'],
        routes: [{
            path: '/',
            redirect: '/list/community-list',
          },
          {
            path: '/list',
            icon: 'table',
            name: '社团管理',
            Routes: ['src/pages/Authorized'],
            authority: ['admin', 'user'],
            routes: [{
                path: '/',
                redirect: '/list/community-list',
              },
              {
                name: '社团列表',
                icon: 'smile',
                path: '/list/community-list',
                component: './list/community-list',
              },
              {
                name: '社团成员列表',
                icon: 'smile',
                path: '/list/member-list',
                component: './list/member-list',
              },
              {
                name: '社团审核列表',
                icon: 'smile',
                path: '/list/audit-list',
                component: './list/audit-list',
              },
            ],
          },
          {
            // 活动管理 路由设置
            path: '/active',
            icon: 'table',
            name: '活动管理',
            routes: [{
                path: '/active/active-list',
                redirect: '/active/active-list/articles',
              },
              {
                name: '活动列表',
                icon: 'smile',
                path: '/active/active-list/projects',
                component: './active/active-list/projects',
              },
              {
                name: '资讯列表',
                icon: 'smile',
                path: '/active/active-list/articles',
                component: './active/active-list/articles',
              },
              {
                name: 'applications',
                icon: 'smile',
                path: '/active/active-list/applications',
                component: './active/active-list/applications',
              },
            ],
          },
          {
            path: '/user-manage',
            icon: 'table',
            name: '用户管理',
            Routes: ['src/pages/Authorized'],
            authority: ['admin', 'user'],
            routes: [{
              name: '用户列表',
              icon: 'smile',
              path: '/user-manage/user-list',
              component: './user/user-list',
            }, ],
          },

          {
            name: '所有社团（学生看的）',
            icon: 'smile',
            path: '/student/look-community',
            Routes: ['src/pages/Authorized'],
            authority: ['admin', 'user'],
            component: './student/look-community',
          },
          {
            name: '所有活动（学生看的）',
            icon: 'smile',
            path: '/student/look-active',
            Routes: ['src/pages/Authorized'],
            authority: ['admin', 'user'],
            component: './student/look-active',
          },
          {
            name: '新闻资讯（学生看的）',
            icon: 'smile',
            path: '/student/look-information',
            Routes: ['src/pages/Authorized'],
            authority: ['admin', 'user'],
            component: './student/look-information',
          },
          

          // {
          //   path: '/dashboard',
          //   name: 'dashboard',
          //   icon: 'dashboard',
          //   routes: [{
          //       path: '/',
          //       redirect: '/dashboard/analysis',
          //     },
          //     {
          //       name: 'analysis',
          //       icon: 'smile',
          //       path: '/dashboard/analysis',
          //       component: './dashboard/analysis',
          //     },
          //     {
          //       name: 'monitor',
          //       icon: 'smile',
          //       path: '/dashboard/monitor',
          //       component: './dashboard/monitor',
          //     },
          //     {
          //       name: 'workplace',
          //       icon: 'smile',
          //       path: '/dashboard/workplace',
          //       component: './dashboard/workplace',
          //     },
          //   ],
          // },
          {
            path: '/form',
            icon: 'form',
            name: 'form',
            routes: [{
                path: '/',
                redirect: '/form/basic-form',
              },
              {
                name: 'basic-form',
                icon: 'smile',
                path: '/form/basic-form',
                component: './form/basic-form',
              },
              {
                name: 'step-form',
                icon: 'smile',
                path: '/form/step-form',
                component: './form/step-form',
              },
              {
                name: 'advanced-form',
                icon: 'smile',
                path: '/form/advanced-form',
                component: './form/advanced-form',
              },
            ],
          },

          {
            path: '/profile',
            name: 'profile',
            icon: 'profile',
            routes: [{
                path: '/',
                redirect: '/profile/basic',
              },
              {
                name: 'basic',
                icon: 'smile',
                path: '/profile/basic',
                component: './profile/basic',
              },
              {
                name: 'advanced',
                icon: 'smile',
                path: '/profile/advanced',
                component: './profile/advanced',
              },
            ],
          },
          {
            name: 'result',
            icon: 'CheckCircleOutlined',
            path: '/result',
            routes: [{
                path: '/',
                redirect: '/result/success',
              },
              {
                name: 'success',
                icon: 'smile',
                path: '/result/success',
                component: './result/success',
              },
              {
                name: 'fail',
                icon: 'smile',
                path: '/result/fail',
                component: './result/fail',
              },
            ],
          },
          {
            name: 'exception',
            icon: 'warning',
            path: '/exception',
            routes: [{
                path: '/',
                redirect: '/exception/403',
              },
              {
                name: '403',
                icon: 'smile',
                path: '/exception/403',
                component: './exception/403',
              },
              {
                name: '404',
                icon: 'smile',
                path: '/exception/404',
                component: './exception/404',
              },
              {
                name: '500',
                icon: 'smile',
                path: '/exception/500',
                component: './exception/500',
              },
            ],
          },
          {
            name: 'account',
            icon: 'user',
            path: '/account',
            routes: [{
                path: '/',
                redirect: '/account/center',
              },
              {
                name: 'center',
                icon: 'smile',
                path: '/account/center',
                component: './account/center',
              },
              {
                name: 'settings',
                icon: 'smile',
                path: '/account/settings',
                component: './account/settings',
              },
            ],
          },
          {
            name: 'editor',
            icon: 'highlight',
            path: '/editor',
            routes: [{
                path: '/',
                redirect: '/editor/flow',
              },
              {
                name: 'flow',
                icon: 'smile',
                path: '/editor/flow',
                component: './editor/flow',
              },
              {
                name: 'mind',
                icon: 'smile',
                path: '/editor/mind',
                component: './editor/mind',
              },
              {
                name: 'koni',
                icon: 'smile',
                path: '/editor/koni',
                component: './editor/koni',
              },
            ],
          },
          {
            component: '404',
          },
        ],
      },
    ],
  }, ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  // proxy: proxy[REACT_APP_ENV || 'dev'],
  proxy: {
    '/api/': 'http://localhost:3000/',
    //只要是以 “/myserver ”开头的，都指向http://localhost:8060/test/

    //如果不想始终传递 /server ，则需要重写路径；方法如下：
    //只要前端调用的接口是以 /server/api/ 开头的，都指向http://localhost:8080/
    //  '/server/api/': {
    //    target: 'http://localhost:3000/',
    //    changeOrigin: true,
    //    pathRewrite: { '^/server': '' },
    //    //最终指向到的服务器地址是 "http://localhost:8080/api/ "
    //  },
  },
  manifest: {
    basePath: '/',
  },
});
