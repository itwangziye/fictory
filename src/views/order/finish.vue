<template>
    <pagecontain
    :loading="pageLoading"
    :error="pageError"
    @on-retry="init"
    >
        <template v-slot:header>
            <nav-bar title="订单支付"
            :pageBack="onClickLeft"
            ></nav-bar>
        </template>
        <div class="goods">
            <div class="goods__status">
                <div class="goods__status-head">
                    <span :class="['icon', {error: !isSuccess}]"></span>
                    <span class="text" v-if="isSuccess">支付成功</span>
                    <div v-else class="info">
                        <p>订单确认中······</p> 
                        <p>支付结果可能会有延迟</p>
                    </div>
                </div>
                <div class="goods__status-operate">
                    <van-button @click="handlerCheckBill" class="button" round  type="info" >{{isSuccess ? '查看订单': '重新支付'}}</van-button>
                    <van-button @click="onClickLeft" class="button" round  plain type="info" >{{isSuccess? '返回首页': '已完成支付'}}</van-button>
                </div>                
            </div>          
        </div>
    </pagecontain>
</template>

<script lang="ts">
import { Component, Mixins} from 'vue-property-decorator';
import PageMixins from "@/mixins/page-mixins";
import pagecontain from '@/components/pagecontain.vue';
import orderApi from '@/api/order';
import NavBar from '@/components/nav-bar.vue';
import { mapGetters } from 'vuex';

@Component({
    name: 'GoodsPay',
    components: {
        pagecontain,
        NavBar
    }
})
export default class GoodsPay extends Mixins(PageMixins, StatisticsMixins) {

    billData: any = null;
    couponData: any[] = [];
    bannerOptions: any = {};
    pollingCount: number = 0;

    get isSuccess() :boolean{
        const billData = this.billData;
        if (billData) {
            const {orderState} = billData;
            if (orderState === 10) {
                return true;
            }
        }
        return false
    }



    onClickLeft() :void{
        this.$router.push({path: '/'});
    }

    junmpBillDetail() :void{
        const query: any = this.$route.query;
        this.$router.push({name: 'mine-order-list', params: {order_no: query.order_no, view: '11'}});
    }

    handlerCheckBill() :void {
        if (this.isSuccess) {
            
        } else {
            const billData = this.billData;
            const {payment_order_link} = billData;
            window.location.href = payment_order_link;
        }
        
    }

    async getUserOrderDetailRequest(parmas: any, polling: boolean = false) {
        if(!polling) this.setPageStatus('loading');
        try {
            const res = await orderApi.orderQueryState.exec(parmas);
            this.setPageStatus();
            this.billData = res;
            if (this.isSuccess) {
                
            } else {
                if (!polling) this.polling(parmas)
            }
        } catch (error) {
            console.log(error)
            if (error && error.code === 'interrupt') {
				return;
            }
            this.setPageStatus('error');
        }
    }


    polling(parmas: any) :void {
        const timeout = 2000;
        this.pollingCount++;
        const timeInter = setTimeout(async () => {
            await this.getUserOrderDetailRequest(parmas, true);
            clearTimeout(timeInter)
            if (!this.isSuccess && this.pollingCount < 4) {
                this.polling(parmas)
            }
        }, timeout);
    }

    init() :void{
        const query = this.$route.query;
        if (query.orderId) {
            this.getUserOrderDetailRequest({orderId: query.orderId});
        }
    }

    mounted() {
        this.init();
    }
}
</script>

<style scoped lang="less">
    .goods {
        display: flex;
        flex-direction: column;
        height: 100%;
        &__status {
            text-align: center;
            padding: 40px 0;
            &-head {
                padding-bottom: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                .icon {
                    display: inline-block;
                    width: 61px;
                    height: 61px;
                    background-image: url('../assets/goods/pay_success.png');
                    background-size: 100%;
                    margin-right: 20px;
                    &.error {
                        background-image: url('../assets/goods/pay_info.png');
                    }
                }
                .text {
                    font-size: @text-size7;
                    color: @text-color1;
                }
                .info {
                    text-align: left;
                    font-size: @text-size5;
                    color: @text-color1;
                    line-height: 44px;
                }
            }

            &-income {
                padding-bottom: 32px;
                font-size: @text-size5;
                color: @text-size1;
                .amount {
                    color: @caveat-color;
                    font-weight: 500;
                }
            }

            &-operate {
                .button {
                    width: 260px;
                    height: 74px;
                    line-height: 74px;
                    &:nth-child(1) {
                        margin-right: 24px;
                    }
                }
            }
        }        
    }

 
</style>
