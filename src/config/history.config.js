// src/config/history.config.js

// alarm 리소스의 메타데이터
const alarm = {
  // 검색 영역 정의
  searchSchema: [
    { key: 'equipmentName', labelKey: 'columns.equipmentName', component: 'v-text-field' },
    { key: 'alarmState', labelKey: 'columns.alarmState', component: 'v-text-field' },
    { key: 'eventName', labelKey: 'columns.eventName', component: 'v-text-field' },
  ],
  // 그리드 헤더 정의
  headers: [
    { title: 'columns.equipmentName', key: 'equipmentName' },
    { title: 'columns.alarmState', key: 'alarmState' },
    { title: 'columns.eventName', key: 'eventName' },
    { title: 'columns.eventTime', key: 'eventTime' },
    { title: 'columns.eventUser', key: 'eventUser' },
  ],
}

// alarm_def 리소스의 메타데이터
const alarm_def = {
  searchSchema: [
    { key: 'alarmCodeName', labelKey: 'columns.alarmCodeName', component: 'v-text-field' },
    { key: 'alarmType', labelKey: 'columns.alarmType', component: 'v-text-field' },
  ],
  headers: [
    { title: 'columns.alarmCodeName', key: 'alarmCodeName' },
    { title: 'columns.alarmType', key: 'alarmType' },
    { title: 'columns.alarmLevel', key: 'alarmLevel' },
    { title: 'columns.eventName', key: 'eventName' },
    { title: 'columns.eventTime', key: 'eventTime' },
  ],
}

// ... (수백 개의 다른 리소스 정의)

// 모든 설정을 하나로 묶어 export
export const historyConfig = {
  alarm: alarm,
  alarm_def: alarm_def,
  // lot: lot,
  // machine: machine,
}
