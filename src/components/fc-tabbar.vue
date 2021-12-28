<template>
    <van-tabbar :fixed="false" route v-if="tabbarVisible">
        <van-tabbar-item v-for="(item, index) in tabbarOptions" :key="index" :to="item.url" :icon="item.icon">{{item.text}}</van-tabbar-item>
    </van-tabbar>
</template>

<script lang="ts">
	import {Component, Vue, Watch} from "vue-property-decorator";
                                                                       
	@Component
	export default class FcTabbar extends Vue {
        tabbarOptions: any[] = [
            {url: '/home', icon: 'home-o', text: this.$t('common.tabbar.home')}, 
            {url: '/cartoon', icon: 'newspaper-o', text: this.$t('common.tabbar.cartoon')},
            {url: '/movie', icon: 'video-o', text: this.$t('common.tabbar.video')},  
            {url: '/shelf', icon: 'star-o', text: this.$t('common.tabbar.collect')}, 
            {url: '/mine', icon: 'user-o', text: this.$t('common.tabbar.mine')}, 
        ];
        tabbarVisible: boolean = true;

        
        @Watch('$route', {immediate: true})
        watchRoute(route: any) {
            console.log(route)
            let flag: boolean = true;
            flag = this.tabbarOptions.some((item: any) => {
                if (item.url === route.path) return true;
                return false;
            })
            this.tabbarVisible = flag;
        }
	}
</script>