<template>
  <v-container fluid class="page-container">
    <ServerSideDataTableTemplate
      v-if="ready"
      :search-schema="searchSchema"
      :headers="headers"
      api-endpoint="/api/users"
      :actions="['add', 'edit', 'delete', 'excelExport', 'excelImport']"
      isHover
      showCheckbox
      :form-schema="formSchema"
      data-tabletitle-key="title.userList"
    >
      <template v-slot:item.status="slotProps">
        <v-chip
          :color="slotProps.value === 'Active' ? 'green' : 'red'"
          small
          :title="`상태: ${slotProps.value}`"
        >
          {{ slotProps.value }}
        </v-chip>
      </template>
    </ServerSideDataTableTemplate>
  </v-container>
</template>

<script setup>
import ServerSideDataTableTemplate from '@/components/common/ServerSideDataTableTemplate.vue' // 만든 컴포넌트 임포트
import { ref, computed, onMounted, onActivated, watch } from 'vue'
import { fetchListData } from '@/api/dataTable' // 공통 API 함수 import

import { useTabsStore } from '@/stores/tabs'
import { useRoute } from 'vue-router'

const tabsStore = useTabsStore()
const route = useRoute()

const authorityList = ref([])
const ready = ref(false)

// 데이터를 로드하는 함수를 별도로 분리합니다.
async function loadInitData() {
  // menuList의 길이가 0보다 크다는 것은 데이터가 이미 있다는 의미로 가정합니다.
  if (authorityList.value.length > 0) {
    console.log('데이터가 이미 존재하므로 API를 호출하지 않습니다.')
    return
  }

  try {
    // 2. 공통 API 함수를 호출하고 결과를 받습니다.
    const responseData = await fetchListData('/api/auth', {})

    authorityList.value = responseData.items
  } catch (error) {
    // fetchListData 내부에서 에러를 처리하지만,
    // 컴포넌트 레벨에서 추가적인 에러 처리가 필요하다면 여기에 작성합니다.
    console.error('An error occurred in the component while loading data:', error)
  } finally {
    // 4. API 호출 성공/실패와 관계없이 로딩 상태를 해제합니다.
    ready.value = true
  }
}

onMounted(function () {
  loadInitData()
})

// onActivated: keep-alive로 캐싱된 컴포넌트가 다시 활성화될 때 호출됩니다.
onActivated(function () {
  loadInitData()
})

// 3. openTabs 배열을 감시하는 watch 로직을 추가합니다.
watch(
  // 감시할 대상을 함수로 지정합니다.
  function () {
    return tabsStore.openTabs
  },
  // 변경이 감지되면 실행될 콜백 함수입니다.
  function (newTabs) {
    // some 함수를 사용해 현재 라우트의 경로가 새 탭 목록에 여전히 존재하는지 확인합니다.
    const isTabStillOpen = newTabs.some(function (tab) {
      return tab.path === route.path
    })

    // 만약 탭 목록에 더 이상 존재하지 않는다면, 이 컴포넌트의 탭이 닫힌 것입니다.
    if (!isTabStillOpen) {
      console.log('탭이 닫혔음을 감지하여 데이터를 초기화합니다. (watch)')
      authorityList.value = []
    }
  },
  // 배열 내부의 객체까지 감지하기 위해 deep 옵션을 추가합니다.
  { deep: true },
)

// 검색 및 폼 스키마 정의
const searchSchema = computed(function () {
  return [
    { key: 'userId', labelKey: 'columns.userId', component: 'v-text-field' },
    { key: 'authorityId', labelKey: 'columns.authorityId', component: 'v-text-field' },
    { key: 'userName', labelKey: 'columns.userName', component: 'v-text-field' },
    { key: 'email', labelKey: 'columns.email', component: 'v-text-field' },
    { key: 'phone1', labelKey: 'columns.phone1', component: 'v-text-field' },
  ]
})
const formSchema = computed(function () {
  return [
    { key: 'userId', labelKey: 'columns.userId', component: 'v-text-field' },
    {
      key: 'authorityId',
      labelKey: 'columns.authorityId',
      component: 'v-select',
      // ⬇⬇ Vuetify v-select 관례에 맞게 전달할 프로퍼티 이름을 명확히
      items: authorityList.value, // [{ authorityName, authorityId }]
      'item-title': 'authorityName', // v-select의 item-title에 매핑할 키
      'item-value': 'id', // v-select의 item-value에 매핑할 키
    },
    { key: 'userName', labelKey: 'columns.userName', component: 'v-text-field' },
    { key: 'password', labelKey: 'columns.password', component: 'v-text-field' },
    { key: 'email', labelKey: 'columns.email', component: 'v-text-field' },
    { key: 'phone1', labelKey: 'columns.phone1', component: 'v-text-field' },
    { key: 'phone2', labelKey: 'columns.phone2', component: 'v-text-field' },
  ]
})

/**
 *   {
    key: 'userName',
    labelKey: 'userName',
    component: 'v-select',
    items: ['판매중', '품절', '단종'],
  },
 *
 */

const headers = ref([
  //{ title: 'columns.id', key: 'id' },
  { title: 'columns.userId', key: 'userId' },
  { title: 'columns.authorityId', key: 'authorityId' },
  { title: 'columns.userName', key: 'userName' },
  { title: 'columns.password', key: 'password' },
  { title: 'columns.email', key: 'email' },
  { title: 'columns.phone1', key: 'phone1' },
  { title: 'columns.phone2', key: 'phone2' },
  { title: 'columns.checkOutState', key: 'checkOutState' },
  { title: 'columns.checkOutTime', key: 'checkOutTime' },
  { title: 'columns.checkOutUser', key: 'checkOutUser' },
  { title: 'columns.dataState', key: 'dataState' },
  { title: 'columns.eventName', key: 'eventName' },
  { title: 'columns.timeKey', key: 'timeKey' },
  { title: 'columns.eventTime', key: 'eventTime' },
  { title: 'columns.eventUser', key: 'eventUser' },
  { title: 'columns.eventComment', key: 'eventComment' },
])
</script>
<style scoped></style>
