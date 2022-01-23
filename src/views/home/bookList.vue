<template>
    <div class="pane">
        <div class="pane__title">
            <span>{{$t('page.home.recommend')}}</span>
            <span class="pane__title-rt click-list" @click="goPage('/home/category', {isGood: 1, title: '精品推荐'})">
                <span class="pane__title-text">查看更多</span>
                <van-icon class="pane__title-icon" name="arrow" />
            </span>
        </div>
        <div class="pane__content">
            <van-list
            v-model="loading"
            :error.sync="error"
            :finished="finished"
            :loading-text="$t('common.components.loading')"
            :finished-text="$t('common.components.noMore')"
            :error-text="$t('common.components.moreErrorTip')"
            @load="onLoad"
            >
                <ul class="fall__list">
                    <!-- <book-temp 
                    :opt="item"
                    v-for="(item, index) in list" 
                    :key="index"
                    >
                    </book-temp> -->
                    <li class="fall__list-item click-list" @click="handlerBookDetail(item)" v-for="(item, index) in list" :key="index">
                        <van-image :src="item.bookImageUrl" class="img">
                            <template v-slot:loading>
                                <van-loading type="spinner" size="20" />
                            </template>
                        </van-image>
                        <div class="title">{{item.bookName}}</div>
                    </li>
                </ul>
            </van-list>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import BookTemp from '@/components/book-temp.vue';
import api from '@/api/book';
import PageMixins from "@/mixins/page-mixins";

@Component({
    components: {
        BookTemp
    }
})
export default class BookList extends Mixins(PageMixins) {
    
    loading: boolean = true;
    finished: boolean = false;
    error: boolean = false;
    pagination: any = {
        pageIndex: 1,
        pageSize: 10,
        isGood: 1
    }
    list: any[] = []

    onLoad() :void{
        let {pageIndex} = this.pagination;
        pageIndex = ++pageIndex;
        console.log(pageIndex)
        this.bookGetListRequest({...this.pagination, pageIndex})
    }
    handlerBookDetail(item: any) :void{
        const {bookId} = item;
        this.$router.push({name: 'Book', query: {bookId}})
    }

    init() :void {
        this.bookGetListRequest(this.pagination);
    }

    async bookGetListRequest(parmas: any) {
        try {
            this.loading = true;
            const {resultList, pageIndex, pageSize, totalCount, totalPage} = await api.bookGetList.exec(parmas)
            this.list = this.list.concat(resultList);
            this.loading = false;
            this.pagination = {
                pageIndex,
                pageSize,
                totalCount,
                totalPage,
                isGood: 1
            }
            if (pageIndex >= totalPage) {
                this.finished = true;
            }
        } catch (error) {
            console.log(error)
            if (error && error.code === 'interrupt') {
				return;
			}
            this.loading = false;
            this.error = true;
        }
    }

    created() {
        this.init();
    }
}
</script>

<style lang="less" scoped>
    .pane {
        margin-top: 24px;
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
    .fall__list {
        display: flex;
        padding-bottom: 24px;
        flex-wrap: wrap;
        justify-content: space-between;
        &-item {
            width: 230px;
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
</style>
