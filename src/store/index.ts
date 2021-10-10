import Vue from 'vue'
import Vuex from 'vuex'
import metadata from './modules/metadata';
import home from './modules/home';
import http from './modules/http';


Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    metadata,
    home,
    http,
  }
})
