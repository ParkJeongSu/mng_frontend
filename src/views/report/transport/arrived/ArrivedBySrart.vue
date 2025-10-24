<template>
  <v-container fluid class="page-container pa-0">
    <v-card class="chart-container d-flex flex-column" rounded="lg" flat>
      <v-card-title class="chart-title text-h5 flex-shrink-0">
        &nbsp; <v-icon icon="$chartDonut" size="24" /> &nbsp; 주간 불량 유형
      </v-card-title>
      <v-card flat elevation="0" class="flex-grow-1 d-flex chart-card">
        <div class="chart">
          <Doughnut :data="chartData" :options="chartOptions" />
        </div>
      </v-card>
    </v-card>
  </v-container>
</template>

<script setup>
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { Doughnut } from 'vue-chartjs'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const chartData = {
  labels: ['조립 불량', '도색 불량', '자재 결함', '기타'],
  datasets: [
    {
      label: '불량 건수',
      data: [300, 50, 100, 75],
      backgroundColor: [
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(153, 102, 255, 0.8)',
      ],
      hoverOffset: 4,
    },
  ],
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right', // 도넛/파이 차트는 범례를 옆에 두는 경우가 많습니다.
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
