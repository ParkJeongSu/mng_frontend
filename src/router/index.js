// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTabsStore } from '@/stores/tabs' // tabs 스토어 import

import DefaultLayout from '@/layouts/DefaultLayout.vue'
import HomeView from '../views/HomeView.vue'
import LoginView from '../layouts/LoginView.vue'
import ProfileView from '../views/ProfileView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/',
      component: DefaultLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView,
          meta: { titleKey: 'menuNames.home' },
        },
        {
          path: 'profile',
          name: 'profile',
          component: ProfileView,
          meta: { titleKey: '프로필' },
        },
        {
          path: 'modeler/system/menu_setting/menu',
          name: 'Menu',
          component: () => import('../views/modeler/system/menu_setting/MenuView.vue'),
          meta: { titleKey: 'menuNames.menu' },
        },
        {
          path: 'modeler/system/menu_setting/system_def',
          name: 'SystemDef',
          component: () => import('../views/modeler/system/menu_setting/SystemDefView.vue'),
          meta: { titleKey: 'menuNames.systemDef' },
        },
        {
          path: 'modeler/system/menu_setting/auth_menu',
          name: 'AuthMenu',
          component: () => import('../views/modeler/system/menu_setting/AuthMenuView.vue'),
          meta: { titleKey: 'menuNames.authorityMenu' },
        },
        {
          path: 'modeler/system/user_setting/auth',
          name: 'Auth',
          component: () => import('../views/modeler/system/user_setting/AuthView.vue'),
          meta: { titleKey: 'menuNames.auth' },
        },
        {
          path: 'modeler/system/user_setting/user',
          name: 'User',
          component: () => import('../views/modeler/system/user_setting/UserView.vue'),
          meta: { titleKey: 'menuNames.users' },
        },
        {
          path: 'modeler/sample/subsample1/user_list_view',
          name: 'UserListView',
          component: () => import('../views/modeler/sample/sub_sample1/UserListView.vue'),
          meta: { titleKey: '사용자 목록' },
        },
        {
          path: 'modeler/sample/subsample1/user_list_view2',
          name: 'UserListView2',
          component: () => import('../views/modeler/sample/sub_sample1/UserListView2.vue'),
          meta: { titleKey: '사용자 목록 2' },
        },
        {
          path: 'modeler/sample/subsample2/dash_board_view',
          name: 'DashboardView',
          component: () => import('../views/modeler/sample/sub_sample2/DashboardView.vue'),
          meta: { titleKey: '대시보드 view' },
        },
        {
          path: 'modeler/sample/subsample2/user_mangement_view',
          name: 'UserManagementView',
          component: () => import('../views/modeler/sample/sub_sample2/UserManagementView.vue'),
          meta: { titleKey: '유저 관리 view' },
        },
      ],
    },
  ],
})

router.beforeEach(function (to, from, next) {
  const authStore = useAuthStore()
  const tabsStore = useTabsStore()

  if (to.meta.requiresAuth && !authStore.accessToken) {
    next('/login')
  } else {
    // 이동하려는 페이지가 탭으로 열릴 수 있는 페이지라면(meta.title이 있다면)
    if (to.meta.titleKey) {
      tabsStore.addTab(to)
    }
    next()
  }
})

export default router
