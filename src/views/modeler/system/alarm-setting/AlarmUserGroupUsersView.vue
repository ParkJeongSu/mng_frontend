<template>
  <v-container fluid class="page-container">
    <ServerSideDataTableTemplate
      v-if="ready"
      :search-schema="searchSchema"
      :headers="headers"
      api-endpoint="/api/alarm-user-group-users"
      :actions="['add', 'edit', 'delete', 'excelExport', 'excelImport']"
      isHover
      showCheckbox
      :form-schema="formSchema"
      data-tabletitle-key="menu.AlarmUserGroupUsers"
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
  { key: 'userGroupName', labelKey: 'model.alarm.userGroupName', component: 'v-text-field' },
]

//폼 스키마 정의 (추가/수정에 사용)
const formSchema = [
  {
    key: 'alarmActionUserGroupId',
    labelKey: 'model.alarm.alarmActionUserGroupId',
    component: 'v-autocomplete',
    'item-title': 'userGroupName', // v-autocomplete item-title에 매핑할 키
    'item-value': 'id', // v-autocomplete item-value에 매핑할 키
    apiEndpoint: '/api/alarm-user-group',
  },
  {
    key: 'userId',
    labelKey: 'model.user.userId',
    component: 'v-autocomplete',
    'item-title': 'userId', // v-autocomplete item-title에 매핑할 키
    'item-value': 'id', // v-autocomplete item-value에 매핑할 키
    apiEndpoint: '/api/users',
  },
]

const headers = [
  { title: 'model.common.id', key: 'id' },
  { title: 'model.alarm.alarmActionUserGroupId', key: 'alarmActionUserGroupId' },
  { title: 'model.alarm.userGroupName', key: 'userGroupName' },
  { title: 'model.user.userId', key: 'userId' },
  { title: 'model.event.eventName', key: 'eventName' },
  { title: 'model.event.eventTime', key: 'eventTime', type: 'datetime' },
  { title: 'model.event.eventUser', key: 'eventUser' },
  { title: 'model.event.eventComment', key: 'eventComment' },
]
</script>
<style scoped></style>
