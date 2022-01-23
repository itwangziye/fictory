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
            <div class="category__session" v-if="query.type === 'category'">
                <ul class="session__class" >
                    <li @click="handlerSessionClass(index, 'category')" :class="['session__cell click-list', {active: categoryOption.classIndex === index}]" v-for="(item, index) in categoryOption.classData" :key="index">{{item.bookTypeName}}</li>
                </ul>
                <ul class="session__state">
                    <li class="session__cell" @click="handlerSessionClass(index, 'state')" :class="['session__cell click-list', {active: categoryOption.stateIndex === index}]" v-for="(item, index) in categoryOption.stateData" :key="index">
                        {{item.name}}
                    </li>
                </ul>
            </div>
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
import homeApi from "@/api/home";


@Component({
    components: {
        BookTemp,
        pagecontain
    }
})
export default class HomeCategory extends Mixins(PageMixins) {
    
    loading: boolean = true;
    finished: boolean = false;
    error: boolean = false;
    pagination: any = {
        pageIndex: 1,
        pageSize: 10
    }
    list: any[] = [];
    pageTitle: string = '分类';
    query: any = {};
    categoryOption: any = {
        classIndex: 0,
        classData: [],
        stateIndex: 0,
        stateData: [{name: '全部', id: -1}, {name: '连载', id: 1}, {name: '完结', id: 0}]
    }

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

    getSessionClassParmas() :any{
        const {classIndex, classData, stateIndex, stateData} = this.categoryOption;
        const {bookTypeId} = classData[classIndex];
        const {id} = stateData[stateIndex];
        const target: any = {};
        if (classIndex) target.smallTypeId = bookTypeId;
        if (stateIndex) target.isContinue = id;
        this.pagination = {
            pageIndex: 1,
            pageSize: 10
        }
        return {...target, ...this.pagination};
    }

    handlerSessionClass(index: number, type?: string) :void{
        if (type === 'category') {
            const {classIndex} = this.categoryOption;
            if (classIndex === index) return;
            this.categoryOption.classIndex = index;
        } else {
            const {stateIndex} = this.categoryOption;
            if (stateIndex === index) return;
            this.categoryOption.stateIndex = index;
        }
        const parmas = this.getSessionClassParmas();
        this.bookGetListRequest(parmas, 'reflash')
    }

    async bookGetListRequest(parmas: any, reflash: string) {
        try {
            this.loading = true;
            const {resultList, pageIndex, pageSize, totalCount, totalPage} = await api.bookGetList.exec(parmas);
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

    async bookTypeGetListReq() {
        try {
           const data = await homeApi.bookTypeGetList.exec({}) 
           this.categoryOption.classData = [{bookTypeName: '全部', bookTypeId: -1}, ...data];
        } catch (error) {
            console.log(error)
        }
    }

    async initPage() {
        const {query} = (this as any).$route;
        this.query = query;
        if (query && query.title) {
            this.pageTitle = query.title;
        }
        if (query && query.type === 'category') {
            this.bookTypeGetListReq();
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
    .category__session {
        background-color: @white;
        padding: 24px;
        .session__class, .session__state{
            display: flex;
            flex-wrap: wrap;
        }
        .session__state {
            padding-top: 24px;
            border-top: 1px solid @dividing;
            border-bottom: 1px solid @dividing;
        }
        .session__cell {
            height: 64px;
            width: 148px;
            line-height: 64px;
            text-align: center;
            background-color: @bg-color;
            border-radius: 32px;
            margin-bottom: 24px;
            margin-right: 30px;
            &:nth-child(4n + 4) {
                margin-right: 0;
            }
            font-size: @text-size5;
            color: @text-color1;
            &.active {
                color: @primary-color;
                background-color: @minor-color-plain;
            }
        }
    }
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
