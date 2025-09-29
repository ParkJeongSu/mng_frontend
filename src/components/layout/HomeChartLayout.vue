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
  ArcElement,
  BarElement,
} from 'chart.js'
import { Line, Pie, Bar } from 'vue-chartjs'

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

// --- 차트 데이터 및 옵션 ---

// 1. 라인 차트 (월별 생산량)
const lineChartData = {
  labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월'],
  datasets: [
    {
      label: '월별 총 생산량',
      data: [6500, 7200, 8100, 7900, 9200, 8800, 9500],
      fill: false,
      borderColor: '#3675f3',
      backgroundColor: '#3675f3',
      tension: 0.4,
    },
  ],
}

// 2. 파이 차트 (제품 품질)
const pieChartData = {
  labels: ['정상품', '경미 불량', '중대 불량'],
  datasets: [
    {
      backgroundColor: ['#1a936f', '#f46b45', '#a93226'],
      data: [95.5, 3.5, 1],
    },
  ],
}

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

// 4. 간트 차트 (LOT 진행 현황) - 수평 막대 차트로 구현
const ganttChartData = {
  labels: ['LOT-001', 'LOT-002', 'LOT-003', 'LOT-004'],
  datasets: [
    {
      label: 'LOT 진행 시간',
      backgroundColor: '#6f22b9',
      // 데이터 형식: [시작 시간, 종료 시간]
      data: [
        [2, 5],
        [4, 9],
        [6, 11],
        [10, 16],
      ],
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

// 간트 차트 전용 옵션
const ganttChartOptions = {
  ...chartOptions,
  indexAxis: 'y', // 축을 y로 설정하여 수평 막대 차트로 만듭니다.
  scales: {
    x: {
      min: 0,
      max: 24, // 24시간 기준
      title: {
        display: true,
        text: '시간 (Hour)',
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          const start = context.raw[0]
          const end = context.raw[1]
          return `${context.chart.data.labels[context.dataIndex]}: ${start}시 ~ ${end}시`
        },
      },
    },
  },
}
</script>

<template>
  <v-container fluid>
    <!-- 첫번째 차트 행 -->
    <v-row>
      <!-- 라인 차트 (2/3 너비) -->
      <v-col cols="12" lg="8">
        <v-card class="pa-4 outer-card" rounded="lg">
          <v-card-title>월별 생산량 추이</v-card-title>
          <v-card-text>
            <div class="chart-container">
              <Line :data="lineChartData" :options="chartOptions" />
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <!-- 파이 차트 (1/3 너비) -->
      <v-col cols="12" lg="4">
        <v-card class="pa-4 outer-card" rounded="lg">
          <v-card-title>제품 품질 현황</v-card-title>
          <v-card-text>
            <div class="chart-container">
              <Pie :data="pieChartData" :options="chartOptions" />
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 두번째 차트 행 -->
    <v-row>
      <!-- 막대 차트 (2/3 너비) -->
      <v-col cols="12" lg="8">
        <v-card class="pa-4 outer-card" rounded="lg">
          <v-card-title>라인별 생산 현황</v-card-title>
          <v-card-text>
            <div class="chart-container">
              <Bar :data="barChartData" :options="chartOptions" />
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <!-- 간트 차트 (1/3 너비) -->
      <v-col cols="12" lg="4">
        <v-card class="pa-4 outer-card" rounded="lg">
          <v-card-title>LOT 진행 현황</v-card-title>
          <v-card-text>
            <div class="chart-container">
              <Bar :data="ganttChartData" :options="ganttChartOptions" />
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
/* 바깥쪽 카드에 마우스를 올렸을 때 부드러운 효과를 주기 위한 트랜지션입니다. */
.outer-card {
  transition:
    transform 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
}
.outer-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
}

/* 차트를 감싸는 div에 대한 스타일입니다. 높이를 지정해야 차트가 보입니다. */
.chart-container {
  position: relative;
  height: 350px;
}
</style>
