<template>
    <pagecontain
    @on-retry="init"
	:empty="isEmpty"
    >
        <template slot="header">
            <book-header
            :title="$t('page.order.title')"
            ></book-header>
            <van-tabs @change="onTabChange" v-model="tabActive" color="rgba(245, 156, 1, 1">
                <van-tab :title="$t('page.order.tab__shop')"></van-tab>
                <van-tab :title="$t('page.order.tab__charge')"></van-tab>
            </van-tabs>
        </template>
        <div class="order">
            <van-list
            v-model="loading"
            :error.sync="error"
            :finished="finished"
            :loading-text="$t('common.components.loading')"
            :finished-text="$t('common.components.noMore')"
            :error-text="$t('common.components.moreErrorTip')"
            @load="onLoad"
            >
                <div class="order" v-if="tabActive === 0">
                    <order-temp  :opt="item" v-for="(item, index) in list" :key="index"></order-temp>
                </div>
                <div class="charge" v-else>
                    <van-cell v-for="(item, index) in list" :key="index" center :title="item.rechargeContent" :value="`￥${item.rechargePrice}`" :label="item.timePay" />
                </div>
            </van-list>
        </div>
        
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
    tabActive: number = 0;


    get isEmpty() :boolean {
		const list = this.list;
		if (!list || !list.length) {
			return true;
		}
		return false;
	}

    onTabChange() {
        this.list = [];
        this.pagination = {
            pageIndex: 1,
            pageSize: 10
        }
        this.init();
    }


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
            const {tabActive} = this;
            let apiIns = api.orderGetList;
            if (tabActive === 1) {
                apiIns = api.rechargeRecordGetList;
            }
            const {resultList, pageIndex, pageSize, totalCount, totalPage} = await apiIns.exec(parmas)
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
