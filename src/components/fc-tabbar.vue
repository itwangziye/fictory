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
        tabbarBaseOptions: any[] = [
            {url: '/home', icon: 'home-o', text: this.$t('common.tabbar.home')}, 
            {url: '/cartoon', icon: 'newspaper-o', text: this.$t('common.tabbar.cartoon')},
            {url: '/movie', icon: 'video-o', text: this.$t('common.tabbar.video')},  
            {url: '/shelf', icon: 'star-o', text: this.$t('common.tabbar.collect')}, 
            {url: '/mine', icon: 'user-o', text: this.$t('common.tabbar.mine')}, 
        ];
        tabbarVisible: boolean = true;

        init(route: any) {
            let flag: boolean = true;
            const tabbarBaseOptions = (this as any).tabbarBaseOptions;
            if (!tabbarBaseOptions || !tabbarBaseOptions.length) return;
            flag = tabbarBaseOptions.some((item: any) => {
                if (item.url === route.path) return true;
                return false;
            })
            this.tabbarVisible = flag;
        }
        
        @Watch('$route', {immediate: true})
        watchRoute(route: any) {
            this.init(route)
        }
	}
</script>