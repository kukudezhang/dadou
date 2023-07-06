const welcome: AuthRoute.Route = {
  name: 'welcome',
  path: '/welcome',
  component: 'self',
  meta: {
    title: '首页',
    requiresAuth: true,
    keepAlive: true,
    singleLayout: 'basic',
    icon: 'material-symbols:other-houses-outline',
    order: 1
  }
};

export default welcome;
