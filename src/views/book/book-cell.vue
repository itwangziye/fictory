<template>
    <pagecontain ref="container">
        <template slot="header" v-if="bookCellDetail">
            <van-nav-bar
            :title="bookCellDetail.bookChapterName"
            left-arrow
            @click-left="onClickLeft"
            />
        </template>
        <div v-if="bookCellDetail && bookCellDetail.bookTypeId === '1'" class="book__setting" :style="{backgroundColor: cellStyles.backgroundColor}">
            <ul class="color">
                <li class="color__item" v-for="(item, index) in colorOptions" :key="index" :style="{backgroundColor: item.bg}" @click="handerChangeTheme(item, 'bg')"></li>
            </ul>
            <ul class="font">
                <li :class="['font__item', {active: index === fontOptions.active}]" v-for="(item, index) in fontOptions.data" :key="index" @click="handerChangeTheme(item, 'font')" >
                    {{item.name}}
                </li>
            </ul>
        </div>
        <div class="book__cell" :style="cellStyles" v-if="bookCellDetail">
            <div class="book__cell-title">{{bookCellDetail.bookChapterName}}</div>
            <div class="book__cell-content" v-if="bookCellDetail.bookTypeId === '1'">
                {{bookCellDetail.bookContent}}
            </div>
            <div class="book__cell-content" v-else-if="bookCellDetail.bookTypeId === '2'">
                <van-image 
                class="img"
                :src="item" 
                lazy-load
                v-for="(item, index) in bookCellDetail.bookContent" 
                :key="index">
                    <template v-slot:loading>
                        <van-loading type="spinner" size="20" />
                    </template>
                </van-image>
            </div>

        </div>

        <div class="book__footer">
            <van-button type="default" icon="arrow-left" @click="handlerChangeMenu('pre')">上一章</van-button>
            <van-button type="default" icon="bars">菜单</van-button>
            <van-button type="default" @click="handlerChangeMenu('next')">
                <div class="footer__arrow">
                    <span>下一章</span> 
                    <van-icon name="arrow" />
                </div>
            </van-button>
        </div>
    </pagecontain>
    
</template>

<script lang="ts">
import { Component, Mixins, Watch} from 'vue-property-decorator';
import api from '@/api/book';
import pagecontain from '@/components/pagecontain.vue';
import PageMixins from '@/mixins/page-mixins'

@Component({
    components: {
        pagecontain
    }
})
export default class BookCell extends Mixins(PageMixins) {

    bookCellDetail: any = null;
    colorOptions: any[] = [
        {bg: 'rgba(242, 242, 242, 1)', color: '#111334'},
        {bg: 'rgba(221, 229, 180, 1)', color: '#111334'},
        {bg: 'rgba(196, 179, 153, 1)', color: '#111334'},
        {bg: 'rgba(51, 51, 51, 1)', icon: '', color: '#fff'}
    ];
    fontOptions: any = {
        active: 1,
        data: [
            {name: '小', index: 1, size: '12px'},
            {name: '中', index: 2, size: '14px'},
            {name: '大', index: 3, size: '20px'}
        ]
    };
    cellStyles: any = {
        color: '#111334',
        fontSize: '14px',
        backgroundColor: 'rgba(242, 242, 242, 1)'
    }
    
    init() {
        const query = this.$route.query;
        if (query && query.bookId) {
            const {chapterIndex, bookId} = this.$route.query;
            this.bookChapterGetDetailReq({chapterIndex, bookId})
        }
    }

    handerChangeTheme(item: any, type: string) {
        if (type === 'bg') {
            this.cellStyles.backgroundColor = item.bg;
            this.cellStyles.color = item.color;
        } else if (type === 'font') {
            this.cellStyles.fontSize = item.size;
        }
    }

    handlerChangeMenu(type: string) {
        const query: any = this.$route.query;
        let {chapterIndex, bookId} = query;
        const {totalChapterCount} = this.bookCellDetail;
        if (chapterIndex >= totalChapterCount && type === 'next') {
            this.$toast('已经是最后一章');
            return;
        } else if (chapterIndex <= 1 && type === 'pre') {
            this.$toast('已经是第一章');
            return;
        }

        if (type === 'pre') {
            --chapterIndex;
        } else if (type === 'next') {
            ++chapterIndex;
        };
        this.$router.replace({name: 'BookCell', query: {chapterIndex, bookId}})

    }

    async bookChapterGetDetailReq(parmas: any) {
        try {
           const data = await api.bookChapterGetDetail.exec(parmas) 
           this.bookCellDetail = data;
        } catch (error) {
            console.log(error)
        }
    }

    @Watch('$route', {immediate: true})
    watchRoute() {
        this.init();
    }
}
</script>

<style scoped lang="less">
    .book__setting {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 24px;
        height: 80px;
        .color {
            display: flex;
            &__item {
                width: 60px;
                height: 40px;
                border-radius: 8px;
                margin-right: 20px;
                border: 1px solid rgba(128, 128, 128, 1);
            }
        }
        .font {
            display: flex;
            font-size: @text-size5;
            color: @text-color1;
            &__item {
                margin-left: 20px;
                width: 40px;
                height: 40px;
                text-align: center;
                line-height: 40px;
                background-color: rgba(223, 223, 223, 1);
                &.active {
                    background-color: rgba(246, 215, 217, 1);
                }
            }
        }
    }
    .book__cell {
        padding: 0 24px;
        line-height: 54px;
        &-title {
            font-size: @text-size8 !important;
            font-weight: bolder;
        }
        .img {
            width: 100%;
            vertical-align: top;
        }
    }
    .book__footer{
        display: flex;
        justify-content: space-between;
        padding-top: 80px;
        .footer__arrow {
            display: flex;
            align-items: center;
            &>span {
                display: inline-block;
                padding-right: 10px;
            }
        }
    }
</style>
