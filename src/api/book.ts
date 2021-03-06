import MApi from './ApiInstance'

export default {
	bookGetList: new MApi({
		serviceUrl: '/anon/book/getList',
        method: 'get'
    }),
    bookGetDetail: new MApi({
		serviceUrl: '/anon/book/getDetail',
        method: 'get',
        config: {needCurrency: 1}
    }),
    bookChapterGetList: new MApi({
		serviceUrl: '/anon/bookChapter/getList',
        method: 'get'
    }),
    bookChapterGetDetail: new MApi({
		serviceUrl: '/anon/bookChapter/getDetail',
        method: 'get'
    }),
    bookCollectGetList: new MApi({
		serviceUrl: '/bookCollect/getList',
        method: 'get'
    }),
    bookCollectAdd: new MApi({
		serviceUrl: '/bookCollect/add',
        method: 'post'
    }),
    bookCollectRemove: new MApi({
		serviceUrl: '/bookCollect/remove',
        method: 'post'
    }),
    // 阅读记录
    readRecordGetList: new MApi({
		serviceUrl: '/readRecord/getList',
        method: 'get'
    }),
    // 获取价格
    bookGetPrice: new MApi({
		serviceUrl: '/anon/book/getPrice',
        method: 'get'
    }),
}