import MApi from './ApiInstance'

export default {
	rechargeTemplateList: new MApi({
		serviceUrl: '/anon/rechargeTemplate/getList',
        method: 'get',
        config: {not_token: 1}
    }),
    accountGetDetail: new MApi({
		serviceUrl: '/account/getDetail',
        method: 'get'
    })
}