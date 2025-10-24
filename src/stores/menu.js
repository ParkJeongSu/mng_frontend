// src/stores/menu.js
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { fetchListData } from '@/api/menus'
import { useAuthStore } from './auth'

/**
 * [NEW] allMenus 객체 구조에 맞게 재작성된 헬퍼 함수
 * @param {object} allMenus - The main menu object from the store.
 * @param {string|number} leafId - The ID of the final menu item to find (from route.meta).
 * @returns {Array} - [{id, name}, {id, name}, ...] 형태의 경로 배열
 */
function findPathByLeafId(allMenus, leafId) {
  // allMenus가 비어있으면 빈 배열 반환
  if (!allMenus || Object.keys(allMenus).length === 0) {
    return []
  }

  // 1. System 레벨 순회 (e.g., 'systemA')
  for (const systemId in allMenus) {
    const system = allMenus[systemId]
    // 경로 노드 1: System
    const systemNode = { id: system.id, name: system.name }

    // 2. SubMenu 레벨 순회 (e.g., 'management')
    for (const subMenuId in system.subMenus) {
      const subMenu = system.subMenus[subMenuId]
      // 경로 노드 2: SubMenu
      const subMenuNode = { id: subMenu.id, name: subMenu.name }

      // 3. Item 레벨 순회 (e.g., '사용자 관리' 그룹)
      for (const item of subMenu.items) {
        // Case A: Item이 children을 가진 그룹일 경우 (e.g., 사용자 관리)
        if (item.children && item.children.length > 0) {
          // 경로 노드 3: ListGroup
          const listGroupNode = { id: item.id, name: item.title }

          // 4. Children 레벨 순회 (e.g., '사용자 목록')
          for (const child of item.children) {
            if (child.id === leafId) {
              // 찾음! (4레벨 경로)
              return [
                systemNode,
                subMenuNode,
                listGroupNode,
                { id: child.title, name: child.title },
              ]
            }
          }
        }
        // Case B: Item이 children이 없는 단일 메뉴일 경우
        else {
          if (item.id === leafId) {
            // 찾음! (3레벨 경로)
            return [systemNode, subMenuNode, { id: item.id, name: item.title }]
          }
        }
      }
    }
  }
  return [] // 트리를 모두 순회했지만 못 찾음
}

/**
 * [NEW] 'to' 경로(path)를 기준으로 allMenus 객체에서 메뉴 아이템을 찾는 헬퍼 함수
 * @param {object} allMenus - The main menu object.
 * @param {string} path - The URL path to find (e.g., '/management/users/list').
 * @returns {object|null} - The found menu item (e.g., { id: 'user_list', ... }) or null.
 */
function findMenuByPath(allMenus, path) {
  if (!allMenus || Object.keys(allMenus).length === 0) {
    return null
  }

  for (const systemId in allMenus) {
    const system = allMenus[systemId]
    for (const subMenuId in system.subMenus) {
      const subMenu = system.subMenus[subMenuId]
      for (const item of subMenu.items) {
        if (item.children && item.children.length > 0) {
          for (const child of item.children) {
            // :to="child.to" 값과 일치하는지 확인
            if (child.to === path) {
              return child // ✅ 찾음 (자식 아이템)
            }
          }
        } else {
          // :to="item.to" 값과 일치하는지 확인
          if (item.to === path) {
            return item // ✅ 찾음 (루트 아이템)
          }
        }
      }
    }
  }
  return null // 못 찾음
}

// 'menu'라는 이름의 스토어를 정의합니다.
export const useMenuStore = defineStore('menu', () => {
  // --------------------------------------------------
  // 1. State (상태): 컴포넌트들이 공유할 데이터
  // --------------------------------------------------
  const allMenus = ref({})
  // ✅ [추가] 1. 현재 활성화된 메뉴의 전체 경로를 저장할 상태
  const activeMenuPath = ref([])

  const authStore = useAuthStore()

  // 현재 사용자가 선택한 시스템과 서브메뉴의 ID
  const selectedSystemId = ref(null) // 예: 'systemA'
  const selectedSubMenuId = ref(null) // 예: 'dashboard'
  // 사이드바 표시 여부를 제어하는 상태 추가
  const isSidebarOpen = ref(false)
  // --------------------------------------------------
  // 2. Getters (계산된 상태): State를 기반으로 동적으로 계산되는 값
  // --------------------------------------------------

  // 현재 선택된 시스템의 서브메뉴 목록
  const currentSubMenus = computed(function () {
    if (!selectedSystemId.value || !allMenus.value[selectedSystemId.value]) {
      return {}
    }
    return allMenus.value[selectedSystemId.value].subMenus
  })

  // 현재 선택된 서브메뉴의 사이드바 아이템 목록
  const currentSidebarItems = computed(function () {
    if (
      !selectedSystemId.value ||
      !selectedSubMenuId.value ||
      !allMenus.value[selectedSystemId.value]
    ) {
      return []
    }
    const subMenu = allMenus.value[selectedSystemId.value].subMenus[selectedSubMenuId.value]
    return subMenu ? subMenu.items : []
  })

  // --------------------------------------------------
  // 3. Actions (행동): State를 변경하는 함수들
  // --------------------------------------------------

  // [추가] DB에서 전체 메뉴 데이터를 가져오는 액션
  async function fetchAllAuthorityMenus() {
    try {
      // 1. 백엔드 API를 호출합니다.
      const response = await fetchListData('/api/menus/auth_menus', { userId: authStore.userId })
      // 2. 응답받은 데이터로 allMenus 상태를 업데이트합니다.
      allMenus.value = response.data
    } catch (error) {
      console.error('메뉴 데이터를 가져오는 데 실패했습니다:', error)
      // 에러 발생 시 allMenus를 비워 초기 상태로 유지
      allMenus.value = {}
    }
  }

  // ✅ [수정] 2. setActiveMenuById 액션을 새 헬퍼 함수로 교체
  function setActiveMenuById(menuId) {
    if (!menuId) {
      activeMenuPath.value = []
      return
    }

    // 새로운 헬퍼 함수(findPathByLeafId)를 사용
    const path = findPathByLeafId(allMenus.value, menuId)

    if (path && path.length > 0) {
      // 1. Breadcrumbs를 위한 전체 경로 저장
      activeMenuPath.value = path

      // 2. (사용자님 요청) 기존 selectedId 상태들도 함께 업데이트
      //selectedSystemId.value = path[0] ? path[0].id : null
      //selectedSubMenuId.value = path[1] ? path[1].id : null
    } else {
      // 경로를 못 찾으면 초기화
      activeMenuPath.value = []
      // (id들도 초기화할지 여부는 정책에 따라 결정)
      // selectedSystemId.value = null
      // selectedSubMenuId.value = null
    }
  }

  // ✅ [추가] 2. 'path'(URL)를 기준으로 경로를 설정하는 새로운 액션
  function setActiveMenuByPath(path) {
    if (!path) {
      activeMenuPath.value = []
      return
    }
    // 1. path로 메뉴 아이템을 찾습니다.
    const menuItem = findMenuByPath(allMenus.value, path)

    if (menuItem) {
      // 2. 찾은 아이템의 'id'를 사용해 전체 경로를 갱신합니다.
      setActiveMenuById(menuItem.id) // 'title'이 id 역할을 함
    } else {
      // (예: 대시보드 '/' 경로 등)
      activeMenuPath.value = []
    }
  }

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
    fetchAllAuthorityMenus,
    // ✅ [추가] Breadcrumbs를 위해 이 두 가지를 꼭 반환해야 합니다.
    activeMenuPath,
    setActiveMenuById,
    setActiveMenuByPath,
  }
})

/**
 *
 // allMenus의 ref 값을 아래 내용으로 교체합니다.
  const allMenus = ref({
    systemA: {
      name: '시스템 A',
      subMenus: {
        dashboard: {
          name: '대시보드',
          items: [
            // 대시보드는 하위 메뉴가 없는 1단계 구조
            { title: '현황 1', icon: '$dashboard', to: '/dashboard/status1' },
            { title: '현황 2', icon: '$dashboard', to: '/dashboard/status2' },
          ],
        },
        management: {
          name: '운영 관리',
          items: [
            // 운영 관리는 하위 메뉴(children)가 있는 2단계 구조
            {
              title: '사용자 관리',
              icon: '$accountGroup',
              children: [
                { title: '사용자 목록', to: '/management/users/list' },
                { title: '사용자 목록2', to: '/management/users/list2' },
                { title: '사용자 등록', to: '/management/users/create' },
                { title: 'Product-List', to: '/product-list' },
              ],
            },
            {
              title: '그룹 관리',
              icon: '$accountMultiple',
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
            { title: '일별 통계', icon: '$chartBar', to: '/stats/daily' },
            { title: '월별 통계', icon: '$chartLine', to: '/stats/monthly' },
          ],
        },
      },
    },
    systemC: {
      name: '시스템 C',
      subMenus: {},
    },
  })
 *
 */
