<template>
  <v-container fluid class="page-container pa-0">
    <v-card class="chart-container d-flex flex-column" rounded="lg" flat>
      <v-card-title class="chart-title text-h5 flex-shrink-0">
        &nbsp; <v-icon :icon="$route.meta.icon || '$databaseOutline'" size="24" /> &nbsp; 생산
        속도와 불량률 관계
      </v-card-title>
      <v-card flat elevation="0" class="flex-grow-1 d-flex chart-card">
        <div class="chart">
          <Scatter :data="chartData" :options="chartOptions" />
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
  LinearScale, // ✅ 스캐터는 X/Y축 모두 LinearScale
} from 'chart.js'
import { Scatter } from 'vue-chartjs'

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, LinearScale)

// 스캐터 차트용 데이터 ( {x, y} 객체 배열 )
function generateScatterData(count) {
  const data = []
  for (let i = 0; i < count; i++) {
    const speed = 100 + Math.random() * 50 // 100 ~ 150
    const defect = 2 + (speed - 100) * 0.1 + (Math.random() - 0.5) // 속도에 비례 + 랜덤값
    data.push({ x: speed, y: defect < 0 ? 0 : defect })
  }
  return data
}

const chartData = {
  datasets: [
    {
      label: 'A라인 (속도/불량률)',
      data: generateScatterData(50),
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'B라인 (속도/불량률)',
      data: generateScatterData(50),
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
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
  // ✅ X/Y 축에 대한 정의
  scales: {
    x: {
      type: 'linear',
      position: 'bottom',
      title: {
        display: true,
        text: '생산 속도 (ppm)',
      },
    },
    y: {
      title: {
        display: true,
        text: '불량률 (%)',
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
