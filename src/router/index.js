import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'
import UserManagementView from '@/views/UserManagementView.vue'
import LoginView from '@/views/LoginView.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 1. 로그인 경로는 레이아웃이 없습니다.
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    // 2. 그 외 모든 경로는 DefaultLayout을 사용하고, 로그인이 필요합니다.
    {
      path: '/',
      component: DefaultLayout, // 이 경로에 접속하면 먼저 DefaultLayout을 렌더링
      meta: { requiresAuth: true }, // 이 경로는 로그인이 필요하다고 표시
      children: [
        // DefaultLayout의 <router-view>에 렌더링될 자식 경로들
        { path: 'dashboard/status1', name: 'dashboard-status1', component: DashboardView },
        { path: 'dashboard/status2', name: 'dashboard-status2', component: DashboardView },
        { path: 'management/users', name: 'user-management', component: UserManagementView },
      ],
    },
  ],
})

// 3. 네비게이션 가드 (문지기) 설정
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  // 로그인이 필요한 페이지인데, 로그인이 안 되어있다면
  if (requiresAuth && !authStore.isLoggedIn) {
    // 로그인 페이지로 리다이렉트
    next('/login')
  } else {
    // 그 외의 경우는 정상적으로 페이지 이동
    next()
  }
})

export default router
