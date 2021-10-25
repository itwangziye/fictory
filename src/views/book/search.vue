<template>
    <div>
        <pagecontain
        :disabledPullRefresh="searchPaneVisible"
        :onRefresh="onRefresh"
        :empty="pageEmpty"
        :error="pageError"
        :loading="pageLoading"
        @on-retry="onRefresh"
        >
            <template v-slot:header>
                <nav-bar
                :pageBack="handlerBack"
                :class="[ !searchPaneVisible && 'navbar__search']"
                >
                    <template slot="title">
                        <form action="/">
                            <van-search
                            class="search-input"
                            v-model.trim="searchKey"
                            shape="round"
                            background="transparent"
                            placeholder="请输入商品"
                            @focus="onSearchFocus"
                            @search="onSearch"
                            />
                        </form>
                    </template> 
                    <template slot="right" v-if="searchPaneVisible">
                        <div class="navbar__search-text click-able" @click="onSearch">
                            搜索
                        </div>
                    </template>
                </nav-bar>
            </template>
            <div class="book__search">
                <van-list
                    v-model="loading"
                    :error.sync="error"
                    :finished="finished"
                    finished-text="没有更多了"
                    error-text="请求失败，点击重新加载"
                    @load="onLoad"
                    >
                    <div class="book__search-list">
                        <book-temp 
                        :opt="item"
                        v-for="(item, index) in list" 
                        :key="index"
                        >
                        </book-temp>
                    </div>
                </van-list>
            </div>
        </pagecontain>

        <div class="search__pane" v-if="searchPaneVisible">
                <div class="search__pane-history" v-if="historyOptions && historyOptions.length">
                    <div class="session">
                        <div class="session__title">
                            <span>历史搜索</span>
                        </div>
                        <van-icon class="click-list" name="delete-o" @click="handlerDelete"/>
                    </div>
                    <ul class="content">
                        <li class="content__item click-list" 
                        @click="handlerItem(item)"
                        v-for="(item, index) in historyOptions" 
                        :key="index">{{item}}</li>
                    </ul>
                </div>
        </div>
    </div>
	

	
</template>

<script lang="ts">
import { Component, Mixins} from "vue-property-decorator";
import api from '@/api/book';
import PageMixins from '@/mixins/page-mixins';
import pagecontain from '@/components/pagecontain.vue';
import NavBar from '@/components/nav-bar.vue';
import {Storage} from '@/utils/storage';
import BookTemp from '@/components/book-temp.vue';

@Component({
	name: 'GoodsSearch',
	components: {
		pagecontain,
        NavBar,
        BookTemp
	}
})
export default class GoodsSearch extends Mixins(PageMixins) {
    loading: boolean = true;
    finished: boolean = false;
    error: boolean = false;
    list: any[] = [];
    pagination: any = {
        pageIndex: 1,
        pageSize: 10
    }
	searchKey: string = '';
    searchPaneVisible: boolean = true;
    historyOptions: string[] = [];


    handlerItem(item: any) {
        this.searchKey = item;
        this.searchPaneVisible = false;
        this.onRefresh();
    }

    handlerDelete() {
        this.$dialog.confirm({
            title: '确定清空历史记录？',
        }).then(() => {
            Storage.removeStorage("fc_history_keys");
            this.historyOptions = [];
        }).catch(() => {
            console.log('取消')
        });
    }

    handlerBack() :void{
        const searchPaneVisible = this.searchPaneVisible;
        if (searchPaneVisible) {
            this.$router.back();
        } else {
            this.searchPaneVisible = true;
        }
    }
 
	onLoad() :void{
        let {pageIndex} = this.pagination;
        pageIndex = ++pageIndex;
		const keyword = this.searchKey;
        this.goodsListRequest({...this.pagination, bookName: keyword})
    }

    onSearchFocus() :void {
        this.searchPaneVisible = true;
    }

    onSearch() :void {
        const keyword = this.searchKey; 
        if (!keyword) {
            this.$toast('查询不能为空');
            return;
        }
        this.onRefresh();
        this.searchPaneVisible = false;
        const historyOptions = this.historyOptions;
        if (historyOptions.includes(keyword)) return;
        if (historyOptions.length > 9) {
            this.historyOptions.pop();
        }
        this.historyOptions.unshift(keyword);
        Storage.setLocalStorage("fc_history_keys", this.historyOptions, 3600 * 24 * 30 * 3);
    }

	async goodsListRequest(parmas: any, refresh: boolean = false) {
        try {
            this.loading = true;
            const {resultList, pageIndex, pageSize, totalCount, totalPage} = await api.bookGetList.exec(parmas);
			if (refresh) this.list = []; 
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
            return this.list;
        } catch (error) {
            console.log(error)
            this.loading = false;
            this.error = true;
            return false
        }
    }

	initRoutetParmas(query: any) :void{
		if (query && query.searchKey) {
			const keyword = query.searchKey;
			this.searchKey = keyword;
			this.goodsListRequest({bookName: keyword})
		}
	}

	async onRefresh() {
		this.pagination = {
			pageIndex: 1,
			pageSize: 10
		}
		const keyword = this.searchKey;
        this.setPageStatus('loading');
        const flag = await this.goodsListRequest({bookName: keyword}, true);
        if (flag ) {
            if (flag.length) {
                this.setPageStatus()
            } else {
                this.setPageStatus('empty');
            }
        }  else {
            this.setPageStatus('error');
        }
	}

    mounted() {
        const fc_history_keys = Storage.getLocalStorage("fc_history_keys");
        if (fc_history_keys && fc_history_keys.length) this.historyOptions = fc_history_keys;
        const query = this.$route.query;
        if (query && query.word) {
            this.handlerItem(query.word)
        }
    }
}
</script>

<style scoped lang="less">
    .search-input {
        padding: 0;
        /deep/ .van-search__content {
            background-color: @white;
        }
        /deep/ .van-field__left-icon{
            margin-top: -2px;
        }
    }
    .navbar__search {
        /deep/ .navbar__rt {
            width: 32px;
        }
    }
    .navbar__search-text {
        width: 100%;
        height: 100px;
        color: @primary-color;
        font-size: @text-size5;
        text-align: center;
        line-height: 100px;
    }
	.book__search {
		padding: 20px;
		min-height: 100%;
		box-sizing: border-box;
        position: relative;
        background-color: @white;
        border-radius: 16px;
	}

    .search__pane {
        position: fixed;
        left: 0;
        right: 0;
        top: 100px;
        bottom: 0;
        border-radius: 16px 16px 0px 0px;
        padding: 32px 24px;
        background-color: @white;
        z-index: 3;
        .session {
            position: relative;
            &__title {
                font-size: @text-size6;
                color: @text-color1;
                font-weight: 500;
            }
                
        }
        .content {
            display: flex;
            flex-wrap: wrap;
            &__item {
                padding: 14px 20px;
                background-color: @bg-color;
                font-size: @text-size3;
                color: @text-color3;
                margin-top: 20px;
                margin-right: 20px;
                border-radius: 30px;
                &.first {
                    color: @caveat-color;
                    background-color: #FFEEEE;
                }
                &.second {
                    color: @prominent-color;
                    background-color: #FFEFE7;
                }
                &.third {
                    color: @minor-color;
                    background-color: #FFF3E0;
                }
            }
        }
        &-history {
            .session {
                display: flex;
                justify-content: space-between;
            }
        }

    }
</style>
