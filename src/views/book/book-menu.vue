<template>
    <pagecontain>
        <template slot="header">
            <book-header
            :title="$t('page.book_menu.title')"
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
            <div class="book__menu">
                <van-cell 
                title-class="book__menu-title"
                :title="item.bookChapterName" 
                clickable
                @click="handleBookCell(item, index)"
                v-for="(item, index) in list" 
                :key="index">
                    <template #right-icon v-if="!item.isUnLock && !item.isFree">
                        <van-icon name="lock" class="book__lock"/>
                    </template>
                </van-cell>
            </div>
        </van-list>
    </pagecontain>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import pagecontain from '@/components/pagecontain.vue';
import PageMixins from '@/mixins/page-mixins';
import api from '@/api/book';
import BookHeader from '@/components/business-component/book/book-header.vue';

@Component({
    components: {
        pagecontain,
        BookHeader
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
    bookId: number = 0;

    handleBookCell(item: any, index: any) :void {
        const chapterIndex = index + 1;
        const {bookChapterId, isFree, isUnLock} = item;
        const query: any = this.$route.query;
        const {bookId} = query;
        if (!isUnLock && !isFree) {
            this.$router.push({name: 'BookOrder', query: {bookId, bookChapterId}})
        } else {
            this.$router.push({name: 'BookCell', query: {bookId, chapterIndex}})
        }
    }

    onLoad() :void{
        let {pageIndex} = this.pagination;
        pageIndex = ++pageIndex;
        console.log(pageIndex);
        const bookId = this.bookId;
        this.bookChapterGetListRequest({...this.pagination, pageIndex, bookId})
    }

    init() :void {
        const query: any = this.$route.query;
        const {bookId} = query;
        if (!bookId) return;
        this.bookId = bookId;
        const parmas: any = {
            ...this.pagination,
            bookId
        };
        this.bookChapterGetListRequest(parmas);
    }

    async bookChapterGetListRequest(parmas: any) {
        try {
            this.loading = true;
            const {resultList, pageIndex, pageSize, totalCount, totalPage} = await api.bookChapterGetList.exec(parmas)
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
