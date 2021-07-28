/*
* Nuxt.js配置文件
* */

module.exports = {
  router: {
    // 自定义路由表规则
    extendRoutes(routes, resolve) {
      // 首先清空数组，清空nuxt默认生成的路由表
      routes.splice(0)
      routes.push(...[
        {
          path: '/',
          component: resolve(__dirname, 'pages/layout'),
          children: [
            {
              path: '', // 默认子路由
              name: 'home',
              component: resolve(__dirname, 'pages/home/')
            },
            {
              path: '/login',
              name: 'login',
              component: resolve(__dirname, 'pages/login/')
            },
            {
              path: '/register',
              name: 'register',
              component: resolve(__dirname, 'pages/login/')
            },
            {
              path: '/profile/:username',
              name: 'profile',
              component: resolve(__dirname, 'pages/profile/')
            },
            {
              path: '/settings/',
              name: 'settings',
              component: resolve(__dirname, 'pages/settings/')
            },
            {
              path: '/editor/',
              name: 'editor',
              component: resolve(__dirname, 'pages/editor/')
            },
            {
              path: '/article/:slug',
              name: 'article',
              component: resolve(__dirname, 'pages/article/')
            },
          ]
        }
      ])
    },
    linkActiveClass: 'active',  // default nav-link-active,
  },
  // 注册插件
  plugins: [
    '~/plugins/request.js',
    '~/plugins/dayjs.js'
  ],
  head: {
    meta: [
      { charset: 'utf-8' }
    ]
  }
}