import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@babel/polyfill'

// 登录判断
router.beforeEach((to, from, next) =>{
  if(to.name != 'Login' && sessionStorage.getItem("user") == null){
    next('/Login');
  }else{
    next();
  }
});

Vue.config.productionTip = false
//elementui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

//axios
import axios from 'axios'
import VueAxios from 'vue-axios'
axios.defaults.baseURL = 'https://article.5i71.org';
axios.defaults.headers.TOKEN = store.getters.getToken;
axios.interceptors.response.use(
  response => {
    //拦截响应，做统一处理 
    if (response.data.code == 202) {
      router.push({name: 'Login'})
    }
    return response
});
Vue.use(VueAxios, axios)

//使用qs插件
import qs from 'qs'
Vue.prototype.qs = qs

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
