// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
/*jshint esversion: 6 */
import Vue from 'vue';
import App from './App';
import router from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import store from './store';
import {getRequest} from './utils/api';
import {postRequest} from './utils/api';
import {deleteRequest} from './utils/api';
import {putRequest} from './utils/api';
import {initMenu} from './utils/utils';
import {isNotNullORBlank} from './utils/utils';
import {GLOBAL} from './utils/global';
import './utils/filter_utils';
import 'font-awesome/css/font-awesome.min.css';

Vue.config.productionTip = false;
Vue.use(ElementUI);
/**
 * 自动获取焦点
 
Vue.directive('focus', function (el, option) {
  var defClass = 'el-input', defTag = 'input';
  var value = option.value || true;
  if (typeof value === 'boolean')
      value = { cls: defClass, tag: defTag, foc: value };
  else
      value = { cls: value.cls || defClass, tag: value.tag || defTag, foc: value.foc || false };
  if (el.classList.contains(value.cls) && value.foc)
      el.getElementsByTagName(value.tag)[0].focus();
});
*/
Vue.prototype.getRequest = getRequest;
Vue.prototype.postRequest = postRequest;
Vue.prototype.deleteRequest = deleteRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.isNotNullORBlank = isNotNullORBlank;
Vue.prototype.GLOBAL = GLOBAL;

router.beforeEach((to, from, next)=> {
    if (to.name == 'Login') {
      next();
      return;
    }
    var name = store.state.user;
    if (name == '未登录') {
      if (to.meta.requireAuth || to.name == null) {
        next({path: '/', query: {redirect: to.path}});
      } else {
        next();
      }
    } else {
      initMenu(router, store);
      if(to.path=='/chat')
        store.commit("updateMsgList", []);
      next();
    }
  }
);

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
});
