<template>
	<div :class="classes" v-if="isShow">
		<div class="modalBox_mask" @click="handlerMask"></div>
		<div class="modalBox_content">
			<slot></slot>
		</div>
	</div>
</template>

<script lang="ts">
	import {Component, Emit, Prop, Vue, Watch} from "vue-property-decorator";
                                                                  
	@Component
	export default class ModalBox extends Vue {

		@Prop() private visible!: string;

		isShow: boolean = false;
		animateCss: string = '';

		get classes() :string{
			return `modalBox ${this.animateCss} `
		}

		handleClose() :void{
			this.sendCancel('close');
		}

		handlerMask() :void {
			this.sendCancel('mask');
		}
		
		__setVisible__(className = `fadeIn`) {
			this.animateCss = `animated fast ${className}`;
			this.isShow = true;
		}
		__setHidden__(className = `fadeOut`, timer = 200) {
			this.animateCss = `animated fast ${className}`;
			setTimeout(() => {
				this.isShow = false;
			}, timer)
		}

		@Emit('update:visible')
		sendVisible(paylaod: boolean) {}

		@Emit('cancel')
		sendCancel(paylaod: string) {}

		@Watch('visible', {immediate: true})
		visibleWatch(newVal: boolean) {
			if (newVal) {
				this.__setVisible__();
			} else {
				this.__setHidden__();
			}
		}

	}
</script>

<style lang="less">
	.modalBox{
		position: fixed;
		top: 0;
		left: 0;
		z-index: 1;
		width: 100%;
		height: 100%;
		&_mask {
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			background-color: rgba(0,0,0,.7);
		}
		&_content {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 100%;
		}
		&_close {
			width: 50px;
			height: 50px;
			position: absolute;
			bottom: -90px;
			left: 50%;
			transform: translateX(-50%);
			background-image: url('../assets/common/close.png');
			background-size: 100%;
		}
	}
</style>