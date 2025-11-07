// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTabsStore } from '@/stores/tabs' // tabs 스토어 import

import DefaultLayout from '@/layouts/DefaultLayout.vue'
import HomeView from '../views/HomeView.vue'
import LoginView from '../layouts/LoginView.vue'
import ProfileView from '../views/ProfileView.vue'

// 라우터 설정시 주의사항
// 1. 메타 필드에 titleKey를 설정할 때는 반드시 'menu.' 접두사를 사용하세요.
//    예: meta: { titleKey: 'menu.home' }
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
          meta: { titleKey: 'menu.Home' },
        },
        {
          path: 'profile',
          name: 'profile',
          component: ProfileView,
          meta: { titleKey: 'menu.Profile' },
        },
        {
          path: 'modeler/system/menu-setting/menu',
          name: 'MenuView',
          component: () => import('../views/modeler/system/menu-setting/MenuView.vue'),
          meta: {
            icon: '$menu',
            titleKey: 'menu.Menu',
          },
        },
        {
          path: 'modeler/system/menu-setting/system-def',
          name: 'SystemDefView',
          component: () => import('../views/modeler/system/menu-setting/SystemDefView.vue'),
          meta: {
            icon: '$cogSyncOutline',
            titleKey: 'menu.SystemDef',
          },
        },
        {
          path: 'modeler/system/menu-setting/auth-menu',
          name: 'AuthMenuView',
          component: () => import('../views/modeler/system/menu-setting/AuthMenuView.vue'),
          meta: {
            icon: '$textAccount',
            titleKey: 'menu.AuthMenu',
          },
        },
        {
          path: 'modeler/system/user-setting/auth',
          name: 'AuthView',
          component: () => import('../views/modeler/system/user-setting/AuthView.vue'),
          meta: {
            icon: '$handFrontRightOutline',
            titleKey: 'menu.Auth',
          },
        },
        {
          path: 'modeler/system/user-setting/user',
          name: 'UserView',
          component: () => import('../views/modeler/system/user-setting/UserView.vue'),
          meta: {
            icon: '$account',
            titleKey: 'menu.User',
          },
        },

        {
          path: 'modeler/system/alarm-setting/alarm-def',
          name: 'AlarmDefView',
          component: () => import('../views/modeler/system/alarm-setting/AlarmDefView.vue'),
          meta: {
            icon: '$alarmPanel',
            titleKey: 'menu.AlarmDef',
          },
        },
        {
          path: 'modeler/system/alarm-setting/alarm',
          name: 'AlarmView',
          component: () => import('../views/modeler/system/alarm-setting/AlarmView.vue'),
          meta: {
            icon: '$alarm',
            titleKey: 'menu.Alarm',
          },
        },
        {
          path: 'modeler/system/alarm-setting/alarm-user-group',
          name: 'AlarmUserGroupView',
          component: () => import('../views/modeler/system/alarm-setting/AlarmUserGroupView.vue'),
          meta: {
            icon: '$accountGroup',
            titleKey: 'menu.AlarmUserGroup',
          },
        },
        {
          path: 'modeler/system/alarm-setting/alarm-user-group-users',
          name: 'AlarmUserGroupUsersView',
          component: () =>
            import('../views/modeler/system/alarm-setting/AlarmUserGroupUsersView.vue'),
          meta: {
            icon: '$accountConvert',
            titleKey: 'menu.AlarmUserGroupUsers',
          },
        },
        {
          path: 'modeler/system/alarm-setting/alarm-action',
          name: 'AlarmActionView',
          component: () => import('../views/modeler/system/alarm-setting/AlarmActionView.vue'),
          meta: {
            icon: '$emailOutline',
            titleKey: 'menu.AlarmAction',
          },
        },
        // 시작
        {
          path: 'modeler/factory/equipment-setting/equipment-def',
          name: 'EquipmentDefView',
          component: () =>
            import('../views/modeler/factory/equipment-setting/EquipmentDefView.vue'),
          meta: { titleKey: 'menu.EquipmentDef' },
        },
        {
          path: 'modeler/factory/equipment-setting/equipment-group',
          name: 'EquipmentGroupView',
          component: () =>
            import('../views/modeler/factory/equipment-setting/EquipmentGroupView.vue'),
          meta: { titleKey: 'menu.EquipmentGroup' },
        },
        {
          path: 'modeler/factory/equipment-setting/equipments',
          name: 'EquipmentsView',
          component: () => import('../views/modeler/factory/equipment-setting/EquipmentsView.vue'),
          meta: { titleKey: 'menu.Equipments' },
        },
        {
          path: 'modeler/factory/port-setting/port-def',
          name: 'PortDefView',
          component: () => import('../views/modeler/factory/port-setting/PortDefView.vue'),
          meta: { titleKey: 'menu.PortDef' },
        },
        {
          path: 'modeler/factory/port-setting/ports',
          name: 'PortsView',
          component: () => import('../views/modeler/factory/port-setting/PortsView.vue'),
          meta: { titleKey: 'menu.Ports' },
        },
        {
          path: 'modeler/factory/carrier-setting/carrier-def',
          name: 'CarrierDefView',
          component: () => import('../views/modeler/factory/carrier-setting/CarrierDefView.vue'),
          meta: { titleKey: 'menu.CarrierDef' },
        },
        {
          path: 'modeler/factory/carrier-setting/carriers',
          name: 'CarriersView',
          component: () => import('../views/modeler/factory/carrier-setting/CarriersView.vue'),
          meta: { titleKey: 'menu.Carriers' },
        },
        {
          path: 'modeler/history/modeler-history/historys',
          name: 'ModelerHistoryView',
          component: () =>
            import('../views/modeler/history/modeler-history/ModelerHistoryView.vue'),
          meta: {
            icon: '$history',
            titleKey: 'menu.ModelerHistory',
          },
        },
        {
          path: 'mng/history/mng-history/historys',
          name: 'MNGHistoryView',
          component: () => import('../views/mng/history/mng-history/MNGHistoryView.vue'),
          meta: {
            icon: '$history',
            titleKey: 'menu.MNGHistory',
          },
        },
        {
          path: 'mng/view/wip/wip-by-lot',
          name: 'WipByLotView',
          component: () => import('../views/mng/view/wip/WipByLotView.vue'),
          meta: {
            icon: '$formatListBulleted',
            titleKey: 'menu.WipByLot',
          },
        },
        {
          path: 'mng/view/wip/transport-job-by-carrier',
          name: 'TransportJobByCarrierView',
          component: () => import('../views/mng/view/wip/TransportJobByCarrierView.vue'),
          meta: {
            icon: '$formatListBulleted',
            titleKey: 'menu.TransportJobByCarrier',
          },
        },
        {
          path: 'mng/view/wip/workorders',
          name: 'WorkOrderView',
          component: () => import('../views/mng/view/wip/WorkOrderView.vue'),
          meta: {
            icon: '$formatListBulleted',
            titleKey: 'menu.WorkOrder',
          },
        },
        {
          path: 'mng/view/interface/wms-receive-job',
          name: 'WMSReceiveJobView',
          component: () => import('../views/mng/view/interface/WMSReceiveJobView.vue'),
          meta: {
            icon: '$transfer',
            titleKey: 'menu.WMSReceiveJob',
          },
        },
        {
          path: 'mng/view/interface/wms-send-container',
          name: 'WMSSendContainerView',
          component: () => import('../views/mng/view/interface/WMSSendContainerView.vue'),
          meta: {
            icon: '$transfer',
            titleKey: 'menu.WMSSendContainer',
          },
        },
        {
          path: 'mng/view/interface/wms-receive-container',
          name: 'WMSReceiveContainerView',
          component: () => import('../views/mng/view/interface/WMSReceiveContainerView.vue'),
          meta: {
            icon: '$transfer',
            titleKey: 'menu.WMSReceiveContainer',
          },
        },
        {
          path: 'mng/view/interface/wms-send-start',
          name: 'WMSSendStartView',
          component: () => import('../views/mng/view/interface/WMSSendStartView.vue'),
          meta: {
            icon: '$transfer',
            titleKey: 'menu.WMSSendStart',
          },
        },
        {
          path: 'mng/view/interface/wms-send-end',
          name: 'WMSSendEndView',
          component: () => import('../views/mng/view/interface/WMSSendEndView.vue'),
          meta: {
            icon: '$transfer',
            titleKey: 'menu.WMSSendEnd',
          },
        },
        {
          path: 'report/production/input/from-transport-completed',
          name: 'InputTimePerArriveView',
          component: () => import('../views/report/production/input/InputTimePerArriveView.vue'),
          meta: {
            icon: '$bankTransferIn',
            titleKey: 'menu.InputTimePerArrive',
          },
        },
        {
          path: 'report/production/out/from-start-to-end',
          name: 'FromStartToEndView',
          component: () => import('../views/report/production/output/FromStartToEndView.vue'),
          meta: {
            icon: '$chartLine',
            titleKey: 'menu.FromStartToEnd',
          },
        },
        {
          path: 'report/production/out/job-end-by-operation',
          name: 'JobEndByOperationView',
          component: () => import('../views/report/production/output/JobEndByOperationView.vue'),
          meta: {
            icon: '$chartBar',
            titleKey: 'menu.JobEndByOperation',
          },
        },
        {
          path: 'report/transport/arrived/arrived-by-start',
          name: 'ArrivedBySrartView',
          component: () => import('../views/report/transport/arrived/ArrivedBySrartView.vue'),
          meta: {
            icon: '$chartDonut',
            titleKey: 'menu.ArrivedBySrart',
          },
        },
        {
          path: 'report/transport/arrived/average-by-start',
          name: 'ArrivedAverageByStartView',
          component: () =>
            import('../views/report/transport/arrived/ArrivedAverageByStartView.vue'),
          meta: {
            icon: '$chartTimeline',
            titleKey: 'menu.ArrivedAverageByStart',
          },
        },
        {
          path: 'report/equipment/status/equipment-by-time',
          name: 'EquipmentStatusByTimeView',
          component: () =>
            import(
              '../views/report/equipment-report/equipment-status/EquipmentStatusByTimeView.vue'
            ),
          meta: {
            icon: '$radar',
            titleKey: 'menu.EquipmentStatusByTime',
          },
        },
        {
          path: 'report/equipment/status/equipment-by-day',
          name: 'EquipmentStatusByDayView',
          component: () =>
            import(
              '../views/report/equipment-report/equipment-status/EquipmentStatusByDayView.vue'
            ),
          meta: {
            icon: '$chartScatter',
            titleKey: 'menu.EquipmentStatusByDay',
          },
        },
        {
          path: 'report/equipment/status/equipment-per-average',
          name: 'EquipmentStatusAverageView',
          component: () =>
            import(
              '../views/report/equipment-report/equipment-status/EquipmentStatusAverageView.vue'
            ),
          meta: {
            icon: '$chartSankey',
            titleKey: 'menu.EquipmentStatusAverage',
          },
        },
        {
          path: 'modeler/sample/subsample1/user-list-view',
          name: 'UserListView',
          component: () => import('../views/modeler/sample/sub-sample1/UserListView.vue'),
          meta: { titleKey: 'menu.UserList' },
        },
        {
          path: 'modeler/sample/subsample1/user-list-view2',
          name: 'UserListView2',
          component: () => import('../views/modeler/sample/sub-sample1/UserListView2.vue'),
          meta: { titleKey: 'menu.UserList2' },
        },
        {
          path: 'modeler/sample/subsample2/dash-board-view',
          name: 'DashboardView',
          component: () => import('../views/modeler/sample/sub-sample2/DashboardView.vue'),
          meta: { titleKey: 'menu.Dashboard' },
        },
        {
          path: 'modeler/sample/subsample2/user-mangement-view',
          name: 'UserManagementView',
          component: () => import('../views/modeler/sample/sub-sample2/UserManagementView.vue'),
          meta: { titleKey: 'menu.UserManagement' },
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
