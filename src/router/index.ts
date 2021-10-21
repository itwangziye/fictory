import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routerPath';
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Storage } from '@/utils/storage'
import qs from 'qs';

Vue.use(VueRouter)

const router = new VueRouter({
	mode: 'history',
	routes
})

router.beforeEach((to, from, next) => {
	const { meta } = to;
	const { login } = meta;
	NProgress.start()
	if (login) {
		const token = Storage.getLocalStorage('fc_token');
		if (!token) {
			console.log('登录操作');
		}
	}
	next();
});



router.afterEach((to, from) => {
	NProgress.done()
	//   let loader = document.getElementById("loader-wrapper");
	//   if (loader) {
	// 	loader.classList.add("animated");
	// 	loader.classList.add("fadeOut");
	// 	setTimeout(() => {
	// 		loader && loader.remove();
	// 	}, 1000);
	//   }
})

export default router
