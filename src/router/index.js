import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'
import UserManagementView from '@/views/UserManagementView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // '/dashboard/status1' 경로로 접속하면 DashboardView를 보여줍니다.
    {
      path: '/dashboard/status1',
      name: 'dashboard-status1',
      component: DashboardView,
    },
    // '/dashboard/status2' 경로로 접속하면 DashboardView를 보여줍니다.
    {
      path: '/dashboard/status2',
      name: 'dashboard-status2',
      component: DashboardView,
    },
    // '/management/users' 경로로 접속하면 UserManagementView를 보여줍니다.
    {
      path: '/management/users',
      name: 'user-management',
      component: UserManagementView,
    },
    // 여기에 필요한 다른 페이지 경로들을 계속 추가할 수 있습니다.
  ],
})

export default router
