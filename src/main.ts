import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/config/components'
// import metadata from '@/config/metadata'

// metadata.init();

Vue.config.productionTip = false

Vue.prototype.$cancel = function(){
  store.dispatch('http/removeHttpRequestList');
}


window.$vapp = new Vue({
  router,
  store,
  render: (h: any) => h(App)
}).$mount('#app')
