import { RouteConfig } from 'vue-router';

const routes: Array<RouteConfig> = [
	{
		path: '/',
		redirect: '/home',
	},
	{
		path: '/home',
		name: 'Home',
		component: () => import('@/views/home/index.vue'),
		meta: {keepAlive: true}
	},
	{
		path: '/home/category',
		name: 'HomeCategory',
		component: () => import('@/views/home/category/index.vue'),
	},
	{
		path: '/shelf',
		name: 'Shelf',
		component: () => import('@/views/shelf/index.vue'),
		// meta: {keepAlive: true}
	},
	{
		path: '/mine',
		name: 'Mine',
		component: () => import('@/views/mine/index.vue'),
	},
	{
		path: '/mine/recharge',
		name: 'Recharge',
		component: () => import('@/views/mine/recharge/index.vue'),
	},
	{
		path: '/user',
		name: 'User',
		component: () => import('@/views/mine/user-info/index.vue'),
		meta: { title: '会员详情', login: true },
	},
	{
		path: '/user/modify',
		name: 'UserModify',
		meta: {login: true},
		component: () => import('@/views/mine/user-info/modify-info.vue'),
	},
	{
		path: '/order',
		name: 'Order',
		meta: {login: true},
		component: () => import('@/views/order/index.vue'),
	},
	{
		path: '/order/finish',
		name: 'OrderFinish',
		component: () => import('@/views/order/finish.vue'),
	},
	{
		path: '/login',
		name: 'Login',
		component: () => import('@/views/login/login.vue'),
	},
	{
		path: '/register',
		name: 'Register',
		component: () => import('@/views/login/register.vue'),
	},


	{
		path: '/book',
		name: 'Book',
		component: () => import('@/views/book/index.vue')
	},
	{
		path: '/book/menu',
		name: 'BookMenu',
		component: () => import('@/views/book/book-menu.vue'),
	},
	{
		path: '/book/cell',
		name: 'BookCell',
		component: () => import('@/views/book/book-cell.vue'),
	},
	{
		path: '/book/search',
		name: 'BookSearch',
		component: () => import('@/views/book/search.vue'),
	},
	{
		path: '/book/order',
		name: 'BookOrder',
		component: () => import('@/views/book/book-order.vue'),
	},

	{
		path: '/movie',
		name: 'Movie',
		component: () => import('@/views/movie/index.vue'),
	},
	
	{
		path: '/cartoon',
		name: 'Cartoon',
		component: () => import('@/views/cartoon/index.vue'),
	}
]

export default routes;