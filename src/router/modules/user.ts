const user: AuthRoute.Route = {
  name: 'user_admin',
  path: '/user/admin',
  component: 'self',
  // children: [
  //   {
  //     name: 'user_admin',
  //     path: '/user/admin',
  //     component: 'self',
  //     meta: {
  //       title: '用户管理',
  //       requiresAuth: true,
  //       keepAlive: true,
  //       // singleLayout: 'basic',
  //       icon: 'mdi:account-supervisor-outline',
  //       order: 2,
  //       permissions: ['super', 0]
  //     }
  //   },
  //   {
  //     name: 'user_company',
  //     path: '/user/company',
  //     component: 'self',
  //     meta: {
  //       title: '用户管理',
  //       requiresAuth: true,
  //       keepAlive: true,
  //       // singleLayout: 'basic',
  //       icon: 'mdi:account-supervisor-outline',
  //       order: 2,
  //       permissions: ['super', 1]
  //     }
  //   },
  //   {
  //     name: 'user_factory',
  //     path: '/user/factory',
  //     component: 'self',
  //     meta: {
  //       title: '用户管理',
  //       requiresAuth: true,
  //       keepAlive: true,
  //       // singleLayout: 'basic',
  //       icon: 'mdi:account-supervisor-outline',
  //       order: 2,
  //       permissions: ['super', 2]
  //     }
  //   },
  //   {
  //     name: 'user_hotel',
  //     path: '/user/hotel',
  //     component: 'self',
  //     meta: {
  //       title: '管理用户',
  //       requiresAuth: true,
  //       keepAlive: true,
  //       // singleLayout: 'basic',
  //       icon: 'mdi:account-supervisor-outline',
  //       order: 2,
  //       permissions: ['super', 4]
  //     }
  //   },
  //   {
  //     name: 'user_admin_add',
  //     path: '/user/admin/add',
  //     component: 'self',
  //     meta: {
  //       title: '添加用户',
  //       requiresAuth: true,
  //       keepAlive: true,
  //       // singleLayout: 'basic',
  //       icon: 'uiw:plus-circle-o',
  //       order: 1,
  //       permissions: ['super', 0]
  //     }
  //   }
  // ],
  meta: {
    title: '用户管理',
    requiresAuth: true,
    keepAlive: true,
    singleLayout: 'basic',
    icon: 'uiw:user',
    order: 3,
    permissions: [0, 'super']
  }
};

export default user;
