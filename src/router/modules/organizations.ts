const organizations: AuthRoute.Route = {
  name: 'organizations',
  path: '/organizations',
  component: 'self',
  // children: [
  //   {
  //     name: 'organizations_add',
  //     path: '/organizations/add',
  //     component: 'self',
  //     meta: {
  //       title: '添加组织',
  //       requiresAuth: true,
  //       keepAlive: true,
  //       // singleLayout: 'basic',
  //       icon: 'uiw:plus-circle-o',
  //       order: 2,
  //       permissions: ['super', 0]
  //     }
  //   },
  //   {
  //     name: 'organizations_view',
  //     path: '/organizations/view',
  //     component: 'self',
  //     meta: {
  //       title: '管理组织',
  //       requiresAuth: true,
  //       keepAlive: true,
  //       // singleLayout: 'basic',
  //       icon: 'mdi:image-filter-vintage',
  //       order: 2,
  //       permissions: ['super', 0]
  //     }
  //   }
  // ],
  meta: {
    title: '组织管理',
    requiresAuth: true,
    keepAlive: true,
    singleLayout: 'basic',
    icon: 'ic:outline-theater-comedy',
    order: 2,
    permissions: [0, 'super']
  }
};
export default organizations;
