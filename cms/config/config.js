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
        Routes: ['src/pages/Authorized'],
        authority: ['admin','sysadmin','user'],
        routes: [{
            path: '/',
            redirect: '/student/look-community',
          },
         
          {
            name: '社团招募',
            icon: 'smile',
            path: '/student/look-community',
            Routes: ['src/pages/Authorized'],
            authority: ['admin', 'user'],
            component: './student/look-community',
          },
          {
            name: '社团活动',
            icon: 'smile',
            path: '/student/look-active',
            Routes: ['src/pages/Authorized'],
            authority: ['admin', 'user'],
            component: './student/look-active',
          },
          {
            name: '新闻资讯',
            icon: 'smile',
            path: '/student/look-news',
            Routes: ['src/pages/Authorized'],
            authority: ['admin', 'user'],
            component: './student/look-news',
          },
          // {
          //   name: 'exception',
          //   icon: 'warning',
          //   path: '/exception',
          //   routes: [{
          //       path: '/',
          //       redirect: '/exception/403',
          //     },
          //     {
          //       name: '403',
          //       icon: 'smile',
          //       path: '/exception/403',
          //       component: './exception/403',
          //     },
          //     {
          //       name: '404',
          //       icon: 'smile',
          //       path: '/exception/404',
          //       component: './exception/404',
          //     },
          //     {
          //       name: '500',
          //       icon: 'smile',
          //       path: '/exception/500',
          //       component: './exception/500',
          //     },
          //   ],
          // },

          {
            path: '/list',
            icon: 'table',
            name: '社团管理',
            Routes: ['src/pages/Authorized'],
            routes: [{
                path: '/',
                redirect: '/list/community-list',
              },
              {
                name: '社团列表',
                icon: 'smile',
                path: '/list/community-list',
                component: './list/community-list',
                Routes: ['src/pages/Authorized'],
                authority: ['admin','user'],
              },
              {
                name: '社团成员列表',
                icon: 'smile',
                path: '/list/member-list',
                component: './list/member-list',
                Routes: ['src/pages/Authorized'],
                authority: ['admin','user'],
              },
              {
                name: '社团审核列表',
                icon: 'smile',
                path: '/list/audit-list',
                component: './list/audit-list',
                Routes: ['src/pages/Authorized'],
                authority: ['sysadmin'],
              },
            ],
          },
          {
            // 活动管理 路由设置
            path: '/active',
            icon: 'table',
            name: '活动管理',
            routes: [{
                path: '/',
                redirect: '/active/active-list',
              },
              {
                name: '活动列表',
                icon: 'smile',
                path: '/active/active-list',
                component: './active/active-list',
                Routes: ['src/pages/Authorized'],
                authority: ['admin','user'],
              },
              {
                name: '资讯列表',
                icon: 'smile',
                path: '/active/news-list',
                component: './active/news-list',
                Routes: ['src/pages/Authorized'],
                authority: ['admin','user'],
              },
            ],
          },
          {
            path: '/user-manage',
            icon: 'table',
            name: '用户管理',
            Routes: ['src/pages/Authorized'],
            authority: ['sysadmin'],
            routes: [{
              name: '用户列表',
              icon: 'smile',
              path: '/user-manage/user-list',
              component: './user/user-list',
            }, ],
          },

          {
            name: '个人信息',
            icon: 'user',
            path: '/account',
            routes: [{
                path: '/',
                redirect: '/account/center',
              },
              {
                name: '设置',
                icon: 'smile',
                path: '/account/settings',
                component: './account/settings',
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
    '/upload': {              
      "target": "http://localhost:3000/", //上传图片的域名
      "changeOrigin": true
    }

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
