<template>
  <v-autocomplete
    v-model="searchQuery"
    :items="menuItems"
    item-title="title"
    item-value="path"
    density="compact"
    hide-details
    variant="solo"
    :placeholder="$t('common.quickFinder')"
    class="menu-quick-finder"
    @update:modelValue="handleSelection"
    @keydown.enter.prevent="handleEnter"
    clearable
  >
    <!-- 검색 결과 리스트 아이템을 더 명확하게 보여주기 위한 슬롯 -->
    <template v-slot:item="{ props, item }">
      <v-list-item v-bind="props" :title="item.raw.title" :subtitle="item.raw.path"></v-list-item>
    </template>
  </v-autocomplete>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useMenuStore } from '@/stores/menu'
import { useRouter } from 'vue-router'

const menuStore = useMenuStore()
const router = useRouter()

const searchQuery = ref(null)

/**
 * v-autocomplete에 바인딩할 메뉴 목록 (Computed)
 */
const menuItems = computed(function () {
  const flatList = []

  /**
   * 메뉴 '배열'을 받아 평탄화하는 재귀 함수
   * @param {Array} menus - [ { title, to, children: [...] }, ... ]
   */
  function flatten(menus) {
    // menus가 배열이 아니거나 비어있으면 즉시 종료
    if (!menus || !Array.isArray(menus)) {
      return
    }

    for (const item of menus) {
      // [수정] 'path' 대신 'to' 속성을 사용합니다.
      // 'to' 속성이 있고(null이 아님) title이 있는 경우에만 리스트에 추가합니다.
      if (item.to && item.title) {
        flatList.push({
          title: item.title,
          path: item.to, // v-autocomplete의 item-value는 'path'로 통일 (값은 item.to)
        })
      }

      // 자식 메뉴가 있으면 재귀적으로 계속 평탄화합니다.
      if (item.children && item.children.length > 0) {
        flatten(item.children)
      }
    }
  }

  // --- [수정된 부분] ---
  // menuStore.allMenus는 { 'Modeler': { subMenus: { ... } }, ... } 형태의 객체입니다.
  const systemsObject = menuStore.allMenus

  // 1. systemsObject가 유효한 객체인지 확인합니다.
  if (systemsObject && typeof systemsObject === 'object' && !Array.isArray(systemsObject)) {
    // 2. 각 시스템 객체를 순회합니다. (e.g., { name: 'Modeler', subMenus: {...} })
    //    Object.values(systemsObject) => [ { name: 'Modeler', ... }, { name: 'MNG', ... } ]
    for (const system of Object.values(systemsObject)) {
      // 3. 각 시스템의 subMenus 객체를 가져옵니다. (e.g., { system: {...}, factory: {...} })
      const subMenusObject = system.subMenus
      if (subMenusObject && typeof subMenusObject === 'object' && !Array.isArray(subMenusObject)) {
        // 4. 각 subMenu 그룹을 순회합니다. (e.g., { name: 'system', items: [...] })
        //    Object.values(subMenusObject) => [ { name: 'system', ... }, { name: 'factory', ... } ]
        for (const subMenuGroup of Object.values(subMenusObject)) {
          // 5. subMenuGroup의 'items' 배열을 flatten 함수에 전달합니다.
          flatten(subMenuGroup.items)
        }
      }
    }
  }
  // --- [여기까지] ---

  return flatList
})

/**
 * v-autocomplete 리스트에서 항목을 '클릭'했을 때 호출됩니다.
 * @param {string} path - 선택한 메뉴의 경로 (item-value="path"에 의해 item.to 값이 전달됨)
 */
function handleSelection(path) {
  if (path) {
    router.push(path)
    searchQuery.value = null // 선택 완료 후 입력창 초기화
    menuStore.setActiveMenuByPath(path)
  }
}

/**
 * 텍스트를 입력하고 'Enter' 키를 쳤을 때 호출됩니다.
 */
function handleEnter(event) {
  const text = String(searchQuery.value || '').toLowerCase()
  if (!text) return

  // 1. 입력한 텍스트와 부분 일치하는 '제목'을 가진 첫 번째 메뉴를 찾습니다.
  const firstMatch = menuItems.value.find(function (item) {
    return item.title.toLowerCase().includes(text)
  })

  // 2. 일치하는 메뉴가 있으면 해당 경로로 이동합니다.
  if (firstMatch) {
    // [수정] firstMatch.path에 'to' 값이 저장되어 있습니다.
    router.push(firstMatch.path)
    menuStore.setActiveMenuByPath(firstMatch.path)
    searchQuery.value = null // 이동 완료 후 입력창 초기화

    // (중요) Enter 키 입력 후 v-autocomplete가 목록을 다시 여는 것을 방지
    if (event.target) {
      event.target.blur()
    }
  }
}
</script>

<style scoped>
.menu-quick-finder {
  /* 앱 바에서 적절한 너비를 갖도록 설정 */
  max-width: 300px;
  min-width: 200px;
  /* 왼쪽 햄버거 아이콘과의 간격 */
  margin-left: 16px;
}

.menu-quick-finder :deep(.v-field) {
  height: 40px;
}

.menu-quick-finder :deep(.v-field__input) {
  min-height: 40px;
  height: 40px;
  padding-top: 0;
  padding-bottom: 0;
}
</style>
