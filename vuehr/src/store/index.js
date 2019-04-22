/*jshint esversion: 6 */
import Vue from 'vue';
import Vuex from 'vuex';
import '../lib/sockjs';
// import '../lib/stomp'
// import Stomp  from 'stompjs'
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userInfo: {
      name: window.localStorage.getItem('userInfo' || '[]') == null ? '未登录' : JSON.parse(window.localStorage.getItem('userInfo' || '[]')).name,
      userface: window.localStorage.getItem('userInfo' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('userInfo' || '[]')).userface,
      username: window.localStorage.getItem('userInfo' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('userInfo' || '[]')).username,
      telephone: window.localStorage.getItem('userInfo' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('userInfo' || '[]')).telephone,
      phone: window.localStorage.getItem('userInfo' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('userInfo' || '[]')).phone,
      address: window.localStorage.getItem('userInfo' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('userInfo' || '[]')).address,
      roles: window.localStorage.getItem('userInfo' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('userInfo' || '[]')).roles,
      password:window.localStorage.getItem('userInfo' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('userInfo' || '[]')).password,
      id:window.localStorage.getItem('userInfo' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('userInfo' || '[]')).id,

    },
    user: window.localStorage.getItem('x-access-token' || '[]')==null ? '未登录' : JSON.parse(window.localStorage.getItem('x-access-token' || '[]')),
    routes: [],
    msgList: [],
    isDotMap: new Map(),
    currentFriend: {},
    ws: new WebSocket('ws://localhost:8083/ws/chat'),
    nfDot: false
  },
  mutations: {
    initMenu(state, menus){
      state.routes = menus;
    },
    login(state, user){
      state.user = user;
      window.localStorage.setItem('x-access-token', JSON.stringify(user));
    },
    loginUserInfo(state,userInfo){
      state.userInfo = userInfo;
      window.localStorage.setItem('userInfo', JSON.stringify(userInfo));
    },
    
    logout(state){
      window.localStorage.removeItem('x-access-token');
      state.routes = [];
    },
    toggleNFDot(state, newValue){
      state.nfDot = newValue;
    },
    updateMsgList(state, newMsgList){
      state.msgList = newMsgList;
    },
    updateCurrentFriend(state, newFriend){
      state.currentFriend = newFriend;
    },
    addValue2DotMap(state, key){
      state.isDotMap.set(key, "您有未读消息");
    },
    removeValueDotMap(state, key){
      state.isDotMap.delete(key);
    }
  },
  actions: {
    connect(context){
      context.state.ws.hrid = this.state.userInfo.id;
      context.state.ws = new WebSocket('ws://localhost:8083/ws/chat?hrId='+this.state.userInfo.id);
      context.state.ws.onmessage=function(message){
          var msg = JSON.parse(message.data);
          var oldMsg = window.localStorage.getItem(context.state.userInfo.username + "#" + msg.from);
          if (oldMsg == null) {
          oldMsg = [];
          oldMsg.push(msg);
          window.localStorage.setItem(context.state.userInfo.username + "#" + msg.from, JSON.stringify(oldMsg));
          } else {
          var oldMsgJson = JSON.parse(oldMsg);
          oldMsgJson.push(msg);
          console.log(oldMsgJson)
          window.localStorage.setItem(context.state.userInfo.username + "#" + msg.from, JSON.stringify(oldMsgJson));
          }
          if (msg.from != context.state.currentFriend.username) {
          context.commit("addValue2DotMap", "isDot#" + context.state.userInfo.username + "#" + msg.from);
          }
          //更新msgList
          var oldMsg2 = window.localStorage.getItem(context.state.userInfo.username + "#" + context.state.currentFriend.username);
          if (oldMsg2 == null) {
          context.commit('updateMsgList', []);
          } else {
            
          context.commit('updateMsgList', JSON.parse(oldMsg2));
          }
      };
  }
  }
});
