<template>
    <pagecontain 
    ref="container"
    >
        <template slot="header" v-if="bookCellDetail">
            <book-header
            :title="bookCellDetail.bookChapterName"
            ></book-header>
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
            <div class="book__cell-content" v-html="bookCellDetail.bookContent" v-if="bookCellDetail.bookTypeId === '1'">
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
            <div class="book__cell-content" v-else-if="bookCellDetail.bookTypeId === '3'">
                <fc-video
                v-if="bookCellDetail.bookContent"
                :url="bookCellDetail.bookContent"
                ></fc-video>
            </div>

        </div>
        <van-action-sheet 
        v-model="pickerMenuVisible" 
        :actions="pickOptions" 
        @select="onConfirmMenu" 
        cancel-text="取消"
        close-on-click-action
        @cancel="pickerMenuVisible = false"
        />


        <div class="book__footer" v-if="bookCellDetail && bookCellDetail.totalChapterCount > 1">
            <van-button type="default" icon="arrow-left" @click="handlerChangeMenu('pre')">{{$t('page.book_cell.pre')}}</van-button>
            <van-button type="default" icon="bars" @click="handleMenu">{{$t('page.book_cell.menu')}}</van-button>
            <van-button type="default" @click="handlerChangeMenu('next')">
                <div class="footer__arrow">
                    <span>{{$t('page.book_cell.next')}}</span> 
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
import PageMixins from '@/mixins/page-mixins';
import BookHeader from '@/components/business-component/book/book-header.vue';
import FcVideo from '@/components/fc-video.vue';

@Component({
    components: {
        pagecontain,
        BookHeader,
        FcVideo
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
            {name: this.$t('page.book_cell.small'), index: 0, size: '12px'},
            {name: this.$t('page.book_cell.mid'), index: 1, size: '14px'},
            {name: this.$t('page.book_cell.large'), index: 2, size: '20px'}
        ]
    };
    cellStyles: any = {
        color: '#111334',
        fontSize: '14px',
        backgroundColor: 'rgba(242, 242, 242, 1)'
    }

    pickerMenuVisible: boolean = false;
    


    get pickOptions(): any[] {
        const query: any = this.$route.query;
        const {bookId} = query;
        return [
            {name: this.$t('common.tabbar.home'), path: '/'},
            {name: this.$t("page.book_menu.title"), path: `/book/menu?bookId=${bookId}`},
            // {name: '书籍详情', path: `/book?boodId=${bookId}`},
            {name: this.$t('common.tabbar.collect'), path: `/shelf`},
            {name: this.$t('common.tabbar.mine'), path: '/mine'}
        ]
    }
    
    init() {
        const query = this.$route.query;
        if (query && query.bookId) {
            const {chapterIndex, bookId} = this.$route.query;
            this.bookChapterGetDetailReq({chapterIndex, bookId})
        }
    }

    onConfirmMenu(item: any) {
        this.$router.replace({path: item.path})
    }

    handleMenu() {
        this.pickerMenuVisible = true;
    }

    handerChangeTheme(item: any, type: string) {
        if (type === 'bg') {
            this.cellStyles.backgroundColor = item.bg;
            this.cellStyles.color = item.color;
        } else if (type === 'font') {
            const {index} = item;
            this.fontOptions.active = index;
            this.cellStyles.fontSize = item.size;
        }
    }

    handlerChangeMenu(type: string) {
        const query: any = this.$route.query;
        let {chapterIndex, bookId} = query;
        const {totalChapterCount} = this.bookCellDetail;
        if (chapterIndex >= totalChapterCount && type === 'next') {
            this.$toast(this.$t('page.book_cell.no_next'));
            return;
        } else if (chapterIndex <= 1 && type === 'pre') {
            this.$toast(this.$t('page.book_cell.no_pre'));
            return;
        }

        if (type === 'pre') {
            --chapterIndex;
        } else if (type === 'next') {
            ++chapterIndex;
        };

        this.$nextTick(() => {
            const container: any = this.$refs.container;
            container.scorllTop(0);
            this.$router.replace({name: 'BookCell', query: {chapterIndex, bookId}})
        })
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
                text-align: center;
                padding: 5px;
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
