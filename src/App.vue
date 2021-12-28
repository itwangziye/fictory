<template>
	<div id="app" class="app">
		<div class="app-main">
			<transition :name="transitionName">
				<keep-alive :exclude='exclude'>
					<component class="keepAlive page" ref='keepAliveComponent' v-if="$route.meta.keepAlive" v-bind:is="currentView"></component>
				</keep-alive>
			</transition>
			<transition :name="transitionName">
				<component v-if="!$route.meta.keepAlive" v-bind:is="currentView"></component>
			</transition>
		</div>
		<fc-tabbar></fc-tabbar>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import {Storage} from '@/utils/storage'
import FcTabbar from '@/components/fc-tabbar.vue';
import qs from 'qs';


@Component({
	components: {
		FcTabbar
	}
})
export default class App extends Vue {

	transitionName: string = 'slide-left';
	currentView: string = 'router-view';
	exclude: string = '';
	tabbarOptions: any[] = []

	pageInit() {
		const fc_token = Storage.getLocalStorage("fc_token");
		const fc_lang = Storage.getLocalStorage("fc_lang");
		if (fc_token) {
			this.$store.commit('home/LOGIN', {token: fc_token});
		}
		if (fc_lang) {
			this.$store.commit('metadata/UPDATEUSERNOMALCONFIG', {lang: fc_lang});
		}
	}
	cashChannId() {
		const {search} = window.location;
		if (search) {
			const query = qs.parse(search.replace('?', ''));
				if (query) {
				const {cid} = query;
				if (cid) {
					let channelOpt: any = {cid};
					Storage.setLocalStorage("fc_channelOpt", channelOpt, 3600 * 24 * 30);
				}
			}
		}
	}

	initPageOpt() {
		(document as any).title = this.$t('common.title');
	}
	created() {
		this.pageInit();
	}
	mounted() {
		this.cashChannId();
		this.initPageOpt();
	}
}
</script>

<style lang="less">
@import './style/base.less';
.app {
		position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 1;
        display: flex;
        flex-flow: column;
		&-main{
			flex: 1 1 100%;
			position: relative;
		}
	}
</style>
