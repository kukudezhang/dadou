const company_user: AuthRoute.Route = {
  name: 'user_company',
  path: '/user/company',
  component: 'self',
  meta: {
    title: '用户',
    requiresAuth: true,
    keepAlive: true,
    singleLayout: 'basic',
    icon: 'uiw:user',
    order: 3,
    permissions: ['super', 1]
  }
};

export default company_user;
