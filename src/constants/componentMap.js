import { VTextField, VSelect, VAutocomplete, VTextarea } from 'vuetify/components'

const componentMap = {
  'v-text-field': VTextField,
  'v-select': VSelect,
  'v-textarea': VTextarea, // 나중에 사용할 수도 있으니 추가해둡니다.
  'v-autocomplete': VAutocomplete,
}

export { componentMap }
