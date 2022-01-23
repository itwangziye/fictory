<template>
  <pagecontain
  :loading="pageLoading"
  :error="pageError"
  >
    <template slot="header">
        <van-nav-bar
        title="充值"
        left-arrow
        @click-left="onClickLeft"
        />
    </template>
    <div class="recharge">
         <div class="recharge__info">
             <div>我的余额</div>
             <div v-if="rechargeDetail.timeVip">VIP有效期至：{{rechargeDetail.timeVip}}</div>
             <div><span class="num">{{rechargeDetail.bookCoins}}</span> 书币</div>
         </div>

         <div class="recharge__content">
             <div class="recharge__content-title">开通vip</div>
             <ul class="vip__list">
                 <li @click="handleChargeItem(item)" :class="['vip__item click-able', {active: activeId === item.rechargeTemplateId}]" v-for="(item, index) in listMap.vip" :key="index">
                     <div class="vip__item-title">{{item.rechargeTypeText}}</div>
                     <div class="vip__item-text">
                         <span class="num">{{item.price}}</span>
                         <span>元</span>
                     </div>
                 </li>
             </ul>
            <div class="recharge__content-title">书币充值</div>
            <ul class="vip__list">
                 <li @click="handleChargeItem(item)" :class="['vip__item click-able', {active: activeId === item.rechargeTemplateId}]" v-for="(item, index) in listMap.corn" :key="index">
                     <div class="vip__item-text">
                         <span class="num">{{item.price}}</span>
                         <span>元</span>
                     </div>
                     <div class="corn__item-info">
                         {{item.templateName}}
                     </div>
                 </li>
             </ul>

            <div class="recharge__button">
                <van-button :class="['button']" :loading="loading" loading-text="正在提交···" round block type="warning" @click="handerToBuy">确定购买</van-button>
             </div>

            <div class="recharge__content-title">充值说明</div>

            <div class="recharge__content-ruler">
                <div class="ruler__text">
                    这是后台配置的规则
                </div>
            </div>


         </div>

         <!-- 支付方式选择 -->
        <van-popup 
            v-model="payTypeOption.visible" 
            position="bottom"
            class="pay__mode"
        >
            <div class="pay__mode-warp">
                <div class="pay__mode-title">选择支付方式</div>
                <div class="pay__mode-close" @click="payTypeOption.visible = false"></div>
                <ul class="pay__mode-main">
                    <van-radio-group v-model="payTypeId" @change="onPayTypePickConfirm">
                        <li class="pay__mode-item" v-for="(item) in payTypeOption.data" :key="item.payTypeId">
                            <van-radio 
                            :name="item.payTypeId" 
                            checked-color="#3276ff"
                            >
                                <div class="pay__mode-list">
                                    <van-image lazy-load fit="cover" :src="item.bigImageUrl" class="img">
                                        <template v-slot:loading>
                                            <van-loading type="spinner" size="20" />
                                        </template>
                                    </van-image>
                                    <div>
                                        <span class="title">{{item.payTypeName}}</span> 
                                        <div class="dec">{{item.payTypeText}}</div>
                                    </div>
                                </div>
                                
                            </van-radio>
                        </li>
                    </van-radio-group>
                </ul>
            </div>
        </van-popup>
    </div>
  </pagecontain>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import pagecontain from "@/components/pagecontain.vue";
import PageMixins from "@/mixins/page-mixins";
import api from '@/api/mine';
import orderApi from '@/api/order'

@Component({
  components: {
    pagecontain,
  }
})
export default class Recharge extends Mixins(PageMixins) {
    rechargeTemplate: any = [];
    rechargeDetail: any = {};
    activeId: number = 0;
    loading: boolean = false;
    payTypeOption: any = {
        visible: false,
        data: []
    }
    payTypeId: string = ''

    get listMap() :any {
        const {rechargeTemplate} = this;
        if (!rechargeTemplate || !rechargeTemplate.length) return {}
        const target: any = {
            corn: [],
            vip: []
        }
         rechargeTemplate.forEach((item: any) => {
             const {rechargeType} = item;
             if (rechargeType === 1) {
                 target.corn.push(item)
             } else {
                 target.vip.push(item)
             }
         });
         return target;
    }

    async bookGetDetailReq(parmas: any) {
        const data = await api.rechargeTemplateList.exec(parmas) 
        this.rechargeTemplate = data;        
    }

    async accountGetDetailReq(parmas: any) {
        const data = await api.accountGetDetail.exec(parmas) 
        this.rechargeDetail = data;
    }

    async rechargeRecordAddReq(parmas: any) {
        try {
            this.loading = true;
            const data = await orderApi.rechargeRecordAdd.exec(parmas);
            const {payUrl} = data;
            window.location.href = payUrl;
            this.loading = false;
        } catch (error) {
            this.loading = false;
            console.log(error)
        }
    }
    async payTypeGetListReq() {
        try {
            const res = await orderApi.payTypeGetList.exec({});
            this.payTypeOption.data = res;
            this.payTypeId = res[0].payTypeId;
        } catch (error) {
            console.log(error)
        }
    }

    handleChargeItem(item: any) {
        this.activeId = item.rechargeTemplateId;
    }

    // 选择支付方式
    onPayTypePickConfirm(id: String) :void {
        this.payTypeOption.visible = false;
        this.createOrder();
    }
    
    handerToBuy() :void {
        if (!this.isLogin) {
            const redirect = this.$route.fullPath;
            this.$router.push({name: 'Login', query: {redirect}});
            return;
        };
        if (!this.activeId) {
            this.$toast('请选择充值类型！')
            return;
        }
        if (this.payTypeOption.data.length > 1) {
            this.payTypeOption.visible = true;
        } else {
            this.createOrder();
        }
    }

    createOrder() {
        const {payTypeId, activeId: rechargeTemplateId} = this;
        const parmas = {
            rechargeTemplateId,
            payTypeId
        }
        this.rechargeRecordAddReq(parmas)
    }


    

    async init() {
        try {
            this.setPageStatus('loading');
            await this.bookGetDetailReq({});
            await this.accountGetDetailReq({})
            this.setPageStatus();
        } catch (error) {
            this.setPageStatus('error');
            console.log(error)
        }
    }

    created() {
        this.init();
        this.payTypeGetListReq();
    }
}
</script>

<style scoped lang="less">
.recharge {
    &__info {
        background-color: @primary-color;
        height: 170px;
        color: @white;
        margin: 24px;
        margin-bottom: 0;
        font-size: @text-size5;
        padding: 24px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        border-radius: 16px 16px 0 0;
        .num {
            font-size: 50px;
            font-weight: 600;
        }
    }

    &__content {
        padding: 0 24px 24px;
        background-color: @white;
        &-title {
            color: @text-color1;
            font-size: @text-size5;
            padding-top: 24px;
        }
        .vip__list {
            display: flex;
            flex-wrap: wrap;
            .vip__item {
                width: 220px;
                height: 160px;
                display: flex;
                justify-content: center;
                flex-direction: column;
                border: 1px solid @dividing;
                border-radius: 16px;
                margin-top: 20px;
                padding: 24px;
                font-size: @text-size5;
                &:nth-child(3n + 2) {
                    margin-left: 20px;
                    margin-right: 20px;
                } 
                &-title {
                    color: @primary-color;
                    padding-bottom: 20px;
                }
                &-text {
                    .num {
                        font-size: 56px;
                        font-weight: 600;
                        display: inline-block;
                        padding-right: 8px;
                    }
                }
                .corn__item-info {
                    padding-top: 20px;
                    color: @text-color4;
                }

                &.active {
                    border-color: @caveat-color;
                    background-color: @caveat-color-plain;
                    .vip__item-text {
                        color: @caveat-color;
                    }
                }
            }
        }

        .recharge__button {
            padding: 40px;
            padding-top: 60px;
            .button {
                background-color: @primary-color;
                font-size: @text-size6;
            }
        }

        &-ruler {
            .ruler__text {
                background-color: @bg-color;
                border-radius: 16px;
                min-height: 200px;
                margin-top: 20px;
                padding: 40px 20px;
                font-size: @text-size5;
            }
        }
        
    }

}
</style>
