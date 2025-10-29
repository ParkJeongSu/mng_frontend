// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTabsStore } from '@/stores/tabs' // tabs 스토어 import

import DefaultLayout from '@/layouts/DefaultLayout.vue'
import HomeView from '../views/HomeView.vue'
import LoginView from '../layouts/LoginView.vue'
import ProfileView from '../views/ProfileView.vue'

// 라우터 설정시 주의사항
// 1. 메타 필드에 titleKey를 설정할 때는 반드시 'menuNames.' 접두사를 사용하세요.
//    예: meta: { titleKey: 'menuNames.home' }
// 2. 라우트 이름(name)은 고유해야 하며, 중복되지 않도록 주의하세요.
// #### vue 파일 이름과 동일하게 작성하세요 ###
// ex ) MenuView.vue  -> name: 'MenuView'
// 3. 라우트 경로(path)는 명확하고 일관되게 작성하세요.
// 4. 동적 임포트 구문을 사용할 때는 경로가 올바른지 확인하세요.

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
          path: 'modeler/system/menu-setting/menu',
          name: 'MenuView',
          component: () => import('../views/modeler/system/menu-setting/MenuView.vue'),
          meta: { titleKey: 'menuNames.menu' },
        },
        {
          path: 'modeler/system/menu-setting/system-def',
          name: 'SystemDefView',
          component: () => import('../views/modeler/system/menu-setting/SystemDefView.vue'),
          meta: { titleKey: 'menuNames.systemDef' },
        },
        {
          path: 'modeler/system/menu-setting/auth-menu',
          name: 'AuthMenuView',
          component: () => import('../views/modeler/system/menu-setting/AuthMenuView.vue'),
          meta: { titleKey: 'menuNames.authorityMenu' },
        },
        {
          path: 'modeler/system/user-setting/auth',
          name: 'AuthView',
          component: () => import('../views/modeler/system/user-setting/AuthView.vue'),
          meta: { titleKey: 'menuNames.auth' },
        },
        {
          path: 'modeler/system/user-setting/user',
          name: 'UserView',
          component: () => import('../views/modeler/system/user-setting/UserView.vue'),
          meta: { titleKey: 'menuNames.users' },
        },

        {
          path: 'modeler/system/alarm-setting/alarm-def',
          name: 'AlarmDefView',
          component: () => import('../views/modeler/system/alarm-setting/AlarmDefView.vue'),
          meta: { titleKey: 'menuNames.alarmDef' },
        },
        {
          path: 'modeler/system/alarm-setting/alarm',
          name: 'AlarmView',
          component: () => import('../views/modeler/system/alarm-setting/AlarmView.vue'),
          meta: { titleKey: 'menuNames.alarm' },
        },
        {
          path: 'modeler/system/alarm-setting/alarm-user-group',
          name: 'AlarmUserGroupView',
          component: () => import('../views/modeler/system/alarm-setting/AlarmUserGroupView.vue'),
          meta: { titleKey: 'menuNames.alarmUserGroup' },
        },
        {
          path: 'modeler/system/alarm-setting/alarm-user-group-users',
          name: 'AlarmUserGroupUsersView',
          component: () =>
            import('../views/modeler/system/alarm-setting/AlarmUserGroupUsersView.vue'),
          meta: { titleKey: 'menuNames.alarmUserGroupUsers' },
        },
        {
          path: 'modeler/system/alarm-setting/alarm-action',
          name: 'AlarmActionView',
          component: () => import('../views/modeler/system/alarm-setting/AlarmActionView.vue'),
          meta: { titleKey: 'menuNames.alarmAction' },
        },
        // 시작
        {
          path: 'modeler/factory/equipment-setting/equipment-def',
          name: 'EquipmentDefView',
          component: () =>
            import('../views/modeler/factory/equipment-setting/EquipmentDefView.vue'),
          meta: { titleKey: 'menuNames.EquipmentDef' },
        },
        {
          path: 'modeler/factory/equipment-setting/equipment-group',
          name: 'EquipmentGroupView',
          component: () =>
            import('../views/modeler/factory/equipment-setting/EquipmentGroupView.vue'),
          meta: { titleKey: 'menuNames.EquipmentGroup' },
        },
        {
          path: 'modeler/factory/equipment-setting/equipments',
          name: 'EquipmentsView',
          component: () => import('../views/modeler/factory/equipment-setting/EquipmentsView.vue'),
          meta: { titleKey: 'menuNames.Equipments' },
        },
        {
          path: 'modeler/factory/port-setting/port-def',
          name: 'PortDefView',
          component: () => import('../views/modeler/factory/port-setting/PortDefView.vue'),
          meta: { titleKey: 'menuNames.PortDef' },
        },
        {
          path: 'modeler/factory/port-setting/ports',
          name: 'PortsView',
          component: () => import('../views/modeler/factory/port-setting/PortsView.vue'),
          meta: { titleKey: 'menuNames.Ports' },
        },
        {
          path: 'modeler/factory/carrier-setting/carrier-def',
          name: 'CarrierDefView',
          component: () => import('../views/modeler/factory/carrier-setting/CarrierDefView.vue'),
          meta: { titleKey: 'menuNames.CarrierDef' },
        },
        {
          path: 'modeler/factory/carrier-setting/carriers',
          name: 'CarriersView',
          component: () => import('../views/modeler/factory/carrier-setting/CarriersView.vue'),
          meta: { titleKey: 'menuNames.Carriers' },
        },
        {
          path: 'modeler/history/modeler-history/historys',
          name: 'ModelerHistoryView',
          component: () =>
            import('../views/modeler/history/modeler-history/ModelerHistoryView.vue'),
          meta: { titleKey: 'menuNames.ModelerHistory' },
        },
        {
          path: 'mng/view/wip/wip-by-lot',
          name: 'WipByLotView',
          component: () => import('../views/mng/view/wip/WipByLotView.vue'),
          meta: { titleKey: 'menuNames.users' },
        },
        {
          path: 'mng/view/wip/transport-job-by-carrier',
          name: 'TransportJobByCarrierView',
          component: () => import('../views/mng/view/wip/TransportJobByCarrierView.vue'),
          meta: { titleKey: 'menuNames.users' },
        },
        {
          path: 'mng/view/wip/workorders',
          name: 'WorkOrderView',
          component: () => import('../views/mng/view/wip/WorkOrderView.vue'),
          meta: { titleKey: 'menuNames.users' },
        },
        {
          path: 'mng/view/interface/wms-receive-job',
          name: 'WMSReceiveJobView',
          component: () => import('../views/mng/view/interface/WMSReceiveJobView.vue'),
          meta: { titleKey: 'menuNames.users' },
        },
        {
          path: 'mng/view/interface/wms-send-container',
          name: 'WMSSendContainerView',
          component: () => import('../views/mng/view/interface/WMSSendContainerView.vue'),
          meta: { titleKey: 'menuNames.users' },
        },
        {
          path: 'mng/view/interface/wms-receive-container',
          name: 'WMSReceiveContainerView',
          component: () => import('../views/mng/view/interface/WMSReceiveContainerView.vue'),
          meta: { titleKey: 'menuNames.users' },
        },
        {
          path: 'mng/view/interface/wms-send-start',
          name: 'WMSSendStartView',
          component: () => import('../views/mng/view/interface/WMSSendStartView.vue'),
          meta: { titleKey: 'menuNames.users' },
        },
        {
          path: 'mng/view/interface/wms-send-end',
          name: 'WMSSendEndView',
          component: () => import('../views/mng/view/interface/WMSSendEndView.vue'),
          meta: { titleKey: 'menuNames.users' },
        },
        {
          path: 'report/production/input/from-transport-completed',
          name: 'inputTimePerArriveView',
          component: () => import('../views/report/production/input/inputTimePerArriveView.vue'),
          meta: { titleKey: 'menuNames.FromTransportCompleted' },
        },
        {
          path: 'report/production/out/from-start-to-end',
          name: 'FromStartToEndView',
          component: () => import('../views/report/production/output/FromStartToEndView.vue'),
          meta: { titleKey: 'menuNames.FromStartToEnd' },
        },
        {
          path: 'report/production/out/job-end-by-operation',
          name: 'JobEndByOperationView',
          component: () => import('../views/report/production/output/JobEndByOperationView.vue'),
          meta: { titleKey: 'menuNames.JobEndByOperation' },
        },
        {
          path: 'report/transport/arrived/arrived-by-start',
          name: 'ArrivedBySrartView',
          component: () => import('../views/report/transport/arrived/ArrivedBySrartView.vue'),
          meta: { titleKey: 'menuNames.ArrivedByStart' },
        },
        {
          path: 'report/transport/arrived/average-by-start',
          name: 'ArrivedAverageByStartView',
          component: () =>
            import('../views/report/transport/arrived/ArrivedAverageByStartView.vue'),
          meta: { titleKey: 'menuNames.AverageByStart' },
        },
        {
          path: 'report/equipment/status/equipment-by-time',
          name: 'EquipmentStatusByTimeView',
          component: () =>
            import(
              '../views/report/equipment-report/equipment-status/EquipmentStatusByTimeView.vue'
            ),
          meta: { titleKey: 'menuNames.EquipmentByTime' },
        },
        {
          path: 'report/equipment/status/equipment-by-day',
          name: 'EquipmentStatusByDayView',
          component: () =>
            import(
              '../views/report/equipment-report/equipment-status/EquipmentStatusByDayView.vue'
            ),
          meta: { titleKey: 'menuNames.EquipmentByDay' },
        },
        {
          path: 'report/equipment/status/equipment-per-average',
          name: 'EquipmentStatusAverageView',
          component: () =>
            import(
              '../views/report/equipment-report/equipment-status/EquipmentStatusAverageView.vue'
            ),
          meta: { titleKey: 'menuNames.EquipmentPerAverage' },
        },
        {
          path: 'modeler/sample/subsample1/user-list-view',
          name: 'UserListView',
          component: () => import('../views/modeler/sample/sub-sample1/UserListView.vue'),
          meta: { titleKey: '사용자 목록' },
        },
        {
          path: 'modeler/sample/subsample1/user-list-view2',
          name: 'UserListView2',
          component: () => import('../views/modeler/sample/sub-sample1/UserListView2.vue'),
          meta: { titleKey: '사용자 목록 2' },
        },
        {
          path: 'modeler/sample/subsample2/dash-board-view',
          name: 'DashboardView',
          component: () => import('../views/modeler/sample/sub-sample2/DashboardView.vue'),
          meta: { titleKey: '대시보드 view' },
        },
        {
          path: 'modeler/sample/subsample2/user-mangement-view',
          name: 'UserManagementView',
          component: () => import('../views/modeler/sample/sub-sample2/UserManagementView.vue'),
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
