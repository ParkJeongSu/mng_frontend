<template>
  <div class="alarm-bar">
    <div class="alarm-chips">
      <v-chip
        v-for="alarm in alarmStore.latestAlarms"
        :key="alarm.id"
        class="ma-1"
        color="secondary"
        label
        size="small"
        prepend-icon="$bellOutline"
      >
        {{ alarm.text }}
      </v-chip>
    </div>

    <div class="alarm-actions">
      <v-btn size="small" @click="alarmStore.addSampleAlarm"> 테스트 알람 추가 </v-btn>
    </div>
  </div>
</template>

<script setup>
import { useAlarmStore } from '@/stores/alarm'
const alarmStore = useAlarmStore()
</script>

<style scoped>
/* 이제 순수한 스타일만 남깁니다. */
.alarm-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  width: 100%; /* 부모 컴포넌트(v-footer)의 너비를 꽉 채우도록 설정 */
  padding: 0 16px;
  /* border-bottom: 1px solid #e0e0e0; */
  /* 푸터와 구분하기 위해 border-top 대신 bottom 사용 */
  /* border-width: 1px; */
  /* border-style: solid; */
  overflow: hidden;
  white-space: nowrap;
}

.alarm-chips {
  display: flex;
  align-items: center;
}
</style>
