// src/config/history.config.js

// alarm 리소스의 메타데이터
const alarm = {
  // 검색 영역 정의
  searchSchema: [
    { key: 'equipmentName', labelKey: 'model.alarm.equipmentName', component: 'v-text-field' },
    { key: 'alarmState', labelKey: 'model.alarm.alarmState', component: 'v-text-field' },
  ],
  // 그리드 헤더 정의
  headers: [
    { title: 'model.alarm.equipmentName', key: 'equipmentName' },
    { title: 'model.alarm.alarmState', key: 'alarmState' },
    { title: 'model.event.eventName', key: 'eventName' },
    { title: 'model.event.eventTime', key: 'eventTime', type: 'datetime' },
    { title: 'model.event.eventUser', key: 'eventUser' },
  ],
}

// alarm_def 리소스의 메타데이터
const alarm_def = {
  searchSchema: [
    { key: 'alarmDefName', labelKey: 'model.alarm.alarmDefName', component: 'v-text-field' },
    { key: 'alarmType', labelKey: 'model.alarm.alarmType', component: 'v-text-field' },
  ],
  headers: [
    { title: 'model.alarm.alarmDefName', key: 'alarmDefName' },
    { title: 'model.alarm.alarmType', key: 'alarmType' },
    { title: 'model.alarm.alarmLevel', key: 'alarmLevel' },
    { title: 'model.event.eventName', key: 'eventName' },
    { title: 'model.event.eventTime', key: 'eventTime', type: 'datetime' },
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
