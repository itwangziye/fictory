<template>
  <pagecontain :loading="pageLoading" :error="pageError">
    <div class="mine">
		<div class="mine__main" @click="handerUserInfo">
			<van-image
				class="img"
				width="100"
				height="100"
				:src="userInfo.headImageUrl"
			>
				<template v-slot:error>
					<div class="default__icon img"></div>
				</template>
			</van-image>
			<template v-if="isLogin">
				<div class="name__warp">
					<span class="name">{{ userInfo.userName }}</span>
					<span :class="['iconfont', {vip: isVip}]"></span>
				</div>
				<div class="id">id: {{ userInfo.userId }}</div>
			</template>
			<template v-else>
				<div class="name">{{ $t("page.mine.login") }}</div>
			</template>
		</div>

		<div class="mine__session">
			<div class="mine__session-item">
				<div>{{rechargeDetail ? rechargeDetail.bookCoins : 0}}</div>
				<div class="lable">书币</div>
			</div>
		</div>

		<div class="mine__info" v-if="isLogin">
			<div class="mine__info-lt">
				<div>{{isVip? `${rechargeDetail.accountTypeText} ${rechargeDetail.timeVip}到期`: '开通VIP会员'}}</div>
				<div class="tip">畅享全网所有精彩内容</div>
			</div>
			<div class="mine__info-rt">
				<van-button @click="handlerRecharge" class="button"  round block size="small">{{isVip ? '立即续费': '立即开通'}}</van-button>
			</div>
		</div>

		<div class="mine__cell">
			<van-cell
				v-for="(item, index) in cellOptions"
				:key="index"
				is-link
				:url="item.url"
			>
				<template #title>
					<div class="custom">
						<van-icon class="custom-icon" :name="item.icon" />
						<span class="custom-title">{{ item.label }}</span>
					</div>
				</template>
			</van-cell>
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
  },
  computed: {
    ...mapGetters({
      userInfo: "home/userInfo",
    }),
  },
})
export default class Mine extends Mixins(PageMixins) {
  cellOptions: any[] = [
    { label: "书币充值", url: "/mine/recharge", icon: "points" },
    { label: this.$t("page.mine.record"), url: "/order", icon: "orders-o" },
    { label: this.$t("page.mine.user"), url: "/user", icon: "user-o" },
    {
      label: this.$t("page.mine.account_save"),
      url: "/user/modify",
      icon: "setting-o",
    },
  ];
  rechargeDetail: any = null;

  get isVip() :boolean{
	  const {rechargeDetail} = this;
	  if (rechargeDetail && rechargeDetail.accountType !== 1) {
		  return true;
	  }
	  return false;
  }

  handlerRecharge() :void {
	  this.$router.push({name: 'Recharge'})
  }

  async accountGetDetailReq(parmas: any) {
        const data = await api.accountGetDetail.exec(parmas) 
        this.rechargeDetail = data;
    }

  async init() {
    const token = Storage.getLocalStorage("fc_token");
    if (!token) return;
    this.pageLoading = true;
    await this.$store.dispatch("home/getUserInfo");
	await this.accountGetDetailReq({});
    this.pageLoading = false;
  }

  handerUserInfo(): void {
    const isLogin = this.isLogin;
    if (!isLogin) {
      this.$router.push({ name: "Login" });
    } else {
      this.$router.push({ name: "User" });
    }
  }

  created() {
    this.init();
  }
}
</script>

<style scoped lang="less">
.mine {
	&__main {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 500px;
		background-image: url("http://lckb1.oss-cn-hongkong.aliyuncs.com/20220124/1485602992102182912.png");
		background-size: 100% 100%;
		background-repeat: no-repeat;
		.img {
			border-radius: 50%;
			overflow: hidden;
		}
		.default__icon {
			background-image: url("../../assets/mine/avater__bg.png");
			background-size: 100%;
			width: 100%;
			height: 100%;
		}
		.name__warp {
			display: flex;
			align-items: center;
			.iconfont {
				display: inline-block;
				background-image: url("../../assets/mine/vip_2.png");
				background-size: 100%;
				width: 40px;
				height: 40px;
				margin-left: 10px;
				&.vip {
					background-image: url("../../assets/mine/vip_1.png");
				}
			}
		}
		.name {
			color: @white;
			font-size: @text-size6;
			padding: 20px 0;
		}
		.id {
			color: @text-color5;
			size: @text-size5;
		}
	}

	&__session {
		padding: 24px 24px 0;
		&-item {
			width: 100px;
			height: 100px;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			font-size: @text-size5;
			color: @text-color1;
			.lable {
				color: @text-color4;
				padding-top: 20px;
			}
		}
	}

	&__info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 20px 24px 30px;
		padding: 24px;
		background-color: @minor-color-plain;
		border-radius: 16px;
		&-lt {
			font-size: @text-size5;
			color: @text-color3;
			.tip {
				font-size: @text-size3;
				padding-top: 20px;
			}
		}
		&-rt {
			.button {
				background-color: #b77355;
				color: @white;
				font-size: @text-size5;
			}
		}
	}

	&__cell {
		.custom {
			display: flex;
			align-items: center;
			font-size: @text-size5;
		}
		.custom-icon {
			font-size: @text-size8;
			color: @primary-color;
		}
		.custom-title {
			display: inline-block;
			padding-left: 12px;
			color: @text-color2;
		}
	}
}
</style>
