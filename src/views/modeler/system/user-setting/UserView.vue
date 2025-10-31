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
      data-tabletitle-key="menu.User"
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
import { ref } from 'vue'
import { statusColorMap } from '@/constants/columnColorMaps' // 상태 색상 맵 임포트

const ready = ref(true)

// 검색 및 폼 스키마 정의
const searchSchema = [
  { key: 'userId', labelKey: 'model.user.userId', component: 'v-text-field' },
  { key: 'authorityId', labelKey: 'model.authority.authorityId', component: 'v-text-field' },
  { key: 'userName', labelKey: 'model.user.userName', component: 'v-text-field' },
  { key: 'email', labelKey: 'model.user.email', component: 'v-text-field' },
  { key: 'phone1', labelKey: 'model.user.phone1', component: 'v-text-field' },
]

const formSchema = [
  { key: 'userId', labelKey: 'model.user.userId', component: 'v-text-field' },
  {
    key: 'authorityId',
    labelKey: 'model.authority.authorityId',
    component: 'v-select',
    'item-title': 'authorityName', // v-select의 item-title에 매핑할 키
    'item-value': 'id', // v-select의 item-value에 매핑할 키
    apiEndpoint: '/api/auth',
  },
  { key: 'userName', labelKey: 'model.user.userName', component: 'v-text-field' },
  { key: 'password', labelKey: 'model.user.password', component: 'v-text-field' },
  { key: 'email', labelKey: 'model.user.email', component: 'v-text-field' },
  { key: 'phone1', labelKey: 'model.user.phone1', component: 'v-text-field' },
  { key: 'phone2', labelKey: 'model.user.phone2', component: 'v-text-field' },
]

const headers = [
  { title: 'model.common.id', key: 'id' },
  { title: 'model.user.userId', key: 'userId' },
  { title: 'model.authority.authorityId', key: 'authorityId' },
  { title: 'model.user.userName', key: 'userName' },
  { title: 'model.user.password', key: 'password' },
  { title: 'model.user.email', key: 'email' },
  { title: 'model.user.phone1', key: 'phone1' },
  { title: 'model.user.phone2', key: 'phone2' },
  { title: 'model.common.checkOutState', key: 'checkOutState' },
  { title: 'model.common.checkOutTime', key: 'checkOutTime' },
  { title: 'model.common.checkOutUser', key: 'checkOutUser' },
  { title: 'model.common.dataState', key: 'dataState' },
  { title: 'model.event.eventName', key: 'eventName' },
  { title: 'model.event.timeKey', key: 'timeKey' },
  { title: 'model.event.eventTime', key: 'eventTime' },
  { title: 'model.event.eventUser', key: 'eventUser' },
  { title: 'model.event.eventComment', key: 'eventComment' },
]
</script>
<style scoped></style>
