<template>
  <v-container fluid class="page-container pa-0">
    <v-card class="chart-container d-flex flex-column" rounded="lg" flat>
      <v-card-title class="chart-title text-h5 flex-shrink-0">
        &nbsp; <v-icon :icon="$route.meta.icon || '$databaseOutline'" size="24" /> &nbsp; 라인별
        생상 현황
      </v-card-title>
      <v-card flat elevation="0" class="flex-grow-1 d-flex chart-card">
        <div class="chart">
          <Bar :data="barChartData" :options="chartOptions" />
        </div>
      </v-card>
    </v-card>
  </v-container>
</template>

<script setup>
import { onMounted } from 'vue'

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
} from 'chart.js'
import { Bar } from 'vue-chartjs'

// Chart.js에 필요한 구성 요소들을 등록합니다.
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
)

// 3. 막대 차트 (라인별 생산 현황)
const barChartData = {
  labels: ['A라인', 'B라인', 'C라인', 'D라인', 'E라인'],
  datasets: [
    {
      label: '라인별 당일 생산량',
      backgroundColor: '#6b9cff',
      data: [2105, 1850, 2410, 1520, 2965],
    },
  ],
}

// 공통 차트 옵션
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
  },
}

onMounted(function () {})
</script>
<style scoped>
.page-container {
  height: 100%;
}

/* 루트 카드: 가로/세로 풀 채움 + 평평한 베이스 */
.chart-container {
  width: 100%;
  height: 100%;
  min-height: 0; /* 내부 스크롤 허용 */
  border: none;
  box-shadow: none;
  background: rgb(var(--v-theme-surface));
  /* [추가]
    이것이 메인 컨텐츠 영역 전체의 안쪽 여백입니다.
    24px 정도의 넉넉한 여백이 세련된 느낌을 줍니다.
  */
  padding: 24px;
}

/* 타이틀: 높이/여백 절제 */
.chart-title {
  min-height: 44px;
  padding-block: 6px;
  color: rgba(var(--v-theme-on-surface), 0.9);

  /* [추가] 제목을 더 중요하게 보이도록 */
  font-weight: 600; /* 500(기본)보다 살짝 더 굵게 */
  margin-bottom: 8px; /* 제목과 검색 패널 사이의 간격 확보 */
}

.chart-card {
  min-height: 0;
}

.chart {
  /* responsive: true, maintainAspectRatio: false 옵션은
    부모 컨테이너의 크기를 따르므로,
    부모(.chart-container)의 크기를 100%로 설정합니다.
  */
  height: 100%;
  width: 100%;
  position: relative; /* Chart.js가 크기를 올바르게 계산하기 위해 필요 */
}
</style>
