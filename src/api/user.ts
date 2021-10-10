import MApi from './ApiInstance'

export default {
    // 获取个人信息
	getUserInfo: new MApi({
		serviceUrl: '/auth/profile',
        method: 'post',
    }),
    // 修改个人信息
	updateUserInfo: new MApi({
		serviceUrl: '/auth/profile/update',
        method: 'post',
    }),
    // 修改个人密码
	updateUserPassword: new MApi({
		serviceUrl: '/auth/password/update',
        method: 'post',
    }),
    // 我的订单列表
	getUserOrderList: new MApi({
		serviceUrl: '/order/list',
        method: 'post',
        config: {needCurrency: 1}
    }),
    // 订单详情
	getUserOrderDetail: new MApi({
		serviceUrl: '/order/details',
        method: 'post',
        config: {needCurrency: 1}
    }),
    // 取消订单
	cancelOrder: new MApi({
		serviceUrl: '/order/cancel',
        method: 'post',
        config: {needFingerprint: 1}
    }),
    // 确认收货
	receiveOrder: new MApi({
		serviceUrl: '/order/receive',
        method: 'post',
        config: {needFingerprint: 1}
    })
}