import Vue from 'vue'
import App from './App.vue'
import router from './router'
import calendar from '../packages'

Vue.config.productionTip = false

/**
 * 设置Html的Font-Size
 */
window.onresize = function() {
	var htmlWidth = document.documentElement.clientWidth || document.body.clientWidth;
	var htmlDom = document.getElementsByTagName('html')[0];
	htmlDom.style.fontSize = htmlWidth / 10 + 'px';
}();


Vue.use(calendar)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
