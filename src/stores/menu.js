// src/stores/menu.js
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// 'menu'라는 이름의 스토어를 정의합니다.
export const useMenuStore = defineStore('menu', () => {
  // --------------------------------------------------
  // 1. State (상태): 컴포넌트들이 공유할 데이터
  // --------------------------------------------------

  // 전체 메뉴 구조 (나중에는 API로 받아올 데이터)
  const allMenus = ref({
    systemA: {
      name: '시스템 A',
      subMenus: {
        dashboard: {
          name: '대시보드',
          items: [
            { title: '현황 1', icon: 'mdi-view-dashboard', to: '/dashboard/status1' },
            { title: '현황 2', icon: 'mdi-view-dashboard', to: '/dashboard/status2' },
          ],
        },
        management: {
          name: '운영 관리',
          items: [
            { title: '사용자 관리', icon: 'mdi-account-group', to: '/management/users' },
            { title: '그룹 관리', icon: 'mdi-account-multiple', to: '/management/groups' },
          ],
        },
      },
    },
    systemB: {
      name: '시스템 B',
      subMenus: {
        stats: {
          name: '통계',
          items: [
            { title: '일별 통계', icon: 'mdi-chart-bar', to: '/stats/daily' },
            { title: '월별 통계', icon: 'mdi-chart-line', to: '/stats/monthly' },
          ],
        },
      },
    },
    systemC: {
      name: '시스템 C',
      subMenus: {}, // 시스템 C는 서브메뉴가 없음
    },
  })

  // 현재 사용자가 선택한 시스템과 서브메뉴의 ID
  const selectedSystemId = ref(null) // 예: 'systemA'
  const selectedSubMenuId = ref(null) // 예: 'dashboard'

  // --------------------------------------------------
  // 2. Getters (계산된 상태): State를 기반으로 동적으로 계산되는 값
  // --------------------------------------------------

  // 현재 선택된 시스템의 서브메뉴 목록
  const currentSubMenus = computed(() => {
    if (!selectedSystemId.value) return {}
    return allMenus.value[selectedSystemId.value].subMenus
  })

  // 현재 선택된 서브메뉴의 사이드바 아이템 목록
  const currentSidebarItems = computed(() => {
    if (!selectedSystemId.value || !selectedSubMenuId.value) return []
    const subMenu = allMenus.value[selectedSystemId.value].subMenus[selectedSubMenuId.value]
    return subMenu ? subMenu.items : []
  })

  // --------------------------------------------------
  // 3. Actions (행동): State를 변경하는 함수들
  // --------------------------------------------------

  // 시스템을 선택했을 때 호출될 함수
  function selectSystem(systemId) {
    selectedSystemId.value = systemId
    // 시스템이 바뀌면 서브메뉴 선택은 초기화
    selectedSubMenuId.value = null
  }

  // 서브메뉴를 선택했을 때 호출될 함수
  function selectSubMenu(subMenuId) {
    selectedSubMenuId.value = subMenuId
  }

  // --------------------------------------------------
  // 4. Return: 외부에서 사용할 수 있도록 노출
  // --------------------------------------------------
  return {
    allMenus,
    selectedSystemId,
    selectedSubMenuId,
    currentSubMenus,
    currentSidebarItems,
    selectSystem,
    selectSubMenu,
  }
})
