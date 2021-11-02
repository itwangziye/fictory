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
        method: 'get'
    })
}