<template>
    <van-tabbar :fixed="false" route v-if="tabbarVisible">
        <van-tabbar-item v-for="(item, index) in tabbarOptions" :key="index" :to="item.pageUrl" :icon="item.menuIcon">{{item.menuName}}</van-tabbar-item>
    </van-tabbar>
</template>

<script lang="ts">
	import {Component, Vue, Watch} from "vue-property-decorator";
    import { mapGetters } from 'vuex';

                                                                       
	@Component({
        computed: {
        ...mapGetters({
            'tabbarOptions': 'metadata/tabbarOptions',
        })
    }
    })
	export default class FcTabbar extends Vue {
        // tabbarOptions: any[] = [
        //     {url: '/home', icon: 'home-o', text: this.$t('common.tabbar.home')}, 
        //     {url: '/cartoon', icon: 'newspaper-o', text: this.$t('common.tabbar.cartoon')},
        //     {url: '/movie', icon: 'video-o', text: this.$t('common.tabbar.video')},  
        //     {url: '/shelf', icon: 'star-o', text: this.$t('common.tabbar.collect')}, 
        //     {url: '/mine', icon: 'user-o', text: this.$t('common.tabbar.mine')}, 
        // ];
        tabbarVisible: boolean = false;

        
        @Watch('$route', {immediate: true})
        watchRoute(route: any) {
            console.log(route)
            let flag: boolean = true;
            const tabbarOptions = (this as any).tabbarOptions;
            if (!tabbarOptions || !tabbarOptions.length) return;
            flag = tabbarOptions.some((item: any) => {
                if (item.pageUrl === route.path) return true;
                return false;
            })
            this.tabbarVisible = flag;
        }
	}
</script>