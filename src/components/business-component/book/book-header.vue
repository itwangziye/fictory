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
            clickable
            replace
            >
                <van-grid-item 
                :icon="item.menuIcon" 
                :text="item.menuName" 
                v-for="(item, index) in tabbarOptions" 
                :key="index"
                :url="item.pageUrl"
                />
            </van-grid>
        </van-popup>
    </div>
    
</template>

<script lang="ts">
import { Component, Prop, Mixins} from 'vue-property-decorator';
import PageMixins from '@/mixins/page-mixins';
import { mapGetters } from 'vuex';


@Component({
        computed: {
        ...mapGetters({
            'tabbarOptions': 'metadata/tabbarOptions',
        })
    }
})
export default class BookHeader extends Mixins(PageMixins) {
    @Prop({default: ''}) title?: string;
    
    show: boolean = false;

    handerTogMore() :void{
        this.show = !this.show;
    }

}
</script>

<style scoped lang="less">
    .book__header {
        @{deep} .van-overlay,
        @{deep} .van-popup--top
        {
            top: 92px;
        }
    }
</style>
