<template>
  <v-container fluid class="page-container">
    <Splitpanes class="splitpanes-height" :horizontal="false">
      <pane size="50">
        <ServerSideDataTableTemplate
          v-if="ready"
          :search-schema="searchSchema"
          :headers="headers"
          api-endpoint="/api/alarm_action"
          :actions="['add', 'edit', 'delete', 'excelExport', 'excelImport']"
          isHover
          showCheckbox
          :form-schema="formSchema"
          data-tabletitle-key="menuNames.alarmAction"
          @row-selected="handleMasterRowSelect"
          :is-open-panel="false"
        >
        </ServerSideDataTableTemplate>
      </pane>
      <pane size="50">
        <ServerSideDataTableTemplate
          v-if="ready"
          :search-schema="detailSearchSchema"
          :headers="detailHeaders"
          :api-endpoint="detailURL"
          :actions="['add', 'edit', 'delete', 'excelExport', 'excelImport']"
          isHover
          showCheckbox
          :form-schema="detailFormSchema"
          data-tabletitle-key="menuNames.alarmDetailAction"
          :filter-params="detailFilterParams"
          :is-open-panel="false"
        >
        </ServerSideDataTableTemplate>
      </pane>
    </Splitpanes>
  </v-container>
</template>

<script setup>
import ServerSideDataTableTemplate from '@/components/common/ServerSideDataTableTemplate.vue' // 만든 컴포넌트 임포트
import { ref, onMounted, onActivated, watch, computed } from 'vue'
import { statusColorMap } from '@/constants/columnColorMaps' // 상태 색상 맵 임포트
import { useTabsStore } from '@/stores/tabs'
import { useRoute } from 'vue-router'
// 1. 여기에 'Pane'을 추가합니다.
import { Splitpanes, Pane } from 'splitpanes'
// 2. splitpanes의 CSS 파일을 임포트합니다.
import 'splitpanes/dist/splitpanes.css'

const tabsStore = useTabsStore()
const route = useRoute()

const ready = ref(true)
const detailURL = ref('/api/alarm_action_mail_detail')

// 1. [추가] 선택된 마스터 행의 ID를 저장할 ref를 생성합니다.
const selectedActionObject = ref(null)

// 2. [추가] @row-selected 이벤트가 발생하면 실행될 함수를 정의합니다.
function handleMasterRowSelect(selectedRow) {
  // selectedRow는 자식 컴포넌트가 emit으로 넘겨준 'item' 객체입니다.
  if (selectedRow) {
    console.log('마스터 행 선택됨:', selectedRow) // 객체 전체가 로그에 찍힘
    selectedActionObject.value = selectedRow
  } else {
    // (선택 해제 로직이 있다면)
    selectedActionObject.value = null
  }
}

// 3. [변경] computed가 'selectedActionObject'를 기반으로 필터 객체를 "추출"합니다.
const detailFilterParams = computed(function () {
  // selectedActionObject가 존재하고, 그 안에 id 속성이 있다면
  if (selectedActionObject.value && selectedActionObject.value.id) {
    // API가 원하는 키 이름 'alarmActionId'로 값을 매핑합니다.
    return { alarmActionId: selectedActionObject.value.id }
  }
  // 선택된 것이 없으면 빈 객체를 반환
  return {}
})

// 데이터를 로드하는 함수를 별도로 분리합니다.
async function loadInitData() {}

// onActivated: keep-alive로 캐싱된 컴포넌트가 다시 활성화될 때 호출됩니다.
onActivated(function () {
  loadInitData()
})

// AlarmAction search 및 폼 스키마 및 headers 정의
// 검색 및 폼 스키마 정의
const searchSchema = computed(function () {
  return [{ key: 'authorityName', labelKey: 'columns.authorityName', component: 'v-text-field' }]
})

//폼 스키마 정의 (추가/수정에 사용)
const formSchema = computed(function () {
  return [
    { key: 'authorityName', labelKey: 'columns.authorityName', component: 'v-text-field' },
    { key: 'description', labelKey: 'columns.description', component: 'v-text-field' },
  ]
})

const headers = ref([
  { title: 'columns.id', key: 'id' },
  { title: 'columns.alarmActionName', key: 'alarmActionName' },
  { title: 'columns.actionType', key: 'actionType' },
  { title: 'columns.alarmDefId', key: 'alarmDefId' },
  { title: 'columns.alarmCodeName', key: 'alarmCodeName' },
  { title: 'columns.description', key: 'description' },
  { title: 'columns.dataState', key: 'dataState' },
  { title: 'columns.checkOutState', key: 'checkOutState' },
  { title: 'columns.checkOutTime', key: 'checkOutTime' },
  { title: 'columns.checkOutUser', key: 'checkOutUser' },
  { title: 'columns.eventName', key: 'eventName' },
  { title: 'columns.timeKey', key: 'timeKey' },
  { title: 'columns.eventTime', key: 'eventTime' },
  { title: 'columns.eventUser', key: 'eventUser' },
  { title: 'columns.eventComment', key: 'eventComment' },
])

// Alarm Detail Action search 및 폼 스키마 및 headers 정의
// 검색 및 폼 스키마 정의
const detailSearchSchema = computed(function () {
  return []
})

//폼 스키마 정의 (추가/수정에 사용)
const detailFormSchema = computed(function () {
  return [
    { key: 'authorityName', labelKey: 'columns.authorityName', component: 'v-text-field' },
    { key: 'description', labelKey: 'columns.description', component: 'v-text-field' },
  ]
})

const detailHeaders = ref([
  { title: 'columns.id', key: 'id' },
  { title: 'columns.alarmActionId', key: 'alarmActionId' },
  { title: 'columns.alarmActionName', key: 'alarmActionName' },
  { title: 'columns.alarmActionUserGroupId', key: 'alarmActionUserGroupId' },
  { title: 'columns.userGroupName', key: 'userGroupName' },
  { title: 'columns.subject', key: 'subject' },
  { title: 'columns.contents', key: 'contents' },
  { title: 'columns.eventName', key: 'eventName' },
  { title: 'columns.timeKey', key: 'timeKey' },
  { title: 'columns.eventTime', key: 'eventTime' },
  { title: 'columns.eventUser', key: 'eventUser' },
  { title: 'columns.eventComment', key: 'eventComment' },
])
</script>
<style scoped>
/* 'splitpanes-height'는 <Splitpanes>에 직접 추가한 클래스입니다.
  이 클래스를 앞에 붙여서, 이 뷰에 있는 분할선에만 스타일이 적용되도록 한정합니다.
*/
.splitpanes-height :deep(.splitpanes__splitter) {
  /* 분할선의 너비를 10px로 늘립니다. (기본값은 1px 정도입니다)
    이 너비가 실제 마우스가 감지되는 '히트박스' 영역이 됩니다.
  */
  width: 10px;

  /* (선택 사항) 분할선이 시각적으로도 잘 보이도록 배경색을 추가합니다.
    이 부분을 추가하지 않으면 너비는 10px이 되지만, 보이는 건 여전히 얇은 선입니다.
  */
  background-color: #f0f0f0; /* 연한 회색 배경 */
  border-left: 1px solid #e0e0e0; /* 왼쪽 테두리 */
  border-right: 1px solid #e0e0e0; /* 오른쪽 테두리 */

  /* (선택 사항) 마우스를 올렸을 때 피드백을 줍니다. */
  transition: background-color 0.2s;
}

/* (선택 사항) 마우스를 올렸을 때 색상을 살짝 어둡게 변경 */
.splitpanes-height :deep(.splitpanes__splitter:hover) {
  background-color: #e0e0e0;
}
</style>
