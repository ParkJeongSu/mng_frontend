<template>
  <!--
    컴포넌트의 최상위 루트를 Flex Container로 만듭니다.
    이 카드가 부모로부터 받은 전체 높이를 차지하게 됩니다.
  -->
  <v-card class="bg-white pa-3 datatable-wrapper" flat outlined>
    <!-- 제목과 검색 바는 높이가 고정되어야 하므로, 공간이 줄어들 때 수축하지 않도록 합니다. -->
    <v-card-title class="text-h6 flex-shrink-0">서버 사이드 데이터 테이블</v-card-title>
    <v-card class="pa-2 mb-1 flex-shrink-0" flat outlined>
      <v-row dense>
        <v-col v-for="item in props.searchSchema" :key="item.key" cols="12" md="3">
          <component
            :is="componentMap[item.component]"
            v-model="searchParams[item.key]"
            :label="item.label"
            :items="item.items"
            density="compact"
            variant="outlined"
            hide-details
          ></component>
        </v-col>
        <v-col class="d-flex justify-end align-center">
          <slot name="search-bar.append"></slot>
          <v-btn color="primary" @click="search">조회</v-btn>
        </v-col>
      </v-row>
    </v-card>

    <!-- 툴바 역시 높이가 고정됩니다. -->
    <v-toolbar class="bg-black flex-shrink-0" dense flat>
      <v-toolbar-title class="text-subtitle-1">조회 결과</v-toolbar-title>
      <v-spacer></v-spacer>
      <slot name="actions.prepend"></slot>
      <v-btn v-if="props.actions.includes('add')" class="ml-2" @click="emit('add')">추가</v-btn>
      <v-btn v-if="props.actions.includes('edit')" class="ml-2" @click="emit('edit')">변경</v-btn>
      <v-btn v-if="props.actions.includes('delete')" class="ml-2" @click="emit('delete')"
        >삭제</v-btn
      >
      <v-btn v-if="props.actions.includes('excelExport')" class="ml-2">Excel Export</v-btn>
      <v-btn v-if="props.actions.includes('excelImport')" class="ml-2">Excel Import</v-btn>
    </v-toolbar>

    <!--
      핵심 변경사항입니다.
      이 div 래퍼(wrapper)가 남은 공간을 모두 차지하도록(flex-grow-1) 하고,
      v-data-table-server가 이 래퍼 안에서 높이를 100%로 채우게 만듭니다.
      이 구조가 flexbox에서 높이 계산을 가장 안정적으로 만듭니다.
    -->
    <div class="table-wrapper flex-grow-1">
      <v-data-table-server
        v-model:items-per-page="options.itemsPerPage"
        :headers="props.headers"
        :items-length="totalItems"
        :items="serverItems"
        :loading="loading"
        fixed-header
        height="100%"
        @update:options="loadItems"
      >
        <!-- height="100%"
        fixed-layout
        fixed-footer
        -->
        <template v-for="header in props.headers" v-slot:[`item.${header.key}`]="{ value, item }">
          <slot :name="`item.${header.key}`" :item="item">
            {{ value }}
          </slot>
        </template>
      </v-data-table-server>
    </div>
  </v-card>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { componentMap } from '@/constants/componentMap' // componentMap import

const props = defineProps({
  searchSchema: { type: Array, required: true },
  headers: { type: Array, required: true },
  apiEndpoint: { type: String, required: true },
  actions: {
    type: Array,
    default: function () {
      return []
    },
  },
})

const emit = defineEmits(['add', 'edit', 'delete'])

const searchParams = reactive({})
// searchSchema를 기반으로 searchParams 초기화
props.searchSchema.forEach(function (item) {
  searchParams[item.key] = null
})

const serverItems = ref([])
const loading = ref(true)
const totalItems = ref(0)
const options = ref({
  page: 1,
  itemsPerPage: 10,
  sortBy: [],
})

// 데이터 로드 함수
function loadItems() {
  loading.value = true
  const query = {
    ...searchParams,
    page: options.value.page,
    limit: options.value.itemsPerPage,
    sortBy: options.value.sortBy.length ? options.value.sortBy[0].key : null,
    sortOrder: options.value.sortBy.length ? options.value.sortBy[0].order : null,
  }

  // Fake API Call (실제로는 axios 등으로 props.apiEndpoint 호출)
  console.log(`Calling API: ${props.apiEndpoint} with params`, query)
  setTimeout(function () {
    // ===== 생성된 더미 데이터 100건 시작 =====
    const items = []
    const statuses = ['판매중', '판매중', '판매중', '품절', '단종'] // '판매중'이 더 자주 나오도록 가중치 부여
    const productPrefixes = ['스마트', '울트라', '에코', '프리미엄', '디럭스', '게이밍']
    const productTypes = [
      '모니터',
      '키보드',
      '마우스',
      '헤드셋',
      '웹캠',
      '스피커',
      '노트북',
      '태블릿',
    ]

    for (let i = 1; i <= 100; i++) {
      const prefix = productPrefixes[Math.floor(Math.random() * productPrefixes.length)]
      const type = productTypes[Math.floor(Math.random() * productTypes.length)]

      items.push({
        productCode: 'PROD-' + String(i).padStart(5, '0'),
        productName: prefix + ' ' + type + ' X' + (2000 + i),
        status: statuses[Math.floor(Math.random() * statuses.length)],
        price: (Math.floor(Math.random() * 450) + 50) * 1000, // 50,000원에서 500,000원 사이 가격
      })
    }
    serverItems.value = items
    // ===== 생성된 더미 데이터 100건 끝 =====
    totalItems.value = 100 // 서버에서 받은 전체 개수
    loading.value = false
  }, 1000)
}

// 조회 버튼 클릭 시 1페이지로 리셋 후 조회
function search() {
  options.value.page = 1
  loadItems()
}

onMounted(() => {})
</script>
<style scoped>
.datatable-wrapper {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0; /* 🔑 내부 스크롤을 위해 필요 */
}
.table-wrapper {
  position: relative;
  /* 이 래퍼(wrapper)가 flex-grow-1로 늘어난 공간을 차지하고
    내용이 넘치는 것을 숨겨서, 자식인 v-data-table-server가
    height: 100%를 정확히 계산하도록 돕습니다.
  */
  overflow: hidden;
  flex: 1 1 0; /* 남은 공간 모두 차지 */
  min-height: 0; /* 🔑 자식이 0까지 줄어들 수 있어야 overflow 영역 생성 */
}
/* Vuetify v-data-table이 100% 높이를 제대로 채우도록 강제 */
.table-wrapper :deep(.v-data-table) {
  height: 100%;
  display: flex;
  flex-direction: column; /* wrapper가 남은 높이를 먹도록 */
}

/* (선택) 푸터 고정 시 */
.table-wrapper :deep(.v-data-table__bottom) {
  flex-shrink: 0;
}
</style>
