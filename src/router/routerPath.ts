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
		path: '/shelf',
		name: 'Shelf',
		component: () => import('@/views/shelf/index.vue'),
		meta: {keepAlive: true}
	},
	{
		path: '/mine',
		name: 'Mine',
		component: () => import('@/views/mine/index.vue'),
		meta: {keepAlive: true}
	},
	{
		path: '/user',
		name: 'User',
		component: () => import('@/views/mine/user-info/index.vue'),
	},
	{
		path: '/user/modify',
		name: 'UserModify',
		component: () => import('@/views/mine/user-info/modify-info.vue'),
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