<template>
  <v-container fluid class="page-container pa-0">
    <v-card class="chart-container d-flex flex-column" rounded="lg" flat>
      <v-card-title class="chart-title text-h5 flex-shrink-0">
        &nbsp; <v-icon icon="$chartSankey" size="24" /> &nbsp; 1호기 프레스 압력 (실시간)
      </v-card-title>
      <v-card flat elevation="0" class="flex-grow-1 d-flex chart-card">
        <div class="chart">
          <Line :data="chartData" :options="chartOptions" />
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
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale)

const chartData = {
  labels: ['14:00', '14:01', '14:02', '14:03', '14:04', '14:05', '14:06', '14:07'],
  datasets: [
    {
      label: '압력 (bar)',
      data: [120, 120, 122, 122, 121, 121, 119, 119],
      borderColor: 'rgb(255, 159, 64)',
      fill: false,
      stepped: true, // ✅ 계단형(Stepped) 라인 옵션
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
  // 툴팁이 x축 기준으로 보이도록 (센서 데이터에 유용)
  interaction: {
    intersect: false,
    mode: 'index',
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
