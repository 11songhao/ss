import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
import UploadImg from './UploadImg'
import ScreenFull from './ScreenFull'
import Qrcode from './Qrcode'
import Lang from './Lang'
import ElDepSelect from './DepSel'
export default {
  install (Vue) {
    Vue.component('PageTools', PageTools)
    Vue.component('UploadExcel', UploadExcel)
    Vue.component('UploadImg', UploadImg)
    Vue.component('ScreenFull', ScreenFull)
    Vue.component('Qrcode', Qrcode)
    Vue.component('ElDepSelect', ElDepSelect)
    Vue.component('Lang', Lang)
  }
}
