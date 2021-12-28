import api from '@/api/common';
import {Storage} from '@/utils/storage'
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { Toast, Dialog } from 'vant';
import utils from '@/utils/utils'

const state = {
    tabbarOptions: null,
    langOptions: null,
    currencyOptions: null,
    userNomalConfig: {
        lang: 'zh_cn'
    },
    fingerprint: '',
}

const actions = {
    async menuGetLis({commit}: any, payload: any){
        try {
			const res = await api.menuGetLis.exec({}) 
            commit('UPDATEHOMEPAGECONFIG', res);
        } catch (error) {
            console.log(error);
        }
    },
    async langGetList({commit}: any, payload: any){
        try {
			const res = await api.langGetList.exec({}) 
            commit('UPDATE_LANG_CONFIG', res);
        } catch (error) {
            console.log(error);
        }
    },
}

const mutations = {
    UPDATEHOMEPAGECONFIG: (state: any, payload: any)=>{
        state.tabbarOptions = payload;
    },
    UPDATE_LANG_CONFIG: (state: any, payload: any)=>{
        state.langOptions = payload;
    },
    UPDATECURRENCYCONFIG: (state: any, payload: any)=>{
        state.currencyOptions = payload;
    },
    UPDATE_FINGERPRINT: (state: any, payload: any)=>{
        state.fingerprint = payload;
    },
    UPDATEUSERNOMALCONFIG: (state: any, payload: any)=>{
        state.userNomalConfig = {...state.userNomalConfig, ...payload};
    },
}

const getters ={
    tabbarOptions: (state: any) => state.tabbarOptions,
    langOptions: (state: any) => state.langOptions,
    currencyOptions: (state: any) => state.currencyOptions,
    userNomalConfig: (state: any) => state.userNomalConfig,
    fingerprint: (state: any) => state.fingerprint
}

export default{
    namespaced:true,
    state,
    actions,
    mutations,
    getters
}