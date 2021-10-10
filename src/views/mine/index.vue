<template>
	<pagecontain>
		<div class="mine">
			<div class="mine__main">
				<van-image
					width="100"
					height="100"
					src="https://img01.yzcdn.cn/vant/cat.jpeg"
				/>
				<div>书友123456</div>
				<div>id: 33433</div>
			</div>

		<div class="mine__cell">
			<van-cell v-for="(item, index) in cellOptions" :key="index" is-link  >
				<template #title>
					<div class="custom">
						<van-icon class="custom-icon" :name="item.icon" />
						<span class="custom-title">{{item.label}}</span>
					</div>
					
				</template>
			</van-cell>

		</div>
	</div>
	</pagecontain>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import pagecontain from "@/components/pagecontain.vue";

@Component({
  components: {
    pagecontain,
  },
})
export default class Mine extends Vue {
	cellOptions: any[] = [
		{label: '购买记录', url: '', icon: 'orders-o'},
		{label: '个人资料', url: '', icon: 'user-o'},
		{label: '账户安全', url: '', icon: 'setting-o'}
	]
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
	  background-image: url('../../assets/mine/mine__bg.png');
	  background-size: 100% 100%;
	  background-repeat: no-repeat;
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
