import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
// import router from './router'
import store from './store/index'
import './registerServiceWorker'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'

Vue.config.productionTip = false

// @ts-ignore
new Vue({
  // router,
  store,
  render: (h) => h(App)
}).$mount('#app')
