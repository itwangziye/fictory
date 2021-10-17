<template>
    <van-tabbar route v-if="tabbarVisible">
        <van-tabbar-item v-for="(item, index) in tabbarOptions" :key="index" :to="item.url" :icon="item.icon">{{item.text}}</van-tabbar-item>
    </van-tabbar>
</template>

<script lang="ts">
	import {Component, Vue, Watch} from "vue-property-decorator";
                                                                  
	@Component
	export default class FcTabbar extends Vue {
        tabbarOptions: any[] = [
            {url: '/home', icon: 'home-o', text: '首页'}, 
            {url: '/cartoon', icon: 'newspaper-o', text: '漫画'},
            {url: '/movie', icon: 'video-o', text: '视频'},  
            {url: '/shelf', icon: 'bar-chart-o', text: '书架'}, 
            {url: '/mine', icon: 'user-o', text: '我的'}, 
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