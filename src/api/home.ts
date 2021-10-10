import MApi from './ApiInstance'

export default {
	getListBanner: new MApi({
		serviceUrl: '/anon/banner/getList',
        method: 'get'
    })
}