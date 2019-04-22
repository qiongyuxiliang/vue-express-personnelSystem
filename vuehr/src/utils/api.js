/*jshint esversion: 6 */
import axios from 'axios';
import store from '../store';
import router from '../router';
import {
  Message
} from 'element-ui';
axios.interceptors.request.use(config => {

  let tokenVal = JSON.parse(localStorage.getItem('x-access-token')); // 取出Tolen

  if (tokenVal) {
    config.headers['x-access-token'] = tokenVal ;// 存在的话,把Token放在请求头中
  }
  return config;
}, err => {
  Message.error({
    message: '请求超时!'
  });
  // return Promise.resolve(err);
});
axios.interceptors.response.use(data => {

  if (data.status && data.status == 200 && data.data.status == 500) {

    Message.error({
      message: data.data.msg
    });
    return;
  }
  if (data.data.msg) {
    Message.success({
      message: data.data.msg
    });
  }
  if(data.data.result==='0x00002'){
    console.log(data.data.result,global.TOKEN_ERROR)
   router.push({//你需要接受路由的参数再跳转
      path: '/',
    });
  }
  return data;
}, err => {
  if (err.response.status == 504 || err.response.status == 404) {
    Message.error({
      message: '服务器被吃了⊙﹏⊙∥'
    });
    // console.log(this)
    // store.commit('logout')
    // router.replace({
    //   path: '/'
    // })
  } else if (err.response.status == 403) {
    Message.error({
      message: '权限不足,请联系管理员!'
    });
    store.commit(logout);
    router.replace({
      path: '/login'
    });
  } else if (err.response.status == 401) {
    Message.error({
      message: err.response.data.msg
    });
    
  } else {
    if (err.response.data.msg) {
      Message.error({
        message: err.response.data.msg
      });
    } else {
      Message.error({
        message: '未知错误!'
      });
    }
  }
  // return Promise.resolve(err);
});
let base = '';
export const postRequest = (url, params) => {

  return axios({
    method: 'post',
    url: `${base}${url}`,
    data: params,
    transformRequest: [function (data) {
      let ret = '';
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret;
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  });
};
export const uploadFileRequest = (url, params) => {
  return axios({
    method: 'post',
    url: `${base}${url}`,
    data: params,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
export const putRequest = (url, params) => {
  return axios({
    method: 'put',
    url: `${base}${url}`,
    data: params,
    transformRequest: [function (data) {
      let ret = '';
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret;
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
};
export const deleteRequest = (url) => {
  return axios({
    method: 'delete',
    url: `${base}${url}`
  });
};
export const getRequest = (url) => {
  return axios({
    method: 'get',
    url: `${base}${url}`,
    headers: {
      'x-access-token': JSON.parse(localStorage.getItem('x-access-token')),
    }

  });
};
