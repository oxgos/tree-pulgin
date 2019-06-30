import Vue from 'vue'
import App from './App.vue'
import vtree from './packages/tree-plugin/index'

Vue.use(vtree)
Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
