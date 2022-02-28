<template>
    <pagecontain
    :loading="pageLoading"
    :error="pageError"
    @on-retry="init"
    >
        <template slot="header">
            <van-nav-bar
            :title="$t('page.book_order.title')"
            left-arrow
            @click-left="onClickLeft"
            >
            </van-nav-bar>
        </template>
        <div class="order">
            <div class="order__tip">{{$t("page.book_order.tip")}}</div>
            <div class="order__pane">
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
                        <div class="content">
                            <div class="lebel">{{$t("page.book_order.buy_label")}}</div>
                            <div>{{bookDetail.payContent}}</div>
                        </div>
                    </div>
                </div>
                <van-divider />

                <div class="order__content">
                    <div class="label">{{$t("page.book_order.price_label")}}：</div>
                    <div class="price">
                        {{bookDetail.bookPrice}}{{$t('common.coin')}}
                    </div>
                </div>
            </div>
            
             <van-button :loading="payLoading" type="danger" round block  class="order__button" @click="handerToBuy" >{{$t('page.book_order.buy_text')}}</van-button>
             <div class="order__footer">
                 {{$t("page.book_order.buy_dec")}}
             </div>
        </div>
    </pagecontain>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import pagecontain from '@/components/pagecontain.vue'
import api from '@/api/book';
import PageMixins from '@/mixins/page-mixins';
import apiOrder from '@/api/order';
import { mapGetters } from 'vuex';

@Component({
    components: {
        pagecontain
    },
    computed: {
        ...mapGetters({
            'currencyOptions': 'metadata/currencyOptions',
            'userNomalConfig': 'metadata/userNomalConfig',
        })
    }
})
export default class BookOrder extends Mixins(PageMixins) {
    bookDetail: any = {}
    payLoading: boolean = false;
    query: any = null;
    currencyVisible: boolean = false;
    payTypeOption: any = {
        visible: false,
        data: []
    }

    get isAllMenu() :boolean {
        const query = this.query;
        if (!query) return false;
        const {bookChapterId, bookId} = query;
        if (!bookChapterId) return true;
        return false;
    }

    handerToBuy() :void {
        if (!this.isLogin) {
            const redirect = this.$route.fullPath;
            this.$router.push({name: 'Login', query: {redirect}});
            return;
        };
        this.createOrder();
    }

    createOrder() {
        const query = this.$route.query;
        const {bookId, bookChapterId} = query;
        const parmas = {
            goodsId: bookChapterId || bookId,
        }
        this.orderAddReq(parmas)
    }

    onClickRight() {
        this.currencyVisible = true;
    }


 
    init() {
        const query = this.$route.query;
        this.query = query;
        const {bookId, bookChapterId} = query;
        if (bookId && bookChapterId) {
            this.bookGetDetailReq({bookChapterId})
        } else if (bookId) {
            this.bookGetDetailReq({bookId})
        }
    }


    async orderAddReq(parmas: any) {
        try {
            this.payLoading = true;
           const {data} = await apiOrder.orderAdd.exec(parmas);
            this.$toast(`${this.$t('page.book_order.pay_success_text')}`)
            this.$router.back();
           this.payLoading = false;
        } catch (error) {
            console.log(error)
            this.payLoading = false;
        }
    }

    async bookGetDetailReq(parmas: any) {
        try {
            this.setPageStatus('loading');
           const data = await api.bookGetPrice.exec(parmas) 
           this.bookDetail = data;
           this.setPageStatus();
        } catch (error) {
            this.setPageStatus('error');
            console.log(error)
        }
    }

    created() {
        this.init();
    }
}
</script>

<style lang="less" scoped>
    .order {

        &__tip {
            color: @text-color4;
            font-size: @text-size5;
            text-align: center;
            padding: 50px;
        }

        &__pane {
            background-color: rgba(240, 234, 231, 1);
            margin: 0 40px;
            border-radius: 8px 8px 0 0;
            padding: 48px;
            .book__sessions{
                display: flex;
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
                    padding-left: 24px;
                    .title {
                        color: @text-color1;
                        font-size: @text-size6;
                    }
                    .content {
                        font-size: @text-size5;
                        color: @text-color3;
                        line-height: 40px;
                        padding-top: 24px;
                    }
                }
            }

            .order__content {
                text-align: center;
                .label {
                    font-size: @text-size5;
                    color: @primary-color;
                }
                .price {
                    font-size: @text-size9;
                    color: @caveat-color;
                    padding-top: 40px;
                }
            }
        }

        .pay__mode{
            box-sizing: border-box;
            background: @bg-color;
            min-height: 46%;
            &-warp {
                display: flex;
                flex-direction: column;
                height: 100%;
            }
            &-title{
                width: 100%;
                height: 100px;
                background: @white;
                line-height: 100px;
                text-align: center;
                font-size: @text-size7;
                font-weight: 500;
            }
            // &-close{
            //     position: absolute;
            //     right: 32px;
            //     top: 32px;
            //     width: 38px;
            //     height: 38px;
            //     background-image: url('../../../assets/coupons/close.png');
            //     background-size: 100%;
            // }
            &-main{
                margin: 20px 24px 0 24px;
                background: @white;
                border-radius: 16px;
                overflow: scroll;
                flex: 1;
            }
            &-item{
                position: relative;
                // padding: 33px 24px;
                padding-left: 34px;
                height: 130px;
                border-bottom: 1px solid #EEE;
                font-size: @text-size6;
                display: flex;
                align-items: center;
                .img{
                    margin-right: 20px;
                    width: 160px;
                    max-height: 90px;
                    vertical-align: middle;
                }
                @{deep} .van-radio__icon{
                    position: absolute;
                    width: 40px;
                    height: 40px;
                    top: 50%;
                    right: 20px;
                    transform: translate(-50%, -50%);
                }
            }

            &-list {
                display: flex;
                align-items: center;
                .title {
                    font-size: @text-size6;
                    color: @text-color1;
                }
                .dec {
                    font-size: @text-size4;
                    color: @text-color3;
                }
            }
        }

        &__button {
            width: 380px;
            height: 80px;
            margin: 40px auto 0;
        }

        &__footer {
            font-size: @text-size4;
            text-align: center;
            color: @text-color4;
            padding-top: 200px;
        }
    }
</style>
