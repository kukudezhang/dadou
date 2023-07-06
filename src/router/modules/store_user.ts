const store_user: AuthRoute.Route = {
  name: 'user_store',
  path: '/user/store',
  component: 'self',
  meta: {
    title: '派送人员管理',
    requiresAuth: true,
    keepAlive: true,
    singleLayout: 'basic',
    icon: 'uiw:user',
    order: 3,
    permissions: ['super', 4]
  }
};

export default store_user;
