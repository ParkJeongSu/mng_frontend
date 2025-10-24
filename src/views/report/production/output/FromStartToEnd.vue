<template>
  <v-container fluid class="page-container pa-0">
    <v-card class="chart-container d-flex flex-column" rounded="lg" flat>
      <v-card-title class="chart-title text-h5 flex-shrink-0">
        &nbsp; <v-icon icon="$chartLine" size="24" /> &nbsp; 월별 매출 및 수익
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
  labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월'],
  datasets: [
    {
      label: '총 매출 (백만원)',
      data: [65, 59, 80, 81, 56, 55, 40],
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.3, // 라인을 부드럽게
    },
    {
      label: '순이익 (백만원)',
      data: [28, 48, 40, 19, 86, 27, 90],
      fill: false,
      borderColor: 'rgb(255, 99, 132)',
      tension: 0.3,
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
