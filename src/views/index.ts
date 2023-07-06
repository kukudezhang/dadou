import type { RouteComponent } from 'vue-router';

export const views: Record<
  PageRoute.LastDegreeRouteKey,
  RouteComponent | (() => Promise<{ default: RouteComponent }>)
> = {
  403: () => import('./_builtin/403/index.vue'),
  404: () => import('./_builtin/404/index.vue'),
  500: () => import('./_builtin/500/index.vue'),
  'constant-page': () => import('./_builtin/constant-page/index.vue'),
  login: () => import('./_builtin/login/index.vue'),
  'not-found': () => import('./_builtin/not-found/index.vue'),
  organizations_add: () => import('./organizations/add/index.vue'),
  organizations: () => import('./organizations/index.vue'),
  user_admin_add: () => import('./user/admin/add/index.vue'),
  user_admin: () => import('./user/admin/index.vue'),
  user_company: () => import('./user/company/index.vue'),
  user_factory: () => import('./user/factory/index.vue'),
  user_hotel: () => import('./user/hotel/index.vue'),
  user_store: () => import('./user/store/index.vue'),
  welcome: () => import('./welcome/index.vue')
};
