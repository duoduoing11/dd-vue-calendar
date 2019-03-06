// 导入组件，组件必须声明 name
import calendar from './calendar.vue'

// 为组件提供 install 安装方法，供按需引入
calendar.install = function (Vue) {
	Vue.component(calendar.name, calendar)
}

// 默认导出组件
export default calendar