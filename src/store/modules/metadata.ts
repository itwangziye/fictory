import api from '@/api/common';
import {Storage} from '@/utils/storage'
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { Toast, Dialog } from 'vant';
import utils from '@/utils/utils'

const state = {
    homePageOptions: null,
    currencyOptions: null,
    userNomalConfig: {
        lang: 'zh_cn'
    },
    fingerprint: '',
}

const actions = {
   
}

const mutations = {
    UPDATEHOMEPAGECONFIG: (state: any, payload: any)=>{
        state.homePageOptions = payload;
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
    homePageOptions: (state: any) => state.homePageOptions,
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