<template>
  <v-navigation-drawer>
    <v-list v-model:opened="openGroups" density="compact" nav open-strategy="multiple">
      <template v-for="item in menuStore.currentSidebarItems" :key="item.title">
        <v-list-group v-if="item.children" :value="item.title">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" :prepend-icon="item.icon" :title="item.title"></v-list-item>
          </template>

          <v-list-item
            v-for="child in item.children"
            :key="child.title"
            :title="child.title"
            :to="child.to"
            :value="child.title"
            active-class="selected-tree-item"
          ></v-list-item>
        </v-list-group>

        <v-list-item
          v-else
          :prepend-icon="item.icon"
          :title="item.title"
          :to="item.to"
          :value="item.title"
          active-class="selected-tree-item"
        ></v-list-item>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
// 스크립트가 매우 간단해집니다.
import { ref, watch } from 'vue'
import { useMenuStore } from '@/stores/menu'
const menuStore = useMenuStore()

// 1. 열려있는 그룹의 목록을 저장할 ref를 만듭니다.
const openGroups = ref([])

/**
 * 2. `watch`를 사용해 menuStore.currentSidebarItems를 감시합니다.
 * 이 데이터가 바뀔 때마다 (예: '대시보드' -> '운영 관리' 클릭 시)
 * 안에 있는 함수가 실행됩니다.
 */
watch(
  function () {
    return menuStore.currentSidebarItems
  },
  function (newItems) {
    // 3. 새로 들어온 메뉴 아이템들 중에서
    //    자식(children)이 있는 모든 그룹의 제목(title)을 뽑아냅니다.
    const allGroupTitles = newItems
      .filter(function (item) {
        return item.children && item.children.length > 0
      })
      .map(function (item) {
        return item.title
      })

    // 4. openGroups의 값을 방금 뽑아낸 그룹 제목 목록으로 설정합니다.
    openGroups.value = allGroupTitles
  },
  {
    immediate: true, // 컴포넌트가 처음 로드될 때도 즉시 한 번 실행합니다.
    deep: true, // 배열 내부의 객체 변경까지 감지합니다.
  },
)
</script>

<style scoped>
/* 스타일은 이전과 동일합니다. */
:deep(.selected-tree-item) {
  background-color: #4caf50 !important;
  color: white !important;
}
:deep(.selected-tree-item .v-icon) {
  color: white !important;
}
</style>
