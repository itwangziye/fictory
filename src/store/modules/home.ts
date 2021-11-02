import {Storage} from '@/utils/storage';
import api from '@/api/common';
import { Toast } from 'vant';
import apiUser from '@/api/user';
import router from '@/router'

const state = {
    token: null,
    email: null,
    userInfo:{}
}

const actions = {
    login({commit}: any, payload: any){
        commit('LOGIN', payload)
    },
    async loginout({commit}: any, payload: any){
        try {
            // const toast = Toast.loading({forbidClick: true, message: '正在加载中···'});
            // await api.loginOut.exec({});
            // toast.clear();
            Toast.success('操作成功！')
            commit('LOGINOUT', payload);
        } catch (error) {
            console.log(error);

        }
    },
    async getUserInfo({commit}: any, payload: any){
        try {
            const res = await apiUser.getUserInfo.exec({});
            commit('UPUSERINFO', res);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
        
    },
    async updateUserInfo({commit}: any, payload: any){
        try {
            await apiUser.updateUserInfo.exec(payload);
            commit('UPUSERINFO', payload);
            Toast.success('操作成功！')
        } catch (error) {
            console.log(error);
        }
    },
}

const mutations = {
    LOGIN: (state: any, payload: any)=>{
        const {token} = payload;
        Storage.setLocalStorage("fc_token", token, 0);
        state.token = token;
    },
    LOGINOUT: (state: any)=>{
        state.token = null;
        state.email = null;
        Storage.removeStorage("fc_token");
        const {pathname, search} = window.location;
        const path = `${pathname}${search}`;
        router.replace({path: '/login', query: {redirect: path}});
    },
    UPUSERINFO: (state: any, payload: any)=>{
        state.userInfo = {...state.userInfo, ...payload};
    }
}

const getters ={
    token: (state: any) => state.token,
    email: (state: any) => state.email,
    userInfo:(state: any) => state.userInfo
}

export default{
    namespaced:true,
    state,
    actions,
    mutations,
    getters
}