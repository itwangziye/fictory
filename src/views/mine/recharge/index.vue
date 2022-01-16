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
                <van-button :class="['button']"  round block type="warning">确定购买</van-button>
             </div>

            <div class="recharge__content-title">充值说明</div>

            <div class="recharge__content-ruler">
                <div class="ruler__text">
                    这是后台配置的规则
                </div>
            </div>


         </div>
    </div>
  </pagecontain>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import pagecontain from "@/components/pagecontain.vue";
import { Storage } from "@/utils/storage";
import { mapGetters } from "vuex";
import PageMixins from "@/mixins/page-mixins";
import api from '@/api/mine';

@Component({
  components: {
    pagecontain,
  }
})
export default class Recharge extends Mixins(PageMixins) {

    rechargeTemplate: any = [];
    rechargeDetail: any = {};
    activeId: number = 0;

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

    handleChargeItem(item: any) {
        this.activeId = item.rechargeTemplateId;
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
