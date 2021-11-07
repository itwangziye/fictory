<template>
    <div
    class="book__header"
    >
        <van-nav-bar
        :title="title"
        left-arrow
        @click-left="onClickLeft"
        >
        <template #right>
            <van-icon name="bars" size="18" @click="handerTogMore"/>
        </template>
        </van-nav-bar>
        <van-popup 
        v-model="show" 
        position="top" 
        >
            <van-grid
            column-num="5"
            clickable
            replace
            >
                <van-grid-item 
                :icon="item.icon" 
                :text="item.text" 
                v-for="(item, index) in tabbarOptions" 
                :key="index"
                :url="item.url"
                />
            </van-grid>
        </van-popup>
    </div>
    
</template>

<script lang="ts">
import { Component, Prop, Mixins} from 'vue-property-decorator';
import PageMixins from '@/mixins/page-mixins';


@Component
export default class BookHeader extends Mixins(PageMixins) {
    @Prop({default: ''}) title?: string;
    
    show: boolean = false;
    tabbarOptions: any[] = [
        {url: '/home', icon: 'home-o', text: this.$t('common.tabbar.home')}, 
        {url: '/cartoon', icon: 'newspaper-o', text: this.$t('common.tabbar.cartoon')},
        {url: '/movie', icon: 'video-o', text: this.$t('common.tabbar.video')},  
        {url: '/shelf', icon: 'star-o', text: this.$t('common.tabbar.collect')}, 
        {url: '/mine', icon: 'user-o', text: this.$t('common.tabbar.mine')}, 
    ];

    handerTogMore() :void{
        this.show = !this.show;
    }

}
</script>

<style scoped lang="less">
    .book__header {
        /deep/ .van-overlay,
        /deep/ .van-popup--top
        {
            top: 92px;
        }
    }
</style>
