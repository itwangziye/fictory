<template>
    <pagecontain>
        <template slot="header">
            <book-header
            v-if="bookDetail"
            :title="bookDetail.bookName"
            ></book-header>
        </template>
        <div class="book" v-if="bookDetail">
            <div class="book__header">
                <div class="book__session">
                    <div class="book__session-lt">
                        <van-image lazy-load fit="cover" v-if="bookDetail.bookImageUrl" :src="bookDetail.bookImageUrl" class="img">
                            <template v-slot:loading>
                                <van-loading type="spinner" size="20" />
                            </template>
                        </van-image>
                    </div>
                    <div class="book__session-rt">
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
                    <van-button type="danger"  class="button" @click="startRead" size="small">立即观看</van-button>
                    <van-button type="danger" size="small" plain  class="button" :disabled="isCollect" @click="handlerCollect">{{isCollect? '已收藏': '收藏'}}</van-button>
                </div>
                <van-divider />
                <div class="book__header-dec">
                    {{bookDetail.introduction}}
                </div>
            </div>

            <div class="pane">
                <div class="pane__title">
                    <div class="title">目录</div>
                    <div class="session click-list" @click="handerBookMenu">
                        <span>共{{bookDetail.totalChapterCount}}章</span>
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
                        @click="handleBookDetail(index)" 
                        :key="index">
                            <template #right-icon v-if="!item.isUnLock && !item.isFree">
                                <van-icon name="lock" class="book__lock"/>
                            </template>
                        </van-cell>
                        <div class="book__menu-operate">
                            <van-button @click="handerBookMenu" type="warning" round plain  class="button">全部打开</van-button>
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

    bookDetail: any = null;

    get isCollect() :boolean {
        const bookDetail = this.bookDetail;
        if (!bookDetail) return false;
        const {isCollect} = bookDetail;
        if (isCollect) return true;
        return false;
    }

    get footerText() :string {
        const bookDetail = this.bookDetail;
        if (bookDetail && !bookDetail.bookPrice) {
            return '立即观看'
        }

        return '立即购买'
    }


    startRead() {
        const {bookId} = this.bookDetail;
        this.$router.push({name: 'BookCell', query: {bookId, chapterIndex: '1'}})
    }

    handlerToBuy() {
        const bookDetail = this.bookDetail;
        if (bookDetail && !bookDetail.bookPrice) {
            this.startRead();
        } else {
            console.log('点击购买');
        }
    }
    

    handlerCollect() :void {
        const isCollect = this.isCollect;
        const {bookId} = this.bookDetail;
        if (!isCollect) {
            this.bookCollectAddReq({bookId})
        }
    }

    handerBookMenu() :void {
        const {bookId} = this.bookDetail;
        this.$router.push({name: 'BookMenu', query: {bookId}})
    }
    handleBookDetail(index: any) :void {
        const chapterIndex = index + 1;
        const {bookId} = this.bookDetail;
        this.$router.push({name: 'BookCell', query: {bookId, chapterIndex}})
    }

    init() {
        const query = this.$route.query;
        if (query && query.bookId) {
            this.bookGetDetailReq({bookId: query.bookId})
        }
    }

    async bookGetDetailReq(parmas: any) {
        try {
           const data = await api.bookGetDetail.exec(parmas) 
           this.bookDetail = data;
        } catch (error) {
            console.log(error)
        }
    }

    async bookCollectAddReq(parmas: any) {
        try {
           await api.bookCollectAdd.exec(parmas);
           this.$toast('加入书架成功');
           this.bookDetail.isCollect = 1;
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
    .book__session{
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
