<template>
    <pagecontain
    :loading="pageLoading"
	:error="pageError"
	@on-retry="pageInit"
    >   
        <template v-slot:header>
			<home-header></home-header>
		</template>
        <div class="home">
            <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
                <van-swipe-item v-for="(item, index) in bannerOptions" :key="index">
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

            <div class="pane">
                <div class="pane__title">{{$t('page.home.hot')}}</div>
                <div class="pane__content">
                    <ul class="hot__list">
                        <li class="hot__list-item click-list" @click="handlerBookDetail(item)" 
                        v-for="(item, index) in hotOptions" 
                        :key="index">
                            <van-image :src="item.bookImageUrl" class="img">
                                <template v-slot:loading>
                                    <van-loading type="spinner" size="20" />
                                </template>
                            </van-image>
                            <div class="title">{{item.bookName}}</div>
                            <div class="subTilte">{{item.authorName}}</div>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="pane">
                <div class="pane__title">{{$t('page.home.free')}}</div>
                <div class="pane__content">
                    <ul class="hot__list">
                        <li class="hot__list-item click-list" @click="handlerBookDetail(item)" v-for="(item, index) in freeOptions" :key="index">
                            <van-image :src="item.bookImageUrl" class="img">
                                <template v-slot:loading>
                                    <van-loading type="spinner" size="20" />
                                </template>
                            </van-image>
                            <div class="title">{{item.bookName}}</div>
                            <div class="tag">
                                <van-tag plain type="warning">免费</van-tag>
                            </div>
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
    freeOptions: any[] = []

    onSearchFocus() {
        this.$router.push({path: 'book/search'})
    }


    handlerBookDetail(item: any) :void{
        const {bookId} = item;
        this.$router.push({name: 'Book', query: {bookId}})
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

        .pane {
            margin-top: 24px;
            background-color: @white;
            padding: 0 24px;
            &__title {
                padding: 24px 15px;
                position: relative;
                font-size: @text-size5;
                color: @text-color1;
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
            overflow-x: auto;
            &-item {
                padding-right: 30px;
                width: 180px;
                .img {
                    width: 150px;
                    height: 200px;
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
