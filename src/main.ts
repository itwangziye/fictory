import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/config/components'
import i18n from './i18n'
import metadata from '@/config/metadata'

metadata.init();

Vue.config.productionTip = false

Vue.prototype.$cancel = function(){
  store.dispatch('http/removeHttpRequestList');
}


window.$vapp = new Vue({
  i18n,
  router,
  store,
  render: (h: any) => h(App)
}).$mount('#app')
