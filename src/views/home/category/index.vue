<template>
    <pagecontain
    :loading="pageLoading"
    :error="pageError"
    @on-retry="initPage"
    :empty="isEmpty"
    >
        <template slot="header">
            <van-nav-bar
            :title="pageTitle"
            left-arrow
            @click-left="onClickLeft"
            />
        </template>
        <div class="category">
            <div class="category__content">
                <van-list
                v-model="loading"
                :error.sync="error"
                :finished="finished"
                :loading-text="$t('common.components.loading')"
                :finished-text="$t('common.components.noMore')"
                :error-text="$t('common.components.moreErrorTip')"
                @load="onLoad"
                >
                    <ul class="category__list">
                        <book-temp 
                        :opt="item"
                        v-for="(item, index) in list" 
                        :key="index"
                        >
                        </book-temp>
                    </ul>
                </van-list>
            </div>
        </div>
    </pagecontain>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import BookTemp from '@/components/book-temp.vue';
import api from '@/api/book';
import pagecontain from '@/components/pagecontain.vue';
import PageMixins from '@/mixins/page-mixins';


@Component({
    components: {
        BookTemp,
        pagecontain
    }
})
export default class BookList extends Mixins(PageMixins) {
    
    loading: boolean = true;
    finished: boolean = false;
    error: boolean = false;
    pagination: any = {
        pageIndex: 1,
        pageSize: 10
    }
    list: any[] = [];
    pageTitle: string = '分类';

    get isEmpty() :boolean {
		const list = this.list;
		if (!list || !list.length) {
			return true;
		}
		return false;
	}

    onLoad() :void{
        let {pageIndex} = this.pagination;
        pageIndex = ++pageIndex;
        console.log(pageIndex)
        this.bookGetListRequest({...this.pagination, pageIndex})
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

    async initPage() {
        const {query} = (this as any).$route;
        if (query && query.title) {
            this.pageTitle = query.title;
        }
        this.pageLoading = true;
		await this.bookGetListRequest({...this.pagination, ...query})
		this.pageLoading = false;
    }

	created() {
		this.initPage()
	}
}
</script>

<style lang="less" scoped>
    .category__list {
        display: flex;
        padding-bottom: 24px;
        flex-wrap: wrap;
        justify-content: space-between;
        &-item {
            width: 230px;
            .img {
                width: 100%;
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
