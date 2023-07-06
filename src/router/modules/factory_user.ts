const factory_user: AuthRoute.Route = {
  name: 'user_factory',
  path: '/user/factory',
  component: 'self',
  meta: {
    title: '派送人员管理',
    requiresAuth: true,
    keepAlive: true,
    singleLayout: 'basic',
    icon: 'uiw:user',
    order: 3,
    permissions: ['super', 2]
  }
};

export default factory_user;
