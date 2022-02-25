<template>
    <div class="book click-list" @click="handlerBookDetail">
        <div class="book-lt">
            <van-image lazy-load fit="cover" :src="opt.goodsImageUrl" class="img">
                <template v-slot:loading>
                    <van-loading type="spinner" size="20" />
                </template>
            </van-image>
        </div>
        <div class="book-rt">
            <div class="title">
                <span class="name">{{opt.goodsName}}</span> 
                <span class="price">{{opt.bookCoins}}{{$t('common.coin')}}</span>
            </div>
            <div class="book-session">
                <div class="author">
                    <span class="lable">{{$t('page.order.pay__content')}}：</span>
                    <span>{{opt.payContent}}</span>
                </div>
                <div>
                    <span class="lable">{{$t('page.order.order__no')}}：</span>
                    <span>{{opt.orderId}}</span>
                </div>
                <div>
                    <span class="lable">{{$t('page.order.buy__time')}}：</span>
                    <span>{{opt.timePay}}</span>
                </div>
            </div>
        </div>
    </div>
    
</template>

<script lang="ts">
import { Component, Vue, Prop} from 'vue-property-decorator';

@Component
export default class BookTemp extends Vue {

    @Prop() opt?: any;


    handlerBookDetail() :void{
        const {parentGoodsId} = this.opt;
        this.$router.push({name: 'Book', query: {bookId: parentGoodsId}})
    }
}
</script>

<style scoped lang="less">
    .book{
        display: flex;
        padding: 24px;
        background-color: @white;
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
            .book-session {
                padding: 12px 0 8px;
                color: @text-color3;
                line-height: 40px;
            }
            .title {
                color: @text-color1;
                font-size: @text-size5;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .name {
                    flex: 1;
                }
                .price {
                    color: @caveat-color;
                    display: inline-block;
                    width: 200px;
                }
            }
        }
    }
</style>
