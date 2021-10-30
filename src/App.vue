<template>
	<div id="app">
		<transition :name="transitionName">
            <keep-alive :exclude='exclude'>
                <component class="keepAlive page" ref='keepAliveComponent' v-if="$route.meta.keepAlive" v-bind:is="currentView"></component>
            </keep-alive>
        </transition>
        <transition :name="transitionName">
            <component v-if="!$route.meta.keepAlive" v-bind:is="currentView"></component>
        </transition>
		<fc-tabbar></fc-tabbar>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import {Storage} from '@/utils/storage'
import FcTabbar from '@/components/fc-tabbar.vue';

@Component({
	components: {
		FcTabbar
	}
})
export default class App extends Vue {

	transitionName: string = 'slide-left';
	currentView: string = 'router-view';
	exclude: string = '';

	pageInit() {
		const fc_token = Storage.getLocalStorage("fc_token");
		const fc_lang = Storage.getLocalStorage("fc_lang");
		if (fc_token) {
			this.$store.commit('home/LOGIN', {token: fc_token});
		}
		if (fc_lang) {
			this.$store.commit('metadata/UPDATEUSERNOMALCONFIG', {lang: fc_lang});
		} else {
			Storage.setLocalStorage('fc_lang', 'zh_cn', 0)
		}
	}
	created() {
		this.pageInit();
	}
}
</script>

<style lang="less">
@import './style/base.less';
</style>
