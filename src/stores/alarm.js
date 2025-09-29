import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAlarmStore = defineStore('alarm', function () {
  // 상태: 알람 목록
  const alarms = ref([])

  // Getter: 최신 5개 알람 가져오기 (가장 최신 알람이 맨 앞에 오도록)
  const latestAlarms = computed(function () {
    return alarms.value.slice(0, 5)
  })

  // Action: 새로운 알람 추가 (가장 최신 알람을 배열의 맨 앞에 추가)
  function addAlarm(message) {
    const newAlarm = {
      id: Date.now(), // 고유 ID로 현재 시간 사용
      text: message,
      type: 'info', // 추후 'error', 'warning' 등 확장 가능
    }
    alarms.value.unshift(newAlarm)

    // (선택) 알람이 너무 많이 쌓이는 것을 방지하기 위해 100개가 넘으면 오래된 것 삭제
    if (alarms.value.length > 100) {
      alarms.value.pop()
    }
  }

  // Action: 테스트용 함수 (실제 서버 연동 시 삭제)
  function addSampleAlarm() {
    const sampleMessages = [
      '#1 장비 온도 임계치 초과',
      '#3 장비 점검 필요',
      '생산 라인 가동 중지',
      '새로운 작업 지시 등록',
      '데이터베이스 연결 성공',
    ]
    const randomIndex = Math.floor(Math.random() * sampleMessages.length)
    const message = `[${new Date().toLocaleTimeString()}] ${sampleMessages[randomIndex]}`
    addAlarm(message)
  }

  return { alarms, latestAlarms, addAlarm, addSampleAlarm }
})
