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
          v-if="statusColorMap[slotProps.value]"
          :color="statusColorMap[slotProps.value]"
          small
          :title="`상태: ${slotProps.value}`"
        >
          {{ slotProps.value }}
        </v-chip>

        <span v-else>
          {{ slotProps.value }}
        </span>
      </template>
    </ServerSideDataTableTemplate>
  </v-container>
</template>

<script setup>
import ServerSideDataTableTemplate from '@/components/common/ServerSideDataTableTemplate.vue' // 만든 컴포넌트 임포트
import { ref, computed, onMounted, onActivated, watch } from 'vue'
import { statusColorMap } from '@/constants/columnColorMaps' // 상태 색상 맵 임포트
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
    console.log('UserView api 호출 - 권한 목록 로드 시작')
    // 2. 공통 API 함수를 호출하고 결과를 받습니다.
    const responseData = await fetchListData('/api/auth', {})

    authorityList.value = responseData.items
    console.log('UserView api 호출 - 권한 목록 로드 종료')
  } catch (error) {
    // fetchListData 내부에서 에러를 처리하지만,
    // 컴포넌트 레벨에서 추가적인 에러 처리가 필요하다면 여기에 작성합니다.
    console.error('An error occurred in the component while loading data:', error)
  } finally {
    // 4. API 호출 성공/실패와 관계없이 로딩 상태를 해제합니다.
    ready.value = true
  }
}

// onActivated: keep-alive로 캐싱된 컴포넌트가 다시 활성화될 때 호출됩니다.
onActivated(function () {
  console.log('UserView onActivated - loading initial data')
  loadInitData()
})

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
