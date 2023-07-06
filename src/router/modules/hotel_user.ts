const hotel_user: AuthRoute.Route = {
  name: 'user_hotel',
  path: '/user/hotel',
  component: 'self',
  meta: {
    title: '用户',
    requiresAuth: true,
    keepAlive: true,
    singleLayout: 'basic',
    icon: 'uiw:user',
    order: 3,
    permissions: ['super', 3]
  }
};

export default hotel_user;
