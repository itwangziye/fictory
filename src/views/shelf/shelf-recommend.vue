<template>
    <div class="shelf__recommend" v-if="list && list.length">
        <div class="shelf__recommend-title">
            <div class="title">书架推荐</div>
            <div class="operate" @click="handleChange">换一批</div>
        </div>
        <ul class="recommend__list">
            <li class="recommend__list-item click-list" @click="handlerBookDetail(item)" v-for="(item, index) in flagList" :key="index">
                <van-image fit="cover" :src="item.bookImageUrl" class="img">
                    <template v-slot:loading>
                        <van-loading type="spinner" size="20" />
                    </template>
                </van-image>
                <div class="title">{{item.bookName}}</div>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import api from '@/api/book';

@Component
export default class ShelfRecommend extends Vue {
    
    loading: boolean = true;
    pagination: any = {
        pageIndex: 1,
        pageSize: 10,
        isGood: 1
    }
    list: any[] = [];

    get flagList() :any[]{
        const {list} = this;
        return list.filter((item, index) => {
            return index < 4
        })
    }

    onLoad() :void{
        let {pageIndex} = this.pagination;
        pageIndex = ++pageIndex;
        this.bookGetListRequest({...this.pagination, pageIndex})
    }


    async initPage() {
        await this.bookGetListRequest(this.pagination, true);
    }

    async bookGetListRequest(parmas: any, reflash?: boolean) {
        try {
            this.loading = true;
            const {resultList, pageIndex, pageSize, totalCount, totalPage} = await api.bookGetList.exec(parmas)
            this.list = resultList;
            this.loading = false;
            this.pagination = {
                pageIndex,
                pageSize,
                totalCount,
                totalPage,
                isGood: 1
            }
        } catch (error) {
            console.log(error)
            if (error && error.code === 'interrupt') {
				return;
			}
            this.loading = false;
        }
    }

    handlerBookDetail(item: any) :void{
        const {bookId, bookChapterId} = item;
        this.$router.push({name: 'BookCell', query: {bookId, bookChapterId}})
    }

    handleChange() :void{
        this.onLoad();
    }



    created() {
        this.initPage();
    }
}
</script>

<style lang="less" scoped>
    .shelf__recommend {
        padding: 0 24px;
        &-title {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .title{
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
            .operate {
                color: @primary-color;
                font-size: @text-size5;
            }
        }

        .recommend__list {
            display: flex;
            padding-bottom: 24px;
            flex-wrap: wrap;
            justify-content: space-between;
            &-item {
                width: 150px;
                .img {
                    width: 100%;
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
