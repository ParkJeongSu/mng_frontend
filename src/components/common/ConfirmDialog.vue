<template>
  <v-dialog class="dialog" :model-value="show" @update:model-value="onUpdateShow">
    <v-card>
      <v-card-title class="text-h6">{{ title }}</v-card-title>
      <v-card-text>{{ message }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="onCancel">취소</v-btn>
        <v-btn color="primary" variant="elevated" @click="onConfirm">확인</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
// 이 컴포넌트가 외부로부터 받을 값들을 정의합니다. (props)
const props = defineProps({
  show: Boolean, // 다이얼로그를 보여줄지 말지
  title: String, // 제목
  message: String, // 내용
})

// 이 컴포넌트가 외부로 발생시킬 이벤트들을 정의합니다. (emits)
const emit = defineEmits(['update:show', 'confirm'])

// '확인' 버튼 클릭 시
function onConfirm() {
  emit('confirm')
  emit('update:show', false) // 다이얼로그 닫기
}

// '취소' 버튼 클릭 시
function onCancel() {
  emit('update:show', false) // 다이얼로그 닫기
}

// 다이얼로그의 표시 상태가 업데이트될 때
function onUpdateShow(value) {
  emit('update:show', value)
}
</script>

<style scoped>
.dialog {
  max-width: 400px;
}
</style>
