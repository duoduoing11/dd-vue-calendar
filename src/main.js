import Vue from 'vue'
import App from './App.vue'
import router from './router'
import calendar from '../packages'

Vue.config.productionTip = false
Vue.use(calendar)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
