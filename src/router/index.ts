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
		const token = Storage.getLocalStorage('tk_access_token');
		if (!token) {
			console.log('登录操作');
		}
	}
	next();
});

const initGtag = (to: any, from: any) => {
	const tk_channelOpt = Storage.getLocalStorage("tk_channelOpt");
	if (tk_channelOpt) {
		const query  = to.query;
		const channelQuery = {...query, ...tk_channelOpt};
		const page_location = `${window.location.origin}?${qs.stringify(channelQuery)}`;
		window.gtag && window.gtag('config', 'G-9NW49R448X', { page_title: to.name, page_location});
	} else {
		window.gtag && window.gtag('config', 'G-9NW49R448X', { page_title: to.name});
	}
}


router.afterEach((to, from) => {
	initGtag(to, from)
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
