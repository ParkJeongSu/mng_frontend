// src/stores/tabs.js
import { ref } from 'vue'
import { defineStore } from 'pinia'
import router from '@/router'

// 1. '홈' 탭에 대한 정보를 상수로 정의하여 재사용합니다.
const HOME_TAB = {
  name: 'home',
  path: '/',
  title: '홈',
}

export const useTabsStore = defineStore('tabs', function () {
  // State: 열려있는 탭 목록과 현재 활성화된 탭의 경로
  const openTabs = ref([HOME_TAB])
  const activeTabPath = ref(HOME_TAB.path)

  // Actions
  /**
   * 새 탭을 추가하는 함수
   * @param {object} route - Vue Router의 라우트 객체
   */
  function addTab(route) {
    // 이미 열려있는 탭인지 경로(path)를 기준으로 확인
    const isAlreadyOpen = openTabs.value.some(function (tab) {
      return tab.path === route.path
    })

    // 열려있지 않다면, 탭 목록에 추가
    if (!isAlreadyOpen) {
      openTabs.value.push({
        name: route.name, // 라우트 이름
        path: route.path, // 라우트 경로
        title: route.meta.title || 'Untitled', // 탭에 표시될 제목
      })
    }

    // 현재 탭을 방금 추가/선택한 탭으로 활성화
    activeTabPath.value = route.path
  }

  /**
   * 특정 탭을 닫는 함수
   * @param {object} tabToClose - 닫으려는 탭 객체
   */
  function removeTab(tabToClose) {
    // '홈' 탭은 닫을 수 없도록 방어 로직을 추가합니다.
    if (tabToClose.path === HOME_TAB.path) {
      return
    }

    const index = openTabs.value.findIndex(function (tab) {
      return tab.path === tabToClose.path
    })

    // 탭을 목록에서 제거
    if (index !== -1) {
      openTabs.value.splice(index, 1)
    }

    // 만약 닫은 탭이 현재 활성화된 탭이었다면, 다른 탭을 활성화
    if (activeTabPath.value === tabToClose.path) {
      if (openTabs.value.length > 0) {
        // 가장 마지막 탭을 활성화하고 해당 경로로 이동
        const lastTab = openTabs.value[openTabs.value.length - 1]
        activeTabPath.value = lastTab.path
        router.push(lastTab.path)
      } else {
        // 모든 탭이 닫혔다면 홈으로 이동
        activeTabPath.value = ''
        router.push('/')
      }
    }
  }

  /**
   * 모든 탭을 닫는 함수
   */
  function closeAllTabs() {
    openTabs.value = [HOME_TAB]
    activeTabPath.value = HOME_TAB.path
    router.push(HOME_TAB.path)
  }

  /**
   * 현재 탭을 제외한 나머지 탭을 닫는 함수
   */
  function closeOtherTabs() {
    const currentTab = openTabs.value.find(function (tab) {
      return tab.path === activeTabPath.value
    })
    // 현재 탭이 '홈'이 아닐 경우, '홈' 탭과 '현재 탭'을 모두 남깁니다.
    if (currentTab.path !== HOME_TAB.path) {
      openTabs.value = [HOME_TAB, currentTab]
    } else {
      openTabs.value = [HOME_TAB]
    }
  }

  return {
    openTabs,
    activeTabPath,
    addTab,
    removeTab,
    closeAllTabs,
    closeOtherTabs,
  }
})
