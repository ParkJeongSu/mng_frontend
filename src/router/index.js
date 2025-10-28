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
          path: 'modeler/system/menu_setting/menu',
          name: 'MenuView',
          component: () => import('../views/modeler/system/menu_setting/MenuView.vue'),
          meta: { titleKey: 'menuNames.menu' },
        },
        {
          path: 'modeler/system/menu_setting/system_def',
          name: 'SystemDefView',
          component: () => import('../views/modeler/system/menu_setting/SystemDefView.vue'),
          meta: { titleKey: 'menuNames.systemDef' },
        },
        {
          path: 'modeler/system/menu_setting/auth_menu',
          name: 'AuthMenuView',
          component: () => import('../views/modeler/system/menu_setting/AuthMenuView.vue'),
          meta: { titleKey: 'menuNames.authorityMenu' },
        },
        {
          path: 'modeler/system/user_setting/auth',
          name: 'AuthView',
          component: () => import('../views/modeler/system/user_setting/AuthView.vue'),
          meta: { titleKey: 'menuNames.auth' },
        },
        {
          path: 'modeler/system/user_setting/user',
          name: 'UserView',
          component: () => import('../views/modeler/system/user_setting/UserView.vue'),
          meta: { titleKey: 'menuNames.users' },
        },

        {
          path: 'modeler/system/alarm_setting/alarm_def',
          name: 'AlarmDefView',
          component: () => import('../views/modeler/system/alarm_setting/AlarmDefView.vue'),
          meta: { titleKey: 'menuNames.alarmDef' },
        },
        {
          path: 'modeler/system/alarm_setting/alarm',
          name: 'AlarmView',
          component: () => import('../views/modeler/system/alarm_setting/AlarmView.vue'),
          meta: { titleKey: 'menuNames.alarm' },
        },
        {
          path: 'modeler/system/alarm_setting/alarm_user_group',
          name: 'AlarmUserGroupView',
          component: () => import('../views/modeler/system/alarm_setting/AlarmUserGroupView.vue'),
          meta: { titleKey: 'menuNames.alarmUserGroup' },
        },
        {
          path: 'modeler/system/alarm_setting/alarm_user_group_users',
          name: 'AlarmUserGroupUsersView',
          component: () =>
            import('../views/modeler/system/alarm_setting/AlarmUserGroupUsersView.vue'),
          meta: { titleKey: 'menuNames.alarmUserGroupUsers' },
        },
        {
          path: 'modeler/system/alarm_setting/alarm_action',
          name: 'AlarmActionView',
          component: () => import('../views/modeler/system/alarm_setting/AlarmActionView.vue'),
          meta: { titleKey: 'menuNames.alarmAction' },
        },
        // 시작
        {
          path: 'modeler/factory/equipment_setting/equipment_def',
          name: 'EquipmentDefView',
          component: () =>
            import('../views/modeler/factory/equipment_setting/EquipmentDefView.vue'),
          meta: { titleKey: 'menuNames.EquipmentDef' },
        },
        {
          path: 'modeler/factory/equipment_setting/equipment_group',
          name: 'EquipmentGroupView',
          component: () =>
            import('../views/modeler/factory/equipment_setting/EquipmentGroupView.vue'),
          meta: { titleKey: 'menuNames.EquipmentGroup' },
        },
        {
          path: 'modeler/factory/equipment_setting/equipments',
          name: 'EquipmentsView',
          component: () => import('../views/modeler/factory/equipment_setting/EquipmentsView.vue'),
          meta: { titleKey: 'menuNames.Equipments' },
        },
        {
          path: 'modeler/factory/port_setting/port_def',
          name: 'PortDefView',
          component: () => import('../views/modeler/factory/port_setting/PortDefView.vue'),
          meta: { titleKey: 'menuNames.PortDef' },
        },
        {
          path: 'modeler/factory/port_setting/ports',
          name: 'PortsView',
          component: () => import('../views/modeler/factory/port_setting/PortsView.vue'),
          meta: { titleKey: 'menuNames.Ports' },
        },
        {
          path: 'modeler/factory/carrier_setting/carrier_def',
          name: 'CarrierDefView',
          component: () => import('../views/modeler/factory/carrier_setting/CarrierDefView.vue'),
          meta: { titleKey: 'menuNames.CarrierDef' },
        },
        {
          path: 'modeler/factory/carrier_setting/carriers',
          name: 'CarriersView',
          component: () => import('../views/modeler/factory/carrier_setting/CarriersView.vue'),
          meta: { titleKey: 'menuNames.Carriers' },
        },
        {
          path: 'modeler/history/modeler_history/historys',
          name: 'ModelerHistoryView',
          component: () =>
            import('../views/modeler/history/modeler_history/ModelerHistoryView.vue'),
          meta: { titleKey: 'menuNames.ModelerHistory' },
        },
        {
          path: 'mng/view/wip/wip_by_lot',
          name: 'WipByLot',
          component: () => import('../views/modeler/system/user_setting/UserView.vue'),
          meta: { titleKey: 'menuNames.users' },
        },
        {
          path: 'mng/view/wip/wip_by_spec',
          name: 'WipBySpec',
          component: () => import('../views/modeler/system/user_setting/UserView.vue'),
          meta: { titleKey: 'menuNames.users' },
        },
        {
          path: 'mng/view/wip/wip_by_operation',
          name: 'WipByOperation',
          component: () => import('../views/modeler/system/user_setting/UserView.vue'),
          meta: { titleKey: 'menuNames.users' },
        },
        {
          path: 'mng/view/wip/transport_job_by_carrier',
          name: 'TransportJobByCarrier',
          component: () => import('../views/modeler/system/user_setting/UserView.vue'),
          meta: { titleKey: 'menuNames.users' },
        },
        {
          path: 'mng/view/wip/workorders',
          name: 'Workorders',
          component: () => import('../views/modeler/system/user_setting/UserView.vue'),
          meta: { titleKey: 'menuNames.users' },
        },
        {
          path: 'mng/view/interface/wms_receive_job',
          name: 'WmsReceiveJob',
          component: () => import('../views/modeler/system/user_setting/UserView.vue'),
          meta: { titleKey: 'menuNames.users' },
        },
        {
          path: 'mng/view/interface/wms_send_container',
          name: 'WmsSendContainer',
          component: () => import('../views/modeler/system/user_setting/UserView.vue'),
          meta: { titleKey: 'menuNames.users' },
        },
        {
          path: 'mng/view/interface/wms_receive_container',
          name: 'WmsReceiveContainer',
          component: () => import('../views/modeler/system/user_setting/UserView.vue'),
          meta: { titleKey: 'menuNames.users' },
        },
        {
          path: 'mng/view/interface/wms_send_start',
          name: 'WmsSendStart',
          component: () => import('../views/modeler/system/user_setting/UserView.vue'),
          meta: { titleKey: 'menuNames.users' },
        },
        {
          path: 'mng/view/interface/wms_send_end',
          name: 'WmsSendEnd',
          component: () => import('../views/modeler/system/user_setting/UserView.vue'),
          meta: { titleKey: 'menuNames.users' },
        },
        {
          path: 'report/production/input/from_transport_completed',
          name: 'inputTimePerArrive',
          component: () => import('../views/report/production/input/inputTimePerArrive.vue'),
          meta: { titleKey: 'menuNames.FromTransportCompleted' },
        },
        {
          path: 'report/production/out/from_start_to_end',
          name: 'FromStartToEnd',
          component: () => import('../views/report/production/output/FromStartToEnd.vue'),
          meta: { titleKey: 'menuNames.FromStartToEnd' },
        },
        {
          path: 'report/production/out/job_end_by_operation',
          name: 'JobEndByOperation',
          component: () => import('../views/report/production/output/JobEndByOperation.vue'),
          meta: { titleKey: 'menuNames.JobEndByOperation' },
        },
        {
          path: 'report/transport/arrived/arrived_by_start',
          name: 'ArrivedBySrart',
          component: () => import('../views/report/transport/arrived/ArrivedBySrart.vue'),
          meta: { titleKey: 'menuNames.ArrivedByStart' },
        },
        {
          path: 'report/transport/arrived/average_by_start',
          name: 'ArrivedAverageByStart',
          component: () => import('../views/report/transport/arrived/ArrivedAverageByStart.vue'),
          meta: { titleKey: 'menuNames.AverageByStart' },
        },
        {
          path: 'report/equipment/status/equipment_by_time',
          name: 'EquipmentStatusByTime',
          component: () =>
            import('../views/report/equipment_report/equipment_status/EquipmentStatusByTime.vue'),
          meta: { titleKey: 'menuNames.EquipmentByTime' },
        },
        {
          path: 'report/equipment/status/equipment_by_day',
          name: 'EquipmentStatusByDay',
          component: () =>
            import('../views/report/equipment_report/equipment_status/EquipmentStatusByDay.vue'),
          meta: { titleKey: 'menuNames.EquipmentByDay' },
        },
        {
          path: 'report/equipment/status/equipment_per_average',
          name: 'EquipmentStatusAverage',
          component: () =>
            import('../views/report/equipment_report/equipment_status/EquipmentStatusAverage.vue'),
          meta: { titleKey: 'menuNames.EquipmentPerAverage' },
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
