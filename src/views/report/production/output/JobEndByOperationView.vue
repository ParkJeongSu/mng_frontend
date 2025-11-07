<template>
  <v-container fluid class="page-container pa-0">
    <v-card class="chart-container d-flex flex-column" rounded="lg" flat>
      <v-card-title class="chart-title text-h5 flex-shrink-0">
        &nbsp; <v-icon :icon="$route.meta.icon || '$databaseOutline'" size="24" /> &nbsp; 작업조별
        라인 생산량 (누적)
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
  CategoryScale,
  LinearScale,
} from 'chart.js'
import { Bar } from 'vue-chartjs'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const chartData = {
  labels: ['A라인', 'B라인', 'C라인', 'D라인'],
  datasets: [
    {
      label: '1조 (오전)',
      data: [120, 150, 180, 90],
      backgroundColor: 'rgb(255, 99, 132)',
    },
    {
      label: '2조 (오후)',
      data: [110, 140, 170, 85],
      backgroundColor: 'rgb(75, 192, 192)',
    },
    {
      label: '3조 (야간)',
      data: [100, 130, 160, 80],
      backgroundColor: 'rgb(54, 162, 235)',
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
  // ✅ 누적(Stacked) 차트 옵션
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
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
