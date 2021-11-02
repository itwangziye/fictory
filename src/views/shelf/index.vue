<template>
    <pagecontain>
        <div class="shelf">
            <div class="shelf__title">
                <div class="title">{{$t('page.shelf.tip')}}</div>
                <div class="operate click-list" @click="handleManage">{{isManage?$t('page.shelf.finish') : $t('page.shelf.manage')}}</div>
            </div>
            <van-list
            v-model="loading"
            :error.sync="error"
            :finished="finished"
            finished-text="没有更多了"
            error-text="请求失败，点击重新加载"
            @load="onLoad"
            >   
            <van-checkbox-group v-model="bookId" ref="checkboxGroup">
                <div class="shelf__list">
                   <div class="shelf__list-item" v-for="(item, index) in list" :key="index">
                       <van-image lazy-load fit="cover" v-if="item.bookImageUrl" :src="item.bookImageUrl" class="img">
                            <template v-slot:loading>
                                <van-loading type="spinner" size="20" />
                            </template>
                        </van-image>
                        <div class="title">
                            {{item.bookName}}
                        </div>
                        <van-checkbox checked-color="rgba(245, 156, 1, 1)" class="checkbox" :name="item.bookId" v-if="isManage"></van-checkbox>
                   </div>
                </div>
            </van-checkbox-group>
            </van-list>
        </div>
        <template v-slot:footer v-if="isManage">
            <div class="shelf__footer">
                <van-checkbox @change="handlerSelectAll" v-model="isAll" checked-color="rgba(245, 156, 1, 1)">全选</van-checkbox>
                <span class="del" @click="handerDel">删除</span>
            </div>
        </template>

    </pagecontain>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import BookTemp from '@/components/book-temp.vue';
import api from '@/api/book';
import pagecontain from '@/components/pagecontain.vue'

@Component({
    components: {
        BookTemp,
        pagecontain
    }
})
export default class BookList extends Vue {
    
    loading: boolean = true;
    finished: boolean = false;
    error: boolean = false;
    pagination: any = {
        pageIndex: 1,
        pageSize: 10
    }
    list: any[] = [];
    bookId: any[] = [];
    isManage: boolean = false;
    isAll: boolean = false;

    onLoad() :void{
        let {pageIndex} = this.pagination;
        pageIndex = ++pageIndex;
        console.log(pageIndex)
        this.bookGetListRequest({...this.pagination, pageIndex})
    }

    init() :void {
        this.bookGetListRequest(this.pagination, true);
    }

    handleManage() {
        this.isManage = !this.isManage;
    }
    handlerSelectAll (flage: any) {
        const checkboxGroup: any = this.$refs.checkboxGroup;
        checkboxGroup.toggleAll(flage);

    }

    handerDel() {
        this.$dialog.confirm({
            title: '确定删除？',
        })
        .then(async () => {
            console.log(this.bookId);
            const bookId = this.bookId.toString();
            this.bookCollectRemoveReq({bookId})
        })
        .catch(() => {
            console.log('取消')
        });
    }

    async bookGetListRequest(parmas: any, reflash?: boolean) {
        try {
            this.loading = true;
            const {resultList, pageIndex, pageSize, totalCount, totalPage} = await api.bookCollectGetList.exec(parmas)
            if (reflash) {
                this.list = resultList;
            } else {
                this.list = this.list.concat(resultList);
            }
            this.loading = false;
            this.pagination = {
                pageIndex,
                pageSize,
                totalCount,
                totalPage
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

    async bookCollectRemoveReq(parmas: any) {
        try {
           await api.bookCollectRemove.exec(parmas);
           this.$toast('操作成功');
           this.init();
           this.isManage = false;
        } catch (error) {
            console.log(error)
        }
    }


    created() {
        this.init();
    }
}
</script>

<style lang="less" scoped>
    .shelf {
        padding: 0 24px;
        &__title {
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
    
        &__list {
            display: flex;
            flex-wrap: wrap;
            &-item {
                width: 220px;
                position: relative;
                margin-right: 20px;
                margin-bottom: 20px;
                &:nth-child(3n) {
                    margin-right: 0;
                }
                .img {
                    width: 220px;
                    height: 300px;
                }
                .title {
                    font-size: @text-size5;
                    color: @text-color3;
                    line-height: 34px;
                }
                .checkbox{
                    position: absolute;
                    right: 0;
                    top: 0;
                }
            }
        }
    }
    .shelf__footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 24px;
        height: 60px;
        font-size: @text-size5;
        .del {
            color: @primary-color;
        }
    }
</style>
