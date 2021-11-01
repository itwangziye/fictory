<template>
    <pagecontain>
        <template slot="header">
            <book-header
            :title="$t('page.order.title')"
            ></book-header>
        </template>
        <van-list
        v-model="loading"
        :error.sync="error"
        :finished="finished"
        finished-text="没有更多了"
        error-text="请求失败，点击重新加载"
        @load="onLoad"
        >
            <div class="order">
                <order-temp :opt="item" v-for="(item, index) in list" :key="index">

                </order-temp>
            </div>
        </van-list>
    </pagecontain>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import pagecontain from '@/components/pagecontain.vue';
import PageMixins from '@/mixins/page-mixins';
import api from '@/api/order';
import BookHeader from '@/components/business-component/book/book-header.vue';
import OrderTemp from '@/components/order-temp.vue';

@Component({
    components: {
        pagecontain,
        BookHeader,
        OrderTemp
    }
})
export default class BookMenu extends Mixins(PageMixins) {
    loading: boolean = true;
    finished: boolean = false;
    error: boolean = false;
    pagination: any = {
        pageIndex: 1,
        pageSize: 10
    }
    list: any[] = [];




    onLoad() :void{
        let {pageIndex} = this.pagination;
        pageIndex = ++pageIndex;
        this.getListRequest(this.pagination)
    }

    init() :void {
        const parmas: any = this.pagination;
        this.getListRequest(parmas);
    }

    async getListRequest(parmas: any) {
        try {
            this.loading = true;
            const {resultList, pageIndex, pageSize, totalCount, totalPage} = await api.orderGetList.exec(parmas)
            this.list = this.list.concat(resultList);
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

    created() {
        this.init();
    }
}
</script>

<style scoped lang="less">

</style>
