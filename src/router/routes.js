const routes = [
  {
    path: '/',
    component: () => import('@/views/layouts/EmptyLayout.vue'),
    meta: { requiresAuth: false },
    children: [
      {
        path: '/',
        component: () => import('@/views/layouts/MainLayout.vue'),
        redirect: to => { return '/about' },
        children: [
          {
            path: '/login',
            name: '/login',
            component: () => import('@/controllers/auth/SigninView.vue'),
            meta: { requiresAuth: false }
          },
          {
            path: '/register',
            name: '/register',
            component: () => import('@/controllers/auth/JoinView.vue'),
            meta: { requiresAuth: false }
          },
          {
            path: '/about',
            name: '/about',
            component: () => import('@/controllers/AboutController.vue'),
            meta: {
              breadcrumbName: 'About',
              breadcrumbParentName: '',
              requiresAuth: false,
            },
          },
          {
            path: '/lists/users',
            name: '/lists/users',
            component: () => import('@/controllers/lists/users/UserListController.vue'),
            meta: {
              breadcrumbName: 'Users',
              breadcrumbParentName: '',
              requiresAuth: false,
            },
          },
          {
            path: '/lists/users/:rId/:rName',
            name: '/lists/users/:rId/:rName',
            component: () => import('@/controllers/lists/users/UserReadController.vue'),
            meta: {
              breadcrumbName: ':rName',
              breadcrumbParentName: '/lists/users',
              requiresAuth: false,
            },
          },
          {
            path: '/lists/email-messages',
            name: '/lists/email-messages',
            component: () => import('@/controllers/lists/email-messages/EmailMessageListController.vue'),
            meta: {
              breadcrumbName: 'EmailMessages',
              breadcrumbParentName: '',
            },
          },
          {
            path: '/lists/email-messages/:rId/:rName',
            name: '/lists/email-messages/:rId/:rName',
            component: () => import('@/controllers/lists/email-messages/EmailMessageReadController.vue'),
            meta: {
              breadcrumbName: ':rName',
              breadcrumbParentName: '/lists/email-messages',
            },
          },
        ],
        meta: { requiresAuth: false }
      }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('@/controllers/ErrorNotFound.vue'),
    meta: { requiresAuth: false }
  }
];

export default routes;
