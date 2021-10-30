import axios from "axios";
import { Toast } from 'vant';
import {Storage} from '@/utils/storage';
import store from '@/store';

const AxiosInstance = axios.create({
    baseURL: process.env.NODE_ENV == 'production' ? process.env.VUE_APP_DOMAIN : process.env.VUE_APP_BASE_API,
    responseType: "json",
    withCredentials: false, // 是否允许带cookie这些
    timeout: 20 * 1000, //最大延迟时间5min
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    }
})

AxiosInstance.interceptors.request.use( (config: any) => {
    if (!config.not_token) {
        const token = Storage.getLocalStorage("fc_token")
        token ? config.headers['token'] = token : null;
    }
    const fc_lang = Storage.getLocalStorage("fc_lang");
    if (fc_lang) config.headers['lang'] = fc_lang;
    config.cancelToken = new axios.CancelToken(cancel => {
        store.commit("http/addHttpRequestList", cancel);
    })
	return config;
})

AxiosInstance.interceptors.response.use( (response) => {
    const {headers} = response;
    const {authorization} = headers;
    if (authorization) {
        const tk_access_token = authorization.split(' ')[1];
        if (tk_access_token) {
            Storage.setLocalStorage("tk_access_token", tk_access_token, 3600 * 24 * 7);
            store.commit('home/LOGIN', {access_token: tk_access_token})
        }
    }
	return response;
},  (error) => {
    if (error && error.message === 'interrupt') {
        return Promise.reject({status:'501', code:'interrupt', message: '请求被中断！'});
    }
    if(!error || !error.response){
        Toast.fail('网络请求失败')
        return Promise.reject({status:'500', code:'netError', message: '服务器开小差了！'});
    }
    let message = '';
    const {response} = error;
    let {status} = response;
    if (status >= 500) {
        message = '稍等一下，服务器开小差了……'
    }

    if (message) {
        Toast.fail(message);
    }

	return Promise.reject(error)
})

export default AxiosInstance;