import MApi from './ApiInstance'

export default {
	bookGetList: new MApi({
		serviceUrl: '/anon/book/getList',
        method: 'get'
    }),
    bookGetDetail: new MApi({
		serviceUrl: '/anon/book/getDetail',
        method: 'get'
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
		serviceUrl: '/anon/bookCollect/remove',
        method: 'post'
    })
}