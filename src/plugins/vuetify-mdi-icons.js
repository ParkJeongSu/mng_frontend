// vuetify의 mdi-svg 설정과 사용할 아이콘을 @mdi/js에서 직접 가져옵니다.
import { mdi } from 'vuetify/iconsets/mdi-svg'
import {
  mdiHome,
  mdiAccount,
  mdiLock,
  mdiWeb,
  mdiEye,
  mdiEyeOff,
  mdiMenuDown,
  mdiClose,
  mdiArrowUp,
  mdiArrowDown,
  mdiChevronDown,
  mdiChevronLeft,
  mdiChevronRight,
  mdiCheck,
  mdiAlertCircle,
  mdiInformation,
  mdiAlert,
  mdiDelete,
  mdiCancel,
  // === 새로 추가된 아이콘 ===
  mdiAccountCircle,
  mdiMenu,
  mdiBullseyeArrow,
  mdiChartLine,
  mdiProgressCheck,
  mdiPackageVariant,
  mdiViewDashboard,
  mdiLogout,
  mdiBellOutline,
  mdiPlus,
  mdiPencil,
  mdiMagnify,
  mdiAccountGroup,
  mdiAccountMultiple,
  mdiChartBar,
  mdiChevronUp,
  mdiCheckboxBlankOutline, // <--- 추가
  mdiPageFirst, // <--- 추가
  mdiPageLast, // <--- 추가
} from '@mdi/js' // 로그인 폼에서 사용한 아이콘들

// 아이콘 별칭(alias)을 만듭니다.
const aliases = {
  // '별칭' : '실제 아이콘 데이터'
  home: mdiHome,
  account: mdiAccount,
  lock: mdiLock,
  web: mdiWeb,
  eye: mdiEye,
  eyeOff: mdiEyeOff,
  dropdown: mdiMenuDown, // <--- 여기에 추가
  clear: mdiClose, // clearable v-text-field
  sortAsc: mdiArrowUp, // v-data-table 정렬
  sortDesc: mdiArrowDown, // v-data-table 정렬
  expand: mdiChevronDown, // v-expansion-panel
  prev: mdiChevronLeft, // v-pagination, v-carousel
  next: mdiChevronRight, // v-pagination, v-carousel
  checkboxOn: mdiCheck, // v-checkbox
  info: mdiInformation, // v-alert
  success: mdiCheck, // v-alert
  warning: mdiAlert, // v-alert
  error: mdiAlertCircle, // v-alert
  delete: mdiDelete, // (자주 사용)
  cancel: mdiCancel, // (자주 사용)
  close: mdiClose, // (자주 사용)
  // === 새로 추가된 별칭 ===
  accountCircle: mdiAccountCircle,
  menu: mdiMenu,
  bullseyeArrow: mdiBullseyeArrow,
  chartLine: mdiChartLine,
  progressCheck: mdiProgressCheck,
  packageVariant: mdiPackageVariant,
  chevronLeft: mdiChevronLeft,
  dashboard: mdiViewDashboard,
  logout: mdiLogout,
  bellOutline: mdiBellOutline,
  plus: mdiPlus,
  pencil: mdiPencil,
  magnify: mdiMagnify,
  accountGroup: mdiAccountGroup,
  accountMultiple: mdiAccountMultiple,
  chartBar: mdiChartBar,
  collapse: mdiChevronUp,
  // 2. 예약된 별칭 이름으로 새 아이콘들을 등록합니다.
  checkboxOff: mdiCheckboxBlankOutline, // v-checkbox의 체크 안된 상태
  first: mdiPageFirst, // v-pagination의 맨 처음 페이지
  last: mdiPageLast, // v-pagination의 맨 마지막 페이지
}

// 설정들을 export 합니다.
export { aliases, mdi }
