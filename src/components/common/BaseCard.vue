<script setup>
defineProps({
  item: { type: Object, required: true },
})
</script>
<template>
  <v-card :class="['text-white', 'pa-3', item.colorClass]" rounded="lg" elevation="4">
    <!-- d-flex와 유틸리티 클래스를 사용해 내부 컨텐츠를 정렬합니다. -->
    <div class="d-flex justify-space-between align-center">
      <div>
        <div class="text-subtitle-1 font-weight-medium">{{ item.title }}</div>
        <div class="text-h4 font-weight-bold mt-2">
          <!-- toLocaleString()으로 숫자에 콤마를 추가합니다. -->
          {{ item.value.toLocaleString() }}{{ item.unit }}
        </div>
      </div>
      <!-- v-icon 컴포넌트를 사용하고, 약간의 투명도를 주어 디자인 밸런스를 맞춥니다. -->
      <v-icon :icon="item.icon" size="48" class="opacity-50"></v-icon>
    </div>
  </v-card>
</template>
<style scoped>
/* 카드에 적용될 그라데이션 배경들을 클래스로 정의합니다. */
.gradient-blue {
  background: linear-gradient(to top right, #3675f3, #6b9cff);
}
.gradient-green {
  background: linear-gradient(to top right, #1a936f, #88d498);
}
.gradient-orange {
  background: linear-gradient(to top right, #f46b45, #eea849);
}
.gradient-purple {
  background: linear-gradient(to top right, #6f22b9, #9e54e0);
}

/* 아이콘에 적용할 투명도 클래스입니다. */
.opacity-50 {
  opacity: 0.5;
}

/* 카드에 마우스를 올렸을 때 부드러운 효과를 주기 위한 트랜지션입니다. */
.v-card {
  transition:
    transform 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
}
.v-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
}
</style>
