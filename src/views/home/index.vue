<template>
    <pagecontain
    :loading="pageLoading"
	:error="pageError"
	@on-retry="pageInit"
    >   
        <template v-slot:header>
			<!-- <home-header></home-header> -->
            <van-nav-bar
            title="首页"
            ></van-nav-bar>
		</template>
        <div class="home">
            <van-swipe class="my-swipe" :autoplay="bannerIntervals" indicator-color="white">
                <van-swipe-item @click="handerItem(item)" v-for="(item, index) in bannerOptions" :key="index">
                    <van-image :src="item.imageUrl" class="img">
                        <template v-slot:loading>
                            <van-loading type="spinner" size="20" />
                        </template>
                    </van-image>
                </van-swipe-item>
            </van-swipe>

            <div class="home__search">
                <van-search
                    class="search-input"
                    shape="round"
                    background="transparent"
                    :placeholder="$t('page.home.search_input')"
                    readonly
                    @click="onSearchFocus"
                />
            </div>

            <div class="home__cell">
                <div class="home__cell-item click-able" 
                v-for="(item, index) in homeCellOptions" 
                :key="index"
                @click="goPage(item.path)"
                >
                    <div :class="['icon', item.key]">
                        <img  class="img" :src="item.icon" :alt="item.label" srcset="">
                    </div>
                    <div class="lable">{{item.lable}}</div>
                </div>
            </div>

            <div class="pane" v-if="hotOptions && hotOptions.length">
                <div class="pane__title">
                    <span>{{$t('page.home.hot')}}</span>
                    <span class="pane__title-rt click-list" @click="goPage('/home/category', {isHot: 1, title: '热门小说'})">
                        <span class="pane__title-text">查看更多</span>
                        <van-icon class="pane__title-icon" name="arrow" />
                    </span>
                </div>
                <div class="pane__content">
                    <ul class="hot__list">
                        <li class="hot__list-item click-list" @click="handlerBookDetail(item)" 
                        v-for="(item, index) in hotOptions" 
                        :key="index">
                            <van-image fit="cover" :src="item.bookImageUrl" class="img">
                                <template v-slot:loading>
                                    <van-loading type="spinner" size="20" />
                                </template>
                            </van-image>
                            <div class="title">{{item.bookName}}</div>
                            <!-- <div class="subTilte">{{item.authorName}}</div> -->
                        </li>
                    </ul>
                </div>
            </div>

            <div class="pane" v-if="freeOptions && freeOptions.length">
                <div class="pane__title">
                    <span>{{$t('page.home.free')}}</span> 
                    <span class="pane__title-rt click-list" @click="goPage('/home/category', {isFree: 1, title: '限时免费'})">
                        <span class="pane__title-text">查看更多</span>
                        <van-icon class="pane__title-icon" name="arrow" />
                    </span>
                </div>
                <div class="pane__content">
                    <ul class="hot__list">
                        <li class="hot__list-item click-list" @click="handlerBookDetail(item)" v-for="(item, index) in freeOptions" :key="index">
                            <van-image fit="cover" :src="item.bookImageUrl" class="img">
                                <template v-slot:loading>
                                    <van-loading type="spinner" size="20" />
                                </template>
                            </van-image>
                            <div class="title">{{item.bookName}}</div>
                            <!-- <div class="tag">
                                <van-tag plain type="warning">{{$t('page.home.tagFree')}}</van-tag>
                            </div> -->
                        </li>
                    </ul>
                </div>
            </div>
            <div class="home__fall">
                <book-list></book-list>
            </div>
        </div>
    </pagecontain>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import api from '@/api/home';
import apiBook from '@/api/book'
import pagecontain from '@/components/pagecontain.vue';
import BookList from './bookList.vue';
import PageMixins from '@/mixins/page-mixins'
import HomeHeader from './home-header.vue';

@Component({
    name: 'Home',
    components: {
        pagecontain,
        BookList,
        HomeHeader
    }
})
export default class Home extends Mixins(PageMixins) {

    bannerOptions: any[] = []
    hotOptions: any[] = [];
    freeOptions: any[] = [];
    homeCellOptions: any[] = [
        {icon: require('@/assets/home/home_cell1.png'), lable: '分类', key: 'cell1', path: '/home/category?type=category'},
        {icon: require('@/assets/home/home_cell2.png'), lable: '畅销榜', key: 'cell2', path: '/home/category?isSale=1&title=畅销榜'},
        {icon: require('@/assets/home/home_cell3.png'), lable: 'VIP人气榜', key: 'cell3', path: '/home/category?isVip=1&title=VIP畅销榜'},
        {icon: require('@/assets/home/home_cell4.png'), lable: '连载', key: 'cell4', path: '/home/category?isisContinueVip=1&title=连载'}
    ]

    get bannerIntervals() :number {
        const {bannerOptions} = this;
        if (!bannerOptions || !bannerOptions.length) return 3000
        const [first, ...rest] = bannerOptions;
        const {intervals} = first;
        if (intervals) return intervals * 1000
        return 3000;
    }

    onSearchFocus() {
        this.$router.push({path: 'book/search'})
    }


    handlerBookDetail(item: any) :void{
        const {bookId} = item;
        this.$router.push({name: 'Book', query: {bookId}})
    }

    handerItem(item: any) :void{
        const {pageUrl} = item;
        if (pageUrl) window.location.href = pageUrl;
    }

    async getListBannerReq() {
        try {
           const data = await api.getListBanner.exec({}) 
           this.bannerOptions = data;
        } catch (error) {
            console.log(error)
        }
    }

    async bookGetHotListReq() {
        try {
           const data = await apiBook.bookGetList.exec({isHot: 1}) 
           this.hotOptions = data.resultList;
        } catch (error) {
            console.log(error)
        }
    }

    async bookGetFreeListReq() {
        try {
           const data = await apiBook.bookGetList.exec({isFree: 1}) 
           this.freeOptions = data.resultList;
        } catch (error) {
            console.log(error)
        }
    }

    async pageInit() {
        this.pageLoading = true;
        await this.getListBannerReq();
        await this.bookGetHotListReq();
        await this.bookGetFreeListReq();
        this.pageLoading = false;
    }

    created() {
        this.pageInit()
    }
}
</script>

<style scoped lang="less">
    .home {
        &__search {
            /deep/.van-search__content{
                background-color: @primary-color;
                opacity: 0.5;
            }
        }

        &__cell {
            display: flex;
            background-color: @white;
            &-item {
                flex: 1;
                flex-direction: column;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px 0;
                .icon {
                    width: 88px;
                    height: 88px;
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    &.cell1 {
                        background-color: #1690FE;
                    }
                    &.cell2 {
                        background-color: #FF4C4D;
                    }
                    &.cell3 {
                        background-color: #F95E09;
                    }
                    &.cell4 {
                        background-color: #13C5A5;
                    }
                }
                .img {
                    width: 50px;
                }
                .lable {
                    padding-top: 10px;
                    color: @text-color1;
                    font-size: @text-size3;
                }
            }
        }

        .pane {
            margin-top: 2px;
            background-color: @white;
            padding: 0 24px;
            &__title {
                padding: 24px 15px;
                position: relative;
                font-size: @text-size5;
                color: @text-color1;
                display: flex;
                justify-content: space-between;
                align-items: baseline;
                &-text {
                    color: @text-color3;
                    font-size: @text-size3;
                }
                &-icon {
                    vertical-align: text-bottom;
                    color: @text-color3;
                }
                &::after {
                    content: '';
                    width: 2px;
                    height:28px;
                    position: absolute;
                    left: 0;
                    background-color: rgba(249, 94, 9, 1);
                }
            }
        }

        .hot__list {
            display: flex;
            padding-bottom: 24px;
            flex-wrap: wrap;
            &-item {
                width: 230px;
                &:nth-child(3n + 2) {
                    margin: 0 5px;
                }
                .img {
                    width: 100%;
                    height: 320px;
                }
                .title {
                    line-height: 34px;
                    overflow:hidden;
                    text-overflow:ellipsis;
                    white-space:nowrap;
                }
                .subTilte {
                    color: @text-color5;
                }
                .tag {
                    text-align: center;
                }
            }
        }
    }
</style>
