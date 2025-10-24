<template>
  <div class="tab-view-layout">
    <div class="tab-view-container">
      <v-tabs
        v-model="tabsStore.activeTabPath"
        @update:model-value="onTabChange"
        density="compact"
        show-arrows
        class="tab-bar underline"
      >
        <v-tab
          v-for="tab in tabsStore.openTabs"
          :key="tab.path"
          :value="tab.path"
          @contextmenu.prevent="onRightClick(tab, $event)"
          @click.middle.prevent="closeTab(tab)"
          class="tab-item"
        >
          {{ t(tab.meta.titleKey, tab.meta.titleKey) }}
          <v-icon
            v-if="tab.path !== '/'"
            size="small"
            class="ml-2 close-icon"
            @click.stop="closeTab(tab)"
          >
            $close
          </v-icon>
        </v-tab>
        <!-- ✅ [추가] 1. 탭 바 끝에 '전체 화면' 토글 버튼 추가 -->
        <v-spacer></v-spacer>
        <v-tooltip location="bottom" text="내용 전체 화면">
          <template v-slot:activator="{ props: tooltipProps }">
            <v-btn
              v-bind="tooltipProps"
              icon="$fullscreen"
              variant="text"
              density="comfortable"
              @click="toggleFullscreen"
            ></v-btn>
          </template>
        </v-tooltip>
      </v-tabs>
      <!-- ✅ [수정] 2. 전체 화면으로 만들 대상에 ref 추가 -->
      <div class="tab-content bg-background" ref="tabContentRef">
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </div>
    </div>

    <v-menu
      v-model="contextMenu.show"
      :style="{ left: contextMenu.x + 'px', top: contextMenu.y + 'px' }"
      absolute
      offset-y
    >
      <v-list density="compact">
        <v-list-item @click="closeAllTabs">
          <v-list-item-title>모든 탭 닫기</v-list-item-title>
        </v-list-item>
        <v-list-item @click="closeOtherTabs">
          <v-list-item-title>다른 탭 닫기</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useTabsStore } from '@/stores/tabs'
import router from '@/router'
// ✨ [추가] useI18n을 import 합니다.
import { useI18n } from 'vue-i18n'
import { useMenuStore } from '@/stores/menu' // ✅ [추가] 1. menu 스토어 import
// ✨ [추가] 반응성을 가진 t 함수를 가져옵니다.
const { t } = useI18n()

const tabsStore = useTabsStore()
const menuStore = useMenuStore() // ✅ [추가] 2. menu 스토어 인스턴스

// ✅ [추가] 3. tab-content DOM 요소를 가리킬 ref 생성
const tabContentRef = ref(null)

const contextMenu = ref({
  show: false,
  x: 0,
  y: 0,
  targetTab: null,
})

function onTabChange(newPath) {
  router.push(newPath)
  // ✅ [추가] 2. menu 스토어 액션을 호출하여 Breadcrumbs 갱신
  menuStore.setActiveMenuByPath(newPath)
}

function closeTab(tab) {
  tabsStore.removeTab(tab)
}

function onRightClick(tab, event) {
  contextMenu.value.show = true
  contextMenu.value.x = event.clientX
  contextMenu.value.y = event.clientY
  contextMenu.value.targetTab = tab
  tabsStore.activeTabPath = tab.path
  router.push(tab.path)
}

function closeAllTabs() {
  tabsStore.closeAllTabs()
  contextMenu.value.show = false
}

function closeOtherTabs() {
  tabsStore.closeOtherTabs()
  contextMenu.value.show = false
}

// ✅ [추가] 4. Fullscreen API를 호출하는 토글 함수
function toggleFullscreen() {
  // 1. 현재 전체 화면인 요소가 있는지 확인
  if (!document.fullscreenElement) {
    // 2. 없다면, 우리가 지정한 'tab-content' 요소를 전체 화면으로 만듦
    if (tabContentRef.value) {
      tabContentRef.value.requestFullscreen().catch(function (err) {
        // (에러 처리, 예: 사용자가 권한을 거부함)
        console.error('전체 화면 모드 시작에 실패했습니다:', err.message)
      })
    }
  } else {
    // 3. 이미 전체 화면이라면, 전체 화면 모드에서 나감
    document.exitFullscreen()
  }
}
</script>

<style scoped>
/* 3. 새로운 Flexbox 레이아웃과 패널 스타일을 추가/수정합니다. */
.tab-view-layout {
  display: flex;
  width: 100%;
  height: 100%;
}

.tab-view-container {
  /* flex-grow: 1을 통해 남는 공간을 모두 차지하도록 설정 */
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: width 0.3s ease; /* 너비 변경 시 부드러운 애니메이션 효과 */
  /*✨ 이게 핵심! 내용이 길어져도 부모 너비를 넘어가지 않게 함 */
  min-width: 0;
}

.tab-bar {
  box-shadow: none;
  /* border-bottom: 1px solid #dcdfe6; */
}

.tab-content {
  /* flex-grow: 1, flex-shrink: 1, flex-basis: 0 */
  flex: 1 1 0;
  /* 내부 컨텐츠를 채우기 위한 설정 */
  display: flex;
  flex-direction: column;
  padding: 24px;
  overflow-y: auto;
  /* border-left: 1px solid #dcdfe6; */
  padding-bottom: 0;
  padding-top: 10px;
}

/* --- 기존 스타일은 유지 --- */
:deep(.v-tab) {
  text-transform: none !important;
  /* border-right: 1px solid #dcdfe6; */
  /* background-color: #f0f2f5; */
  color: #606266;
  font-weight: 500;
}

:deep(.v-tab--selected) {
  /* background-color: #ffffff; */
  color: var(--v-theme-primary);
  font-weight: 700;
  border-bottom-color: transparent;
}

.close-icon {
  border-radius: 50%;
  transition: background-color 0.2s ease-in-out;
}
.close-icon:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

/*패턴 C) “크롬(브라우저)”형 (파일/문서 에디터처럼 보이게)*/
/* 크롬형 */
:deep(.tab-bar.chrome) {
  background-color: rgb(var(--v-theme-surface));
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.12);
  padding-inline: 4px;
}

:deep(.tab-bar.chrome .v-tab) {
  text-transform: none;
  color: rgba(var(--v-theme-on-surface), 0.72);
  margin: 0 2px;
  min-height: 34px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  padding-inline: 10px;
}

:deep(.tab-bar.chrome .v-tab--selected) {
  color: rgb(var(--v-theme-primary));
  background-color: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-theme-on-surface), 0.12);
  border-bottom-color: transparent; /* 위로 떠 보이게 */
  font-weight: 700;
}

/* 인디케이터 숨김, 카드 테두리를 강조 */
:deep(.tab-bar.chrome .v-tabs__slider) {
  display: none;
}
</style>

<!--

/* A) 머티리얼 “언더라인”형 (가장 깔끔·산업용 대시보드에 적합) */
/* 언더라인형 */
:deep(.tab-bar.underline) {
  background-color: rgb(var(--v-theme-surface));
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.12);
}

:deep(.tab-bar.underline .v-tab) {
  text-transform: none;
  color: rgba(var(--v-theme-on-surface), 0.72);
  font-weight: 500;
  min-height: 38px;
}

:deep(.tab-bar.underline .v-slide-group__content) {
  /* 스크롤 영역 패딩 줄이기 */
  padding-inline: 4px;
}

:deep(.tab-bar.underline .v-tab--selected) {
  color: rgb(var(--v-theme-primary));
  font-weight: 700;
}

/* 하단 인디케이터 두께/색 커스터마이즈 */
:deep(.tab-bar.underline .v-tabs__slider) {
  height: 2px;
  background-color: rgb(var(--v-theme-primary)) !important;
}

/* 닫기 아이콘: 기본 숨김, hover 시 노출 */
:deep(.tab-item .close-icon) {
  border-radius: 50%;
  width: 22px;
  height: 22px;
  display: none;
}
:deep(.tab-item:hover .close-icon) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.06);
}
:deep(.v-theme--dark .tab-item:hover .close-icon) {
  background-color: rgba(255, 255, 255, 0.08);
}

/*패턴 B) “필(Pill)·세그먼트”형 (필터/모드 전환형 탭에 적합)*/
/* 필형 */
:deep(.tab-bar.pills) {
  background-color: transparent;
  padding: 6px 8px;
}

:deep(.tab-bar.pills .v-tab) {
  text-transform: none;
  color: rgba(var(--v-theme-on-surface), 0.72);
  border-radius: 999px;
  margin: 0 4px;
  padding-inline: 10px;
  min-height: 34px;
}

:deep(.tab-bar.pills .v-tab--selected) {
  color: rgb(var(--v-theme-primary));
  background-color: rgba(var(--v-theme-primary), 0.12);
  font-weight: 700;
}

/* 인디케이터 숨김 (필형은 보통 배경으로 강조) */
:deep(.tab-bar.pills .v-tabs__slider) { display: none; }


/*패턴 C) “크롬(브라우저)”형 (파일/문서 에디터처럼 보이게)*/
/* 크롬형 */
:deep(.tab-bar.chrome) {
  background-color: rgb(var(--v-theme-surface));
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.12);
  padding-inline: 4px;
}

:deep(.tab-bar.chrome .v-tab) {
  text-transform: none;
  color: rgba(var(--v-theme-on-surface), 0.72);
  margin: 0 2px;
  min-height: 34px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  padding-inline: 10px;
}

:deep(.tab-bar.chrome .v-tab--selected) {
  color: rgb(var(--v-theme-primary));
  background-color: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-theme-on-surface), 0.12);
  border-bottom-color: transparent; /* 위로 떠 보이게 */
  font-weight: 700;
}

/* 인디케이터 숨김, 카드 테두리를 강조 */
:deep(.tab-bar.chrome .v-tabs__slider) { display: none; }

-->
