<template>
  <pagecontain>
    <div class="mine">
      <div class="mine__main" @click="handerUserInfo">
        <van-image
          class="img"
          width="100"
          height="100"
          src="https://img01.yzcdn.cn/vant/cat.jpeg"
        />
		<template v-if="!isLogin" >
			<div class="name">书友123456</div>
        	<div class="id">id: 33433</div>
		</template>
		<template v-else>
			<div class="name">请登录</div>
		</template>
        
      </div>

      <div class="mine__cell">
        <van-cell v-for="(item, index) in cellOptions" :key="index" is-link>
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
    { label: "购买记录", url: "", icon: "orders-o" },
    { label: "个人资料", url: "", icon: "user-o" },
    { label: "账户安全", url: "", icon: "setting-o" },
  ];

  async init() {
    const token = Storage.getLocalStorage("fc_token");
    if (!token) return;
    await this.$store.dispatch("home/getUserInfo");
  }

  handerUserInfo() :void{
	  const isLogin = this.isLogin;
	  if (!isLogin) {
		  this.$router.push({name: 'Login'})
	  } else {
		  this.$router.push({name: 'UserInfo'})
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
    background-image: url("../../assets/mine/mine__bg.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    .img {
      border-radius: 50%;
      overflow: hidden;
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
  &__cell {
    .custom {
      display: flex;
      align-items: center;
      font-size: @text-size5;
    }
    .custom-icon {
      font-size: @text-size5;
    }
    .custom-title {
      display: inline-block;
      padding-left: 12px;
    }
  }
}
</style>
