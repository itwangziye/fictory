<template>
    <pagecontain
    :loading="pageLoading"
    :error="pageError"
    @on-retry="init"
    >
        <template slot="header">
            <book-header
            v-if="bookDetail"
            :title="bookDetail.bookName"
            ></book-header>
        </template>
        <div class="book">
            <div class="book__header">
                <div class="book__sessions">
                    <div class="book__sessions-lt">
                        <van-image lazy-load fit="cover"   :src="bookDetail.bookImageUrl" class="img">
                            <template v-slot:loading>
                                <van-loading type="spinner" size="20" />
                            </template>
                        </van-image>
                    </div>
                    <div class="book__sessions-rt">
                        <div class="title">{{bookDetail.bookName}}</div>
                        <div class="author">
                            <van-icon name="user-o" />
                            <span>{{bookDetail.authorName}}</span>
                        </div>
                        <div class="tag">
                            <van-tag class="tag__item" plain type="warning">{{bookDetail.bookTypeName}}</van-tag>
                            <van-tag class="tag__item" plain type="primary">{{bookDetail.bookStateText}}</van-tag>
                            <!-- <van-tag color="#7232dd" plain>标签</van-tag> -->
                        </div>
                    </div>
                </div>

                <div class="book__header-oprate">
                    <van-button type="danger"  class="button" @click="handlerToBuy" size="small">{{footerText}}</van-button>
                    <van-button type="danger" size="small" plain  class="button"  @click="handlerCollect">{{isCollect? $t('page.book.un_collect'): $t('page.book.collect')}}</van-button>
                </div>

                <van-divider />
                <div class="book__header-dec">
                    {{bookDetail.introduction}}
                </div>
            </div>
            <div class="pane">
                <div class="pane__title">
                    <div class="title">{{$t('page.book.menu')}}</div>
                    <div class="session click-list" @click="handerBookMenu">
                        <span>{{$t('page.book.more')}}</span>
                        <van-icon name="arrow" />
                    </div>
                </div>
                <div class="pane__content">
                    <div class="book__menu">
                        <van-cell 
                        title-class="book__menu-title"
                        :title="item.bookChapterName" 
                        clickable
                        v-for="(item, index) in bookDetail.chapterList"
                        @click="handleBookDetail(item, index)" 
                        :key="index">
                            <template #right-icon v-if="!item.isUnLock && !item.isFree">
                                <van-icon name="lock" class="book__lock"/>
                            </template>
                        </van-cell>
                        <div class="book__menu-operate">
                            <van-button @click="handerBookMenu" type="warning" round plain  class="button">{{$t('page.book.open')}}</van-button>
                        </div>
                    </div>
                </div>
            </div>  
        </div>

        <template slot="footer">
            <van-button block class="book__buy" type="danger" @click="handlerToBuy">{{footerText}}</van-button>
        </template>
    </pagecontain>    
</template>

<script lang="ts">
import { Component, Mixins} from 'vue-property-decorator';
import api from '@/api/book';
import pagecontain from '@/components/pagecontain.vue'
import PageMixins from '@/mixins/page-mixins'
import BookHeader from '@/components/business-component/book/book-header.vue';

@Component({
    components: {
        pagecontain,
        BookHeader
    }
})
export default class Book extends Mixins(PageMixins) {

    bookDetail: any = {};

    get isCollect() :boolean {
        const bookDetail = this.bookDetail;
        if (!bookDetail) return false;
        const {isCollect} = bookDetail;
        if (isCollect) return true;
        return false;
    }

    get footerText() :any {
        const bookDetail = this.bookDetail;
        if (bookDetail && bookDetail.isUnLock) {
            return this.$t('page.book.watch')
        }
        return this.$t('page.book.buy')
    }


    startRead() {
        const {bookId} = this.bookDetail;
        this.$router.push({name: 'BookCell', query: {bookId, chapterIndex: '1'}})
    }

    handlerToBuy() {
        const bookDetail = this.bookDetail;
        if (bookDetail && bookDetail.isUnLock) {
            this.startRead();
        } else {
            const {bookId} = bookDetail;
            this.$router.push({name: 'BookOrder', query: {bookId}})
        }
    }
    

    handlerCollect() :void {
        const isCollect = this.isCollect;
        const {bookId} = this.bookDetail;
        if (!isCollect) {
            this.bookCollectAddReq({bookId})
        } else {
            this.bookCollectRemoveReq({bookId})
        }
    }

    handerBookMenu() :void {
        const {bookId} = this.bookDetail;
        this.$router.push({name: 'BookMenu', query: {bookId}})
    }
    handleBookDetail(item: any, index: any) :void {
        const chapterIndex = index + 1;
        const {bookChapterId, isFree, isUnLock} = item;
        if (!isUnLock && !isFree) {
            const {bookId} = this.bookDetail;
            this.$router.push({name: 'BookOrder', query: {bookId, bookChapterId}})
        } else {
            const {bookId} = this.bookDetail;
            this.$router.push({name: 'BookCell', query: {bookId, chapterIndex}})
        }
    }

    init() {
        const query = this.$route.query;
        if (query && query.bookId) {
            this.bookGetDetailReq({bookId: query.bookId})
        }
    }

    async bookGetDetailReq(parmas: any) {
        try {
            this.setPageStatus('loading');
           const data = await api.bookGetDetail.exec(parmas) 
           this.bookDetail = data;
           this.setPageStatus();
        } catch (error) {
            this.setPageStatus('error');
            console.log(error)
        }
    }

    async bookCollectAddReq(parmas: any) {
        try {
           await api.bookCollectAdd.exec(parmas);
           this.$toast('收藏成功');
           this.bookDetail.isCollect = 1;
        } catch (error) {
            console.log(error)
        }
    }

    async bookCollectRemoveReq(parmas: any) {
        try {
           await api.bookCollectRemove.exec(parmas);
           this.$toast('取消收藏');
           this.bookDetail.isCollect = 0;
        } catch (error) {
            console.log(error)
        }
    }
    


    created() {
        this.init();
    }
}
</script>

<style scoped lang="less">
    .pane {
        margin-top: 24px;
        background-color: @white;
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
            .session {
                display: flex;
                align-items: center;
                color: @text-color4;
            }
            
        }
    }
    

    .book__header {
        background-color: @white;
        
        &-oprate {
            padding: 24px;
            padding-bottom: 0;
            display: flex;
            justify-content: space-between;
            .button {
                width: 300px;
            }
        }
        &-dec {
            padding:24px;
            padding-top: 0;
            line-height: 34px;
            color: @text-color4;
        }
    }

    .book__sessions{
        display: flex;
        padding: 24px;
        &-lt {
            .img {
                width: 120px;
                height: 160px;
                &::after{
                    position: absolute;
                    left: 0;
                    top: 0;
                    content: ' ';
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.02);
                }
            }
        }
        &-rt {
            flex: 1;
            padding-left: 20px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .author {
                color: @text-color3;
                display: flex;
                align-items: center;
            }
            .tag__item {
                margin-right: 20px;
            }
            .title {
                color: @text-color1;
                font-size: @text-size5;
            }
        }
    }

    .book__menu {
        /deep/ .van-cell {
            padding-left: 0;
            padding-right: 0;
        }
        &-title {
            color: @text-color3;
        }
        &-operate {
            text-align: center;
            padding: 24px;
        }
    }





</style>
