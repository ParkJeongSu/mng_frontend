// src/composables/useCounter.js

import { ref, readonly } from 'vue'

// 컴포저블 함수를 export 합니다.
// 함수 이름은 관례에 따라 'use'로 시작합니다.
export function useCounter(initialValue = 0) {
  // 1. 상태 (State)
  // 컴포넌트 간에 공유되지 않고, 호출될 때마다 독립적인 상태를 생성합니다.
  const count = ref(initialValue)

  // 2. 재사용할 함수들 (Functions)
  function increment() {
    count.value++
  }

  function decrement() {
    count.value--
  }

  // 3. 외부로 노출할 상태와 함수들을 객체로 반환합니다.
  // readonly를 사용하면 외부 컴포넌트에서 count 값을 직접 수정하는 것을 방지할 수 있습니다.
  return {
    count: readonly(count),
    increment,
    decrement,
  }
}

/**
 * 사용법 : 외부에서 useCounter() 를 호출하여 각 화면마다 독립적인 메모리 생성
 *
<template>
  <div>
    <h3>카운터</h3>
    <p>현재 숫자: {{ count }}</p>
    <v-btn @click="increment" class="mr-2">증가 (+)</v-btn>
    <v-btn @click="decrement">감소 (-)</v-btn>
  </div>
</template>

<script setup>
import { useCounter } from '@/composables/useCounter'

// useCounter 컴포저블을 호출하여 필요한 상태와 함수들을 가져옵니다.
// 초기값을 10으로 설정하여 호출할 수도 있습니다. -> useCounter(10)
const { count, increment, decrement } = useCounter()
</script>
 *
 *
 */
