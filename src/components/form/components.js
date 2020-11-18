
import FdInput from '../input/input.vue'
import FdSelect from '../select/select.vue'
import FdTimePicker from '../timePicker/timePicker.vue'
import FdChecker from '../checker/checker.vue'
import FdTree from '../formUserSelect/treeSelect.vue'
import FdTextarea from '../textarea/textarea.vue'
import FdSwitch from '../switch/switch.vue'
import FdUpload from '../upload/upload.vue'
import FdPopupRadio from '../popupRadio/index.vue'
import FdAddInput from '../addInput/addInput.vue'
const allComponents = [
  FdInput,
  FdSelect,
  FdTimePicker,
  FdChecker,
  FdTree,
  FdTextarea,
  FdSwitch,
  FdUpload,
  FdPopupRadio,
  FdUpload,
  FdAddInput
]

const components = {}
allComponents.forEach((Component) => {
  components[Component.name] = Component
})

export default components
