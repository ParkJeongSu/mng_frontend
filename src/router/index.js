// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTabsStore } from '@/stores/tabs' // tabs 스토어 import

import DefaultLayout from '@/layouts/DefaultLayout.vue'
import HomeView from '../views/HomeView.vue'
import DashboardView from '../views/DashboardView.vue'
import UserManagementView from '../views/UserManagementView.vue'
import LoginView from '../layouts/LoginView.vue'
import ProfileView from '../views/ProfileView.vue'
import UserListView from '../views/management/UserListView.vue'
import ProductListPage from '@/views/management/ProductListPage.vue'

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
        { path: '', name: 'home', component: HomeView, meta: { title: '홈' } },
        {
          path: 'product-list',
          name: 'product-list',
          component: ProductListPage,
          meta: { title: '프로덕트 목록' },
        },
        {
          path: 'profile',
          name: 'profile',
          component: ProfileView,
          meta: { title: '프로필' },
        },
        {
          path: 'management/users/list',
          name: 'user-list',
          component: UserListView, // 여기를 수정
          meta: { title: '사용자 목록' },
        },
        {
          path: 'management/users/list2',
          name: 'user-list2',
          component: () => import('../views/management/UserListView2.vue'),
          meta: { title: '사용자 목록' },
        },
        {
          path: 'dashboard/status1',
          name: 'dashboard-status1',
          component: DashboardView,
          meta: { title: '현황 1' },
        },
        {
          path: 'dashboard/status2',
          name: 'dashboard-status2',
          component: DashboardView,
          meta: { title: '현황 2' },
        },
        {
          path: 'management/users/create',
          name: 'user-create',
          component: UserManagementView,
          meta: { title: '사용자 등록' },
        },
        {
          path: 'management/groups/list',
          name: 'group-list',
          component: UserManagementView,
          meta: { title: '그룹 목록' },
        },
        // 통계 메뉴 경로 추가 (예시)
        {
          path: 'stats/daily',
          name: 'stats-daily',
          component: DashboardView,
          meta: { title: '일별 통계' },
        },
        {
          path: 'stats/monthly',
          name: 'stats-monthly',
          component: DashboardView,
          meta: { title: '월별 통계' },
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
    if (to.meta.title) {
      tabsStore.addTab(to)
    }
    next()
  }
})

export default router
