<template>
    <div class="pane">
        <div class="pane__title">{{$t('page.home.recommend')}}</div>
        <div class="pane__content">
            <van-list
            v-model="loading"
            :error.sync="error"
            :finished="finished"
            finished-text="没有更多了"
            error-text="请求失败，点击重新加载"
            @load="onLoad"
            >
                <div class="falls-list">
                    <book-temp 
                    :opt="item"
                    v-for="(item, index) in list" 
                    :key="index"
                    >
                    </book-temp>
                </div>
            </van-list>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import BookTemp from '@/components/book-temp.vue';
import api from '@/api/book';

@Component({
    components: {
        BookTemp
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
    list: any[] = []

    onLoad() :void{
        let {pageIndex} = this.pagination;
        pageIndex = ++pageIndex;
        console.log(pageIndex)
        this.bookGetListRequest({...this.pagination, pageIndex})
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
</style>
