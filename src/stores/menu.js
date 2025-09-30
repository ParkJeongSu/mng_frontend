// src/stores/menu.js
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// 'menu'라는 이름의 스토어를 정의합니다.
export const useMenuStore = defineStore('menu', () => {
  // --------------------------------------------------
  // 1. State (상태): 컴포넌트들이 공유할 데이터
  // --------------------------------------------------

  // allMenus의 ref 값을 아래 내용으로 교체합니다.
  const allMenus = ref({
    systemA: {
      name: '시스템 A',
      subMenus: {
        dashboard: {
          name: '대시보드',
          items: [
            // 대시보드는 하위 메뉴가 없는 1단계 구조
            { title: '현황 1', icon: 'mdi-view-dashboard', to: '/dashboard/status1' },
            { title: '현황 2', icon: 'mdi-view-dashboard', to: '/dashboard/status2' },
          ],
        },
        management: {
          name: '운영 관리',
          items: [
            // 운영 관리는 하위 메뉴(children)가 있는 2단계 구조
            {
              title: '사용자 관리',
              icon: 'mdi-account-group',
              children: [
                { title: '사용자 목록', to: '/management/users/list' },
                { title: '사용자 목록2', to: '/management/users/list2' },
                { title: '사용자 등록', to: '/management/users/create' },
                { title: 'Product-List', to: '/product-list' },
              ],
            },
            {
              title: '그룹 관리',
              icon: 'mdi-account-multiple',
              children: [{ title: '그룹 목록', to: '/management/groups/list' }],
            },
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
      subMenus: {},
    },
  })

  // 현재 사용자가 선택한 시스템과 서브메뉴의 ID
  const selectedSystemId = ref(null) // 예: 'systemA'
  const selectedSubMenuId = ref(null) // 예: 'dashboard'
  // 사이드바 표시 여부를 제어하는 상태 추가
  const isSidebarOpen = ref(false)
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
    // 2. 만약 사이드바가 닫혀있다면, 연다는 추가적인 상태 변경을 수행합니다.
    if (!isSidebarOpen.value) {
      isSidebarOpen.value = true
    }
  }

  // 사이드바를 토글하는 함수 추가
  function toggleSidebar() {
    isSidebarOpen.value = !isSidebarOpen.value
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
    isSidebarOpen,
    toggleSidebar,
  }
})
