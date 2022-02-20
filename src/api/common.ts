import MApi from './ApiInstance'

export default {
    // 登出
	loginOut: new MApi({
		serviceUrl: '/auth/logout',
        method: 'post'
    }),
    loginIn: new MApi({
		serviceUrl: '/anon/user/login',
        method: 'post',
        config: {not_token: 1}
    }),
    register: new MApi({
		serviceUrl: '/anon/user/regist',
        method: 'post',
        config: {not_token: 1}
    }),
    menuGetLis: new MApi({
		serviceUrl: '/anon/menu/getList',
        method: 'get',
        config: {not_token: 1}
    }),
    langGetList: new MApi({
		serviceUrl: '/anon/lang/getList',
        method: 'get',
        config: {not_token: 1}
    }),
    getExchangeRate: new MApi({
		serviceUrl: '/anon/order/getExchangeRate',
        method: 'get',
        config: {not_token: 1}
    }),
    settingGetValue: new MApi({
		serviceUrl: '/anon/setting/getValue',
        method: 'get',
        config: {not_token: 1}
    })
}