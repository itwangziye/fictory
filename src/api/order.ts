import MApi from './ApiInstance'

export default {
	orderAdd: new MApi({
		serviceUrl: '/order/add',
        method: 'post'
    }),
    orderGetList: new MApi({
		serviceUrl: '/order/getList',
        method: 'get'
    }),
    orderQueryState: new MApi({
		serviceUrl: '/order/queryState',
        method: 'get'
    }),
    payTypeGetList: new MApi({
		serviceUrl: '/anon/payType/getList',
        method: 'get',
        config: {not_token: 1, needCurrency: 1}
    }),
    rechargeRecordAdd: new MApi({
		serviceUrl: '/rechargeRecord/add',
        method: 'post'
    }),
    rechargeRecordGetList: new MApi({
		serviceUrl: '/rechargeRecord/getList',
        method: 'get'
    })
}