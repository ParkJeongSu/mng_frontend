<template>
  <v-container fluid class="page-container pa-0">
    <v-card class="chart-container d-flex flex-column" rounded="lg" flat>
      <v-card-title class="chart-title text-h5 flex-shrink-0">
        &nbsp; <v-icon icon="$chartTimeline" size="24" /> &nbsp; 일일 생산량 및 목표 달성률
      </v-card-title>
      <v-card flat elevation="0" class="flex-grow-1 d-flex chart-card">
        <div class="chart">
          <Bar :data="chartData" :options="chartOptions" />
        </div>
      </v-card>
    </v-card>
  </v-container>
</template>

<script setup>
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement, // ✅ Line 요소도 등록
  PointElement, // ✅ Point 요소도 등록
  CategoryScale,
  LinearScale,
} from 'chart.js'
import { Bar } from 'vue-chartjs'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
)

const chartData = {
  labels: ['월', '화', '수', '목', '금', '토', '일'],
  datasets: [
    {
      label: '생산량 (개)',
      data: [950, 1020, 980, 1100, 960, 1050, 990],
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      // y축을 'y' ID로 지정
      yAxisID: 'y',
    },
    {
      type: 'line', // ✅ 이 데이터셋만 'line' 타입으로 지정
      label: '목표 달성률 (%)',
      data: [95, 102, 98, 110, 96, 105, 99],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      fill: false,
      tension: 0.1,
      // y축을 'y1' ID로 지정 (우측 축)
      yAxisID: 'y1',
    },
  ],
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
  },
  // ✅ 다중 Y축 설정
  scales: {
    y: {
      type: 'linear',
      display: true,
      position: 'left',
      title: {
        display: true,
        text: '생산량 (개)',
      },
    },
    y1: {
      type: 'linear',
      display: true,
      position: 'right',
      title: {
        display: true,
        text: '달성률 (%)',
      },
      // 그리드 라인이 겹치지 않도록 설정
      grid: {
        drawOnChartArea: false,
      },
    },
  },
}
</script>

<style scoped>
.page-container {
  height: 100%;
}
.chart-container {
  width: 100%;
  height: 100%;
  min-height: 0;
  border: none;
  box-shadow: none;
  background: rgb(var(--v-theme-surface));
  padding: 24px;
}
.chart-title {
  min-height: 44px;
  padding-block: 6px;
  color: rgba(var(--v-theme-on-surface), 0.9);
  font-weight: 600;
  margin-bottom: 8px;
}
.chart-card {
  min-height: 0;
}
.chart {
  height: 100%;
  width: 100%;
  position: relative;
}
</style>
